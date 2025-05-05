"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";

import { ConversationSchema } from "@/schemas";
import { createConversation } from "@/actions/conversations";
import { Business } from "@prisma/client";

import { CirclePlus, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AddConversationProps {
  businesses: Business[];
}

export const AddConversation = ({ businesses }: AddConversationProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("");

  const form = useForm<z.infer<typeof ConversationSchema>>({
    resolver: zodResolver(ConversationSchema),
    defaultValues: {
      businessId: "",
    },
  });

  const selectedBusiness = businesses.find((b) => b.id === selectedBusinessId);

  const onSubmit = (values: z.infer<typeof ConversationSchema>) => {
    const processedValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        value === "" ? null : value,
      ])
    ) as z.infer<typeof ConversationSchema>;

    startTransition(() => {
      createConversation(processedValues)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }

          if (data.success) {
            toast.success(data.success);
            setOpen(false);
            setTimeout(() => {
              form.reset();
              setSelectedBusinessId("");
            }, 300);
          }
        })
        .catch(() => toast.error("Something went wrong!"));
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setTimeout(() => {
            form.reset();
            setSelectedBusinessId("");
          }, 300);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <CirclePlus />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md gap-6"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Create Conversation</DialogTitle>
          <DialogDescription>
            Add a business and start chatting!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="businessId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedBusinessId(value);
                      }}
                      value={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select business" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {businesses.length > 0 ? (
                            businesses.map((b) => (
                              <SelectItem key={b.id} value={b.id}>
                                {b.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectLabel>No businesses available</SelectLabel>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {selectedBusiness?.email && (
                      <FormDescription>
                        Contact: {selectedBusiness.email}
                      </FormDescription>
                    )}
                    <FormMessage />
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
      </DialogContent>
    </Dialog>
  );
};
