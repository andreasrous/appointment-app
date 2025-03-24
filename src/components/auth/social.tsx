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
    <div className="w-full grid gap-4 sm:grid-cols-2">
      <Button variant="outline" onClick={() => onClick("google")}>
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button variant="outline" onClick={() => onClick("github")}>
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  );
};
