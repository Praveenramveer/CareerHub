import React from "react";
import { X, Sparkles, Shield, Cpu, Target, Compass, BookOpen } from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "dark" | "light";
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;
  const isDark = theme === "dark";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden ${
          isDark ? "bg-slate-900 border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base">CareerSphere AI Architecture</h3>
              <p className="text-xs text-slate-400">Powered by Google Gemini 3.8 Flash</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-sm leading-relaxed max-h-[70vh] overflow-y-auto">
          <div className="space-y-1.5">
            <h4 className="font-semibold text-sky-400 flex items-center gap-2 text-sm">
              <Cpu className="w-4 h-4" />
              <span>Genuinely Dynamic AI Model</span>
            </h4>
            <p className="text-slate-300">
              CareerSphere AI connects directly to the server-side Gemini 3.8 Flash model. No
              hardcoded responses, decision trees, or canned answers. Every reply is synthesized
              dynamically from your exact question and evolving context.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-emerald-400 flex items-center gap-2 text-sm">
              <Target className="w-4 h-4" />
              <span>Anti-Repetition Engine</span>
            </h4>
            <p className="text-slate-300">
              Unlike generic chatbots that output identical 5-tip lists, CareerSphere AI selects
              the most appropriate response format dynamically: comparison tables, step-by-step
              milestones, before-and-after resume rewrites, or single-question mock interview coaching.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-amber-400 flex items-center gap-2 text-sm">
              <Compass className="w-4 h-4" />
              <span>Organic Context Memory</span>
            </h4>
            <p className="text-slate-300">
              Mention your background in passing—such as "I have 3 years of mechanical engineering"—and
              the system retains that information across the conversation. When you subsequently ask
              "What skills are transferable?", it leverages your existing context seamlessly.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-purple-400 flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4" />
              <span>Honest Decision Support & Realistic Advice</span>
            </h4>
            <p className="text-slate-300">
              We never make fabricated guarantees like "you will definitely be hired". We evaluate
              trade-offs, skill overlap, and market realities, distinguishing general estimates from
              verified facts so you can make informed decisions.
            </p>
          </div>
        </div>

        <div className="p-3.5 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm shadow-md transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
