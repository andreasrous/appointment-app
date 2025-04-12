import { SessionProvider } from "next-auth/react";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { auth } from "@/lib/auth";
import { ourFileRouter } from "@/app/api/uploadthing/core";

import { Navbar } from "./_components/navbar";
import { Toaster } from "@/components/ui/sonner";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="min-h-svh w-full flex flex-col gap-y-10 items-center justify-center bg-muted">
        <Navbar />
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        {children}
      </div>
      <Toaster position="top-right" richColors closeButton />
    </SessionProvider>
  );
};

export default ProtectedLayout;
