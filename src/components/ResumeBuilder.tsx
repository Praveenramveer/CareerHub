import React, { useState, useEffect } from "react";
import {
  FileText,
  Sparkles,
  Download,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Printer,
  Copy,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  RefreshCw,
} from "lucide-react";
import { CareerProfile, GeneratedResume } from "../types";
import { generateResumeService } from "../services/careerService";
import { downloadResumeAsDocx } from "../utils/docxExport";
import { onKeyEnterOrSpace } from "../utils/keyboardAccessibility";

interface ResumeBuilderProps {
  profile: CareerProfile;
  onEditProfile: () => void;
  theme: "dark" | "light";
}

type TemplateStyle = "modern" | "classic" | "tech";

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
  profile,
  onEditProfile,
  theme,
}) => {
  const isDark = theme === "dark";
  const [template, setTemplate] = useState<TemplateStyle>("modern");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copyNotice, setCopyNotice] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Resume state initialized from profile
  const [resume, setResume] = useState<GeneratedResume>(() => {
    // Generate initial resume representation from profile
    return createInitialResume(profile);
  });

  // Calculate profile completeness
  const completeness = calculateCompleteness(profile);

  const handleGenerateAIResume = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    try {
      const generated = await generateResumeService(profile);
      if (generated) {
        setResume({ ...generated, updatedAt: Date.now() });
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Could not generate resume with AI. Using existing profile data.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadDocx = async () => {
    setIsDownloading(true);
    try {
      await downloadResumeAsDocx(resume, `${resume.fullName.replace(/\s+/g, "_")}_Resume.docx`);
    } catch (err: any) {
      alert("Failed to export Word document: " + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const textLines = [
      resume.fullName.toUpperCase(),
      [
        resume.contact.email,
        resume.contact.phone,
        resume.contact.location,
        resume.contact.linkedinUrl,
        resume.contact.githubUrl,
      ]
        .filter(Boolean)
        .join(" | "),
      "",
      "PROFESSIONAL SUMMARY",
      resume.summary,
      "",
      "EDUCATION",
      ...resume.education.map(
        (e) => `${e.institution} — ${e.degree} (${e.year}) | Grade: ${e.scoreOrCgpa || "N/A"}`
      ),
      "",
      "SKILLS",
      ...resume.skills.map((s) => `${s.category}: ${s.items.join(", ")}`),
      "",
      "EXPERIENCE",
      ...resume.experience.flatMap((exp) => [
        `${exp.role} at ${exp.company} (${exp.period})`,
        ...exp.bullets.map((b) => `• ${b}`),
      ]),
      "",
      "PROJECTS",
      ...resume.projects.flatMap((p) => [
        `${p.title} [${p.techStack || ""}]`,
        ...p.bullets.map((b) => `• ${b}`),
      ]),
    ];

    navigator.clipboard.writeText(textLines.join("\n"));
    setCopyNotice(true);
    setTimeout(() => setCopyNotice(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Top Toolbar */}
      <div
        className={`px-4 sm:px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 ${
          isDark ? "bg-[#0F172A] border-[#475569]/30" : "bg-[#F1F5F9] border-[#475569]/20"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl neu-btn text-[#059669]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base sm:text-lg text-[#1E293B] dark:text-white">AI Professional Resume Builder</h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg neu-inset-sm text-[#059669]">
                ATS Optimized
              </span>
            </div>
            <p className="text-xs text-[#475569] dark:text-slate-400 font-medium">
              Generated from Career Context Memory • Downloadable as Word Document (.docx)
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Template Switcher */}
          <div
            role="tablist"
            aria-label="Resume template styles"
            className="flex items-center rounded-xl p-1 neu-inset-sm text-xs"
          >
            <button
              role="tab"
              aria-selected={template === "modern"}
              tabIndex={0}
              onClick={() => setTemplate("modern")}
              onKeyDown={onKeyEnterOrSpace(() => setTemplate("modern"))}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                template === "modern" ? "neu-flat text-[#059669]" : "text-[#475569] dark:text-slate-400"
              }`}
            >
              Modern ATS
            </button>
            <button
              role="tab"
              aria-selected={template === "classic"}
              tabIndex={0}
              onClick={() => setTemplate("classic")}
              onKeyDown={onKeyEnterOrSpace(() => setTemplate("classic"))}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                template === "classic" ? "neu-flat text-[#059669]" : "text-[#475569] dark:text-slate-400"
              }`}
            >
              Classic Executive
            </button>
            <button
              role="tab"
              aria-selected={template === "tech"}
              tabIndex={0}
              onClick={() => setTemplate("tech")}
              onKeyDown={onKeyEnterOrSpace(() => setTemplate("tech"))}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                template === "tech" ? "neu-flat text-[#059669]" : "text-[#475569] dark:text-slate-400"
              }`}
            >
              Tech Clean
            </button>
          </div>

          <button
            onClick={onEditProfile}
            onKeyDown={onKeyEnterOrSpace(onEditProfile)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold neu-btn text-[#475569] dark:text-slate-200 hover:text-[#059669] cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Profile Memory
          </button>

          <button
            onClick={handleGenerateAIResume}
            onKeyDown={onKeyEnterOrSpace(handleGenerateAIResume)}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold neu-btn text-[#059669] hover:neu-flat transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
            {isGenerating ? "Crafting with AI..." : "Rebuild with AI"}
          </button>

          {/* Download Word Document */}
          <button
            onClick={handleDownloadDocx}
            onKeyDown={onKeyEnterOrSpace(handleDownloadDocx)}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold neu-btn-accent cursor-pointer"
            title="Download Word Document (.docx)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Word (.docx)</span>
          </button>
        </div>
      </div>

      {/* Profile Completeness & Notice Bar */}
      <div
        className={`px-6 py-2.5 border-b text-xs flex flex-wrap items-center justify-between gap-3 ${
          isDark ? "bg-[#0F172A] border-[#475569]/30 text-slate-300" : "bg-[#F1F5F9] border-[#475569]/20 text-[#475569]"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#059669]">Profile Completeness: {completeness.percentage}%</span>
          <div className="w-28 h-2 rounded-full neu-inset-sm overflow-hidden p-0.5">
            <div
              className="h-full bg-[#059669] rounded-full transition-all duration-500"
              style={{ width: `${completeness.percentage}%` }}
            ></div>
          </div>
          {completeness.missing.length > 0 && (
            <span className="text-[#475569] dark:text-slate-400 font-medium hidden md:inline">
              Tip: Fill in {completeness.missing.slice(0, 2).join(", ")} in Memory for maximum ATS impact.
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1 text-[#475569] dark:text-slate-300 hover:text-[#059669] font-medium transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copyNotice ? "Copied Plain Text!" : "Copy Text"}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 text-[#475569] dark:text-slate-300 hover:text-[#059669] font-medium transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="px-6 py-2 bg-amber-500/15 border-b border-amber-500/30 text-amber-400 text-xs flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="underline text-xs ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Resume Canvas / Document Preview Area */}
      <div className={`flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center transition-colors ${
        isDark ? "bg-[#0F172A]" : "bg-[#F1F5F9]"
      }`}>
        <div
          id="resume-document"
          className={`w-full max-w-[850px] min-h-[1100px] shadow-2xl rounded-2xl transition-all duration-200 text-slate-900 bg-white p-8 sm:p-12 font-sans relative ${
            template === "classic"
              ? "font-serif"
              : template === "tech"
              ? "font-mono text-sm"
              : "font-sans"
          }`}
        >
          {/* HEADER SECTION */}
          <div className="border-b pb-6 border-slate-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {profile.photo && (
                  <img
                    src={profile.photo}
                    alt={resume.fullName}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-[#059669]/40 shadow-sm print:hidden"
                  />
                )}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                    {resume.fullName || "Your Full Name"}
                  </h1>
                  <p className="text-sm font-semibold text-[#059669] mt-0.5">
                    {profile.targetRole || profile.currentRole || "Software Engineer & Technologist"}
                  </p>
                </div>
              </div>

              {/* Contact Icons / Links */}
              <div className="text-xs text-slate-600 space-y-1 sm:text-right">
                <div className="flex items-center sm:justify-end gap-2">
                  {resume.contact.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-500" />
                      {resume.contact.email}
                    </span>
                  )}
                  {resume.contact.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" />
                      {resume.contact.phone}
                    </span>
                  )}
                </div>
                <div className="flex items-center sm:justify-end gap-3">
                  {resume.contact.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {resume.contact.location}
                    </span>
                  )}
                  {resume.contact.linkedinUrl && (
                    <a
                      href={resume.contact.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[#059669] hover:underline"
                    >
                      <Linkedin className="w-3 h-3" />
                      LinkedIn
                    </a>
                  )}
                  {resume.contact.githubUrl && (
                    <a
                      href={resume.contact.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-slate-800 hover:underline"
                    >
                      <Github className="w-3 h-3" />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* PROFESSIONAL SUMMARY */}
          {resume.summary && (
            <div className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-800 border-b border-sky-800/20 pb-1 mb-2">
                Professional Summary
              </h3>
              <p className="text-xs leading-relaxed text-slate-700 text-justify">{resume.summary}</p>
            </div>
          )}

          {/* EDUCATION & ACADEMICS */}
          {resume.education && resume.education.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-800 border-b border-sky-800/20 pb-1 mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                Education & Academic Credentials
              </h3>
              <div className="space-y-3">
                {resume.education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{edu.institution}</div>
                      <div className="text-slate-700">{edu.degree}</div>
                      {edu.details && <div className="text-[11px] text-slate-500">{edu.details}</div>}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-slate-600 font-medium">{edu.year}</div>
                      {edu.scoreOrCgpa && (
                        <div className="font-bold text-sky-800 text-[11px]">
                          Grade / CGPA: {edu.scoreOrCgpa}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TECHNICAL & PROFESSIONAL SKILLS */}
          {resume.skills && resume.skills.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-800 border-b border-sky-800/20 pb-1 mb-2 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5" />
                Technical & Core Skills
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {resume.skills.map((s, idx) => (
                  <div key={idx} className="flex items-baseline gap-1.5">
                    <span className="font-bold text-slate-900 min-w-[110px]">{s.category}:</span>
                    <span className="text-slate-700">{s.items.join(", ")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WORK & INTERNSHIP EXPERIENCE */}
          {resume.experience && resume.experience.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-800 border-b border-sky-800/20 pb-1 mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                Work & Internship Experience
              </h3>
              <div className="space-y-3.5">
                {resume.experience.map((exp, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span>
                        {exp.role} <span className="font-medium text-sky-800">| {exp.company}</span>
                      </span>
                      <span className="text-slate-500 text-[11px] font-normal">{exp.period}</span>
                    </div>
                    <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-slate-700 text-xs">
                      {exp.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="leading-relaxed">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KEY PROJECTS */}
          {resume.projects && resume.projects.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-800 border-b border-sky-800/20 pb-1 mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                Key Projects & Technical Work
              </h3>
              <div className="space-y-3.5">
                {resume.projects.map((proj, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="font-bold text-slate-900">{proj.title}</span>
                        {proj.techStack && (
                          <span className="text-[11px] text-slate-600 font-mono ml-2 italic">
                            [{proj.techStack}]
                          </span>
                        )}
                      </div>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-sky-700 hover:underline flex items-center gap-0.5"
                        >
                          <span>Repository / Demo</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                    <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-slate-700 text-xs">
                      {proj.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="leading-relaxed">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS & HONORS */}
          {resume.certifications && resume.certifications.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-800 border-b border-sky-800/20 pb-1 mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                Certifications & Achievements
              </h3>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                {resume.certifications.map((cert, idx) => (
                  <li key={idx}>{cert}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper to initialize resume data from profile
function createInitialResume(profile: CareerProfile): GeneratedResume {
  const eduItems: GeneratedResume["education"] = [];

  // Current College
  if (profile.collegeName || profile.degreeBranch) {
    eduItems.push({
      institution: profile.collegeName || "University / College",
      degree: `${profile.degreeBranch || "Bachelor of Technology"} (${profile.collegeYear || "Undergraduate"})`,
      year: profile.expectedGraduationYear ? `Graduating ${profile.expectedGraduationYear}` : "Expected 2026",
      scoreOrCgpa: profile.currentCgpa || "",
      details: "Core Computer Science, Algorithms & Software Engineering Coursework",
    });
  }

  // 12th
  if (profile.twelfthSchool) {
    eduItems.push({
      institution: profile.twelfthSchool,
      degree: `Senior Secondary (Class XII) - ${profile.twelfthBoard || "Board"}`,
      year: profile.twelfthYear || "",
      scoreOrCgpa: profile.twelfthPercentage || "",
      details: "Physics, Chemistry, and Mathematics focus",
    });
  }

  // 10th
  if (profile.tenthSchool) {
    eduItems.push({
      institution: profile.tenthSchool,
      degree: `Secondary School Examination (Class X) - ${profile.tenthBoard || "Board"}`,
      year: profile.tenthYear || "",
      scoreOrCgpa: profile.tenthPercentage || "",
    });
  }

  // Fallback if no education entered yet
  if (eduItems.length === 0) {
    eduItems.push({
      institution: "College / University Name",
      degree: "B.Tech in Computer Science & Engineering (3rd Year)",
      year: "2022 - 2026",
      scoreOrCgpa: "8.75 CGPA",
    });
  }

  const skillsList: GeneratedResume["skills"] = [
    {
      category: "Languages & Frameworks",
      items: profile.skills && profile.skills.length > 0 ? profile.skills : ["Java", "Python", "JavaScript", "React", "Node.js"],
    },
    {
      category: "Databases & Tools",
      items: ["SQL", "MongoDB", "Git", "GitHub", "Docker", "VS Code"],
    },
  ];

  const expList: GeneratedResume["experience"] = (profile.experiences && profile.experiences.length > 0)
    ? profile.experiences.map((e) => ({
        role: e.role || "Software Intern",
        company: e.company || "Tech Company",
        period: e.duration || "Summer 2024",
        bullets: e.description
          ? [e.description]
          : ["Developed REST APIs and improved data processing pipelines."],
      }))
    : [
        {
          role: "Software Engineering Intern",
          company: "Tech Labs",
          period: "Jun 2024 - Aug 2024",
          bullets: [
            "Engineered modular REST APIs using Node.js & TypeScript, cutting query response times by 30%.",
            "Designed and implemented automated test suites with Jest, increasing test coverage to 85%.",
          ],
        },
      ];

  const projList: GeneratedResume["projects"] = (profile.projects && profile.projects.length > 0)
    ? profile.projects.map((p) => ({
        title: p.title || "Project",
        techStack: p.techStack || "React, TypeScript",
        link: p.link || "",
        bullets: p.description
          ? [p.description]
          : ["Architected full-stack web application with responsive UI and scalable backend."],
      }))
    : [
        {
          title: "Intelligent Job & Internship Matching Engine",
          techStack: "React, Node.js, Express, Tailwind CSS",
          link: profile.githubUrl || "https://github.com",
          bullets: [
            "Built responsive multi-criteria ranking algorithm matching student skills to corporate hiring challenge specs.",
            "Integrated real-time search filtering across 1,000+ opportunities with sub-50ms latency.",
          ],
        },
      ];

  return {
    fullName: profile.fullName || "Veer Sharma",
    contact: {
      email: profile.email || "ram2veer007@gmail.com",
      phone: profile.phone || "+91 98765 43210",
      location: profile.location || "Bengaluru, India",
      linkedinUrl: profile.linkedinUrl || "https://linkedin.com/in/profile",
      githubUrl: profile.githubUrl || "https://github.com/profile",
      portfolioUrl: profile.portfolioUrl || "",
    },
    summary:
      profile.summary ||
      `Ambitious and results-driven ${profile.targetRole || "Computer Science student"} at ${
        profile.collegeName || "Engineering Institute"
      } (${profile.collegeYear || "3rd Year"}, ${profile.currentCgpa || "8.75 CGPA"}). Proven track record of developing full-stack web solutions and solving algorithmic challenges. Passionate about building robust, high-performance software systems.`,
    education: eduItems,
    skills: skillsList,
    experience: expList,
    projects: projList,
    certifications: profile.certifications || [
      "Meta Front-End Developer Professional Certificate",
      "AWS Certified Cloud Practitioner (Foundational)",
    ],
    achievements: profile.achievements || [
      "Secured Top 5% Rank in National Coding Challenge",
      "Dean's List for Academic Excellence (Consecutive Semesters)",
    ],
  };
}

function calculateCompleteness(p: CareerProfile): { percentage: number; missing: string[] } {
  const fields: { name: string; hasValue: boolean }[] = [
    { name: "Full Name", hasValue: !!p.fullName },
    { name: "Email", hasValue: !!p.email },
    { name: "College Name", hasValue: !!p.collegeName },
    { name: "College Year", hasValue: !!p.collegeYear },
    { name: "Current CGPA", hasValue: !!p.currentCgpa },
    { name: "12th Studies", hasValue: !!p.twelfthSchool },
    { name: "10th Studies", hasValue: !!p.tenthSchool },
    { name: "Skills", hasValue: !!(p.skills && p.skills.length > 0) },
    { name: "Projects", hasValue: !!(p.projects && p.projects.length > 0) },
    { name: "LinkedIn URL", hasValue: !!p.linkedinUrl },
    { name: "GitHub URL", hasValue: !!p.githubUrl },
  ];

  const completed = fields.filter((f) => f.hasValue).length;
  const missing = fields.filter((f) => !f.hasValue).map((f) => f.name);
  const percentage = Math.round((completed / fields.length) * 100);

  return { percentage, missing };
}
