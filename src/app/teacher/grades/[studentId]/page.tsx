
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MOCK_LOGGED_IN_USER, getMockChildById, getMockGradeReports, getMockSubjectsForChild, MOCK_SUBJECTS } from '@/lib/placeholder-data';
import type { Child, GradeReportEntry, Subject } from '@/types';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserX, PlusCircle, Edit, BookOpen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { format } from 'date-fns';

// Mock function to save grade entry
async function saveGradeEntry(studentId: string, entry: Omit<GradeReportEntry, 'id' | 'issuedBy'> & { id?: string }): Promise<GradeReportEntry> {
  console.log('Saving grade entry for student:', studentId, entry);
  const newId = entry.id || `grade-${Date.now()}`;
  return { ...entry, id: newId, studentId, issuedBy: MOCK_LOGGED_IN_USER.id } as GradeReportEntry;
}

export default function TeacherManageGradesPage({ params }: { params: { studentId: string } }) {
  const { toast } = useToast();
  const [student, setStudent] = useState<Child | null>(null);
  const [gradeReports, setGradeReports] = useState<GradeReportEntry[]>([]);
  const [studentSubjects, setStudentSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentGradeEntry, setCurrentGradeEntry] = useState<Partial<GradeReportEntry> | null>(null);

  useEffect(() => {
    const foundStudent = getMockChildById(params.studentId);
    setStudent(foundStudent || null);
    if (foundStudent) {
      setGradeReports(getMockGradeReports(foundStudent.id));
      setStudentSubjects(getMockSubjectsForChild(foundStudent.id));
    }
  }, [params.studentId]);

  if (MOCK_LOGGED_IN_USER.role !== 'teacher') {
    return <p>Access Denied.</p>;
  }

  if (!student) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive"><UserX className="h-4 w-4" /><AlertTitle>Student Not Found</AlertTitle></Alert>
      </div>
    );
  }

  const handleOpenForm = (entry?: GradeReportEntry) => {
    setCurrentGradeEntry(entry || {
      subjectId: studentSubjects[0]?.id || '',
      grade: '',
      teacherFeedback: '',
      term: 'Term 1', // Default or make selectable
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentGradeEntry || !currentGradeEntry.subjectId || !currentGradeEntry.grade || !currentGradeEntry.term) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const savedEntry = await saveGradeEntry(student.id, currentGradeEntry as any);
      if (currentGradeEntry.id) { // Editing
        setGradeReports(prev => prev.map(g => g.id === savedEntry.id ? savedEntry : g));
        toast({ title: "Success", description: "Grade entry updated." });
      } else { // Creating
        setGradeReports(prev => [...prev, savedEntry]);
        toast({ title: "Success", description: "Grade entry created." });
      }
      setIsFormOpen(false);
      setCurrentGradeEntry(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save grade entry.", variant: "destructive" });
    } finally {
      setIsLoading(false);
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
                const subject = MOCK_SUBJECTS.find(s => s.id === entry.subjectId);
                return (
                  <Card key={entry.id} className="p-4 bg-muted/10">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><BookOpen className="h-5 w-5"/> {subject?.name || 'Unknown Subject'} - <span className="text-accent">{entry.grade}</span></h3>
                            <p className="text-sm text-muted-foreground">Term: {entry.term}</p>
                            <p className="text-sm mt-1">{entry.teacherFeedback}</p>
                            <p className="text-xs text-muted-foreground mt-1">Issued by: {MOCK_LOGGED_IN_USER.id === entry.issuedBy ? 'You' : 'Another Teacher'}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleOpenForm(entry)}><Edit className="mr-1 h-4 w-4" /> Edit</Button>
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
                    required
                  >
                    <SelectTrigger id="subjectId"><SelectValue placeholder="Select subject" /></SelectTrigger>
                    <SelectContent>
                      {studentSubjects.map(sub => (
                        <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                      ))}
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
              <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Entry'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

