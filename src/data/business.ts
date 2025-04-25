import { db } from "@/lib/db";

export const getBusinessById = async (id: string) => {
  try {
    const business = await db.business.findUnique({ where: { id } });
    return business;
  } catch {
    return null;
  }
};

export const getBusinessByOwnerId = async (ownerId: string) => {
  try {
    const business = await db.business.findUnique({ where: { ownerId } });
    return business;
  } catch {
    return null;
  }
};
