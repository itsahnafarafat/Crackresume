'use server';

import { generateAtsFriendlyResume } from '@/ai/flows/ats-resume-generator';

export async function runGenerateAtsFriendlyResume(resumeContent: string, jobDescription: string) {
  try {
    const result = await generateAtsFriendlyResume({ resumeContent, jobDescription });
    return { success: true, data: result.atsFriendlyResume };
  } catch (error) {
    console.error('Generate ATS Friendly Resume Error:', error);
    return { success: false, error: 'Failed to generate the ATS-friendly resume.' };
  }
}
