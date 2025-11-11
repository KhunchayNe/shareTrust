"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "@supabase/supabase-js";
import { auth, supabase } from "../lib/supabase";
import { LineService } from "../lib/line";

interface Profile {
  id: string;
  line_user_id?: string;
  display_name?: string;
  avatar_url?: string;
  phone?: string;
  email?: string;
  trust_level: number;
  trust_score: number;
  is_verified: boolean;
  verification_data?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const refreshProfile = async () => {
    if (user) {
      try {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching profile:", error);
        } else {
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Error refreshing profile:", error);
      }
    }
  };

  const signIn = async () => {
    try {
      setLoading(true);

      // Initialize LINE LIFF
      await LineService.init();

      // Check if user is logged in to LINE
      if (!(await LineService.isLoggedIn())) {
        await LineService.login();
        return; // Will redirect to LINE login
      }

      // Sign in with LINE
      await auth.signInWithLine();

      // Get current user and profile
      const { user: currentUser, profile: currentProfile } =
        await auth.getCurrentUser();
      setUser(currentUser);
      setProfile(currentProfile);
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);

        // Check for OAuth callback parameters first
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const liffClientId = urlParams.get('liffClientId');

        if (code && state && liffClientId === process.env.NEXT_PUBLIC_LIFF_ID) {
          console.log('Detected OAuth callback with code:', code.substring(0, 10) + '...');

          try {
            // Initialize LINE LIFF first to get the ID token
            await LineService.init();

            // Process OAuth code through our backend
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/auth/line`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                code,
                state,
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Authentication failed');
            }

            const { data: authData } = await response.json();

            // Create Supabase session
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: authData.access_token,
              refresh_token: authData.refresh_token,
            });

            if (sessionError) throw sessionError;

            // Update user state
            setUser(sessionData.user);

            // Get and set profile data
            if (sessionData.user) {
              const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", sessionData.user.id)
                .single();

              if (profileError && profileError.code !== "PGRST116") {
                console.error("Profile error:", profileError);
              } else {
                setProfile(profileData);
              }
            }

            // Clean URL by removing OAuth parameters
            window.history.replaceState({}, document.title, window.location.pathname);

            console.log('OAuth authentication completed successfully');
            return;

          } catch (oauthError) {
            console.error('OAuth callback processing failed:', oauthError);
            // Continue with regular initialization
          }
        }

        // Initialize LINE LIFF
        await LineService.init();

        // Get current session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
        } else if (session) {
          setUser(session.user);

          // Get profile data
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profileError && profileError.code !== "PGRST116") {
            console.error("Profile error:", profileError);
          } else {
            setProfile(profileData);
          }
        }

        // Listen to auth changes
        const {
          data: { subscription },
        } = auth.onAuthStateChange(async (event, session) => {
          console.log("Auth state changed:", event, session);

          if (session?.user) {
            setUser(session.user);

            // Get updated profile data
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (profileError && profileError.code !== "PGRST116") {
              console.error("Profile error:", profileError);
            } else {
              setProfile(profileData);
            }
          } else {
            setUser(null);
            setProfile(null);
          }

          setLoading(false);
        });

        setInitialized(true);
        setLoading(false);

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    loading,
    initialized,
    signIn,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
