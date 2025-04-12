"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Header } from "@/components/auth/header";
import { Social } from "@/components/auth/social";
import { BackButton } from "@/components/auth/back-button";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
  showBackButton,
  onBackClick,
}: CardWrapperProps) => {
  return (
    <Card>
      <CardHeader className="gap-0">
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      {showBackButton && (
        <CardFooter>
          <BackButton
            label={backButtonLabel}
            href={backButtonHref}
            onClick={onBackClick}
          />
        </CardFooter>
      )}
    </Card>
  );
};
