import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Briefcase,
  Compass,
  FileText,
  LogOut,
  ChevronLeft,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
} from "lucide-react";
import { UserAccount } from "../types";
import { CareerSphereLogo } from "../components/CareerSphereLogo";
import {
  loginWithGooglePopup,
  loginWithEmailAndPassword,
  resetPasswordEmail,
} from "../services/firebase";

interface LoginPageProps {
  currentUser: UserAccount | null;
  onLoginSuccess: (user: UserAccount) => void;
  onLogout: () => void;
  theme: "dark" | "light";
}

export const LoginPage: React.FC<LoginPageProps> = ({
  currentUser,
  onLoginSuccess,
  onLogout,
  theme,
}) => {
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  // UI status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Handle Firebase Google Sign-In Popup
  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const user = await loginWithGooglePopup();
      onLoginSuccess(user);
      setSuccessNotice(`Welcome back, ${user.name}!`);
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err: any) {
      if (
        err?.code === "auth/popup-closed-by-user" ||
        err?.message?.includes("popup-closed-by-user") ||
        err?.message?.includes("closed")
      ) {
        setError("Google sign-in popup was closed. Click above to try again.");
      } else {
        console.error("Google Auth error:", err);
        setError(err?.message || "Google sign-in could not be completed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email / Password Sign In with Firebase
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!email || !password) {
        throw new Error("Please provide both email and password.");
      }

      let userAccount: UserAccount;
      try {
        userAccount = await loginWithEmailAndPassword(email, password);
      } catch (firebaseErr: any) {
        if (
          firebaseErr?.code === "auth/operation-not-allowed" ||
          firebaseErr?.message?.includes("operation-not-allowed") ||
          firebaseErr?.message?.includes("not enabled")
        ) {
          // If Email/Password is not enabled in Firebase Console, fallback to local student account
          userAccount = {
            id: "usr-" + Date.now(),
            name: email.split("@")[0] || "Student Candidate",
            email: email,
            isVerified: true,
            authProvider: "email",
            registeredAt: Date.now(),
          };
          onLoginSuccess(userAccount);
          setSuccessNotice(`Signed in locally as ${userAccount.name}. Use Google sign-in for full cloud sync.`);
          setTimeout(() => {
            navigate("/dashboard");
          }, 500);
          return;
        }
        throw firebaseErr;
      }

      onLoginSuccess(userAccount);
      setSuccessNotice(`Signed in successfully as ${userAccount.name}`);
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err: any) {
      setError(err?.message || "Sign in failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setError("Please enter your email to receive password reset instructions.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await resetPasswordEmail(forgotEmail);
      setSuccessNotice(`Password reset link dispatched to ${forgotEmail}.`);
      setShowForgotPassword(false);
    } catch (err: any) {
      setError(err?.message || "Could not send password reset email.");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo Account (Veer Sharma)
  const handleDemoSignIn = () => {
    const demoUser: UserAccount = {
      id: "usr-demo-veer",
      name: "Veer Sharma",
      email: "ram2veer007@gmail.com",
      isVerified: true,
      authProvider: "google",
      registeredAt: Date.now(),
      photoUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    };
    onLoginSuccess(demoUser);
    setSuccessNotice("Signed in as Demo Candidate: Veer Sharma");
    setTimeout(() => {
      navigate("/dashboard");
    }, 400);
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors ${
        isDark ? "bg-[#0F172A] text-slate-100" : "bg-[#F1F5F9] text-[#1E293B]"
      }`}
    >
      {/* Top Bar */}
      <header
        className={`h-16 px-6 sm:px-10 flex items-center justify-between border-b transition-colors backdrop-blur-xl ${
          isDark ? "bg-[#0F172A]/75 border-white/10" : "bg-white/70 border-white/60"
        }`}
      >
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-btn text-[#475569] dark:text-slate-300 hover:text-[#059669] transition-colors cursor-pointer text-xs font-semibold"
            title="Return to Starting Page"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <Link
            to="/dashboard"
            className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-xl glass-btn text-[#475569] dark:text-slate-300 hover:text-[#059669] transition-colors cursor-pointer text-xs font-semibold"
          >
            Dashboard
          </Link>
        </div>

        <Link to="/" className="flex items-center gap-2.5 cursor-pointer">
          <div className="p-1 rounded-xl glass-btn flex items-center justify-center">
            <CareerSphereLogo size={28} showAura={false} />
          </div>
          <span className="font-bold text-lg tracking-tight text-[#1E293B] dark:text-white">CareerSphere AI</span>
        </Link>

        <div className="hidden sm:flex items-center gap-3 text-xs font-semibold">
          <span className="text-[#475569] dark:text-slate-400">Need an account?</span>
          <Link
            to="/register"
            className="px-3.5 py-1.5 rounded-xl glass-btn-accent text-white font-bold"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-xl">
          {/* Glass Card Frame */}
          <div
            className="rounded-3xl glass-card p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
          >
            {/* Specular Ambient Edge Sheen */}
            <div
              className="absolute top-0 left-0 right-0 h-[1.5px] pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
              }}
            />
            {/* If user is already signed in */}
            {currentUser ? (
              <div className="text-center space-y-6 py-2">
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-2xl neu-btn flex items-center justify-center text-[#059669] text-2xl font-black mx-auto overflow-hidden">
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
                  {currentUser.isVerified && (
                    <div className="absolute -bottom-1 -right-1 p-1 bg-[#059669] text-white rounded-full shadow">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold neu-inset-sm text-[#059669] mb-2">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Currently Signed In</span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#1E293B] dark:text-white">{currentUser.name}</h2>
                  <p className="text-sm text-[#475569] dark:text-slate-400 mt-1 font-medium">{currentUser.email}</p>
                  <p className="text-xs text-[#475569] dark:text-slate-400 mt-0.5">
                    Auth Provider: <span className="font-bold text-[#059669] uppercase">{currentUser.authProvider}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full py-3 px-4 rounded-xl neu-btn-accent text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Open Dashboard</span>
                  </button>

                  <button
                    onClick={() => navigate("/logout")}
                    className="w-full py-3 px-4 rounded-xl neu-btn text-rose-500 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out Page</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-[#475569]/20 flex justify-center gap-4 text-xs font-semibold text-[#475569] dark:text-slate-400">
                  <Link to="/profile" className="hover:text-[#059669] transition-colors">
                    Candidate Profile
                  </Link>
                  <span>•</span>
                  <Link to="/resume" className="hover:text-[#059669] transition-colors">
                    Resume Dashboard
                  </Link>
                  <span>•</span>
                  <Link to="/jobs" className="hover:text-[#059669] transition-colors">
                    Job Finder
                  </Link>
                </div>
              </div>
            ) : (
              /* Dedicated Sign In Form */
              <div>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold neu-inset-sm text-[#059669] mb-3">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Official Candidate Sign In</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1E293B] dark:text-white">
                    Welcome back to CareerSphere
                  </h1>
                  <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 mt-2 font-medium">
                    Sign in to access your cloud-synchronized career consultations, ATS resumes, and Unstop job tracker.
                  </p>
                </div>

                {/* Alerts */}
                {error && (
                  <div className="mb-5 p-3.5 rounded-xl neu-inset-sm text-rose-500 text-xs sm:text-sm flex items-start gap-2.5 font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {successNotice && (
                  <div className="mb-5 p-3.5 rounded-xl neu-inset-sm text-[#059669] text-xs sm:text-sm flex items-start gap-2.5 font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{successNotice}</span>
                  </div>
                )}

                {/* Google Sign In Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl neu-btn font-bold text-sm flex items-center justify-center gap-3 transition-all mb-4 text-[#1E293B] dark:text-slate-100 cursor-pointer"
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
                  <span>Continue with Google</span>
                </button>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-5">
                  <div className="border-t border-[#475569]/20 w-full"></div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 relative z-10 text-[#475569] dark:text-slate-400">
                    Or sign in with email
                  </span>
                </div>

                {/* Email Sign In Form */}
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] dark:text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#475569] absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@college.edu or name@gmail.com"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm neu-inset font-medium focus:outline-none ${
                          isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-[#475569] dark:text-slate-300">Password</label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(email);
                          setShowForgotPassword(!showForgotPassword);
                        }}
                        className="text-xs text-[#059669] hover:underline font-bold cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#475569] absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm neu-inset font-medium focus:outline-none ${
                          isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-[#475569] hover:text-[#059669] cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Reset Section */}
                  {showForgotPassword && (
                    <div className="p-3.5 rounded-xl neu-inset-sm space-y-2.5">
                      <p className="text-xs text-[#475569] dark:text-slate-300 font-medium">
                        Enter your email to receive a password reset link:
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="your.email@gmail.com"
                          className="flex-1 px-3 py-1.5 rounded-lg neu-inset text-xs outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleForgotPasswordSubmit}
                          disabled={isLoading}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold neu-btn-accent text-white cursor-pointer"
                        >
                          Send Link
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl neu-btn-accent text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>{isLoading ? "Signing in..." : "Sign In to Account"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Instant Demo Candidate Login */}
                <div className="mt-6 pt-5 border-t border-[#475569]/20">
                  <div className="flex items-center justify-between text-xs text-[#475569] dark:text-slate-400 mb-2 font-medium">
                    <span>Quick Preview Access:</span>
                    <span className="text-[#059669] font-bold">1-Click Login</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDemoSignIn}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold neu-btn flex items-center justify-between transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg neu-inset-sm text-[#059669] flex items-center justify-center font-bold text-[10px]">
                        VS
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-[#1E293B] dark:text-slate-100">Veer Sharma (Student Demo)</div>
                        <div className="text-[10px] text-[#475569] dark:text-slate-400 font-medium">ram2veer007@gmail.com</div>
                      </div>
                    </div>
                    <span className="text-[#059669] text-xs font-bold">Sign in &rarr;</span>
                  </button>
                </div>

                {/* Link to Registration Page */}
                <div className="mt-6 text-center text-xs text-[#475569] dark:text-slate-400 font-medium">
                  <span>Don't have an account? </span>
                  <Link
                    to="/register"
                    className="text-[#059669] font-bold hover:underline ml-1"
                  >
                    Create a free account &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[#475569] dark:text-slate-400 border-t border-[#475569]/20 font-medium">
        CareerSphere AI • Powered by Google Gemini & Firebase Cloud Engine
      </footer>
    </div>
  );
};
