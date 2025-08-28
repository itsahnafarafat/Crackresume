
// This file is no longer used for displaying blog posts, which are now fetched from Firestore.
// It can be kept for reference or as a backup, but it is not connected to the live application.
// To add or edit posts, use the new Admin Dashboard.
import type { BlogPost } from './types';

export const blogPosts: BlogPost[] = [
  {
    slug: 'mastering-the-ats',
    title: 'Mastering the ATS: How to Beat the Robots and Land an Interview',
    excerpt: 'Applicant Tracking Systems (ATS) are the gatekeepers of modern recruiting. This guide breaks down exactly how to format your resume to get past the bots.',
    author: 'Jane Doe, Career Expert',
    date: '2024-08-15',
    imageUrl: 'https://picsum.photos/600/400?random=1',
    content: `
      <p class="lead">Applicant Tracking Systems (ATS) are used by over 98% of Fortune 500 companies to screen candidates. If your resume isn't optimized for these systems, it might never be seen by a human eye. Here’s how to ensure your resume makes the cut.</p>
      <h2>1. Use Standard Formatting</h2>
      <p>Avoid tables, columns, and graphics. ATS parsers prefer a simple, single-column layout. Use standard section headings like "Work Experience," "Education," and "Skills."</p>
      <h2>2. Integrate Keywords from the Job Description</h2>
      <p>The ATS scans for keywords from the job description to determine if you're a good match. Mirror the language used in the posting. If it asks for "project management," use that exact phrase, not "managed projects."</p>
      <h2>3. Choose the Right File Type</h2>
      <p>Unless specified otherwise, submit your resume as a .docx file. Some older ATS systems can struggle with parsing PDFs correctly, although this is becoming less common.</p>
      <h2>4. Use Standard Fonts</h2>
      <p>Stick to universally recognized fonts like Times New Roman, Arial, or Calibri. Avoid decorative or script fonts that the ATS may not be able to read.</p>
      <p>By following these simple rules, you dramatically increase your chances of getting your resume into the hands of a hiring manager.</p>
    `,
  },
  {
    slug: 'quantify-your-achievements',
    title: 'From "Did" to "Done": How to Quantify Your Achievements',
    excerpt: 'Transform your resume from a list of responsibilities to a powerful showcase of your impact. Learn how to use numbers to tell your professional story.',
    author: 'John Smith, Hiring Manager',
    date: '2024-08-10',
    imageUrl: 'https://picsum.photos/600/400?random=2',
    content: `
      <p class="lead">The single most effective way to improve your resume is to quantify your achievements. Instead of saying what you *did*, show what you *achieved*. This shifts the focus from responsibilities to results.</p>
      <h2>Why Quantify?</h2>
      <p>Numbers provide context and scale. "Increased sales" is vague. "Increased sales by 25% ($50,000) in Q3 by implementing a new lead-generation strategy" is a powerful statement of your impact.</p>
      <h2>Examples of Quantification</h2>
      <ul>
        <li><strong>Instead of:</strong> "Managed social media accounts."</li>
        <li><strong>Try:</strong> "Grew social media engagement by 150% across three platforms, resulting in a 20% increase in web traffic."</li>
        <li><strong>Instead of:</strong> "Trained new employees."</li>
        <li><strong>Try:</strong> "Developed and implemented a new onboarding program that reduced new hire ramp-up time by 30%."</li>
      </ul>
      <h2>What if I Don't Have Exact Numbers?</h2>
      <p>You can still quantify! Use estimates, ranges, or scale. For example: "Managed a portfolio of over 50 client accounts" or "Streamlined a process that saved an estimated 10+ hours per week for a team of 5."</p>
    `,
  },
   {
    slug: 'the-power-of-the-summary',
    title: 'The Power of the Professional Summary',
    excerpt: 'Your professional summary is the first thing a recruiter reads. Learn how to write a compelling introduction that hooks them in seconds.',
    author: 'Emily White, Recruiter',
    date: '2024-08-05',
    imageUrl: 'https://picsum.photos/600/400?random=3',
    content: `
      <p class="lead">Think of your professional summary as a 30-second elevator pitch. It needs to be concise, powerful, and tailored to the job you're applying for. A great summary can convince a recruiter to keep reading.</p>
      <h2>Elements of a Strong Summary</h2>
      <ol>
        <li><strong>Your Title & Experience:</strong> Start with your professional title and years of experience. E.g., "Accomplished Marketing Manager with 8+ years of experience..."</li>
        <li><strong>Key Skills:</strong> Mention 2-3 of your most relevant skills that align with the job description.</li>
        <li><strong>A Key Achievement:</strong> Include a quantifiable achievement that showcases your value. E.g., "...proven track record of launching products that have generated over $10M in revenue."</li>
        <li><strong>Your Goal (Optional):</strong> Briefly state what you're seeking. E.g., "...seeking to leverage my skills in a senior leadership role."</li>
      </ol>
      <h2>Example Summary</h2>
      <blockquote>
        "Accomplished Marketing Manager with 8+ years of experience in the B2B SaaS sector. Expert in digital strategy, demand generation, and marketing automation. Proven track record of launching products that have generated over $10M in revenue. Seeking to leverage my skills to drive growth in a senior leadership role."
      </blockquote>
      <p>Keep it under 4 lines. This short, punchy paragraph is your best chance to make a great first impression.</p>
    `,
  },
];
