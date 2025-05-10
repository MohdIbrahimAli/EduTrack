
'use client';
import type { ReactNode } from 'react';
import { useContext } from 'react';
import { Bell, Menu, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'; 
import { useRouter } from 'next/navigation';
import { UserRoleContext } from '@/context/UserRoleContext';


interface AppHeaderProps {
  title?: string;
  children?: ReactNode;
}

export function AppHeader({ title, children }: AppHeaderProps) {
  const { isMobile } = useSidebar(); 

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      {isMobile ? (
        <SidebarTrigger className="md:hidden" />
      ) : (
        <SidebarTrigger className="hidden md:flex" /> 
      )}
      
      {title && <h1 className="text-xl font-semibold">{title}</h1>}
      
      <div className="ml-auto flex items-center gap-4">
        {children}
        <Link href="/notifications">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
        </Link>
        <UserMenu />
      </div>
    </header>
  );
}

function UserMenu() {
  const router = useRouter();
  const context = useContext(UserRoleContext);

  if (!context) {
    // This should ideally not happen if context provider is set up correctly
    return <Loader2 className="h-5 w-5 animate-spin" />;
  }
  
  const { currentUser, logout, isLoadingRole } = context;

  if (isLoadingRole) {
    return <Loader2 className="h-5 w-5 animate-spin" />;
  }

  if (!currentUser) {
    // This case might occur if logout happens and header is still trying to render user menu
    // Or if user is not logged in, though layout should redirect.
    // Fallback or redirect logic can be here if needed, but typically layout handles redirection.
    return null; 
  }


  const handleLogout = () => {
    logout();
    router.push('/login-as'); 
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} data-ai-hint={currentUser.dataAiHint || "user avatar"} />
            <AvatarFallback>{currentUser.name ? currentUser.name.substring(0, 1) : 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{currentUser.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
