import { db } from "@/lib/db";

export const getServiceById = async (id: string) => {
  try {
    const service = await db.service.findUnique({ where: { id } });
    return service;
  } catch {
    return null;
  }
};

export const getServicesByBusinessId = async (businessId: string) => {
  try {
    const services = await db.service.findMany({
      where: { businessId },
      orderBy: { createdAt: "asc" },
    });
    return services;
  } catch {
    return null;
  }
};

export const getServicesWithEmployeesByBusinessId = async (
  businessId: string
) => {
  try {
    const services = await db.service.findMany({
      where: { businessId },
      orderBy: { createdAt: "asc" },
      include: {
        employees: {
          include: {
            employee: true,
          },
        },
      },
    });

    return services.map((service) => ({
      ...service,
      employees: service.employees.map((es) => es.employee),
    }));
  } catch {
    return null;
  }
};
