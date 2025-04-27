"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { BookingSchema } from "@/schemas";
import { createBooking } from "@/actions/booking";

import { Business, Employee, Service } from "@prisma/client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Link from "next/link";

interface BookingFormProps {
  business: Business;
  services: Service[];
  employeesByService: Record<string, Employee[]>;
}

export const BookingForm = ({
  business,
  services,
  employeesByService,
}: BookingFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");

  const form = useForm<z.infer<typeof BookingSchema>>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      description: "",
      businessId: business.id,
      startTime: undefined,
      date: undefined,
      serviceId: undefined,
      employeeId: undefined,
    },
  });

  const employeesForSelectedService =
    employeesByService[selectedServiceId] || [];

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId),
    [services, selectedServiceId]
  );

  const formatDate = (date: Date) => {
    const dateFormatter = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
    });
    return dateFormatter.format(date);
  };

  const onSubmit = (values: z.infer<typeof BookingSchema>) => {
    const processedValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        value === "" ? null : value,
      ])
    ) as z.infer<typeof BookingSchema>;

    startTransition(() => {
      createBooking(processedValues)
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

  return (
    <div className="flex w-full h-full flex-1 items-center justify-center">
      <Card className="w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Book an appointment</CardTitle>
          <CardDescription>
            Fill in the form to confirm your appointment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="serviceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service*</FormLabel>
                      <Select
                        disabled={isPending}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedServiceId(value);
                          form.setValue("employeeId", "");
                        }}
                        value={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {services.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {selectedService?.description && (
                        <FormDescription>
                          {selectedService.description}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee*</FormLabel>
                      <Select
                        disabled={isPending || !selectedServiceId}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select an employee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {employeesForSelectedService.map((employee) => (
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4 flex-col sm:flex-row">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Date*</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full flex pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  formatDate(field.value)
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={
                                (date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                // TODO: validTimes
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Time*</FormLabel>
                        <Select
                          disabled={isPending || !form.watch("date")}
                          onValueChange={(value) =>
                            field.onChange(new Date(Date.parse(value)))
                          }
                          defaultValue={field.value?.toISOString()}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue placeholder="Pick a time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>{/* TODO */}</SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value ?? ""}
                          disabled={isPending}
                          placeholder="Optional notes about the appointment"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2 justify-between">
                <Link href="/search">
                  <Button variant="outline" type="button" disabled={isPending}>
                    Cancel
                  </Button>
                </Link>
                <div className="flex gap-2 items-center">
                  {selectedService && (
                    <span>
                      {selectedService.price.toLocaleString("el-GR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      €
                    </span>
                  )}
                  <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="size-4 animate-spin" />}
                    Book
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
