'use client';

import { useState, useEffect, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getMockChildById, getMockGradeReports, getMockSubjectsForChild, MOCK_SUBJECTS, MOCK_CLASSES, addOrUpdateMockGradeEntry } from '@/lib/placeholder-data';
import type { Child, GradeReportEntry, Subject as SubjectType } from '@/types';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserX, PlusCircle, Edit, BookOpen, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { UserRoleContext } from '@/context/UserRoleContext';


// Updated to use centralized mock data modifier
async function saveGradeEntry(studentId: string, entry: Omit<GradeReportEntry, 'id' | 'issuedBy' | 'studentId'> & { id?: string }, teacherId: string): Promise<GradeReportEntry> {
  console.log('Saving grade entry for student:', studentId, entry);
  const saved = addOrUpdateMockGradeEntry(studentId, entry, teacherId);
  return new Promise(resolve => setTimeout(() => resolve(saved), 300));
}

export default function TeacherManageGradesPage({ params }: { params: { studentId: string } }) {
  const { toast } = useToast();
  const [student, setStudent] = useState<Child | null>(null);
  const [gradeReports, setGradeReports] = useState<GradeReportEntry[]>([]);
  const [studentSubjects, setStudentSubjects] = useState<SubjectType[]>([]);
  const [isLoadingForm, setIsLoadingForm] = useState(false); // Renamed from isLoading
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentGradeEntry, setCurrentGradeEntry] = useState<Partial<GradeReportEntry> | null>(null);

  const context = useContext(UserRoleContext);

  const fetchGradeReports = () => {
    if(student) {
        setGradeReports(getMockGradeReports(student.id));
    }
  };

  useEffect(() => {
    const foundStudent = getMockChildById(params.studentId);
    setStudent(foundStudent || null);
    if (foundStudent) {
      fetchGradeReports(); // Initial fetch
      setStudentSubjects(getMockSubjectsForChild(foundStudent.id));
    }
  }, [params.studentId, student?.id]); // Added student.id to dependency for re-fetch if student changes

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

  if (!student && !context.isLoadingRole) { 
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive"><UserX className="h-4 w-4" /><AlertTitle>Student Not Found</AlertTitle></Alert>
      </div>
    );
  }
  
  if (!student) { 
     return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">Loading student details...</p>
      </div>
    );
  }


  const handleOpenForm = (entry?: GradeReportEntry) => {
    setCurrentGradeEntry(entry || {
      subjectId: studentSubjects[0]?.id || '',
      grade: '',
      teacherFeedback: '',
      term: 'Term 1', 
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentGradeEntry || !currentGradeEntry.subjectId || !currentGradeEntry.grade || !currentGradeEntry.term || !student) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    setIsLoadingForm(true);
    try {
      await saveGradeEntry(student.id, currentGradeEntry as any, currentUser.id);
      fetchGradeReports(); // Re-fetch to update list
      toast({ title: "Success", description: `Grade entry ${currentGradeEntry.id ? 'updated' : 'created'}.` });
      setIsFormOpen(false);
      setCurrentGradeEntry(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save grade entry.", variant: "destructive" });
    } finally {
      setIsLoadingForm(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
           <div className="flex justify-between items-center">
            <div>
                <CardTitle className="text-2xl font-bold text-primary">Manage Grades for {student.name}</CardTitle>
                <CardDescription>Class: {MOCK_CLASSES.find(c => c.id === student.classId)?.name || 'N/A'}</CardDescription>
                <Link href={`/teacher/class/${student.classId}/students`}>
                    <Button variant="link" className="text-accent p-0 mt-1">&larr; Back to Class Roster</Button>
                </Link>
            </div>
            <Button onClick={() => handleOpenForm()} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Grade Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {gradeReports.length === 0 ? (
            <p className="text-muted-foreground">No grade entries found for this student yet.</p>
          ) : (
            <div className="space-y-4">
              {gradeReports.map(entry => {
                const subjectInfo = MOCK_SUBJECTS.find(s => s.id === entry.subjectId);
                return (
                  <Card key={entry.id} className="p-4 bg-muted/10">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><BookOpen className="h-5 w-5"/> {subjectInfo?.name || entry.subjectId} - <span className="text-accent">{entry.grade}</span></h3>
                            <p className="text-sm text-muted-foreground">Term: {entry.term}</p>
                            <p className="text-sm mt-1">{entry.teacherFeedback}</p>
                            <p className="text-xs text-muted-foreground mt-1">Issued by: {currentUser.id === entry.issuedBy ? 'You' : MOCK_SUBJECTS.find(s=>s.teacherId === entry.issuedBy)?.teacherName || 'Another Teacher'}</p>
                        </div>
                        {currentUser.id === entry.issuedBy && (
                           <Button variant="outline" size="sm" onClick={() => handleOpenForm(entry)}><Edit className="mr-1 h-4 w-4" /> Edit</Button>
                        )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleFormSubmit}>
            <DialogHeader>
              <DialogTitle>{currentGradeEntry?.id ? 'Edit' : 'Add'} Grade Entry for {student.name}</DialogTitle>
              <DialogDescription>Fill in the grade details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="subjectId">Subject</Label>
                <Select
                    value={currentGradeEntry?.subjectId || ''}
                    onValueChange={(value) => setCurrentGradeEntry(p => ({ ...p, subjectId: value }))}
                    // required - Handled by form submit validation
                  >
                    <SelectTrigger id="subjectId"><SelectValue placeholder="Select subject" /></SelectTrigger>
                    <SelectContent>
                      {studentSubjects.map(sub => (
                        <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                      ))}
                      {studentSubjects.length === 0 && <SelectItem value="" disabled>No subjects available for this student</SelectItem>}
                    </SelectContent>
                  </Select>
              </div>
              <div>
                <Label htmlFor="grade">Grade</Label>
                <Input id="grade" value={currentGradeEntry?.grade || ''} onChange={(e) => setCurrentGradeEntry(p => ({...p, grade: e.target.value}))} required placeholder="e.g., A, 90%" />
              </div>
               <div>
                <Label htmlFor="term">Term</Label>
                <Input id="term" value={currentGradeEntry?.term || ''} onChange={(e) => setCurrentGradeEntry(p => ({...p, term: e.target.value}))} required placeholder="e.g., Term 1, Q3" />
              </div>
              <div>
                <Label htmlFor="teacherFeedback">Teacher Feedback</Label>
                <Textarea id="teacherFeedback" value={currentGradeEntry?.teacherFeedback || ''} onChange={(e) => setCurrentGradeEntry(p => ({...p, teacherFeedback: e.target.value}))} required />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit" disabled={isLoadingForm}>{isLoadingForm ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Entry'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}