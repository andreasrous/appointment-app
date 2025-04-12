"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  href: string;
  label: string;
  onClick?: () => void;
}

export const BackButton = ({ href, label, onClick }: BackButtonProps) => {
  const parts = label.split(/(?<=\?) /);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

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
            <Link href={href} onClick={handleClick}>
              {parts[1]}
            </Link>
          </Button>
        </>
      ) : (
        <Button
          variant="link"
          className="font-normal h-full"
          size="sm"
          asChild
        >
          <Link href={href} onClick={handleClick}>
            {label}
          </Link>
        </Button>
      )}
    </div>
  );
};
