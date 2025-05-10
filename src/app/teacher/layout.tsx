
'use client';
import type { ReactNode } from 'react';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppHeader } from '@/components/layout/app-header'; 
import { TeacherSidebarMenu } from '@/components/layout/teacher-sidebar-menu';
import { Button } from '@/components/ui/button';
import { Settings, LifeBuoy, LogOut, School, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { UserRoleContext } from '@/context/UserRoleContext';

export default function TeacherAppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const context = useContext(UserRoleContext);

  useEffect(() => {
    if (context && !context.isLoadingRole) {
      if (!context.currentUser) {
        router.replace('/login-as');
      } else if (context.currentUser.role !== 'teacher') {
        router.replace('/dashboard'); // Or an access denied page
      }
    }
  }, [context, router]);

  if (!context || context.isLoadingRole || !context.currentUser || context.currentUser.role !== 'teacher') {
     return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const { logout } = context;

  const handleLogout = () => {
    logout();
    router.push('/login-as'); 
  };

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
          <Link href="/settings" passHref legacyBehavior>
            <Button asChild variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center">
              <a>
                <Settings className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden ml-2">Settings</span>
              </a>
            </Button>
          </Link>
          <Link href="/help" passHref legacyBehavior>
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
        <AppHeader /> 
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
