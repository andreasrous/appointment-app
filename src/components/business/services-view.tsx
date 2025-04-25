import { Employee } from "@prisma/client";
import { ServiceWithEmployees } from "@/types/next-auth";

import { AddService } from "@/components/business/add-service";
import { ServiceCard } from "@/components/business/service-card";

interface ServiceViewProps {
  services: ServiceWithEmployees[] | null;
  employees: Employee[] | null;
}

export const ServicesView = ({ services, employees }: ServiceViewProps) => {
  return (
    <div className="px-4 pt-2 space-y-6">
      <div className="flex items-center justify-between">
        <div className="hidden sm:grid gap-y-1">
          <h1 className="text-3xl font-semibold">Services</h1>
          <p className="text-muted-foreground">
            Create and manage your services right here.
          </p>
        </div>
        <AddService employees={employees} />
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services?.map((item) => (
          <ServiceCard
            initialService={item}
            employees={employees}
            key={item.id}
          />
        ))}
      </div>
    </div>
  );
};
