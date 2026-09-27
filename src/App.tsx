import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LogoutPage } from "./pages/LogoutPage";
import { ProfilePage } from "./pages/ProfilePage";
import { DashboardPage } from "./pages/DashboardPage";
import { ResumePage } from "./pages/ResumePage";
import { JobsPage } from "./pages/JobsPage";
import { LandingPage } from "./pages/LandingPage";
import { useGlassCardGlow } from "./hooks/useGlassCardGlow";
import { Conversation, Message, CareerProfile, CareerMode, UserAccount } from "./types";
import {
  generateCareerResponseStream,
  extractCareerProfile,
} from "./services/careerService";
import {
  auth,
  saveCareerProfileToFirestore,
  fetchCareerProfileFromFirestore,
  saveConversationToFirestore,
  fetchConversationsFromFirestore,
  deleteConversationFromFirestore,
  saveUserProfileToFirestore,
  logoutFirebase,
} from "./services/firebase";
import { onAuthStateChanged } from "firebase/auth";

const STORAGE_KEYS = {
  CONVERSATIONS: "careersphere_conversations_v1",
  ACTIVE_ID: "careersphere_active_id_v1",
  PROFILE: "careersphere_profile_v1",
  THEME: "careersphere_theme_v1",
  USER: "careersphere_user_v1",
};

export default function App() {
  // Global cursor-tracking edge glow for all glass cards
  useGlassCardGlow();

  // Theme state
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved === "light" ? "light" : "dark";
  });

  // User Authentication state
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to load user:", e);
    }
    return null;
  });

  // Conversations state
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Failed to load conversations from localStorage:", e);
    }
    const initialId = "conv-" + Date.now();
    return [
      {
        id: initialId,
        title: "Career Consultation",
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        mode: "general",
      },
    ];
  });

  const [activeConversationId, setActiveConversationId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_ID);
    return saved || conversations[0]?.id || "default";
  });

  // Career profile context state with rich default demo profile
  const [profile, setProfile] = useState<CareerProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to parse saved profile:", e);
    }
    // Default initial profile matching student seeking tech career
    return {
      fullName: "Veer Sharma",
      email: "ram2veer007@gmail.com",
      phone: "+91 98765 43210",
      location: "Bengaluru, India",
      linkedinUrl: "https://linkedin.com/in/veersharma-dev",
      githubUrl: "https://github.com/veersharma",
      portfolioUrl: "https://veersharma.dev",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      collegeName: "National Institute of Technology (NIT)",
      degreeBranch: "B.Tech in Computer Science and Engineering",
      collegeYear: "3rd Year",
      currentCgpa: "8.85 / 10.0",
      expectedGraduationYear: "2026",
      twelfthSchool: "Delhi Public School (DPS)",
      twelfthBoard: "CBSE",
      twelfthYear: "2022",
      twelfthPercentage: "94.6%",
      tenthSchool: "St. Xavier's High School",
      tenthBoard: "ICSE",
      tenthYear: "2020",
      tenthPercentage: "96.2%",
      currentRole: "Computer Science Undergraduate (Pre-Final Year)",
      targetRole: "Software Development Engineer (SDE / Full-Stack)",
      skills: [
        "Java",
        "Data Structures & Algorithms",
        "React",
        "TypeScript",
        "Node.js",
        "Express",
        "Tailwind CSS",
        "PostgreSQL",
        "Git",
      ],
      targetSkills: ["System Design", "Docker", "Kubernetes", "Kafka"],
      careerGoals: [
        "Secure SDE summer internship through Unstop corporate challenges",
        "Clear technical rounds at Tier-1 product tech firms",
      ],
      projects: [
        {
          title: "Distributed Task Scheduler & Job Queue",
          description: "Engineered a fault-tolerant job scheduler with retry mechanisms and WebSocket dashboards.",
          techStack: "Node.js, Redis, TypeScript, React",
          link: "https://github.com/veersharma/distributed-scheduler",
        },
        {
          title: "CareerSphere AI Intelligence Platform",
          description: "Full-stack career accelerator with ATS resume generator and live Unstop job discovery.",
          techStack: "React, Express, Tailwind CSS, Gemini API",
          link: "https://github.com/veersharma/careersphere-ai",
        },
      ],
      experiences: [
        {
          company: "CloudVibe Technologies",
          role: "Software Engineering Intern",
          duration: "May 2024 - Jul 2024",
          description: "Optimized backend REST endpoints, reducing query latency by 32% across 50,000 daily requests.",
        },
      ],
    };
  });

  // Active chat state
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // UI Modals state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContextPanelOpen, setIsContextPanelOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Current active conversation
  const activeConversation = useMemo(() => {
    return (
      conversations.find((c) => c.id === activeConversationId) ||
      conversations[0] || {
        id: "fallback",
        title: "Career Consultation",
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        mode: "general" as CareerMode,
      }
    );
  }, [conversations, activeConversationId]);

  const activeMode: CareerMode = activeConversation.mode || "general";

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userAccount: UserAccount = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split("@")[0] || "Student Candidate",
          email: fbUser.email || "",
          photoUrl: fbUser.photoURL || undefined,
          isVerified: fbUser.emailVerified || true,
          registeredAt: Date.now(),
          authProvider: "google",
        };
        setCurrentUser(userAccount);

        // Fetch cloud data from Firestore
        try {
          const remoteProfile = await fetchCareerProfileFromFirestore(fbUser.uid);
          if (remoteProfile) {
            setProfile((prev) => ({ ...prev, ...remoteProfile }));
          }
          const remoteConvs = await fetchConversationsFromFirestore(fbUser.uid);
          if (remoteConvs && remoteConvs.length > 0) {
            setConversations(remoteConvs);
            setActiveConversationId(remoteConvs[0].id);
          }
        } catch (err) {
          console.warn("Firestore cloud sync notice:", err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync with LocalStorage & Firestore Cloud Storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
      if (currentUser?.id) {
        const active = conversations.find((c) => c.id === activeConversationId);
        if (active) {
          saveConversationToFirestore(currentUser.id, active).catch((e) =>
            console.warn("Firestore conv sync notice:", e)
          );
        }
      }
    } catch (e) {
      console.error("Storage error:", e);
    }
  }, [conversations, activeConversationId, currentUser?.id]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, activeConversationId);
  }, [activeConversationId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    if (currentUser?.id) {
      saveCareerProfileToFirestore(currentUser.id, profile).catch((e) =>
        console.warn("Firestore profile sync notice:", e)
      );
    }
  }, [profile, currentUser?.id]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      saveUserProfileToFirestore(currentUser).catch((e) =>
        console.warn("Firestore user sync notice:", e)
      );
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Context-sensitive dynamic suggestions
  const suggestedPrompts = useMemo(() => {
    const msgCount = activeConversation.messages.length;

    if (msgCount === 0) {
      switch (activeMode) {
        case "roadmap":
          return [
            "Build a 6-month roadmap to get an SDE role as a 3rd year student",
            "How do I prepare for campus placements alongside college coursework?",
            "Create a study plan for Data Structures & System Design",
          ];
        case "resume":
          return [
            "Audit my resume summary for high-impact ATS keywords",
            "How should I highlight my college projects without full-time experience?",
            "Review my technical bullet points for action verbs and quantified metrics",
          ];
        case "interview":
          return [
            "Start a technical mock interview for an SDE fresher role",
            "Ask me a core Data Structures question on trees or graphs",
            "Simulate a behavioral interview question with STAR feedback",
          ];
        case "skill_gap":
          return [
            `I am a ${profile.collegeYear || "3rd Year"} student knowing ${
              profile.skills?.slice(0, 3).join(", ") || "React & Node"
            }; what skills am I missing for Tier-1 companies?`,
            "What projects have the highest ROI for summer internship shortlisting?",
            "Which tools should I master before 4th year placement season?",
          ];
        case "job_description":
          return [
            "How can I tailor my resume for Unstop corporate hiring challenges?",
            "What are the top 3 critical keywords in product software engineering roles?",
            "How can I compensate for a missing technology on a job description?",
          ];
        default:
          return [
            "Based on my college year and CGPA, what are the highest ROI next steps?",
            "How can I best prepare for Unstop internships and hiring hackathons?",
            "Review my career context memory and recommend what to improve",
          ];
      }
    }

    const lastMessage = activeConversation.messages[activeConversation.messages.length - 1];
    if (lastMessage?.role === "assistant") {
      if (activeMode === "interview") {
        return [
          "Can you give me a stronger example answer?",
          "Ask me another challenging follow-up question",
          "What rating would an interviewer give my answer?",
        ];
      }
      if (activeMode === "resume") {
        return [
          "Rewrite this into a high-impact ATS bullet point",
          "What keywords should I include for fresher SDE roles?",
          "How can I format this for my Word resume download?",
        ];
      }
      return [
        "Explain the practical next step in more detail",
        "How can I apply this to my current college projects?",
        "What are the common pitfalls students make here?",
      ];
    }

    return [];
  }, [activeMode, activeConversation.messages, profile]);

  // Handlers
  const handleSelectMode = (newMode: CareerMode) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConversationId ? { ...c, mode: newMode } : c))
    );
  };

  const handleNewConversation = (mode: CareerMode = "general") => {
    const newId = "conv-" + Date.now();
    const newConv: Conversation = {
      id: newId,
      title: "Career Consultation",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mode,
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
    setInput("");
    setStreamingContent("");
    setIsLoading(false);
  };

  const handleDeleteConversation = (id: string) => {
    if (currentUser?.id) {
      deleteConversationFromFirestore(currentUser.id, id).catch((e) =>
        console.warn("Firestore conv delete notice:", e)
      );
    }
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (filtered.length === 0) {
        const freshId = "conv-" + Date.now();
        const fresh: Conversation = {
          id: freshId,
          title: "Career Consultation",
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          mode: "general",
        };
        setActiveConversationId(freshId);
        return [fresh];
      }
      if (activeConversationId === id) {
        setActiveConversationId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear all messages in this conversation?")) {
      setConversations((prev) =>
        prev.map((c) => (c.id === activeConversationId ? { ...c, messages: [] } : c))
      );
    }
  };

  const handleExportChat = () => {
    const msgs = activeConversation.messages;
    if (msgs.length === 0) {
      alert("No messages to export yet.");
      return;
    }

    const title = activeConversation.title || "CareerSphere-Chat";
    let markdown = `# ${title}\n*Exported from CareerSphere AI - ${new Date().toLocaleString()}*\n\n---\n\n`;

    msgs.forEach((m) => {
      const sender = m.role === "assistant" ? "CareerSphere AI" : "You";
      const time = new Date(m.timestamp).toLocaleTimeString();
      markdown += `### ${sender} (${time})\n\n${m.content}\n\n---\n\n`;
    });

    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]/gi, "-")}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFeedback = (messageId: string, feedback: "helpful" | "not_helpful") => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeConversationId) return c;
        return {
          ...c,
          messages: c.messages.map((m) =>
            m.id === messageId
              ? { ...m, feedback: m.feedback === feedback ? undefined : feedback }
              : m
          ),
        };
      })
    );
  };

  // Send Message Logic
  const handleSendMessage = async (customPrompt?: string, isRegenerate = false) => {
    const promptToSend = (customPrompt !== undefined ? customPrompt : input).trim();
    if (!promptToSend && !isRegenerate) return;

    setErrorMessage(null);

    let updatedMessages = [...activeConversation.messages];
    let userMsgId = "";

    if (!isRegenerate) {
      userMsgId = "msg-user-" + Date.now();
      const userMessage: Message = {
        id: userMsgId,
        role: "user",
        content: promptToSend,
        timestamp: Date.now(),
        mode: activeMode,
      };

      updatedMessages.push(userMessage);

      // Auto title if first user message
      let newTitle = activeConversation.title;
      if (activeConversation.messages.length === 0) {
        newTitle =
          promptToSend.length > 36
            ? promptToSend.slice(0, 36).trim() + "..."
            : promptToSend;
      }

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? {
                ...c,
                title: newTitle,
                messages: updatedMessages,
                updatedAt: Date.now(),
              }
            : c
        )
      );

      setInput("");
    } else {
      if (
        updatedMessages.length > 0 &&
        updatedMessages[updatedMessages.length - 1].role === "assistant"
      ) {
        updatedMessages.pop();
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversationId
              ? { ...c, messages: updatedMessages, updatedAt: Date.now() }
              : c
          )
        );
      }
    }

    setIsLoading(true);
    setStreamingContent("");

    let accumulatedText = "";

    await generateCareerResponseStream(
      updatedMessages,
      profile,
      activeMode,
      {
        onChunk: (chunk) => {
          accumulatedText += chunk;
          setStreamingContent((prev) => prev + chunk);
        },
        onError: (err) => {
          console.error("Chat error:", err);
          setIsLoading(false);
          setErrorMessage(err);
        },
        onComplete: () => {
          setIsLoading(false);
          setStreamingContent("");

          if (accumulatedText.trim()) {
            const assistantMessage: Message = {
              id: "msg-ai-" + Date.now(),
              role: "assistant",
              content: accumulatedText,
              timestamp: Date.now(),
              mode: activeMode,
            };

            setConversations((prev) =>
              prev.map((c) =>
                c.id === activeConversationId
                  ? {
                      ...c,
                      messages: [...updatedMessages, assistantMessage],
                      updatedAt: Date.now(),
                    }
                  : c
              )
            );
          }
        },
      },
      isRegenerate
    );

    // Organically update profile from user input in background
    if (promptToSend) {
      extractCareerProfile(promptToSend, profile)
        .then((updatedProfile) => {
          if (updatedProfile && JSON.stringify(updatedProfile) !== JSON.stringify(profile)) {
            setProfile(updatedProfile);
          }
        })
        .catch((err) => console.warn("Extraction non-blocking err:", err));
    }
  };

  const handleRegenerate = () => {
    if (activeConversation.messages.length === 0 || isLoading) return;
    handleSendMessage(undefined, true);
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    // Sync to profile
    setProfile((prev) => ({
      ...prev,
      fullName: prev.fullName || user.name,
      email: prev.email || user.email,
      photo: prev.photo || user.photoUrl,
    }));
  };

  const handleLogout = async () => {
    try {
      await logoutFirebase();
    } catch (e) {
      console.warn("Logout error:", e);
    }
    setCurrentUser(null);
  };

  const handleToggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  const handleSaveProfile = (updated: CareerProfile) => {
    setProfile(updated);
    if (currentUser?.id) {
      saveCareerProfileToFirestore(currentUser.id, updated).catch((err) => {
        console.error("Failed to save career profile to cloud:", err);
      });
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Separate Sign In / Login Page */}
        <Route
          path="/login"
          element={
            <LoginPage
              currentUser={currentUser}
              onLoginSuccess={handleLoginSuccess}
              onLogout={handleLogout}
              theme={theme}
            />
          }
        />
        <Route path="/signin" element={<Navigate to="/login" replace />} />

        {/* Separate Sign Up / Registration Page */}
        <Route
          path="/register"
          element={
            <RegisterPage
              currentUser={currentUser}
              onLoginSuccess={handleLoginSuccess}
              onUpdateProfile={handleSaveProfile}
              theme={theme}
            />
          }
        />
        <Route path="/signup" element={<Navigate to="/register" replace />} />

        {/* Separate Sign Out / Logout Page */}
        <Route
          path="/logout"
          element={
            <LogoutPage
              currentUser={currentUser}
              onLogout={handleLogout}
              theme={theme}
            />
          }
        />
        <Route path="/signout" element={<Navigate to="/logout" replace />} />

        {/* Dedicated Candidate Profile Viewing & Editing Page */}
        <Route
          path="/profile"
          element={
            <ProfilePage
              profile={profile}
              onSaveProfile={handleSaveProfile}
              currentUser={currentUser}
              theme={theme}
            />
          }
        />

        {/* DASHBOARD 2: Dedicated AI Resume Builder Dashboard */}
        <Route
          path="/resume"
          element={
            <ResumePage
              profile={profile}
              currentUser={currentUser}
              theme={theme}
              onToggleTheme={handleToggleTheme}
              onLogout={handleLogout}
            />
          }
        />
        <Route path="/dashboard/resume" element={<Navigate to="/resume" replace />} />

        {/* DASHBOARD 3: Dedicated Unstop Job Discovery Dashboard */}
        <Route
          path="/jobs"
          element={
            <JobsPage
              profile={profile}
              currentUser={currentUser}
              theme={theme}
              onToggleTheme={handleToggleTheme}
              onLogout={handleLogout}
            />
          }
        />
        <Route path="/dashboard/jobs" element={<Navigate to="/jobs" replace />} />

        {/* DASHBOARD 1: Dedicated AI Career Advisor Dashboard */}
        <Route
          path="/dashboard"
          element={
            <DashboardPage
              conversations={conversations}
              activeConversationId={activeConversationId}
              activeConversation={activeConversation}
              activeMode={activeMode}
              profile={profile}
              currentUser={currentUser}
              theme={theme}
              input={input}
              setInput={setInput}
              isLoading={isLoading}
              streamingContent={streamingContent}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              isContextPanelOpen={isContextPanelOpen}
              setIsContextPanelOpen={setIsContextPanelOpen}
              isInfoModalOpen={isInfoModalOpen}
              setIsInfoModalOpen={setIsInfoModalOpen}
              onSendMessage={handleSendMessage}
              onRegenerate={handleRegenerate}
              onFeedback={handleFeedback}
              onSelectConversation={(id) => {
                setActiveConversationId(id);
                setIsLoading(false);
                setStreamingContent("");
              }}
              onNewConversation={handleNewConversation}
              onDeleteConversation={handleDeleteConversation}
              onRenameConversation={handleRenameConversation}
              onSelectMode={handleSelectMode}
              suggestedPrompts={suggestedPrompts}
              onToggleTheme={handleToggleTheme}
              onClearChat={handleClearChat}
              onExportChat={handleExportChat}
            />
          }
        />
        <Route path="/advisor" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard/advisor" element={<Navigate to="/dashboard" replace />} />

        {/* Website Starting / Landing Page with Big CareerSphere Logo & Cloth UX */}
        <Route
          path="/"
          element={
            <LandingPage
              currentUser={currentUser}
              profile={profile}
              theme={theme}
              onToggleTheme={handleToggleTheme}
              onLogout={handleLogout}
            />
          }
        />
        <Route path="/welcome" element={<Navigate to="/" replace />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
