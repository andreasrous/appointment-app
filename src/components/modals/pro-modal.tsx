"use client";

import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { UpgradeButton } from "@/components/billing/upgrade-button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export const ProModal = () => {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Promotional Modal</DialogTitle>
        </VisuallyHidden>
        <div className="aspect-video relative flex items-center justify-center">
          <Image src="/hero.jpg" alt="Hero" className="object-cover" fill />
        </div>
        <div className="text-neutral-700 space-y-6 p-6 pt-2">
          <h2 className="font-semibold text-xl">
            Unlock the Full Power of Schedio
          </h2>
          <p className="text-sm font-semibold text-neutral-600">
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
};
