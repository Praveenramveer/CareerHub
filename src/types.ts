export type CareerMode =
  | "general"
  | "roadmap"
  | "resume"
  | "interview"
  | "skill_gap"
  | "job_description";

export type AppTab = "advisor" | "resume" | "jobs";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  mode?: CareerMode;
  feedback?: "helpful" | "not_helpful";
}

export interface EducationHistoryItem {
  level: "10th" | "12th" | "Diploma" | "Undergraduate" | "Postgraduate" | "Other";
  institution: string;
  boardOrUniversity?: string;
  streamOrMajor?: string;
  completionYear?: string;
  percentageOrCgpa?: string;
}

export interface WorkExperienceItem {
  id: string;
  role: string;
  company: string;
  location?: string;
  duration?: string;
  description?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  techStack?: string;
  link?: string;
  description?: string;
}

export interface CareerProfile {
  // Identity & Contact
  fullName?: string;
  email?: string;
  phone?: string;
  photo?: string; // base64 or URL
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;

  // College & Current Academics
  collegeName?: string;
  collegeYear?: string; // e.g., "1st Year", "2nd Year", "3rd Year", "4th Year / Final Year", "Graduated"
  degreeBranch?: string; // e.g., "B.Tech Computer Science and Engineering"
  currentCgpa?: string; // e.g., "8.75 CGPA" or "85%"
  expectedGraduationYear?: string; // e.g., "2026"

  // Previous Studies
  twelfthSchool?: string;
  twelfthBoard?: string;
  twelfthPercentage?: string;
  twelfthYear?: string;

  tenthSchool?: string;
  tenthBoard?: string;
  tenthPercentage?: string;
  tenthYear?: string;

  previousEducationList?: EducationHistoryItem[];

  // Professional & Skills
  currentRole?: string;
  targetRole?: string;
  industry?: string;
  experienceLevel?: string;
  skills?: string[];
  targetSkills?: string[];
  careerGoals?: string[];
  summary?: string;

  // Work & Projects
  experiences?: WorkExperienceItem[];
  projects?: ProjectItem[];
  certifications?: string[];
  achievements?: string[];

  // Preferences & Logistics
  education?: string;
  location?: string;
  workPreferences?: string;
  salaryExpectations?: string;
  timeline?: string;
  careerChallenges?: string;
}

export interface GeneratedResume {
  fullName: string;
  contact: {
    email?: string;
    phone?: string;
    location?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
  };
  summary: string;
  education: {
    institution: string;
    degree: string;
    year: string;
    scoreOrCgpa?: string;
    details?: string;
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  experience: {
    role: string;
    company: string;
    period: string;
    bullets: string[];
  }[];
  projects: {
    title: string;
    techStack?: string;
    link?: string;
    bullets: string[];
  }[];
  certifications?: string[];
  achievements?: string[];
  updatedAt?: number;
}

export interface UnstopJob {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: "Internship" | "Full-Time" | "Hiring Challenge" | "Hackathon";
  stipendOrSalary: string;
  eligibility: string;
  matchPercentage: number;
  matchReason: string;
  matchingSkills: string[];
  missingSkills?: string[];
  applyUrl: string;
  deadline: string;
  postedDate?: string;
  applicantsCount?: string;
  isUnstopVerified?: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  isVerified: boolean;
  registeredAt: number;
  verificationToken?: string;
  authProvider: "email" | "google";
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  mode: CareerMode;
}
