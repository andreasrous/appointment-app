import { db } from "@/lib/db";
import { format } from "date-fns";

export const getAppointmentsByUserId = async (userId: string) => {
  try {
    const appointments = await db.appointment.findMany({
      where: {
        userId,
      },
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
