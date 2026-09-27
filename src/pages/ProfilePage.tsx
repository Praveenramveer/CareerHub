import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  GraduationCap,
  BookOpen,
  Briefcase,
  Code,
  Link as LinkIcon,
  ExternalLink,
  Edit3,
  Check,
  Plus,
  Trash2,
  ChevronLeft,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  Globe,
  Github,
  Linkedin,
  Phone,
  Mail,
  MapPin,
  Award,
  TrendingUp,
  LogOut,
} from "lucide-react";
import { CareerProfile, ProjectItem, WorkExperienceItem, UserAccount } from "../types";
import { LinkedInImportModal } from "../components/LinkedInImportModal";

interface ProfilePageProps {
  profile: CareerProfile;
  onSaveProfile: (updatedProfile: CareerProfile) => void;
  currentUser: UserAccount | null;
  theme: "dark" | "light";
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  onSaveProfile,
  currentUser,
  theme,
}) => {
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const [isEditing, setIsEditing] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);

  // Form State for editing
  const [formData, setFormData] = useState({
    fullName: profile.fullName || "",
    email: profile.email || "",
    phone: profile.phone || "",
    photo: profile.photo || "",
    location: profile.location || "",
    linkedinUrl: profile.linkedinUrl || "",
    githubUrl: profile.githubUrl || "",
    portfolioUrl: profile.portfolioUrl || "",

    // College & Academics
    collegeName: profile.collegeName || "",
    collegeYear: profile.collegeYear || "3rd Year",
    degreeBranch: profile.degreeBranch || "",
    currentCgpa: profile.currentCgpa || "",
    expectedGraduationYear: profile.expectedGraduationYear || "2026",

    // Schooling
    twelfthSchool: profile.twelfthSchool || "",
    twelfthBoard: profile.twelfthBoard || "",
    twelfthPercentage: profile.twelfthPercentage || "",
    twelfthYear: profile.twelfthYear || "",

    tenthSchool: profile.tenthSchool || "",
    tenthBoard: profile.tenthBoard || "",
    tenthPercentage: profile.tenthPercentage || "",
    tenthYear: profile.tenthYear || "",

    // Professional & Ambition
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

  const [experiences, setExperiences] = useState<WorkExperienceItem[]>(
    profile.experiences && profile.experiences.length > 0 ? profile.experiences : []
  );

  const [projects, setProjects] = useState<ProjectItem[]>(
    profile.projects && profile.projects.length > 0 ? profile.projects : []
  );

  // Keep form data and lists in sync when profile prop is updated (e.g. from LinkedIn import or cloud load)
  useEffect(() => {
    setFormData({
      fullName: profile.fullName || "",
      email: profile.email || "",
      phone: profile.phone || "",
      photo: profile.photo || "",
      location: profile.location || "",
      linkedinUrl: profile.linkedinUrl || "",
      githubUrl: profile.githubUrl || "",
      portfolioUrl: profile.portfolioUrl || "",
      collegeName: profile.collegeName || "",
      collegeYear: profile.collegeYear || "3rd Year",
      degreeBranch: profile.degreeBranch || "",
      currentCgpa: profile.currentCgpa || "",
      expectedGraduationYear: profile.expectedGraduationYear || "2026",
      twelfthSchool: profile.twelfthSchool || "",
      twelfthBoard: profile.twelfthBoard || "",
      twelfthPercentage: profile.twelfthPercentage || "",
      twelfthYear: profile.twelfthYear || "",
      tenthSchool: profile.tenthSchool || "",
      tenthBoard: profile.tenthBoard || "",
      tenthPercentage: profile.tenthPercentage || "",
      tenthYear: profile.tenthYear || "",
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
    setExperiences(profile.experiences && profile.experiences.length > 0 ? profile.experiences : []);
    setProjects(profile.projects && profile.projects.length > 0 ? profile.projects : []);
  }, [profile]);

  const handleSave = () => {
    const updated: CareerProfile = {
      ...profile,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      photo: formData.photo,
      location: formData.location,
      linkedinUrl: formData.linkedinUrl,
      githubUrl: formData.githubUrl,
      portfolioUrl: formData.portfolioUrl,

      collegeName: formData.collegeName,
      collegeYear: formData.collegeYear,
      degreeBranch: formData.degreeBranch,
      currentCgpa: formData.currentCgpa,
      expectedGraduationYear: formData.expectedGraduationYear,

      twelfthSchool: formData.twelfthSchool,
      twelfthBoard: formData.twelfthBoard,
      twelfthPercentage: formData.twelfthPercentage,
      twelfthYear: formData.twelfthYear,

      tenthSchool: formData.tenthSchool,
      tenthBoard: formData.tenthBoard,
      tenthPercentage: formData.tenthPercentage,
      tenthYear: formData.tenthYear,

      currentRole: formData.currentRole,
      targetRole: formData.targetRole,
      industry: formData.industry,
      experienceLevel: formData.experienceLevel,

      skills: formData.skillsStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      targetSkills: formData.targetSkillsStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      careerGoals: formData.goalsStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),

      summary: formData.summary,
      workPreferences: formData.workPreferences,
      salaryExpectations: formData.salaryExpectations,

      experiences,
      projects,
    };

    onSaveProfile(updated);
    setIsEditing(false);
    setSaveNotice("Profile changes saved and synced to cloud successfully!");
    setTimeout(() => setSaveNotice(null), 4000);
  };

  // Profile completion calculation
  const totalFields = [
    profile.fullName,
    profile.email,
    profile.phone,
    profile.collegeName,
    profile.degreeBranch,
    profile.currentCgpa,
    profile.twelfthSchool,
    profile.tenthSchool,
    profile.targetRole,
    profile.skills?.length ? "skills" : "",
    profile.projects?.length ? "projects" : "",
  ].filter(Boolean).length;
  const completionPercentage = Math.min(100, Math.round((totalFields / 11) * 100));

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        isDark ? "bg-[#0F172A] text-slate-100" : "bg-[#F1F5F9] text-[#1E293B]"
      }`}
    >
      {/* Top Page Header */}
      <header
        className={`h-16 px-4 sm:px-8 flex items-center justify-between border-b sticky top-0 z-30 transition-colors ${
          isDark ? "bg-[#0F172A] border-[#475569]/30" : "bg-[#F1F5F9] border-[#475569]/20"
        }`}
      >
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2 rounded-xl neu-btn text-[#475569] dark:text-slate-300 hover:text-[#059669] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-semibold">Dashboard</span>
          </Link>
          <div className="h-5 w-px bg-[#475569]/30 hidden sm:block"></div>
          <h1 className="text-lg font-bold text-[#1E293B] dark:text-white">Candidate Profile & Academic Portfolio</h1>
        </div>

        <div className="flex items-center gap-3">
          {currentUser && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-semibold neu-inset-sm text-[#059669]">
              <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
              <span>Cloud Synced ({currentUser.name})</span>
            </div>
          )}

          {/* LinkedIn Import CTA in header */}
          <button
            type="button"
            onClick={() => setIsLinkedInModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl neu-btn text-[#475569] dark:text-slate-300 hover:text-[#0A66C2] font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
            title="Import profile from LinkedIn URL or simulated OAuth"
          >
            <Linkedin className="w-4 h-4 fill-current text-[#0A66C2]" />
            <span className="hidden sm:inline">Import from LinkedIn</span>
            <span className="sm:hidden">LinkedIn</span>
          </button>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-1.5 rounded-xl text-sm font-semibold neu-btn text-[#475569] dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 rounded-xl neu-btn-accent text-white font-bold text-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-1.5 rounded-xl neu-btn-accent text-white font-bold text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}

          {currentUser ? (
            <Link
              to="/logout"
              className="p-2 rounded-xl neu-btn text-[#475569] dark:text-slate-300 hover:text-rose-500 transition-colors"
              title="Sign Out of Account"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-xl text-xs font-bold neu-btn text-[#059669]"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Notification alert */}
        {saveNotice && (
          <div className="p-4 rounded-xl neu-flat text-[#059669] text-sm flex items-center gap-3 font-semibold">
            <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0" />
            <span>{saveNotice}</span>
          </div>
        )}

        {/* Quick LinkedIn Sync Banner */}
        <div
          className="p-5 rounded-2xl neu-flat flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl neu-btn text-[#0A66C2] flex items-center justify-center shrink-0">
              <Linkedin className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#1E293B] dark:text-white">
                  Import Profile from LinkedIn
                </h4>
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold neu-inset-sm text-[#059669]">
                  Direct Sync
                </span>
              </div>
              <p className="text-xs text-[#475569] dark:text-slate-400 font-medium">
                Auto-populate your academics, internships, technical projects, and skills via public URL parsing or simulated OAuth 2.0.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsLinkedInModalOpen(true)}
            className="px-4 py-2 rounded-xl neu-btn text-[#475569] dark:text-slate-200 hover:text-[#059669] font-bold text-xs flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
            <span>Sync with LinkedIn</span>
          </button>
        </div>

        {/* Hero Identity Banner */}
        <section
          className="rounded-2xl neu-flat p-6 sm:p-8 relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left: Avatar + Basic Info */}
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden neu-btn flex items-center justify-center text-[#059669] text-3xl font-black shrink-0">
                  {profile.photo ? (
                    <img
                      src={profile.photo}
                      alt={profile.fullName || "Candidate"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (profile.fullName || "U").charAt(0).toUpperCase()
                  )}
                </div>
                {currentUser?.isVerified && (
                  <div
                    className="absolute -bottom-1 -right-1 p-1 bg-[#059669] text-white rounded-full shadow"
                    title="Verified Account"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1E293B] dark:text-white">
                    {profile.fullName || "Candidate Profile"}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold neu-inset-sm text-[#059669]">
                    {profile.collegeYear || "3rd Year Undergraduate"}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-[#475569] dark:text-slate-300 font-semibold">
                  {profile.targetRole || "Software Development Engineer (SDE)"}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#475569] dark:text-slate-400 pt-1 font-medium">
                  {profile.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-[#475569]" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-[#475569]" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#475569]" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Social Profiles & Completion Indicator */}
            <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
              <div className="w-full md:w-56 p-3.5 rounded-2xl neu-inset-sm space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#475569] dark:text-slate-400">Profile Strength</span>
                  <span className="text-[#059669]">{completionPercentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full neu-flat overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-[#059669] transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl neu-btn text-[#475569] dark:text-slate-300 hover:text-[#0A66C2] transition-colors"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl neu-btn text-[#475569] dark:text-slate-300 hover:text-[#059669] transition-colors"
                    title="GitHub Repository"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {profile.portfolioUrl && (
                  <a
                    href={profile.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl neu-btn text-[#475569] dark:text-slate-300 hover:text-[#059669] transition-colors"
                    title="Portfolio Website"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* EDITING FORM VIEW */}
        {isEditing ? (
          <section
            className="rounded-2xl neu-flat p-6 sm:p-8 space-y-8"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#475569]/20 dark:border-[#475569]/30">
              <h2 className="text-xl font-bold flex items-center gap-2 text-[#1E293B] dark:text-white">
                <Edit3 className="w-5 h-5 text-[#059669]" />
                <span>Edit Profile Details</span>
              </h2>
              <span className="text-xs text-[#475569] dark:text-slate-400 font-medium">
                All fields will persist directly to your cloud Firestore account
              </span>
            </div>

            {/* Section 1: Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#059669] uppercase tracking-wider">
                1. Personal & Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] dark:text-slate-400 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full px-3.5 py-2 rounded-xl neu-inset text-sm font-medium focus:outline-none ${
                      isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] dark:text-slate-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3.5 py-2 rounded-xl neu-inset text-sm font-medium focus:outline-none ${
                      isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] dark:text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-3.5 py-2 rounded-xl neu-inset text-sm font-medium focus:outline-none ${
                      isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] dark:text-slate-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. New Delhi, India"
                    className={`w-full px-3.5 py-2 rounded-xl neu-inset text-sm font-medium focus:outline-none ${
                      isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] dark:text-slate-400 mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className={`w-full px-3.5 py-2 rounded-xl neu-inset text-sm font-medium focus:outline-none ${
                      isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] dark:text-slate-400 mb-1">
                    GitHub Profile URL
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className={`w-full px-3.5 py-2 rounded-xl neu-inset text-sm font-medium focus:outline-none ${
                      isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: College & Higher Academics */}
            <div className="space-y-4 pt-4 border-t border-[#475569]/20 dark:border-[#475569]/30">
              <h3 className="text-sm font-bold text-[#059669] uppercase tracking-wider">
                2. Current College & Academic Credentials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#475569] dark:text-slate-400 mb-1">
                    College / Institute Name
                  </label>
                  <input
                    type="text"
                    value={formData.collegeName}
                    onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    placeholder="e.g. National Institute of Technology (NIT)"
                    className={`w-full px-3.5 py-2 rounded-xl neu-inset text-sm font-medium focus:outline-none ${
                      isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] dark:text-slate-400 mb-1">
                    Degree & Branch
                  </label>
                  <input
                    type="text"
                    value={formData.degreeBranch}
                    onChange={(e) => setFormData({ ...formData, degreeBranch: e.target.value })}
                    placeholder="e.g. B.Tech in Computer Science"
                    className={`w-full px-3.5 py-2 rounded-xl neu-inset text-sm font-medium focus:outline-none ${
                      isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] dark:text-slate-400 mb-1">
                    Current Year
                  </label>
                  <select
                    value={formData.collegeYear}
                    onChange={(e) => setFormData({ ...formData, collegeYear: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl neu-btn text-sm font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="1st Year" className={isDark ? "bg-[#0F172A] text-white" : "bg-[#F1F5F9] text-[#1E293B]"}>1st Year</option>
                    <option value="2nd Year" className={isDark ? "bg-[#0F172A] text-white" : "bg-[#F1F5F9] text-[#1E293B]"}>2nd Year</option>
                    <option value="3rd Year" className={isDark ? "bg-[#0F172A] text-white" : "bg-[#F1F5F9] text-[#1E293B]"}>3rd Year (Pre-Final)</option>
                    <option value="4th Year" className={isDark ? "bg-[#0F172A] text-white" : "bg-[#F1F5F9] text-[#1E293B]"}>4th Year (Final Year)</option>
                    <option value="Graduated" className={isDark ? "bg-[#0F172A] text-white" : "bg-[#F1F5F9] text-[#1E293B]"}>Graduated / Alumni</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] dark:text-slate-400 mb-1">
                    Current CGPA / Grade
                  </label>
                  <input
                    type="text"
                    value={formData.currentCgpa}
                    onChange={(e) => setFormData({ ...formData, currentCgpa: e.target.value })}
                    placeholder="e.g. 8.85 / 10.0"
                    className={`w-full px-3.5 py-2 rounded-xl neu-inset text-sm font-medium focus:outline-none ${
                      isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] dark:text-slate-400 mb-1">
                    Expected Graduation Year
                  </label>
                  <input
                    type="text"
                    value={formData.expectedGraduationYear}
                    onChange={(e) =>
                      setFormData({ ...formData, expectedGraduationYear: e.target.value })
                    }
                    placeholder="e.g. 2026"
                    className={`w-full px-3.5 py-2 rounded-xl neu-inset text-sm font-medium focus:outline-none ${
                      isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: School Records (12th & 10th) */}
            <div className="space-y-4 pt-4 border-t border-[#475569]/20 dark:border-[#475569]/30">
              <h3 className="text-sm font-bold text-[#059669] uppercase tracking-wider">
                3. Schooling & Board Examination Records
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 12th Standard */}
                <div className="p-4 rounded-xl neu-inset-sm space-y-3">
                  <h4 className="font-bold text-sm text-[#1E293B] dark:text-slate-200">
                    12th Standard (Senior Secondary)
                  </h4>
                  <div>
                    <label className="block text-xs font-medium text-[#475569] dark:text-slate-400 mb-1">School Name</label>
                    <input
                      type="text"
                      value={formData.twelfthSchool}
                      onChange={(e) => setFormData({ ...formData, twelfthSchool: e.target.value })}
                      placeholder="e.g. Delhi Public School"
                      className={`w-full px-3 py-1.5 rounded-lg neu-inset text-xs outline-none ${
                        isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                      }`}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-[#475569] dark:text-slate-400 mb-1">Board</label>
                      <input
                        type="text"
                        value={formData.twelfthBoard}
                        onChange={(e) => setFormData({ ...formData, twelfthBoard: e.target.value })}
                        placeholder="CBSE"
                        className={`w-full px-3 py-1.5 rounded-lg neu-inset text-xs outline-none ${
                          isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#475569] dark:text-slate-400 mb-1">Year</label>
                      <input
                        type="text"
                        value={formData.twelfthYear}
                        onChange={(e) => setFormData({ ...formData, twelfthYear: e.target.value })}
                        placeholder="2022"
                        className={`w-full px-3 py-1.5 rounded-lg neu-inset text-xs outline-none ${
                          isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#475569] dark:text-slate-400 mb-1">Percentage</label>
                      <input
                        type="text"
                        value={formData.twelfthPercentage}
                        onChange={(e) =>
                          setFormData({ ...formData, twelfthPercentage: e.target.value })
                        }
                        placeholder="94.6%"
                        className={`w-full px-3 py-1.5 rounded-lg neu-inset text-xs outline-none ${
                          isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* 10th Standard */}
                <div className="p-4 rounded-xl neu-inset-sm space-y-3">
                  <h4 className="font-bold text-sm text-[#1E293B] dark:text-slate-200">
                    10th Standard (Secondary School)
                  </h4>
                  <div>
                    <label className="block text-xs font-medium text-[#475569] dark:text-slate-400 mb-1">School Name</label>
                    <input
                      type="text"
                      value={formData.tenthSchool}
                      onChange={(e) => setFormData({ ...formData, tenthSchool: e.target.value })}
                      placeholder="e.g. St. Xavier's High School"
                      className={`w-full px-3 py-1.5 rounded-lg neu-inset text-xs outline-none ${
                        isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                      }`}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-[#475569] dark:text-slate-400 mb-1">Board</label>
                      <input
                        type="text"
                        value={formData.tenthBoard}
                        onChange={(e) => setFormData({ ...formData, tenthBoard: e.target.value })}
                        placeholder="ICSE"
                        className={`w-full px-3 py-1.5 rounded-lg neu-inset text-xs outline-none ${
                          isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#475569] dark:text-slate-400 mb-1">Year</label>
                      <input
                        type="text"
                        value={formData.tenthYear}
                        onChange={(e) => setFormData({ ...formData, tenthYear: e.target.value })}
                        placeholder="2020"
                        className={`w-full px-3 py-1.5 rounded-lg neu-inset text-xs outline-none ${
                          isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#475569] dark:text-slate-400 mb-1">Percentage</label>
                      <input
                        type="text"
                        value={formData.tenthPercentage}
                        onChange={(e) =>
                          setFormData({ ...formData, tenthPercentage: e.target.value })
                        }
                        placeholder="96.2%"
                        className={`w-full px-3 py-1.5 rounded-lg neu-inset text-xs outline-none ${
                          isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Skills & Target Roles */}
            <div className="space-y-4 pt-4 border-t border-[#475569]/20 dark:border-[#475569]/30">
              <h3 className="text-sm font-bold text-[#059669] uppercase tracking-wider">
                4. Skills & Ambitions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] dark:text-slate-400 mb-1">
                    Target Role / Dream Designation
                  </label>
                  <input
                    type="text"
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    placeholder="e.g. Software Development Engineer (SDE / Full-Stack)"
                    className={`w-full px-3.5 py-2 rounded-xl neu-inset text-sm font-medium focus:outline-none ${
                      isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] dark:text-slate-400 mb-1">
                    Current Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.skillsStr}
                    onChange={(e) => setFormData({ ...formData, skillsStr: e.target.value })}
                    placeholder="Java, Python, React, Data Structures, Git"
                    className={`w-full px-3.5 py-2 rounded-xl neu-inset text-sm font-medium focus:outline-none ${
                      isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] dark:text-slate-400 mb-1">
                    Target Skills to Acquire (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.targetSkillsStr}
                    onChange={(e) => setFormData({ ...formData, targetSkillsStr: e.target.value })}
                    placeholder="System Design, Docker, Kubernetes, Kafka"
                    className={`w-full px-3.5 py-2 rounded-xl neu-inset text-sm font-medium focus:outline-none ${
                      isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] dark:text-slate-400 mb-1">
                    Career Goals (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.goalsStr}
                    onChange={(e) => setFormData({ ...formData, goalsStr: e.target.value })}
                    placeholder="Crack SDE Tier-1 technical round, Win Unstop Hackathons"
                    className={`w-full px-3.5 py-2 rounded-xl neu-inset text-sm font-medium focus:outline-none ${
                      isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t border-[#475569]/20 dark:border-[#475569]/30 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl neu-btn text-[#475569] dark:text-slate-300 text-sm font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl neu-btn-accent text-white font-bold text-sm flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All Profile Changes</span>
              </button>
            </div>
          </section>
        ) : (
          /* READ-ONLY / DISPLAY PROFILE VIEW */
          <div className="space-y-6">
            {/* Grid: Academic Credentials + Skills */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* College & Higher Education (2 cols) */}
              <div
                className="lg:col-span-2 rounded-2xl neu-flat p-6 space-y-5"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#475569]/20 dark:border-[#475569]/30">
                  <h3 className="text-base font-bold flex items-center gap-2 text-[#1E293B] dark:text-white">
                    <GraduationCap className="w-5 h-5 text-[#059669]" />
                    <span>Higher Education & College</span>
                  </h3>
                  <span className="text-xs px-2.5 py-1 rounded-lg neu-inset-sm text-[#059669] font-bold">
                    Active Degree
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl neu-btn">
                    <span className="text-xs text-[#475569] dark:text-slate-400 block mb-1 font-medium">University / Institute</span>
                    <span className="font-bold text-sm sm:text-base text-[#1E293B] dark:text-slate-100">
                      {profile.collegeName || "Not configured"}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl neu-btn">
                    <span className="text-xs text-[#475569] dark:text-slate-400 block mb-1 font-medium">Program & Major</span>
                    <span className="font-bold text-sm sm:text-base text-[#1E293B] dark:text-slate-100">
                      {profile.degreeBranch || "B.Tech Computer Science"}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl neu-btn">
                    <span className="text-xs text-[#475569] dark:text-slate-400 block mb-1 font-medium">Current Academic Year</span>
                    <span className="font-bold text-sm sm:text-base text-[#1E293B] dark:text-slate-100">
                      {profile.collegeYear || "3rd Year"}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl neu-btn flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#475569] dark:text-slate-400 block mb-1 font-medium">Cumulative CGPA</span>
                      <span className="font-black text-xl text-[#059669]">
                        {profile.currentCgpa || "N/A"}
                      </span>
                    </div>
                    <Award className="w-6 h-6 text-[#059669]" />
                  </div>
                </div>

                {/* Secondary Schooling Records */}
                <div className="pt-3">
                  <h4 className="text-xs font-bold text-[#475569] dark:text-slate-400 uppercase tracking-wider mb-3">
                    Schooling History (12th & 10th)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl neu-inset-sm text-xs space-y-1">
                      <div className="font-bold text-[#1E293B] dark:text-slate-200 flex items-center justify-between">
                        <span>Class 12th ({profile.twelfthBoard || "CBSE"})</span>
                        <span className="text-[#059669] font-black text-sm">
                          {profile.twelfthPercentage || "94.6%"}
                        </span>
                      </div>
                      <p className="text-[#475569] dark:text-slate-400 truncate font-medium">
                        {profile.twelfthSchool || "Delhi Public School"} • Year {profile.twelfthYear || "2022"}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl neu-inset-sm text-xs space-y-1">
                      <div className="font-bold text-[#1E293B] dark:text-slate-200 flex items-center justify-between">
                        <span>Class 10th ({profile.tenthBoard || "ICSE"})</span>
                        <span className="text-[#059669] font-black text-sm">
                          {profile.tenthPercentage || "96.2%"}
                        </span>
                      </div>
                      <p className="text-[#475569] dark:text-slate-400 truncate font-medium">
                        {profile.tenthSchool || "St. Xavier's High School"} • Year {profile.tenthYear || "2020"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Matrix (1 col) */}
              <div
                className="rounded-2xl neu-flat p-6 space-y-5"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#475569]/20 dark:border-[#475569]/30">
                  <h3 className="text-base font-bold flex items-center gap-2 text-[#1E293B] dark:text-white">
                    <Code className="w-5 h-5 text-[#059669]" />
                    <span>Skills & Tech Stack</span>
                  </h3>
                  <span className="text-xs font-semibold text-[#475569] dark:text-slate-400">
                    {(profile.skills?.length || 0) + (profile.targetSkills?.length || 0)} Total
                  </span>
                </div>

                {/* Core Skills */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#475569] dark:text-slate-400 uppercase tracking-wider block">
                    Core Strengths
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills && profile.skills.length > 0 ? (
                      profile.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold neu-btn text-[#059669]"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[#475569] italic">No skills listed yet</span>
                    )}
                  </div>
                </div>

                {/* Target Skills */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-[#475569] dark:text-slate-400 uppercase tracking-wider block">
                    Target Skills (Learning Roadmap)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {profile.targetSkills && profile.targetSkills.length > 0 ? (
                      profile.targetSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold neu-inset-sm text-[#1E293B] dark:text-slate-200"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[#475569] italic">
                        No target skills specified
                      </span>
                    )}
                  </div>
                </div>

                {/* Career Ambitions */}
                <div className="space-y-2 pt-2 border-t border-[#475569]/20 dark:border-[#475569]/30">
                  <span className="text-xs font-bold text-[#475569] dark:text-slate-400 uppercase tracking-wider block">
                    Primary Ambitions
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#475569] dark:text-slate-300 font-medium">
                    {profile.careerGoals && profile.careerGoals.length > 0 ? (
                      profile.careerGoals.map((g, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#059669] font-bold">•</span>
                          <span>{g}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-[#475569] italic">No career goals set</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Projects Showcase */}
            <div
              className="rounded-2xl neu-flat p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#475569]/20 dark:border-[#475569]/30">
                <h3 className="text-base font-bold flex items-center gap-2 text-[#1E293B] dark:text-white">
                  <Briefcase className="w-5 h-5 text-[#059669]" />
                  <span>Featured Technical Projects</span>
                </h3>
                <span className="text-xs font-semibold text-[#475569] dark:text-slate-400">
                  {profile.projects?.length || 0} Projects Included
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.projects && profile.projects.length > 0 ? (
                  profile.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl neu-btn space-y-2 text-left"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm sm:text-base text-[#1E293B] dark:text-slate-100">
                          {proj.title}
                        </h4>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#059669] hover:underline p-1"
                            title="Open Link"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-300 font-medium">{proj.description}</p>
                      {proj.techStack && (
                        <div className="pt-1 flex flex-wrap gap-1.5">
                          {proj.techStack.split(",").map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded-md text-[11px] font-mono neu-inset-sm text-[#059669] font-bold"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#475569] italic col-span-2">
                    No projects documented yet. Click Edit Profile to add your top software projects!
                  </p>
                )}
              </div>
            </div>

            {/* Work Experiences & Internships */}
            <div
              className="rounded-2xl neu-flat p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#475569]/20 dark:border-[#475569]/30">
                <h3 className="text-base font-bold flex items-center gap-2 text-[#1E293B] dark:text-white">
                  <Building2 className="w-5 h-5 text-[#059669]" />
                  <span>Work Experience & Internships</span>
                </h3>
                <span className="text-xs font-semibold text-[#475569] dark:text-slate-400">
                  {profile.experiences?.length || 0} Positions
                </span>
              </div>

              <div className="space-y-3">
                {profile.experiences && profile.experiences.length > 0 ? (
                  profile.experiences.map((exp, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl neu-btn space-y-1.5 text-left"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm sm:text-base text-[#1E293B] dark:text-slate-100">
                            {exp.role}
                          </span>
                          <span className="text-[#475569] dark:text-slate-500">•</span>
                          <span className="text-sm font-bold text-[#059669]">{exp.company}</span>
                        </div>
                        <span className="text-xs text-[#475569] dark:text-slate-400 font-medium">{exp.duration}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-300 leading-relaxed font-medium">
                        {exp.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#475569] italic">
                    No work experience or internships recorded yet.
                  </p>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-[#475569] dark:text-slate-400 font-semibold">
                Want to leverage this profile in consultation or job search?
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/resume"
                  className="px-4 py-2.5 rounded-xl neu-btn text-[#475569] dark:text-slate-200 hover:text-[#059669] font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#059669]" />
                  <span>Build ATS Resume</span>
                </Link>
                <Link
                  to="/jobs"
                  className="px-4 py-2.5 rounded-xl neu-btn text-[#475569] dark:text-slate-200 hover:text-[#059669] font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-[#059669]" />
                  <span>Explore Matching Jobs</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="px-5 py-2.5 rounded-xl neu-btn-accent text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch AI Advisory</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* LinkedIn Import Modal (URL parser and simulated OAuth 2.0) */}
      <LinkedInImportModal
        isOpen={isLinkedInModalOpen}
        onClose={() => setIsLinkedInModalOpen(false)}
        currentProfile={profile}
        onApplyProfile={(updated) => {
          onSaveProfile(updated);
          setSaveNotice("Profile successfully updated from LinkedIn!");
          setTimeout(() => setSaveNotice(null), 4000);
        }}
        theme={theme}
      />
    </div>
  );
};
