
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, AlertTriangle, Lightbulb, CheckCircle, ListChecks, Edit } from 'lucide-react';
import { getAcademicAdviceAction } from '@/app/(app)/reports/[childId]/actions';
import type { AcademicAdvisorOutput } from '@/ai/flows/academic-advisor';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AcademicAdvisorSectionProps {
  childId: string;
  childName: string;
}

export function AcademicAdvisorSection({ childId, childName }: AcademicAdvisorSectionProps) {
  const [advice, setAdvice] = useState<AcademicAdvisorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAdvice = async () => {
    setIsLoading(true);
    setError(null);
    setAdvice(null);
    const result = await getAcademicAdviceAction(childId, childName);
    if (result.data) {
      setAdvice(result.data);
    } else {
      setError(result.error || 'An unknown error occurred.');
    }
    setIsLoading(false);
  };

  return (
    <Card className="mt-8 shadow-xl rounded-lg border-accent border-2">
      <CardHeader className="bg-accent/10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
                <CardTitle className="text-xl font-semibold text-accent flex items-center gap-2">
                <Sparkles className="h-6 w-6" /> AI Academic Advisor
                </CardTitle>
                <CardDescription className="mt-1">
                Get personalized insights and suggestions for {childName}.
                </CardDescription>
            </div>
            <Button onClick={handleGetAdvice} disabled={isLoading} className="mt-2 sm:mt-0 bg-accent text-accent-foreground hover:bg-accent/90">
                {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                <Lightbulb className="mr-2 h-4 w-4" />
                )}
                {advice ? 'Regenerate Advice' : 'Get AI Advice'}
            </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <p className="ml-3 text-muted-foreground">Generating advice, please wait...</p>
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Generating Advice</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {advice && !isLoading && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2"><ListChecks /> Overall Summary</h3>
              <p className="text-foreground bg-muted/30 p-3 rounded-md">{advice.overallSummary}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold text-green-600 mb-2 flex items-center gap-2"><CheckCircle /> Strengths</h3>
                    <ul className="list-disc list-inside space-y-1 pl-2 bg-green-500/10 p-3 rounded-md">
                        {advice.strengths.map((item, index) => (
                        <li key={`strength-${index}`} className="text-foreground">{item}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-yellow-600 mb-2 flex items-center gap-2"><Edit /> Areas for Improvement</h3>
                    <ul className="list-disc list-inside space-y-1 pl-2 bg-yellow-500/10 p-3 rounded-md">
                        {advice.areasForImprovement.map((item, index) => (
                        <li key={`improvement-${index}`} className="text-foreground">{item}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-indigo-600 mb-2 flex items-center gap-2"><Lightbulb /> Suggested Activities & Focus</h3>
              <ul className="list-disc list-inside space-y-1 pl-2 bg-indigo-500/10 p-3 rounded-md">
                {advice.suggestedActivities.map((item, index) => (
                  <li key={`activity-${index}`} className="text-foreground">{item}</li>
                ))}
              </ul>
            </div>
             <p className="text-xs text-muted-foreground text-center pt-4">
              Note: This advice is AI-generated based on available data and should be used as a supplementary guide.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
