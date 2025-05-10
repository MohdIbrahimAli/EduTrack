'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Bell, MessageSquare, BookOpen, ClipboardList, BarChart3, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SidebarMenu as Menu,
  SidebarMenuItem as Item,
  SidebarMenuButton as Button,
  SidebarMenuSub as Sub,
  SidebarMenuSubButton as SubButton,
  SidebarMenuSubItem as SubItem,
} from '@/components/ui/sidebar';
import { MOCK_CHILDREN } from '@/lib/placeholder-data';


const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/report-absence', label: 'Report Absence', icon: FileText },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
];

const childrenSpecificPages = [
    { baseHref: '/attendance', label: 'Attendance', icon: UserCircle },
    { baseHref: '/syllabus', label: 'Syllabus', icon: BookOpen },
    { baseHref: '/assignments', label: 'Assignments', icon: ClipboardList },
    { baseHref: '/reports', label: 'Progress Reports', icon: BarChart3 },
];


export function SidebarMenu() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Menu>
      {menuItems.map((item) => (
        <Item key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <Button
              variant="ghost"
              className="w-full justify-start"
              isActive={isActive(item.href)}
              tooltip={item.label}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Button>
          </Link>
        </Item>
      ))}

      {MOCK_CHILDREN.map(child => (
        <Item key={child.id}>
           <Button variant="ghost" className="w-full justify-start font-semibold text-sidebar-foreground/80 group-data-[collapsible=icon]:hidden" disabled>
             {child.name}
           </Button>
          <Sub>
            {childrenSpecificPages.map(page => (
              <SubItem key={`${child.id}-${page.baseHref}`}>
                <Link href={`${page.baseHref}/${child.id}`} passHref legacyBehavior>
                  <SubButton
                    size="md"
                    isActive={isActive(`${page.baseHref}/${child.id}`)}
                    className="w-full justify-start"
                  >
                    <page.icon className="h-4 w-4 mr-2" />
                    <span>{page.label}</span>
                  </SubButton>
                </Link>
              </SubItem>
            ))}
          </Sub>
        </Item>
      ))}
    </Menu>
  );
}
