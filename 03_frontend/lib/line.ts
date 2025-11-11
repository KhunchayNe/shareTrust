import { liff, Liff } from "@line/liff";

// Type for JWT payload from getDecodedIDToken
interface LineJWTPayload {
  iss?: string;
  sub?: string;
  aud?: string;
  exp?: number;
  iat?: number;
  amr?: string[];
  name?: string;
  picture?: string;
  email?: string;
  [key: string]: unknown; // Index signature for additional properties
}

// Enhanced LIFF configuration with validation
const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID;

let liffInstance: Liff | null = null;

// Validation helper
function validateLiffConfig(): { isValid: boolean; error?: string } {
  if (!LIFF_ID) {
    return {
      isValid: false,
      error: "NEXT_PUBLIC_LIFF_ID is not configured. Please check your environment variables."
    };
  }

  if (typeof window !== 'undefined' && !window.isSecureContext) {
    return {
      isValid: false,
      error: "LIFF requires a secure context (HTTPS). Please use ngrok or localtunnel for local development."
    };
  }

  return { isValid: true };
}

// Enhanced error handling
interface LiffError {
  code?: string;
  message?: string;
  details?: unknown;
}

function isLiffError(error: unknown): error is LiffError {
  return typeof error === 'object' && error !== null && 'code' in error;
}

export interface LineUser {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

// Simplified message type based on LINE LIFF documentation
export interface LiffMessage {
  type: string;
  [key: string]: unknown;
}

export class LineService {
  static async init(): Promise<Liff> {
    if (liffInstance) {
      return liffInstance;
    }

    // Validate configuration first
    const validation = validateLiffConfig();
    if (!validation.isValid) {
      throw new Error(`LIFF Configuration Error: ${validation.error}`);
    }

    console.log("Initializing LIFF with ID:", LIFF_ID);
    console.log("Current URL:", window.location.href);
    console.log("Is in LINE client:", liff.isInClient());

    try {
      await liff.init({
        liffId: LIFF_ID!,
        withLoginOnExternalBrowser: true // Enable automatic login in external browsers
      });

      liffInstance = liff;

      console.log("LIFF initialized successfully");
      console.log("LIFF ID:", liff.id);
      console.log("LIFF Version:", liff.getVersion());
      console.log("OS:", liff.getOS());
      console.log("Language:", liff.getAppLanguage());
      console.log("Is logged in:", liff.isLoggedIn());

      return liffInstance;
    } catch (error) {
      console.error("LIFF initialization failed:", error);

      // Enhanced error reporting
      if (isLiffError(error)) {
        switch (error.code) {
          case 'INVALID_CONFIG':
            throw new Error(`LIFF Configuration Error: Invalid LIFF ID or endpoint URL. Please check your LINE Developer Console settings. LIFF ID: ${LIFF_ID}`);
          case '401':
            throw new Error("LIFF Authentication Error: Channel access token is invalid or expired. Please check your LINE Developer Console.");
          case '403':
            throw new Error("LIFF Authorization Error: Your account doesn't have permission to use this LIFF app.");
          case '429':
            throw new Error("LIFF Rate Limit Error: Too many requests. Please try again later.");
          case '500':
            throw new Error("LIFF Server Error: Temporary issue with LINE servers. Please try again later.");
          case 'FORBIDDEN':
            throw new Error("LIFF Feature Error: This feature is not supported in the current environment.");
          case 'INIT_FAILED':
            throw new Error("LIFF Initialization Failed: General initialization error. Please check your network connection and LIFF configuration.");
          default:
            throw new Error(`LIFF Error (${error.code}): ${error.message}`);
        }
      }

      // Handle network errors
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          throw new Error("Network Error: Unable to connect to LINE servers. Please check your internet connection and ensure you're using HTTPS.");
        }
        if (error.message.includes('channel not found')) {
          throw new Error(`Channel Not Found: The LIFF ID ${LIFF_ID} is not valid or the channel is not properly configured in LINE Developer Console.`);
        }
      }

      throw new Error(`LIFF Initialization Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async isLoggedIn(): Promise<boolean> {
    if (!liffInstance) {
      await this.init();
    }
    return liffInstance!.isLoggedIn();
  }

  static async login(): Promise<void> {
    if (!liffInstance) {
      await this.init();
    }

    if (!liffInstance!.isLoggedIn()) {
      const currentUrl = window.location.href;
      console.log("Initiating LINE login with redirect URI:", currentUrl);

      // Validate redirect URI
      if (!currentUrl.startsWith('https://') && !liffInstance!.isInClient()) {
        throw new Error("LIFF login requires HTTPS in external browsers. Please use ngrok or localtunnel for local development.");
      }

      liffInstance!.login({
        redirectUri: currentUrl,
      });
    } else {
      console.log("User is already logged in to LINE");
    }
  }

  static async logout(): Promise<void> {
    if (!liffInstance) {
      await this.init();
    }

    if (liffInstance!.isLoggedIn()) {
      liffInstance!.logout();
    }
  }

  static async getProfile(): Promise<LineUser> {
    if (!liffInstance) {
      await this.init();
    }

    if (!liffInstance!.isLoggedIn()) {
      throw new Error("User is not logged in");
    }

    const profile = await liffInstance!.getProfile();
    return {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl || undefined,
      statusMessage: profile.statusMessage || undefined,
    };
  }

  static async getAccessToken(): Promise<string | null> {
    if (!liffInstance) {
      await this.init();
    }

    if (!liffInstance!.isLoggedIn()) {
      return null;
    }

    return liffInstance!.getAccessToken();
  }

  static async getIDToken(): Promise<string | null> {
    if (!liffInstance) {
      await this.init();
    }

    if (!liffInstance!.isLoggedIn()) {
      return null;
    }

    return liffInstance!.getIDToken();
  }

  static async getDecodedIDToken(): Promise<LineJWTPayload | null> {
    if (!liffInstance) {
      await this.init();
    }

    if (!liffInstance!.isLoggedIn()) {
      throw new Error("User is not logged in");
    }

    // Type cast the return value to match our interface
    return liffInstance!.getDecodedIDToken() as LineJWTPayload | null;
  }

  static isInClient(): boolean {
    if (!liffInstance) {
      return false;
    }
    return liffInstance.isInClient();
  }

  static async openWindow(
    url: string,
    external: boolean = false,
  ): Promise<void> {
    if (!liffInstance) {
      await this.init();
    }

    liffInstance!.openWindow({
      url,
      external,
    });
  }

  static async closeWindow(): Promise<void> {
    if (!liffInstance) {
      await this.init();
    }

    if (liffInstance!.isInClient()) {
      liffInstance!.closeWindow();
    }
  }

  static async sendMessages(messages: LiffMessage[]): Promise<void> {
    if (!liffInstance) {
      await this.init();
    }

    if (!liffInstance!.isLoggedIn()) {
      throw new Error("User is not logged in");
    }

    // This requires the 'chat_message.write' permission in the LIFF app settings
    // @ts-expect-error - Type compatibility issue with LINE LIFF types
    await liffInstance!.sendMessages(messages);
  }

  static async getProfileImageAsDataURL(): Promise<string | null> {
    if (!liffInstance) {
      await this.init();
    }

    if (!liffInstance!.isLoggedIn()) {
      return null;
    }

    const profile = await liffInstance!.getProfile();
    if (profile.pictureUrl) {
      try {
        const response = await fetch(profile.pictureUrl);
        const blob = await response.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error("Failed to fetch profile image:", error);
        return null;
      }
    }

    return null;
  }
}

export default LineService;
