'use client';
import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { SidebarMenu } from '@/components/layout/sidebar-menu';
import { Button } from '@/components/ui/button';
import { Settings, LifeBuoy, LogOut, School } from 'lucide-react';
import Link from 'next/link';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" side="left" variant="sidebar">
        <SidebarHeader className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors">
            <School className="h-8 w-8 text-sidebar-primary" />
            <h2 className="text-2xl font-semibold group-data-[collapsible=icon]:hidden">EduAttend</h2>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu />
        </SidebarContent>
        <SidebarFooter className="p-2 mt-auto border-t border-sidebar-border">
          <Button variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center">
            <Settings className="h-5 w-5" />
            <span className="group-data-[collapsible=icon]:hidden ml-2">Settings</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center">
            <LifeBuoy className="h-5 w-5" />
            <span className="group-data-[collapsible=icon]:hidden ml-2">Help</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center">
            <LogOut className="h-5 w-5" />
            <span className="group-data-[collapsible=icon]:hidden ml-2">Logout</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
