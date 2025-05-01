import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { format } from "date-fns";

const autoCompleteAppointments = async (userId: string) => {
  const now = new Date();

  const appointments = await db.appointment.findMany({
    where: {
      status: "CONFIRMED",
      endTime: { lt: now },
      OR: [
        { userId },
        {
          business: {
            ownerId: userId,
          },
        },
      ],
    },
    select: { id: true },
  });

  if (appointments.length > 0) {
    await db.appointment.updateMany({
      where: {
        id: { in: appointments.map((a) => a.id) },
      },
      data: { status: "COMPLETED" },
    });
  }
};

export const getAppointmentsByUserId = async (userId: string) => {
  try {
    await autoCompleteAppointments(userId);

    const appointments = await db.appointment.findMany({
      where: {
        status: { not: "CANCELED" },
        OR: [
          { userId },
          {
            business: {
              ownerId: userId,
            },
          },
        ],
      },
      distinct: ["id"],
    });

    return appointments.map((appointment) => ({
      id: appointment.id,
      title: appointment.title,
      description: appointment.description ?? undefined,
      location: appointment.location ?? undefined,
      start: format(appointment.startTime, "yyyy-MM-dd HH:mm"),
      end: format(appointment.endTime, "yyyy-MM-dd HH:mm"),
    }));
  } catch {
    return null;
  }
};

export const getAppointmentsForTable = async () => {
  const user = await getCurrentUser();

  await autoCompleteAppointments(user?.id as string);

  const appointments = await db.appointment.findMany({
    where: {
      OR: [
        { userId: user?.id },
        {
          business: {
            ownerId: user?.id,
          },
        },
      ],
    },
    distinct: ["id"],
    orderBy: {
      startTime: "asc",
    },
    include: {
      business: true,
      service: true,
      employee: true,
    },
  });

  return appointments.map((appointment) => ({
    id: appointment.id,
    title: appointment.title,
    business: appointment.business.name,
    status:
      appointment.status.charAt(0).toUpperCase() +
      appointment.status.slice(1).toLowerCase(),
    price:
      appointment.service.price.toLocaleString("el-GR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " €",
    date: format(appointment.startTime, "yyyy-MM-dd h:mm a"),
    employee: appointment.employee.name,
  }));
};

export const getConfirmedAppointments = async () => {
  const user = await getCurrentUser();

  const confirmedAppointments = await db.appointment.count({
    where: {
      status: "CONFIRMED",
      business: {
        ownerId: user?.id,
      },
    },
  });
  return confirmedAppointments;
};

export const getCompletedAppointments = async () => {
  const user = await getCurrentUser();

  const completedAppointments = await db.appointment.count({
    where: {
      status: "COMPLETED",
      business: {
        ownerId: user?.id,
      },
    },
  });
  return completedAppointments;
};

export const getCanceledAppointments = async () => {
  const user = await getCurrentUser();

  const canceledAppointments = await db.appointment.count({
    where: {
      status: "CANCELED",
      business: {
        ownerId: user?.id,
      },
    },
  });

  return canceledAppointments;
};

export const getTotalRevenue = async () => {
  const user = await getCurrentUser();

  const appointments = await db.appointment.findMany({
    where: {
      status: { not: "CANCELED" },
      business: {
        ownerId: user?.id,
      },
    },
    select: {
      service: {
        select: {
          price: true,
        },
      },
    },
  });

  const totalRevenue = appointments.reduce((sum, appointment) => {
    return sum + appointment.service.price;
  }, 0);

  return totalRevenue;
};
