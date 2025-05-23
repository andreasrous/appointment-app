"use client";

import Image from "next/image";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";

import { SettingsSchema } from "@/schemas";
import { settings } from "@/actions/settings";

import { Loader2, X } from "lucide-react";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";

import { UploadDropzone } from "@/lib/uploadthing";

interface SettingsFormProps {
  onSuccess?: () => void;
}

export const SettingsForm = ({ onSuccess }: SettingsFormProps) => {
  const user = useCurrentUser();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: "",
      newPassword: "",
      role: user?.role || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
      image: user?.image || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    if (values.password === "") {
      values.password = undefined;
    }

    if (values.newPassword === "") {
      values.newPassword = undefined;
    }

    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
            form.reset({
              role: user?.role,
              isTwoFactorEnabled: user?.isTwoFactorEnabled,
            });
          }

          if (data.success) {
            update();
            toast.success(data.success);
            form.resetField("password");
            form.resetField("newPassword");
            onSuccess?.();
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
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="John Doe"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {user?.isOAuth === false && (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="m@example.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="******"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="******"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          {user?.isOAuth === false && (
            <FormField
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-xs">
                  <div className="flex flex-col gap-1.5">
                    <FormLabel>Two Factor Authentication</FormLabel>
                    <FormDescription>
                      Enable two factor authentication for your account
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
          )}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image</FormLabel>
                <FormControl>
                  {field.value ? (
                    <div className="relative size-16">
                      {imageLoading && (
                        <Skeleton className="size-full rounded-full" />
                      )}
                      <Image
                        src={field.value ?? undefined}
                        alt="Profile Image"
                        fill
                        sizes="100vw, 100%"
                        priority
                        onLoad={() => setImageLoading(false)}
                        className={`size-full object-cover rounded-full transition-opacity ${
                          imageLoading ? "opacity-0" : "opacity-100"
                        }`}
                      />
                      <div className="absolute -top-0.5 -right-1.5 size-6 rounded-full bg-background" />
                      <Button
                        onClick={() => field.onChange(null)}
                        variant="destructive"
                        size="icon"
                        type="button"
                        className="absolute -top-0.5 -right-1.5 size-6 rounded-full border-2 border-background"
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
