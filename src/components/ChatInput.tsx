import React, { useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Sparkles,
  Compass,
  FileText,
  Mic,
  Target,
  FileSearch,
  X,
} from "lucide-react";
import { CareerMode } from "../types";
import { onKeyEnterOrSpace } from "../utils/keyboardAccessibility";

interface ChatInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  onSend: (text?: string) => void;
  isLoading: boolean;
  activeMode: CareerMode;
  onSelectMode: (mode: CareerMode) => void;
  theme: "dark" | "light";
  suggestedPrompts: string[];
}

const PLACEHOLDERS: Record<CareerMode, string> = {
  general: "Ask about your next career move, transition, negotiation, or workplace scenario...",
  roadmap: "Describe your goal (e.g., 'Build me a 6-month roadmap to become a Cloud Architect')...",
  resume: "Paste resume bullets or summary (e.g., 'Review this bullet: Led migration of 10 microservices')...",
  interview: "Type your answer to practice, or ask 'Start a behavioral mock interview for Senior Engineer'...",
  skill_gap: "Share your current skills & target role (e.g., 'I know Python & SQL, want to become ML Engineer')...",
  job_description: "Paste a job description to deconstruct key skills and compare with your experience...",
};

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSend,
  isLoading,
  activeMode,
  onSelectMode,
  theme,
  suggestedPrompts,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDark = theme === "dark";

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSend();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const prefix = activeMode === "resume" ? "[Uploaded Resume Document]:\n" : activeMode === "job_description" ? "[Uploaded Job Description]:\n" : `[Uploaded Content from ${file.name}]:\n`;
        setInput((prev) => (prev ? `${prev}\n\n${prefix}${text}` : `${prefix}${text}`));
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="shrink-0 p-3 sm:p-4 max-w-4xl mx-auto w-full">
      {/* Contextual dynamic suggestions */}
      {suggestedPrompts && suggestedPrompts.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-2 no-scrollbar">
          <span className="text-xs text-[#475569] dark:text-slate-400 shrink-0 flex items-center gap-1.5 px-1 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
            <span>Suggestions:</span>
          </span>
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onSend(prompt)}
              onKeyDown={onKeyEnterOrSpace(() => onSend(prompt))}
              disabled={isLoading}
              className="shrink-0 text-xs sm:text-[13px] px-3.5 py-1.5 rounded-xl neu-btn text-[#475569] dark:text-slate-300 hover:text-[#059669] dark:hover:text-[#059669] font-medium whitespace-nowrap cursor-pointer disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Sunken Neumorphic Input Well */}
      <div className="relative rounded-2xl p-3 sm:p-4 neu-inset transition-all duration-200">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".txt,.md,.json,.csv,.doc,.docx,.pdf"
          className="hidden"
        />

        <textarea
          id="chat-textarea"
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDERS[activeMode] || PLACEHOLDERS.general}
          rows={1}
          disabled={isLoading}
          className={`w-full bg-transparent resize-none text-[15.5px] sm:text-base focus:outline-none max-h-48 px-2 py-1 leading-relaxed ${
            isDark ? "text-slate-100 placeholder-slate-500" : "text-[#1E293B] placeholder-slate-400"
          }`}
        />

        {/* Action bar below textarea */}
        <div className="flex items-center justify-between pt-2.5 px-1 border-t border-[#475569]/20 dark:border-[#475569]/30">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={onKeyEnterOrSpace(() => fileInputRef.current?.click())}
              disabled={isLoading}
              className="p-2 rounded-xl neu-btn text-[#475569] dark:text-slate-300 hover:text-[#059669] transition-colors disabled:opacity-50 cursor-pointer"
              title="Attach resume or job description text document"
              aria-label="Attach resume or job description text document"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Mode Indicator / Selector */}
            <div className="relative flex items-center">
              <select
                value={activeMode}
                onChange={(e) => onSelectMode(e.target.value as CareerMode)}
                disabled={isLoading}
                className="text-xs sm:text-[13px] py-1.5 pl-3 pr-7 rounded-xl font-semibold neu-btn text-[#059669] appearance-none cursor-pointer focus:outline-none"
              >
                <option value="general" className={isDark ? "bg-[#0F172A] text-white" : "bg-[#F1F5F9] text-[#1E293B]"}>Advisor Mode</option>
                <option value="roadmap" className={isDark ? "bg-[#0F172A] text-white" : "bg-[#F1F5F9] text-[#1E293B]"}>Roadmap Mode</option>
                <option value="resume" className={isDark ? "bg-[#0F172A] text-white" : "bg-[#F1F5F9] text-[#1E293B]"}>Resume Mode</option>
                <option value="interview" className={isDark ? "bg-[#0F172A] text-white" : "bg-[#F1F5F9] text-[#1E293B]"}>Interview Mode</option>
                <option value="skill_gap" className={isDark ? "bg-[#0F172A] text-white" : "bg-[#F1F5F9] text-[#1E293B]"}>Skill Gap Mode</option>
                <option value="job_description" className={isDark ? "bg-[#0F172A] text-white" : "bg-[#F1F5F9] text-[#1E293B]"}>Job Match Mode</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-[11px] text-[#475569] dark:text-slate-400 font-medium">
              Shift + Return for newline
            </span>

            <button
              id="send-message-btn"
              type="button"
              onClick={() => onSend()}
              onKeyDown={onKeyEnterOrSpace(() => onSend())}
              disabled={isLoading || !input.trim()}
              className={`p-2.5 rounded-xl font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                input.trim()
                  ? "neu-btn-accent text-white shadow-md"
                  : "neu-btn text-[#475569] dark:text-slate-500"
              }`}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
