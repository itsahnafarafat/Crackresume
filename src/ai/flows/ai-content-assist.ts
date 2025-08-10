'use server';

/**
 * @fileOverview An AI-powered resume content assistant flow.
 *
 * - aiContentAssist - A function that suggests content to improve a resume.
 * - AiContentAssistInput - The input type for the aiContentAssist function.
 * - AiContentAssistOutput - The return type for the aiContentAssist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiContentAssistInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The job description for which the resume is being tailored.'),
  resumeContent: z
    .string()
    .describe('The current content of the resume to be improved.'),
});
export type AiContentAssistInput = z.infer<typeof AiContentAssistInputSchema>;

const AiContentAssistOutputSchema = z.object({
  improvedContentSuggestions: z
    .string()
    .describe(
      'AI-powered suggestions to improve the content of the resume, tailored to the job description.'
    ),
});
export type AiContentAssistOutput = z.infer<typeof AiContentAssistOutputSchema>;

export async function aiContentAssist(input: AiContentAssistInput): Promise<AiContentAssistOutput> {
  return aiContentAssistFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiContentAssistPrompt',
  input: {schema: AiContentAssistInputSchema},
  output: {schema: AiContentAssistOutputSchema},
  prompt: `You are an AI resume expert. Given a job description and the current content of a resume, provide suggestions to improve the resume content so it's a better fit for the job.

Job Description: {{{jobDescription}}}

Resume Content: {{{resumeContent}}}

Improved Content Suggestions:`, // Provide more detailed instructions or formatting examples as needed
});

const aiContentAssistFlow = ai.defineFlow(
  {
    name: 'aiContentAssistFlow',
    inputSchema: AiContentAssistInputSchema,
    outputSchema: AiContentAssistOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
