import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import Image from "next/image";

export function SidebarLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          className="data-[slot=sidebar-menu-button]:p-1.5 group-data-[collapsible=icon]:!p-0"
        >
          <Link href="/dashboard" className="h-fit">
            <Image
              src="/logo-dark.svg"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-lg"
              priority
            />
            <span className="truncate text-base font-semibold leading-tight">
              Schedio
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
