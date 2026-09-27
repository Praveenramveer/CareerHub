import React, { useState } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { UserAccount } from "../types";
import { sendAuthVerificationService, verifyAuthCodeService } from "../services/careerService";
import { loginWithGooglePopup, logoutFirebase } from "../services/firebase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  currentUser: UserAccount | null;
  onLogout: () => void;
  theme: "dark" | "light";
}

type AuthMode = "signin" | "register" | "verify";

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentUser,
  onLogout,
  theme,
}) => {
  if (!isOpen) return null;

  const isDark = theme === "dark";
  const [authMode, setAuthMode] = useState<AuthMode>(currentUser ? "signin" : "register");

  // Registration/Sign-in Inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Verification State
  const [pendingEmail, setPendingEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [simulatedLink, setSimulatedLink] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!email || !email.includes("@")) {
        throw new Error("Please enter a valid email address (e.g., student@gmail.com).");
      }

      // Trigger backend verification dispatch
      const res = await sendAuthVerificationService(email, name || email.split("@")[0]);
      setPendingEmail(email);
      setSimulatedLink(res.verificationLink);
      setVerificationCode(res.simulationCode || "");
      setVerificationMessage(
        res.message || `We have dispatched a verification link and code to ${email}.`
      );
      setAuthMode("verify");
      setSuccessNotice("Verification email dispatched! Check below to verify.");
    } catch (err: any) {
      setError(err?.message || "Failed to start registration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySubmit = async (codeToVerify?: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const targetCode = codeToVerify || verificationCode;
      const res = await verifyAuthCodeService(pendingEmail, targetCode);

      if (res.verified && res.user) {
        setSuccessNotice("Email verified successfully! You are now signed in.");
        setTimeout(() => {
          onLoginSuccess(res.user);
          onClose();
        }, 800);
      } else {
        throw new Error("Invalid verification code. Please check your email.");
      }
    } catch (err: any) {
      setError(err?.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectLinkVerify = async () => {
    setError(null);
    setIsLoading(true);
    try {
      // Simulate user clicking the verification link directly in their Gmail inbox
      const res = await verifyAuthCodeService(pendingEmail, verificationCode);
      if (res.verified && res.user) {
        setSuccessNotice("Email verified through verification link! Welcome to CareerSphere AI.");
        setTimeout(() => {
          onLoginSuccess(res.user);
          onClose();
        }, 800);
      }
    } catch (err: any) {
      setError(err?.message || "Verification link failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendLink = async () => {
    if (!pendingEmail) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await sendAuthVerificationService(pendingEmail, name);
      setVerificationCode(res.simulationCode || "");
      setSimulatedLink(res.verificationLink);
      setSuccessNotice("A fresh verification link and code have been sent!");
    } catch (err: any) {
      setError(err?.message || "Could not resend link.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setIsLoading(true);
    // Standard sign-in
    setTimeout(() => {
      const user: UserAccount = {
        id: "usr-" + Date.now(),
        name: name || email.split("@")[0],
        email,
        isVerified: true,
        authProvider: "email",
        registeredAt: Date.now(),
      };
      onLoginSuccess(user);
      setIsLoading(false);
      onClose();
    }, 400);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const googleUser = await loginWithGooglePopup();
      setSuccessNotice(`Signed in as ${googleUser.email}! Synchronizing Firebase database...`);
      setTimeout(() => {
        onLoginSuccess(googleUser);
        setIsLoading(false);
        onClose();
      }, 700);
    } catch (err: any) {
      if (
        err?.code === "auth/popup-closed-by-user" ||
        err?.message?.includes("popup-closed-by-user") ||
        err?.message?.includes("closed")
      ) {
        setError("Google sign-in window was closed. Click Continue with Google to try again.");
        setIsLoading(false);
        return;
      }
      console.warn("Firebase Google login notice:", err);
      setError(err?.message || "Google sign-in could not be completed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div
        className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden my-8 ${
          isDark ? "bg-slate-900 border-slate-700/80 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Modal Header */}
        <div
          className={`p-5 border-b flex items-center justify-between ${
            isDark ? "border-slate-800 bg-slate-950/40" : "border-slate-100 bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {currentUser ? "Account Details" : authMode === "verify" ? "Verify Your Email" : authMode === "register" ? "Create Account" : "Sign In"}
              </h3>
              <p className="text-xs text-slate-400">
                {currentUser
                  ? "Manage your verified profile"
                  : "Unlock AI Resume, Unstop job alerts & memory"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notices */}
        {error && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-xs underline ml-2">
              Dismiss
            </button>
          </div>
        )}
        {successNotice && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Active Logged-In User Profile Screen */}
        {currentUser ? (
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-4 p-4 rounded-xl border border-sky-500/20 bg-sky-500/5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-md ring-2 ring-sky-500/40">
                {currentUser.photoUrl ? (
                  <img src={currentUser.photoUrl} alt={currentUser.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  currentUser.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-base">{currentUser.name}</h4>
                  {currentUser.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{currentUser.email}</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Auth Provider: <span className="capitalize text-slate-400">{currentUser.authProvider}</span>
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={async () => {
                  try {
                    await logoutFirebase();
                  } catch (e) {
                    console.warn("Logout error:", e);
                  }
                  onLogout();
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-medium border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {/* TAB SELECTOR: SIGN IN VS REGISTER */}
            {authMode !== "verify" && (
              <div className="flex rounded-xl p-1 bg-slate-800/80 mb-5 border border-slate-700/50">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("register");
                    setError(null);
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    authMode === "register"
                      ? "bg-sky-600 text-white shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Register with Verification
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signin");
                    setError(null);
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    authMode === "signin"
                      ? "bg-sky-600 text-white shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Sign In
                </button>
              </div>
            )}

            {/* VERIFICATION FLOW SCREEN */}
            {authMode === "verify" ? (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto shadow-inner">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-base">Check Your Gmail</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    We've sent a verification link & code to{" "}
                    <span className="font-medium text-sky-400">{pendingEmail}</span>
                  </p>
                </div>

                {/* Simulated Interactive Email Verification Link Action */}
                <div className="p-4 rounded-xl border border-sky-500/30 bg-sky-500/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                      Option 1: 1-Click Verification Link
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">
                      Simulated Inbox
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Click below to open the verification link dispatched to your Gmail:
                  </p>
                  <button
                    type="button"
                    onClick={handleDirectLinkVerify}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-md active:scale-98"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open & Verify via Email Link
                  </button>
                </div>

                {/* Option 2: Enter 6-Digit Code */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Option 2: Enter 6-Digit Code
                    </label>
                    {verificationCode && (
                      <span className="text-[11px] text-slate-400">
                        Code: <span className="font-mono text-sky-400 font-bold">{verificationCode}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 849201"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className={`flex-1 text-center font-mono text-base tracking-widest px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => handleVerifySubmit()}
                      disabled={isLoading || verificationCode.length !== 6}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 transition-colors shadow-sm"
                    >
                      Verify
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                  <button
                    type="button"
                    onClick={handleResendLink}
                    disabled={isLoading}
                    className="flex items-center gap-1 hover:text-sky-400 transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
                    Resend link
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("register")}
                    className="hover:text-slate-200 transition-colors"
                  >
                    Change email
                  </button>
                </div>
              </div>
            ) : (
              /* REGISTRATION / SIGN IN FORMS */
              <div className="space-y-4">
                {/* 1-Click Google / Gmail Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border text-xs sm:text-sm font-semibold transition-all shadow-sm ${
                    isDark
                      ? "bg-slate-800 border-slate-700 hover:bg-slate-750 text-white"
                      : "bg-white border-slate-300 hover:bg-slate-50 text-slate-800"
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google / Gmail</span>
                </button>

                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-slate-700/60 w-full"></div>
                  <span className="bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-500 absolute">
                    or continue with email
                  </span>
                </div>

                <form onSubmit={authMode === "register" ? handleRegister : handleSignIn} className="space-y-3.5">
                  {authMode === "register" && (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Veer Sharma"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={`w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Email Address (Gmail)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. ram2veer007@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-lg shadow-sky-600/25 transition-all active:scale-98 disabled:opacity-50"
                  >
                    {authMode === "register" ? (
                      <>
                        <span>Register & Send Verification Link</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
