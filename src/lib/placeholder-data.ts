import type { ResumeData } from './types';

export const placeholderData: ResumeData = {
  personalDetails: {
    fullName: 'Jane Doe',
    jobTitle: 'Software Engineer',
    email: 'jane.doe@email.com',
    phoneNumber: '123-456-7890',
    address: 'San Francisco, CA',
    linkedIn: 'linkedin.com/in/janedoe',
    portfolio: 'github.com/janedoe',
  },
  summary:
    'Innovative Software Engineer with 5+ years of experience in developing, testing, and maintaining web applications. Proficient in JavaScript, React, and Node.js. Passionate about creating intuitive user experiences and solving complex problems.',
  experience: [
    {
      id: 'exp1',
      jobTitle: 'Senior Software Engineer',
      company: 'Tech Solutions Inc.',
      location: 'San Francisco, CA',
      startDate: 'Jan 2021',
      endDate: 'Present',
      description: [
        'Lead the development of a new customer-facing dashboard using React and TypeScript, improving user engagement by 25%.',
        'Architected and implemented a scalable microservices backend with Node.js and Express.',
        'Mentored junior developers and conducted code reviews to maintain high-quality standards.',
      ],
    },
    {
      id: 'exp2',
      jobTitle: 'Software Engineer',
      company: 'Web Innovators',
      location: 'Palo Alto, CA',
      startDate: 'Jun 2018',
      endDate: 'Dec 2020',
      description: [
        'Developed and maintained features for a large-scale e-commerce platform.',
        'Collaborated with cross-functional teams to define and ship new features.',
        'Improved application performance by optimizing database queries and frontend rendering.',
      ],
    },
  ],
  education: [
    {
      id: 'edu1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: 'Sep 2014',
      endDate: 'May 2018',
    },
  ],
  skills: [
    { id: 'skill1', name: 'JavaScript (ES6+)' },
    { id: 'skill2', name: 'TypeScript' },
    { id: 'skill3', name: 'React' },
    { id: 'skill4', name: 'Node.js' },
    { id: 'skill5', name: 'Express' },
    { id: 'skill6', name: 'SQL & NoSQL' },
    { id: 'skill7', name: 'Git & GitHub' },
    { id: 'skill8', name: 'Agile Methodologies' },
  ],
};
