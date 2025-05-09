"use client";

import Link from "next/link";
import { getSession } from "next-auth/react";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";

import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";

export const RightNav = () => {
  const user = useCurrentUser();

  const onClick = () => {
    logout().catch(async (error) => {
      if (isRedirectError(error)) {
        await getSession();
      } else {
        throw error;
      }
    });
  };

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <LoginButton>
            <Button className="rounded-full">Dashboard</Button>
          </LoginButton>
          <button onClick={onClick} className="cursor-pointer">
            Log out
          </button>
        </>
      ) : (
        <>
          <LoginButton>Sign in</LoginButton>
          <Link href="/auth/signup">
            <Button className="rounded-full">Get started</Button>
          </Link>
        </>
      )}
    </div>
  );
};
