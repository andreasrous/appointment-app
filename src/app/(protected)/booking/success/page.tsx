import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const SuccessPage = () => {
  return (
    <div
      className="h-full p-4 sm:p-16"
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
            <div className="size-16 flex items-center justify-center bg-[var(--bg)] dark:bg-[var(--bg-dark)] rounded-full">
              <Check className="size-8 text-[var(--text)] dark:text-[var(--text-dark)]" />
            </div>
            <h1 className="text-2xl text-center font-semibold mt-2">
              Booking Confirmed!
            </h1>
            <p className="text-sm text-muted-foreground text-center mt-1">
              We&apos;ve sent a calendar invitation to your email with all the
              details.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard" className="w-full">
              <Button className="w-full">Close</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SuccessPage;
