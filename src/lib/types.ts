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
