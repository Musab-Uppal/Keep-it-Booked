import React, { useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabase";
import { User, AuthContextType } from "../types";
import { AuthContext } from "./AuthContextValue";

interface AuthProviderProps {
  children: ReactNode;
}

const buildDefaultCallbackUrl = (): string => {
  const baseUrl = import.meta.env.BASE_URL || "/";
  const normalizedBase =
    baseUrl === "/" || baseUrl === "./"
      ? ""
      : baseUrl.endsWith("/")
        ? baseUrl.slice(0, -1)
        : baseUrl;

  return `${window.location.origin}${normalizedBase}/auth/callback`;
};

const resolveOAuthCallbackUrl = (): string => {
  // Vite loads this from the active mode env file: .env for dev and
  // .env.production for production builds.
  return import.meta.env.VITE_CALLBACK_URL?.trim() || buildDefaultCallbackUrl();
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<unknown | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        setUser((session?.user as User) ?? null);
      } catch (error) {
        console.error("Failed to get session:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      setSession(session);
      setUser((session?.user as User) ?? null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<void> => {
    try {
      const callbackUrl = resolveOAuthCallbackUrl();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  const signInWithEmail = async (
    email: string,
    password: string,
  ): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.error("Email login error:", error);
      throw error;
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
  ): Promise<void> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            provider: "email",
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Signout error:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
