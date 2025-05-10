
import { getMockAssignmentsForChild, getMockChildById } from "@/lib/placeholder-data";
import type { ChildAssignmentView } from "@/types";
import { AssignmentItem } from "@/components/assignments/assignment-item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserX } from "lucide-react";

export default function AssignmentsPage({ params }: { params: { childId: string } }) {
  const child = getMockChildById(params.childId);
  
  if (!child) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <UserX className="h-4 w-4" />
          <AlertTitle>Child Not Found</AlertTitle>
          <AlertDescription>
            The child with ID "{params.childId}" could not be found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const allAssignments: ChildAssignmentView[] = getMockAssignmentsForChild(params.childId);
  
  const upcomingAssignments = allAssignments.filter(a => !a.submitted && new Date(a.dueDate) >= new Date());
  const pastAssignments = allAssignments.filter(a => a.submitted || new Date(a.dueDate) < new Date());


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2 text-primary">Assignments for {child.name}</h1>
      <p className="text-muted-foreground mb-8">{child.gradeLevel}</p>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 rounded-lg">
          <TabsTrigger value="upcoming" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Upcoming</TabsTrigger>
          <TabsTrigger value="past" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Past &amp; Submitted</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {upcomingAssignments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingAssignments.map((assignment) => (
                <AssignmentItem key={assignment.id} assignment={assignment} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No upcoming assignments.</p>
          )}
        </TabsContent>
        <TabsContent value="past">
          {pastAssignments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastAssignments.map((assignment) => (
                <AssignmentItem key={assignment.id} assignment={assignment} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No past or submitted assignments.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
