
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ListChecks, Edit3, BellPlus, CalendarClock } from 'lucide-react';
import {
  SidebarMenu as Menu,
  SidebarMenuItem as Item,
  SidebarMenuButton as Button,
  SidebarMenuSub as Sub,
  SidebarMenuSubButton as SubButton,
  SidebarMenuSubItem as SubItem,
} from '@/components/ui/sidebar';
import { getMockClassesForTeacher, MOCK_LOGGED_IN_USER } from '@/lib/placeholder-data';

const teacherMenuItems = [
  { href: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/teacher/notifications/create', label: 'Post Notification', icon: BellPlus },
  // More general teacher links can go here
];

// Get classes for the logged-in teacher (assuming MOCK_LOGGED_IN_USER is the teacher)
const teacherClasses = MOCK_LOGGED_IN_USER.role === 'teacher' ? getMockClassesForTeacher(MOCK_LOGGED_IN_USER.id) : [];

const classSpecificPages = [
    { baseHref: '/teacher/attendance', label: 'Manage Attendance', icon: CalendarClock },
    { baseHref: '/teacher/assignments', label: 'Manage Assignments', icon: ListChecks },
    { baseHref: '/teacher/grades', label: 'Manage Grades', icon: Edit3 }, // Maybe per student or per assignment
    // { baseHref: '/teacher/syllabus', label: 'Manage Syllabus', icon: BookOpen }, // Syllabus might be per subject, not class here
];


export function TeacherSidebarMenu() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

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
            {/* Add link to manage syllabus for subjects in this class */}
            {/* This part needs subjects linked to classes more directly, or iterate MOCK_SUBJECTS linked to this class teacher */}
          </Sub>
        </Item>
      ))}
    </Menu>
  );
}
