'use client';

import { useState, useEffect, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input'; 
import { Textarea } from '@/components/ui/textarea'; 
import { MOCK_CLASSES, getMockAssignmentsForClass, MOCK_SUBJECTS, addOrUpdateMockAssignment, deleteMockAssignment } from '@/lib/placeholder-data';
import type { SchoolClass, Assignment, Subject as SubjectType } from '@/types';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserX, PlusCircle, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
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
import { UserRoleContext } from '@/context/UserRoleContext';


// Updated to use centralized mock data modifier
async function saveAssignment(classId: string, assignment: Omit<Assignment, 'id' | 'createdBy'> & { id?: string }, teacherId: string): Promise<Assignment> {
  console.log('Saving assignment:', { classId, assignment });
  const saved = addOrUpdateMockAssignment(classId, assignment, teacherId);
  return new Promise(resolve => setTimeout(() => resolve(saved), 300));
}

// Updated to use centralized mock data modifier
async function removeAssignment(assignmentId: string): Promise<boolean> {
  console.log('Deleting assignment:', assignmentId);
  const success = deleteMockAssignment(assignmentId);
  return new Promise(resolve => setTimeout(() => resolve(success), 300));
}


export default function TeacherManageAssignmentsPage({ params }: { params: { classId: string } }) {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<Partial<Assignment> | null>(null);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  
  const [schoolClass, setSchoolClass] = useState<SchoolClass | undefined>(undefined);
  const [subjectsForClass, setSubjectsForClass] = useState<SubjectType[]>([]);

  const context = useContext(UserRoleContext);

  useEffect(() => {
    if (context && !context.isLoadingRole && context.currentUser?.role === 'teacher') {
      const foundClass = MOCK_CLASSES.find(c => c.id === params.classId && c.teacherId === context.currentUser.id);
      setSchoolClass(foundClass);
      if (foundClass) {
        setAssignments(getMockAssignmentsForClass(foundClass.id));
        setSubjectsForClass(MOCK_SUBJECTS.filter(s => s.classId === foundClass.id && s.teacherId === context.currentUser!.id));
      }
      setIsLoadingPage(false);
    } else if (context && !context.isLoadingRole) {
      setIsLoadingPage(false);
    }
  }, [context, params.classId]);


  if (!context || context.isLoadingRole || isLoadingPage) {
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
  if (!schoolClass) {
    return <div className="container mx-auto py-8"><Alert variant="destructive"><UserX className="h-4 w-4" /><AlertTitle>Class Not Found</AlertTitle><AlertDescription>This class may not exist or you may not have permission to manage it.</AlertDescription></Alert></div>;
  }

  const fetchAssignmentsForClass = () => {
     if(schoolClass) {
        setAssignments(getMockAssignmentsForClass(schoolClass.id));
     }
  }


  const handleOpenForm = (assignment?: Assignment) => {
    setCurrentAssignment(assignment || { title: '', description: '', dueDate: format(new Date(), 'yyyy-MM-dd'), subjectId: subjectsForClass[0]?.id || '' });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentAssignment || !currentAssignment.title || !currentAssignment.subjectId || !currentAssignment.dueDate || !schoolClass) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    setIsLoadingForm(true);
    try {
      const savedAssignment = await saveAssignment(schoolClass.id, currentAssignment as any, currentUser.id);
      fetchAssignmentsForClass(); // Re-fetch to update list
      toast({ title: "Success", description: `Assignment ${currentAssignment.id ? 'updated' : 'created'}.` });
      setIsFormOpen(false);
      setCurrentAssignment(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save assignment.", variant: "destructive" });
    } finally {
      setIsLoadingForm(false);
    }
  };
  
  const handleDeleteAssignment = async (assignmentId: string) => {
    const confirmDelete = await new Promise<boolean>((resolve) => {
        // This is a placeholder for a proper confirmation dialog.
        // In a real app, use <AlertDialog> from shadcn/ui.
        resolve(window.confirm("Are you sure you want to delete this assignment?"));
    });

    if (!confirmDelete) return;

    setIsLoadingForm(true);
    try {
      const success = await removeAssignment(assignmentId);
      if (success) {
        fetchAssignmentsForClass(); // Re-fetch to update list
        toast({ title: "Success", description: "Assignment deleted." });
      } else {
        toast({ title: "Error", description: "Assignment not found or already deleted.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete assignment.", variant: "destructive" });
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
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteAssignment(assignment.id)} disabled={isLoadingForm}><Trash2 className="mr-1 h-4 w-4" /> Delete</Button>
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
                    // required - Handled in submit validation
                  >
                    <SelectTrigger id="subjectId"><SelectValue placeholder="Select subject" /></SelectTrigger>
                    <SelectContent>
                      {subjectsForClass.map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                      ))}
                       {subjectsForClass.length === 0 && <SelectItem value="" disabled>No subjects found for this class</SelectItem>}
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
              <Button type="submit" disabled={isLoadingForm}>{isLoadingForm ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Assignment'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}