import * as motion from "motion/react-client";

import { getCurrentUser } from "@/lib/user";
import { getBusinessByOwnerId } from "@/data/business";
import { getEmployeesByBusinessId } from "@/data/employee";

import { EmptyState } from "@/components/business/empty-state";
import { TeamForm } from "@/components/business/team-form";

const TeamPage = async () => {
  const user = await getCurrentUser();
  const business = await getBusinessByOwnerId(user?.id as string);
  const employees = await getEmployeesByBusinessId(business?.id as string);

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {business ? (
        <TeamForm employees={employees} />
      ) : (
        <EmptyState
          title="Set up your business first"
          description="Before managing your team, please create your business profile"
          buttonText="Create business"
          href="/business/new"
        />
      )}
    </motion.div>
  );
};

export default TeamPage;
