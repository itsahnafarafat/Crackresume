'use server';

import { aiContentAssist } from '@/ai/flows/ai-content-assist';
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

export function runAtsCheck(resumeData: ResumeData, jobDescription: string) {
  const issues: string[] = [];
  const goodPoints: string[] = [];

  // Check personal details
  if (!resumeData.personalDetails.email || !resumeData.personalDetails.phoneNumber) {
    issues.push('Missing essential contact information (Email or Phone Number).');
  } else {
    goodPoints.push('Contact information is present.');
  }

  // Check for a summary
  if (!resumeData.summary || resumeData.summary.length < 50) {
    issues.push('Professional summary is missing or too short. A concise summary helps ATS systems and recruiters understand your profile.');
  } else {
    goodPoints.push('Includes a professional summary.');
  }

  // Check for quantifiable results in experience
  const hasMetrics = resumeData.experience.some(exp => exp.description.some(desc => /\d+%?/.test(desc)));
  if (!hasMetrics) {
    issues.push('Experience descriptions lack quantifiable achievements (e.g., "increased sales by 20%", "managed a team of 5").');
  } else {
    goodPoints.push('Experience includes quantifiable metrics and achievements.');
  }
  
  // Basic keyword check
  const resumeText = JSON.stringify(resumeData).toLowerCase();
  const jobKeywords = jobDescription.toLowerCase().match(/\b(\w{4,})\b/g) || [];
  const uniqueJobKeywords = [...new Set(jobKeywords)];
  let matches = 0;
  uniqueJobKeywords.forEach(keyword => {
    if (resumeText.includes(keyword)) {
      matches++;
    }
  });

  if (jobDescription && uniqueJobKeywords.length > 0) {
    const matchPercentage = (matches / uniqueJobKeywords.length) * 100;
    if (matchPercentage < 30) {
      issues.push(`Low keyword match (${Math.round(matchPercentage)}%) with the job description. Consider adding more relevant terms.`);
    } else {
      goodPoints.push(`Good keyword relevance (${Math.round(matchPercentage)}%) to the job description.`);
    }
  }


  // Check for standard section titles
  goodPoints.push('Uses standard section headings (Experience, Education, Skills), which is great for ATS parsing.');

  return { issues, goodPoints };
}
