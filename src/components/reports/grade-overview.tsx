import type { GradeReportEntry } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Star, MessageSquare } from 'lucide-react';

interface GradeOverviewProps {
  reportEntry: GradeReportEntry;
}

export function GradeOverview({ reportEntry }: GradeOverviewProps) {
  return (
    <Card className="shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="bg-secondary/30 p-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-primary">{reportEntry.subject}</CardTitle>
          <div className="flex items-center gap-2 text-primary font-bold">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <span>{reportEntry.grade}</span>
          </div>
        </div>
        <CardDescription className="text-xs text-muted-foreground">Term: {reportEntry.term}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="feedback">
            <AccordionTrigger className="text-sm font-medium text-accent hover:text-accent/80">
              <MessageSquare className="mr-2 h-4 w-4"/> Teacher Feedback
            </AccordionTrigger>
            <AccordionContent className="text-sm text-foreground pt-2">
              {reportEntry.teacherFeedback || "No feedback provided."}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
