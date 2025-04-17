"use client";

import { MainNav } from "./main-nav";
import { BusinessNav } from "./business-nav";
import { SidebarLogo } from "./sidebar-logo";
import { mainNav, businessNav } from "@/config/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <MainNav items={mainNav} />
        <BusinessNav items={businessNav} />
      </SidebarContent>
    </Sidebar>
  );
}
