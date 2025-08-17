import { z } from 'zod';

export interface Job {
    id: string;
    userId: string;
    companyName: string;
    jobTitle: string;
    location: string;
    applicationDate: string;
    status: 'Saved' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';
    notes?: string;
    jobDescription?: string;
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
