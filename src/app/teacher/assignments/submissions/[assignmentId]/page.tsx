
'use client';

import { useState, useEffect, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_CLASSES, getMockChildById, getMockAssignmentsForClass, getMockAssignmentSubmissionsForAssignment, MOCK_SUBJECTS, MOCK_ASSIGNMENT_SUBMISSIONS } from '@/lib/placeholder-data';
import type { SchoolClass, Assignment, AssignmentSubmission, Child } from '@/types';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserX, CheckCircle, XCircle, Edit, Send, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

// Mock function to save grade/feedback
async function saveGradeAndFeedback(submissionId: string, grade: string, feedback: string, teacherId: string): Promise<AssignmentSubmission> {
  console.log("Saving grade/feedback for submission:", submissionId, { grade, feedback, teacherId });
  
  const existingSubmissionIndex = MOCK_ASSIGNMENT_SUBMISSIONS.findIndex(s => s.id === submissionId);
  
  if (existingSubmissionIndex !== -1) {
    const updatedSubmission = { 
        ...MOCK_ASSIGNMENT_SUBMISSIONS[existingSubmissionIndex], 
        grade, 
        feedback,
        // gradedBy: teacherId // Optionally track who graded
    };
    MOCK_ASSIGNMENT_SUBMISSIONS[existingSubmissionIndex] = updatedSubmission;
    return updatedSubmission;
  } else {
    // This case handles if a teacher is grading a non-existent submission (e.g. for offline work)
    // This requires more fields like studentId, assignmentId if creating new.
    // For this example, we assume submission always exists if currentGradingSubmission.id is not new.
    // If creating a new submission entry through grading:
    // const newSubmission = { id: submissionId, assignmentId: ..., studentId: ..., grade, feedback, isSubmitted: false, gradedBy: teacherId };
    // MOCK_ASSIGNMENT_SUBMISSIONS.push(newSubmission);
    // return newSubmission;
    throw new Error("Original submission not found for update, and new submission creation via grading is not fully implemented in mock.");
  }
}


export default function TeacherViewSubmissionsPage({ params }: { params: { assignmentId: string } }) {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [students, setStudents] = useState<Child[]>([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isGradingFormOpen, setIsGradingFormOpen] = useState(false);
  const [currentGradingSubmission, setCurrentGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [currentGrade, setCurrentGrade] = useState('');
  const [currentFeedback, setCurrentFeedback] = useState('');
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  const [schoolClass, setSchoolClass] = useState<SchoolClass | undefined>(undefined);
  const context = useContext(UserRoleContext);


  useEffect(() => {
    if (context && !context.isLoadingRole && context.currentUser?.role === 'teacher' && classId) {
      const foundClass = MOCK_CLASSES.find(c => c.id === classId && c.teacherId === context.currentUser!.id);
      setSchoolClass(foundClass);
      if (foundClass) {
        const foundAssignment = getMockAssignmentsForClass(foundClass.id).find(a => a.id === params.assignmentId);
        setAssignment(foundAssignment || null);
        if (foundAssignment) {
          setSubmissions(getMockAssignmentSubmissionsForAssignment(foundAssignment.id));
          const classStudents = foundClass.studentIds.map(id => getMockChildById(id)).filter(Boolean) as Child[];
          setStudents(classStudents);
        }
      }
      setIsLoadingPage(false);
    } else if (context && !context.isLoadingRole) {
      setIsLoadingPage(false); // Not a teacher or no user or no classId
    }
  }, [context, params.assignmentId, classId]);

  if (!context || context.isLoadingRole || isLoadingPage) {
     return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  const { currentUser } = context;

  if (!currentUser || currentUser.role !== 'teacher') return <p>Access Denied.</p>;
  if (!schoolClass) return <div className="container mx-auto py-8"><Alert variant="destructive"><UserX className="h-4 w-4" /><AlertTitle>Class Not Found</AlertTitle><AlertDescription>Ensure you are accessing submissions via a valid class link.</AlertDescription></Alert></div>;
  if (!assignment) return <div className="container mx-auto py-8"><Alert variant="destructive"><UserX className="h-4 w-4" /><AlertTitle>Assignment Not Found</AlertTitle></Alert></div>;

  const subject = MOCK_SUBJECTS.find(s => s.id === assignment.subjectId);

  const handleOpenGradingForm = (submission: AssignmentSubmission | null, studentId: string) => {
    const student = getMockChildById(studentId);
    if (!student) return;

    if (submission) {
        setCurrentGradingSubmission(submission);
        setCurrentGrade(submission.grade || '');
        setCurrentFeedback(submission.feedback || '');
    } else { 
        // Create a temporary submission object for grading if one doesn't exist
        // This is for cases where teacher wants to input a grade for unsubmitted/offline work
        const tempSubmission: AssignmentSubmission = { 
          id: `temp-${studentId}-${assignment.id}-${Date.now()}`, // Ensure unique temp ID
          assignmentId: assignment.id, 
          studentId, 
          isSubmitted: false 
        };
        setCurrentGradingSubmission(tempSubmission);
        setCurrentGrade('');
        setCurrentFeedback('');
    }
    setIsGradingFormOpen(true);
  };

  const handleGradeSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentGradingSubmission || !currentUser) return;
    setIsLoadingForm(true);
    try {
        const updatedSubmission = await saveGradeAndFeedback(currentGradingSubmission.id, currentGrade, currentFeedback, currentUser.id);
        setSubmissions(prev => {
            const existingIndex = prev.findIndex(s => s.studentId === updatedSubmission.studentId); // Match by studentId if temp ID was used
            if(existingIndex !== -1) {
                const newSubmissions = [...prev];
                newSubmissions[existingIndex] = updatedSubmission;
                return newSubmissions;
            }
            // If it was a truly new grading entry for unsubmitted work, and mock save creates it.
            // This depends on how saveGradeAndFeedback handles new IDs.
            // For this mock, we'll assume it updates or adds to MOCK_ASSIGNMENT_SUBMISSIONS.
            // Then, re-fetch or update local state accurately.
            // A simpler mock update:
            const found = MOCK_ASSIGNMENT_SUBMISSIONS.find(s => s.id === updatedSubmission.id);
            if (found) return prev.map(s => s.id === updatedSubmission.id ? updatedSubmission : s);
            return [...prev, updatedSubmission]; 
        });
        toast({ title: "Success", description: "Grade and feedback saved." });
        setIsGradingFormOpen(false);
    } catch (error: any) {
        toast({ title: "Error", description: error.message || "Failed to save grade/feedback.", variant: "destructive" });
    } finally {
        setIsLoadingForm(false);
    }
  };


  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Submissions for: {assignment.title}</CardTitle>
          <CardDescription>Class: {schoolClass.name} | Subject: {subject?.name || 'N/A'} | Due: {format(new Date(assignment.dueDate.replace(/-/g, '/')), 'MMMM dd, yyyy')}</CardDescription>
          <Link href={`/teacher/assignments/${schoolClass.id}`}>
            <Button variant="link" className="text-accent p-0 mt-1">&larr; Back to Assignments for {schoolClass.name}</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-muted-foreground">No students in this class to display submissions for.</p>
          ) : (
            <div className="space-y-4">
              {students.map(student => {
                const submission = submissions.find(s => s.studentId === student.id);
                return (
                  <Card key={student.id} className="p-4 bg-muted/20">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                      <div className="flex items-center gap-3">
                        {student.avatarUrl && <Image src={student.avatarUrl} alt={student.name} width={40} height={40} className="rounded-full" data-ai-hint={student.dataAiHint || "student"}/>}
                        <p className="font-semibold text-foreground">{student.name}</p>
                      </div>
                      <div className="flex items-center gap-2 sm:ml-auto">
                        {submission?.isSubmitted ? (
                          <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">Submitted {submission.submittedDate ? format(new Date(submission.submittedDate.replace(/-/g,'/')), 'PP') : ''}</Badge>
                        ) : (
                          <Badge variant="destructive">Not Submitted</Badge>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleOpenGradingForm(submission || null, student.id)}>
                            <Edit className="mr-1 h-4 w-4" /> {submission?.grade ? 'Edit Grade' : 'Grade'}
                        </Button>
                      </div>
                    </div>
                    {submission?.fileUrl && (
                        <p className="text-sm mt-2">Attachment: <Link href={submission.fileUrl} target="_blank" className="text-accent underline">View File</Link></p>
                    )}
                    {submission?.grade && <p className="text-sm mt-2">Grade: <span className="font-semibold text-primary">{submission.grade}</span></p>}
                    {submission?.feedback && <p className="text-sm mt-1 text-muted-foreground">Feedback: {submission.feedback}</p>}
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isGradingFormOpen} onOpenChange={setIsGradingFormOpen}>
        <DialogContent className="sm:max-w-md">
            <form onSubmit={handleGradeSubmit}>
                <DialogHeader>
                    <DialogTitle>Grade Submission for {getMockChildById(currentGradingSubmission?.studentId || '')?.name}</DialogTitle>
                    <DialogDescription>Assignment: {assignment.title}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div>
                        <Label htmlFor="grade">Grade</Label>
                        <Input id="grade" value={currentGrade} onChange={(e) => setCurrentGrade(e.target.value)} placeholder="e.g., A, B+, 85%" />
                    </div>
                    <div>
                        <Label htmlFor="feedback">Feedback (Optional)</Label>
                        <Textarea id="feedback" value={currentFeedback} onChange={(e) => setCurrentFeedback(e.target.value)} placeholder="Provide constructive feedback..." />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                    <Button type="submit" disabled={isLoadingForm}>{isLoadingForm ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Grade'}</Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
