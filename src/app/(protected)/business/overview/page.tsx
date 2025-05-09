import * as motion from "motion/react-client";

import { getCurrentRole, getCurrentUser } from "@/lib/user";
import { getBusinessByOwnerId } from "@/data/business";

import { BusinessForm } from "@/components/business/business-form";
import { EmptyState } from "@/components/business/empty-state";
import { RoleGate } from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";
import { ProModal } from "@/components/modals/pro-modal";

const OverviewPage = async () => {
  const user = await getCurrentUser();
  const role = await getCurrentRole();
  const business = await getBusinessByOwnerId(user?.id as string);

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
          <BusinessForm business={business} />
        ) : (
          <EmptyState
            title="You have no business"
            description="Create your business profile to start managing services and appointments"
            buttonText="Create business"
            href="/business/new"
          />
        )}
      </RoleGate>
    </motion.div>
  );
};

export default OverviewPage;
