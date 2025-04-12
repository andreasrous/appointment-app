"use client";

import { logout } from "@/actions/logout";
import { isRedirectError } from "next/dist/client/components/redirect-error";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const onClick = () => {
    logout().catch((error) => {
      if (!isRedirectError(error)) {
        throw error;
      }
    });
  };

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};
