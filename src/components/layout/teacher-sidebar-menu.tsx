
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ListChecks, Edit3, BellPlus, CalendarClock, Loader2 } from 'lucide-react';
import {
  SidebarMenu as Menu,
  SidebarMenuItem as Item,
  SidebarMenuButton as Button,
  SidebarMenuSub as Sub,
  SidebarMenuSubButton as SubButton,
  SidebarMenuSubItem as SubItem,
} from '@/components/ui/sidebar';
import { getMockClassesForTeacher } from '@/lib/placeholder-data';
import { useContext, useState, useEffect } from 'react';
import { UserRoleContext } from '@/context/UserRoleContext';
import type { SchoolClass } from '@/types';

const teacherMenuItems = [
  { href: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/teacher/notifications/create', label: 'Post Notification', icon: BellPlus },
];

const classSpecificPages = [
    { baseHref: '/teacher/attendance', label: 'Manage Attendance', icon: CalendarClock },
    { baseHref: '/teacher/assignments', label: 'Manage Assignments', icon: ListChecks },
    // For grades, navigate to class students page first, then to individual student grades.
    // { baseHref: '/teacher/grades', label: 'Manage Grades', icon: Edit3 }, 
];


export function TeacherSidebarMenu() {
  const pathname = usePathname();
  const context = useContext(UserRoleContext);
  const [teacherClasses, setTeacherClasses] = useState<SchoolClass[]>([]);

  useEffect(() => {
    if (context && !context.isLoadingRole && context.currentUser?.role === 'teacher') {
      setTeacherClasses(getMockClassesForTeacher(context.currentUser.id));
    }
  }, [context]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  if (!context || context.isLoadingRole) {
    return (
      <div className="p-4 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-sidebar-foreground" />
      </div>
    );
  }

  if (context.currentUser?.role !== 'teacher') {
    return null; // Or some other UI if a non-teacher views this somehow
  }

  return (
    <Menu>
      {teacherMenuItems.map((item) => (
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

      {teacherClasses.map(schoolClass => (
        <Item key={schoolClass.id}>
           <Button variant="ghost" className="w-full justify-start font-semibold text-sidebar-foreground/80 group-data-[collapsible=icon]:hidden" disabled>
             {schoolClass.name}
           </Button>
          <Sub>
            <SubItem key={`${schoolClass.id}-students`}>
                <Link href={`/teacher/class/${schoolClass.id}/students`} passHref legacyBehavior>
                    <SubButton
                    size="md"
                    isActive={isActive(`/teacher/class/${schoolClass.id}/students`)}
                    className="w-full justify-start"
                    >
                    <Users className="h-4 w-4 mr-2" />
                    <span>View Students</span>
                    </SubButton>
                </Link>
            </SubItem>
            {classSpecificPages.map(page => (
              <SubItem key={`${schoolClass.id}-${page.baseHref}`}>
                <Link href={`${page.baseHref}/${schoolClass.id}`} passHref legacyBehavior>
                  <SubButton
                    size="md"
                    isActive={isActive(`${page.baseHref}/${schoolClass.id}`)}
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
