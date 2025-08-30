
import type { BlogPost } from './types';

// To add a new blog post, copy one of the existing objects and modify its content.
// Make sure each 'slug' is unique.
export const blogPosts: BlogPost[] = [
    {
        slug: 'mastering-the-ats',
        title: 'How to Write a Resume That Beats the ATS',
        excerpt: 'Learn the secrets to crafting a resume that gets past the robots and into human hands. We cover keywords, formatting, and more.',
        author: 'Jane Doe, Career Expert',
        date: '2024-05-15',
        imageUrl: 'https://picsum.photos/600/400?random=1',
        content: `
            <p class="lead">In today's job market, more than 90% of large companies use Applicant Tracking Systems (ATS) to filter resumes. If your resume isn’t optimized for these systems, it might never be seen by a human recruiter. Here’s how to make sure you beat the bots.</p>
            <h2>1. Keywords are King</h2>
            <p>The ATS scans your resume for keywords that match the job description. Carefully read the job posting and identify key skills, qualifications, and responsibilities. Weave these exact phrases into your resume, especially in your "Skills" and "Work Experience" sections.</p>
            <blockquote>Don't just list skills; demonstrate them within your work experience bullet points for maximum impact.</blockquote>
            <h2>2. Simple Formatting is Better</h2>
            <p>Fancy graphics, columns, and tables can confuse an ATS. Stick to a clean, single-column layout. Use standard fonts like Arial, Calibri, or Times New Roman. Use standard section headings like "Work Experience," "Education," and "Skills."</p>
            <ul>
                <li>Avoid headers and footers.</li>
                <li>Use standard bullet points (circles or squares).</li>
                <li>Submit your resume as a .docx or .pdf file unless specified otherwise.</li>
            </ul>
            <h2>3. Quantify Your Achievements</h2>
            <p>Instead of just listing your duties, show your impact with numbers. For example, instead of saying "Managed social media accounts," try "Increased social media engagement by 45% over six months." This provides concrete evidence of your value.</p>
        `,
    },
    {
        slug: 'ace-the-interview',
        title: '5 Common Interview Questions and How to Answer Them',
        excerpt: 'Prepare for your next interview by mastering the answers to these common, yet tricky, questions. Confidence is key!',
        author: 'John Smith, Recruiter',
        date: '2024-05-10',
        imageUrl: 'https://picsum.photos/600/400?random=2',
        content: `
            <p class="lead">An interview is your chance to shine. Being prepared for common questions can make all the difference. Here are five common questions and a framework for how to answer them effectively.</p>
            <h2>1. "Tell me about yourself."</h2>
            <p>This is your elevator pitch. Don't just recite your resume. Structure your answer around your present, past, and future. Start with your current role, briefly mention past experiences relevant to the job, and end with why you are excited about this specific opportunity.</p>
            <h2>2. "What is your greatest weakness?"</h2>
            <p>The key here is to be honest but strategic. Choose a real weakness, but one that is not critical to the job. More importantly, explain how you are actively working to improve it. For example, "I used to struggle with public speaking, so I joined a local Toastmasters group and have seen a significant improvement in my confidence and delivery."</p>
            <h2>3. "Why do you want to work here?"</h2>
            <p>This requires research. Show that you understand the company's mission, values, and recent achievements. Connect your own skills and career goals to what the company does. Express genuine enthusiasm for their product, service, or culture.</p>
            <blockquote>Your answer should be about what you can do for them, not just what they can do for you.</blockquote>
            <h2>4. "Where do you see yourself in 5 years?"</h2>
            <p>Employers want to see that you have ambition and that your goals align with the opportunities they can provide. Talk about the skills you want to develop and the type of impact you want to make, relating it back to the role you're interviewing for.</p>
            <h2>5. "Do you have any questions for us?"</h2>
            <p>Always say yes! This shows your engagement and interest. Prepare thoughtful questions about the team, the role's challenges, company culture, or opportunities for growth. Avoid asking about salary or benefits until you have an offer.</p>
        `,
    },
];
