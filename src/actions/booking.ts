"use server";

import { z } from "zod";
import { addMinutes, format, fromUnixTime, isAfter, isBefore } from "date-fns";
import { fromZonedTime, getTimezoneOffset } from "date-fns-tz";
import { GetFreeBusyResponse, NylasResponse } from "nylas";
import { Day } from "@prisma/client";

import { db } from "@/lib/db";
import { nylas } from "@/lib/nylas";
import { stripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/user";

import { BookingSchema } from "@/schemas";
import { getBusinessById } from "@/data/business";

const timeZone = process.env.TIMEZONE!;

export const createBooking = async (values: z.infer<typeof BookingSchema>) => {
  const validatedFields = BookingSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const user = await getCurrentUser();

  if (!user?.id) {
    return { error: "Unauthorized" };
  }

  const {
    serviceId,
    businessId,
    employeeId,
    startTime,
    description,
    paymentIntentId,
  } = validatedFields.data;

  try {
    const service = await db.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return { error: "Service not found." };
    }

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + service.duration);

    const business = await getBusinessById(businessId);

    const businessOwner = await db.user.findUnique({
      where: {
        id: business?.ownerId,
      },
      select: {
        grantId: true,
        grantEmail: true,
      },
    });

    const nylasEvent = await nylas.events.create({
      identifier: businessOwner?.grantId as string,
      requestBody: {
        title: service.name,
        description: description ?? undefined,
        when: {
          startTime: Math.floor(startTime.getTime() / 1000),
          endTime: Math.floor(endTime.getTime() / 1000),
        },
        participants: [
          {
            name: user.name ?? undefined,
            email: user.email!,
            status: "yes",
          },
        ],
      },
      queryParams: {
        calendarId: businessOwner?.grantEmail as string,
        notifyParticipants: true,
      },
    });

    await db.appointment.create({
      data: {
        title: service.name,
        description: description,
        location: business?.address,
        startTime,
        endTime,
        userId: user.id,
        businessId,
        serviceId,
        employeeId,
        calendarEventId: nylasEvent.data.id,
        paymentIntentId,
      },
    });

    return { success: "Appointment booked!" };
  } catch (error) {
    console.error(error);
    return { error: "Failed to book appointment." };
  }
};

export const cancelAppointment = async (id: string) => {
  try {
    const appointment = await db.appointment.findUnique({
      where: { id },
      select: {
        id: true,
        calendarEventId: true,
        paymentIntentId: true,
        business: {
          select: {
            owner: {
              select: {
                grantId: true,
                grantEmail: true,
              },
            },
          },
        },
      },
    });

    if (!appointment) {
      return { error: "Appointment not found." };
    }

    const grantId = appointment.business.owner.grantId as string;
    const grantEmail = appointment.business.owner.grantEmail as string;
    const calendarEventId = appointment.calendarEventId;

    await nylas.events.destroy({
      identifier: grantId,
      eventId: calendarEventId,
      queryParams: {
        calendarId: grantEmail,
        notifyParticipants: true,
      },
    });

    if (appointment.paymentIntentId) {
      await stripe.refunds.create({
        payment_intent: appointment.paymentIntentId,
      });
    }

    await db.appointment.update({
      where: { id },
      data: { status: "CANCELED" },
    });

    return { success: "Appointment canceled." };
  } catch (error) {
    console.error(error);
    return { error: "Failed to cancel appointment." };
  }
};

export const getValidTimes = async (
  selectedDate: Date,
  businessId: string,
  duration: number
) => {
  const offset = getTimezoneOffset(timeZone, selectedDate);
  const adjustedDate = new Date(selectedDate.getTime() + offset);

  const currentDay = format(
    adjustedDate,
    "EEEE"
  ).toUpperCase() as keyof typeof Day;

  const startOfDay = new Date(adjustedDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(adjustedDate);
  endOfDay.setHours(23, 59, 59, 999);

  const data = await db.availability.findFirst({
    where: {
      dayOfWeek: currentDay,
      businessId,
    },
    select: {
      startTime: true,
      endTime: true,
      id: true,
      business: {
        select: {
          owner: {
            select: {
              grantId: true,
              grantEmail: true,
            },
          },
        },
      },
    },
  });

  const grantId = data?.business.owner.grantId as string;
  const grantEmail = data?.business.owner.grantEmail as string;

  const nylasData = await nylas.calendars.getFreeBusy({
    identifier: grantId,
    requestBody: {
      startTime: Math.floor(startOfDay.getTime() / 1000),
      endTime: Math.floor(endOfDay.getTime() / 1000),
      emails: [grantEmail],
    },
  });

  const dbAvailability = {
    startTime: data?.startTime,
    endTime: data?.endTime,
  };

  const freeSlots = getFreeTimeSlots({
    selectedDate: format(adjustedDate, "yyyy-MM-dd"),
    dbAvailability,
    nylasData,
    duration,
  });

  return freeSlots;
};

interface getFreeTimeSlotsProps {
  selectedDate: string;
  dbAvailability: {
    startTime: string | undefined;
    endTime: string | undefined;
  };
  nylasData: NylasResponse<GetFreeBusyResponse[]>;
  duration: number;
}

function getFreeTimeSlots({
  selectedDate,
  dbAvailability,
  nylasData,
  duration,
}: getFreeTimeSlotsProps) {
  const now = new Date();

  const availableFrom = fromZonedTime(
    `${selectedDate} ${dbAvailability.startTime}`,
    timeZone
  );

  const availableTill = fromZonedTime(
    `${selectedDate} ${dbAvailability.endTime}`,
    timeZone
  );

  type MyFreeBusyResponse = {
    email: string;
    object: "free_busy";
    timeSlots: {
      startTime: number;
      endTime: number;
    }[];
  };

  const busySlots = (nylasData.data[0] as MyFreeBusyResponse).timeSlots.map(
    (slot: { startTime: number; endTime: number }) => ({
      start: fromUnixTime(slot.startTime),
      end: fromUnixTime(slot.endTime),
    })
  );

  const allSlots = [];
  let currentSlot = availableFrom;

  while (isBefore(currentSlot, availableTill)) {
    allSlots.push(currentSlot);
    currentSlot = addMinutes(currentSlot, 30);
  }

  const freeSlots = allSlots.filter((slot) => {
    const slotEnd = addMinutes(slot, duration);

    return (
      isAfter(slot, now) &&
      !busySlots.some(
        (busy: { start: Date; end: Date }) =>
          (!isBefore(slot, busy.start) && isBefore(slot, busy.end)) ||
          (isAfter(slotEnd, busy.start) && !isAfter(slotEnd, busy.end)) ||
          (isBefore(slot, busy.start) && isAfter(slotEnd, busy.end))
      )
    );
  });

  return freeSlots;
}
