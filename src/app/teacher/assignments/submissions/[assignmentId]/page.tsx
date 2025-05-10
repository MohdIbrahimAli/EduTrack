
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_LOGGED_IN_USER, MOCK_CLASSES, getMockChildById, getMockAssignmentsForClass, getMockAssignmentSubmissionsForAssignment, MOCK_SUBJECTS } from '@/lib/placeholder-data';
import type { SchoolClass, Assignment, AssignmentSubmission, Child } from '@/types';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserX, CheckCircle, XCircle, Edit, Send } from 'lucide-react';
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
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

// Mock function to save grade/feedback
async function saveGradeAndFeedback(submissionId: string, grade: string, feedback: string): Promise<AssignmentSubmission> {
  console.log("Saving grade/feedback for submission:", submissionId, { grade, feedback });
  // In real app, update Firestore
  const existingSubmission = MOCK_ASSIGNMENT_SUBMISSIONS.find(s => s.id === submissionId);
  if (!existingSubmission) throw new Error("Submission not found");
  const updatedSubmission = { ...existingSubmission, grade, feedback };
  // Update mock data for demo
  const index = MOCK_ASSIGNMENT_SUBMISSIONS.findIndex(s => s.id === submissionId);
  if (index !== -1) MOCK_ASSIGNMENT_SUBMISSIONS[index] = updatedSubmission;
  return updatedSubmission;
}


export default function TeacherViewSubmissionsPage({ params }: { params: { assignmentId: string } }) {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [students, setStudents] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGradingFormOpen, setIsGradingFormOpen] = useState(false);
  const [currentGradingSubmission, setCurrentGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [currentGrade, setCurrentGrade] = useState('');
  const [currentFeedback, setCurrentFeedback] = useState('');

  const schoolClass = classId ? MOCK_CLASSES.find(c => c.id === classId && c.teacherId === MOCK_LOGGED_IN_USER.id) : null;

  useEffect(() => {
    if (schoolClass) {
      const foundAssignment = getMockAssignmentsForClass(schoolClass.id).find(a => a.id === params.assignmentId);
      setAssignment(foundAssignment || null);
      if (foundAssignment) {
        setSubmissions(getMockAssignmentSubmissionsForAssignment(foundAssignment.id));
        const classStudents = schoolClass.studentIds.map(id => getMockChildById(id)).filter(Boolean) as Child[];
        setStudents(classStudents);
      }
    }
  }, [schoolClass, params.assignmentId]);

  if (MOCK_LOGGED_IN_USER.role !== 'teacher') return <p>Access Denied.</p>;
  if (!schoolClass) return <div className="container mx-auto py-8"><Alert variant="destructive"><UserX className="h-4 w-4" /><AlertTitle>Class Not Found</AlertTitle></Alert></div>;
  if (!assignment) return <div className="container mx-auto py-8"><Alert variant="destructive"><UserX className="h-4 w-4" /><AlertTitle>Assignment Not Found</AlertTitle></Alert></div>;

  const subject = MOCK_SUBJECTS.find(s => s.id === assignment.subjectId);

  const handleOpenGradingForm = (submission: AssignmentSubmission | null, studentId: string) => {
    if (submission) {
        setCurrentGradingSubmission(submission);
        setCurrentGrade(submission.grade || '');
        setCurrentFeedback(submission.feedback || '');
    } else { // No submission yet, but teacher might want to enter grade/feedback (e.g. for offline work)
        setCurrentGradingSubmission({ id: `new-${studentId}-${assignment.id}`, assignmentId: assignment.id, studentId, isSubmitted: false });
        setCurrentGrade('');
        setCurrentFeedback('');
    }
    setIsGradingFormOpen(true);
  };

  const handleGradeSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentGradingSubmission) return;
    setIsLoading(true);
    try {
        const updatedSubmission = await saveGradeAndFeedback(currentGradingSubmission.id, currentGrade, currentFeedback);
        // Update local state for submissions
        setSubmissions(prev => {
            const existing = prev.find(s => s.id === updatedSubmission.id);
            if(existing) return prev.map(s => s.id === updatedSubmission.id ? updatedSubmission : s);
            return [...prev, updatedSubmission]; // Add if it was a new grading entry
        });
        toast({ title: "Success", description: "Grade and feedback saved." });
        setIsGradingFormOpen(false);
    } catch (error) {
        toast({ title: "Error", description: "Failed to save grade/feedback.", variant: "destructive" });
    } finally {
        setIsLoading(false);
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
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div className="flex items-center gap-3">
                        {student.avatarUrl && <Image src={student.avatarUrl} alt={student.name} width={40} height={40} className="rounded-full" data-ai-hint={student.dataAiHint || "student"}/>}
                        <p className="font-semibold text-foreground">{student.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {submission?.isSubmitted ? (
                          <Badge variant="default" className="bg-green-500 text-white">Submitted {submission.submittedDate ? format(new Date(submission.submittedDate.replace(/-/g,'/')), 'PP') : ''}</Badge>
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
                    <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Grade'}</Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Minimal Badge component (replace with your actual Badge or remove if not used)
function Badge({ children, variant, className }: { children: React.ReactNode, variant?: string, className?: string }) {
  const baseStyle = "px-2 py-0.5 rounded-full text-xs font-semibold ";
  let variantStyle = "bg-gray-200 text-gray-800";
  if (variant === "default") variantStyle = "bg-primary text-primary-foreground";
  if (variant === "destructive") variantStyle = "bg-destructive text-destructive-foreground";
  return <span className={`${baseStyle} ${variantStyle} ${className}`}>{children}</span>;
}

