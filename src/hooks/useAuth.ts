import { useState, useEffect } from 'react';
import { type User } from 'firebase/auth';
import { loginWithGoogle, loginWithEmail, logout, subscribeToAuthChanges } from '../services/authService';
import { getSettings } from '../services/settingsService';
import { isFirebaseConfigured } from '../firebase/config';

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isConfigured: boolean;
  login: () => Promise<void>;
  loginWithEmailPassword: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
      setUser(currentUser);

      if (currentUser && currentUser.email) {
        try {
          const settings = await getSettings();
          const adminEmails = settings.adminEmails || [];
          const superAdminEmails = settings.superAdminEmails || [];
          const userEmail = currentUser.email.toLowerCase().trim();

          const isUserSuperAdmin = superAdminEmails.some(
            email => email.toLowerCase().trim() === userEmail
          );
          const isUserAdmin = isUserSuperAdmin || adminEmails.some(
            email => email.toLowerCase().trim() === userEmail
          );

          setIsAdmin(isUserAdmin);
          setIsSuperAdmin(isUserSuperAdmin);
        } catch (error) {
          console.error('[useAuth] Error verifying admin privileges:', error);
          setIsAdmin(false);
          setIsSuperAdmin(false);
        }
      } else {
        setIsAdmin(false);
        setIsSuperAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
    } catch (error) {
      console.error('[useAuth] Google login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithEmail = async (email: string, pass: string) => {
    try {
      setLoading(true);
      await loginWithEmail(email, pass);
    } catch (error) {
      console.error('[useAuth] Email login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsAdmin(false);
      setIsSuperAdmin(false);
    } catch (error) {
      console.error('[useAuth] Logout error:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    isAdmin,
    isSuperAdmin,
    isConfigured: isFirebaseConfigured,
    login: handleLogin,
    loginWithEmailPassword: handleLoginWithEmail,
    logout: handleLogout
  };
};
