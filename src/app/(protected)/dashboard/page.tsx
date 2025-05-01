import { DataTable } from "@/components/dashboard/data-table";
import { FavoriteBusinesses } from "@/components/dashboard/favorite-businesses";
import { SectionCards } from "@/components/dashboard/section-cards";
import {
  getAppointmentsForTable,
  getCanceledAppointments,
  getCompletedAppointments,
  getConfirmedAppointments,
  getTotalRevenue,
} from "@/data/appointment";
import { getFavoriteBusinesses } from "@/data/business";
import * as motion from "motion/react-client";

const DashboardPage = async () => {
  const totalRevenue = await getTotalRevenue();
  const confirmedAppointments = await getConfirmedAppointments();
  const completedAppointments = await getCompletedAppointments();
  const canceledAppointments = await getCanceledAppointments();
  const favoriteBusinesses = await getFavoriteBusinesses();
  const data = await getAppointmentsForTable();

  return (
    <motion.div
      className="h-full flex flex-col gap-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <SectionCards
        totalRevenue={totalRevenue}
        confirmedAppointments={confirmedAppointments}
        completedAppointments={completedAppointments}
        canceledAppointments={canceledAppointments}
      />
      <FavoriteBusinesses businesses={favoriteBusinesses} />
      <DataTable data={data} />
    </motion.div>
  );
};

export default DashboardPage;
