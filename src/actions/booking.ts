"use server";

import { z } from "zod";
import { db } from "@/lib/db";

import { BookingSchema } from "@/schemas";
import { getCurrentUser } from "@/lib/user";

export const createBooking = async (values: z.infer<typeof BookingSchema>) => {
  const validatedFields = BookingSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const user = await getCurrentUser();

  const { ...appointmentData } = validatedFields.data;

  try {
    // TODO

    return {
      success: "Appointment booked!",
    };
  } catch {
    return { error: "Failed to book appointment." };
  }
};
