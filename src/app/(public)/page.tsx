"use client";

import Link from "next/link";
import { getSession } from "next-auth/react";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";

import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";

export default function Home() {
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
    <main className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm text-center">
        <div className="flex items-center justify-center gap-4">
          {user ? (
            <>
              <LoginButton>
                <Button className="rounded-full">Dashboard</Button>
              </LoginButton>
              <button onClick={onClick} className="cursor-pointer text-sm">
                Log out
              </button>
            </>
          ) : (
            <>
              <LoginButton className="text-sm">Sign in</LoginButton>
              <Link href="/auth/signup">
                <Button className="rounded-full">Get started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
