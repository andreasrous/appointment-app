"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useTransition } from "react";

import { Employee } from "@prisma/client";
import { ServiceSchema } from "@/schemas";
import { createService, updateService } from "@/actions/service";

import { ServiceWithEmployees } from "@/types/next-auth";

import { Loader2 } from "lucide-react";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ServiceFormProps {
  service?: ServiceWithEmployees;
  employees: Employee[] | null;
  onSuccess?: (updatedService: ServiceWithEmployees) => void;
}

export const ServiceForm = ({
  service,
  employees,
  onSuccess,
}: ServiceFormProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ServiceSchema>>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: {
      id: service?.id || undefined,
      name: service?.name || "",
      description: service?.description || "",
      duration: service?.duration || undefined,
      price: service?.price || undefined,
      isActive: service?.isActive || false,
      employeeIds: service?.employees?.map((e) => e.id) || [],
    },
  });

  const onSubmit = (values: z.infer<typeof ServiceSchema>) => {
    const processedValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        value === "" ? null : value,
      ])
    ) as z.infer<typeof ServiceSchema>;

    startTransition(() => {
      const action = service
        ? updateService(processedValues)
        : createService(processedValues);

      action
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }

          if (data.success) {
            toast.success(data.success);
            onSuccess?.(data.service);
          }
        })
        .catch(() => toast.error("Something went wrong!"));
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="My Service"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    disabled={isPending}
                    placeholder="Brief description of your service"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration*</FormLabel>
                <Select
                  disabled={isPending}
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? field.value.toString() : ""}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a duration" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="15">15 mins</SelectItem>
                      <SelectItem value="30">30 mins</SelectItem>
                      <SelectItem value="45">45 mins</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    disabled={isPending}
                    placeholder="Add a price"
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="employeeIds"
            render={() => (
              <FormItem>
                <div className="mb-2">
                  <FormLabel className="text-sm">Employees*</FormLabel>
                  <FormDescription>
                    Select the employees who can perform this service.
                  </FormDescription>
                </div>
                {employees?.map((employee) => (
                  <FormField
                    key={employee.id}
                    control={form.control}
                    name="employeeIds"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={employee.id}
                          className="flex flex-row items-start space-x-2 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              disabled={isPending}
                              checked={field.value?.includes(employee.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      employee.id,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== employee.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {employee.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-xs">
                <div className="flex flex-col gap-1.5">
                  <FormLabel>Active</FormLabel>
                  <FormDescription>
                    Inactive services will not be visible for users to book.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    disabled={isPending}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};
