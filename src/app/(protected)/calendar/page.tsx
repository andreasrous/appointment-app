import Calendar from "@/components/calendar/calendar";
import { getAppointmentsByUserId } from "@/data/appointment";
import { getCurrentUser } from "@/lib/user";

const CalendarPage = async () => {
  const user = await getCurrentUser();
  const events = (await getAppointmentsByUserId(user?.id as string)) ?? [];

  return <Calendar initialEvents={events} />;
};

export default CalendarPage;
