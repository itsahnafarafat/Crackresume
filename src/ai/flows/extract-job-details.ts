
'use server';

/**
 * @fileOverview An AI flow to extract structured job details from a job description text.
 *
 * - extractJobDetails - A function that takes a job description and returns structured data.
 * - ExtractJobDetailsInput - The input type for the extractJobDetails function.
 * - ExtractJobDetailsOutput - The return type for the extractJobDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const ExtractJobDetailsInputSchema = z.object({
  jobDescription: z.string().describe('The full text of the job description.'),
});
export type ExtractJobDetailsInput = z.infer<typeof ExtractJobDetailsInputSchema>;

const ExtractJobDetailsOutputSchema = z.object({
  jobTitle: z.string().describe('The title of the job position.'),
  companyName: z.string().describe('The name of the company.'),
  location: z.string().describe('The location of the job (e.g., "San Francisco, CA" or "Remote").'),
});
export type ExtractJobDetailsOutput = z.infer<typeof ExtractJobDetailsOutputSchema>;


export async function extractJobDetails(input: ExtractJobDetailsInput): Promise<ExtractJobDetailsOutput> {
    return extractJobDetailsFlow(input);
}


const prompt = ai.definePrompt({
  name: 'extractJobDetailsPrompt',
  input: {schema: ExtractJobDetailsInputSchema},
  output: {schema: ExtractJobDetailsOutputSchema},
  prompt: `You are an expert at parsing job descriptions. Your task is to extract the job title, company name, and location from the following job description.

If you cannot find a piece of information, respond with an empty string for that field.

Job Description:
{{{jobDescription}}}
`,
});

const extractJobDetailsFlow = ai.defineFlow(
  {
    name: 'extractJobDetailsFlow',
    inputSchema: ExtractJobDetailsInputSchema,
    outputSchema: ExtractJobDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
