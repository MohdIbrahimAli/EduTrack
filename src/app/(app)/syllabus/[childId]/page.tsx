
import { getMockSubjectsForChild, getMockChildById } from "@/lib/placeholder-data";
import { SubjectProgressCard } from "@/components/syllabus/subject-progress-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserX } from "lucide-react";

export default function SyllabusPage({ params }: { params: { childId: string } }) {
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
  
  const subjects = getMockSubjectsForChild(params.childId);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2 text-primary">Syllabus Tracker for {child.name}</h1>
      <p className="text-muted-foreground mb-8">{child.gradeLevel}</p>
      
      {subjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <SubjectProgressCard key={subject.id} subject={subject} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">No syllabus information available for {child.name}.</p>
      )}
    </div>
  );
}

