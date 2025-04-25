"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useTransition } from "react";

import { Availability } from "@prisma/client";
import { AvailabilitySchema } from "@/schemas";
import { updateAvailability } from "@/actions/availability";

import { Loader2 } from "lucide-react";

import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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

import { generateTimeSlots } from "@/lib/times";

interface AvailabilityFormProps {
  availabilities: Availability[] | null;
}

export const AvailabilityForm = ({ availabilities }: AvailabilityFormProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AvailabilitySchema>>({
    resolver: zodResolver(AvailabilitySchema),
    defaultValues: {
      availabilities: availabilities || undefined,
    },
  });

  const capitalizeDay = (day: string) => {
    return day.charAt(0) + day.slice(1).toLowerCase();
  };

  const onSubmit = (values: z.infer<typeof AvailabilitySchema>) => {
    startTransition(() => {
      updateAvailability(values)
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
      <Card className="w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Availability</CardTitle>
          <CardDescription>
            Set your weekly operating hours and availability.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-6">
                {availabilities?.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-start gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <FormField
                        control={form.control}
                        name={`availabilities.${index}.isActive`}
                        render={({ field }) => (
                          <FormItem>
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
                      <span>{capitalizeDay(item.dayOfWeek)}</span>
                    </div>
                    <FormField
                      control={form.control}
                      name={`availabilities.${index}.startTime`}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            disabled={isPending}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl className="w-full">
                              <SelectTrigger>
                                <SelectValue placeholder="From time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                {generateTimeSlots("00:00", "23:30", 60).map(
                                  (slot) => (
                                    <SelectItem key={slot.id} value={slot.time}>
                                      {slot.time}
                                    </SelectItem>
                                  )
                                )}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`availabilities.${index}.endTime`}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            disabled={isPending}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl className="w-full">
                              <SelectTrigger>
                                <SelectValue placeholder="Till time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                {generateTimeSlots("00:00", "23:30", 60).map(
                                  (slot) => (
                                    <SelectItem key={slot.id} value={slot.time}>
                                      {slot.time}
                                    </SelectItem>
                                  )
                                )}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="size-4 animate-spin" />}
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
