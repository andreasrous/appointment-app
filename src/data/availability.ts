import { db } from "@/lib/db";

export const getAvailabilityById = async (id: string) => {
  try {
    const availability = await db.availability.findUnique({ where: { id } });
    return availability;
  } catch {
    return null;
  }
};

export const getAvailabilitiesByBusinessId = async (businessId: string) => {
  try {
    const availability = await db.availability.findMany({
      where: { businessId },
    });
    return availability;
  } catch {
    return null;
  }
};
