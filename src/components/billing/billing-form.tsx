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
      <Card className="w-full max-w-lg space-y-4 pb-0">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-semibold">
            Subscription Plan
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            You are currently on the{" "}
            <span className="font-semibold text-foreground">
              {subscriptionPlan.name}
            </span>{" "}
            plan.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col md:flex-row md:items-center md:justify-between bg-muted dark:bg-black/40 dark:border-t gap-4 py-4 rounded-b-xl">
          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={isPending}
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {subscriptionPlan.isSubscribed
              ? "Manage Subscription"
              : "Upgrade to PRO"}
          </Button>
          {subscriptionPlan.isSubscribed && (
            <p className="text-sm text-muted-foreground">
              {subscriptionPlan.isCanceled
                ? "Your plan will be canceled on "
                : "Your plan renews on "}
              <span className="font-medium text-foreground">
                {format(subscriptionPlan.stripeCurrentPeriodEnd!, "dd.MM.yyyy")}
              </span>
              .
            </p>
          )}
        </CardFooter>
      </Card>
    </form>
  );
};
