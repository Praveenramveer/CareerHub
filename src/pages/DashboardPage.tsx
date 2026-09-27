import React from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { ChatWindow } from "../components/ChatWindow";
import { CareerContextPanel } from "../components/CareerContextPanel";
import { InfoModal } from "../components/InfoModal";
import { Conversation, CareerMode, CareerProfile, UserAccount } from "../types";

interface DashboardPageProps {
  conversations: Conversation[];
  activeConversationId: string;
  activeConversation: Conversation;
  activeMode: CareerMode;
  profile: CareerProfile;
  currentUser: UserAccount | null;
  theme: "dark" | "light";
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  streamingContent: string;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isContextPanelOpen: boolean;
  setIsContextPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInfoModalOpen: boolean;
  setIsInfoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSendMessage: (text?: string) => void;
  onRegenerate: () => void;
  onFeedback: (messageId: string, feedback: "helpful" | "not_helpful") => void;
  onSelectConversation: (id: string) => void;
  onNewConversation: (mode?: CareerMode) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onSelectMode: (mode: CareerMode) => void;
  suggestedPrompts: string[];
  onToggleTheme: () => void;
  onClearChat: () => void;
  onExportChat: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  conversations,
  activeConversationId,
  activeConversation,
  activeMode,
  profile,
  currentUser,
  theme,
  input,
  setInput,
  isLoading,
  streamingContent,
  errorMessage,
  setErrorMessage,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isContextPanelOpen,
  setIsContextPanelOpen,
  isInfoModalOpen,
  setIsInfoModalOpen,
  onSendMessage,
  onRegenerate,
  onFeedback,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
  onSelectMode,
  suggestedPrompts,
  onToggleTheme,
  onClearChat,
  onExportChat,
}) => {
  const navigate = useNavigate();
  const isDark = theme === "dark";

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden transition-colors ${
        isDark ? "bg-[#0F172A] text-slate-100" : "bg-[#F1F5F9] text-[#1E293B]"
      }`}
    >
      {/* Sidebar Navigation */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        activeMode={activeMode}
        activeTab="advisor"
        onSelectTab={() => {}}
        currentUser={currentUser}
        onOpenAuthModal={() => {
          navigate("/login");
        }}
        onSelectConversation={onSelectConversation}
        onNewConversation={onNewConversation}
        onDeleteConversation={onDeleteConversation}
        onRenameConversation={onRenameConversation}
        onSelectMode={onSelectMode}
        onOpenProfile={() => {
          navigate("/profile");
        }}
        onOpenInfo={() => setIsInfoModalOpen(true)}
        theme={theme}
        onToggleTheme={onToggleTheme}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Experience Layout */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <Header
          conversationTitle={activeConversation.title}
          activeMode={activeMode}
          profile={profile}
          currentUser={currentUser}
          activeTab="advisor"
          onSelectTab={() => {}}
          onOpenAuthModal={() => {
            navigate("/login");
          }}
          onToggleMobileMenu={() => setIsMobileMenuOpen((o) => !o)}
          onToggleContextPanel={() => setIsContextPanelOpen((o) => !o)}
          onClearChat={onClearChat}
          onExportChat={onExportChat}
          isContextPanelOpen={isContextPanelOpen}
          theme={theme}
        />

        {/* Global Error Notice */}
        {errorMessage && (
          <div className="px-4 py-2 bg-rose-500/15 border-b border-rose-500/30 text-rose-400 text-xs sm:text-sm flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-slate-400 hover:text-white text-xs underline ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Center Workspace with AI Advisor & Chat */}
        <div className="flex-1 flex h-full overflow-hidden relative">
          <ChatWindow
            messages={activeConversation.messages}
            isLoading={isLoading}
            streamingContent={streamingContent}
            activeMode={activeMode}
            profile={profile}
            input={input}
            setInput={setInput}
            onSend={(text) => onSendMessage(text)}
            onRegenerate={onRegenerate}
            onFeedback={onFeedback}
            onSelectMode={onSelectMode}
            suggestedPrompts={suggestedPrompts}
            theme={theme}
          />

          {/* Context Drawer Panel on Right */}
          <CareerContextPanel
            isOpen={isContextPanelOpen}
            onClose={() => setIsContextPanelOpen(false)}
            profile={profile}
            activeMode={activeMode}
            onEditProfile={() => {
              navigate("/profile");
            }}
            onClearProfile={() => {
              if (window.confirm("Reset active career context?")) {
                // profile reset
              }
            }}
            onQuickAction={(prompt) => {
              onSendMessage(prompt);
              if (window.innerWidth < 1024) setIsContextPanelOpen(false);
            }}
            onOpenResumeBuilder={() => {
              navigate("/resume");
            }}
            onOpenJobFinder={() => {
              navigate("/jobs");
            }}
            theme={theme}
          />
        </div>
      </div>

      {/* Info Modal */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        theme={theme}
      />
    </div>
  );
};
