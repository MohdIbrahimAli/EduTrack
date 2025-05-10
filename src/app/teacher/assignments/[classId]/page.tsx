
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input'; // Assuming ShadCN input
import { Textarea } from '@/components/ui/textarea'; // Assuming ShadCN textarea
import { MOCK_LOGGED_IN_USER, MOCK_CLASSES, getMockAssignmentsForClass, MOCK_SUBJECTS, getMockChildById } from '@/lib/placeholder-data';
import type { SchoolClass, Assignment, AssignmentSubmission } from '@/types';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserX, PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


// Mock function to simulate saving assignment
async function saveAssignment(classId: string, assignment: Omit<Assignment, 'id' | 'createdBy'> & { id?: string }): Promise<Assignment> {
  console.log('Saving assignment:', { classId, assignment });
  // In a real app, this would interact with Firestore
  const newId = assignment.id || `assignNew-${Date.now()}`;
  return { ...assignment, id: newId, createdBy: MOCK_LOGGED_IN_USER.id } as Assignment;
}
async function deleteAssignment(assignmentId: string): Promise<void> {
  console.log('Deleting assignment:', assignmentId);
  // In a real app, this would interact with Firestore
  return new Promise(resolve => setTimeout(resolve, 300));
}


export default function TeacherManageAssignmentsPage({ params }: { params: { classId: string } }) {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<Partial<Assignment> | null>(null);

  const schoolClass = MOCK_CLASSES.find(c => c.id === params.classId && c.teacherId === MOCK_LOGGED_IN_USER.id);
  const subjectsForClass = schoolClass ? MOCK_SUBJECTS.filter(s => s.classId === schoolClass.id && s.teacherId === MOCK_LOGGED_IN_USER.id) : [];


  useEffect(() => {
    if (schoolClass) {
      setAssignments(getMockAssignmentsForClass(schoolClass.id));
    }
  }, [schoolClass]);

  if (MOCK_LOGGED_IN_USER.role !== 'teacher') {
    return <p>Access Denied.</p>;
  }
  if (!schoolClass) {
    return <div className="container mx-auto py-8"><Alert variant="destructive"><UserX className="h-4 w-4" /><AlertTitle>Class Not Found</AlertTitle></Alert></div>;
  }

  const handleOpenForm = (assignment?: Assignment) => {
    setCurrentAssignment(assignment || { title: '', description: '', dueDate: format(new Date(), 'yyyy-MM-dd'), subjectId: subjectsForClass[0]?.id || '' });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentAssignment || !currentAssignment.title || !currentAssignment.subjectId || !currentAssignment.dueDate) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const savedAssignment = await saveAssignment(schoolClass.id, currentAssignment as any);
      if (currentAssignment.id) { // Editing
        setAssignments(prev => prev.map(a => a.id === savedAssignment.id ? savedAssignment : a));
        toast({ title: "Success", description: "Assignment updated." });
      } else { // Creating
        setAssignments(prev => [...prev, savedAssignment]);
        toast({ title: "Success", description: "Assignment created." });
      }
      setIsFormOpen(false);
      setCurrentAssignment(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save assignment.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;
    setIsLoading(true);
    try {
      await deleteAssignment(assignmentId);
      setAssignments(prev => prev.filter(a => a.id !== assignmentId));
      toast({ title: "Success", description: "Assignment deleted." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete assignment.", variant: "destructive" });
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
                <CardTitle className="text-2xl font-bold text-primary">Manage Assignments for {schoolClass.name}</CardTitle>
                <CardDescription>Create, view, and edit assignments.</CardDescription>
                 <Link href="/teacher/dashboard">
                    <Button variant="link" className="text-accent p-0 mt-1">&larr; Back to Dashboard</Button>
                </Link>
            </div>
            <Button onClick={() => handleOpenForm()} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Assignment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {assignments.length === 0 ? (
            <p className="text-muted-foreground">No assignments found for this class yet.</p>
          ) : (
            <div className="space-y-4">
              {assignments.map(assignment => (
                <Card key={assignment.id} className="p-4 bg-muted/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-primary">{assignment.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Subject: {MOCK_SUBJECTS.find(s => s.id === assignment.subjectId)?.name || 'N/A'}
                      </p>
                      <p className="text-sm text-muted-foreground">Due: {format(new Date(assignment.dueDate.replace(/-/g, '/')), 'MMMM dd, yyyy')}</p>
                      <p className="text-sm mt-1 line-clamp-2">{assignment.description}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                      <Link href={`/teacher/assignments/submissions/${assignment.id}?classId=${schoolClass.id}`}>
                        <Button variant="outline" size="sm"><Eye className="mr-1 h-4 w-4" /> View Submissions</Button>
                      </Link>
                      <Button variant="outline" size="sm" onClick={() => handleOpenForm(assignment)}><Edit className="mr-1 h-4 w-4" /> Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteAssignment(assignment.id)} disabled={isLoading}><Trash2 className="mr-1 h-4 w-4" /> Delete</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <form onSubmit={handleFormSubmit}>
            <DialogHeader>
              <DialogTitle>{currentAssignment?.id ? 'Edit' : 'Create'} Assignment</DialogTitle>
              <DialogDescription>Fill in the details for the assignment.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={currentAssignment?.title || ''} onChange={(e) => setCurrentAssignment(p => ({...p, title: e.target.value}))} required />
              </div>
              <div>
                <Label htmlFor="subjectId">Subject</Label>
                 <Select
                    value={currentAssignment?.subjectId || ''}
                    onValueChange={(value) => setCurrentAssignment(p => ({ ...p, subjectId: value }))}
                  >
                    <SelectTrigger id="subjectId"><SelectValue placeholder="Select subject" /></SelectTrigger>
                    <SelectContent>
                      {subjectsForClass.map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" value={currentAssignment?.dueDate || ''} onChange={(e) => setCurrentAssignment(p => ({...p, dueDate: e.target.value}))} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={currentAssignment?.description || ''} onChange={(e) => setCurrentAssignment(p => ({...p, description: e.target.value}))} />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Assignment'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

