import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { UserProfile } from '../types';

// Check for client configuration via environment or window
const metaEnv = (import.meta as any).env || {};
export const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || 'AIzaSyCV-DCQG8f6mO1OUErPLO2eSTkhi41sglQ',
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || 'lingol-83655.firebaseapp.com',
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || 'lingol-83655',
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || 'lingol-83655.firebasestorage.app',
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || '932024246550',
  appId: metaEnv.VITE_FIREBASE_APP_ID || '1:932024246550:web:aca59613f81b1298adf037',
  measurementId: metaEnv.VITE_FIREBASE_MEASUREMENT_ID || 'G-3YVL76ECGY',
};

const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app: any = null;
let auth: any = null;
let db: any = null;
let analytics: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('Firebase initialized with project:', firebaseConfig.projectId);

    if (typeof window !== 'undefined') {
      isSupported()
        .then((supported) => {
          if (supported && app) {
            analytics = getAnalytics(app);
            console.log('Firebase Analytics initialized.');
          }
        })
        .catch((err) => {
          console.debug('Firebase Analytics initialization skipped:', err);
        });
    }
  } catch (err) {
    console.warn('Firebase init error, using local fallback storage:', err);
  }
} else {
  console.info('Firebase not configured. Using local persistence mode.');
}

export { app, auth, db, analytics, isFirebaseConfigured };

// Fallback Local Storage User Key
const LOCAL_USER_KEY = 'lingol_active_user';

export const initialDefaultProfile: UserProfile = {
  uid: '',
  name: '',
  email: '',
  photoURL: undefined,
  isAuthenticated: false,
  hasCompletedLevelTest: false,
  levelTestScore: undefined,
  levelTestDate: undefined,
  interfaceLanguage: 'fr',
  learningLanguage: 'en',
  currentLevel: 'A1',
  targetLevel: 'B2',
  selectedAvatarId: 'emma',
  learningGoals: ['work', 'travel', 'daily_life'],
  xp: 0,
  streak: 0,
  completedLessons: [],
  completedMissions: [],
  pronunciationScore: 0,
  listeningScore: 0,
  speakingScore: 0,
  grammarScore: 0,
  vocabularyScore: 0,
  subscriptionStatus: 'free',
  dailyMinutesPracticed: 0,
  dailyMinutesGoal: 15,
  memories: [],
  role: 'user',
  createdAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString(),
};

export const authService = {
  isConfigured: () => isFirebaseConfigured,

  getCurrentUserProfile(): UserProfile {
    if (typeof window === 'undefined') return initialDefaultProfile;
    const stored = localStorage.getItem(LOCAL_USER_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Clean out any legacy demo or placeholder account
        if (
          parsed &&
          (parsed.uid === 'lingol_demo_user_01' ||
            parsed.name === 'Alexandre Martin' ||
            parsed.email === 'alexandre@example.com' ||
            !parsed.uid)
        ) {
          localStorage.removeItem(LOCAL_USER_KEY);
          return initialDefaultProfile;
        }

        if (parsed && typeof parsed === 'object' && parsed.uid) {
          if (parsed.isAuthenticated === undefined) {
            parsed.isAuthenticated = Boolean(parsed.uid && parsed.uid !== '');
          }
          if (parsed.hasCompletedLevelTest === undefined) {
            parsed.hasCompletedLevelTest = false;
          }
          return parsed;
        }
      } catch (e) {
        return initialDefaultProfile;
      }
    }
    return initialDefaultProfile;
  },

  saveUserProfile(profile: UserProfile) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
    }
    // Also sync to Firestore if configured
    if (db && auth?.currentUser) {
      try {
        const userDoc = doc(db, 'users', profile.uid);
        setDoc(userDoc, profile, { merge: true }).catch((err) => {
          console.warn('Firestore sync failed:', err);
        });
      } catch (e) {
        // ignore
      }
    }
  },

  async loginWithEmail(email: string, pass: string): Promise<UserProfile> {
    if (isFirebaseConfigured && auth) {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      return this.syncFirestoreUser(cred.user);
    }
    // Demo local login
    const current = this.getCurrentUserProfile();
    const updated: UserProfile = {
      ...current,
      uid: current.uid || ('user_' + Date.now()),
      email,
      name: current.name || email.split('@')[0],
      isAuthenticated: true,
      hasCompletedLevelTest: current.hasCompletedLevelTest ?? false,
      lastLoginAt: new Date().toISOString(),
    };
    this.saveUserProfile(updated);
    return updated;
  },

  async registerWithEmail(name: string, email: string, pass: string, learningLanguage: any = 'en'): Promise<UserProfile> {
    if (isFirebaseConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const newProfile: UserProfile = {
        ...initialDefaultProfile,
        uid: cred.user.uid,
        name: name || email.split('@')[0],
        email,
        learningLanguage: learningLanguage || 'en',
        isAuthenticated: true,
        hasCompletedLevelTest: false, // MANDATORY: will take level placement test at startup
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      this.saveUserProfile(newProfile);
      return newProfile;
    }
    // Demo registration
    const newProfile: UserProfile = {
      ...initialDefaultProfile,
      uid: 'user_' + Date.now(),
      name,
      email,
      learningLanguage: learningLanguage || 'en',
      isAuthenticated: true,
      hasCompletedLevelTest: false, // MANDATORY: will take level placement test at startup
      xp: 0,
      streak: 1,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    this.saveUserProfile(newProfile);
    return newProfile;
  },

  async loginWithGoogle(learningLanguage: any = 'en'): Promise<UserProfile> {
    if (isFirebaseConfigured && auth) {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      return this.syncFirestoreUser(cred.user);
    }
    // Demo Google Sign-In
    const current = this.getCurrentUserProfile();
    const isReturningUser = current.isAuthenticated && current.email.includes('@');
    const updated: UserProfile = {
      ...current,
      uid: current.uid || ('google_' + Date.now()),
      name: current.name || 'Google Learner',
      email: current.email && current.email !== '' ? current.email : 'user@gmail.com',
      photoURL: current.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      learningLanguage: current.learningLanguage || learningLanguage || 'en',
      isAuthenticated: true,
      // If user had previously completed level test, keep it, otherwise require test de niveau
      hasCompletedLevelTest: current.hasCompletedLevelTest ?? false,
      lastLoginAt: new Date().toISOString(),
    };
    this.saveUserProfile(updated);
    return updated;
  },

  async resetPassword(email: string): Promise<void> {
    if (isFirebaseConfigured && auth) {
      await sendPasswordResetEmail(auth, email);
    }
  },

  async logout(): Promise<void> {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_USER_KEY);
    }
  },

  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    if (isFirebaseConfigured && auth) {
      return onAuthStateChanged(auth, callback);
    }
    return () => {};
  },

  async syncFirestoreUser(firebaseUser: FirebaseUser): Promise<UserProfile> {
    if (!db) return this.getCurrentUserProfile();
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        data.isAuthenticated = true;
        this.saveUserProfile(data);
        return data;
      } else {
        const newProfile: UserProfile = {
          ...initialDefaultProfile,
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'LinGoL Learner',
          email: firebaseUser.email || 'learner@gmail.com',
          photoURL: firebaseUser.photoURL || undefined,
          isAuthenticated: true,
          hasCompletedLevelTest: false, // New user needs level test
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
        await setDoc(userRef, newProfile);
        this.saveUserProfile(newProfile);
        return newProfile;
      }
    } catch (e) {
      console.warn('Error reading user from Firestore:', e);
      return this.getCurrentUserProfile();
    }
  },
};
