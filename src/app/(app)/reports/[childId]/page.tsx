import { getMockGradeReports, getMockChildById } from "@/lib/placeholder-data";
import { GradeOverview } from "@/components/reports/grade-overview";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserX } from "lucide-react";

export default function ReportsPage({ params }: { params: { childId: string } }) {
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

  const gradeReports = getMockGradeReports(params.childId);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2 text-primary">Progress Reports for {child.name}</h1>
      <p className="text-muted-foreground mb-8">{child.gradeLevel}</p>
      
      {gradeReports.length > 0 ? (
        <div className="space-y-6">
          {gradeReports.map((reportEntry) => (
            <GradeOverview key={reportEntry.id} reportEntry={reportEntry} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">No progress reports available for {child.name}.</p>
      )}
    </div>
  );
}
