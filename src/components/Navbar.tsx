import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Compass,
  FileText,
  Building2,
  User,
  Sun,
  Moon,
  LogIn,
  CheckCircle2,
  LogOut,
  Home,
} from "lucide-react";
import { CareerSphereLogo } from "./CareerSphereLogo";
import { UserAccount, CareerProfile } from "../types";
import { onKeyEnterOrSpace } from "../utils/keyboardAccessibility";

interface NavbarProps {
  currentUser: UserAccount | null;
  profile: CareerProfile;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  profile,
  theme,
  onToggleTheme,
  onLogout,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const navItems = [
    {
      path: "/dashboard",
      label: "AI Advisor",
      icon: <Compass className="w-4 h-4 text-[#059669]" />,
    },
    {
      path: "/resume",
      label: "Resume Studio",
      icon: <FileText className="w-4 h-4 text-[#475569] dark:text-slate-300" />,
    },
    {
      path: "/jobs",
      label: "Job Discovery",
      icon: <Building2 className="w-4 h-4 text-[#475569] dark:text-slate-300" />,
    },
    {
      path: "/profile",
      label: "Profile",
      icon: <User className="w-4 h-4 text-[#059669]" />,
    },
  ];

  return (
    <>
      <nav
        className={`h-16 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30 transition-colors backdrop-blur-xl ${
          isDark
            ? "bg-[#0F172A]/75 text-slate-100 border-b border-white/10 shadow-sm"
            : "bg-white/70 text-[#1E293B] border-b border-white/60 shadow-sm"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group" title="Return to CareerSphere Home">
            <div className="p-1 rounded-xl neu-btn flex items-center justify-center group-hover:scale-105 transition-transform">
              <CareerSphereLogo size={32} showAura={false} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-base tracking-tight">
                <span className={isDark ? "text-white" : "text-[#1E293B]"}>CareerSphere</span>
                <span className="text-[11px] px-2 py-0.5 rounded font-bold text-[#059669] neu-inset-sm">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-[#475569] dark:text-slate-400 hidden sm:block font-medium">Career Intelligence</p>
            </div>
          </Link>
        </div>

        {/* Center: Tactile Segmented Dashboards Navigation */}
        <div
          role="tablist"
          aria-label="Application Sections"
          className="hidden lg:flex items-center rounded-2xl p-1.5 neu-inset-sm"
        >
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === "/dashboard" && (location.pathname === "/" || location.pathname === "/advisor")) ||
              (item.path === "/resume" && location.pathname === "/dashboard/resume") ||
              (item.path === "/jobs" && location.pathname === "/dashboard/jobs");

            return (
              <Link
                key={item.path}
                to={item.path}
                role="tab"
                aria-selected={isActive}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Spacebar") {
                    e.preventDefault();
                    navigate(item.path);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "neu-flat-sm text-[#059669] font-bold"
                    : "text-[#475569] dark:text-slate-400 hover:text-[#1E293B] dark:hover:text-slate-200"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            onKeyDown={onKeyEnterOrSpace(onToggleTheme)}
            className="p-2.5 rounded-xl neu-btn text-[#475569] dark:text-slate-300 hover:text-[#059669] cursor-pointer"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#475569]" />}
          </button>

          {/* User Account / Login Button */}
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
                className="px-3.5 py-1.5 rounded-xl neu-btn flex items-center gap-2 text-[#1E293B] dark:text-slate-100 cursor-pointer"
                title="View Candidate Profile"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden bg-[#059669] flex items-center justify-center text-white text-[10px] font-bold">
                  {currentUser.photoUrl ? (
                    <img src={currentUser.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    currentUser.name.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-xs font-semibold max-w-[100px] truncate">
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
                className="p-2.5 rounded-xl neu-btn text-[#475569] hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 transition-colors cursor-pointer"
                title="Sign Out of Account"
                aria-label="Sign Out of Account"
              >
                <LogOut className="w-4 h-4" />
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
                className="px-3.5 py-1.5 rounded-xl neu-btn text-xs sm:text-sm font-semibold flex items-center gap-1.5 text-[#1E293B] dark:text-slate-100 cursor-pointer"
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
                  }
                }}
                className="hidden sm:flex px-4 py-1.5 rounded-xl neu-btn-accent text-xs sm:text-sm font-bold items-center gap-1.5 cursor-pointer"
              >
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Sub-Navigation Bar for 3 Dashboards */}
      <div
        className={`lg:hidden flex items-center justify-around px-3 py-2 text-[11px] font-semibold transition-colors ${
          isDark
            ? "bg-[#0F172A] text-slate-200 border-b border-[#475569]/30"
            : "bg-[#F1F5F9] text-[#1E293B] border-b border-[#475569]/20"
        }`}
      >
        <div
          role="tablist"
          aria-label="Mobile Navigation Tabs"
          className="w-full flex items-center justify-between p-1 rounded-xl neu-inset-sm"
        >
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === "/dashboard" && (location.pathname === "/" || location.pathname === "/advisor")) ||
              (item.path === "/resume" && location.pathname === "/dashboard/resume") ||
              (item.path === "/jobs" && location.pathname === "/dashboard/jobs");

            return (
              <Link
                key={item.path}
                to={item.path}
                role="tab"
                aria-selected={isActive}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Spacebar") {
                    e.preventDefault();
                    navigate(item.path);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? "neu-flat-sm text-[#059669] font-bold"
                    : "text-[#475569] dark:text-slate-400 hover:text-[#1E293B] dark:hover:text-slate-200"
                }`}
              >
                {item.icon}
                <span className="truncate max-w-[85px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};
