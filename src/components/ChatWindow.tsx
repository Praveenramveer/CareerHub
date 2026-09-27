import React, { useRef, useEffect, useState } from "react";
import { Sparkles, ArrowDown } from "lucide-react";
import { Message, CareerMode, CareerProfile } from "../types";
import { MessageBubble } from "./MessageBubble";
import { EmptyState } from "./EmptyState";
import { ChatInput } from "./ChatInput";
import { ClothMouldingBackground } from "./ClothMouldingBackground";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  streamingContent: string;
  activeMode: CareerMode;
  profile: CareerProfile;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  onSend: (text?: string) => void;
  onRegenerate: () => void;
  onFeedback: (messageId: string, feedback: "helpful" | "not_helpful") => void;
  onSelectMode: (mode: CareerMode) => void;
  suggestedPrompts: string[];
  theme: "dark" | "light";
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  streamingContent,
  activeMode,
  profile,
  input,
  setInput,
  onSend,
  onRegenerate,
  onFeedback,
  onSelectMode,
  suggestedPrompts,
  theme,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // Auto-scroll when messages update or streaming content arrives
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, streamingContent, isLoading]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isUp = scrollHeight - scrollTop - clientHeight > 180;
    setShowScrollBottom(isUp);
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Interactive Cloth Moulding with Dots Background */}
      <ClothMouldingBackground theme={theme} />

      {/* Messages Scroll Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 relative z-10"
      >
        <div className="max-w-4xl mx-auto min-h-full flex flex-col justify-between">
          {messages.length === 0 ? (
            <EmptyState onSelectPrompt={(prompt, mode) => {
              if (mode) onSelectMode(mode);
              onSend(prompt);
            }} theme={theme} />
          ) : (
            <div className="space-y-1 pb-4">
              {messages.map((msg, index) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isLast={index === messages.length - 1}
                  isLoading={isLoading}
                  onRegenerate={onRegenerate}
                  onFeedback={onFeedback}
                  theme={theme}
                />
              ))}

              {/* Real-time Streaming Message */}
              {isLoading && streamingContent && (
                <MessageBubble
                  message={{
                    id: "streaming-message",
                    role: "assistant",
                    content: streamingContent,
                    timestamp: Date.now(),
                  }}
                  isLast={true}
                  isLoading={isLoading}
                  theme={theme}
                />
              )}

              {/* Thinking indicator before first token */}
              {isLoading && !streamingContent && (
                <div className="flex items-center gap-3 my-4 px-1">
                  <div className="w-8 h-8 rounded-xl neu-btn text-[#059669] flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4 animate-spin" />
                  </div>
                  <div
                    className="rounded-2xl p-3.5 text-xs flex items-center gap-2.5 neu-flat text-[#475569] dark:text-slate-300 font-medium"
                  >
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-bounce" />
                    </div>
                    <span>CareerSphere AI is thinking...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Scroll-to-Bottom Button */}
      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-28 right-6 p-2 rounded-full bg-sky-500 text-white shadow-lg hover:bg-sky-400 transition-all z-10 active:scale-95"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      )}

      {/* Chat Input Bar */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={onSend}
        isLoading={isLoading}
        activeMode={activeMode}
        onSelectMode={onSelectMode}
        theme={theme}
        suggestedPrompts={suggestedPrompts}
      />
    </div>
  );
};
