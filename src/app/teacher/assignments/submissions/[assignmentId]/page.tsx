
'use client';

import { useState, useEffect, useContext, use } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_CLASSES, getMockChildById, getMockAssignmentsForClass, getMockAssignmentSubmissionsForAssignment, MOCK_SUBJECTS, addOrUpdateMockAssignmentSubmission } from '@/lib/placeholder-data';
import type { SchoolClass, Assignment, AssignmentSubmission, Child } from '@/types';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserX, CheckCircle, XCircle, Edit, Send, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
async function saveGradeAndFeedback(submissionData: Partial<AssignmentSubmission> & Pick<AssignmentSubmission, 'assignmentId' | 'studentId'>): Promise<AssignmentSubmission> {
  console.log("Saving grade/feedback for submission:", submissionData.id, { grade: submissionData.grade, feedback: submissionData.feedback });
  const updated = addOrUpdateMockAssignmentSubmission(submissionData);
  return new Promise(resolve => setTimeout(() => resolve(updated), 300));
}


export default function TeacherViewSubmissionsPage({ params: paramsPromise }: { params: { assignmentId: string } }) {
  const params = use(paramsPromise);
  const { assignmentId: resolvedAssignmentId } = params;

  const { toast } = useToast();
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [students, setStudents] = useState<Child[]>([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isGradingFormOpen, setIsGradingFormOpen] = useState(false);
  const [currentGradingSubmission, setCurrentGradingSubmission] = useState<Partial<AssignmentSubmission> | null>(null); // Keep it partial for new entries
  const [currentGrade, setCurrentGrade] = useState('');
  const [currentFeedback, setCurrentFeedback] = useState('');
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  const [schoolClass, setSchoolClass] = useState<SchoolClass | undefined>(undefined);
  const context = useContext(UserRoleContext);


  const fetchSubmissions = () => {
    if(assignment) {
        setSubmissions(getMockAssignmentSubmissionsForAssignment(assignment.id));
    }
  }

  useEffect(() => {
    if (context && !context.isLoadingRole && context.currentUser?.role === 'teacher' && classId) {
      const foundClass = MOCK_CLASSES.find(c => c.id === classId && c.teacherId === context.currentUser!.id);
      setSchoolClass(foundClass);
      if (foundClass) {
        const foundAssignment = getMockAssignmentsForClass(foundClass.id).find(a => a.id === resolvedAssignmentId);
        setAssignment(foundAssignment || null);
        if (foundAssignment) {
          fetchSubmissions(); // Initial fetch
          const classStudents = foundClass.studentIds.map(id => getMockChildById(id)).filter(Boolean) as Child[];
          setStudents(classStudents);
        }
      }
      setIsLoadingPage(false);
    } else if (context && !context.isLoadingRole) {
      setIsLoadingPage(false);
    }
  }, [context, resolvedAssignmentId, classId, assignment?.id]); // Added assignment?.id to re-fetch if assignment changes

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

  const handleOpenGradingForm = (existingSubmission: AssignmentSubmission | undefined, studentId: string) => {
    const student = getMockChildById(studentId);
    if (!student) return;

    if (existingSubmission) {
        setCurrentGradingSubmission(existingSubmission);
        setCurrentGrade(existingSubmission.grade || '');
        setCurrentFeedback(existingSubmission.feedback || '');
    } else { 
        setCurrentGradingSubmission({ 
          assignmentId: assignment.id, 
          studentId,
          // No id needed for temp object if creating new
        });
        setCurrentGrade('');
        setCurrentFeedback('');
    }
    setIsGradingFormOpen(true);
  };

  const handleGradeSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentGradingSubmission || !currentUser || !currentGradingSubmission.studentId || !currentGradingSubmission.assignmentId) return;
    setIsLoadingForm(true);
    try {
        const submissionDataToSave: Partial<AssignmentSubmission> & Pick<AssignmentSubmission, 'assignmentId' | 'studentId'> = {
            id: currentGradingSubmission.id, // Will be undefined if new
            assignmentId: currentGradingSubmission.assignmentId,
            studentId: currentGradingSubmission.studentId,
            grade: currentGrade,
            feedback: currentFeedback,
            isSubmitted: currentGradingSubmission.isSubmitted || !!currentGrade, // Mark as submitted if graded
            submittedDate: currentGradingSubmission.submittedDate || (!!currentGrade ? new Date().toISOString().split('T')[0] : undefined)
        };

        await saveGradeAndFeedback(submissionDataToSave);
        fetchSubmissions(); // Re-fetch to update list
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
                        <Button variant="outline" size="sm" onClick={() => handleOpenGradingForm(submission, student.id)}>
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

    
