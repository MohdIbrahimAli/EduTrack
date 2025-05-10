
'use client';

import { useState, useEffect, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MOCK_CLASSES, getMockChildById } from '@/lib/placeholder-data';
import type { Child, AttendanceRecord } from '@/types';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserX, CalendarDays, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { UserRoleContext } from '@/context/UserRoleContext';

// Mock function to simulate saving attendance
async function saveAttendanceRecord(childId: string, date: string, status: AttendanceRecord['status'], notes?: string): Promise<void> {
  console.log('Saving attendance:', { childId, date, status, notes });
  // In a real app, this would interact with Firestore
  return new Promise(resolve => setTimeout(resolve, 500));
}


export default function TeacherManageAttendancePage({ params }: { params: { classId: string } }) {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceRecord['status']>>({});
  const [notesData, setNotesData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [schoolClass, setSchoolClass] = useState<SchoolClass | undefined>(undefined);

  const context = useContext(UserRoleContext);

  useEffect(() => {
    if (context && !context.isLoadingRole && context.currentUser && context.currentUser.role === 'teacher') {
      const foundClass = MOCK_CLASSES.find(c => c.id === params.classId && c.teacherId === context.currentUser!.id);
      setSchoolClass(foundClass);
    }
  }, [context, params.classId]);


  useEffect(() => {
    // Here you would typically fetch existing attendance records for the selectedDate and class
    // For now, we start fresh each time or load mock data.
    if (schoolClass) {
      const initialAttendance: Record<string, AttendanceRecord['status']> = {};
      schoolClass.studentIds.forEach(id => initialAttendance[id] = 'Present'); // Default to present
      setAttendanceData(initialAttendance);
      setNotesData({});
    }
  }, [selectedDate, schoolClass]);

  if (!context || context.isLoadingRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const { currentUser } = context;

  if (!currentUser || currentUser.role !== 'teacher') {
    // Fallback, though layout should handle this
    return <p>Access Denied.</p>; 
  }


  if (!schoolClass) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive"><UserX className="h-4 w-4" /><AlertTitle>Class Not Found</AlertTitle><AlertDescription>This class may not exist or you may not have permission to manage it.</AlertDescription></Alert>
      </div>
    );
  }

  const studentsInClass = schoolClass.studentIds.map(id => getMockChildById(id)).filter(Boolean) as Child[];

  const handleStatusChange = (childId: string, status: AttendanceRecord['status']) => {
    setAttendanceData(prev => ({ ...prev, [childId]: status }));
  };

  const handleNotesChange = (childId: string, note: string) => {
    setNotesData(prev => ({ ...prev, [childId]: note }));
  };

  const handleSubmitAttendance = async () => {
    setIsLoading(true);
    try {
      for (const student of studentsInClass) {
        const status = attendanceData[student.id];
        const notes = notesData[student.id];
        if (status) { // Only save if a status is set
          await saveAttendanceRecord(student.id, selectedDate, status, notes);
        }
      }
      toast({ title: "Success", description: `Attendance for ${selectedDate} submitted.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit attendance.", variant: "destructive" });
      console.error("Failed to submit attendance", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Manage Attendance for {schoolClass.name}</CardTitle>
          <CardDescription>
            Mark attendance for students on {format(new Date(selectedDate.replace(/-/g, '/')), 'MMMM dd, yyyy')}.
          </CardDescription>
          <Link href="/teacher/dashboard">
            <Button variant="link" className="text-accent p-0">&larr; Back to Dashboard</Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="attendance-date" className="text-foreground font-medium">Select Date</Label>
            <Input 
              type="date" 
              id="attendance-date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1"
            />
          </div>

          {studentsInClass.length === 0 ? (
            <p className="text-muted-foreground">No students in this class.</p>
          ) : (
            <div className="space-y-4">
              {studentsInClass.map(student => (
                <Card key={student.id} className="p-4 bg-muted/30">
                  <Label className="font-semibold text-lg text-primary">{student.name}</Label>
                  <RadioGroup
                    value={attendanceData[student.id] || 'Present'}
                    onValueChange={(value) => handleStatusChange(student.id, value as AttendanceRecord['status'])}
                    className="flex flex-wrap gap-4 mt-2 mb-2"
                  >
                    {(['Present', 'Absent', 'Late', 'Excused'] as AttendanceRecord['status'][]).map(statusOption => (
                      <div key={statusOption} className="flex items-center space-x-2">
                        <RadioGroupItem value={statusOption} id={`${student.id}-${statusOption}`} />
                        <Label htmlFor={`${student.id}-${statusOption}`}>{statusOption}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                  { (attendanceData[student.id] === 'Late' || attendanceData[student.id] === 'Absent' || attendanceData[student.id] === 'Excused') && (
                    <div>
                      <Label htmlFor={`notes-${student.id}`} className="text-sm text-muted-foreground">Notes (Optional)</Label>
                      <Input
                        id={`notes-${student.id}`}
                        value={notesData[student.id] || ''}
                        onChange={(e) => handleNotesChange(student.id, e.target.value)}
                        placeholder="e.g., Arrived at 9:15 AM, Doctor's note provided"
                        className="mt-1 text-sm"
                      />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmitAttendance} disabled={isLoading || studentsInClass.length === 0} className="w-full sm:w-auto">
            {isLoading ? 'Submitting...' : 'Submit Attendance'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Basic Input component if not already globally available or for simplicity
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`block w-full rounded-md border-input bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 ${props.className}`} />;
}

type SchoolClass = import('@/types').SchoolClass;

