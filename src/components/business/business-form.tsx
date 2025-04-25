"use client";

import Image from "next/image";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";

import { Business } from "@prisma/client";
import { BusinessSchema } from "@/schemas";
import {
  createBusiness,
  deleteBusiness,
  updateBusiness,
} from "@/actions/business";

import { Loader2, X } from "lucide-react";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { UploadDropzone } from "@/lib/uploadthing";

interface BusinessFormProps {
  business: Business | null;
}

export const BusinessForm = ({ business }: BusinessFormProps) => {
  const user = useCurrentUser();
  const [isPending, startTransition] = useTransition();
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const form = useForm<z.infer<typeof BusinessSchema>>({
    resolver: zodResolver(BusinessSchema),
    defaultValues: {
      name: business?.name || "",
      description: business?.description || "",
      email: business?.email || user?.email || "",
      phone: business?.phone || "",
      address: business?.address || "",
      logo: business?.logo || "",
    },
  });

  useEffect(() => {
    if (business) {
      form.reset({
        name: business.name,
        description: business.description,
        email: business.email,
        phone: business.phone,
        address: business.address,
        logo: business.logo,
      });
    }
  }, [business, form]);

  const handleDelete = (id: string) => {
    setIsDeleting(true);

    startTransition(() => {
      deleteBusiness(id)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
            setIsDeleting(false);
          }

          if (data.success) {
            toast.success(data.success);
          }
        })
        .catch(() => {
          toast.error("Something went wrong!");
          setIsDeleting(false);
        });
    });
  };

  const onSubmit = (values: z.infer<typeof BusinessSchema>) => {
    const processedValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        value === "" ? null : value,
      ])
    ) as z.infer<typeof BusinessSchema>;

    startTransition(() => {
      const action = business
        ? updateBusiness(processedValues)
        : createBusiness(processedValues);

      action
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
          <CardTitle className="text-2xl">
            {business ? "Business Profile" : "Create your business"}
          </CardTitle>
          <CardDescription>
            {business
              ? "Edit your business details below."
              : "Enter your business information to get started!"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business name*</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="My Business"
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
                          placeholder="Brief description of your business"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact email*</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled
                          placeholder="example@yourbusiness.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          disabled={isPending}
                          placeholder="6912345678"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          disabled={isPending}
                          placeholder="Street 123, City, Postal Code"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo</FormLabel>
                      <FormControl>
                        {field.value ? (
                          <div className="relative size-16">
                            {imageLoading && (
                              <Skeleton className="size-full rounded-lg" />
                            )}
                            <Image
                              src={field.value ?? undefined}
                              alt="Logo"
                              fill
                              sizes="100vw, 100%"
                              priority
                              onLoad={() => setImageLoading(false)}
                              className={`size-full object-cover rounded-lg transition-opacity ${
                                imageLoading ? "opacity-0" : "opacity-100"
                              }`}
                            />
                            <div className="absolute -top-1.5 -right-2 size-6 rounded-full bg-background" />
                            <Button
                              onClick={() => field.onChange(null)}
                              variant="destructive"
                              size="icon"
                              type="button"
                              className="absolute -top-1.5 -right-2 size-6 rounded-full border-2 border-background"
                            >
                              <X className="size-3" />
                            </Button>
                          </div>
                        ) : (
                          <UploadDropzone
                            className="ut-button:text-sm font-medium"
                            onClientUploadComplete={(res) => {
                              setImageLoading(true);
                              const imageUrl = res[0].ufsUrl;
                              field.onChange(imageUrl);
                            }}
                            onUploadError={(error) => {
                              console.error("Something went wrong: ", error);
                              setImageLoading(false);
                            }}
                            endpoint="imageUploader"
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="submit" disabled={isPending}>
                  {isPending && !isDeleting && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  Save
                </Button>
                {business && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleDelete(business.id)}
                    disabled={isPending}
                  >
                    {isDeleting && <Loader2 className="size-4 animate-spin" />}
                    Delete
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
