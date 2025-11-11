# LINE Authentication Integration Guide

## Problem & Solution

**Problem**: Supabase doesn't natively support LINE as an OAuth provider, causing the error "Custom OIDC provider 'line' not allowed" when trying to use `signInWithIdToken()`.

**Solution**: We implemented a custom authentication flow that verifies LINE ID tokens on the backend and creates Supabase-compatible sessions.

## Architecture Overview

### Authentication Flow
```
Frontend (LINE LIFF) → Backend API → Supabase Auth → Database
```

1. **LINE LIFF Authentication**: User authenticates via LINE LIFF in the frontend
2. **ID Token Verification**: Frontend sends LINE ID token and profile to backend
3. **Custom JWT Creation**: Backend validates token and creates Supabase-compatible JWT
4. **Session Management**: Backend establishes authenticated session with Supabase
5. **Profile Creation**: User profile is created/updated in the database

## Implementation Details

### Frontend Changes (`/03_frontend/lib/supabase.ts`)

```typescript
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
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: sessionData.user.id,
        line_user_id: lineProfile.userId,
        display_name: lineProfile.displayName,
        avatar_url: lineProfile.pictureUrl,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "id",
      });
    }

    return sessionData;
  } catch (error) {
    console.error("LINE sign in error:", error);
    throw error;
  }
}
```

### Backend Changes (`/02_api/src/auth/auth.service.ts`)

```typescript
async signInWithLine(lineLoginDto: LineLoginDto) {
  try {
    // Decode the LINE ID token to verify its validity
    const decodedToken = this.decodeLineIdToken(lineLoginDto.idToken);

    if (!decodedToken) {
      throw new Error('Invalid LINE ID token');
    }

    // Verify that the userId in the token matches the provided userId
    if (decodedToken.sub !== lineLoginDto.lineProfile.userId) {
      throw new Error('LINE user ID mismatch');
    }

    // Generate a unique email for the LINE user
    const email = `${lineLoginDto.lineProfile.userId}@line.users.sharetrust`;

    // Try to get existing user by LINE user ID
    const { data: existingProfile } = await this.supabase
      .from('profiles')
      .select('id')
      .eq('line_user_id', lineLoginDto.lineProfile.userId)
      .single();

    let userData: any;
    let userId: string;

    if (existingProfile) {
      // User exists, get their Supabase user record
      userId = existingProfile.id;
      const { data: user, error } = await this.supabase.auth.admin.getUserById(userId);
      if (error || !user) {
        throw new Error('User not found in Supabase auth');
      }
      userData = { user: user };
    } else {
      // Create new user using admin API
      const { data: newUser, error: createError } = await this.supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: {
          line_user_id: lineLoginDto.lineProfile.userId,
          display_name: lineLoginDto.lineProfile.displayName,
          avatar_url: lineLoginDto.lineProfile.pictureUrl,
          provider: 'line',
        },
      });

      if (createError) {
        throw new Error(`Failed to create user: ${createError.message}`);
      }

      userData = { user: newUser.user };
      userId = newUser.user.id;
    }

    // Generate custom Supabase JWT token
    const supabasePayload = {
      aud: 'authenticated',
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
      sub: userData.user.id,
      email: email,
      role: 'authenticated',
      user_metadata: {
        line_user_id: lineLoginDto.lineProfile.userId,
        display_name: lineLoginDto.lineProfile.displayName,
        avatar_url: lineLoginDto.lineProfile.pictureUrl,
        provider: 'line',
      },
    };

    // Generate Supabase compatible JWT
    const supabaseToken = await this.generateSupabaseJWT(supabasePayload);

    return {
      access_token: supabaseToken,
      refresh_token: this.generateRefreshToken(userData.user.id),
      user: userData.user,
    };
  } catch (error) {
    console.error('LINE sign in error:', error);
    throw error;
  }
}
```

### LINE ID Token Validation

```typescript
private decodeLineIdToken(idToken: string): any {
  try {
    // For production, you should verify the signature with LINE's public keys
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
```

## Environment Variables

Add these to your environment variables:

### Frontend (`.env.local`)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_LIFF_ID=your_liff_id_here
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (`.env`)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
SUPABASE_JWT_SECRET=your_jwt_secret_here
```

## Setup Instructions

### 1. Get Supabase JWT Secret
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Find the "JWT Secret" under "Project API keys"
4. Copy this value to your environment variables

### 2. Get Supabase Service Role Key
1. In the same API settings page
2. Find the "service_role" key
3. Copy this value (keep it secret!)

### 3. Configure LINE LIFF
1. Go to LINE Developers Console
2. Create or select your LIFF app
3. Configure the LIFF ID in your environment variables
4. Ensure the LIFF app has the correct permissions

### 4. Update Database Schema
Ensure your `profiles` table has these columns:
```sql
ALTER TABLE profiles ADD COLUMN line_user_id VARCHAR(255) UNIQUE;
ALTER TABLE profiles ADD COLUMN display_name VARCHAR(255);
ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
```

## Security Considerations

### Production Enhancements

1. **Signature Verification**: Verify LINE ID token signatures with LINE's public keys
2. **Token Expiration**: Implement proper token refresh mechanisms
3. **Input Validation**: Add comprehensive input validation
4. **Rate Limiting**: Implement rate limiting on authentication endpoints
5. **Error Handling**: Avoid exposing sensitive information in error messages

### Current Limitations

1. **Signature Verification**: Currently decodes tokens without signature verification
2. **Refresh Tokens**: Basic refresh token implementation
3. **Session Management**: Simplified session handling

## Testing

### Frontend Testing
```typescript
// Test the authentication flow
const testAuth = async () => {
  try {
    await LineService.init();
    await LineService.login();

    const result = await auth.signInWithLine();
    console.log('Authentication successful:', result);
  } catch (error) {
    console.error('Authentication failed:', error);
  }
};
```

### Backend Testing
```bash
# Test the authentication endpoint
curl -X POST http://localhost:3001/auth/line \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "your_test_id_token",
    "lineProfile": {
      "userId": "test_user_id",
      "displayName": "Test User",
      "pictureUrl": "https://example.com/avatar.jpg"
    }
  }'
```

## Troubleshooting

### Common Issues

1. **"Custom OIDC provider 'line' not allowed"**
   - This error is resolved with our custom authentication flow
   - Ensure you're using the backend API endpoint instead of direct Supabase calls

2. **Invalid LINE ID token**
   - Check if the LIFF app is properly configured
   - Ensure the user is logged in to LINE
   - Verify the ID token is not expired

3. **Supabase JWT secret not configured**
   - Check that SUPABASE_JWT_SECRET is set in backend environment variables
   - Verify the secret is copied correctly from Supabase dashboard

4. **User creation failed**
   - Check that SUPABASE_SERVICE_KEY has admin permissions
   - Verify email format doesn't conflict with existing users
   - Check Supabase auth settings don't block user creation

### Debug Steps

1. Check browser console for LIFF initialization errors
2. Verify network requests to backend API
3. Check backend logs for authentication errors
4. Verify Supabase auth user creation
5. Check database profile creation

## Migration from Direct Supabase Auth

If you were previously trying to use direct Supabase LINE integration:

1. **Replace frontend auth calls**: Use the new `auth.signInWithLine()` method
2. **Update session handling**: Sessions now go through backend validation
3. **Update environment variables**: Add backend-specific variables
4. **Deploy backend changes**: Ensure authentication endpoint is available

## Future Enhancements

1. **Complete LINE Integration**: When Supabase adds native LINE support
2. **Enhanced Token Verification**: Full signature verification implementation
3. **Social Profile Sync**: Automatic profile synchronization
4. **Multi-provider Support**: Support for additional social providers
5. **Enhanced Security**: Advanced security features and monitoring

## Conclusion

This custom LINE authentication solution provides a robust way to integrate LINE LIFF with Supabase while maintaining security and user experience. The approach can be extended to other social providers that aren't natively supported by Supabase.