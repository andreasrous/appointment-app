import { getCurrentRole, getCurrentUser } from "@/lib/user";
import { getBusinessByOwnerId } from "@/data/business";
import { BusinessForm } from "@/components/business/business-form";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { RoleGate } from "@/components/auth/role-gate";
import { ProModal } from "@/components/modals/pro-modal";

const NewBusinessPage = async () => {
  const user = await getCurrentUser();
  const role = await getCurrentRole();
  const business = await getBusinessByOwnerId(user?.id as string);

  if (business) {
    redirect("/business/overview");
  }

  return (
    <>
      {role !== UserRole.BUSINESS_OWNER && <ProModal />}
      <RoleGate allowedRole={UserRole.BUSINESS_OWNER}>
        <BusinessForm business={business} />
      </RoleGate>
    </>
  );
};

export default NewBusinessPage;
