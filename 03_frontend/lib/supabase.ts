import { createClient } from "@supabase/supabase-js";
import { LineService } from "./line";

// Environment variable validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL environment variable is not set");
}

if (!supabaseAnonKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is not set");
}

// Validate Supabase URL format
if (!supabaseUrl.startsWith("https://") && !supabaseUrl.startsWith("http://")) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL must be a valid HTTP or HTTPS URL");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication helpers
export const auth = {
  // Sign in with LINE
  async signInWithLine() {
    try {
      // Get LINE profile and ID token
      const lineProfile = await LineService.getProfile();
      const idToken = await LineService.getIDToken();
      const decodedToken = await LineService.getDecodedIDToken();

      if (!idToken || !decodedToken) {
        throw new Error("Failed to get LINE ID token or decoded token");
      }

      // Verify the ID token by calling our backend API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const response = await fetch(`${apiUrl}/auth/line`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken,
          lineProfile: {
            userId: lineProfile.userId,
            displayName: lineProfile.displayName,
            pictureUrl: lineProfile.pictureUrl,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }

      const { data: authData } = await response.json();

      // Create a Supabase session with the returned JWT
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: authData.access_token,
        refresh_token: authData.refresh_token,
      });

      if (sessionError) throw sessionError;

      // Create or update profile in our profiles table
      if (sessionData.user) {
        const { error: profileError } = await supabase.from("profiles").upsert(
          {
            id: sessionData.user.id,
            line_user_id: lineProfile.userId,
            display_name: lineProfile.displayName,
            avatar_url: lineProfile.pictureUrl,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "id",
          },
        );

        if (profileError) {
          console.error("Error updating profile:", profileError);
        }
      }

      return sessionData;
    } catch (error) {
      console.error("LINE sign in error:", error);
      throw error;
    }
  },

  // Sign out
  async signOut() {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Sign out from LINE
      await LineService.logout();
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;

      if (user) {
        // Get additional profile data
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          throw profileError;
        }

        return { user, profile };
      }

      return { user: null, profile: null };
    } catch (error) {
      console.error("Get current user error:", error);
      throw error;
    }
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: import("@supabase/supabase-js").Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

export default supabase;
