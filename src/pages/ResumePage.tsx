import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Compass,
  Building2,
  Sparkles,
  User,
  ArrowRight,
  CheckCircle2,
  Download,
} from "lucide-react";
import { CareerProfile, UserAccount } from "../types";
import { ResumeBuilder } from "../components/ResumeBuilder";
import { Navbar } from "../components/Navbar";

interface ResumePageProps {
  profile: CareerProfile;
  currentUser: UserAccount | null;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onLogout?: () => void;
}

export const ResumePage: React.FC<ResumePageProps> = ({
  profile,
  currentUser,
  theme,
  onToggleTheme,
  onLogout,
}) => {
  const navigate = useNavigate();
  const isDark = theme === "dark";

  // Calculate profile completeness
  const profileFields = [
    profile.fullName,
    profile.currentRole,
    profile.targetRole,
    profile.collegeName,
    profile.currentCgpa,
    profile.skills?.length ? "skills" : null,
    profile.projects?.length ? "projects" : null,
    profile.experiences?.length ? "exp" : null,
  ];
  const filledFields = profileFields.filter(Boolean).length;
  const completenessScore = Math.round((filledFields / profileFields.length) * 100);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        isDark ? "bg-[#0F172A] text-slate-100" : "bg-[#F1F5F9] text-[#1E293B]"
      }`}
    >
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        profile={profile}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onLogout={onLogout}
      />

      {/* Dedicated Dashboard Header Banner */}
      <div
        className={`px-4 sm:px-6 py-5 border-b transition-colors ${
          isDark ? "bg-[#0F172A] border-[#475569]/30" : "bg-[#F1F5F9] border-[#475569]/20"
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg neu-inset-sm text-[#059669]">
                Resume Studio
              </span>
              <span className="text-xs text-[#475569] dark:text-slate-400 font-medium">
                Standalone ATS Resume Workspace
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2.5 text-[#1E293B] dark:text-white">
              <span className="p-2 rounded-xl neu-btn text-[#059669]">
                <FileText className="w-5 h-5" />
              </span>
              AI Resume Builder Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 mt-1 max-w-2xl font-medium">
              Construct high-impact, ATS-optimized resumes with quantifiable metrics. Export directly to Microsoft Word (.docx) or print to PDF.
            </p>
          </div>

          {/* Quick Dashboard Switchers */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 neu-btn text-[#475569] dark:text-slate-200 hover:text-[#059669] cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-[#059669]" />
              <span>AI Advisor</span>
            </button>

            <button
              onClick={() => navigate("/jobs")}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 neu-btn text-[#475569] dark:text-slate-200 hover:text-[#059669] cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-[#059669]" />
              <span>Job Discovery</span>
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 neu-btn-accent cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Edit Profile Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Resume Builder Dashboard Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 overflow-y-auto">
        <ResumeBuilder
          profile={profile}
          onEditProfile={() => navigate("/profile")}
          theme={theme}
        />
      </div>
    </div>
  );
};
