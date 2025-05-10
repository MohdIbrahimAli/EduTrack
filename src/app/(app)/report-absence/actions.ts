'use server';
import { generateAbsenceReport, AbsenceReportInput, AbsenceReportOutput } from '@/ai/flows/absence-report-generator';
import { z } from 'zod';

const ReportAbsenceFormSchema = z.object({
  childId: z.string().min(1, "Child selection is required."),
  childName: z.string().min(1, "Child name is required."), // Added for passing to AI
  date: z.string().min(1, "Date is required."),
  reason: z.string().min(1, "Reason is required.").max(100, "Reason should be concise."),
  additionalDetails: z.string().max(500, "Details are too long.").optional(),
});

export type ReportAbsenceFormState = {
  message?: string;
  errors?: {
    childId?: string[];
    childName?: string[];
    date?: string[];
    reason?: string[];
    additionalDetails?: string[];
    aiError?: string[];
  };
  generatedReport?: AbsenceReportOutput;
};

export async function handleGenerateAbsenceReport(
  prevState: ReportAbsenceFormState,
  formData: FormData
): Promise<ReportAbsenceFormState> {
  const validatedFields = ReportAbsenceFormSchema.safeParse({
    childId: formData.get('childId'),
    childName: formData.get('childName'),
    date: formData.get('date'),
    reason: formData.get('reason'),
    additionalDetails: formData.get('additionalDetails'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check the form.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { childName, date, reason, additionalDetails } = validatedFields.data;

  const aiInput: AbsenceReportInput = {
    childName,
    date,
    reason,
    additionalDetails: additionalDetails || '',
    // In a real app, pastReasons would be fetched based on childId
    pastReasons: ['Had a cold last month', 'Family emergency two weeks ago'], 
  };

  try {
    const reportOutput = await generateAbsenceReport(aiInput);
    return {
      message: 'Absence report generated successfully.',
      generatedReport: reportOutput,
    };
  } catch (error) {
    console.error("AI report generation failed:", error);
    return {
      message: 'Failed to generate absence report using AI.',
      errors: { aiError: ['An unexpected error occurred with the AI service.'] },
    };
  }
}
