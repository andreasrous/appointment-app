import * as motion from "motion/react-client";
import { BillingForm } from "@/components/billing/billing-form";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/user";

const BillingPage = async () => {
  const user = await getCurrentUser();
  const subscriptionPlan = await getUserSubscriptionPlan(user?.id as string);

  return (
    <motion.div
      className="h-full flex flex-col gap-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <BillingForm subscriptionPlan={subscriptionPlan} />
    </motion.div>
  );
};

export default BillingPage;
