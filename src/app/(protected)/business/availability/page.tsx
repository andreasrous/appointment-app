import * as motion from "motion/react-client";

import { getCurrentUser } from "@/lib/user";
import { getBusinessByOwnerId } from "@/data/business";

import { EmptyState } from "@/components/business/empty-state";
import { AvailabilityForm } from "@/components/business/availability-form";
import { getAvailabilitiesByBusinessId } from "@/data/availability";

const AvailabilityPage = async () => {
  const user = await getCurrentUser();
  const business = await getBusinessByOwnerId(user?.id as string);
  const availabilities = await getAvailabilitiesByBusinessId(
    business?.id as string
  );

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
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
    </motion.div>
  );
};

export default AvailabilityPage;
