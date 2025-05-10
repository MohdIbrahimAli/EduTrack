
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_LOGGED_IN_USER, getMockClassesForTeacher, MOCK_CHILDREN } from "@/lib/placeholder-data";
import type { SchoolClass, Child } from '@/types';
import { Users, ArrowRight, Edit3, CalendarClock, ListChecks } from 'lucide-react';

export default function TeacherDashboardPage() {
  if (MOCK_LOGGED_IN_USER.role !== 'teacher') {
    return <p>Access Denied. This page is for teachers only.</p>; // Or redirect
  }

  const teacherId = MOCK_LOGGED_IN_USER.id;
  const teacherClasses = getMockClassesForTeacher(teacherId);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {MOCK_LOGGED_IN_USER.name}!</p>
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-primary">My Classes</h2>
      {teacherClasses.length === 0 ? (
        <Card className="shadow-lg rounded-lg">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">You are not currently assigned to any classes.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teacherClasses.map((schoolClass) => (
            <Card key={schoolClass.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
              <CardHeader className="bg-secondary/50 p-4">
                <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
                  <Users className="h-5 w-5"/> {schoolClass.name}
                </CardTitle>
                <CardDescription>
                  {schoolClass.studentIds.length} student(s)
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <h4 className="font-medium mb-2 text-foreground">Actions:</h4>
                <div className="space-y-2">
                    <Link href={`/teacher/attendance/${schoolClass.id}`}>
                        <Button variant="outline" className="w-full justify-start border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                            <CalendarClock className="mr-2 h-4 w-4"/> Manage Attendance
                        </Button>
                    </Link>
                     <Link href={`/teacher/assignments/${schoolClass.id}`}>
                        <Button variant="outline" className="w-full justify-start border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                            <ListChecks className="mr-2 h-4 w-4"/> Manage Assignments
                        </Button>
                    </Link>
                     {/* Add links to manage grades, syllabus etc. */}
                </div>
              </CardContent>
              <CardFooter className="p-4 bg-muted/30">
                <Link href={`/teacher/class/${schoolClass.id}/students`} className="w-full">
                     <Button variant="default" className="w-full">
                        View Students <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-8 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/teacher/notifications/create">
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Post Announcement</Button>
          </Link>
          {/* Add more global teacher quick actions if any */}
        </CardContent>
      </Card>
    </div>
  );
}

