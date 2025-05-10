import type { Assignment } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, CheckCircle, Send, AlertCircle } from 'lucide-react';
import { format, parseISO, isPast } from 'date-fns';

interface AssignmentItemProps {
  assignment: Assignment;
}

export function AssignmentItem({ assignment }: AssignmentItemProps) {
  const dueDate = parseISO(assignment.dueDate);
  const isOverdue = isPast(dueDate) && !assignment.submitted;

  return (
    <Card className={`shadow-md rounded-lg overflow-hidden ${isOverdue ? 'border-destructive' : 'border-border'} hover:shadow-lg transition-shadow`}>
      <CardHeader className="p-4 bg-secondary/30">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-primary">{assignment.title}</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">{assignment.subject}</CardDescription>
          </div>
          {assignment.submitted ? (
            <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">
              <CheckCircle className="mr-1 h-3 w-3" /> Submitted
            </Badge>
          ) : isOverdue ? (
            <Badge variant="destructive">
              <AlertCircle className="mr-1 h-3 w-3" /> Overdue
            </Badge>
          ) : (
            <Badge variant="secondary">Pending</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className={`h-4 w-4 ${isOverdue ? 'text-destructive' : 'text-accent'}`} />
          <span>Due: {format(dueDate, "MMMM dd, yyyy")}</span>
        </div>
        <p className="text-sm text-foreground line-clamp-2">{assignment.description}</p>
        {assignment.grade && (
          <p className="text-sm font-medium text-primary">Grade: {assignment.grade}</p>
        )}
      </CardContent>
      <CardFooter className="p-4 bg-muted/20 flex justify-end gap-2">
        <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">View Details</Button>
        {!assignment.submitted && (
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Send className="mr-2 h-4 w-4" /> Submit Work
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
