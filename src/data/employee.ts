import { db } from "@/lib/db";

export const getEmployeeById = async (id: string) => {
  try {
    const employee = await db.employee.findUnique({ where: { id } });
    return employee;
  } catch {
    return null;
  }
};

export const getEmployeesByBusinessId = async (businessId: string) => {
  try {
    const employees = await db.employee.findMany({
      where: { businessId },
      orderBy: { createdAt: "asc" },
    });
    return employees;
  } catch {
    return null;
  }
};

export const getEmployeesByServiceId = async (serviceId: string) => {
  try {
    const employees = await db.employeeService.findMany({
      where: { serviceId },
      include: { employee: true },
      orderBy: {
        employee: {
          createdAt: "asc",
        },
      },
    });
    return employees.map((es) => es.employee);
  } catch {
    return null;
  }
};
