"use client";

import { getUserSubscriptionPlan } from "@/lib/stripe";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useTransition } from "react";
import { createStripeSession } from "@/actions/stripe";

interface BillingFormProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}

export const BillingForm = ({ subscriptionPlan }: BillingFormProps) => {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async () => {
    startTransition(() => {
      createStripeSession().catch(() =>
        toast.error("There was a problem... Please try again in a moment.")
      );
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>
            You are currently on the <strong>{subscriptionPlan.name}</strong>{" "}
            plan.
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
          <Button type="submit">
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {subscriptionPlan.isSubscribed
              ? "Manage Subscription"
              : "Upgrade to PRO"}
          </Button>

          {subscriptionPlan.isSubscribed ? (
            <p className="rounded-full text-xs font-medium">
              {subscriptionPlan.isCanceled
                ? "Your plan will be canceled on "
                : "Your plan renews on"}
              {format(subscriptionPlan.stripeCurrentPeriodEnd!, "dd.MM.yyyy")}.
            </p>
          ) : null}
        </CardFooter>
      </Card>
    </form>
  );
};
