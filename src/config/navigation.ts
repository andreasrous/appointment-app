import {
  LayoutGrid,
  Search,
  CalendarDays,
  MessageSquare,
  Home,
  CalendarCheck,
  ClipboardList,
  Users,
  Sparkles,
  Settings,
  CreditCard,
  LogOut,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export const mainNav: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    name: "Search",
    href: "/search",
    icon: Search,
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: CalendarDays,
  },
  {
    name: "Messages",
    href: "/messages",
    icon: MessageSquare,
  },
];

export const businessNav: NavItem[] = [
  {
    name: "Overview",
    href: `/business/overview`,
    icon: Home,
  },
  {
    name: "Availability",
    href: `/business/availability`,
    icon: CalendarCheck,
  },
  {
    name: "Services",
    href: `/business/services`,
    icon: ClipboardList,
  },
  {
    name: "Team",
    href: `/business/team`,
    icon: Users,
  },
];

export const userNavigation: NavItem[] = [
  {
    name: "Upgrade to Pro",
    href: "/upgrade",
    icon: Sparkles,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    name: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
  {
    name: "Log out",
    href: "/auth/logout",
    icon: LogOut,
  },
];
