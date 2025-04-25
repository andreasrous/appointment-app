"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Employee } from "@prisma/client";

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

interface AddServiceProps {
  employees: Employee[] | null;
}

export function AddService({ employees }: AddServiceProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle />
          Add Service
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg gap-6">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Service</DialogTitle>
          <DialogDescription>
            Fill in the form and create a new service.
          </DialogDescription>
        </DialogHeader>
        <ServiceForm employees={employees} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
