"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { userNavigation } from "@/config/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function BillingButton() {
  const item = userNavigation.find((item) => item.name === "Billing");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="cursor-pointer hover:bg-accent"
          onSelect={(e) => e.preventDefault()}
        >
          {item?.icon && <item.icon />}
          <span>{item?.name}</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-background backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle>Billing</DialogTitle>
          <DialogDescription>Pay now!</DialogDescription>
        </DialogHeader>
        {/* <BillingForm /> */}
      </DialogContent>
    </Dialog>
  );
}
