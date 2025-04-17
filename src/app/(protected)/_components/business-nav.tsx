"use client";

import { cn } from "@/lib/utils";
import { NavItem } from "@/config/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface NavBusinessProps {
  items: NavItem[];
}

export function BusinessNav({ items }: NavBusinessProps) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Business</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <Link href={item.href}>
              <SidebarMenuButton
                tooltip={item.name}
                className={cn(
                  "cursor-pointer hover:text-primary dark:hover:text-foreground justify-between",
                  pathname === item.href
                    ? "text-primary bg-primary/10 hover:bg-primary/10 dark:text-foreground dark:bg-primary"
                    : ""
                )}
              >
                <div className="flex items-center gap-2">
                  {item.icon && <item.icon className="size-4" />}
                  <span>{item.name}</span>
                </div>
                <Badge className="bg-primary/10 text-primary dark:bg-purple-200 dark:text-sidebar">
                  PRO
                </Badge>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
