export interface PersonalDetails {
  fullName: string;
  jobTitle: string;
  email: string;
  phoneNumber: string;
  address: string;
  linkedIn?: string;
  portfolio?: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface ResumeData {
  personalDetails: PersonalDetails;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
}
