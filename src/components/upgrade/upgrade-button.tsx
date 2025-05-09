"use client";

import { userNavigation } from "@/config/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function UpgradeButton() {
  const item = userNavigation.find((item) => item.name === "Upgrade to Pro");

  return (
    <Link href="/pricing">
      <DropdownMenuItem className="cursor-pointer hover:bg-accent">
        {item?.icon && <item.icon />}
        <span className="leading-tight">{item?.name}</span>
      </DropdownMenuItem>
    </Link>
  );
}
