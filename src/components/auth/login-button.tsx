"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from "@/components/auth/login-form";
import { useCurrentUser } from "@/hooks/use-current-user";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  className?: string;
}

export const LoginButton = ({
  children,
  mode = "redirect",
  className,
}: LoginButtonProps) => {
  const user = useCurrentUser();

  if (mode === "modal" && !user) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>{children}</Button>
        </DialogTrigger>
        <DialogContent className="p-0 w-sm bg-transparent border-none">
          <DialogTitle className="sr-only" />
          <DialogDescription className="sr-only" />
          <LoginForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Link href="/auth/login" className={className}>
      {children}
    </Link>
  );
};
