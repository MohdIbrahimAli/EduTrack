
'use server';

import { getAcademicAdvice as getAcademicAdviceFlow, AcademicAdvisorInput, AcademicAdvisorOutput } from '@/ai/flows/academic-advisor';

export async function getAcademicAdviceAction(
  childId: string,
  childName: string
): Promise<{ data?: AcademicAdvisorOutput; error?: string }> {
  try {
    const input: AcademicAdvisorInput = { childId, childName };
    const advice = await getAcademicAdviceFlow(input);
    return { data: advice };
  } catch (error) {
    console.error("Error getting academic advice:", error);
    return { error: error instanceof Error ? error.message : "Failed to get academic advice from AI." };
  }
}
