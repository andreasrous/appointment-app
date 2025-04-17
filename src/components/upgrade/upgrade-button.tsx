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

export function UpgradeButton() {
  const item = userNavigation.find((item) => item.name === "Upgrade to Pro");

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
          <DialogTitle>Upgrade to Pro</DialogTitle>
          <DialogDescription>Upgrade your account now!</DialogDescription>
        </DialogHeader>
        {/* <UpgradeForm /> */}
      </DialogContent>
    </Dialog>
  );
}
