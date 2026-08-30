'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, SignUpData, SignInData, AuthResponse } from './authTypes';
import { authService } from './authService';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  error: string | null;
  adapterMode: 'BACKEND_CONNECTED' | 'DEV_ADAPTER';
  signIn: (data: SignInData) => Promise<AuthResponse>;
  signUp: (data: SignUpData) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<User | null>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const adapterMode = authService.getAdapterMode();

  // Restore active user session on app mount
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        const user = await authService.getCurrentUser();
        if (isMounted) {
          setCurrentUser(user);
        }
      } catch {
        if (isMounted) {
          setCurrentUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = useCallback(async (data: SignInData): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    const res = await authService.signIn(data);
    if (res.success && res.user) {
      setCurrentUser(res.user);
    } else {
      setError(res.error || 'Sign in failed.');
    }

    setIsLoading(false);
    return res;
  }, []);

  const signUp = useCallback(async (data: SignUpData): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    const res = await authService.signUp(data);
    if (!res.success) {
      setError(res.error || 'Sign up failed.');
    }

    setIsLoading(false);
    return res;
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    await authService.signOut();
    setCurrentUser(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const refreshSession = useCallback(async (): Promise<User | null> => {
    const user = await authService.refreshSession();
    setCurrentUser(user);
    return user;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isLoading,
    role: currentUser ? currentUser.role : null,
    error,
    adapterMode,
    signIn,
    signUp,
    signOut,
    refreshSession,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
