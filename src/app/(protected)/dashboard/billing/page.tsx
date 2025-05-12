import { BillingForm } from "@/components/billing/billing-form";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/user";

const BillingPage = async () => {
  const user = await getCurrentUser();
  const subscriptionPlan = await getUserSubscriptionPlan(user?.id as string);

  return (
    <div className="h-full flex flex-col gap-4">
      <BillingForm subscriptionPlan={subscriptionPlan} />
    </div>
  );
};

export default BillingPage;
