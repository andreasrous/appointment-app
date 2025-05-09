import * as motion from "motion/react-client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { createBooking } from "@/actions/booking";

interface BookingResultPageProps {
  searchParams: Promise<{ sessionId: string }>;
}

const BookingResultPage = async ({ searchParams }: BookingResultPageProps) => {
  const sessionId = (await searchParams).sessionId;

  if (!sessionId) {
    redirect("/dashboard");
  }

  const getSession = async (sessionId: string) => {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      return session;
    } catch {
      return null;
    }
  };

  const session = await getSession(sessionId as string);

  if (session?.status === "complete" && session.metadata) {
    const { businessId, serviceId, employeeId, startTime, date, description } =
      session.metadata;

    try {
      const result = await createBooking({
        businessId,
        serviceId,
        employeeId,
        startTime: new Date(startTime),
        date: new Date(date),
        description: description || null,
      });

      if (result?.error) {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Failed to create booking:", error);
    }
  }

  return (
    <motion.div
      className="h-full p-4 sm:p-16"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={
        {
          "--bg": "hsl(143,85%,96%)",
          "--text": "hsl(140,100%,27%)",
          "--bg-dark": "hsl(150,100%,6%)",
          "--text-dark": "hsl(150,86%,65%)",
        } as React.CSSProperties
      }
    >
      <div className="flex w-full h-full flex-1 items-center justify-center">
        <Card className="max-w-sm w-full gap-4 mx-auto">
          <CardContent className="w-full flex flex-col items-center">
            <>
              {!session ? (
                <h1 className="text-2xl text-center font-semibold mt-auto">
                  Invalid session!
                </h1>
              ) : session.status === "expired" ? (
                <h1 className="text-2xl text-center font-semibold mt-auto">
                  Your session has expired!
                </h1>
              ) : session.status === "open" ? (
                <h1 className="text-2xl text-center font-semibold mt-auto">
                  Your payment is in progress!
                </h1>
              ) : (
                <>
                  <div className="size-16 flex items-center justify-center bg-[var(--bg)] dark:bg-[var(--bg-dark)] rounded-full">
                    <Check className="size-8 text-[var(--text)] dark:text-[var(--text-dark)]" />
                  </div>
                  <h1 className="text-2xl text-center font-semibold mt-2">
                    Booking Confirmed!
                  </h1>
                  <p className="text-sm text-muted-foreground text-center mt-1">
                    We&apos;ve sent a calendar invitation to your email with all
                    the details.
                  </p>
                </>
              )}
            </>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard" className="w-full">
              <Button className="w-full">Close</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
};

export default BookingResultPage;
