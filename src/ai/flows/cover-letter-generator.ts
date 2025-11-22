
'use server';

/**
 * @fileOverview An AI flow to generate a custom cover letter based on a resume and job description.
 *
 * - generateCoverLetter - A function that takes resume and job description and returns a cover letter.
 * - GenerateCoverLetterInput - The input type for the generateCoverLetter function.
 * - GenerateCoverLetterOutput - The return type for the generateCoverLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCoverLetterInputSchema = z.object({
  resumeContent: z.string().describe('The content of the resume.'),
  jobDescription: z.string().describe('The job description for the cover letter.'),
  companyName: z.string().describe('The name of the company.'),
  jobTitle: z.string().describe('The title of the job.'),
});
export type GenerateCoverLetterInput = z.infer<typeof GenerateCoverLetterInputSchema>;

const GenerateCoverLetterOutputSchema = z.object({
  coverLetter: z.string().describe('The generated cover letter text.'),
});
export type GenerateCoverLetterOutput = z.infer<typeof GenerateCoverLetterOutputSchema>;


export async function generateCoverLetter(input: GenerateCoverLetterInput): Promise<GenerateCoverLetterOutput> {
    return generateCoverLetterFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateCoverLetterPrompt',
  input: {schema: GenerateCoverLetterInputSchema},
  output: {schema: GenerateCoverLetterOutputSchema},
  model: 'gemini-pro',
  prompt: `You are an expert career coach and professional resume writer. Your task is to write a compelling, professional, and personalized cover letter for a candidate applying for the position of {{{jobTitle}}} at {{{companyName}}}.

**Core Instructions:**

1.  **Analyze and Synthesize:** Carefully analyze the candidate's resume and the provided job description. Your goal is to build a bridge between the candidate's experience and the employer's needs.
2.  **Structure:** The cover letter should have a clear, professional structure:
    *   **Introduction:** State the position being applied for and where it was seen. Express enthusiasm for the role and the company.
    *   **Body Paragraphs (2-3):** This is the most important part. Do not just repeat the resume. Instead, highlight 2-3 of the most relevant qualifications or experiences from the resume and connect them directly to the key requirements in the job description. Use specific examples and quantifiable achievements where possible.
    *   **Closing Paragraph:** Reiterate interest in the role and the company. Mention a strong desire to discuss qualifications further in an interview.
    *   **Professional Closing:** End with "Sincerely," followed by the candidate's name (you don't need to know the name, just the closing).
3.  **Tone:** The tone should be professional, confident, and enthusiastic, but also authentic. Avoid overly generic phrases.
4.  **Personalization:** Address the cover letter to the "Hiring Manager" if no specific name is available. Reference {{{companyName}}} and the {{{jobTitle}}} specifically.

The output MUST be a structured JSON object adhering to the provided schema, containing only the generated cover letter text.

Candidate's Resume:
{{{resumeContent}}}

Job Description:
{{{jobDescription}}}
`,
});

const generateCoverLetterFlow = ai.defineFlow(
  {
    name: 'generateCoverLetterFlow',
    inputSchema: GenerateCoverLetterInputSchema,
    outputSchema: GenerateCoverLetterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
