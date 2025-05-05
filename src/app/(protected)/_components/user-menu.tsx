"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ExtendedUser } from "@/types/next-auth";
import { UpgradeButton } from "@/components/upgrade/upgrade-button";
import { SettingsButton } from "@/components/settings/settings-button";
import { BillingButton } from "@/components/billing/billing-button";
import { LogoutButton } from "@/components/auth/logout-button";

interface UserMenuProps {
  user?: ExtendedUser;
}

export function UserMenu({ user }: UserMenuProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar className="h-8 w-8 rounded-full">
          <AvatarImage
            src={user?.image ?? undefined}
            alt={user?.name ?? undefined}
          />
          <AvatarFallback>{user?.name?.substring(0, 1)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={user?.image ?? undefined}
                alt={user?.name ?? undefined}
              />
              <AvatarFallback className="rounded-lg">
                {user?.name?.substring(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user?.name}</span>
              <span className="truncate text-xs">{user?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <UpgradeButton />
          <SettingsButton />
          <BillingButton />
          <DropdownMenuSeparator />
          <LogoutButton />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
