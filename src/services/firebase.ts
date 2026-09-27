import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  getDocFromServer,
  onSnapshot,
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { UserAccount, CareerProfile, Conversation, UnstopJob } from "../types";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Connect with configured database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Error Handling Infrastructure according to Firebase Skill
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection Validation on Boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration.");
    }
    return false;
  }
}

// Run test connection
testConnection();

// Authentication Helpers
export async function loginWithGooglePopup(): Promise<UserAccount> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    const userAccount: UserAccount = {
      id: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split("@")[0] || "Student Candidate",
      email: fbUser.email || "",
      photoUrl: fbUser.photoURL || undefined,
      isVerified: fbUser.emailVerified || true,
      registeredAt: Date.now(),
      authProvider: "google",
    };

    // Save or merge user profile to Firestore
    await saveUserProfileToFirestore(userAccount);
    return userAccount;
  } catch (error: any) {
    if (
      error?.code === "auth/popup-closed-by-user" ||
      error?.message?.includes("popup-closed-by-user")
    ) {
      console.info("Google Sign-In popup closed by user.");
      const cancelledErr: any = new Error("Google sign-in popup was closed.");
      cancelledErr.code = "auth/popup-closed-by-user";
      throw cancelledErr;
    }
    console.error("Google login error:", error);
    throw error;
  }
}

export async function registerWithEmailAndPassword(
  name: string,
  email: string,
  pass: string
): Promise<UserAccount> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, pass);
    const fbUser = credential.user;

    // Update display name on Firebase Auth user
    if (name) {
      await updateProfile(fbUser, { displayName: name });
    }

    const userAccount: UserAccount = {
      id: fbUser.uid,
      name: name || fbUser.email?.split("@")[0] || "Candidate",
      email: fbUser.email || email,
      isVerified: fbUser.emailVerified,
      registeredAt: Date.now(),
      authProvider: "email",
    };

    // Save user profile to Firestore
    await saveUserProfileToFirestore(userAccount);
    return userAccount;
  } catch (error: any) {
    if (error?.code === "auth/operation-not-allowed") {
      console.info("Email/Password provider not enabled in Firebase Console.");
      const opErr: any = new Error(
        "Email/Password accounts are not enabled for this Firebase project. Please sign in with Google or use the Demo Candidate profile."
      );
      opErr.code = "auth/operation-not-allowed";
      throw opErr;
    }
    console.error("Firebase registration error:", error);
    // Format error message for human clarity
    if (error?.code === "auth/email-already-in-use") {
      throw new Error("This email is already registered. Please sign in instead.");
    } else if (error?.code === "auth/weak-password") {
      throw new Error("Password should be at least 6 characters.");
    } else if (error?.code === "auth/invalid-email") {
      throw new Error("Please enter a valid email address.");
    }
    throw error;
  }
}

export async function loginWithEmailAndPassword(
  email: string,
  pass: string
): Promise<UserAccount> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, pass);
    const fbUser = credential.user;

    const userAccount: UserAccount = {
      id: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split("@")[0] || "Student Candidate",
      email: fbUser.email || email,
      photoUrl: fbUser.photoURL || undefined,
      isVerified: fbUser.emailVerified,
      registeredAt: Date.now(),
      authProvider: "email",
    };

    // Update or sync user profile to Firestore
    await saveUserProfileToFirestore(userAccount);
    return userAccount;
  } catch (error: any) {
    if (error?.code === "auth/operation-not-allowed") {
      console.info("Email/Password provider not enabled in Firebase Console.");
      const opErr: any = new Error(
        "Email/Password accounts are not enabled for this Firebase project. Please sign in with Google or use the Demo Candidate profile."
      );
      opErr.code = "auth/operation-not-allowed";
      throw opErr;
    }
    console.error("Firebase email sign-in error:", error);
    if (
      error?.code === "auth/invalid-credential" ||
      error?.code === "auth/user-not-found" ||
      error?.code === "auth/wrong-password"
    ) {
      throw new Error("Invalid email or password. Please check your credentials.");
    } else if (error?.code === "auth/too-many-requests") {
      throw new Error("Access temporarily disabled due to multiple failed login attempts. Try again later.");
    }
    throw error;
  }
}

export async function resetPasswordEmail(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    if (error?.code === "auth/operation-not-allowed") {
      throw new Error(
        "Password reset is unavailable because Email authentication is not enabled on this project."
      );
    }
    console.error("Reset password error:", error);
    if (error?.code === "auth/user-not-found") {
      throw new Error("No account found with this email address.");
    }
    throw error;
  }
}

export async function logoutFirebase(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

// User Profile Firestore Operations
export async function saveUserProfileToFirestore(user: UserAccount): Promise<void> {
  // Enforce zero-trust auth guard: only write if user matches authenticated Firebase session
  if (!auth.currentUser || auth.currentUser.uid !== user.id) {
    return;
  }
  const userPath = `users/${user.id}`;
  try {
    const docRef = doc(db, "users", user.id);
    const existingSnap = await getDoc(docRef);
    if (!existingSnap.exists()) {
      await setDoc(docRef, {
        id: user.id,
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl || "",
        isVerified: user.isVerified ?? true,
        authProvider: user.authProvider || "google",
        registeredAt: user.registeredAt || Date.now(),
        updatedAt: Date.now(),
      });
    } else {
      await updateDoc(docRef, {
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl || "",
        isVerified: user.isVerified ?? true,
        updatedAt: Date.now(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }
}

export async function fetchUserProfileFromFirestore(userId: string): Promise<UserAccount | null> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    return null;
  }
  const userPath = `users/${userId}`;
  try {
    const docRef = doc(db, "users", userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserAccount;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, userPath);
  }
}

// Career Context Memory Firestore Operations
export async function saveCareerProfileToFirestore(
  userId: string,
  profile: CareerProfile
): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    return;
  }
  const profilePath = `users/${userId}/profile/career`;
  try {
    const docRef = doc(db, "users", userId, "profile", "career");
    // Clean undefined fields for Firestore
    const cleaned: Record<string, any> = {
      userId,
      updatedAt: Date.now(),
    };

    Object.entries(profile).forEach(([k, v]) => {
      if (v !== undefined) {
        cleaned[k] = v;
      }
    });

    await setDoc(docRef, cleaned, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, profilePath);
  }
}

export async function fetchCareerProfileFromFirestore(
  userId: string
): Promise<CareerProfile | null> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    return null;
  }
  const profilePath = `users/${userId}/profile/career`;
  try {
    const docRef = doc(db, "users", userId, "profile", "career");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as CareerProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, profilePath);
  }
}

// Conversations Firestore Operations
export async function saveConversationToFirestore(
  userId: string,
  conversation: Conversation
): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    return;
  }
  const convPath = `users/${userId}/conversations/${conversation.id}`;
  try {
    const docRef = doc(db, "users", userId, "conversations", conversation.id);
    const payload = {
      id: conversation.id,
      userId,
      title: conversation.title || "Career Consultation",
      mode: conversation.mode || "general",
      messages: conversation.messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
        mode: m.mode || conversation.mode || "general",
        feedback: m.feedback || null,
      })),
      createdAt: conversation.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    await setDoc(docRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, convPath);
  }
}

export async function fetchConversationsFromFirestore(
  userId: string
): Promise<Conversation[]> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    return [];
  }
  const convsPath = `users/${userId}/conversations`;
  try {
    const colRef = collection(db, "users", userId, "conversations");
    const snap = await getDocs(colRef);
    const results: Conversation[] = [];
    snap.forEach((d) => {
      const data = d.data() as any;
      results.push({
        id: data.id,
        title: data.title,
        mode: data.mode,
        messages: Array.isArray(data.messages) ? data.messages : [],
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });
    // Sort descending by updatedAt
    return results.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, convsPath);
  }
}

export async function deleteConversationFromFirestore(
  userId: string,
  conversationId: string
): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    return;
  }
  const convPath = `users/${userId}/conversations/${conversationId}`;
  try {
    const docRef = doc(db, "users", userId, "conversations", conversationId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, convPath);
  }
}

// Saved Jobs Firestore Operations
export async function saveJobToFirestore(userId: string, job: UnstopJob): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    return;
  }
  const jobPath = `users/${userId}/saved_jobs/${job.id}`;
  try {
    const docRef = doc(db, "users", userId, "saved_jobs", job.id);
    await setDoc(docRef, {
      id: job.id,
      userId,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      stipendOrSalary: job.stipendOrSalary,
      applyUrl: job.applyUrl,
      matchPercentage: job.matchPercentage,
      savedAt: Date.now(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, jobPath);
  }
}

export async function fetchSavedJobsFromFirestore(userId: string): Promise<any[]> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    return [];
  }
  const jobsPath = `users/${userId}/saved_jobs`;
  try {
    const colRef = collection(db, "users", userId, "saved_jobs");
    const snap = await getDocs(colRef);
    const list: any[] = [];
    snap.forEach((d) => list.push(d.data()));
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, jobsPath);
  }
}

export async function removeSavedJobFromFirestore(
  userId: string,
  jobId: string
): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    return;
  }
  const jobPath = `users/${userId}/saved_jobs/${jobId}`;
  try {
    const docRef = doc(db, "users", userId, "saved_jobs", jobId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, jobPath);
  }
}
