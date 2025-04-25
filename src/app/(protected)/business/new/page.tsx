import { getCurrentUser } from "@/lib/user";
import { getBusinessByOwnerId } from "@/data/business";
import { BusinessForm } from "@/components/business/business-form";
import { redirect } from "next/navigation";

const NewBusinessPage = async () => {
  const user = await getCurrentUser();
  const business = await getBusinessByOwnerId(user?.id as string);

  if (business) {
    redirect("/business/overview");
  }

  return <BusinessForm business={business} />;
};

export default NewBusinessPage;
