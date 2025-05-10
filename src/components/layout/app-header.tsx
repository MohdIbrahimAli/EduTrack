
'use client';
import type { ReactNode } from 'react';
import { Bell, Menu } from 'lucide-react';
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
import { MOCK_LOGGED_IN_USER } from '@/lib/placeholder-data'; // Use the dynamic logged-in user
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'; 
import { useRouter } from 'next/navigation';


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
  const user = MOCK_LOGGED_IN_USER; // Use the dynamic logged-in user

  const handleLogout = () => {
    // In a real app, this would call an auth service to sign out
    // For now, redirect to a conceptual login/home page
    router.push('/'); 
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.dataAiHint || "user avatar"} />
            <AvatarFallback>{user.name ? user.name.substring(0, 1) : 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
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

