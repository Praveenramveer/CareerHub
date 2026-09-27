import React from "react";
import {
  Compass,
  FileText,
  Mic,
  Target,
  Sparkles,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  MessageSquare,
} from "lucide-react";
import { CareerMode } from "../types";
import { onKeyEnterOrSpace } from "../utils/keyboardAccessibility";

interface EmptyStateProps {
  onSelectPrompt: (prompt: string, mode?: CareerMode) => void;
  theme: "dark" | "light";
}

const STARTER_CARDS = [
  {
    id: "career_path",
    mode: "general" as CareerMode,
    title: "Career Path Discovery",
    tagline: "Explore where your current skills can take you",
    prompt:
      "I am evaluating my next career step. Can you help me discover high-potential career paths based on my background, skills, and interests?",
    icon: <Compass className="w-5 h-5 text-[#059669]" />,
    badge: "Exploration",
  },
  {
    id: "resume_audit",
    mode: "resume" as CareerMode,
    title: "Resume & Impact Audit",
    tagline: "Turn your experience into stronger career evidence",
    prompt:
      "I want to review and optimize my resume for impact and ATS screening. How can we audit my bullet points for quantifiable achievements?",
    icon: <FileText className="w-5 h-5 text-[#059669]" />,
    badge: "Optimization",
  },
  {
    id: "mock_interview",
    mode: "interview" as CareerMode,
    title: "Interactive Mock Interview",
    tagline: "Practice realistic 1-on-1 interview conversations",
    prompt:
      "Please act as my interviewer for a role I'm preparing for. Ask me one question at a time, evaluate my response with concrete improvements, and then proceed.",
    icon: <Mic className="w-5 h-5 text-[#059669]" />,
    badge: "Simulation",
  },
  {
    id: "career_roadmap",
    mode: "roadmap" as CareerMode,
    title: "Milestone Career Roadmap",
    tagline: "Build a personalized path toward your target role",
    prompt:
      "I want to build a step-by-step career roadmap toward a target role. Let's map out the core milestones, skill gaps, projects, and timeline.",
    icon: <Target className="w-5 h-5 text-[#059669]" />,
    badge: "Strategy",
  },
];

const POPULAR_QUESTIONS = [
  "I'm a mechanical engineer with 3 years experience wanting to move into product management without another degree. What should I do?",
  "How do I negotiate an offer when I have competing timelines?",
  "What are the top transferable skills from sales into customer success?",
  "How should I explain a 1-year employment gap on my resume?",
];

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPrompt, theme }) => {
  const isDark = theme === "dark";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-center flex flex-col items-center justify-center min-h-[68vh]">
      {/* Brand Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl neu-inset-sm text-[#059669] text-xs sm:text-[13px] font-bold mb-5">
        <Sparkles className="w-4 h-4 text-[#059669]" />
        <span>Gemini Career Intelligence</span>
      </div>

      {/* Main Title & Tagline */}
      <h2
        className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-3 text-[#1E293B] dark:text-white"
      >
        CareerSphere AI
      </h2>
      <p
        className="text-base sm:text-lg max-w-xl mb-8 leading-relaxed text-[#475569] dark:text-slate-300 font-medium"
      >
        Turn career uncertainty into your next actionable step. Ask any question, explore transitions, audit resumes, or practice interviews.
      </p>

      {/* 4 Interactive Starter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 w-full text-left mb-8">
        {STARTER_CARDS.map((card) => (
          <button
            key={card.id}
            id={`starter-card-${card.id}`}
            onClick={() => onSelectPrompt(card.prompt, card.mode)}
            onKeyDown={onKeyEnterOrSpace(() => onSelectPrompt(card.prompt, card.mode))}
            className="p-5 rounded-2xl neu-flat hover:neu-btn transition-all duration-200 group text-left cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-xl neu-inset-sm">
                {card.icon}
              </div>
              <span
                className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg neu-inset-sm text-[#475569] dark:text-slate-300"
              >
                {card.badge}
              </span>
            </div>
            <h3
              className="font-bold text-base mb-1.5 text-[#1E293B] dark:text-white group-hover:text-[#059669] dark:group-hover:text-[#059669] transition-colors"
            >
              {card.title}
            </h3>
            <p className="text-sm text-[#475569] dark:text-slate-400 leading-normal mb-3 font-medium">
              {card.tagline}
            </p>
            <div className="flex items-center text-xs sm:text-sm font-semibold text-[#059669] gap-1.5 group-hover:translate-x-1 transition-transform">
              <span>Start session</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        ))}
      </div>

      {/* Quick Example Questions */}
      <div className="w-full text-left">
        <div className="text-xs sm:text-[13px] font-bold text-[#475569] dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-[#059669]" />
          <span>Or test an arbitrary career scenario:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {POPULAR_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPrompt(q, "general")}
              onKeyDown={onKeyEnterOrSpace(() => onSelectPrompt(q, "general"))}
              className="p-3.5 rounded-xl text-left text-xs sm:text-sm neu-btn text-[#1E293B] dark:text-slate-200 hover:text-[#059669] dark:hover:text-[#059669] flex items-start gap-2.5 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
              <span className="line-clamp-2 leading-relaxed font-medium">{q}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
