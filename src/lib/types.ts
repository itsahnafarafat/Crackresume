
import { z } from 'zod';
import type { User as FirebaseUser } from 'firebase/auth';
import type { Timestamp } from 'firebase/firestore';


export interface Job {
    id: string;
    userId: string;
    companyName: string;
    jobTitle: string;
    location: string;
    applicationDate: string | { toDate: () => Date };
    status: 'Saved' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';
    notes?: string;
    jobDescription?: string;
}

export interface UserData extends FirebaseUser {
    isAdmin?: boolean;
    isPro?: boolean;
    resumeContent?: string;
    onboardingComplete?: boolean;
    jobPreferences?: {
        jobTitles?: string;
        jobLevel?: string;
        jobLocation?: string;
    };
    usage?: {
        resumeGenerations: number;
        coverLetterGenerations: number;
        jobMatchAnalyses: number;
        lastReset: Timestamp;
    }
}

export const BlogPostSchema = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  author: z.string(),
  date: z.any().describe("Can be a string or a Firestore Timestamp."),
  content: z.string(),
});
export type BlogPost = z.infer<typeof BlogPostSchema>;

export const ManagePostInputSchema = z.object({
    action: z.enum(['create', 'update', 'delete']),
    userId: z.string().describe("The UID of the user performing the action."),
    postId: z.string().optional().describe("The ID of the post (for update/delete)."),
    postData: BlogPostSchema.omit({ date: true }).optional().describe("The post data (for create/update).")
});
export type ManagePostInput = z.infer<typeof ManagePostInputSchema>;

export const ManagePostOutputSchema = z.object({
    success: z.boolean(),
    error: z.string().optional(),
});
export type ManagePostOutput = z.infer<typeof ManagePostOutputSchema>;


const PersonalDetailsSchema = z.object({
    name: z.string().describe('Full name of the candidate.'),
    email: z.string().optional().describe('Email address.'),
    phone: z.string().optional().describe('Phone number.'),
    linkedin: z.string().optional().describe('LinkedIn profile URL.'),
});

const ResumeSectionSchema = z.object({
    heading: z.string().describe('The heading for this section (e.g., "Professional Summary", "Work Experience", "Skills").'),
    content: z.array(
        z.object({
            type: z.enum(['paragraph', 'bullet', 'subheading', 'detail']).describe('The type of content element.'),
            text: z.string().describe('The text content of the element.'),
        })
    ).describe('An array of content elements within the section.'),
});

export const StructuredResumeSchema = z.object({
    personalDetails: PersonalDetailsSchema,
    sections: z.array(ResumeSectionSchema),
});

export type StructuredResume = z.infer<typeof StructuredResumeSchema>;
