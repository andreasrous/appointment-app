import { getCurrentRole, getCurrentUser } from "@/lib/user";
import { getBusinessByOwnerId } from "@/data/business";

import { EmptyState } from "@/components/business/empty-state";
import { AvailabilityForm } from "@/components/business/availability-form";
import { getAvailabilitiesByBusinessId } from "@/data/availability";
import { UserRole } from "@prisma/client";
import { ProModal } from "@/components/modals/pro-modal";
import { RoleGate } from "@/components/auth/role-gate";

const AvailabilityPage = async () => {
  const user = await getCurrentUser();
  const role = await getCurrentRole();
  const business = await getBusinessByOwnerId(user?.id as string);
  const availabilities = await getAvailabilitiesByBusinessId(
    business?.id as string
  );

  return (
    <div className="h-full">
      {role !== UserRole.BUSINESS_OWNER && <ProModal />}
      <RoleGate allowedRole={UserRole.BUSINESS_OWNER}>
        {business ? (
          <AvailabilityForm availabilities={availabilities} />
        ) : (
          <EmptyState
            title="Set up your business first"
            description="Before managing your availability, please create your business profile"
            buttonText="Create business"
            href="/business/new"
          />
        )}
      </RoleGate>
    </div>
  );
};

export default AvailabilityPage;
