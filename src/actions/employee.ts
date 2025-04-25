"use server";

import { z } from "zod";
import { db } from "@/lib/db";

import { EmployeeSchema } from "@/schemas";
import { getCurrentUser } from "@/lib/user";
import { getBusinessByOwnerId } from "@/data/business";

export const addEmployee = async (values: z.infer<typeof EmployeeSchema>) => {
  const validatedFields = EmployeeSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const user = await getCurrentUser();
  const business = await getBusinessByOwnerId(user?.id as string);
  const businessId = business?.id as string;

  const { name } = validatedFields.data;

  try {
    const employee = await db.employee.create({
      data: {
        name,
        businessId,
      },
    });

    return {
      id: employee.id,
      name: employee.name,
      success: "Employee added successfully!",
    };
  } catch {
    return { error: "Failed to add employee." };
  }
};

export const deleteEmployee = async (id: string) => {
  try {
    await db.employee.delete({ where: { id } });
    return { success: "Employee deleted successfully!" };
  } catch {
    return { error: "Failed to delete employee." };
  }
};
