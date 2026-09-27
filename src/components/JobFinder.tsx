import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Search,
  Filter,
  Sparkles,
  ExternalLink,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Building2,
  DollarSign,
  GraduationCap,
  RefreshCw,
  Award,
  ChevronRight,
} from "lucide-react";
import { CareerProfile, UnstopJob } from "../types";
import { fetchUnstopJobsService } from "../services/careerService";
import { onKeyEnterOrSpace } from "../utils/keyboardAccessibility";

interface JobFinderProps {
  profile: CareerProfile;
  onOpenProfileModal: () => void;
  onOpenResumeBuilder: () => void;
  theme: "dark" | "light";
}

export const JobFinder: React.FC<JobFinderProps> = ({
  profile,
  onOpenProfileModal,
  onOpenResumeBuilder,
  theme,
}) => {
  const isDark = theme === "dark";
  const [jobs, setJobs] = useState<UnstopJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [error, setError] = useState<string | null>(null);

  const loadJobs = async (cat?: string, kw?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const fetched = await fetchUnstopJobsService(profile, {
        category: cat || selectedCategory,
        keyword: kw !== undefined ? kw : searchKeyword,
      });
      setJobs(fetched);
    } catch (err: any) {
      setError(err?.message || "Failed to load Unstop jobs matching your resume.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [profile.targetRole, profile.collegeYear, profile.currentCgpa]);

  // Client-side filtering for fast interactive responsiveness
  const filteredJobs = jobs.filter((job) => {
    const matchesCat =
      selectedCategory === "All" ||
      (selectedCategory === "Internships" && job.type === "Internship") ||
      (selectedCategory === "Full-Time" && job.type === "Full-Time") ||
      (selectedCategory === "Hiring Challenges" &&
        (job.type === "Hiring Challenge" || job.type === "Hackathon"));

    const matchesLoc =
      selectedLocation === "All" ||
      job.location.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesSearch =
      !searchKeyword.trim() ||
      job.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      job.company.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      job.matchingSkills.some((s) => s.toLowerCase().includes(searchKeyword.toLowerCase()));

    return matchesCat && matchesLoc && matchesSearch;
  });

  const categories = [
    { key: "All", label: "All Unstop Opportunities" },
    { key: "Internships", label: "Internships (2025/2026)" },
    { key: "Full-Time", label: "Graduate & Fresher Jobs" },
    { key: "Hiring Challenges", label: "Corporate Hiring Challenges" },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Top Banner / Hero */}
      <div
        className={`px-4 sm:px-8 py-5 border-b shrink-0 ${
          isDark
            ? "bg-[#0F172A] border-[#475569]/30"
            : "bg-[#F1F5F9] border-[#475569]/20"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider neu-inset-sm text-[#059669] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                Unstop Live Search & Matching
              </span>
              <span className="text-[11px] text-[#059669] font-bold px-2 py-0.5 rounded-lg neu-inset-sm">
                AI Powered
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E293B] dark:text-white">
              Unstop Job & Internship Finder
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 max-w-2xl font-medium">
              Discover active hiring opportunities, campus challenges, and internships on Unstop
              curated directly for your resume, college year, and current CGPA.
            </p>
          </div>

          {/* Candidate Profile Snapshot Pill */}
          <div
            className="p-3.5 rounded-2xl neu-flat flex flex-wrap items-center gap-3 text-xs"
          >
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#059669]" />
              <div>
                <span className="text-[#475569] dark:text-slate-400 text-[10px] block font-semibold">MATCHING PROFILE</span>
                <span className="font-bold text-[#1E293B] dark:text-slate-200">
                  {profile.collegeYear || "3rd Year"} • CGPA: {profile.currentCgpa || "8.5+"}
                </span>
              </div>
            </div>
            <div className="h-6 w-px bg-[#475569]/30 hidden sm:block"></div>
            <div>
              <span className="text-[#475569] dark:text-slate-400 text-[10px] block font-semibold">TARGET DOMAIN</span>
              <span className="font-bold text-[#059669]">
                {profile.targetRole || "Software Engineer / SDE"}
              </span>
            </div>
            <button
              onClick={onOpenProfileModal}
              className="text-[11px] text-[#059669] hover:underline font-bold ml-auto cursor-pointer"
            >
              Update
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-4 pt-4 border-t border-[#475569]/20 dark:border-[#475569]/30 flex flex-wrap items-center justify-between gap-3">
          {/* Category Tabs */}
          <div
            role="tablist"
            aria-label="Job category filters"
            className="flex items-center gap-2 overflow-x-auto scrollbar-none"
          >
            {categories.map((cat) => (
              <button
                key={cat.key}
                role="tab"
                aria-selected={selectedCategory === cat.key}
                tabIndex={0}
                onClick={() => setSelectedCategory(cat.key)}
                onKeyDown={onKeyEnterOrSpace(() => setSelectedCategory(cat.key))}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.key
                    ? "neu-btn-accent text-white"
                    : "neu-btn text-[#475569] dark:text-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Inputs */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-[#475569] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search role, skills, company..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className={`w-full text-xs pl-8 pr-3 py-1.5 rounded-xl neu-inset focus:outline-none ${
                  isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
                }`}
              />
            </div>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl neu-btn text-[#475569] dark:text-slate-300 font-medium focus:outline-none cursor-pointer"
            >
              <option value="All" className={isDark ? "bg-[#0F172A] text-white" : "bg-[#F1F5F9] text-[#1E293B]"}>All Locations</option>
              <option value="Remote" className={isDark ? "bg-[#0F172A] text-white" : "bg-[#F1F5F9] text-[#1E293B]"}>Remote</option>
              <option value="Bengaluru" className={isDark ? "bg-[#0F172A] text-white" : "bg-[#F1F5F9] text-[#1E293B]"}>Bengaluru</option>
              <option value="Pune" className={isDark ? "bg-[#0F172A] text-white" : "bg-[#F1F5F9] text-[#1E293B]"}>Pune</option>
              <option value="Hyderabad" className={isDark ? "bg-[#0F172A] text-white" : "bg-[#F1F5F9] text-[#1E293B]"}>Hyderabad</option>
              <option value="Delhi" className={isDark ? "bg-[#0F172A] text-white" : "bg-[#F1F5F9] text-[#1E293B]"}>Delhi NCR</option>
            </select>

            <button
              onClick={() => loadJobs()}
              onKeyDown={onKeyEnterOrSpace(() => loadJobs())}
              disabled={isLoading}
              title="Refresh Unstop Jobs with AI"
              aria-label="Refresh Unstop Jobs with AI"
              className="p-2 rounded-xl neu-btn text-[#475569] dark:text-slate-300 hover:text-[#059669] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#059669]" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Results Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {error && (
          <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="underline text-xs ml-2">
              Dismiss
            </button>
          </div>
        )}

        {/* Count Bar */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing <strong className="text-white">{filteredJobs.length}</strong> matching
            opportunities on Unstop
          </span>
          <span className="text-[11px] text-sky-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Ranked by candidate-resume fit
          </span>
        </div>

        {/* Jobs Grid */}
        {isLoading && filteredJobs.length === 0 ? (
          <div className="py-24 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-sky-400 animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-300">
              Searching and analyzing Unstop jobs matching your resume...
            </p>
            <p className="text-xs text-slate-500">
              Filtering for your college year, skills, and current CGPA
            </p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-16 text-center space-y-3 rounded-2xl border border-dashed border-slate-800 p-8">
            <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-base font-semibold text-slate-300">No matching jobs found</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your category, removing search filters, or updating your skills in Career
              Context Memory.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchKeyword("");
                setSelectedLocation("All");
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 text-white hover:bg-sky-500 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl neu-flat p-5 flex flex-col justify-between transition-all group relative"
              >
                <div>
                  {/* Top Bar: Company, Type, Match Score */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl neu-btn font-bold text-[#059669] text-base flex items-center justify-center">
                        {job.company.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#475569] dark:text-slate-300">{job.company}</span>
                          {job.isUnstopVerified && (
                            <span
                              className="text-[10px] px-1.5 py-0.2 rounded font-bold text-[#059669] neu-inset-sm"
                              title="Verified on Unstop"
                            >
                              Unstop Verified
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-sm sm:text-base text-[#1E293B] dark:text-white mt-0.5 line-clamp-1 group-hover:text-[#059669] transition-colors">
                          {job.title}
                        </h3>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="text-right shrink-0">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl neu-inset-sm text-[#059669] text-xs font-bold">
                        <TrendingUp className="w-3 h-3" />
                        {job.matchPercentage}% Match
                      </div>
                      {job.applicantsCount && (
                        <span className="block text-[10px] text-[#475569] dark:text-slate-400 mt-1 font-medium">
                          {job.applicantsCount}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details Pills: Type, Location, Stipend/Salary */}
                  <div className="flex flex-wrap items-center gap-2 mb-3.5 text-xs">
                    <span
                      className="px-2.5 py-1 rounded-lg font-semibold neu-inset-sm text-[#475569] dark:text-slate-300"
                    >
                      {job.type}
                    </span>

                    <span className="flex items-center gap-1 text-[#475569] dark:text-slate-400 px-2.5 py-1 rounded-lg neu-btn">
                      <MapPin className="w-3 h-3 text-[#475569]" />
                      {job.location}
                    </span>

                    <span className="flex items-center gap-1 text-[#059669] font-bold px-2.5 py-1 rounded-lg neu-inset-sm">
                      <DollarSign className="w-3 h-3" />
                      {job.stipendOrSalary}
                    </span>
                  </div>

                  {/* Eligibility Criteria */}
                  <div className="mb-3 p-3 rounded-xl neu-inset-sm text-xs flex items-start gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-[#059669] mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-[#1E293B] dark:text-slate-200">Eligibility: </span>
                      <span className="text-[#475569] dark:text-slate-400 font-medium">{job.eligibility}</span>
                    </div>
                  </div>

                  {/* AI Resume Match Rationale */}
                  <div className="mb-3.5 text-xs neu-inset-sm p-3 rounded-xl">
                    <div className="flex items-center gap-1 font-bold text-[#059669] mb-1">
                      <Sparkles className="w-3 h-3" />
                      Why it matches your resume:
                    </div>
                    <p className="leading-relaxed text-[11px] text-[#475569] dark:text-slate-300 font-medium">{job.matchReason}</p>
                  </div>

                  {/* Matching Skills Chips */}
                  <div className="space-y-1.5 mb-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#475569] dark:text-slate-400">
                      Matching Resume Skills:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {job.matchingSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold neu-inset-sm text-[#059669] flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 text-[#059669]" />
                          {skill}
                        </span>
                      ))}
                      {job.missingSkills &&
                        job.missingSkills.map((s, idx) => (
                          <span
                            key={"gap-" + idx}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium neu-btn text-[#475569] dark:text-slate-400"
                            title="Recommended prep skill"
                          >
                            +{s}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Footer: Deadline & Direct Unstop Apply Button */}
                <div className="pt-3 border-t border-[#475569]/20 dark:border-[#475569]/30 flex items-center justify-between gap-2">
                  <span className="text-xs text-[#475569] dark:text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#059669]" />
                    Deadline: <strong className="text-[#1E293B] dark:text-slate-200">{job.deadline}</strong>
                  </span>

                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold neu-btn-accent text-white transition-all cursor-pointer"
                  >
                    <span>Apply on Unstop</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
