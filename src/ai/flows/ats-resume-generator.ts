
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
import { StructuredResumeSchema } from '@/lib/types';


const GenerateAtsFriendlyResumeInputSchema = z.object({
  resumeContent: z.string().describe('The original content of the resume.'),
  jobDescription: z.string().describe('The job description to tailor the resume to.'),
  previousAttempt: z
    .object({
      resume: z.string().describe("The previously generated resume text."),
      score: z.number().describe("The score of the previously generated resume."),
      feedback: z.string().optional().describe("User feedback on the previous attempt."),
    })
    .optional()
    .describe(
      'A previously generated resume and its score, for iterative improvement.'
    ),
});
export type GenerateAtsFriendlyResumeInput = z.infer<typeof GenerateAtsFriendlyResumeInputSchema>;

const GenerateAtsFriendlyResumeOutputSchema = z.object({
  atsFriendlyResume: StructuredResumeSchema.describe('The rewritten, ATS-friendly version of the resume in a structured format.'),
  atsFriendlyResumeText: z.string().describe('The rewritten resume as a single block of plain text for display and copy-paste.'),
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

The output MUST be a structured JSON object adhering to the provided schema. The resume should be broken down into sections (like "Professional Summary", "Work Experience", "Education", "Skills").
Each section must have a heading and an array of content elements.
Content elements can be of these types:
- 'paragraph': For summary text.
- 'subheading': For job titles or degree names.
- 'detail': For company names, locations, or dates.
- 'bullet': For list items under work experience or skills.

Focus on the following:
1.  **Keyword Integration:** Seamlessly integrate relevant keywords, skills, and qualifications from the job description into the resume.
2.  **Formatting:** Ensure the resume uses a clean, simple, and standard format that is easily parsable by ATS. Use standard section headers.
3.  **Action Verbs & Quantifiable Achievements:** Start bullet points with strong action verbs and include quantifiable results wherever possible (e.g., "Increased X by Y%", "Managed a team of Z").
4.  **Clarity and Conciseness:** Rewrite sentences to be clear, concise, and impactful.

{{#if previousAttempt}}
This is a regeneration request. The user was not satisfied with the previous version.
Previous Resume Text:
{{{previousAttempt.resume}}}

Previous Score: {{previousAttempt.score}}
{{#if previousAttempt.feedback}}
Previous Feedback: {{previousAttempt.feedback}}
{{/if}}

You MUST make significant improvements to the resume to increase the score. Analyze the previous attempt and its shortcomings. Focus on incorporating more keywords from the job description and strengthening the achievements listed to achieve a higher ATS score. The new structured resume must be demonstrably better.
{{/if}}

Do not invent new information. Base the rewritten resume entirely on the content of the original resume and the target job description.

After creating the structured resume, you MUST provide:
- **atsFriendlyResume**: The structured JSON version of the resume.
- **atsFriendlyResumeText**: A plain text version of the resume, suitable for display in a textarea. Combine all structured content into a single string with appropriate line breaks.
- **atsScore**: A score from 0 to 100 indicating how well the rewritten resume aligns with the job description and ATS best practices. This score should be higher than the previous score if this is a regeneration.
- **scoreAnalysis**: A very brief, one-sentence analysis of the score. Examples: "Excellent match!", "Good, but some optimization is recommended.", "Needs significant improvement for ATS compatibility."
- **keyImprovements**: A bulleted list of the most important improvements you made.

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
