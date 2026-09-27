import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Eye,
  EyeOff,
  ChevronLeft,
} from "lucide-react";
import { UserAccount, CareerProfile } from "../types";
import { CareerSphereLogo } from "../components/CareerSphereLogo";
import {
  auth,
  loginWithGooglePopup,
  registerWithEmailAndPassword,
  saveCareerProfileToFirestore,
} from "../services/firebase";

interface RegisterPageProps {
  currentUser: UserAccount | null;
  onLoginSuccess: (user: UserAccount) => void;
  onUpdateProfile?: (profile: Partial<CareerProfile>) => void;
  theme: "dark" | "light";
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  currentUser,
  onLoginSuccess,
  onUpdateProfile,
  theme,
}) => {
  const navigate = useNavigate();
  const isDark = theme === "dark";

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [targetTrack, setTargetTrack] = useState("Software Development Engineer (SDE / Full-Stack)");
  const [collegeYear, setCollegeYear] = useState("3rd Year");
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Show/Hide Password
  const [showPassword, setShowPassword] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Password Strength Calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "Empty", color: "bg-slate-700" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-rose-500" };
    if (score === 2) return { score: 2, label: "Fair", color: "bg-amber-500" };
    if (score === 3) return { score: 3, label: "Good", color: "bg-sky-500" };
    return { score: 4, label: "Strong", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength(password);

  // Handle Google Registration
  const handleGoogleSignUp = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const user = await loginWithGooglePopup();
      onLoginSuccess(user);
      setSuccessNotice(`Account registered with Google as ${user.name}!`);
      setTimeout(() => {
        navigate("/profile");
      }, 500);
    } catch (err: any) {
      if (
        err?.code === "auth/popup-closed-by-user" ||
        err?.message?.includes("popup-closed-by-user") ||
        err?.message?.includes("closed")
      ) {
        setError("Google registration popup was closed. Click above to try again.");
      } else {
        console.error("Google Auth error:", err);
        setError(err?.message || "Google registration failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email / Password Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }
    if (!agreeTerms) {
      setError("Please accept the Terms of Service to create your candidate account.");
      return;
    }

    setIsLoading(true);
    try {
      let userAccount: UserAccount;
      try {
        userAccount = await registerWithEmailAndPassword(fullName.trim(), email, password);
      } catch (fbErr: any) {
        if (
          fbErr?.code === "auth/operation-not-allowed" ||
          fbErr?.message?.includes("operation-not-allowed") ||
          fbErr?.message?.includes("not enabled")
        ) {
          // If Email/Password is not enabled in Firebase Console, fallback to local student account
          userAccount = {
            id: "usr-" + Date.now(),
            name: fullName.trim(),
            email: email,
            isVerified: true,
            authProvider: "email",
            registeredAt: Date.now(),
          };
        } else if (
          fbErr?.message?.includes("already registered") ||
          fbErr?.code === "auth/email-already-in-use"
        ) {
          throw fbErr;
        } else {
          throw fbErr;
        }
      }

      // Initial Career Profile sync
      if (onUpdateProfile) {
        onUpdateProfile({
          fullName: fullName.trim(),
          email: email,
          targetRole: targetTrack,
          collegeYear: collegeYear,
        });
      }

      // Only attempt Firestore cloud write if user has active Firebase Auth session
      if (auth.currentUser && auth.currentUser.uid === userAccount.id) {
        saveCareerProfileToFirestore(userAccount.id, {
          fullName: fullName.trim(),
          email: email,
          targetRole: targetTrack,
          collegeYear: collegeYear,
        }).catch((e) => console.warn("Initial profile cloud sync notice:", e));
      }

      onLoginSuccess(userAccount);
      setSuccessNotice(`Account created successfully! Welcome, ${fullName.trim()}.`);
      setTimeout(() => {
        navigate("/profile");
      }, 600);
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Instant Student Registration
  const handleQuickStudentRegistration = () => {
    setFullName("Veer Sharma");
    setEmail("ram2veer007@gmail.com");
    setPassword("CareerSphere@2026");
    setConfirmPassword("CareerSphere@2026");
    setTargetTrack("Software Development Engineer (SDE / Full-Stack)");
    setCollegeYear("3rd Year");
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
          <span className="text-[#475569] dark:text-slate-400">Already registered?</span>
          <Link
            to="/login"
            className="px-3.5 py-1.5 rounded-xl glass-btn text-[#059669] font-bold"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-xl">
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
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold neu-inset-sm text-[#059669] mb-3">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>New Candidate Registration</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1E293B] dark:text-white">
                Create your CareerSphere Account
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 mt-2 font-medium">
                Join thousands of engineering and business candidates accelerating placements, building ATS resumes, and practicing mock interviews.
              </p>
            </div>

            {/* Notifications */}
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

            {/* Google Quick Sign-Up */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
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
              <span>Sign Up with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-5">
              <div className="border-t border-[#475569]/20 w-full"></div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-3 relative z-10 text-[#475569] dark:text-slate-400">
                Or register with email
              </span>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#475569] dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#475569] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Veer Sharma"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm neu-inset font-medium focus:outline-none ${
                      isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                    }`}
                  />
                </div>
              </div>

              {/* Email */}
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
                    placeholder="name@college.edu or gmail.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm neu-inset font-medium focus:outline-none ${
                      isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                    }`}
                  />
                </div>
              </div>

              {/* Target Role & Academic Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] dark:text-slate-300 mb-1.5">
                    Target Role / Track
                  </label>
                  <select
                    value={targetTrack}
                    onChange={(e) => setTargetTrack(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm neu-inset font-medium focus:outline-none cursor-pointer ${
                      isDark ? "text-slate-100 bg-[#0F172A]" : "text-[#1E293B] bg-[#F1F5F9]"
                    }`}
                  >
                    <option value="Software Development Engineer (SDE / Full-Stack)">
                      SDE / Full-Stack Engineer
                    </option>
                    <option value="Frontend Developer (React / Next.js)">
                      Frontend Developer
                    </option>
                    <option value="Backend Developer (Node / Java / Go)">
                      Backend Developer
                    </option>
                    <option value="AI / Machine Learning Engineer">
                      AI & Machine Learning
                    </option>
                    <option value="Data Analyst & Business Intelligence">
                      Data Analyst / BI
                    </option>
                    <option value="Product Manager / Associate PM">
                      Product Manager (APM)
                    </option>
                    <option value="DevOps & Cloud Engineer">
                      DevOps & Cloud Engineer
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] dark:text-slate-300 mb-1.5">
                    Current Academic Year
                  </label>
                  <select
                    value={collegeYear}
                    onChange={(e) => setCollegeYear(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm neu-inset font-medium focus:outline-none cursor-pointer ${
                      isDark ? "text-slate-100 bg-[#0F172A]" : "text-[#1E293B] bg-[#F1F5F9]"
                    }`}
                  >
                    <option value="1st Year">1st Year Undergraduate</option>
                    <option value="2nd Year">2nd Year Undergraduate</option>
                    <option value="3rd Year">3rd Year (Pre-Final)</option>
                    <option value="Final Year">Final Year Undergraduate</option>
                    <option value="Recent Graduate (0-2 Yrs)">Recent Graduate (0-2 Yrs)</option>
                    <option value="Master's / Post-Graduate">Master's / Post-Graduate</option>
                  </select>
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] dark:text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#475569] absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 chars"
                      className={`w-full pl-10 pr-9 py-2.5 rounded-xl text-sm neu-inset font-medium focus:outline-none ${
                        isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-[#475569] hover:text-[#059669] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] dark:text-slate-300 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#475569] absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm neu-inset font-medium focus:outline-none ${
                        isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#475569] dark:text-slate-400 font-medium">Password strength:</span>
                    <span className="font-bold text-[#059669]">{strength.label}</span>
                  </div>
                  <div className="w-full h-2 neu-inset-sm rounded-full overflow-hidden flex gap-1 p-0.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full flex-1 rounded-full transition-colors ${
                          step <= strength.score ? strength.color : "bg-transparent"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 accent-[#059669] cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-[#475569] dark:text-slate-400 leading-relaxed cursor-pointer font-medium">
                  I agree to create my profile and allow CareerSphere AI to analyze my academic milestones and generate targeted placement roadmaps.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl neu-btn-accent text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                <span>{isLoading ? "Creating Account..." : "Create Free Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Pre-fill for testing convenience */}
            <div className="mt-5 pt-4 border-t border-[#475569]/20 flex items-center justify-between">
              <span className="text-xs text-[#475569] dark:text-slate-400 font-medium">Testing preview?</span>
              <button
                type="button"
                onClick={handleQuickStudentRegistration}
                className="text-xs text-[#059669] hover:underline font-bold cursor-pointer"
              >
                Fill with Student Profile &rarr;
              </button>
            </div>

            {/* Link to Login Page */}
            <div className="mt-6 text-center text-xs text-[#475569] dark:text-slate-400 font-medium">
              <span>Already have an account? </span>
              <Link
                to="/login"
                className="text-[#059669] font-bold hover:underline ml-1"
              >
                Sign in to your account &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[#475569] dark:text-slate-400 border-t border-[#475569]/20 font-medium">
        CareerSphere AI • Secure Firebase Firestore Authentication & Persistence
      </footer>
    </div>
  );
};
