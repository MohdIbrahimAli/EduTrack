'use client'; // This page is interactive, so client component

import { getMockGradeReports, getMockChildById } from "@/lib/placeholder-data";
import { GradeOverview } from "@/components/reports/grade-overview";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserX, Loader2 } from "lucide-react";
import { AcademicAdvisorSection } from "@/components/reports/academic-advisor-section";
import type { Child, GradeReportEntry as GradeReportEntryType } from "@/types";
import { useState, useEffect } from "react";

export default function ReportsPage({ params }: { params: { childId: string } }) {
  const [child, setChild] = useState<Child | null | undefined>(undefined);
  const [gradeReports, setGradeReports] = useState<GradeReportEntryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const foundChild = getMockChildById(params.childId);
    setChild(foundChild);
    if (foundChild) {
      setGradeReports(getMockGradeReports(params.childId));
    }
    setIsLoading(false);
  }, [params.childId]);


  if (isLoading || child === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

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

      <AcademicAdvisorSection childId={child.id} childName={child.name} />
    </div>
  );
}