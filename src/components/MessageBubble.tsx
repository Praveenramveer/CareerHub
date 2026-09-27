import React, { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Sparkles,
  User,
  Copy,
  Check,
  RotateCw,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Message } from "../types";

interface MessageBubbleProps {
  message: Message;
  isLast: boolean;
  isLoading: boolean;
  onRegenerate?: () => void;
  onFeedback?: (messageId: string, feedback: "helpful" | "not_helpful") => void;
  theme: "dark" | "light";
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isLast,
  isLoading,
  onRegenerate,
  onFeedback,
  theme,
}) => {
  const [copied, setCopied] = useState(false);
  const isDark = theme === "dark";
  const isAssistant = message.role === "assistant";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn("Failed to copy:", e);
    }
  };

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      id={`message-${message.id}`}
      className={`group flex gap-3.5 my-4 px-1 ${
        isAssistant ? "justify-start" : "justify-end"
      }`}
    >
      {/* Assistant Avatar */}
      {isAssistant && (
        <div className="shrink-0 pt-0.5">
          <div className="w-8 h-8 rounded-xl neu-btn flex items-center justify-center text-[#059669] font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Message Content Container */}
      <div
        className={`max-w-[92%] sm:max-w-[85%] md:max-w-[80%] rounded-2xl p-4 sm:p-5 transition-all duration-200 ${
          isAssistant
            ? "neu-flat text-[#1E293B] dark:text-slate-100"
            : "neu-flat border-l-4 border-[#059669] text-[#1E293B] dark:text-slate-100"
        }`}
      >
        {/* Header / sender info */}
        <div className="flex items-center justify-between gap-3 mb-2 text-xs sm:text-[13px] text-[#475569] dark:text-slate-400">
          <span className="font-bold tracking-wide">
            {isAssistant ? "CareerSphere Advisor" : "You"}
          </span>
          <span className="text-xs font-medium">{formattedTime}</span>
        </div>

        {/* Content Body */}
        {isAssistant ? (
          <div className="markdown-content text-[15.5px] sm:text-base leading-relaxed overflow-hidden">
            <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
          </div>
        ) : (
          <div className="text-[15.5px] sm:text-base leading-relaxed whitespace-pre-wrap font-medium">
            {message.content}
          </div>
        )}

        {/* Assistant Action Toolbar (Copy, Regenerate, Feedback) */}
        {isAssistant && (
          <div
            className="flex items-center justify-between pt-3 mt-3 border-t border-[#475569]/20 dark:border-[#475569]/30 text-xs sm:text-[13px]"
          >
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg neu-btn text-[#475569] dark:text-slate-300 hover:text-[#059669] font-semibold cursor-pointer"
                title="Copy response to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#059669]" />
                    <span className="text-xs text-[#059669] font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-xs">Copy</span>
                  </>
                )}
              </button>

              {isLast && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg neu-btn text-[#475569] dark:text-slate-300 hover:text-[#059669] font-semibold cursor-pointer disabled:opacity-50"
                  title="Regenerate this response with an alternative perspective"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                  <span className="text-xs">Regenerate</span>
                </button>
              )}
            </div>

            {/* Feedback actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onFeedback?.(message.id, "helpful")}
                className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                  message.feedback === "helpful"
                    ? "neu-inset text-[#059669] font-bold"
                    : "neu-btn text-[#475569] dark:text-slate-400 hover:text-[#059669]"
                }`}
                title="Helpful advice"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onFeedback?.(message.id, "not_helpful")}
                className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                  message.feedback === "not_helpful"
                    ? "neu-inset text-rose-600 dark:text-rose-400 font-bold"
                    : "neu-btn text-[#475569] dark:text-slate-400 hover:text-rose-600"
                }`}
                title="Not helpful"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {!isAssistant && (
        <div className="shrink-0 pt-0.5">
          <div className="w-8 h-8 rounded-xl neu-btn flex items-center justify-center text-[#475569] dark:text-slate-300 font-bold">
            <User className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );
};
