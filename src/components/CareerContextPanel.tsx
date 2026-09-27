import React from "react";
import {
  User,
  Target,
  Briefcase,
  GraduationCap,
  Wrench,
  Clock,
  Sparkles,
  Edit3,
  Trash2,
  X,
  Compass,
  CheckCircle2,
  ChevronRight,
  Linkedin,
  Github,
  Globe,
  FileText,
  Building2,
  BookOpen,
} from "lucide-react";
import { CareerProfile, CareerMode } from "../types";
import { onKeyEnterOrSpace } from "../utils/keyboardAccessibility";

interface CareerContextPanelProps {
  profile: CareerProfile;
  activeMode: CareerMode;
  isOpen: boolean;
  onClose: () => void;
  onEditProfile: () => void;
  onClearProfile: () => void;
  onQuickAction: (actionPrompt: string) => void;
  onOpenResumeBuilder?: () => void;
  onOpenJobFinder?: () => void;
  theme: "dark" | "light";
}

export const CareerContextPanel: React.FC<CareerContextPanelProps> = ({
  profile,
  activeMode,
  isOpen,
  onClose,
  onEditProfile,
  onClearProfile,
  onQuickAction,
  onOpenResumeBuilder,
  onOpenJobFinder,
  theme,
}) => {
  const isDark = theme === "dark";

  // Check how much context has been discovered
  const hasDetails = Boolean(
    profile.fullName ||
      profile.currentRole ||
      profile.targetRole ||
      profile.collegeName ||
      profile.collegeYear ||
      profile.currentCgpa ||
      profile.twelfthSchool ||
      profile.tenthSchool ||
      (profile.skills && profile.skills.length > 0) ||
      (profile.projects && profile.projects.length > 0) ||
      profile.linkedinUrl ||
      profile.githubUrl
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        id="career-context-panel"
        className={`fixed lg:static top-0 bottom-0 right-0 z-40 w-80 flex flex-col transition-transform duration-300 ease-in-out border-l ${
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0 hidden lg:flex"
        } ${
          isDark
            ? "bg-[#0F172A] border-[#475569]/30 text-slate-100"
            : "bg-[#F1F5F9] border-[#475569]/20 text-[#1E293B]"
        } shadow-2xl lg:shadow-none`}
      >
        {/* Panel Header */}
        <div className="p-4 border-b border-[#475569]/20 dark:border-[#475569]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl neu-btn text-[#059669]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-xs uppercase tracking-wider text-[#1E293B] dark:text-white">
                Career Memory
              </h2>
              <p className="text-xs text-[#475569] dark:text-slate-400 font-medium">Profile & Academic Details</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onEditProfile}
              onKeyDown={onKeyEnterOrSpace(onEditProfile)}
              className="p-2 rounded-xl neu-btn text-[#475569] hover:text-[#059669] dark:text-slate-300 cursor-pointer"
              title="Edit Profile"
              aria-label="Edit Profile"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              onKeyDown={onKeyEnterOrSpace(onClose)}
              className="lg:hidden p-2 rounded-xl neu-btn text-[#475569] hover:text-[#1E293B] dark:text-slate-300 dark:hover:text-white cursor-pointer"
              title="Close panel"
              aria-label="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Panel Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!hasDetails ? (
            <div className="p-5 rounded-2xl neu-flat text-center">
              <Compass className="w-8 h-8 mx-auto mb-2.5 text-[#059669]" />
              <h3 className="font-bold text-sm text-[#1E293B] dark:text-white">Listening to Your Journey</h3>
              <p className="text-xs mt-1.5 leading-relaxed text-[#475569] dark:text-slate-400 font-medium">
                As you chat about your college, skills, or ambitions, CareerSphere AI automatically
                remembers your details to craft your resume and find matching jobs on Unstop.
              </p>
              <button
                onClick={onEditProfile}
                onKeyDown={onKeyEnterOrSpace(onEditProfile)}
                className="mt-4 px-4 py-2 text-xs rounded-xl neu-btn-accent font-bold cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Fill Career Memory</span>
              </button>
            </div>
          ) : (
            <>
              {/* Profile Card with Photo & Social Links */}
              <div className="p-4 rounded-2xl neu-flat">
                <div className="flex items-center gap-3">
                  {profile.photo ? (
                    <img
                      src={profile.photo}
                      alt={profile.fullName || "Candidate"}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#059669]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl neu-btn text-[#059669] flex items-center justify-center font-bold text-base">
                      {(profile.fullName || "User").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-[#1E293B] dark:text-white truncate">
                      {profile.fullName || "Aspiring Technologist"}
                    </h3>
                    <p className="text-xs text-[#059669] font-semibold truncate">
                      {profile.targetRole || profile.currentRole || "Student / Fresher"}
                    </p>
                    {profile.location && (
                      <p className="text-[11px] text-[#475569] dark:text-slate-400 mt-0.5 truncate font-medium">
                        {profile.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Social Links */}
                {(profile.linkedinUrl || profile.githubUrl || profile.portfolioUrl) && (
                  <div className="mt-3.5 pt-3 border-t border-[#475569]/20 dark:border-[#475569]/30 flex items-center gap-3 text-xs">
                    {profile.linkedinUrl && (
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#475569] dark:text-slate-300 hover:text-[#059669] flex items-center gap-1 font-medium"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {profile.githubUrl && (
                      <a
                        href={profile.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#475569] dark:text-slate-300 hover:text-[#059669] flex items-center gap-1 font-medium"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {profile.portfolioUrl && (
                      <a
                        href={profile.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#475569] dark:text-slate-300 hover:text-[#059669] flex items-center gap-1 font-medium"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Portfolio</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* College & Academics Card */}
              {(profile.collegeName || profile.collegeYear || profile.currentCgpa) && (
                <div className="p-4 rounded-2xl neu-flat space-y-2.5">
                  <div className="text-xs font-bold text-[#1E293B] dark:text-white uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#059669]" />
                      College & Academics
                    </span>
                    {profile.currentCgpa && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg neu-inset-sm text-[#059669]">
                        {profile.currentCgpa}
                      </span>
                    )}
                  </div>

                  {profile.collegeName && (
                    <div>
                      <p className="text-xs font-semibold text-[#1E293B] dark:text-slate-200">{profile.collegeName}</p>
                      {profile.degreeBranch && (
                        <p className="text-[11px] text-[#475569] dark:text-slate-400 font-medium">{profile.degreeBranch}</p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#475569]/20 dark:border-[#475569]/30">
                    <span className="text-[#475569] dark:text-slate-400 text-[11px] font-medium">Studying Year:</span>
                    <span className="font-bold text-[#059669]">{profile.collegeYear || "3rd Year"}</span>
                  </div>
                  {profile.expectedGraduationYear && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#475569] dark:text-slate-400 text-[11px] font-medium">Graduation:</span>
                      <span className="font-medium text-[#1E293B] dark:text-slate-300">{profile.expectedGraduationYear}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Previous Studies (12th & 10th) */}
              {(profile.twelfthSchool || profile.tenthSchool) && (
                <div className="p-4 rounded-2xl neu-flat space-y-2.5">
                  <div className="text-xs font-bold text-[#475569] dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#059669]" />
                    <span>Previous Studies</span>
                  </div>

                  {profile.twelfthSchool && (
                    <div className="text-xs">
                      <div className="flex justify-between font-medium text-[#1E293B] dark:text-slate-200">
                        <span>Class 12th ({profile.twelfthBoard || "Board"})</span>
                        <span className="text-[#059669] font-bold">{profile.twelfthPercentage}</span>
                      </div>
                      <p className="text-[11px] text-[#475569] dark:text-slate-400 truncate font-medium">{profile.twelfthSchool}</p>
                    </div>
                  )}

                  {profile.tenthSchool && (
                    <div className="text-xs pt-2 border-t border-[#475569]/20 dark:border-[#475569]/30">
                      <div className="flex justify-between font-medium text-[#1E293B] dark:text-slate-200">
                        <span>Class 10th ({profile.tenthBoard || "Board"})</span>
                        <span className="text-[#059669] font-bold">{profile.tenthPercentage}</span>
                      </div>
                      <p className="text-[11px] text-[#475569] dark:text-slate-400 truncate font-medium">{profile.tenthSchool}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Current Skills Badges */}
              {profile.skills && profile.skills.length > 0 && (
                <div className="p-4 rounded-2xl neu-flat">
                  <div className="text-xs font-bold text-[#475569] dark:text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                    <span>Recognized Skills</span>
                    <Wrench className="w-4 h-4 text-[#059669]" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-lg neu-inset-sm text-[#059669] font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Summary */}
              {profile.projects && profile.projects.length > 0 && (
                <div className="p-4 rounded-2xl neu-flat space-y-2.5">
                  <div className="text-xs font-bold text-[#1E293B] dark:text-white uppercase tracking-wider flex items-center justify-between">
                    <span>Key Projects ({profile.projects.length})</span>
                    <Briefcase className="w-3.5 h-3.5 text-[#059669]" />
                  </div>
                  <div className="space-y-2">
                    {profile.projects.map((proj, idx) => (
                      <div key={idx} className="text-xs">
                        <p className="font-bold text-[#1E293B] dark:text-slate-200">{proj.title}</p>
                        {proj.techStack && (
                          <p className="text-[11px] text-[#475569] dark:text-slate-400 font-medium">{proj.techStack}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feature Launchers */}
              <div className="p-4 rounded-2xl neu-flat space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#475569] dark:text-slate-400 block">
                  Dashboards & Tools
                </span>
                {onOpenResumeBuilder && (
                  <button
                    onClick={onOpenResumeBuilder}
                    onKeyDown={onKeyEnterOrSpace(onOpenResumeBuilder)}
                    className="w-full py-2.5 px-3.5 rounded-xl text-xs font-bold neu-btn text-[#1E293B] dark:text-slate-200 hover:text-[#059669] flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-[#059669]" />
                      Build AI Resume (.docx)
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {onOpenJobFinder && (
                  <button
                    onClick={onOpenJobFinder}
                    onKeyDown={onKeyEnterOrSpace(onOpenJobFinder)}
                    className="w-full py-2.5 px-3.5 rounded-xl text-xs font-bold neu-btn text-[#1E293B] dark:text-slate-200 hover:text-[#059669] flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-[#059669]" />
                      Find Jobs on Unstop
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </>
          )}

          {/* Quick Context-Driven Next Steps */}
          <div className="pt-2">
            <div className="text-xs font-bold text-[#475569] dark:text-slate-400 uppercase tracking-wider mb-2">
              Next Action Ideas
            </div>
            <div className="space-y-2">
              <button
                onClick={() =>
                  onQuickAction(
                    `Based on my context (${profile.collegeYear || "college background"} studying ${
                      profile.degreeBranch || "Engineering"
                    } aiming for ${
                      profile.targetRole || "software engineering"
                    }), generate my high-priority skill gaps and learning plan.`
                  )
                }
                onKeyDown={onKeyEnterOrSpace(() =>
                  onQuickAction(
                    `Based on my context (${profile.collegeYear || "college background"} studying ${
                      profile.degreeBranch || "Engineering"
                    } aiming for ${
                      profile.targetRole || "software engineering"
                    }), generate my high-priority skill gaps and learning plan.`
                  )
                )}
                className="w-full text-left p-3 rounded-xl text-xs sm:text-sm flex items-center justify-between neu-btn text-[#1E293B] dark:text-slate-200 hover:text-[#059669] cursor-pointer"
              >
                <span className="font-medium">Analyze my skill gaps</span>
                <ChevronRight className="w-4 h-4 text-[#475569]" />
              </button>

              <button
                onClick={() =>
                  onQuickAction(
                    `Create a personalized career roadmap for moving from ${
                      profile.collegeYear || "college student"
                    } to ${profile.targetRole || "top tech engineer"}.`
                  )
                }
                onKeyDown={onKeyEnterOrSpace(() =>
                  onQuickAction(
                    `Create a personalized career roadmap for moving from ${
                      profile.collegeYear || "college student"
                    } to ${profile.targetRole || "top tech engineer"}.`
                  )
                )}
                className="w-full text-left p-3 rounded-xl text-xs sm:text-sm flex items-center justify-between neu-btn text-[#1E293B] dark:text-slate-200 hover:text-[#059669] cursor-pointer"
              >
                <span className="font-medium">Build milestone roadmap</span>
                <ChevronRight className="w-4 h-4 text-[#475569]" />
              </button>
            </div>
          </div>
        </div>

        {/* Panel Footer */}
        {hasDetails && (
          <div className="p-3.5 border-t border-[#475569]/20 dark:border-[#475569]/30 flex items-center justify-between text-xs">
            <button
              onClick={onEditProfile}
              onKeyDown={onKeyEnterOrSpace(onEditProfile)}
              className="neu-btn px-3 py-1.5 rounded-lg text-xs text-[#059669] font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
            <button
              onClick={onClearProfile}
              onKeyDown={onKeyEnterOrSpace(onClearProfile)}
              className="neu-btn px-3 py-1.5 rounded-lg text-xs text-[#475569] hover:text-rose-600 dark:text-slate-400 flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Context</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
