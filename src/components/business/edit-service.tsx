"use client";

import { useState } from "react";

import { Employee } from "@prisma/client";
import { ServiceWithEmployees } from "@/types/next-auth";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ServiceForm } from "@/components/business/service-form";

interface EditServiceProps {
  service: ServiceWithEmployees;
  employees: Employee[] | null;
  disabled?: boolean;
  onUpdate?: (updatedService: ServiceWithEmployees) => void;
}

export function EditService({
  service,
  employees,
  disabled,
  onUpdate,
}: EditServiceProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>Edit Service</Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-lg gap-6"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Service</DialogTitle>
          <DialogDescription>Edit your service details.</DialogDescription>
        </DialogHeader>
        <ServiceForm
          service={service}
          employees={employees}
          onSuccess={(updatedService) => {
            setOpen(false);
            onUpdate?.(updatedService);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
