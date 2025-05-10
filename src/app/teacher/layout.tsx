
'use client';
import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppHeader } from '@/components/layout/app-header'; // Can reuse or make a TeacherAppHeader
import { TeacherSidebarMenu } from '@/components/layout/teacher-sidebar-menu';
import { Button } from '@/components/ui/button';
import { Settings, LifeBuoy, LogOut, School } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MOCK_LOGGED_IN_USER } from '@/lib/placeholder-data'; // To display user info

export default function TeacherAppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, this would call an auth service to sign out
    // For now, redirect to a conceptual login/home page
    router.push('/'); 
  };

  if (MOCK_LOGGED_IN_USER.role !== 'teacher') {
    // This is a client-side redirect, ideally handled by middleware or page.tsx for SSR
    if (typeof window !== 'undefined') {
      router.replace('/dashboard'); // Redirect non-teachers to parent dashboard
    }
    return <p>Redirecting...</p>; // Or a loading spinner
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" side="left" variant="sidebar">
        <SidebarHeader className="p-4">
          <Link href="/teacher/dashboard" className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors">
            <School className="h-8 w-8 text-sidebar-primary" />
            <h2 className="text-2xl font-semibold group-data-[collapsible=icon]:hidden">EduAttend Teacher</h2>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <TeacherSidebarMenu />
        </SidebarContent>
        <SidebarFooter className="p-2 mt-auto border-t border-sidebar-border">
          <Link href="/settings" passHref legacyBehavior> {/* Shared settings page for now */}
            <Button asChild variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center">
              <a>
                <Settings className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden ml-2">Settings</span>
              </a>
            </Button>
          </Link>
          <Link href="/help" passHref legacyBehavior> {/* Shared help page for now */}
            <Button asChild variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center">
              <a>
                <LifeBuoy className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden ml-2">Help</span>
              </a>
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
            <span className="group-data-[collapsible=icon]:hidden ml-2">Logout</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {/* AppHeader might need context if user info display differs, or pass MOCK_LOGGED_IN_USER */}
        <AppHeader /> 
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

