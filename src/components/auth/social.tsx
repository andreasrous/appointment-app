"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/routes";

export const Social = () => {
  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
      <div className="w-full grid gap-4 sm:grid-cols-2">
        <Button variant="outline" onClick={() => onClick("google")}>
          <FcGoogle className="h-5 w-5" />
        </Button>
        <Button variant="outline" onClick={() => onClick("github")}>
          <FaGithub className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
