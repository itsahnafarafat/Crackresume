
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
import { googleAI } from '@genkit-ai/google-genai';


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
  model: googleAI.model('gemini-1.5-flash'),
  prompt: `You are an expert resume writer and career coach specializing in optimizing resumes for Applicant Tracking Systems (ATS).
Your task is to rewrite the provided resume to be highly compatible with ATS while tailoring it to the specific job description provided.

The output MUST be a structured JSON object adhering to the provided schema.

**Core Instructions:**

1.  **Extract and Structure:**
    *   Begin by extracting the candidate's personal details (Name, Email, Phone, LinkedIn).
    *   Structure the resume into standard, ATS-friendly sections: "Professional Summary", "Work Experience", "Education", "Skills".
    *   For 'Work Experience' and 'Education', each entry MUST have a 'subheading' (Job Title/Degree) and a corresponding 'detail' (Company & Location / University & Location). The date range should be included.
    *   For the 'Skills' section, group related skills into a single 'bullet' element, separated by commas, and add a label (e.g., "Languages: JavaScript, Python, Java").

2.  **Content Optimization (This is crucial):**
    *   **Keyword Integration:** Seamlessly integrate keywords, skills, and qualifications from the job description. Don't just list them; weave them into the summary and experience bullet points naturally.
    *   **Action Verbs:** Every bullet point under "Work Experience" MUST start with a strong action verb (e.g., "Orchestrated", "Engineered", "Quantified", "Streamlined").
    *   **Quantifiable Achievements:** This is the most important part. Transform responsibilities into measurable achievements. If the original resume says "Managed social media", you should rewrite it to something like "Increased social media engagement by 45% over 6 months by implementing a new content strategy." If specific numbers aren't available, use project scope or scale as a proxy (e.g., "Led a team of 5 to successfully migrate a monolithic application serving 10,000+ users to a microservices architecture.").
    *   **Clarity and Impact:** Rewrite sentences to be clear, concise, and focused on impact. Each bullet point should answer the question "What was the result of my work?".

{{#if previousAttempt}}
This is a regeneration request. The user was not satisfied with the previous version.
Previous Resume Text:
{{{previousAttempt.resume}}}

Previous Score: {{previousAttempt.score}}
{{#if previousAttempt.feedback}}
User Feedback for this attempt: "{{previousAttempt.feedback}}"

You MUST address this feedback specifically and incorporate it into the new version. For example, if the feedback is "Emphasize my project management skills," you MUST strengthen the project management aspects of the resume. The new structured resume MUST be demonstrably better and reflect the user's feedback.
{{else}}
You MUST make significant improvements to the resume to increase the score. Analyze the previous attempt and its shortcomings. Focus on incorporating more keywords, strengthening the action verbs, and adding more quantifiable achievements to achieve a higher ATS score. The new structured resume must be demonstrably better.
{{/if}}
{{/if}}

Do not invent new work experience. Base the rewritten resume entirely on the content of the original resume and the target job description.

**Example of the Final JSON Output Structure:**

\`\`\`json
{
  "atsFriendlyResume": {
    "personalDetails": {
      "name": "Jane Doe",
      "email": "jane.doe@email.com",
      "phone": "123-456-7890",
      "linkedin": "linkedin.com/in/janedoe"
    },
    "sections": [
      {
        "heading": "Professional Summary",
        "content": [
          { "type": "paragraph", "text": "A brief, impactful summary..." }
        ]
      },
      {
        "heading": "Work Experience",
        "content": [
          { "type": "subheading", "text": "Senior Software Engineer, Tech Corp | Jan 2020 - Present" },
          { "type": "detail", "text": "San Francisco, CA" },
          { "type": "bullet", "text": "Engineered a new feature that increased user engagement by 15%." }
        ]
      }
    ]
  },
  "atsFriendlyResumeText": "Jane Doe\\n123-456-7890 | jane.doe@email.com...",
  "atsScore": 92,
  "scoreAnalysis": "Excellent match, highly optimized.",
  "keyImprovements": [
    "Integrated 15+ keywords from the job description.",
    "Quantified achievements with specific metrics (e.g., 'increased by 15%').",
    "Strengthened the professional summary to align with the role's core requirements."
  ]
}
\`\`\`

After creating the structured resume, you MUST provide a complete JSON object in the format shown above, including all required fields: **atsFriendlyResume**, **atsFriendlyResumeText**, **atsScore**, **scoreAnalysis**, and **keyImprovements**.

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
