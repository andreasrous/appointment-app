"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { createStripeSession } from "@/actions/stripe";
import { toast } from "sonner";

export const UpgradeButton = () => {
  const [isPending, startTransition] = useTransition();

  const handleUpgrade = async () => {
    startTransition(() => {
      createStripeSession().catch(() =>
        toast.error("There was a problem... Please try again in a moment.")
      );
    });
  };

  return (
    <Button onClick={handleUpgrade} disabled={isPending} className="w-full">
      {isPending && <Loader2 className="size-4 animate-spin" />}
      Upgrade now <ArrowRight className="h-5 w-5 ml-1.5" />
    </Button>
  );
};
