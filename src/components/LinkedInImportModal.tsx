import React, { useState } from "react";
import {
  X,
  Linkedin,
  Link as LinkIcon,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Code,
  User,
  Award,
  Layers,
  FileText,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { CareerProfile, WorkExperienceItem, ProjectItem } from "../types";
import {
  parseLinkedInProfileUrl,
  simulateLinkedInOAuth,
  mergeCareerProfiles,
  DEFAULT_SECTION_CHOICES,
  LinkedInImportSectionChoice,
  LINKEDIN_PRESET_CANDIDATES,
  extractLinkedInHandle,
  LinkedInOAuthResult,
} from "../services/linkedinImportService";

interface LinkedInImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: CareerProfile;
  onApplyProfile: (updatedProfile: CareerProfile) => void;
  theme: "dark" | "light";
}

type ImportTab = "url" | "oauth";

export const LinkedInImportModal: React.FC<LinkedInImportModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onApplyProfile,
  theme,
}) => {
  if (!isOpen) return null;

  const isDark = theme === "dark";

  // Tab State
  const [activeTab, setActiveTab] = useState<ImportTab>("url");

  // Step State: 'input' | 'processing' | 'review' | 'success'
  const [step, setStep] = useState<"input" | "processing" | "review" | "success">("input");
  const [processingStatus, setProcessingStatus] = useState<string>("");

  // URL Mode inputs
  const [urlInput, setUrlInput] = useState<string>(
    currentProfile.linkedinUrl || "https://linkedin.com/in/veersharma-dev"
  );
  const [rawTextInput, setRawTextInput] = useState<string>("");
  const [isRawTextExpanded, setIsRawTextExpanded] = useState<boolean>(false);

  // OAuth Mode inputs
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>("veersharma");
  const [isCustomOAuth, setIsCustomOAuth] = useState<boolean>(false);
  const [customOAuthForm, setCustomOAuthForm] = useState({
    name: currentProfile.fullName || "",
    email: currentProfile.email || "",
    headline: currentProfile.currentRole || "Computer Science Undergraduate | Aspiring SDE",
    college: currentProfile.collegeName || "National Institute of Technology (NIT)",
    company: "Tech Solutions",
  });

  // Result state
  const [fetchedProfile, setFetchedProfile] = useState<CareerProfile | null>(null);
  const [oauthResult, setOauthResult] = useState<LinkedInOAuthResult | null>(null);
  const [sectionChoices, setSectionChoices] =
    useState<LinkedInImportSectionChoice>(DEFAULT_SECTION_CHOICES);
  const [showDiffView, setShowDiffView] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sample quick URLs
  const sampleUrls = [
    { label: "Veer Sharma (SDE Intern)", url: "https://linkedin.com/in/veersharma-dev" },
    { label: "Priya Nair (AI/ML Scholar)", url: "https://linkedin.com/in/priya-nair-ml" },
    { label: "Arjun Patel (Cloud/DevOps)", url: "https://linkedin.com/in/arjun-patel-cloud" },
    { label: "Ananya Sen (Frontend/Product)", url: "https://linkedin.com/in/ananya-sen-ui" },
  ];

  // Handle URL parsing
  const handleParseUrl = async () => {
    if (!urlInput.trim() && !rawTextInput.trim()) {
      setErrorMessage("Please enter a LinkedIn profile URL or paste profile text.");
      return;
    }

    setErrorMessage(null);
    setStep("processing");
    setProcessingStatus("Connecting to LinkedIn profile...");

    try {
      setTimeout(() => setProcessingStatus("Extracting credentials, education & experiences..."), 700);
      setTimeout(() => setProcessingStatus("Analyzing technical skills, projects & achievements..."), 1400);

      const parsed = await parseLinkedInProfileUrl(urlInput.trim(), rawTextInput.trim(), currentProfile);
      setFetchedProfile(parsed);
      setStep("review");
    } catch (err: any) {
      console.error("URL parsing error:", err);
      setErrorMessage(err.message || "Failed to parse LinkedIn profile. Please verify the URL or try simulated OAuth.");
      setStep("input");
    }
  };

  // Handle Simulated OAuth 2.0 flow
  const handleSimulateOAuth = async () => {
    setErrorMessage(null);
    setStep("processing");
    setProcessingStatus("Initializing simulated OAuth 2.0 authorization handshake...");

    try {
      setTimeout(() => setProcessingStatus("Exchanging authorization code for Bearer token..."), 600);
      setTimeout(() => setProcessingStatus("Querying LinkedIn Member Profile API (/v2/userinfo)..."), 1200);

      const result = await simulateLinkedInOAuth(
        isCustomOAuth ? "custom" : selectedPresetKey,
        isCustomOAuth ? customOAuthForm : undefined
      );

      setOauthResult(result);
      setFetchedProfile(result.profile);
      setStep("review");
    } catch (err: any) {
      console.error("OAuth simulation error:", err);
      setErrorMessage(err.message || "Failed to complete LinkedIn OAuth login.");
      setStep("input");
    }
  };

  // Handle Apply to CareerProfile
  const handleApply = () => {
    if (!fetchedProfile) return;

    const merged = mergeCareerProfiles(currentProfile, fetchedProfile, sectionChoices);
    onApplyProfile(merged);
    setStep("success");
    setTimeout(() => {
      onClose();
      setStep("input");
    }, 1800);
  };

  // Toggle individual section choice
  const toggleSection = (key: keyof LinkedInImportSectionChoice) => {
    setSectionChoices((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className={`w-full max-w-3xl my-8 rounded-2xl border shadow-2xl overflow-hidden transition-all duration-300 ${
          isDark
            ? "bg-slate-900 border-slate-700/80 text-slate-100"
            : "bg-white border-slate-200 text-slate-900 shadow-slate-300/50"
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-[#0A66C2]/15 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A66C2] flex items-center justify-center text-white shadow-md shadow-[#0A66C2]/30">
              <Linkedin className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">Import Profile from LinkedIn</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#0A66C2]/20 text-[#0A66C2] border border-[#0A66C2]/30">
                  Direct Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Populate your CareerProfile automatically via URL extraction or simulated OAuth 2.0
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: INPUT SCREEN */}
          {step === "input" && (
            <div className="space-y-6">
              {/* Tab Selector */}
              <div
                className={`grid grid-cols-2 p-1 rounded-xl border text-sm font-semibold ${
                  isDark ? "bg-slate-800/80 border-slate-700/60" : "bg-slate-100 border-slate-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveTab("url")}
                  className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                    activeTab === "url"
                      ? "bg-[#0A66C2] text-white shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Parse Profile URL</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("oauth")}
                  className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                    activeTab === "oauth"
                      ? "bg-[#0A66C2] text-white shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Simulated LinkedIn OAuth</span>
                </button>
              </div>

              {/* TAB 1: PARSE PROFILE URL */}
              {activeTab === "url" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>LinkedIn Profile URL</span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        e.g. https://www.linkedin.com/in/username
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                      </div>
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://linkedin.com/in/your-handle"
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                          isDark
                            ? "bg-slate-800/90 border-slate-700 text-white focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2]"
                            : "bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0A66C2]"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Quick sample chips */}
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Try Sample Profiles
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {sampleUrls.map((sample) => (
                        <button
                          key={sample.url}
                          type="button"
                          onClick={() => setUrlInput(sample.url)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-all text-left ${
                            urlInput === sample.url
                              ? "bg-[#0A66C2]/20 border-[#0A66C2] text-[#0A66C2] font-semibold"
                              : isDark
                              ? "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-500"
                              : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {sample.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional raw text paste accordion */}
                  <div
                    className={`rounded-xl border p-3.5 ${
                      isDark ? "bg-slate-800/40 border-slate-700/60" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setIsRawTextExpanded(!isRawTextExpanded)}
                      className="w-full flex items-center justify-between text-xs font-semibold text-slate-300"
                    >
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-sky-400" />
                        <span>Optional: Paste Profile Text / About Summary (100% Accuracy)</span>
                      </span>
                      {isRawTextExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    {isRawTextExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-700/50 space-y-2">
                        <p className="text-[11px] text-slate-400">
                          If your LinkedIn profile is private or you have custom text/resume bullet points,
                          paste them here. The AI engine will parse your specific academics, internships, and tools.
                        </p>
                        <textarea
                          rows={3}
                          value={rawTextInput}
                          onChange={(e) => setRawTextInput(e.target.value)}
                          placeholder="Paste About section, Experience descriptions, or College details..."
                          className={`w-full p-2.5 rounded-lg border text-xs outline-none ${
                            isDark
                              ? "bg-slate-800 border-slate-700 text-slate-200"
                              : "bg-white border-slate-300 text-slate-800"
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  {/* Action button */}
                  <button
                    type="button"
                    onClick={handleParseUrl}
                    className="w-full py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0A66C2]/25 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-sky-200" />
                    <span>Parse & Extract LinkedIn Data</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* TAB 2: SIMULATED OAUTH 2.0 */}
              {activeTab === "oauth" && (
                <div className="space-y-4">
                  {/* OAuth simulation banner */}
                  <div
                    className={`p-4 rounded-xl border flex items-start gap-3 ${
                      isDark ? "bg-[#0A66C2]/10 border-[#0A66C2]/30" : "bg-sky-50 border-sky-200"
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5 text-[#0A66C2] shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <p className="font-semibold text-sky-300">
                        Simulated LinkedIn OAuth 2.0 Handshake
                      </p>
                      <p className="text-slate-400">
                        Simulates the official OpenID Connect authorization code grant (<code className="text-sky-400">r_liteprofile</code> and <code className="text-sky-400">r_emailaddress</code>) to securely import verified candidate credentials without leaving AI Studio.
                      </p>
                    </div>
                  </div>

                  {/* Mode switch: Preset vs Custom */}
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-400">Select candidate identity to authorize:</span>
                    <button
                      type="button"
                      onClick={() => setIsCustomOAuth(!isCustomOAuth)}
                      className="text-[#0A66C2] hover:underline"
                    >
                      {isCustomOAuth ? "← Choose Preset Profile" : "+ Custom Candidate Details"}
                    </button>
                  </div>

                  {!isCustomOAuth ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {LINKEDIN_PRESET_CANDIDATES.map((cand) => {
                        const isSelected = selectedPresetKey === cand.key;
                        return (
                          <div
                            key={cand.key}
                            onClick={() => setSelectedPresetKey(cand.key)}
                            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                              isSelected
                                ? "bg-[#0A66C2]/15 border-[#0A66C2] ring-1 ring-[#0A66C2]"
                                : isDark
                                ? "bg-slate-800/60 border-slate-700/60 hover:border-slate-500"
                                : "bg-slate-50 border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <img
                              src={cand.avatar}
                              alt={cand.name}
                              className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <h4 className="text-xs font-bold truncate">{cand.name}</h4>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 font-medium">
                                  {cand.badge}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 line-clamp-1">{cand.headline}</p>
                              <p className="text-[10px] text-slate-500 mt-1">{cand.collegeOrCompany}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div
                      className={`p-4 rounded-xl border space-y-3 ${
                        isDark ? "bg-slate-800/60 border-slate-700/60" : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Candidate Name
                          </label>
                          <input
                            type="text"
                            value={customOAuthForm.name}
                            onChange={(e) =>
                              setCustomOAuthForm({ ...customOAuthForm, name: e.target.value })
                            }
                            placeholder="e.g. Veer Sharma"
                            className={`w-full px-3 py-1.5 rounded-lg border text-xs ${
                              isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={customOAuthForm.email}
                            onChange={(e) =>
                              setCustomOAuthForm({ ...customOAuthForm, email: e.target.value })
                            }
                            placeholder="candidate@example.com"
                            className={`w-full px-3 py-1.5 rounded-lg border text-xs ${
                              isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                            }`}
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            LinkedIn Headline / Target Track
                          </label>
                          <input
                            type="text"
                            value={customOAuthForm.headline}
                            onChange={(e) =>
                              setCustomOAuthForm({ ...customOAuthForm, headline: e.target.value })
                            }
                            placeholder="e.g. 3rd Year B.Tech CSE | SDE Intern"
                            className={`w-full px-3 py-1.5 rounded-lg border text-xs ${
                              isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            College / Institute
                          </label>
                          <input
                            type="text"
                            value={customOAuthForm.college}
                            onChange={(e) =>
                              setCustomOAuthForm({ ...customOAuthForm, college: e.target.value })
                            }
                            placeholder="e.g. NIT / IIT"
                            className={`w-full px-3 py-1.5 rounded-lg border text-xs ${
                              isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Company / Internship
                          </label>
                          <input
                            type="text"
                            value={customOAuthForm.company}
                            onChange={(e) =>
                              setCustomOAuthForm({ ...customOAuthForm, company: e.target.value })
                            }
                            placeholder="e.g. CloudVibe Tech"
                            className={`w-full px-3 py-1.5 rounded-lg border text-xs ${
                              isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Authorize button */}
                  <button
                    type="button"
                    onClick={handleSimulateOAuth}
                    className="w-full py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0A66C2]/25 transition-all"
                  >
                    <Linkedin className="w-4 h-4 fill-current" />
                    <span>Authorize with LinkedIn (Simulate OAuth 2.0)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: PROCESSING ANIMATION */}
          {step === "processing" && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-[#0A66C2]/20 border border-[#0A66C2]/40 flex items-center justify-center animate-pulse">
                  <Linkedin className="w-8 h-8 text-[#0A66C2] fill-current" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-100">Fetching LinkedIn Career Data</h3>
                <p className="text-xs text-sky-400 font-medium">{processingStatus}</p>
              </div>

              <div className="w-56 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#0A66C2] to-emerald-400 rounded-full animate-[progress_1.5s_ease-in-out_infinite]" />
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & MERGE SCREEN */}
          {step === "review" && fetchedProfile && (
            <div className="space-y-5 animate-fade-in max-h-[60vh] overflow-y-auto pr-1">
              {/* Fetched Candidate Summary Card */}
              <div
                className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isDark ? "bg-[#0A66C2]/10 border-[#0A66C2]/30" : "bg-sky-50 border-sky-200"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={
                      fetchedProfile.photo ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    }
                    alt={fetchedProfile.fullName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#0A66C2] shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{fetchedProfile.fullName}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#0A66C2] text-white">
                        LinkedIn Verified
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-1">{fetchedProfile.currentRole}</p>
                    <p className="text-[11px] text-slate-400">
                      {fetchedProfile.collegeName} • {fetchedProfile.collegeYear}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setShowDiffView(!showDiffView)}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
                  >
                    {showDiffView ? "Compact View" : "Diff vs Current"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("input");
                      setFetchedProfile(null);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                    title="Start Over"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Section Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    Select sections to merge into your CareerProfile:
                  </span>
                  <div className="space-x-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() =>
                        setSectionChoices({
                          basicInfo: true,
                          academics: true,
                          experiences: true,
                          projects: true,
                          skills: true,
                          summary: true,
                          certifications: true,
                        })
                      }
                      className="text-[#0A66C2] hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-slate-600">•</span>
                    <button
                      type="button"
                      onClick={() =>
                        setSectionChoices({
                          basicInfo: false,
                          academics: false,
                          experiences: false,
                          projects: false,
                          skills: false,
                          summary: false,
                          certifications: false,
                        })
                      }
                      className="text-slate-400 hover:underline"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* 1. Basic Info */}
                  <div
                    onClick={() => toggleSection("basicInfo")}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      sectionChoices.basicInfo
                        ? "bg-slate-800/90 border-[#0A66C2]"
                        : "bg-slate-800/30 border-slate-700/40 opacity-60"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border ${
                        sectionChoices.basicInfo
                          ? "bg-[#0A66C2] border-[#0A66C2] text-white"
                          : "border-slate-600"
                      }`}
                    >
                      {sectionChoices.basicInfo && <Check className="w-3 h-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <User className="w-3.5 h-3.5 text-sky-400" />
                        <span>Identity & Contacts</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {fetchedProfile.fullName} ({fetchedProfile.email || "No email"})
                      </p>
                    </div>
                  </div>

                  {/* 2. Academics */}
                  <div
                    onClick={() => toggleSection("academics")}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      sectionChoices.academics
                        ? "bg-slate-800/90 border-[#0A66C2]"
                        : "bg-slate-800/30 border-slate-700/40 opacity-60"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border ${
                        sectionChoices.academics
                          ? "bg-[#0A66C2] border-[#0A66C2] text-white"
                          : "border-slate-600"
                      }`}
                    >
                      {sectionChoices.academics && <Check className="w-3 h-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Academics & College</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {fetchedProfile.collegeName} • {fetchedProfile.currentCgpa || "CGPA: 8.8"}
                      </p>
                    </div>
                  </div>

                  {/* 3. Work Experiences */}
                  <div
                    onClick={() => toggleSection("experiences")}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      sectionChoices.experiences
                        ? "bg-slate-800/90 border-[#0A66C2]"
                        : "bg-slate-800/30 border-slate-700/40 opacity-60"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border ${
                        sectionChoices.experiences
                          ? "bg-[#0A66C2] border-[#0A66C2] text-white"
                          : "border-slate-600"
                      }`}
                    >
                      {sectionChoices.experiences && <Check className="w-3 h-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                        <span>Work & Internships ({fetchedProfile.experiences?.length || 0})</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {fetchedProfile.experiences?.[0]?.company || "Experience records"}
                      </p>
                    </div>
                  </div>

                  {/* 4. Projects */}
                  <div
                    onClick={() => toggleSection("projects")}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      sectionChoices.projects
                        ? "bg-slate-800/90 border-[#0A66C2]"
                        : "bg-slate-800/30 border-slate-700/40 opacity-60"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border ${
                        sectionChoices.projects
                          ? "bg-[#0A66C2] border-[#0A66C2] text-white"
                          : "border-slate-600"
                      }`}
                    >
                      {sectionChoices.projects && <Check className="w-3 h-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <Code className="w-3.5 h-3.5 text-violet-400" />
                        <span>Technical Projects ({fetchedProfile.projects?.length || 0})</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {fetchedProfile.projects?.[0]?.title || "Project showcases"}
                      </p>
                    </div>
                  </div>

                  {/* 5. Skills */}
                  <div
                    onClick={() => toggleSection("skills")}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      sectionChoices.skills
                        ? "bg-slate-800/90 border-[#0A66C2]"
                        : "bg-slate-800/30 border-slate-700/40 opacity-60"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border ${
                        sectionChoices.skills
                          ? "bg-[#0A66C2] border-[#0A66C2] text-white"
                          : "border-slate-600"
                      }`}
                    >
                      {sectionChoices.skills && <Check className="w-3 h-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <Layers className="w-3.5 h-3.5 text-sky-400" />
                        <span>Skills & Tools ({fetchedProfile.skills?.length || 0})</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {(fetchedProfile.skills || []).slice(0, 4).join(", ")}...
                      </p>
                    </div>
                  </div>

                  {/* 6. Summary & Certifications */}
                  <div
                    onClick={() => toggleSection("summary")}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      sectionChoices.summary
                        ? "bg-slate-800/90 border-[#0A66C2]"
                        : "bg-slate-800/30 border-slate-700/40 opacity-60"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border ${
                        sectionChoices.summary
                          ? "bg-[#0A66C2] border-[#0A66C2] text-white"
                          : "border-slate-600"
                      }`}
                    >
                      {sectionChoices.summary && <Check className="w-3 h-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <Award className="w-3.5 h-3.5 text-rose-400" />
                        <span>Summary & Certifications</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        Professional bio & credentials
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side-by-side diff preview if toggled */}
              {showDiffView && (
                <div
                  className={`p-4 rounded-xl border text-xs space-y-3 ${
                    isDark ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200"
                  }`}
                >
                  <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                    Detailed Comparison
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Current Profile</span>
                      <p className="text-slate-300 font-semibold">{currentProfile.fullName || "Unset"}</p>
                      <p className="text-slate-400 text-[11px]">{currentProfile.currentRole || "Unset"}</p>
                      <p className="text-slate-400 text-[11px]">{currentProfile.collegeName || "Unset"}</p>
                      <p className="text-slate-400 text-[11px]">
                        Skills: {(currentProfile.skills || []).length} registered
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-sky-400 uppercase">Incoming LinkedIn</span>
                      <p className="text-emerald-400 font-semibold">{fetchedProfile.fullName}</p>
                      <p className="text-slate-300 text-[11px]">{fetchedProfile.currentRole}</p>
                      <p className="text-slate-300 text-[11px]">{fetchedProfile.collegeName}</p>
                      <p className="text-slate-300 text-[11px]">
                        Skills: {(fetchedProfile.skills || []).length} discovered
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep("input")}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  ← Back to Source
                </button>

                <button
                  type="button"
                  onClick={handleApply}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0A66C2] to-emerald-600 hover:from-[#004182] hover:to-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Update CareerProfile</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CELEBRATORY SUCCESS STATE */}
          {step === "success" && (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-3 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-emerald-400">
                CareerProfile Successfully Updated!
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Your LinkedIn details have been applied and synced to your cloud account. Your resume and advisor recommendations are now updated.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
