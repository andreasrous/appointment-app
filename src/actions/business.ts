"use server";

import { z } from "zod";
import { db } from "@/lib/db";

import { Day } from "@prisma/client";
import { BusinessSchema } from "@/schemas";
import { getCurrentUser } from "@/lib/user";
import { revalidatePath } from "next/cache";

export const createBusiness = async (
  values: z.infer<typeof BusinessSchema>
) => {
  const validatedFields = BusinessSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const user = await getCurrentUser();

  if (!user?.id) {
    return { error: "Unauthorized" };
  }

  const { name, description, email, phone, address, logo } =
    validatedFields.data;

  try {
    const business = await db.business.create({
      data: {
        name,
        description,
        phone,
        email,
        address,
        logo,
        ownerId: user.id,
        availabilities: {
          create: [
            { dayOfWeek: Day.MONDAY, startTime: "08:00", endTime: "18:00" },
            { dayOfWeek: Day.TUESDAY, startTime: "08:00", endTime: "18:00" },
            { dayOfWeek: Day.WEDNESDAY, startTime: "08:00", endTime: "18:00" },
            { dayOfWeek: Day.THURSDAY, startTime: "08:00", endTime: "18:00" },
            { dayOfWeek: Day.FRIDAY, startTime: "08:00", endTime: "18:00" },
            { dayOfWeek: Day.SATURDAY, startTime: "08:00", endTime: "18:00" },
            { dayOfWeek: Day.SUNDAY, startTime: "08:00", endTime: "18:00" },
          ],
        },
      },
    });

    revalidatePath("/business/overview");
    return { success: "Business created successfully!", business };
  } catch {
    return { error: "Failed to create business." };
  }
};

export const updateBusiness = async (
  values: z.infer<typeof BusinessSchema>
) => {
  const validatedFields = BusinessSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const user = await getCurrentUser();

  if (!user?.id) {
    return { error: "Unauthorized" };
  }

  const { name, description, email, phone, address, logo } =
    validatedFields.data;

  try {
    const business = await db.business.update({
      where: { ownerId: user.id },
      data: {
        name,
        description,
        phone,
        email,
        address,
        logo,
      },
    });

    revalidatePath("/business/overview");
    return { success: "Business updated successfully!", business };
  } catch {
    return { error: "Failed to update business." };
  }
};

export const deleteBusiness = async (id: string) => {
  try {
    await db.business.delete({
      where: { id },
    });

    revalidatePath("/business/overview");
    return { success: "Business deleted successfully!" };
  } catch {
    return { error: "Failed to delete business." };
  }
};

export const addToFavorites = async (businessId: string) => {
  const user = await getCurrentUser();

  if (!user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await db.favorite.create({
      data: {
        userId: user.id,
        businessId,
      },
    });

    revalidatePath("/");
    return { success: "Business favorited!" };
  } catch {
    return { error: "Failed to favorite business." };
  }
};

export const removeFromFavorites = async (businessId: string) => {
  const user = await getCurrentUser();

  if (!user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await db.favorite.delete({
      where: {
        userId_businessId: {
          userId: user.id,
          businessId,
        },
      },
    });

    revalidatePath("/");
    return { success: "Business unfavorited!" };
  } catch {
    return { error: "Failed to unfavorite business." };
  }
};
