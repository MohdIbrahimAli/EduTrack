
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_CLASSES, MOCK_CHILDREN, getMockChildById } from "@/lib/placeholder-data";
import type { Child, SchoolClass } from '@/types';
import { ArrowRight, BarChart3, ClipboardList, UserX, Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useContext, useState, useEffect } from 'react';
import { UserRoleContext } from '@/context/UserRoleContext';

export default function TeacherClassStudentsPage({ params }: { params: { classId: string } }) {
  const context = useContext(UserRoleContext);
  const [schoolClass, setSchoolClass] = useState<SchoolClass | undefined>(undefined);
  const [studentsInClass, setStudentsInClass] = useState<Child[]>([]);

  useEffect(() => {
    if (context && !context.isLoadingRole && context.currentUser && context.currentUser.role === 'teacher') {
      const foundClass = MOCK_CLASSES.find(c => c.id === params.classId && c.teacherId === context.currentUser!.id);
      setSchoolClass(foundClass);
      if (foundClass) {
        const students = foundClass.studentIds.map(id => getMockChildById(id)).filter(Boolean) as Child[];
        setStudentsInClass(students);
      }
    }
  }, [context, params.classId]);

  if (!context || context.isLoadingRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  const { currentUser } = context;

  if (!currentUser || currentUser.role !== 'teacher') {
    return <p>Access Denied.</p>;
  }

  if (!schoolClass && !context.isLoadingRole) { // Check after loading is complete
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <UserX className="h-4 w-4" />
          <AlertTitle>Class Not Found</AlertTitle>
          <AlertDescription>The class you are trying to access does not exist or you do not have permission to view it.</AlertDescription>
        </Alert>
         <Link href="/teacher/dashboard" className="mt-4 inline-block">
            <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }
  
  if (!schoolClass) { // Still loading class or truly not found after context loaded
     return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">Loading class details...</p>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Students in {schoolClass.name}</h1>
        <Link href="/teacher/dashboard">
          <Button variant="link" className="text-accent p-0">&larr; Back to Dashboard</Button>
        </Link>
      </div>

      {studentsInClass.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No students are currently enrolled in this class.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentsInClass.map((student) => (
            <Card key={student.id} className="shadow-lg rounded-lg overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-4 p-4 bg-secondary/30">
                {student.avatarUrl && (
                  <Image
                    src={student.avatarUrl}
                    alt={student.name}
                    width={50}
                    height={50}
                    className="rounded-full border-2 border-primary"
                    data-ai-hint={student.dataAiHint || "child student"}
                  />
                )}
                <div>
                  <CardTitle className="text-lg font-semibold text-primary">{student.name}</CardTitle>
                  <CardDescription>{student.gradeLevel}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <Link href={`/teacher/grades/${student.id}`}>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="mr-2 h-4 w-4" /> View/Edit Grades
                  </Button>
                </Link>
                <Link href={`/teacher/assignments/student/${student.id}?classId=${schoolClass.id}`}>
                  <Button variant="outline" className="w-full justify-start">
                    <ClipboardList className="mr-2 h-4 w-4" /> View Submissions
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
