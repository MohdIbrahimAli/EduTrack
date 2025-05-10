
'use client';

import { useState, useEffect, useContext, use } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MOCK_CLASSES, getMockChildById, addOrUpdateMockAttendanceRecord, ALL_MOCK_ATTENDANCE_RECORDS } from '@/lib/placeholder-data';
import type { Child, AttendanceRecord, SchoolClass } from '@/types';
import { format, parseISO } from 'date-fns';
import { Input as ShadcnInput } from '@/components/ui/input'; // Renamed to avoid conflict
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserX, CalendarDays, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { UserRoleContext } from '@/context/UserRoleContext';

// Mock function to simulate saving attendance - now calls centralized mock data modifier
async function saveAttendanceRecord(childId: string, date: string, status: AttendanceRecord['status'], notes?: string, teacherId?: string): Promise<void> {
  console.log('Saving attendance:', { childId, date, status, notes });
  addOrUpdateMockAttendanceRecord(childId, date, status, notes, teacherId);
  return new Promise(resolve => setTimeout(resolve, 300)); // Simulate async
}


export default function TeacherManageAttendancePage({ params: paramsPromise }: { params: { classId: string } }) {
  const params = use(paramsPromise);
  const { classId } = params;

  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceRecord['status']>>({});
  const [notesData, setNotesData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [schoolClass, setSchoolClass] = useState<SchoolClass | undefined>(undefined);

  const context = useContext(UserRoleContext);

  useEffect(() => {
    if (context && !context.isLoadingRole && context.currentUser && context.currentUser.role === 'teacher') {
      const foundClass = MOCK_CLASSES.find(c => c.id === classId && c.teacherId === context.currentUser!.id);
      setSchoolClass(foundClass);
    }
  }, [context, classId]);


  useEffect(() => {
    if (schoolClass && selectedDate) { // Ensure selectedDate is defined
      const newAttendanceData: Record<string, AttendanceRecord['status']> = {};
      const newNotesData: Record<string, string> = {};

      schoolClass.studentIds.forEach(studentId => {
        const recordForDate = ALL_MOCK_ATTENDANCE_RECORDS.find(
          r => r.childId === studentId && r.date === selectedDate
        );

        if (recordForDate) {
          newAttendanceData[studentId] = recordForDate.status;
          newNotesData[studentId] = recordForDate.notes || '';
        } else {
          // Default to 'Present' if no record exists for the selected date
          newAttendanceData[studentId] = 'Present';
          newNotesData[studentId] = '';
        }
      });

      setAttendanceData(newAttendanceData);
      setNotesData(newNotesData);
    } else if (schoolClass) {
        // If selectedDate is not yet set (e.g., on initial load before date is fully initialized)
        // or if only schoolClass is available, set defaults.
        const defaultAttendance: Record<string, AttendanceRecord['status']> = {};
        schoolClass.studentIds.forEach(id => {
            defaultAttendance[id] = 'Present';
        });
        setAttendanceData(defaultAttendance);
        setNotesData({});
    }
    // If !schoolClass, data will remain empty, which is fine until schoolClass loads.
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
    return <p>Access Denied.</p>; 
  }


  if (!schoolClass && !context.isLoadingRole) { // Check after context loading is complete
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive"><UserX className="h-4 w-4" /><AlertTitle>Class Not Found</AlertTitle><AlertDescription>This class (ID: {classId}) may not exist or you may not have permission to manage it.</AlertDescription></Alert>
        <Link href="/teacher/dashboard" className="mt-4 inline-block">
            <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }
  
  if (!schoolClass) { // Still loading class (context loaded but class not yet set)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">Loading class details...</p>
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
    if(!currentUser) return;
    setIsLoading(true);
    try {
      for (const student of studentsInClass) {
        const status = attendanceData[student.id];
        const notes = notesData[student.id];
        // Ensure status is always defined by defaulting it if somehow missing, though UI should prevent this state.
        const currentStatus = status || 'Present'; 
        await saveAttendanceRecord(student.id, selectedDate, currentStatus, notes, currentUser.id);
      }
      toast({ title: "Success", description: `Attendance for ${selectedDate} submitted.` });
       // After successful submission, refresh local state to reflect any changes made by saveAttendanceRecord
      // (e.g. if saveAttendanceRecord modifies ALL_MOCK_ATTENDANCE_RECORDS which then affects child.absenceCountThisMonth)
      // This re-triggers the useEffect that reads from ALL_MOCK_ATTENDANCE_RECORDS
       setSelectedDate(currentSelectedDate => { // Force re-evaluation of useEffect
         const temp = currentSelectedDate;
         // A tiny delay or change might be needed if state update is too fast
         // but usually, just setting it to itself or a new Date object for the same day works.
         return format(parseISO(temp), 'yyyy-MM-dd'); 
       });


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
            Mark attendance for students on {selectedDate ? format(parseISO(selectedDate), 'MMMM dd, yyyy') : 'N/A'}.
          </CardDescription>
          <Link href="/teacher/dashboard">
            <Button variant="link" className="text-accent p-0">&larr; Back to Dashboard</Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="attendance-date" className="text-foreground font-medium">Select Date</Label>
            <ShadcnInput 
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
                      <ShadcnInput
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
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Submit Attendance'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

