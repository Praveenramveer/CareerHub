import React, { useState } from "react";
import {
  X,
  Sparkles,
  Save,
  User,
  GraduationCap,
  BookOpen,
  Briefcase,
  Code,
  Link,
  Plus,
  Trash2,
  Upload,
  Linkedin,
} from "lucide-react";
import { CareerProfile, WorkExperienceItem, ProjectItem } from "../types";
import { LinkedInImportModal } from "./LinkedInImportModal";
import { onKeyEnterOrSpace } from "../utils/keyboardAccessibility";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CareerProfile;
  onSave: (updatedProfile: CareerProfile) => void;
  theme: "dark" | "light";
}

type TabKey = "basic" | "college" | "previous_studies" | "skills" | "projects_exp";

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  theme,
}) => {
  if (!isOpen) return null;

  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState<TabKey>("basic");
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Basic
    fullName: profile.fullName || "",
    email: profile.email || "",
    phone: profile.phone || "",
    photo: profile.photo || "",
    location: profile.location || "",
    linkedinUrl: profile.linkedinUrl || "",
    githubUrl: profile.githubUrl || "",
    portfolioUrl: profile.portfolioUrl || "",

    // College / Academics
    collegeName: profile.collegeName || "",
    collegeYear: profile.collegeYear || "3rd Year",
    degreeBranch: profile.degreeBranch || "",
    currentCgpa: profile.currentCgpa || "",
    expectedGraduationYear: profile.expectedGraduationYear || "2026",

    // Previous Studies
    twelfthSchool: profile.twelfthSchool || "",
    twelfthBoard: profile.twelfthBoard || "",
    twelfthPercentage: profile.twelfthPercentage || "",
    twelfthYear: profile.twelfthYear || "",

    tenthSchool: profile.tenthSchool || "",
    tenthBoard: profile.tenthBoard || "",
    tenthPercentage: profile.tenthPercentage || "",
    tenthYear: profile.tenthYear || "",

    // Career & Skills
    currentRole: profile.currentRole || "",
    targetRole: profile.targetRole || "",
    industry: profile.industry || "",
    experienceLevel: profile.experienceLevel || "Student / Fresher",
    skillsStr: (profile.skills || []).join(", "),
    targetSkillsStr: (profile.targetSkills || []).join(", "),
    goalsStr: (profile.careerGoals || []).join(", "),
    summary: profile.summary || "",
    workPreferences: profile.workPreferences || "",
    salaryExpectations: profile.salaryExpectations || "",
  });

  // Experiences & Projects lists
  const [experiences, setExperiences] = useState<WorkExperienceItem[]>(
    profile.experiences && profile.experiences.length > 0
      ? profile.experiences
      : [
          {
            id: "exp-1",
            role: "Software Engineering Intern",
            company: "Tech Solutions Inc.",
            duration: "Jun 2024 - Aug 2024",
            description: "Developed RESTful APIs with Node.js and improved database query efficiency.",
          },
        ]
  );

  const [projects, setProjects] = useState<ProjectItem[]>(
    profile.projects && profile.projects.length > 0
      ? profile.projects
      : [
          {
            id: "proj-1",
            title: "Full-Stack Job Recommendation Engine",
            techStack: "React, Node.js, TypeScript, PostgreSQL",
            link: "https://github.com/example/job-engine",
            description: "Engineered real-time algorithmic matching platform parsing candidate resumes against job requisitions.",
          },
        ]
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Please select an image smaller than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({ ...prev, photo: event.target?.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        id: "exp-" + Date.now(),
        role: "",
        company: "",
        duration: "",
        description: "",
      },
    ]);
  };

  const handleRemoveExperience = (id: string) => {
    setExperiences((prev) => prev.filter((e) => e.id !== id));
  };

  const handleAddProject = () => {
    setProjects((prev) => [
      ...prev,
      {
        id: "proj-" + Date.now(),
        title: "",
        techStack: "",
        link: "",
        description: "",
      },
    ]);
  };

  const handleRemoveProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: CareerProfile = {
      ...profile,
      fullName: formData.fullName.trim() || undefined,
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      photo: formData.photo || undefined,
      location: formData.location.trim() || undefined,
      linkedinUrl: formData.linkedinUrl.trim() || undefined,
      githubUrl: formData.githubUrl.trim() || undefined,
      portfolioUrl: formData.portfolioUrl.trim() || undefined,

      collegeName: formData.collegeName.trim() || undefined,
      collegeYear: formData.collegeYear.trim() || undefined,
      degreeBranch: formData.degreeBranch.trim() || undefined,
      currentCgpa: formData.currentCgpa.trim() || undefined,
      expectedGraduationYear: formData.expectedGraduationYear.trim() || undefined,

      twelfthSchool: formData.twelfthSchool.trim() || undefined,
      twelfthBoard: formData.twelfthBoard.trim() || undefined,
      twelfthPercentage: formData.twelfthPercentage.trim() || undefined,
      twelfthYear: formData.twelfthYear.trim() || undefined,

      tenthSchool: formData.tenthSchool.trim() || undefined,
      tenthBoard: formData.tenthBoard.trim() || undefined,
      tenthPercentage: formData.tenthPercentage.trim() || undefined,
      tenthYear: formData.tenthYear.trim() || undefined,

      currentRole: formData.currentRole.trim() || undefined,
      targetRole: formData.targetRole.trim() || undefined,
      industry: formData.industry.trim() || undefined,
      experienceLevel: formData.experienceLevel.trim() || undefined,
      summary: formData.summary.trim() || undefined,
      workPreferences: formData.workPreferences.trim() || undefined,
      salaryExpectations: formData.salaryExpectations.trim() || undefined,

      skills: formData.skillsStr
        ? formData.skillsStr
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
      targetSkills: formData.targetSkillsStr
        ? formData.targetSkillsStr
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
      careerGoals: formData.goalsStr
        ? formData.goalsStr
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,

      experiences: experiences.filter((e) => e.role || e.company),
      projects: projects.filter((p) => p.title),
    };

    onSave(updated);
    onClose();
  };

  const tabs: { key: TabKey; label: string; icon: any }[] = [
    { key: "basic", label: "Identity & Social Links", icon: User },
    { key: "college", label: "College & Academics", icon: GraduationCap },
    { key: "previous_studies", label: "12th & 10th Studies", icon: BookOpen },
    { key: "skills", label: "Skills & Goals", icon: Code },
    { key: "projects_exp", label: "Projects & Internships", icon: Briefcase },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div
        className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh] ${
          isDark
            ? "bg-slate-900 border-slate-700/80 text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 sm:p-5 border-b flex items-center justify-between ${
            isDark ? "border-slate-800 bg-slate-900/90" : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg sm:text-xl">
                Career Context Memory & Profile
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                All details required for AI Resume generation & Unstop Job matching
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsLinkedInModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-[#0A66C2]/20 transition-all cursor-pointer"
            >
              <Linkedin className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Import from LinkedIn</span>
              <span className="sm:hidden">LinkedIn</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          role="tablist"
          aria-label="Profile edit sections"
          className={`px-4 sm:px-6 pt-3 border-b flex gap-2 overflow-x-auto scrollbar-none ${
            isDark ? "border-slate-800 bg-slate-950/40" : "border-slate-200 bg-slate-100/60"
          }`}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                tabIndex={0}
                onClick={() => setActiveTab(tab.key)}
                onKeyDown={onKeyEnterOrSpace(() => setActiveTab(tab.key))}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap border-b-2 cursor-pointer ${
                  isActive
                    ? isDark
                      ? "bg-slate-800/80 text-sky-400 border-sky-400 shadow-sm"
                      : "bg-white text-sky-700 border-sky-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 border-transparent"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: IDENTITY & SOCIAL LINKS */}
          {activeTab === "basic" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl border border-sky-500/20 bg-sky-500/5">
                <div className="relative group">
                  {formData.photo ? (
                    <img
                      src={formData.photo}
                      alt="Profile"
                      className="w-20 h-20 rounded-2xl object-cover ring-2 ring-sky-500/50 shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-800 flex items-center justify-center text-slate-400 ring-2 ring-white/10">
                      <User className="w-9 h-9" />
                    </div>
                  )}
                  <label
                    htmlFor="photo-upload"
                    className="absolute -bottom-2 -right-2 p-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white cursor-pointer shadow-lg transition-transform active:scale-95"
                    title="Upload Profile Photo"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-sm font-semibold text-sky-400">Profile Photo</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Upload an avatar or professional photo for your resume header and account.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Or enter image URL (https://...)"
                      value={formData.photo}
                      onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                      className={`flex-1 text-xs px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"
                      }`}
                    />
                    {formData.photo && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, photo: "" })}
                        className="text-xs text-rose-400 hover:underline px-2"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Veer Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full text-sm px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ram2veer007@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full text-sm px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full text-sm px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Location / City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru, India"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className={`w-full text-sm px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"
                    }`}
                  />
                </div>
              </div>

              {/* Social URLs */}
              <div className="pt-2 border-t border-slate-800/60 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Link className="w-3.5 h-3.5 text-sky-400" />
                  Professional Profile URLs
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.linkedin.com/in/your-profile"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      className={`w-full text-sm px-3.5 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      GitHub Profile URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/your-username"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      className={`w-full text-sm px-3.5 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Portfolio or Personal Website URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://yourportfolio.dev"
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      className={`w-full text-sm px-3.5 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COLLEGE & ACADEMICS */}
          {activeTab === "college" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 text-xs text-indigo-300 flex items-start gap-2.5">
                <GraduationCap className="w-4 h-4 mt-0.5 text-indigo-400 shrink-0" />
                <span>
                  Crucial for Unstop eligibility filtering: top recruiters on Unstop filter candidates by currently studying college year and current CGPA score.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    College / University Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vellore Institute of Technology / IIT Delhi / Anna University"
                    value={formData.collegeName}
                    onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    className={`w-full text-sm px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Degree & Specialization / Branch *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech Computer Science & Engineering"
                    value={formData.degreeBranch}
                    onChange={(e) => setFormData({ ...formData, degreeBranch: e.target.value })}
                    className={`w-full text-sm px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Currently Studying College Year *
                  </label>
                  <select
                    value={formData.collegeYear}
                    onChange={(e) => setFormData({ ...formData, collegeYear: e.target.value })}
                    className={`w-full text-sm px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                    }`}
                  >
                    <option value="1st Year">1st Year (Fresher)</option>
                    <option value="2nd Year">2nd Year (Sophomore)</option>
                    <option value="3rd Year">3rd Year (Pre-Final Year)</option>
                    <option value="4th Year / Final Year">4th Year / Final Year (Graduating Batch)</option>
                    <option value="Postgraduate / Master's">Postgraduate / Master's (M.Tech / MCA / MS / MBA)</option>
                    <option value="Graduated">Graduated / Alum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Current CGPA / Percentage *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 8.75 CGPA or 86%"
                    value={formData.currentCgpa}
                    onChange={(e) => setFormData({ ...formData, currentCgpa: e.target.value })}
                    className={`w-full text-sm px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Expected Graduation Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2026 or 2027"
                    value={formData.expectedGraduationYear}
                    onChange={(e) => setFormData({ ...formData, expectedGraduationYear: e.target.value })}
                    className={`w-full text-sm px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PREVIOUS STUDIES DETAILS */}
          {activeTab === "previous_studies" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* 12th / Senior Secondary */}
              <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-800/40 border-slate-700/60" : "bg-slate-50 border-slate-200"}`}>
                <h4 className="text-sm font-semibold text-sky-400 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Class 12th / Senior Secondary / Junior College
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">School / Junior College Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Delhi Public School / Narayana Junior College"
                      value={formData.twelfthSchool}
                      onChange={(e) => setFormData({ ...formData, twelfthSchool: e.target.value })}
                      className={`w-full text-sm px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        isDark ? "bg-slate-850 border-slate-700" : "bg-white border-slate-300"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Board / Council</label>
                    <input
                      type="text"
                      placeholder="e.g. CBSE / ICSE / State Board"
                      value={formData.twelfthBoard}
                      onChange={(e) => setFormData({ ...formData, twelfthBoard: e.target.value })}
                      className={`w-full text-sm px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        isDark ? "bg-slate-850 border-slate-700" : "bg-white border-slate-300"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Percentage / Score</label>
                    <input
                      type="text"
                      placeholder="e.g. 94.2% or 9.5 CGPA"
                      value={formData.twelfthPercentage}
                      onChange={(e) => setFormData({ ...formData, twelfthPercentage: e.target.value })}
                      className={`w-full text-sm px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        isDark ? "bg-slate-850 border-slate-700" : "bg-white border-slate-300"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Passing Year</label>
                    <input
                      type="text"
                      placeholder="e.g. 2022"
                      value={formData.twelfthYear}
                      onChange={(e) => setFormData({ ...formData, twelfthYear: e.target.value })}
                      className={`w-full text-sm px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        isDark ? "bg-slate-850 border-slate-700" : "bg-white border-slate-300"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* 10th / Secondary */}
              <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-800/40 border-slate-700/60" : "bg-slate-50 border-slate-200"}`}>
                <h4 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Class 10th / Secondary School
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">School Name</label>
                    <input
                      type="text"
                      placeholder="e.g. St. Xavier's High School"
                      value={formData.tenthSchool}
                      onChange={(e) => setFormData({ ...formData, tenthSchool: e.target.value })}
                      className={`w-full text-sm px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        isDark ? "bg-slate-850 border-slate-700" : "bg-white border-slate-300"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Board</label>
                    <input
                      type="text"
                      placeholder="e.g. CBSE / ICSE / State"
                      value={formData.tenthBoard}
                      onChange={(e) => setFormData({ ...formData, tenthBoard: e.target.value })}
                      className={`w-full text-sm px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        isDark ? "bg-slate-850 border-slate-700" : "bg-white border-slate-300"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Percentage / Score</label>
                    <input
                      type="text"
                      placeholder="e.g. 96.0% or 10 CGPA"
                      value={formData.tenthPercentage}
                      onChange={(e) => setFormData({ ...formData, tenthPercentage: e.target.value })}
                      className={`w-full text-sm px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        isDark ? "bg-slate-850 border-slate-700" : "bg-white border-slate-300"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Passing Year</label>
                    <input
                      type="text"
                      placeholder="e.g. 2020"
                      value={formData.tenthYear}
                      onChange={(e) => setFormData({ ...formData, tenthYear: e.target.value })}
                      className={`w-full text-sm px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        isDark ? "bg-slate-850 border-slate-700" : "bg-white border-slate-300"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SKILLS & GOALS */}
          {activeTab === "skills" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Target Role *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer / SDE Intern / AI Engineer"
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    className={`w-full text-sm px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Experience Level
                  </label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    className={`w-full text-sm px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                    }`}
                  >
                    <option value="Student / Fresher">Student / Fresher</option>
                    <option value="Intern (0-1 yr)">Intern (0-1 yr)</option>
                    <option value="Junior Engineer (1-3 yrs)">Junior Engineer (1-3 yrs)</option>
                    <option value="Mid-Level (3-5 yrs)">Mid-Level (3-5 yrs)</option>
                    <option value="Senior (5+ yrs)">Senior (5+ yrs)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Core Skills (comma-separated) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, TypeScript, Python, Data Structures, SQL, Node.js, Git"
                  value={formData.skillsStr}
                  onChange={(e) => setFormData({ ...formData, skillsStr: e.target.value })}
                  className={`w-full text-sm px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Target Skills to Learn (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. System Design, Docker, Kubernetes, AWS, Next.js"
                  value={formData.targetSkillsStr}
                  onChange={(e) => setFormData({ ...formData, targetSkillsStr: e.target.value })}
                  className={`w-full text-sm px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Professional Bio / Executive Summary (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="A short summary of who you are and your passion. If left blank, AI will craft a high-impact summary from your details."
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className={`w-full text-sm px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"
                  }`}
                />
              </div>
            </div>
          )}

          {/* TAB 5: PROJECTS & EXPERIENCES */}
          {activeTab === "projects_exp" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Projects */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-sky-400 flex items-center gap-1.5">
                      <Code className="w-4 h-4" />
                      Key Projects ({projects.length})
                    </h4>
                    <p className="text-xs text-slate-400">
                      Showcases your technical execution in your resume and to Unstop recruiters
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Project
                  </button>
                </div>

                <div className="space-y-3.5">
                  {projects.map((proj, idx) => (
                    <div
                      key={proj.id || idx}
                      className={`p-3.5 rounded-xl border relative ${
                        isDark ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveProject(proj.id)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-400 p-1"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Project Title</label>
                          <input
                            type="text"
                            placeholder="e.g. Distributed Cache Engine"
                            value={proj.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setProjects((prev) =>
                                prev.map((p) => (p.id === proj.id ? { ...p, title: val } : p))
                              );
                            }}
                            className={`w-full text-xs px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                              isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-300"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Tech Stack</label>
                          <input
                            type="text"
                            placeholder="e.g. React, Node.js, Redis, Docker"
                            value={proj.techStack || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setProjects((prev) =>
                                prev.map((p) => (p.id === proj.id ? { ...p, techStack: val } : p))
                              );
                            }}
                            className={`w-full text-xs px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                              isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-300"
                            }`}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] text-slate-400 mb-1">GitHub / Live Demo Link</label>
                          <input
                            type="url"
                            placeholder="e.g. https://github.com/user/project"
                            value={proj.link || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setProjects((prev) =>
                                prev.map((p) => (p.id === proj.id ? { ...p, link: val } : p))
                              );
                            }}
                            className={`w-full text-xs px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                              isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-300"
                            }`}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] text-slate-400 mb-1">Key Description / Impact</label>
                          <textarea
                            rows={2}
                            placeholder="e.g. Engineered asynchronous event pipeline handling 5,000 requests/sec with 99.9% uptime."
                            value={proj.description || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setProjects((prev) =>
                                prev.map((p) => (p.id === proj.id ? { ...p, description: val } : p))
                              );
                            }}
                            className={`w-full text-xs px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                              isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-300"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experiences */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-indigo-400 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" />
                      Work & Internship Experience ({experiences.length})
                    </h4>
                    <p className="text-xs text-slate-400">
                      Prior internships or campus leadership roles
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddExperience}
                    className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Experience
                  </button>
                </div>

                <div className="space-y-3.5">
                  {experiences.map((exp, idx) => (
                    <div
                      key={exp.id || idx}
                      className={`p-3.5 rounded-xl border relative ${
                        isDark ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveExperience(exp.id)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-400 p-1"
                        title="Delete experience"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Role / Position</label>
                          <input
                            type="text"
                            placeholder="e.g. SDE Intern"
                            value={exp.role}
                            onChange={(e) => {
                              const val = e.target.value;
                              setExperiences((prev) =>
                                prev.map((item) => (item.id === exp.id ? { ...item, role: val } : item))
                              );
                            }}
                            className={`w-full text-xs px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                              isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-300"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Company / Organization</label>
                          <input
                            type="text"
                            placeholder="e.g. Acme Corp"
                            value={exp.company}
                            onChange={(e) => {
                              const val = e.target.value;
                              setExperiences((prev) =>
                                prev.map((item) => (item.id === exp.id ? { ...item, company: val } : item))
                              );
                            }}
                            className={`w-full text-xs px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                              isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-300"
                            }`}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] text-slate-400 mb-1">Duration / Period</label>
                          <input
                            type="text"
                            placeholder="e.g. May 2024 - July 2024 (2 months)"
                            value={exp.duration || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setExperiences((prev) =>
                                prev.map((item) => (item.id === exp.id ? { ...item, duration: val } : item))
                              );
                            }}
                            className={`w-full text-xs px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                              isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-300"
                            }`}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] text-slate-400 mb-1">Responsibilities & Impact</label>
                          <textarea
                            rows={2}
                            placeholder="e.g. Spearheaded frontend component modernization resulting in 40% faster initial page load."
                            value={exp.description || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setExperiences((prev) =>
                                prev.map((item) => (item.id === exp.id ? { ...item, description: val } : item))
                              );
                            }}
                            className={`w-full text-xs px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                              isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-300"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer Save & Actions */}
          <div
            className={`pt-4 border-t flex items-center justify-between ${
              isDark ? "border-slate-800" : "border-slate-200"
            }`}
          >
            <span className="text-xs text-slate-400">
              Changes instantly update AI Resume & Unstop Job Matching
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isDark
                    ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-lg shadow-sky-600/25 transition-all active:scale-[0.98]"
              >
                <Save className="w-4 h-4" />
                Save Career Context
              </button>
            </div>
          </div>
        </form>

        {/* LinkedIn Import Modal (URL parser and simulated OAuth 2.0) */}
        <LinkedInImportModal
          isOpen={isLinkedInModalOpen}
          onClose={() => setIsLinkedInModalOpen(false)}
          currentProfile={profile}
          onApplyProfile={(updated) => {
            onSave(updated);
            // Also synchronize local form inputs
            setFormData({
              fullName: updated.fullName || "",
              email: updated.email || "",
              phone: updated.phone || "",
              photo: updated.photo || "",
              location: updated.location || "",
              linkedinUrl: updated.linkedinUrl || "",
              githubUrl: updated.githubUrl || "",
              portfolioUrl: updated.portfolioUrl || "",
              collegeName: updated.collegeName || "",
              collegeYear: updated.collegeYear || "3rd Year",
              degreeBranch: updated.degreeBranch || "",
              currentCgpa: updated.currentCgpa || "",
              expectedGraduationYear: updated.expectedGraduationYear || "2026",
              twelfthSchool: updated.twelfthSchool || "",
              twelfthBoard: updated.twelfthBoard || "",
              twelfthPercentage: updated.twelfthPercentage || "",
              twelfthYear: updated.twelfthYear || "",
              tenthSchool: updated.tenthSchool || "",
              tenthBoard: updated.tenthBoard || "",
              tenthPercentage: updated.tenthPercentage || "",
              tenthYear: updated.tenthYear || "",
              currentRole: updated.currentRole || "",
              targetRole: updated.targetRole || "",
              industry: updated.industry || "",
              experienceLevel: updated.experienceLevel || "Student / Fresher",
              skillsStr: (updated.skills || []).join(", "),
              targetSkillsStr: (updated.targetSkills || []).join(", "),
              goalsStr: (updated.careerGoals || []).join(", "),
              summary: updated.summary || "",
              workPreferences: updated.workPreferences || "",
              salaryExpectations: updated.salaryExpectations || "",
            });
            setExperiences(updated.experiences || []);
            setProjects(updated.projects || []);
          }}
          theme={theme}
        />
      </div>
    </div>
  );
};
