'use server';
/**
 * @fileOverview Analyzes a resume and job description to suggest keyword optimizations.
 *
 * - optimizeKeywords - A function that takes a resume and job description, and returns keyword suggestions.
 * - OptimizeKeywordsInput - The input type for the optimizeKeywords function.
 * - OptimizeKeywordsOutput - The return type for the optimizeKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeKeywordsInputSchema = z.object({
  resume: z.string().describe('The text of the resume to analyze.'),
  jobDescription: z.string().describe('The job description to analyze.'),
});
export type OptimizeKeywordsInput = z.infer<typeof OptimizeKeywordsInputSchema>;

const OptimizeKeywordsOutputSchema = z.object({
  keywordSuggestions: z
    .string()
    .describe(
      'Suggestions for optimizing keyword usage in the resume based on the job description.'
    ),
});
export type OptimizeKeywordsOutput = z.infer<typeof OptimizeKeywordsOutputSchema>;

export async function optimizeKeywords(input: OptimizeKeywordsInput): Promise<OptimizeKeywordsOutput> {
  return optimizeKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeKeywordsPrompt',
  input: {schema: OptimizeKeywordsInputSchema},
  output: {schema: OptimizeKeywordsOutputSchema},
  prompt: `You are a resume optimization expert. Analyze the provided resume and job description, and provide suggestions for optimizing keyword usage in the resume to better match the job requirements.

Resume:
{{resume}}

Job Description:
{{jobDescription}}

Provide specific keyword suggestions and explain why they are relevant to the job description.`,
});

const optimizeKeywordsFlow = ai.defineFlow(
  {
    name: 'optimizeKeywordsFlow',
    inputSchema: OptimizeKeywordsInputSchema,
    outputSchema: OptimizeKeywordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
