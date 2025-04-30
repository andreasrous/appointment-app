"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { LoginSchema } from "@/schemas";
import { login } from "@/actions/login";

import { FormError } from "@/components/form/form-error";
import { FormSuccess } from "@/components/form/form-success";
import { CardWrapper } from "@/components/auth/card-wrapper";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/routes";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email in use with another provider!"
      : "";

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            if (showTwoFactor) {
              form.resetField("code");
            } else {
              form.resetField("password");
            }
            setError(data.error);
          }

          if (data?.success) {
            setSuccess(data.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(async (error) => {
          if (isRedirectError(error)) {
            router.refresh();
            await getSession();
          } else {
            setError("Something went wrong!");
          }
        });
    });
  };

  return (
    <CardWrapper
      headerLabel={
        showTwoFactor
          ? "We've sent a 6-digit code to your email. Enter it below to continue."
          : "Welcome back"
      }
      backButtonLabel={
        showTwoFactor ? "Back to login" : "Don't have an account? Sign up"
      }
      backButtonHref="/auth/signup"
      showSocial={!showTwoFactor}
      showBackButton
      isPending={isPending}
      onBackClick={showTwoFactor ? () => setShowTwoFactor(false) : undefined}
      onSocialClick={(provider) => {
        setError("");
        setSuccess("");

        startTransition(async () => {
          await signIn(provider, {
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
          });
        });
      }}
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <InputOTP
                        {...field}
                        disabled={isPending}
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
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
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <Button
                          size="sm"
                          variant="link"
                          asChild
                          className="font-normal ml-auto inline-block text-sm p-0 h-full"
                        >
                          <Link href="/auth/reset">Forgot your password?</Link>
                        </Button>
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
