'use server';

/**
 * @fileOverview An AI-powered ATS friendliness checker.
 *
 * - atsChecker - A function that analyzes a resume against a job description for ATS friendliness.
 * - AtsCheckerInput - The input type for the atsChecker function.
 * - AtsCheckerOutput - The return type for the atsChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AtsCheckerInputSchema = z.object({
  resume: z.string().describe('The JSON string representation of the resume.'),
  jobDescription: z
    .string()
    .describe('The job description to compare the resume against.'),
});
export type AtsCheckerInput = z.infer<typeof AtsCheckerInputSchema>;

const AtsCheckerOutputSchema = z.object({
  score: z
    .number()
    .describe(
      'A score from 0 to 100 representing ATS compatibility, where 100 is a perfect match.'
    ),
  feedback: z
    .string()
    .describe('Positive feedback on what the resume does well.'),
  suggestions: z
    .string()
    .describe('Actionable suggestions to improve the resume for the given job description.'),
});
export type AtsCheckerOutput = z.infer<typeof AtsCheckerOutputSchema>;

export async function atsChecker(
  input: AtsCheckerInput
): Promise<AtsCheckerOutput> {
  return atsCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'atsCheckerPrompt',
  input: {schema: AtsCheckerInputSchema},
  output: {schema: AtsCheckerOutputSchema},
  prompt: `You are an expert ATS (Applicant Tracking System) resume analyzer. Your task is to evaluate a resume based on a provided job description.

Analyze the following resume and job description. Provide a compatibility score from 0-100, where 100 is a perfect match. Also provide positive feedback on the strong points of the resume and concrete, actionable suggestions for how to improve it to be more ATS-friendly and better tailored to the job description. Focus on keywords, skills, and quantifiable achievements.

Resume (JSON):
{{{resume}}}

Job Description:
{{{jobDescription}}}
`,
});

const atsCheckerFlow = ai.defineFlow(
  {
    name: 'atsCheckerFlow',
    inputSchema: AtsCheckerInputSchema,
    outputSchema: AtsCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
