
'use server';
/**
 * @fileOverview AI Academic Advisor to provide insights based on a child's performance.
 *
 * - getAcademicAdvice - A function that generates academic advice for a child.
 * - AcademicAdvisorInput - The input type for the getAcademicAdvice function.
 * - AcademicAdvisorOutput - The return type for the getAcademicAdvice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getMockGradeReports, getMockAssignments, getMockSubjects } from '@/lib/placeholder-data';
import type { GradeReportEntry, Assignment, Subject as SubjectType } from '@/types'; // Renamed Subject to SubjectType to avoid conflict

const AcademicAdvisorInputSchema = z.object({
  childId: z.string().describe("The ID of the child for whom advice is being generated."),
  childName: z.string().describe("The name of the child, for personalized advice."),
});
export type AcademicAdvisorInput = z.infer<typeof AcademicAdvisorInputSchema>;

const AcademicAdvisorOutputSchema = z.object({
  overallSummary: z.string().describe("A concise overall summary of the child's academic standing."),
  strengths: z.array(z.string()).describe("A list of key academic strengths identified."),
  areasForImprovement: z.array(z.string()).describe("A list of areas where the child could improve."),
  suggestedActivities: z.array(z.string()).describe("A list of suggested activities or focus areas to help the child excel."),
});
export type AcademicAdvisorOutput = z.infer<typeof AcademicAdvisorOutputSchema>;

export async function getAcademicAdvice(input: AcademicAdvisorInput): Promise<AcademicAdvisorOutput> {
  // Fetch mock data within the function that calls the flow, to pass to the prompt
  const gradeReports = getMockGradeReports(input.childId);
  const assignments = getMockAssignments(input.childId).slice(0, 5); // Limit to recent/relevant
  const subjects = getMockSubjects(input.childId);

  const flowInput = {
    ...input,
    gradeReports,
    assignments,
    subjects,
  };
  
  return academicAdvisorFlow(flowInput);
}

// Define an extended input schema for the prompt that includes the fetched data
const PromptInputSchema = AcademicAdvisorInputSchema.extend({
    gradeReports: z.array(z.custom<GradeReportEntry>()).describe("Array of grade report entries for the child."),
    assignments: z.array(z.custom<Assignment>()).describe("Array of assignment details for the child."),
    subjects: z.array(z.custom<SubjectType>()).describe("Array of subject progress details for the child.")
});


const prompt = ai.definePrompt({
  name: 'academicAdvisorPrompt',
  input: { schema: PromptInputSchema },
  output: { schema: AcademicAdvisorOutputSchema },
  prompt: `You are an AI Academic Advisor for parents. Your goal is to provide supportive and constructive feedback.
Based on the following academic data for {{childName}}:

Grade Reports:
{{#if gradeReports.length}}
{{#each gradeReports}}
- Subject: {{this.subject}}, Grade: {{this.grade}}, Feedback: "{{this.teacherFeedback}}", Term: {{this.term}}
{{/each}}
{{else}}
No grade reports available.
{{/if}}

Recent Assignments:
{{#if assignments.length}}
{{#each assignments}}
- Subject: {{this.subject}}, Title: "{{this.title}}", Due: {{this.dueDate}}, Submitted: {{this.submitted}}{{#if this.grade}}, Grade: {{this.grade}}{{else}}{{^if this.submitted}} (Pending Submission){{/if}}{{/if}}
{{/each}}
{{else}}
No recent assignments available.
{{/if}}

Syllabus Progress:
{{#if subjects.length}}
{{#each subjects}}
- Subject: {{this.name}}, Progress: {{this.progress}}%, Current Topic: "{{this.currentTopic}}"{{#if this.teacherName}}, Teacher: {{this.teacherName}}{{/if}}
{{/each}}
{{else}}
No syllabus progress available.
{{/if}}

Please provide:
1.  A concise overall summary of {{childName}}'s academic standing.
2.  A list of key strengths observed from the data.
3.  A list of areas that could be targeted for improvement.
4.  A list of actionable suggested activities or focus areas for {{childName}} and their parent to consider.

Format your response strictly according to the output schema. Be positive and encouraging in your tone.
If data for a category (grades, assignments, syllabus) is sparse or missing, acknowledge that in your assessment and make conservative recommendations.
Focus on patterns and actionable advice.
Strengths, areasForImprovement, and suggestedActivities should be lists of short, distinct points.
`,
});

const academicAdvisorFlow = ai.defineFlow(
  {
    name: 'academicAdvisorFlow',
    inputSchema: PromptInputSchema, // Use the extended schema for flow input
    outputSchema: AcademicAdvisorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input); // Prompt now receives all data directly
    if (!output) {
        throw new Error("AI failed to generate academic advice.");
    }
    return output;
  }
);
