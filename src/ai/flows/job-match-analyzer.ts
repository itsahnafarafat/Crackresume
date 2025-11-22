
'use server';

/**
 * @fileOverview An AI flow to analyze how well a resume matches a job description.
 *
 * - analyzeJobMatch - A function that takes a resume and job description and returns a match analysis.
 * - JobMatchAnalyzerInput - The input type for the analyzeJobMatch function.
 * - JobMatchAnalyzerOutput - The return type for the analyzeJobMatch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const JobMatchAnalyzerInputSchema = z.object({
  resumeContent: z.string().describe('The content of the resume.'),
  jobDescription: z.string().describe('The job description to compare the resume against.'),
});
export type JobMatchAnalyzerInput = z.infer<typeof JobMatchAnalyzerInputSchema>;

const JobMatchAnalyzerOutputSchema = z.object({
    isMatch: z.boolean().describe("A simple true/false whether this is considered a strong match."),
    matchScore: z.number().describe('A score from 0 to 100 representing how well the resume matches the job description.'),
    analysis: z.string().describe('A detailed analysis explaining why the resume is or is not a good match for the job.'),
    strengths: z.array(z.string()).describe('A list of key strengths and matching qualifications from the resume.'),
    weaknesses: z.array(z.string()).describe('A list of key weaknesses, gaps, or areas for improvement.'),
});
export type JobMatchAnalyzerOutput = z.infer<typeof JobMatchAnalyzerOutputSchema>;

export async function analyzeJobMatch(input: JobMatchAnalyzerInput): Promise<JobMatchAnalyzerOutput> {
  return jobMatchAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jobMatchAnalyzerPrompt',
  input: {schema: JobMatchAnalyzerInputSchema},
  output: {schema: JobMatchAnalyzerOutputSchema},
  config: {
    model: 'gemini-pro',
    temperature: 0.1,
  },
  prompt: `You are an expert career coach and hiring manager. Your task is to analyze the provided resume against the job description and determine how good of a match it is.

**Core Instructions:**

1.  **Analyze Keywords and Skills:** Compare the skills, technologies, and qualifications listed in the job description with those present in the resume.
2.  **Evaluate Experience:** Assess if the candidate's work experience (titles, responsibilities, achievements) aligns with the requirements of the job. Look for quantifiable achievements.
3.  **Determine Match Score:** Based on your analysis, provide a score from 0 to 100.
    *   A score above 85 is a strong match.
    *   A score between 60 and 84 is a decent match but could be improved.
    *   A score below 60 is not a strong match.
4.  **Set isMatch Flag:** Set the 'isMatch' boolean to true if the score is 85 or higher, otherwise set it to false.
5.  **Write Analysis:** Provide a concise but insightful analysis.
    *   If it's a good match, explain why. For example: "This is a strong match. The candidate's 5 years of experience in project management and their proficiency in Agile methodologies align perfectly with the job requirements."
    *   If it's not a good match, explain why in a constructive tone. For example: "While the candidate has a solid background in software development, this role specifically requires experience with cloud infrastructure (AWS, Azure), which appears to be missing from the resume. The resume could be strengthened by highlighting any relevant DevOps or cloud-related projects."
6.  **Identify Strengths and Weaknesses:**
    *   List the key qualifications and experiences that make the candidate a good fit under 'strengths'.
    *   List the key skills or experiences that are missing or underdeveloped for this specific role under 'weaknesses'.

The output MUST be a structured JSON object adhering to the provided schema.

Resume Content:
{{{resumeContent}}}

Job Description:
{{{jobDescription}}}
`,
});

const jobMatchAnalyzerFlow = ai.defineFlow(
  {
    name: 'jobMatchAnalyzerFlow',
    inputSchema: JobMatchAnalyzerInputSchema,
    outputSchema: JobMatchAnalyzerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
