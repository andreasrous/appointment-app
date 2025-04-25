"use client";

import { useState, useTransition } from "react";

import { Employee } from "@prisma/client";
import { ServiceWithEmployees } from "@/types/next-auth";
import { deleteService, toggleIsActiveService } from "@/actions/service";

import { ClipboardList, Loader2, Trash2 } from "lucide-react";

import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { EditService } from "@/components/business/edit-service";

interface ServiceCardProps {
  initialService: ServiceWithEmployees;
  employees: Employee[] | null;
}

export const ServiceCard = ({
  initialService,
  employees,
}: ServiceCardProps) => {
  const [isDeleting, startDeleteTransition] = useTransition();
  const [service, setService] = useState<ServiceWithEmployees>(initialService);

  const handleDelete = () => {
    startDeleteTransition(() => {
      deleteService(service.id)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }

          if (data.success) {
            toast.success(data.success);
          }
        })
        .catch(() => toast.error("Something went wrong!"));
    });
  };

  const handleToggle = (checked: boolean) => {
    setService((prev) => ({ ...prev, isActive: checked }));

    toggleIsActiveService(service.id, checked)
      .then((data) => {
        if (data.error) {
          setService((prev) => ({ ...prev, isActive: !checked }));
        }
      })
      .catch(() => {
        setService((prev) => ({ ...prev, isActive: !checked }));
        toast.error("Something went wrong!");
      });
  };

  return (
    <div className="relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : (
            <Trash2 />
          )}
        </Button>
      </div>
      <div className="flex items-center gap-4 px-5 py-6">
        <ClipboardList className="size-6 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold truncate">{service.name}</h3>
          <p className="text-sm text-muted-foreground">
            {service.duration} min ·{" "}
            {service.price.toLocaleString("el-GR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            €
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between bg-muted dark:bg-black/40 dark:border-t px-5 py-3">
        <Switch
          checked={service.isActive}
          onCheckedChange={handleToggle}
          disabled={isDeleting}
        />
        <EditService
          service={service}
          employees={employees}
          disabled={isDeleting}
          onUpdate={(s) => setService(s)}
        />
      </div>
    </div>
  );
};
