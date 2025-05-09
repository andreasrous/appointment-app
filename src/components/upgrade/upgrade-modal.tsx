"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Image from "next/image";
import { useState } from "react";
import { userNavigation } from "@/config/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { UpgradeButton } from "@/components/billing/upgrade-button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function UpgradeModal() {
  const [open, setOpen] = useState(false);
  const item = userNavigation.find((item) => item.name === "Upgrade to Pro");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="cursor-pointer hover:bg-accent"
          onSelect={(e) => e.preventDefault()}
        >
          {item?.icon && <item.icon />}
          <span>{item?.name}</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Promotional Modal</DialogTitle>
        </VisuallyHidden>
        <div className="aspect-video relative flex items-center justify-center">
          <Image src="/hero.jpg" alt="Hero" className="object-cover" fill />
        </div>
        <div className="space-y-6 p-6 pt-2">
          <h2 className="font-semibold text-xl">
            Unlock the Full Power of Schedio
          </h2>
          <p className="text-sm font-semibold">
            Upgrade to Schedio Pro and take control of your business scheduling.
          </p>
          <div className="pl-3">
            <ul className="text-sm list-disc">
              <li>Create and manage your business profile</li>
              <li>Set your availability and services</li>
              <li>Gain insights with real-time analytics</li>
            </ul>
          </div>
          <UpgradeButton />
        </div>
      </DialogContent>
    </Dialog>
  );
}
