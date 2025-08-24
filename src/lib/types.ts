
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

export type SubscriptionStatus = 'free' | 'active' | 'cancelled' | 'expired' | 'unpaid' | 'on_trial' | 'past_due';


export interface UserData extends FirebaseUser {
    lemonSqueezyId?: string;
    lemonSqueezySubscriptionId?: string;
    subscriptionStatus?: SubscriptionStatus;
    updatePaymentMethodUrl?: string;
    generationsToday?: number;
    lastGenerationDate?: string;
}


export const loginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export const signUpFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
export type SignUpFormData = z.infer<typeof signUpFormSchema>;

export const ResumeSectionSchema = z.object({
    heading: z.string().describe('The heading for this section (e.g., "Professional Summary", "Work Experience", "Skills").'),
    content: z.array(
        z.object({
            type: z.enum(['paragraph', 'bullet', 'subheading', 'detail']).describe('The type of content element.'),
            text: z.string().describe('The text content of the element.'),
        })
    ).describe('An array of content elements within the section.'),
});

export const StructuredResumeSchema = z.array(ResumeSectionSchema);
