"use client";

import { logout } from "@/actions/logout";
import { userNavigation } from "@/config/navigation";
import { getSession } from "next-auth/react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export const LogoutButton = () => {
  const item = userNavigation.find((item) => item.name === "Log out");

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
    <DropdownMenuItem
      className="cursor-pointer hover:bg-accent"
      onClick={onClick}
    >
      {item?.icon && <item.icon />}
      <span>{item?.name}</span>
    </DropdownMenuItem>
  );
};
