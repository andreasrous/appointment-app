"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BackButtonProps {
  href: string;
  label: string;
}

export const BackButton = ({ href, label }: BackButtonProps) => {
  const parts = label.split(/(?<=\?) /);

  return (
    <div className="text-center text-sm w-full">
      {parts.length > 1 ? (
        <>
          <span>{parts[0]}</span>
          <Button
            variant="link"
            className="font-normal pl-1 pr-0 underline underline-offset-4 h-full"
            size="sm"
            asChild
          >
            <Link href={href}>{parts[1]}</Link>
          </Button>
        </>
      ) : (
        <Button variant="link" className="font-normal h-full" size="sm" asChild>
          <Link href={href}>{label}</Link>
        </Button>
      )}
    </div>
  );
};
