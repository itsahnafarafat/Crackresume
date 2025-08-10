'use server';

/**
 * @fileOverview An AI flow to rewrite a resume to be more ATS-friendly based on a job description.
 *
 * - generateAtsFriendlyResume - A function that takes a resume and job description and returns a rewritten resume.
 * - GenerateAtsFriendlyResumeInput - The input type for the generateAtsFriendlyResume function.
 * - GenerateAtsFriendlyResumeOutput - The return type for the generateAtsFriendlyResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAtsFriendlyResumeInputSchema = z.object({
  resumeContent: z.string().describe('The original content of the resume.'),
  jobDescription: z.string().describe('The job description to tailor the resume to.'),
});
export type GenerateAtsFriendlyResumeInput = z.infer<typeof GenerateAtsFriendlyResumeInputSchema>;

const GenerateAtsFriendlyResumeOutputSchema = z.object({
  atsFriendlyResume: z
    .string()
    .describe('The rewritten, ATS-friendly version of the resume.'),
  atsScore: z
    .number()
    .describe('A score from 0 to 100 representing how ATS-friendly the new resume is.'),
  scoreAnalysis: z.string().describe('A one-sentence analysis of the score (e.g., "Good - Some optimization recommended").'),
  keyImprovements: z.array(z.string()).describe('A list of key improvements made to the resume.'),
});
export type GenerateAtsFriendlyResumeOutput = z.infer<typeof GenerateAtsFriendlyResumeOutputSchema>;

export async function generateAtsFriendlyResume(input: GenerateAtsFriendlyResumeInput): Promise<GenerateAtsFriendlyResumeOutput> {
  return atsResumeGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'atsResumeGeneratorPrompt',
  input: {schema: GenerateAtsFriendlyResumeInputSchema},
  output: {schema: GenerateAtsFriendlyResumeOutputSchema},
  prompt: `You are an expert resume writer specializing in optimizing resumes for Applicant Tracking Systems (ATS).
Your task is to rewrite the provided resume to make it highly compatible with ATS while tailoring it to the specific job description provided.

Focus on the following:
1.  **Keyword Integration:** Seamlessly integrate relevant keywords, skills, and qualifications from the job description into the resume.
2.  **Formatting:** Ensure the resume uses a clean, simple, and standard format that is easily parsable by ATS. Use standard section headers (e.g., "Professional Summary", "Work Experience", "Education", "Skills").
3.  **Action Verbs & Quantifiable Achievements:** Start bullet points with strong action verbs and include quantifiable results wherever possible (e.g., "Increased X by Y%", "Managed a team of Z").
4.  **Clarity and Conciseness:** Rewrite sentences to be clear, concise, and impactful.

Do not invent new information. Base the rewritten resume entirely on the content of the original resume and the target job description.

After rewriting the resume, you MUST provide:
- **atsScore**: A score from 0 to 100 indicating how well the rewritten resume aligns with the job description and ATS best practices.
- **scoreAnalysis**: A very brief, one-sentence analysis of the score. Examples: "Excellent match!", "Good, but some optimization is recommended.", "Needs significant improvement for ATS compatibility."
- **keyImprovements**: A bulleted list of the most important improvements you made.

The output should be the complete, rewritten resume text, the score, the analysis, and the list of improvements.

Original Resume Content:
{{{resumeContent}}}

Target Job Description:
{{{jobDescription}}}
`,
});

const atsResumeGeneratorFlow = ai.defineFlow(
  {
    name: 'atsResumeGeneratorFlow',
    inputSchema: GenerateAtsFriendlyResumeInputSchema,
    outputSchema: GenerateAtsFriendlyResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
