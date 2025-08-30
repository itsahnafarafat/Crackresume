
import type { BlogPost } from './types';

// To add a new blog post, copy one of the existing objects and modify its content.
// Make sure each 'slug' is unique.
export const blogPosts: BlogPost[] = [
    {
        slug: 'resume-keywords-for-ats-optimization',
        title: '50 Must-Have Resume Keywords to Beat the ATS in 2025',
        excerpt: 'Discover the top resume keywords that Applicant Tracking Systems (ATS) look for in 2025. Optimize your CV to rank higher and land more interviews.',
        author: 'Unknown, Career Strategist',
        date: '2025-08-30',
        content: `
          <p class="lead">Over 95% of Fortune 500 companies use Applicant Tracking Systems (ATS) to filter job applications. Without the right keywords, your resume may never reach a human recruiter. Here's a comprehensive guide to the top keywords for 2025.</p>
      
          <h2>Why Keywords Matter for ATS</h2>
          <p>ATS software scans resumes for keywords that match the job description. Including the right terms increases your chances of being shortlisted.</p>
      
          <h2>Top 50 Keywords for 2025</h2>
          <p>These keywords are organized by category to help you target the right roles:</p>
      
          <h3>Technical Skills</h3>
          <ul>
              <li>Python</li>
              <li>Cloud Computing</li>
              <li>Data Analysis</li>
              <li>Machine Learning</li>
              <li>Cybersecurity</li>
          </ul>
      
          <h3>Soft Skills</h3>
          <ul>
              <li>Leadership</li>
              <li>Communication</li>
              <li>Problem-Solving</li>
              <li>Time Management</li>
              <li>Collaboration</li>
          </ul>
      
          <h3>Industry-Specific Keywords</h3>
          <p>Tailor your keywords to match industry demands. For example, 'Agile Methodologies' for IT or 'Revenue Growth' for Sales roles.</p>
      
          <blockquote>Pro Tip: Always match keywords directly from the job description for maximum ATS compatibility.</blockquote>
      
          <h2>How to Use These Keywords Effectively</h2>
          <p>Don't just list them in your skills section. Incorporate keywords into your work experience, achievements, and summary statements for better results.</p>
        `
    },     
];
