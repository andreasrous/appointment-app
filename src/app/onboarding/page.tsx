import Link from "next/link";
import Image from "next/image";

import { FaSyncAlt } from "react-icons/fa";
import { CalendarCheck2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const OnboardingPage = () => {
  return (
    <div className="flex w-full h-full flex-1 items-center justify-center">
      <Card className="w-lg gap-6 text-center">
        <CardHeader>
          <CardTitle className="text-2xl">You are almost done!</CardTitle>
          <CardDescription>
            Connect your calendar so clients can book when you are free.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 justify-center items-center mb-6">
            <Image
              src="/logo-dark.svg"
              alt="Calendar"
              width={56}
              height={56}
              priority
            />
            <FaSyncAlt className="size-6 text-primary" />
            <Image
              src="/google-calendar.svg"
              alt="Calendar"
              width={56}
              height={56}
              priority
            />
          </div>
          <Link href="/api/auth">
            <Button className="w-full">
              <CalendarCheck2 />
              Connect Calendar
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingPage;
