"use server";

import { z } from "zod";
import { db } from "@/lib/db";

import { revalidatePath } from "next/cache";

import { ServiceSchema } from "@/schemas";
import { getCurrentUser } from "@/lib/user";
import { getBusinessByOwnerId } from "@/data/business";
import { ServiceWithEmployees } from "@/types/next-auth";

export const createService = async (values: z.infer<typeof ServiceSchema>) => {
  const validatedFields = ServiceSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const user = await getCurrentUser();
  const business = await getBusinessByOwnerId(user?.id as string);
  const businessId = business?.id as string;

  const { employeeIds, ...serviceData } = validatedFields.data;

  try {
    const createdService = await db.service.create({
      data: {
        ...serviceData,
        businessId,
        employees: {
          create: employeeIds.map((id) => ({
            employee: { connect: { id } },
          })),
        },
      },
      include: {
        employees: {
          include: {
            employee: true,
          },
        },
      },
    });

    const flattenedService: ServiceWithEmployees = {
      ...createdService,
      employees: createdService.employees.map((e) => e.employee),
    };

    revalidatePath("/business/services");
    return {
      success: "Service created successfully!",
      service: flattenedService,
    };
  } catch {
    return { error: "Failed to create service." };
  }
};

export const updateService = async (values: z.infer<typeof ServiceSchema>) => {
  const validatedFields = ServiceSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const user = await getCurrentUser();
  const business = await getBusinessByOwnerId(user?.id as string);
  const businessId = business?.id as string;

  const { id, employeeIds, ...serviceData } = validatedFields.data;

  try {
    const updatedService = await db.service.update({
      where: { id },
      data: {
        ...serviceData,
        businessId,
        employees: {
          deleteMany: {},
          create: employeeIds.map((id) => ({
            employee: { connect: { id } },
          })),
        },
      },
      include: {
        employees: {
          include: {
            employee: true,
          },
        },
      },
    });

    const flattenedService: ServiceWithEmployees = {
      ...updatedService,
      employees: updatedService.employees.map((e) => e.employee),
    };

    revalidatePath("/business/services");
    return {
      success: "Service updated successfully!",
      service: flattenedService,
    };
  } catch {
    return { error: "Failed to update service." };
  }
};

export const deleteService = async (id: string) => {
  try {
    await db.service.delete({
      where: { id },
    });

    revalidatePath("/business/services");
    return { success: "Service deleted successfully!" };
  } catch {
    return { error: "Failed to delete service." };
  }
};

export async function toggleIsActiveService(id: string, isActive: boolean) {
  try {
    await db.service.update({
      where: { id },
      data: { isActive },
    });

    revalidatePath("/business/services");
    return { success: "Service status updated!" };
  } catch {
    return { error: "Failed to update service status." };
  }
}
