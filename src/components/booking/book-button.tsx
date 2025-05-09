"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";

import { Loader2 } from "lucide-react";

interface BookButtonProps {
  selectedService?: {
    price: number;
  };
  isFormValid: boolean;
  formValues: {
    description?: string;
    businessId: string;
    startTime: Date;
    date: Date;
    serviceId: string;
    employeeId: string;
  };
}

export const BookButton = ({
  selectedService,
  isFormValid,
  formValues,
}: BookButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );

  const fetchClientSecret = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formValues,
          startTime: formValues.startTime.toISOString(),
          date: formValues.date.toISOString(),
        }),
      });

      if (!res.ok) {
        toast.error("Failed to initiate payment.");
        return null;
      }

      const data = await res.json();

      if (data?.error || !data.clientSecret) {
        toast.error("Something went wrong!");
        return null;
      }

      setClientSecret(data.clientSecret);
      return data.clientSecret;
    } catch {
      toast.error("Something went wrong!");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [formValues]);

  const options = { fetchClientSecret };

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (isOpen && !clientSecret) {
          fetchClientSecret();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button type="submit" disabled={!isFormValid || isLoading}>
          {isLoading && <Loader2 className="size-4 animate-spin mr-2" />}
          {selectedService ? (
            <span>
              {selectedService.price.toLocaleString("el-GR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              €
            </span>
          ) : (
            <span>Book</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="xl:max-w-6xl overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-semibold leading-tight">Schedio</span>
          </DialogTitle>
          {clientSecret && (
            <EmbeddedCheckoutProvider options={options} stripe={stripePromise}>
              <EmbeddedCheckout className="max-h-[90dvh]" />
            </EmbeddedCheckoutProvider>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
