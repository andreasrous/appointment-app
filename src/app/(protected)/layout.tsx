import { AppSidebar } from "@/app/(protected)/_components/app-sidebar";
import { SiteHeader } from "@/app/(protected)/_components/site-header";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { Toaster } from "@/components/ui/sonner";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-screen flex-col">
            <SiteHeader />
            <div className="flex flex-1 flex-col overflow-auto gap-4 p-4 bg-muted dark:bg-background">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster richColors />
    </ThemeProvider>
  );
};

export default ProtectedLayout;
