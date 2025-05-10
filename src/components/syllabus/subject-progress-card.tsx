import type { Subject } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from '@/components/ui/button';
import { BookOpen, CalendarDays, User } from 'lucide-react';

interface SubjectProgressCardProps {
  subject: Subject;
}

export function SubjectProgressCard({ subject }: SubjectProgressCardProps) {
  return (
    <Card className="shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="bg-secondary/30 p-4">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-primary" />
          <div>
            <CardTitle className="text-lg font-semibold text-primary">{subject.name}</CardTitle>
            {subject.teacherName && <CardDescription className="text-xs text-muted-foreground flex items-center gap-1"><User className="h-3 w-3"/>{subject.teacherName}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-foreground">Progress:</span>
            <span className="text-sm font-semibold text-primary">{subject.progress}%</span>
          </div>
          <Progress value={subject.progress} className="w-full h-2" />
        </div>
        <div>
          <p className="text-sm text-foreground"><span className="font-medium">Current Topic:</span> {subject.currentTopic}</p>
        </div>
        {subject.nextDeadline && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 text-accent" />
            <span>Next Deadline: {subject.nextDeadline}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 bg-muted/20">
        <Button variant="outline" size="sm" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">View Full Syllabus</Button>
      </CardFooter>
    </Card>
  );
}
