"use client";

import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ArrowRight, Menu } from "lucide-react";
import { getSession } from "next-auth/react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const HeaderMobile = () => {
  const user = useCurrentUser();
  const [isOpen, setOpen] = useState<boolean>(false);

  const toggleOpen = () => setOpen((prev) => !prev);

  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggleOpen();
    }
  };

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
    <div className="sm:hidden flex items-center">
      <Menu
        onClick={toggleOpen}
        className="relative z-50 h-5 w-5 text-zinc-700"
      />

      {isOpen ? (
        <div className="fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full">
          <ul className="absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pt-20 pb-8">
            {!user ? (
              <>
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/auth/signup")}
                    className="flex items-center w-full font-semibold text-primary"
                    href="/auth/signup"
                  >
                    Get started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/auth/login")}
                    className="flex items-center w-full font-semibold"
                    href="/auth/login"
                  >
                    Sign in
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/pricing")}
                    className="flex items-center w-full font-semibold"
                    href="/pricing"
                  >
                    Pricing
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/dashboard")}
                    className="flex items-center w-full font-semibold"
                    href="/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Button
                    variant="link"
                    onClick={onClick}
                    className="flex items-center w-full font-semibold"
                  >
                    Log out
                  </Button>
                </li>
              </>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
};
