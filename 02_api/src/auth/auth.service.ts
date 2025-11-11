import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { LineLoginDto, LineProfileDto } from './dto/line-login.dto';
import { ProfileDto } from './dto/profile.dto';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    this.supabase = createClient(
      this.configService.get<string>('NEXT_PUBLIC_SUPABASE_URL'),
      this.configService.get<string>('SUPABASE_SERVICE_KEY'),
    );
  }

  async signInWithLine(lineLoginDto: LineLoginDto) {
    try {
      // Exchange OAuth code for access token and ID token
      const tokenResponse = await this.exchangeCodeForToken(lineLoginDto.code);

      if (!tokenResponse.id_token) {
        throw new Error('Failed to get ID token from LINE');
      }

      // Decode the LINE ID token to verify its validity
      const decodedToken = this.decodeLineIdToken(tokenResponse.id_token);

      if (!decodedToken) {
        throw new Error('Invalid LINE ID token');
      }

      // Get LINE user profile using access token
      const lineProfile = await this.getLINEProfile(tokenResponse.access_token);

      // Generate a unique email for the LINE user
      const email = `${lineProfile.userId}@line.users.sharetrust`;

      // Try to get existing user by LINE user ID
      const { data: existingProfile } = await this.supabase
        .from('profiles')
        .select('id')
        .eq('line_user_id', lineProfile.userId)
        .single();

      let userData: any;
      let userId: string;

      if (existingProfile) {
        // User exists, get their Supabase user record
        userId = existingProfile.id;
        const { data: user, error } =
          await this.supabase.auth.admin.getUserById(userId);
        if (error || !user) {
          throw new Error('User not found in Supabase auth');
        }
        userData = { user: user };
      } else {
        // Create new user using admin API
        const { data: newUser, error: createError } =
          await this.supabase.auth.admin.createUser({
            email,
            email_confirm: true,
            user_metadata: {
              line_user_id: lineProfile.userId,
              display_name: lineProfile.displayName,
              avatar_url: lineProfile.pictureUrl,
              provider: 'line',
            },
          });

        if (createError) {
          throw new Error(`Failed to create user: ${createError.message}`);
        }

        userData = { user: newUser.user };
        userId = newUser.user.id;
      }

      // Get or create user profile
      if (userData.user) {
        const profileData: Partial<ProfileDto> = {
          line_user_id: lineProfile.userId,
          display_name: lineProfile.displayName,
          avatar_url: lineProfile.pictureUrl,
          updated_at: new Date().toISOString(),
        };

        const { error: profileError } = await this.supabase
          .from('profiles')
          .upsert(
            {
              id: userData.user.id,
              ...profileData,
            },
            {
              onConflict: 'id',
            },
          );

        if (profileError) {
          console.error('Profile error:', profileError);
        }

        // Generate custom Supabase JWT token
        const supabasePayload = {
          aud: 'authenticated',
          exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
          sub: userData.user.id,
          email: email,
          role: 'authenticated',
          user_metadata: {
            line_user_id: lineProfile.userId,
            display_name: lineProfile.displayName,
            avatar_url: lineProfile.pictureUrl,
            provider: 'line',
          },
        };

        // Generate Supabase compatible JWT
        const supabaseToken = await this.generateSupabaseJWT(supabasePayload);

        return {
          access_token: supabaseToken,
          refresh_token: this.generateRefreshToken(userData.user.id),
          user: userData.user,
          profile: profileData,
        };
      }

      throw new Error('Failed to sign in with LINE');
    } catch (error) {
      console.error('LINE sign in error:', error);
      throw error;
    }
  }

  private decodeLineIdToken(idToken: string): any {
    try {
      // For production, you should verify the signature with LINE's public keys
      // For now, we'll decode the token without signature verification
      const parts = idToken.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

      // Basic validation of the token
      if (!payload.sub || !payload.iss || !payload.aud) {
        throw new Error('Invalid token payload');
      }

      // Verify issuer (should be LINE)
      if (!payload.iss.includes('line.biz')) {
        throw new Error('Invalid token issuer');
      }

      // Verify expiration
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token expired');
      }

      return payload;
    } catch (error) {
      console.error('Failed to decode LINE ID token:', error);
      return null;
    }
  }

  private async generateSupabaseJWT(payload: any): Promise<string> {
    // Get the JWT secret from Supabase
    const jwtSecret = this.configService.get<string>('SUPABASE_JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('Supabase JWT secret not configured');
    }

    return this.jwtService.signAsync(payload, {
      secret: jwtSecret,
    });
  }

  private generateRefreshToken(userId: string): string {
    // Generate a simple refresh token (in production, use a more secure method)
    return Buffer.from(`refresh_${userId}_${Date.now()}`).toString('base64');
  }

  async validateUser(userId: string) {
    try {
      const { data: profile, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        return null;
      }

      return profile;
    } catch (error) {
      console.error('Validate user error:', error);
      return null;
    }
  }

  async refreshToken(userId: string) {
    try {
      const profile = await this.validateUser(userId);
      if (!profile) {
        throw new Error('User not found');
      }

      const payload = {
        sub: profile.id,
        line_user_id: profile.line_user_id,
        email: profile.email,
      };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  }

  async getUserProfile(userId: string) {
    try {
      const { data: profile, error } = await this.supabase
        .from('profiles')
        .select(
          `
          *,
          trust_events(count),
          group_members(
            id,
            sharing_groups(
              id,
              title,
              category_id,
              categories(name, icon)
            )
          )
        `,
        )
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      return profile;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, updateData: Partial<ProfileDto>) {
    try {
      const { data: profile, error } = await this.supabase
        .from('profiles')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return profile;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }

  async signOut(userId: string) {
    try {
      // In Supabase, you would typically handle this client-side
      // But we can log the sign out event for security monitoring
      const { error } = await this.supabase
        .from('user_sessions')
        .update({
          ended_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .is('ended_at', null);

      if (error) {
        console.error('Sign out error:', error);
      }

      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  private async exchangeCodeForToken(code: string): Promise<any> {
    try {
      const lineChannelId = this.configService.get<string>(
        'NEXT_PUBLIC_LINE_CHANNEL_ID',
      );
      const lineChannelSecret = this.configService.get<string>(
        'LINE_CHANNEL_SECRET',
      );

      if (!lineChannelId || !lineChannelSecret) {
        throw new Error('LINE channel credentials not configured');
      }

      const redirectUri = this.configService.get<string>(
        'LINE_LIFF_REDIRECT_URI',
        'https://1crzn970-3000.asse.devtunnels.ms/',
      );

      const response = await fetch('https://api.line.me/oauth2/v2.1/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: lineChannelId,
          client_secret: lineChannelSecret,
          code_verifier: 'W6j9b1r8S3v8Q2yF5hX6k3R7zN2mP1cJ', // This should match the code_challenge from login
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to exchange code for token: ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error;
    }
  }

  private async getLINEProfile(accessToken: string): Promise<LineProfileDto> {
    try {
      const response = await fetch('https://api.line.me/v2/profile', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get LINE profile: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        userId: data.userId,
        displayName: data.displayName,
        pictureUrl: data.pictureUrl,
        statusMessage: data.statusMessage,
      };
    } catch (error) {
      console.error('Get LINE profile error:', error);
      throw error;
    }
  }
}
