"use client";

import { AuthGuard } from '@/components/auth-guard';
import { ClientOnly } from '@/components/client-only';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import React from "react";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientOnly>
      <AuthGuard>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "350px",
            } as React.CSSProperties
          }
        >
          <div className="flex min-h-screen w-full">
            {/*<RoleBasedSidebar />*/}
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <main className="flex-1">{children}</main>
              </SidebarInset>
            </SidebarProvider>          
          </div>
        </SidebarProvider>
      </AuthGuard>
    </ClientOnly>
  );
} 