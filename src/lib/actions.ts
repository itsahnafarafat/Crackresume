'use server';

import { aiContentAssist } from '@/ai/flows/ai-content-assist';
import { atsChecker } from '@/ai/flows/ats-checker-flow';
import { optimizeKeywords } from '@/ai/flows/keyword-optimizer';
import type { ResumeData } from './types';

export async function runAiContentAssist(jobDescription: string, resumeContent: string) {
  try {
    const result = await aiContentAssist({ jobDescription, resumeContent });
    return { success: true, data: result.improvedContentSuggestions };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get AI content suggestions.' };
  }
}

export async function runKeywordOptimizer(resume: string, jobDescription: string) {
  try {
    const result = await optimizeKeywords({ resume, jobDescription });
    return { success: true, data: result.keywordSuggestions };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to optimize keywords.' };
  }
}

export async function runAtsCheck(resumeData: ResumeData, jobDescription: string) {
  try {
    const resumeString = JSON.stringify(resumeData);
    const result = await atsChecker({ resume: resumeString, jobDescription });
    return { success: true, data: result };
  } catch (error) {
    console.error('ATS Check Error:', error);
    return { success: false, error: 'Failed to run AI-powered ATS check.' };
  }
}
