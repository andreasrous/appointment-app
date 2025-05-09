import * as motion from "motion/react-client";

import { getCurrentRole, getCurrentUser } from "@/lib/user";

import { getBusinessByOwnerId } from "@/data/business";
import { getEmployeesByBusinessId } from "@/data/employee";
import { getServicesWithEmployeesByBusinessId } from "@/data/service";

import { EmptyState } from "@/components/business/empty-state";
import { ServicesView } from "@/components/business/services-view";
import { UserRole } from "@prisma/client";
import { ProModal } from "@/components/modals/pro-modal";
import { RoleGate } from "@/components/auth/role-gate";

const ServicesPage = async () => {
  const user = await getCurrentUser();
  const role = await getCurrentRole();
  const business = await getBusinessByOwnerId(user?.id as string);
  const services = await getServicesWithEmployeesByBusinessId(
    business?.id as string
  );
  const employees = await getEmployeesByBusinessId(business?.id as string);

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {role !== UserRole.BUSINESS_OWNER && <ProModal />}
      <RoleGate allowedRole={UserRole.BUSINESS_OWNER}>
        {business ? (
          <ServicesView services={services} employees={employees} />
        ) : (
          <EmptyState
            title="Set up your business first"
            description="Before managing your services, please create your business profile"
            buttonText="Create business"
            href="/business/new"
          />
        )}
      </RoleGate>
    </motion.div>
  );
};

export default ServicesPage;
