import { Message, CareerProfile, CareerMode } from "../types";

export interface StreamCallbacks {
  onChunk: (chunk: string) => void;
  onError: (error: string) => void;
  onComplete: () => void;
}

export async function generateCareerResponseStream(
  messages: Message[],
  profile: CareerProfile,
  mode: CareerMode,
  callbacks: StreamCallbacks,
  regenerate = false
): Promise<void> {
  try {
    const payload = {
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      profile,
      mode,
      regenerate,
    };

    const response = await fetch("/api/career/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({ error: "Network response error" }));
      throw new Error(errJson.error || `Server responded with status ${response.status}`);
    }

    if (!response.body) {
      throw new Error("ReadableStream not supported by environment");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("data: ")) {
          const dataStr = trimmed.slice(6);
          if (dataStr === "[DONE]") {
            callbacks.onComplete();
            return;
          }

          try {
            const data = JSON.parse(dataStr);
            if (data.error) {
              callbacks.onError(data.error);
              return;
            }
            if (data.text) {
              callbacks.onChunk(data.text);
            }
          } catch {
            // Raw text fallback if not JSON
            callbacks.onChunk(dataStr);
          }
        }
      }
    }

    callbacks.onComplete();
  } catch (error: any) {
    console.error("Stream generation error:", error);
    callbacks.onError(error.message || "Failed to communicate with CareerSphere AI");
  }
}

export async function extractCareerProfile(
  message: string,
  currentProfile: CareerProfile
): Promise<CareerProfile> {
  try {
    const response = await fetch("/api/career/extract-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, currentProfile }),
    });

    if (!response.ok) return currentProfile;
    const data = await response.json();
    if (data && data.profile) {
      // Merge smartly without overwriting existing non-empty with empty
      const merged = { ...currentProfile };
      for (const [key, val] of Object.entries(data.profile)) {
        if (val !== undefined && val !== null && val !== "") {
          if (Array.isArray(val) && val.length > 0) {
            // merge array uniquely
            const existing = Array.isArray((merged as any)[key]) ? (merged as any)[key] : [];
            const set = new Set([...existing, ...val]);
            (merged as any)[key] = Array.from(set);
          } else if (!Array.isArray(val)) {
            (merged as any)[key] = val;
          }
        }
      }
      return merged;
    }
    return currentProfile;
  } catch (err) {
    console.warn("Could not extract profile delta:", err);
    return currentProfile;
  }
}

export async function generateResumeService(
  profile: CareerProfile
): Promise<import("../types").GeneratedResume> {
  const response = await fetch("/api/career/generate-resume", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to generate resume.");
  }

  const data = await response.json();
  return data.resume;
}

export async function fetchUnstopJobsService(
  profile: CareerProfile,
  filters: { category?: string; keyword?: string } = {}
): Promise<import("../types").UnstopJob[]> {
  const response = await fetch("/api/career/unstop-jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile, filters }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to retrieve Unstop jobs.");
  }

  const data = await response.json();
  return data.jobs || [];
}

export async function sendAuthVerificationService(
  email: string,
  name?: string
): Promise<{
  success: boolean;
  message: string;
  verificationLink: string;
  simulationCode: string;
}> {
  const response = await fetch("/api/auth/send-verification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to send verification email.");
  }

  return await response.json();
}

export async function verifyAuthCodeService(
  email: string,
  code?: string,
  token?: string
): Promise<{
  verified: boolean;
  user: import("../types").UserAccount;
}> {
  const response = await fetch("/api/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, token }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Verification failed.");
  }

  return await response.json();
}
