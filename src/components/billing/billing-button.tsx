"use client";

import { userNavigation } from "@/config/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function BillingButton() {
  const item = userNavigation.find((item) => item.name === "Billing");

  return (
    <Link href="/dashboard/billing">
      <DropdownMenuItem className="cursor-pointer hover:bg-accent">
        {item?.icon && <item.icon />}
        <span className="leading-tight">{item?.name}</span>
      </DropdownMenuItem>
    </Link>
  );
}
