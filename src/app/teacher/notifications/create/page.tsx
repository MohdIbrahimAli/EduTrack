
'use client';

import { useState, useContext, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getMockClassesForTeacher } from '@/lib/placeholder-data';
import type { SchoolNotification, SchoolClass } from '@/types';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { UserRoleContext } from '@/context/UserRoleContext';

// Mock function to simulate sending notification
async function sendNotification(notification: Omit<SchoolNotification, 'id' | 'date' | 'read'>): Promise<SchoolNotification> {
  console.log('Sending notification:', notification);
  // In a real app, this would interact with Firestore (to store) and FCM (to send)
  return { ...notification, id: `notif-${Date.now()}`, date: new Date().toISOString(), read: false };
}

export default function TeacherCreateNotificationPage() {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'announcement' | 'alert'>('announcement');
  const [targetAudience, setTargetAudience] = useState<SchoolNotification['targetAudience']>('all');
  const [targetClassId, setTargetClassId] = useState<string | undefined>(undefined);
  const [isLoadingForm, setIsLoadingForm] = useState(false); // Renamed from isLoading to avoid conflict
  const [teacherClasses, setTeacherClasses] = useState<SchoolClass[]>([]);

  const context = useContext(UserRoleContext);
  
  useEffect(() => {
    if (context && !context.isLoadingRole && context.currentUser?.role === 'teacher') {
      setTeacherClasses(getMockClassesForTeacher(context.currentUser.id));
    }
  }, [context]);


  if (!context || context.isLoadingRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const { currentUser } = context;

  if (!currentUser || currentUser.role !== 'teacher') {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center"><AlertTriangle className="mr-2 h-5 w-5 text-destructive"/> Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This page is for teachers only.</p>
            <Link href="/dashboard"><Button variant="link">Go to Parent Dashboard</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({ title: "Error", description: "Title and content are required.", variant: "destructive" });
      return;
    }

    let finalTarget: SchoolNotification['targetAudience'] = targetAudience;
    if (targetAudience === 'class' && targetClassId) {
        finalTarget = `class:${targetClassId}`;
    } else if (targetAudience === 'class' && !targetClassId) {
        toast({ title: "Error", description: "Please select a class if targeting a specific class.", variant: "destructive" });
        return;
    }


    setIsLoadingForm(true);
    try {
      await sendNotification({ title, content, type, targetAudience: finalTarget });
      toast({ title: "Success", description: "Notification sent successfully." });
      setTitle('');
      setContent('');
      setType('announcement');
      setTargetAudience('all');
      setTargetClassId(undefined);
    } catch (error) {
      toast({ title: "Error", description: "Failed to send notification.", variant: "destructive" });
      console.error("Failed to send notification", error);
    } finally {
      setIsLoadingForm(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Create Notification / Announcement</CardTitle>
          <CardDescription>Compose and send messages to parents, students, or specific classes.</CardDescription>
           <Link href="/teacher/dashboard">
            <Button variant="link" className="text-accent p-0 mt-1">&larr; Back to Dashboard</Button>
          </Link>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-foreground font-medium">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="content" className="text-foreground font-medium">Content</Label>
              <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required rows={5} className="mt-1" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="type" className="text-foreground font-medium">Type</Label>
                    <Select value={type} onValueChange={(value) => setType(value as 'announcement' | 'alert')}>
                        <SelectTrigger id="type" className="w-full mt-1">
                        <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="alert">Alert (Urgent)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="targetAudience" className="text-foreground font-medium">Target Audience</Label>
                    <Select value={targetAudience} onValueChange={(value) => {
                        setTargetAudience(value as SchoolNotification['targetAudience']);
                        if (value !== 'class') setTargetClassId(undefined);
                    }}>
                        <SelectTrigger id="targetAudience" className="w-full mt-1">
                            <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Users (Parents & Teachers)</SelectItem>
                            <SelectItem value="parents">All Parents</SelectItem>
                            <SelectItem value="teachers">All Teachers</SelectItem>
                            <SelectItem value="class">Specific Class</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {targetAudience === 'class' && (
                 <div>
                    <Label htmlFor="targetClassId" className="text-foreground font-medium">Target Class</Label>
                    <Select value={targetClassId} onValueChange={setTargetClassId}>
                        <SelectTrigger id="targetClassId" className="w-full mt-1">
                            <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                        {teacherClasses.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoadingForm} className="w-full sm:w-auto">
              {isLoadingForm ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : 'Send Notification'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
