import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Plus,
  MessageSquare,
  Compass,
  FileText,
  Mic,
  Target,
  FileSearch,
  Trash2,
  Edit2,
  Check,
  X,
  Sun,
  Moon,
  User,
  Info,
  Building2,
  CheckCircle2,
  LogIn,
  LogOut,
} from "lucide-react";
import { Conversation, CareerMode, UserAccount } from "../types";
import { AppTab } from "./Header";
import { onKeyEnterOrSpace } from "../utils/keyboardAccessibility";

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  activeMode: CareerMode;
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  currentUser: UserAccount | null;
  onOpenAuthModal: () => void;
  onSelectConversation: (id: string) => void;
  onNewConversation: (mode?: CareerMode) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onSelectMode: (mode: CareerMode) => void;
  onOpenProfile: () => void;
  onOpenInfo: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const MODES: { id: CareerMode; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: "general", label: "Career Advisor", icon: <Compass className="w-4 h-4" />, desc: "General guidance & transitions" },
  { id: "roadmap", label: "Career Roadmap", icon: <Target className="w-4 h-4" />, desc: "Milestone plans & milestones" },
  { id: "resume", label: "Resume Analyzer", icon: <FileText className="w-4 h-4" />, desc: "Bullet review & ATS audit" },
  { id: "interview", label: "Interview Coach", icon: <Mic className="w-4 h-4" />, desc: "1-on-1 mock question practice" },
  { id: "skill_gap", label: "Skill Gap Analyzer", icon: <Sparkles className="w-4 h-4" />, desc: "Identify high-priority skills" },
  { id: "job_description", label: "Job Matcher", icon: <FileSearch className="w-4 h-4" />, desc: "Match profile against job reqs" },
];

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  activeMode,
  activeTab,
  onSelectTab,
  currentUser,
  onOpenAuthModal,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
  onSelectMode,
  onOpenProfile,
  onOpenInfo,
  theme,
  onToggleTheme,
  isMobileOpen,
  onCloseMobile,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const startRename = (conv: Conversation, e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const saveRename = (id: string, e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const cancelRename = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    setEditingId(null);
  };

  const isDark = theme === "dark";

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="sidebar"
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${
          isDark
            ? "bg-[#0F172A] text-slate-100 border-r border-[#475569]/30"
            : "bg-[#F1F5F9] text-[#1E293B] border-r border-[#475569]/20"
        } shadow-2xl lg:shadow-none`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[#475569]/20 dark:border-[#475569]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl neu-btn text-[#059669] font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold tracking-tight text-base">
                <span className={isDark ? "text-white" : "text-[#1E293B]"}>CareerSphere</span>
                <span className="text-[11px] px-2 py-0.5 rounded font-bold text-[#059669] neu-inset-sm">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-[#475569] dark:text-slate-400 truncate max-w-[145px] font-medium">Career Intelligence</p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 rounded-xl neu-btn text-[#475569] hover:text-[#1E293B] dark:text-slate-400 dark:hover:text-white cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 DEDICATED SEPARATE DASHBOARDS */}
        <div
          role="tablist"
          aria-label="Sidebar Navigation Dashboards"
          className="p-3 border-b border-[#475569]/20 dark:border-[#475569]/30 space-y-1.5"
        >
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-[10px] font-bold text-[#475569] dark:text-slate-400 uppercase tracking-wider">
              Dashboards
            </span>
          </div>

          {/* Dashboard 1: AI Advisor & Coach */}
          <Link
            to="/dashboard"
            role="tab"
            aria-selected={location.pathname === "/dashboard" || location.pathname === "/" || location.pathname === "/advisor"}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Spacebar") {
                e.preventDefault();
                navigate("/dashboard");
                if (isMobileOpen) onCloseMobile();
              }
            }}
            onClick={() => {
              if (isMobileOpen) onCloseMobile();
            }}
            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold flex items-center justify-between transition-all cursor-pointer ${
              location.pathname === "/dashboard" || location.pathname === "/" || location.pathname === "/advisor"
                ? "neu-flat-sm text-[#059669] font-bold"
                : "text-[#475569] dark:text-slate-300 hover:text-[#1E293B] dark:hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4" />
              <span>AI Advisor</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono neu-inset-sm text-[#059669] font-bold">
              Chat
            </span>
          </Link>

          {/* Dashboard 2: AI Resume Builder */}
          <Link
            to="/resume"
            role="tab"
            aria-selected={location.pathname === "/resume" || location.pathname === "/dashboard/resume"}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Spacebar") {
                e.preventDefault();
                navigate("/resume");
                if (isMobileOpen) onCloseMobile();
              }
            }}
            onClick={() => {
              if (isMobileOpen) onCloseMobile();
            }}
            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold flex items-center justify-between transition-all cursor-pointer ${
              location.pathname === "/resume" || location.pathname === "/dashboard/resume"
                ? "neu-flat-sm text-[#059669] font-bold"
                : "text-[#475569] dark:text-slate-300 hover:text-[#1E293B] dark:hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4" />
              <span>Resume Studio</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono neu-inset-sm text-[#475569] dark:text-slate-400 font-bold">
              .docx
            </span>
          </Link>

          {/* Dashboard 3: Unstop Job Finder */}
          <Link
            to="/jobs"
            role="tab"
            aria-selected={location.pathname === "/jobs" || location.pathname === "/dashboard/jobs"}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Spacebar") {
                e.preventDefault();
                navigate("/jobs");
                if (isMobileOpen) onCloseMobile();
              }
            }}
            onClick={() => {
              if (isMobileOpen) onCloseMobile();
            }}
            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold flex items-center justify-between transition-all cursor-pointer ${
              location.pathname === "/jobs" || location.pathname === "/dashboard/jobs"
                ? "neu-flat-sm text-[#059669] font-bold"
                : "text-[#475569] dark:text-slate-300 hover:text-[#1E293B] dark:hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4" />
              <span>Job Discovery</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded font-bold neu-inset-sm text-[#475569] dark:text-slate-400">
              Live
            </span>
          </Link>
        </div>

        {/* CANDIDATE PROFILE & MEMORY */}
        <div className="p-3 border-b border-[#475569]/20 dark:border-[#475569]/30 space-y-1">
          <div className="text-[10px] font-bold text-[#475569] dark:text-slate-400 uppercase tracking-wider px-2 mb-1">
            Candidate Profile
          </div>
          <Link
            to="/profile"
            role="tab"
            aria-selected={location.pathname === "/profile"}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Spacebar") {
                e.preventDefault();
                navigate("/profile");
                if (isMobileOpen) onCloseMobile();
              }
            }}
            onClick={() => {
              if (isMobileOpen) onCloseMobile();
            }}
            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
              location.pathname === "/profile"
                ? "neu-flat-sm text-[#059669] font-bold"
                : "text-[#475569] dark:text-slate-300 hover:text-[#1E293B] dark:hover:text-white"
            }`}
          >
            <User className="w-4 h-4 text-[#059669]" />
            <span>Academic & Career Memory</span>
          </Link>
        </div>

        {/* Primary Action Button (New Chat) - 10% Accent Emerald Green */}
        <div className="p-3">
          <button
            id="new-chat-btn"
            onClick={() => {
              onSelectTab("advisor");
              onNewConversation();
              if (isMobileOpen) onCloseMobile();
            }}
            onKeyDown={onKeyEnterOrSpace(() => {
              onSelectTab("advisor");
              onNewConversation();
              if (isMobileOpen) onCloseMobile();
            })}
            className="w-full py-2.5 px-4 rounded-xl neu-btn-accent font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>New Consultation</span>
          </button>
        </div>

        {/* Career Toolkits */}
        <div className="px-3 py-1">
          <div className="text-[11px] font-semibold text-[#475569] dark:text-slate-400 uppercase tracking-wider px-2 mb-1.5">
            Advisory Modes
          </div>
          <div className="space-y-1">
            {MODES.map((mode) => {
              const isActive = activeTab === "advisor" && activeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  id={`mode-btn-${mode.id}`}
                  onClick={() => {
                    onSelectTab("advisor");
                    onSelectMode(mode.id);
                    if (isMobileOpen) onCloseMobile();
                  }}
                  onKeyDown={onKeyEnterOrSpace(() => {
                    onSelectTab("advisor");
                    onSelectMode(mode.id);
                    if (isMobileOpen) onCloseMobile();
                  })}
                  className={`w-full text-left px-3.5 py-1.5 rounded-xl text-xs sm:text-[13px] font-medium flex items-center gap-2.5 transition-all cursor-pointer ${
                    isActive
                      ? "neu-inset-sm text-[#059669] font-bold"
                      : "text-[#475569] dark:text-slate-300 hover:text-[#1E293B] dark:hover:text-white"
                  }`}
                  title={mode.desc}
                >
                  <span className={isActive ? "text-[#059669]" : "text-[#475569] dark:text-slate-400"}>{mode.icon}</span>
                  <span className="truncate">{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Conversations */}
        <div className="flex-1 overflow-y-auto px-3 py-2 mt-1">
          <div className="text-[11px] font-semibold text-[#475569] dark:text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center justify-between">
            <span>Recent Chats</span>
            <span className="text-[11px] text-[#475569] dark:text-slate-400 font-bold px-1.5 py-0.2 rounded neu-inset-sm">{conversations.length}</span>
          </div>

          <div className="space-y-1.5">
            {conversations.length === 0 ? (
              <div className="text-center py-4 px-3 text-xs text-[#475569] dark:text-slate-400">
                <MessageSquare className="w-5 h-5 mx-auto mb-1 text-[#475569] opacity-60" />
                <p>No chat history yet.</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = activeTab === "advisor" && conv.id === activeConversationId;
                const isEditing = editingId === conv.id;

                return (
                  <div
                    key={conv.id}
                    id={`conversation-item-${conv.id}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Conversation: ${conv.title || "Career Chat"}`}
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => {
                      onSelectTab("advisor");
                      onSelectConversation(conv.id);
                      if (isMobileOpen) onCloseMobile();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                        // If user is currently editing the title, don't interfere
                        if (isEditing) return;
                        e.preventDefault();
                        onSelectTab("advisor");
                        onSelectConversation(conv.id);
                        if (isMobileOpen) onCloseMobile();
                      }
                    }}
                    className={`group relative w-full text-left px-3.5 py-2 rounded-xl text-xs sm:text-[13px] flex items-center justify-between gap-2 cursor-pointer transition-all ${
                      isActive
                        ? "neu-flat-sm text-[#059669] font-bold"
                        : "text-[#475569] dark:text-slate-300 hover:text-[#1E293B] dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[#059669]" : "text-[#475569]"}`} />
                      {isEditing ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveRename(conv.id, e);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          autoFocus
                          className="w-full py-0.5 px-2 rounded-lg text-xs neu-inset text-[#1E293B] dark:text-white focus:outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className="truncate">{conv.title || "Career Chat"}</span>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => saveRename(conv.id, e)}
                          onKeyDown={onKeyEnterOrSpace((e) => saveRename(conv.id, e))}
                          className="p-1 text-[#059669] neu-btn rounded-lg cursor-pointer"
                          title="Save"
                          aria-label="Save conversation name"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={cancelRename}
                          onKeyDown={onKeyEnterOrSpace(cancelRename)}
                          className="p-1 text-[#475569] hover:text-[#1E293B] dark:hover:text-white neu-btn rounded-lg cursor-pointer"
                          title="Cancel"
                          aria-label="Cancel renaming"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => startRename(conv, e)}
                          onKeyDown={onKeyEnterOrSpace((e) => startRename(conv, e))}
                          className="p-1 text-[#475569] hover:text-[#059669] rounded-lg cursor-pointer"
                          title="Rename"
                          aria-label={`Rename conversation ${conv.title}`}
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConversation(conv.id);
                          }}
                          onKeyDown={onKeyEnterOrSpace((e) => {
                            e.stopPropagation();
                            onDeleteConversation(conv.id);
                          })}
                          className="p-1 text-[#475569] hover:text-rose-600 rounded-lg cursor-pointer"
                          title="Delete"
                          aria-label={`Delete conversation ${conv.title}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer Actions: Profile + Auth + Theme */}
        <div className="p-3 border-t border-[#475569]/20 dark:border-[#475569]/30 space-y-2">
          {/* User Auth Banner in Sidebar */}
          {currentUser ? (
            <div className="space-y-1.5">
              <Link
                to="/profile"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Spacebar") {
                    e.preventDefault();
                    navigate("/profile");
                    if (isMobileOpen) onCloseMobile();
                  }
                }}
                className="w-full text-left px-3.5 py-2 rounded-xl text-xs flex items-center justify-between neu-btn text-[#1E293B] dark:text-slate-100 cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {currentUser.photoUrl ? (
                    <img
                      src={currentUser.photoUrl}
                      alt=""
                      className="w-5 h-5 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <User className="w-4 h-4 shrink-0 text-[#059669]" />
                  )}
                  <span className="truncate font-semibold">{currentUser.name}</span>
                </div>
                {currentUser.isVerified && (
                  <span className="flex items-center gap-0.5 text-[10px] text-[#059669] font-semibold shrink-0">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                )}
              </Link>

              <Link
                to="/logout"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Spacebar") {
                    e.preventDefault();
                    navigate("/logout");
                    if (isMobileOpen) onCloseMobile();
                  }
                }}
                className="w-full text-left px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-2 text-[#475569] hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out Page</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/login"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Spacebar") {
                    e.preventDefault();
                    navigate("/login");
                    if (isMobileOpen) onCloseMobile();
                  }
                }}
                className="w-full text-center py-2 px-2.5 rounded-xl text-xs font-semibold neu-btn text-[#1E293B] dark:text-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-[#059669]" />
                <span>Sign In</span>
              </Link>

              <Link
                to="/register"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Spacebar") {
                    e.preventDefault();
                    navigate("/register");
                    if (isMobileOpen) onCloseMobile();
                  }
                }}
                className="w-full text-center py-2 px-2.5 rounded-xl text-xs font-bold neu-btn-accent flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Register</span>
              </Link>
            </div>
          )}

          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              onClick={onToggleTheme}
              onKeyDown={onKeyEnterOrSpace(onToggleTheme)}
              className="p-2 rounded-xl neu-btn flex items-center gap-2 text-[#475569] dark:text-slate-200 cursor-pointer"
              title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
              aria-label={`Switch to ${isDark ? "Light" : "Dark"} mode`}
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-[#475569]" />}
              <span className="text-xs font-medium">{isDark ? "Light theme" : "Dark theme"}</span>
            </button>

            <button
              onClick={onOpenInfo}
              onKeyDown={onKeyEnterOrSpace(onOpenInfo)}
              className="p-2 rounded-xl neu-btn text-[#475569] dark:text-slate-300 hover:text-[#1E293B] dark:hover:text-white cursor-pointer"
              title="About CareerSphere AI"
              aria-label="About CareerSphere AI"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
