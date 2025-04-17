"use client";

import { cn } from "@/lib/utils";
import { NavItem } from "@/config/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavMainProps {
  items: NavItem[];
}

export function MainNav({ items }: NavMainProps) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <Link href={item.href}>
                <SidebarMenuButton
                  tooltip={item.name}
                  className={cn(
                    "cursor-pointer hover:text-primary dark:hover:text-foreground",
                    pathname === item.href
                      ? "text-primary bg-primary/10 hover:bg-primary/10 dark:text-foreground dark:bg-primary"
                      : "group-data-[collapsible=icon]:hover:text-foreground"
                  )}
                >
                  {item.icon && <item.icon />}
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
