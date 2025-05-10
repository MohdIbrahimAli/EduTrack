import type { ReactNode } from 'react';
import { Bell, Menu } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MOCK_USER } from '@/lib/placeholder-data';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'; // Import SidebarTrigger and useSidebar

interface AppHeaderProps {
  title?: string;
  children?: ReactNode;
}

export function AppHeader({ title, children }: AppHeaderProps) {
  const { isMobile } = useSidebar(); // Get isMobile from useSidebar context

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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={MOCK_USER.avatarUrl} alt={MOCK_USER.name} data-ai-hint={MOCK_USER.dataAiHint}/>
            <AvatarFallback>{MOCK_USER.name.substring(0, 1)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{MOCK_USER.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
