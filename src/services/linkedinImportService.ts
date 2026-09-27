import { CareerProfile, WorkExperienceItem, ProjectItem } from "../types";

export interface LinkedInOAuthResult {
  success: boolean;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  scope: string;
  userinfo: {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    headline?: string;
  };
  profile: CareerProfile;
}

export interface LinkedInImportSectionChoice {
  basicInfo: boolean;
  academics: boolean;
  experiences: boolean;
  projects: boolean;
  skills: boolean;
  summary: boolean;
  certifications: boolean;
}

export const DEFAULT_SECTION_CHOICES: LinkedInImportSectionChoice = {
  basicInfo: true,
  academics: true,
  experiences: true,
  projects: true,
  skills: true,
  summary: true,
  certifications: true,
};

export interface LinkedInPresetCandidate {
  key: string;
  name: string;
  headline: string;
  avatar: string;
  collegeOrCompany: string;
  badge: string;
  description: string;
}

export const LINKEDIN_PRESET_CANDIDATES: LinkedInPresetCandidate[] = [
  {
    key: "veersharma",
    name: "Veer Sharma",
    headline: "Pre-Final Year B.Tech CSE @ NIT | SDE Intern | Problem Solver",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    collegeOrCompany: "National Institute of Technology (NIT)",
    badge: "SDE Track",
    description: "Full-stack web systems, algorithmic problem solving, REST APIs, and distributed architectures.",
  },
  {
    key: "priyanair",
    name: "Priya Nair",
    headline: "AI & Machine Learning Researcher | Final Year @ BITS Pilani | PyTorch & GenAI",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    collegeOrCompany: "BITS Pilani",
    badge: "AI / Data Science",
    description: "Deep learning models, natural language processing, LLM evaluation pipelines, and Python engineering.",
  },
  {
    key: "arjunpatel",
    name: "Arjun Patel",
    headline: "Cloud & DevOps Enthusiast | AWS Certified Solutions Architect | Docker & Kubernetes",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    collegeOrCompany: "Delhi Technological University (DTU)",
    badge: "DevOps & Cloud",
    description: "CI/CD pipelines, infrastructure as code, cloud monitoring, container orchestration, and Linux.",
  },
  {
    key: "ananyasen",
    name: "Ananya Sen",
    headline: "Product Engineer & UI/UX Specialist | IIT Delhi | React & TypeScript Enthusiast",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
    collegeOrCompany: "Indian Institute of Technology (IIT) Delhi",
    badge: "Frontend & Product",
    description: "Design systems, accessible web applications, responsive performance, Next.js, and product metrics.",
  },
];

/**
 * Normalizes and extracts handle from any LinkedIn URL
 */
export function extractLinkedInHandle(inputUrl: string): string {
  try {
    let clean = inputUrl.trim();
    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      clean = "https://" + clean;
    }
    const parsed = new URL(clean);
    const parts = parsed.pathname.split("/").filter(Boolean);
    const inIdx = parts.indexOf("in");
    if (inIdx !== -1 && parts[inIdx + 1]) {
      return parts[inIdx + 1].replace(/\/+$/, "");
    }
    return parts[parts.length - 1] || "candidate";
  } catch {
    return inputUrl.replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 30) || "candidate";
  }
}

/**
 * Parse candidate profile details from a LinkedIn URL or raw text using server API
 */
export async function parseLinkedInProfileUrl(
  url: string,
  rawText?: string,
  existingProfile?: CareerProfile
): Promise<CareerProfile> {
  const response = await fetch("/api/career/parse-linkedin-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, rawText, existingProfile }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Failed to parse LinkedIn URL" }));
    throw new Error(err.error || `HTTP error ${response.status}`);
  }

  const data = await response.json();
  if (!data.profile) {
    throw new Error("No profile data received from LinkedIn parser");
  }
  return data.profile as CareerProfile;
}

/**
 * Execute simulated LinkedIn OAuth 2.0 flow
 */
export async function simulateLinkedInOAuth(
  accountKey: string,
  customData?: {
    name?: string;
    headline?: string;
    email?: string;
    college?: string;
    company?: string;
  }
): Promise<LinkedInOAuthResult> {
  const response = await fetch("/api/career/linkedin-oauth-simulate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accountKey, customData }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Simulated OAuth authorization failed" }));
    throw new Error(err.error || `HTTP error ${response.status}`);
  }

  const data = await response.json();
  return data as LinkedInOAuthResult;
}

/**
 * Smart merge function between existing profile and imported LinkedIn profile
 * allowing selective section updates
 */
export function mergeCareerProfiles(
  current: CareerProfile,
  imported: CareerProfile,
  choices: LinkedInImportSectionChoice
): CareerProfile {
  const merged: CareerProfile = { ...current };

  if (choices.basicInfo) {
    if (imported.fullName) merged.fullName = imported.fullName;
    if (imported.email) merged.email = imported.email;
    if (imported.phone) merged.phone = imported.phone;
    if (imported.photo) merged.photo = imported.photo;
    if (imported.location) merged.location = imported.location;
    if (imported.linkedinUrl) merged.linkedinUrl = imported.linkedinUrl;
    if (imported.githubUrl) merged.githubUrl = imported.githubUrl;
    if (imported.portfolioUrl) merged.portfolioUrl = imported.portfolioUrl;
    if (imported.currentRole) merged.currentRole = imported.currentRole;
    if (imported.targetRole) merged.targetRole = imported.targetRole;
    if (imported.industry) merged.industry = imported.industry;
    if (imported.experienceLevel) merged.experienceLevel = imported.experienceLevel;
  }

  if (choices.academics) {
    if (imported.collegeName) merged.collegeName = imported.collegeName;
    if (imported.collegeYear) merged.collegeYear = imported.collegeYear;
    if (imported.degreeBranch) merged.degreeBranch = imported.degreeBranch;
    if (imported.currentCgpa) merged.currentCgpa = imported.currentCgpa;
    if (imported.expectedGraduationYear) merged.expectedGraduationYear = imported.expectedGraduationYear;

    if (imported.twelfthSchool) merged.twelfthSchool = imported.twelfthSchool;
    if (imported.twelfthBoard) merged.twelfthBoard = imported.twelfthBoard;
    if (imported.twelfthPercentage) merged.twelfthPercentage = imported.twelfthPercentage;
    if (imported.twelfthYear) merged.twelfthYear = imported.twelfthYear;

    if (imported.tenthSchool) merged.tenthSchool = imported.tenthSchool;
    if (imported.tenthBoard) merged.tenthBoard = imported.tenthBoard;
    if (imported.tenthPercentage) merged.tenthPercentage = imported.tenthPercentage;
    if (imported.tenthYear) merged.tenthYear = imported.tenthYear;
  }

  if (choices.experiences) {
    if (imported.experiences && imported.experiences.length > 0) {
      // Merge unique by company + role
      const existingList = current.experiences || [];
      const newItems = imported.experiences.filter(
        (imp) =>
          !existingList.some(
            (ex) =>
              ex.company.toLowerCase() === imp.company.toLowerCase() &&
              ex.role.toLowerCase() === imp.role.toLowerCase()
          )
      );
      merged.experiences = [...newItems, ...existingList];
    }
  }

  if (choices.projects) {
    if (imported.projects && imported.projects.length > 0) {
      const existingProjects = current.projects || [];
      const newProjects = imported.projects.filter(
        (imp) =>
          !existingProjects.some(
            (ex) => ex.title.toLowerCase() === imp.title.toLowerCase()
          )
      );
      merged.projects = [...newProjects, ...existingProjects];
    }
  }

  if (choices.skills) {
    const existingSkills = new Set(current.skills || []);
    (imported.skills || []).forEach((s) => existingSkills.add(s));
    merged.skills = Array.from(existingSkills);

    if (imported.targetSkills && imported.targetSkills.length > 0) {
      const existingTargetSkills = new Set(current.targetSkills || []);
      imported.targetSkills.forEach((s) => existingTargetSkills.add(s));
      merged.targetSkills = Array.from(existingTargetSkills);
    }
  }

  if (choices.summary) {
    if (imported.summary) merged.summary = imported.summary;
    if (imported.careerGoals && imported.careerGoals.length > 0) {
      const existingGoals = new Set(current.careerGoals || []);
      imported.careerGoals.forEach((g) => existingGoals.add(g));
      merged.careerGoals = Array.from(existingGoals);
    }
  }

  if (choices.certifications) {
    if (imported.certifications && imported.certifications.length > 0) {
      const existingCerts = new Set(current.certifications || []);
      imported.certifications.forEach((c) => existingCerts.add(c));
      merged.certifications = Array.from(existingCerts);
    }
    if (imported.achievements && imported.achievements.length > 0) {
      const existingAch = new Set(current.achievements || []);
      imported.achievements.forEach((a) => existingAch.add(a));
      merged.achievements = Array.from(existingAch);
    }
  }

  return merged;
}
