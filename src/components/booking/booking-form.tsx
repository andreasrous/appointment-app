"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { BookingSchema } from "@/schemas";
import { createBooking, getValidTimes } from "@/actions/booking";

import { Availability, Business, Employee, Service } from "@prisma/client";

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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface BookingFormProps {
  business: Business;
  services: Service[];
  availabilities: Availability[];
  employeesByService: Record<string, Employee[]>;
}

export const BookingForm = ({
  business,
  services,
  availabilities,
  employeesByService,
}: BookingFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<Date[]>([]);

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

  const selectedDate = form.watch("date");

  const employeesForSelectedService =
    employeesByService[selectedServiceId] || [];

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId),
    [services, selectedServiceId]
  );

  useEffect(() => {
    const getAvailableTimes = async () => {
      if (!selectedDate) return;
      const freeSlots = await getValidTimes(
        selectedDate,
        business.id,
        selectedService?.duration as number
      );

      setAvailableTimes(freeSlots);
    };

    getAvailableTimes();
  }, [selectedDate, business.id, selectedService?.duration]);

  const isDateUnavailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return true;
    }

    const dayOfWeek = date.getDay();
    const adjustedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const isActive = availabilities[adjustedIndex].isActive;

    if (!isActive) {
      return true;
    }

    return false;
  };

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
            router.push("/booking/success");
          }
        })
        .catch(() => toast.error("Something went wrong!"));
    });
  };

  return (
    <div className="flex w-full h-full flex-1 items-center justify-center">
      <Card className="w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Book your appointment</CardTitle>
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
                <div className="flex gap-4 flex-col sm:flex-row items-start">
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
                                variant="outline"
                                disabled={
                                  isPending ||
                                  !selectedServiceId ||
                                  !form.watch("employeeId")
                                }
                                className={cn(
                                  "w-full flex pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                  "transition-[color,box-shadow]",
                                  "disabled:pointer-events-auto disabled:cursor-not-allowed disabled:hover:bg-background disabled:hover:text-muted-foreground",
                                  "dark:aria-invalid:border-destructive"
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
                              disabled={(date) => isDateUnavailable(date)}
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
                            field.onChange(new Date(value))
                          }
                          defaultValue={field.value?.toISOString()}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue placeholder="Pick a time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              {availableTimes.length > 0 ? (
                                availableTimes.map((time) => (
                                  <SelectItem
                                    key={time.toISOString()}
                                    value={time.toISOString()}
                                  >
                                    {time.toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectLabel>
                                  No free slots available
                                </SelectLabel>
                              )}
                            </SelectGroup>
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
              <div className="flex gap-2 justify-end">
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="size-4 animate-spin" />}
                  {selectedService ? (
                    <span>
                      {selectedService.price.toLocaleString("el-GR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      €
                    </span>
                  ) : (
                    <span>Book</span>
                  )}
                </Button>
                <Link href="/search">
                  <Button
                    variant="destructive"
                    type="button"
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
