import { auth, googleProvider, isFirebaseConfigured } from '../firebase/config';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type Unsubscribe
} from 'firebase/auth';

/**
 * Initiates Google Login popup.
 * Phase 4 requirement: Google Login via Firebase Auth.
 */
export const loginWithGoogle = async (): Promise<User | null> => {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase credentials are not configured in your .env file. Please review ADMIN_SETUP.md.');
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('[AuthService] Google login failed:', error);
    throw error;
  }
};

/**
 * Alternative email/password login for environments without Google Popup authorization.
 */
export const loginWithEmail = async (email: string, pass: string): Promise<User | null> => {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase credentials are not configured in your .env file. Please review ADMIN_SETUP.md.');
  }

  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (error: any) {
    console.error('[AuthService] Email login failed:', error);
    throw error;
  }
};

/**
 * Signs out the current authenticated user.
 */
export const logout = async (): Promise<void> => {
  if (!auth) return;
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('[AuthService] Logout failed:', error);
    throw error;
  }
};

/**
 * Subscribes to authentication state changes.
 */
export const subscribeToAuthChanges = (callback: (user: User | null) => void): Unsubscribe => {
  if (!isFirebaseConfigured || !auth) {
    // Immediate callback with null when Firebase is not active
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};
