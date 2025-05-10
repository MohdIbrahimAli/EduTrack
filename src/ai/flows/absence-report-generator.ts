'use server';

/**
 * @fileOverview AI tool to assist parents in drafting absence notifications.
 *
 * - generateAbsenceReport - A function that generates an absence report.
 * - AbsenceReportInput - The input type for the generateAbsenceReport function.
 * - AbsenceReportOutput - The return type for the generateAbsenceReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AbsenceReportInputSchema = z.object({
  childName: z.string().describe('The name of the child who will be absent.'),
  date: z.string().describe('The date of the absence (YYYY-MM-DD).'),
  reason: z.string().describe('A brief explanation of why the child will be absent.'),
  additionalDetails: z
    .string()
    .optional()
    .describe('Any additional details or context for the absence.'),
  pastReasons: z
    .array(z.string())
    .optional()
    .describe('A list of past reasons for absence, to help suggest appropriate reasons.'),
});

export type AbsenceReportInput = z.infer<typeof AbsenceReportInputSchema>;

const AbsenceReportOutputSchema = z.object({
  notificationText: z.string().describe('The complete text of the absence notification.'),
});

export type AbsenceReportOutput = z.infer<typeof AbsenceReportOutputSchema>;

export async function generateAbsenceReport(input: AbsenceReportInput): Promise<AbsenceReportOutput> {
  return absenceReportGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'absenceReportPrompt',
  input: {schema: AbsenceReportInputSchema},
  output: {schema: AbsenceReportOutputSchema},
  prompt: `You are an AI assistant helping parents draft absence notifications for their child\'s school. The parent will provide information about the absence, and you will generate a complete notification text. Consider any past reasons for absence to suggest appropriate reasons.

Here is the information about the absence:

Child\'s Name: {{{childName}}}
Date of Absence: {{{date}}}
Reason: {{{reason}}}
Additional Details: {{{additionalDetails}}}

{{#if pastReasons}}
Past Reasons for Absence:
{{#each pastReasons}}
- {{{this}}}
{{/each}}
{{/if}}

Compose a concise and informative absence notification, including the child\'s name, date of absence, and reason. The notification should sound professional and considerate.
`,
});

const absenceReportGeneratorFlow = ai.defineFlow(
  {
    name: 'absenceReportGeneratorFlow',
    inputSchema: AbsenceReportInputSchema,
    outputSchema: AbsenceReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
