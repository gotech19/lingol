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
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  updateProfile,
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

// Format Firebase errors into clear, actionable French explanations
export function formatFirebaseAuthError(err: any): string {
  const code = err?.code || '';
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'ce domaine';

  switch (code) {
    case 'auth/unauthorized-domain':
      return `Le domaine "${hostname}" n'est pas encore autorisé dans votre projet Firebase lingol-83655. Allez dans Firebase Console > Authentication > Settings > Domaines autorisés et ajoutez "${hostname}".`;
    case 'auth/operation-not-allowed':
      return "Le fournisseur de connexion Google n'est pas activé dans votre console Firebase. Activez-le dans Firebase Console > Authentication > Sign-in method > Google.";
    case 'auth/popup-blocked':
      return "La fenêtre popup de connexion Google a été bloquée par le navigateur ou l'aperçu. Veuillez autoriser les pop-ups ou ouvrir l'application dans un nouvel onglet.";
    case 'auth/popup-closed-by-user':
      return "La fenêtre de connexion Google a été fermée avant la finalisation de l'authentification.";
    case 'auth/cancelled-popup-request':
      return "Une demande d'authentification Google est déjà en cours.";
    case 'auth/network-request-failed':
      return "Erreur de connexion réseau : impossible de joindre les serveurs Google/Firebase.";
    case 'auth/user-disabled':
      return "Ce compte utilisateur a été désactivé par l'administrateur.";
    case 'auth/invalid-api-key':
      return "La clé API Firebase est invalide ou expirée.";
    case 'auth/email-already-in-use':
      return "Cette adresse email est déjà associée à un compte existant.";
    case 'auth/invalid-email':
      return "L'adresse email saisie n'est pas valide.";
    case 'auth/weak-password':
      return "Le mot de passe doit comporter au moins 6 caractères.";
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      return "Identifiants incorrects (email ou mot de passe invalide).";
    default:
      return err?.message || "Échec de l'authentification Google.";
  }
}

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
          if (parsed.name === 'Google Learner' || parsed.name === 'Apprenant Google') {
            parsed.name = 'LinGoL Learner';
          }
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
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Le service Firebase Auth n'est pas configuré. Veuillez vérifier les identifiants Firebase.");
    }
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      return await this.syncFirestoreUser(cred.user);
    } catch (err: any) {
      throw new Error(formatFirebaseAuthError(err));
    }
  },

  async registerWithEmail(name: string, email: string, pass: string, learningLanguage: any = 'en'): Promise<UserProfile> {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Le service Firebase Auth n'est pas configuré. Veuillez vérifier les identifiants Firebase.");
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (name && cred.user) {
        await updateProfile(cred.user, { displayName: name }).catch((e) => {
          console.debug('Display name update notice:', e);
        });
      }
      return await this.syncFirestoreUser(cred.user, learningLanguage);
    } catch (err: any) {
      throw new Error(formatFirebaseAuthError(err));
    }
  },

  async loginWithGoogle(learningLanguage: any = 'en'): Promise<UserProfile> {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Le service Firebase Auth n'est pas initialisé pour le projet lingol-83655.");
    }

    try {
      if (typeof auth.useDeviceLanguage === 'function') {
        auth.useDeviceLanguage();
      }
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      provider.setCustomParameters({
        prompt: 'select_account',
      });

      const cred = await signInWithPopup(auth, provider);
      if (!cred || !cred.user) {
        throw new Error("Aucun compte Google sélectionné.");
      }
      return await this.syncFirestoreUser(cred.user, learningLanguage);
    } catch (err: any) {
      console.error('Erreur Firebase Google Auth:', err);
      throw new Error(formatFirebaseAuthError(err));
    }
  },

  async loginWithGoogleRedirect(): Promise<void> {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Le service Firebase Auth n'est pas initialisé.");
    }
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    await signInWithRedirect(auth, provider);
  },

  async checkRedirectResult(): Promise<UserProfile | null> {
    if (!isFirebaseConfigured || !auth) return null;
    try {
      const result = await getRedirectResult(auth);
      if (result && result.user) {
        return await this.syncFirestoreUser(result.user);
      }
    } catch (err) {
      console.warn('Redirect result notice:', err);
    }
    return null;
  },

  async resetPassword(email: string): Promise<void> {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Le service Firebase Auth n'est pas configuré.");
    }
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      throw new Error(formatFirebaseAuthError(err));
    }
  },

  async logout(): Promise<void> {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('SignOut error:', e);
      }
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

  async syncFirestoreUser(firebaseUser: FirebaseUser, learningLanguage?: string): Promise<UserProfile> {
    const existing = this.getCurrentUserProfile();
    const realDisplayName = firebaseUser.displayName || existing.name || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'LinGoL Learner');
    const realPhoto = firebaseUser.photoURL || existing.photoURL || undefined;

    const baseProfile: UserProfile = {
      ...existing,
      uid: firebaseUser.uid,
      name: realDisplayName,
      email: firebaseUser.email || existing.email || '',
      photoURL: realPhoto,
      isAuthenticated: true,
      learningLanguage: (learningLanguage || existing.learningLanguage || 'en') as any,
      lastLoginAt: new Date().toISOString(),
    };

    if (!db) {
      this.saveUserProfile(baseProfile);
      return baseProfile;
    }

    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        const merged: UserProfile = {
          ...baseProfile,
          ...data,
          name: firebaseUser.displayName || data.name || baseProfile.name,
          email: firebaseUser.email || data.email || baseProfile.email,
          photoURL: firebaseUser.photoURL || data.photoURL || baseProfile.photoURL,
          isAuthenticated: true,
          lastLoginAt: new Date().toISOString(),
        };
        this.saveUserProfile(merged);
        return merged;
      } else {
        await setDoc(userRef, baseProfile);
        this.saveUserProfile(baseProfile);
        return baseProfile;
      }
    } catch (e) {
      console.warn('Firestore sync note (saving authenticated user profile locally):', e);
      this.saveUserProfile(baseProfile);
      return baseProfile;
    }
  },
};
