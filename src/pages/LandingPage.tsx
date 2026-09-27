import React from "react";
import { Link } from "react-router-dom";
import {
  Compass,
  FileText,
  Building2,
  ArrowRight,
  LogIn,
  UserPlus,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { ClothMouldingBackground } from "../components/ClothMouldingBackground";
import { CareerSphereLogo } from "../components/CareerSphereLogo";
import { UserAccount, CareerProfile } from "../types";
import { onKeyEnterOrSpace } from "../utils/keyboardAccessibility";

interface LandingPageProps {
  currentUser: UserAccount | null;
  profile: CareerProfile;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onLogout?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentUser,
  theme,
  onToggleTheme,
  onLogout,
}) => {
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen relative flex flex-col justify-between overflow-x-hidden transition-colors selection:bg-[#059669]/30 ${
        isDark ? "bg-[#0B1120] text-slate-100" : "bg-[#F8FAFC] text-[#1E293B]"
      }`}
    >
      {/* 1. Full-screen Interactive Cloth Moulding Membrane Background */}
      <ClothMouldingBackground theme={theme} showControls={true} />

      {/* 2. Top Floating Glass Navbar */}
      <header className="relative z-20 w-full px-4 sm:px-8 pt-4 sm:pt-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 rounded-2xl glass-card flex items-center justify-between transition-all">
          {/* Left: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#059669] rounded-xl p-1"
            >
              <CareerSphereLogo size={36} showAura={false} />
              <div className="flex items-center gap-1.5 font-extrabold text-lg sm:text-xl tracking-tight">
                <span className={isDark ? "text-white" : "text-[#1E293B]"}>CareerSphere</span>
                <span className="text-[11px] px-2 py-0.5 rounded-lg font-bold text-[#059669] glass-inset">
                  AI
                </span>
              </div>
            </Link>

            {/* Live Glass Status Pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full glass-inset text-[11px] font-semibold text-[#475569] dark:text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#059669]"></span>
              </span>
              <span>Live Intelligence Platform</span>
            </div>
          </div>

          {/* Right Actions: Theme Toggle, Sign In, Register */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              onKeyDown={onKeyEnterOrSpace(onToggleTheme)}
              className="p-2.5 rounded-xl glass-btn text-[#475569] dark:text-slate-300 hover:text-[#059669] transition-all cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {currentUser ? (
              /* Signed In User Badge & Dashboard Action */
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass-btn text-xs sm:text-sm font-bold text-[#059669] hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden glass-inset flex items-center justify-center text-xs font-bold text-white bg-[#059669]">
                    {currentUser.photoUrl ? (
                      <img
                        src={currentUser.photoUrl}
                        alt={currentUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      currentUser.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="hidden sm:inline">Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {onLogout && (
                  <button
                    onClick={onLogout}
                    onKeyDown={onKeyEnterOrSpace(onLogout)}
                    className="px-2.5 py-2 rounded-xl glass-btn text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            ) : (
              /* Guest Actions: Glass Login & Glass Register */
              <div className="flex items-center gap-2 sm:gap-2.5">
                <Link
                  to="/login"
                  className="px-3.5 sm:px-4.5 py-2 rounded-xl glass-btn text-xs sm:text-sm font-bold text-[#1E293B] dark:text-slate-200 hover:text-[#059669] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Log In</span>
                </Link>

                <Link
                  to="/register"
                  className="px-4 sm:px-5 py-2 rounded-xl glass-btn-accent text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 hover:scale-[1.02] cursor-pointer shadow-lg"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 3. Center Hero: High-Impact Glass Card Morphism Container */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 max-w-4xl mx-auto w-full">
        {/* Main Central Glass Card */}
        <div className="w-full glass-card p-6 sm:p-10 md:p-12 rounded-3xl relative overflow-hidden backdrop-blur-2xl transition-all text-center">
          {/* Specular Ambient Edge Sheen (Top glass reflection highlight) */}
          <div
            className="absolute top-0 left-0 right-0 h-[1.5px] pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
            }}
          />

          {/* High-Impact Centered CareerSphere Logo on Glass Pedestal */}
          <div className="mb-4 sm:mb-6 inline-block relative group animate-in fade-in zoom-in-95 duration-500">
            <div className="p-3.5 sm:p-4 rounded-3xl glass-card inline-block relative">
              <CareerSphereLogo
                size={110}
                className="sm:w-[124px] sm:h-[124px] group-hover:scale-105 transition-transform duration-300"
                showAura={true}
              />
            </div>
          </div>

          {/* Centered Brand Title & Subtitle */}
          <div className="space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-inset text-xs font-bold text-[#059669] mb-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#059669]" />
              <span>Autonomous Career Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-[#1E293B] dark:text-white">
              Career<span className="text-[#059669]">Sphere</span>{" "}
              <span className="text-2xl sm:text-3xl font-extrabold px-3 py-0.5 rounded-xl glass-inset text-[#059669] align-middle">
                AI
              </span>
            </h1>

            <p className="text-base sm:text-xl font-medium text-[#475569] dark:text-slate-300 max-w-xl mx-auto pt-2 leading-relaxed">
              Your personalized companion for real-time AI guidance, ATS-grade resume engineering, and live opportunity discovery.
            </p>
          </div>

          {/* User Action Center: Login or Register */}
          <div className="mt-8 sm:mt-10 w-full max-w-md mx-auto space-y-3">
            {currentUser ? (
              /* Signed In Quick Action */
              <div className="p-4 rounded-2xl glass-inset space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm font-semibold text-[#1E293B] dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <span>
                    Signed in as <strong className="text-[#059669]">{currentUser.name}</strong>
                  </span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Link
                    to="/dashboard"
                    className="flex-1 py-3 px-5 rounded-xl glass-btn-accent text-white font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform cursor-pointer shadow-lg"
                  >
                    <span>Enter Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/profile"
                    className="py-3 px-4 rounded-xl glass-btn text-xs font-bold text-[#475569] dark:text-slate-300 hover:text-[#059669] transition-colors cursor-pointer"
                  >
                    Profile
                  </Link>
                </div>
              </div>
            ) : (
              /* Primary Glass Morphic Actions */
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Glass Log In Button */}
                  <Link
                    to="/login"
                    className="py-3.5 px-6 rounded-2xl glass-btn font-extrabold text-sm sm:text-base text-[#1E293B] dark:text-slate-100 hover:text-[#059669] dark:hover:text-[#059669] flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer shadow-sm"
                  >
                    <LogIn className="w-4 h-4 text-[#059669]" />
                    <span>Log In</span>
                  </Link>

                  {/* Glass Register Button */}
                  <Link
                    to="/register"
                    className="py-3.5 px-6 rounded-2xl glass-btn-accent text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer shadow-lg"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register Free</span>
                  </Link>
                </div>

                {/* Instant Guest Explore Link */}
                <div className="pt-1">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#475569] dark:text-slate-400 hover:text-[#059669] dark:hover:text-[#059669] transition-colors cursor-pointer py-1"
                  >
                    <span>Or explore the platform as guest</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Interactive Cloth Canvas Prompt */}
            <div className="pt-2 text-[11px] text-[#475569]/80 dark:text-slate-400/80 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
              <span>Move cursor or touch across screen to mould the cloth membrane</span>
            </div>
          </div>
        </div>

        {/* 4. Three Glass Morphic Pillar Cards */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full text-left">
          {/* Pillar 1 */}
          <Link
            to="/dashboard"
            className="p-5 rounded-2xl glass-card hover:border-[#059669]/40 hover:-translate-y-1 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl glass-inset flex items-center justify-center text-[#059669] mb-3 group-hover:scale-110 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-[#1E293B] dark:text-slate-200">
              AI Career Advisor
            </h2>
            <p className="text-xs text-[#475569] dark:text-slate-400 mt-1.5 leading-relaxed">
              Real-time conversational mentor with specialized modes for DSA, tech interviews, and roadmaps.
            </p>
          </Link>

          {/* Pillar 2 */}
          <Link
            to="/resume"
            className="p-5 rounded-2xl glass-card hover:border-[#059669]/40 hover:-translate-y-1 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl glass-inset flex items-center justify-center text-[#059669] mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-[#1E293B] dark:text-slate-200">
              ATS Resume Studio
            </h2>
            <p className="text-xs text-[#475569] dark:text-slate-400 mt-1.5 leading-relaxed">
              Harvard/FAANG format builder with instant ATS scoring and one-click PDF generation.
            </p>
          </Link>

          {/* Pillar 3 */}
          <Link
            to="/jobs"
            className="p-5 rounded-2xl glass-card hover:border-[#059669]/40 hover:-translate-y-1 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl glass-inset flex items-center justify-center text-[#059669] mb-3 group-hover:scale-110 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-[#1E293B] dark:text-slate-200">
              Unstop Job Discovery
            </h2>
            <p className="text-xs text-[#475569] dark:text-slate-400 mt-1.5 leading-relaxed">
              Live corporate hackathons, internships, and hiring challenges matched to your profile.
            </p>
          </Link>
        </div>
      </main>

      {/* 5. Floating Glass Footer */}
      <footer className="relative z-20 w-full px-4 sm:px-8 pb-4 sm:pb-6">
        <div className="max-w-6xl mx-auto px-6 py-3.5 rounded-2xl glass-card flex flex-col sm:flex-row items-center justify-between text-xs text-[#475569] dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1E293B] dark:text-slate-300">CareerSphere AI</span>
            <span>•</span>
            <span>Enterprise Career Intelligence</span>
          </div>
          <div className="flex items-center gap-4 mt-2 sm:mt-0 font-medium">
            <Link to="/login" className="hover:text-[#059669] transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="hover:text-[#059669] transition-colors">
              Register
            </Link>
            <Link to="/dashboard" className="hover:text-[#059669] transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
