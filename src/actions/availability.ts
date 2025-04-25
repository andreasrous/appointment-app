"use server";

import { z } from "zod";
import { db } from "@/lib/db";

import { AvailabilitySchema } from "@/schemas";

export const updateAvailability = async (
  values: z.infer<typeof AvailabilitySchema>
) => {
  const validatedFields = AvailabilitySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { availabilities } = validatedFields.data;

  try {
    await db.$transaction(
      availabilities.map((item) =>
        db.availability.update({
          where: {
            id: item.id,
          },
          data: {
            startTime: item.startTime,
            endTime: item.endTime,
            isActive: item.isActive,
          },
        })
      )
    );

    return { success: "Availability updated successfully!" };
  } catch {
    return { error: "Failed to update availability." };
  }
};
