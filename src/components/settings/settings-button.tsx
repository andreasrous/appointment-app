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
import { SettingsForm } from "@/components/settings/settings-form";

export function SettingsButton() {
  const item = userNavigation.find((item) => item.name === "Settings");

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
      <DialogContent
        className="sm:max-w-lg gap-6"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Settings</DialogTitle>
          <DialogDescription>Manage your account settings!</DialogDescription>
        </DialogHeader>
        <SettingsForm />
      </DialogContent>
    </Dialog>
  );
}
