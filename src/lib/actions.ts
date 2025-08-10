'use server';

import { generateAtsFriendlyResume } from '@/ai/flows/ats-resume-generator';

/**
 * @deprecated This function is not type-safe. Call `generateAtsFriendlyResume` directly from a client component instead.
 */
export async function runGenerateAtsFriendlyResume(resumeContent: string, jobDescription: string) {
  return await generateAtsFriendlyResume({ resumeContent, jobDescription });
}
