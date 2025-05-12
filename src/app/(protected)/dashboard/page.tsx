import { RoleGate } from "@/components/auth/role-gate";
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
import { UserRole } from "@prisma/client";

const DashboardPage = async () => {
  const data = await getAppointmentsForTable();
  const totalRevenue = await getTotalRevenue();
  const confirmedAppointments = await getConfirmedAppointments();
  const completedAppointments = await getCompletedAppointments();
  const canceledAppointments = await getCanceledAppointments();
  const favoriteBusinesses = await getFavoriteBusinesses();

  return (
    <div className="h-full flex flex-col gap-4">
      <RoleGate allowedRole={UserRole.BUSINESS_OWNER}>
        <SectionCards
          totalRevenue={totalRevenue}
          confirmedAppointments={confirmedAppointments}
          completedAppointments={completedAppointments}
          canceledAppointments={canceledAppointments}
        />
      </RoleGate>
      <FavoriteBusinesses businesses={favoriteBusinesses} />
      <DataTable data={data} />
    </div>
  );
};

export default DashboardPage;
