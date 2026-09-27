import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  LogOut,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Compass,
  User,
  LogIn,
  ChevronLeft,
  AlertTriangle,
} from "lucide-react";
import { UserAccount } from "../types";
import { logoutFirebase } from "../services/firebase";

interface LogoutPageProps {
  currentUser: UserAccount | null;
  onLogout: () => void;
  theme: "dark" | "light";
}

export const LogoutPage: React.FC<LogoutPageProps> = ({
  currentUser,
  onLogout,
  theme,
}) => {
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const [loggedOutUser, setLoggedOutUser] = useState<UserAccount | null>(currentUser);
  const [isLoading, setIsLoading] = useState(false);

  // Perform Sign Out
  const handleConfirmLogout = async () => {
    setIsLoading(true);
    try {
      setLoggedOutUser(currentUser);
      await logoutFirebase();
      onLogout();
      setHasLoggedOut(true);
    } catch (err) {
      console.error("Firebase logout error:", err);
      // Ensure local state clears regardless
      onLogout();
      setHasLoggedOut(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors ${
        isDark ? "bg-[#070b13] text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Top Bar */}
      <header
        className={`h-16 px-6 sm:px-10 flex items-center justify-between border-b ${
          isDark ? "bg-slate-950/80 border-slate-800/80" : "bg-white/90 border-slate-200"
        }`}
      >
        <Link
          to="/dashboard"
          className="flex items-center gap-2.5 text-slate-400 hover:text-sky-400 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Return to Dashboard</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg tracking-tight">CareerSphere AI</span>
        </div>

        <div className="w-24"></div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg">
          <div
            className={`rounded-2xl border p-6 sm:p-10 shadow-2xl backdrop-blur-xl ${
              isDark
                ? "bg-slate-900/90 border-slate-800 text-slate-100"
                : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            {/* Case A: Already completed sign-out OR user visited /logout while already signed out */}
            {hasLoggedOut || !currentUser ? (
              <div className="text-center space-y-6 py-2">
                <div className="w-20 h-20 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 mb-3">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Signed Out Successfully</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    You have been signed out
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-sm mx-auto">
                    {loggedOutUser?.name
                      ? `Thank you, ${loggedOutUser.name}. Your session has ended securely. All changes are saved.`
                      : "Your session has ended securely. You can sign back in anytime to access your roadmaps and resumes."}
                  </p>
                </div>

                {/* Next Steps Buttons */}
                <div className="space-y-3 pt-2">
                  <Link
                    to="/login"
                    className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Account</span>
                  </Link>

                  <Link
                    to="/register"
                    className={`w-full py-3 px-4 rounded-xl border font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      isDark
                        ? "bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200"
                        : "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Create a New Account</span>
                  </Link>

                  <Link
                    to="/dashboard"
                    className="block text-center text-xs text-slate-400 hover:text-slate-200 pt-2 transition-colors"
                  >
                    Continue to Advisor Dashboard as Guest &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              /* Case B: Currently logged in, requesting confirmation */
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-4 shadow-md">
                    <LogOut className="w-8 h-8" />
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight">Sign Out Confirmation</h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                    Are you sure you want to end your active session on CareerSphere AI?
                  </p>
                </div>

                {/* Active User Summary Card */}
                <div
                  className={`p-4 rounded-xl border flex items-center gap-3.5 ${
                    isDark ? "bg-slate-800/50 border-slate-700/80" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden shrink-0">
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
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{currentUser.name}</div>
                    <div className="text-xs text-slate-400 truncate">{currentUser.email}</div>
                    <div className="text-[11px] text-sky-400 mt-0.5 uppercase tracking-wide font-medium">
                      Auth: {currentUser.authProvider}
                    </div>
                  </div>
                </div>

                {/* Reassurance Notice */}
                <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/40 text-xs text-slate-400 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Your consultation history, candidate profile, and ATS resume templates will remain safely persisted in your Firebase cloud storage.
                  </span>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-1">
                  <button
                    type="button"
                    onClick={handleConfirmLogout}
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all shadow-md hover:shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{isLoading ? "Signing out..." : "Yes, Sign Out Now"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className={`w-full py-3 rounded-xl border font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      isDark
                        ? "bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200"
                        : "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700"
                    }`}
                  >
                    <Compass className="w-4 h-4" />
                    <span>Cancel, Stay Signed In</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-800/40">
        CareerSphere AI • Safe & Encrypted Session Termination
      </footer>
    </div>
  );
};
