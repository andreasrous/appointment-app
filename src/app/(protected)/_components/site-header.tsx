"use client";

import React from "react";

import { UserMenu } from "./user-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function formatSegment(segment: string): string {
  const isId = /^[a-f\d]{24}$|^[\w-]{36}$|^c[a-z0-9]{24}$/i.test(segment);

  if (isId) return "";

  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function SiteHeader() {
  const user = useCurrentUser();
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbSegments = segments
    .map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const label = formatSegment(segment);
      return label ? { href, label } : null;
    })
    .filter(Boolean) as { href: string; label: string }[];

  const breadcrumbItems = breadcrumbSegments.map((segment, index) => {
    const isLast = index === breadcrumbSegments.length - 1;
    return (
      <React.Fragment key={segment.href}>
        <BreadcrumbItem>
          {isLast ? (
            <BreadcrumbPage>{segment.label}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink href={segment.href}>{segment.label}</BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {!isLast && <BreadcrumbSeparator />}
      </React.Fragment>
    );
  });

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-sidebar dark:bg-background transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-4 px-4">
        <ThemeToggle />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
