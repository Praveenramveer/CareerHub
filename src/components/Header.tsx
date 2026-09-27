import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Download,
  Trash2,
  SlidersHorizontal,
  Compass,
  FileText,
  Mic,
  Target,
  FileSearch,
  Sparkles,
  Building2,
  User,
  CheckCircle2,
  LogIn,
  LogOut,
} from "lucide-react";
import { CareerMode, CareerProfile, UserAccount } from "../types";
import { onKeyEnterOrSpace } from "../utils/keyboardAccessibility";

export type AppTab = "advisor" | "resume" | "jobs";

interface HeaderProps {
  conversationTitle: string;
  activeMode: CareerMode;
  profile: CareerProfile;
  currentUser: UserAccount | null;
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenAuthModal: () => void;
  onToggleMobileMenu: () => void;
  onToggleContextPanel: () => void;
  onClearChat: () => void;
  onExportChat: () => void;
  isContextPanelOpen: boolean;
  theme: "dark" | "light";
}

const MODE_META: Record<CareerMode, { label: string; icon: React.ReactNode; color: string }> = {
  general: { label: "Career Advisor", icon: <Compass className="w-3.5 h-3.5" />, color: "text-sky-400 border-sky-500/30 bg-sky-500/10" },
  roadmap: { label: "Roadmap Builder", icon: <Target className="w-3.5 h-3.5" />, color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  resume: { label: "Resume Analyzer", icon: <FileText className="w-3.5 h-3.5" />, color: "text-violet-400 border-violet-500/30 bg-violet-500/10" },
  interview: { label: "Mock Interview Coach", icon: <Mic className="w-3.5 h-3.5" />, color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  skill_gap: { label: "Skill Gap Analyzer", icon: <Sparkles className="w-3.5 h-3.5" />, color: "text-pink-400 border-pink-500/30 bg-pink-500/10" },
  job_description: { label: "Job Matcher", icon: <FileSearch className="w-3.5 h-3.5" />, color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
};

export const Header: React.FC<HeaderProps> = ({
  conversationTitle,
  activeMode,
  profile,
  currentUser,
  activeTab,
  onSelectTab,
  onOpenAuthModal,
  onToggleMobileMenu,
  onToggleContextPanel,
  onClearChat,
  onExportChat,
  isContextPanelOpen,
  theme,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDark = theme === "dark";
  const modeInfo = MODE_META[activeMode] || MODE_META.general;

  // Count populated profile attributes
  const profileFieldCount = Object.values(profile).filter(
    (v) => v !== undefined && v !== null && v !== "" && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  return (
    <header
      id="top-header"
      className={`h-15 px-3 sm:px-5 flex items-center justify-between shrink-0 z-20 transition-colors ${
        isDark
          ? "bg-[#0F172A] text-slate-100 border-b border-[#475569]/30"
          : "bg-[#F1F5F9] text-[#1E293B] border-b border-[#475569]/20"
      }`}
    >
      {/* Left: Mobile Menu + Brand / Title / Mode */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl neu-btn text-[#475569] dark:text-slate-300 cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {activeTab === "advisor" ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <h1 className="font-bold text-sm sm:text-base md:text-lg truncate max-w-[150px] sm:max-w-xs md:max-w-md text-[#1E293B] dark:text-white">
              {conversationTitle || "Career Consultation"}
            </h1>
            <div
              className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold neu-inset-sm text-[#059669]"
            >
              {modeInfo.icon}
              <span>{modeInfo.label}</span>
            </div>
          </div>
        ) : activeTab === "resume" ? (
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm sm:text-base text-[#1E293B] dark:text-white">Resume Studio</span>
            <span className="text-[10px] px-2 py-0.5 rounded-md font-bold text-[#059669] neu-inset-sm">
              Word (.docx) Ready
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm sm:text-base text-[#1E293B] dark:text-white">Job Discovery</span>
            <span className="text-[10px] px-2 py-0.5 rounded-md font-bold text-[#059669] neu-inset-sm">
              Live Matching
            </span>
          </div>
        )}
      </div>

      {/* Center: Tactile Segmented Dashboards Navigation */}
      <div
        role="tablist"
        aria-label="Application Dashboards"
        className="hidden md:flex items-center rounded-2xl p-1 neu-inset-sm"
      >
        <Link
          to="/dashboard"
          role="tab"
          aria-selected={location.pathname === "/dashboard" || location.pathname === "/" || location.pathname === "/advisor"}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Spacebar") {
              e.preventDefault();
              navigate("/dashboard");
            }
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            location.pathname === "/dashboard" || location.pathname === "/" || location.pathname === "/advisor"
              ? "neu-flat-sm text-[#059669] font-bold"
              : "text-[#475569] dark:text-slate-400 hover:text-[#1E293B] dark:hover:text-slate-200"
          }`}
          title="AI Advisor & Coaching Engine"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>AI Advisor</span>
        </Link>

        <Link
          to="/resume"
          role="tab"
          aria-selected={location.pathname === "/resume" || location.pathname === "/dashboard/resume"}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Spacebar") {
              e.preventDefault();
              navigate("/resume");
            }
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            location.pathname === "/resume" || location.pathname === "/dashboard/resume"
              ? "neu-flat-sm text-[#059669] font-bold"
              : "text-[#475569] dark:text-slate-400 hover:text-[#1E293B] dark:hover:text-slate-200"
          }`}
          title="Resume Studio & ATS Audit"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Resume Studio</span>
        </Link>

        <Link
          to="/jobs"
          role="tab"
          aria-selected={location.pathname === "/jobs" || location.pathname === "/dashboard/jobs"}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Spacebar") {
              e.preventDefault();
              navigate("/jobs");
            }
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            location.pathname === "/jobs" || location.pathname === "/dashboard/jobs"
              ? "neu-flat-sm text-[#059669] font-bold"
              : "text-[#475569] dark:text-slate-400 hover:text-[#1E293B] dark:hover:text-slate-200"
          }`}
          title="Unstop Job & Placement Finder"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Job Discovery</span>
        </Link>

        <span className="w-px h-4 bg-[#475569]/30 mx-1" />

        <Link
          to="/profile"
          role="tab"
          aria-selected={location.pathname === "/profile"}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Spacebar") {
              e.preventDefault();
              navigate("/profile");
            }
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            location.pathname === "/profile"
              ? "neu-flat-sm text-[#059669] font-bold"
              : "text-[#475569] dark:text-slate-400 hover:text-[#1E293B] dark:hover:text-slate-200"
          }`}
          title="Candidate Profile & Academic Memory"
        >
          <User className="w-3.5 h-3.5 text-[#059669]" />
          <span>Profile</span>
        </Link>
      </div>

      {/* Right Controls: Chat Actions + Auth + Context Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {(location.pathname === "/dashboard" || location.pathname === "/") && (
          <>
            <button
              onClick={onExportChat}
              onKeyDown={onKeyEnterOrSpace(onExportChat)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 neu-btn text-[#475569] dark:text-slate-300 cursor-pointer"
              title="Export Conversation"
              aria-label="Export Conversation"
            >
              <Download className="w-3.5 h-3.5 text-[#475569]" />
              <span className="hidden lg:inline">Export</span>
            </button>

            <button
              onClick={onClearChat}
              onKeyDown={onKeyEnterOrSpace(onClearChat)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 neu-btn text-[#475569] hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 cursor-pointer"
              title="Clear Conversation Messages"
              aria-label="Clear Conversation Messages"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Clear</span>
            </button>
          </>
        )}

        {/* User Account / Dedicated Sign In & Sign Out Links */}
        {currentUser ? (
          <div className="flex items-center gap-2">
            <Link
              to="/profile"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Spacebar") {
                  e.preventDefault();
                  navigate("/profile");
                }
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 neu-btn text-[#1E293B] dark:text-slate-100 cursor-pointer"
              title={`Signed in as ${currentUser.email}. Click to view Profile`}
            >
              <div className="w-5 h-5 rounded-full bg-[#059669] flex items-center justify-center text-white text-[10px] font-bold overflow-hidden">
                {currentUser.photoUrl ? (
                  <img src={currentUser.photoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  currentUser.name.charAt(0).toUpperCase()
                )}
              </div>
              <span className="hidden md:inline max-w-[90px] truncate font-medium">
                {currentUser.name}
              </span>
              {currentUser.isVerified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
              )}
            </Link>

            <Link
              to="/logout"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Spacebar") {
                  e.preventDefault();
                  navigate("/logout");
                }
              }}
              className="p-2.5 rounded-xl neu-btn text-[#475569] hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 cursor-pointer"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Spacebar") {
                  e.preventDefault();
                  navigate("/login");
                }
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 neu-btn text-[#1E293B] dark:text-slate-100 cursor-pointer"
              title="Sign In to your account"
            >
              <LogIn className="w-3.5 h-3.5 text-[#059669]" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
            <Link
              to="/register"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Spacebar") {
                  e.preventDefault();
                  navigate("/register");
                }
              }}
              className="hidden sm:flex px-3.5 py-1.5 rounded-xl text-xs font-bold items-center gap-1.5 neu-btn-accent cursor-pointer"
              title="Create new candidate account"
            >
              <span>Register</span>
            </Link>
          </div>
        )}

        {/* Career Context Toggle Button */}
        <button
          id="toggle-context-btn"
          onClick={onToggleContextPanel}
          onKeyDown={onKeyEnterOrSpace(onToggleContextPanel)}
          className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
            isContextPanelOpen
              ? "neu-inset text-[#059669]"
              : "neu-btn text-[#475569] dark:text-slate-200"
          }`}
          title="Toggle Career Context Memory"
          aria-label="Toggle Career Context Memory"
          aria-expanded={isContextPanelOpen}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#059669]" />
          <span className="hidden xl:inline">Memory</span>
          {profileFieldCount > 0 && (
            <span className="flex items-center justify-center min-w-4 h-4 px-1.5 rounded-full bg-[#059669] text-white text-[10px] font-bold leading-none">
              {profileFieldCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
