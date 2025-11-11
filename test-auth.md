# LINE Authentication Testing Guide

## Prerequisites

Before testing, ensure you have:

1. **Environment Variables Set**:
   ```bash
   # Frontend
   NEXT_PUBLIC_SUPABASE_URL=https://cmmlkaovherqbcwfmlju.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   NEXT_PUBLIC_LIFF_ID=2008451153-5ebQ8Zee
   NEXT_PUBLIC_API_URL=http://localhost:3001

   # Backend
   SUPABASE_JWT_SECRET=your_jwt_secret_here
   SUPABASE_SERVICE_KEY=your_service_role_key_here
   ```

2. **Backend Server Running**:
   ```bash
   cd 02_api
   npm install
   npm run start:dev
   ```

3. **Frontend Server Running**:
   ```bash
   cd 03_frontend
   npm install
   npm run dev
   ```

## Testing Steps

### 1. LIFF Initialization Test

Open browser console on your frontend and test:

```javascript
// Test LIFF initialization
import { LineService } from './lib/line';

try {
  await LineService.init();
  console.log('✅ LIFF initialized successfully');
  console.log('Is in LINE client:', LineService.isInClient());
  console.log('Is logged in:', await LineService.isLoggedIn());
} catch (error) {
  console.error('❌ LIFF initialization failed:', error);
}
```

### 2. LINE Login Test

```javascript
// Test LINE login
try {
  await LineService.login();
  console.log('✅ LINE login successful');

  const profile = await LineService.getProfile();
  console.log('📱 LINE Profile:', profile);

  const idToken = await LineService.getIDToken();
  console.log('🔑 ID Token received:', idToken ? 'Yes' : 'No');

  const decodedToken = await LineService.getDecodedIDToken();
  console.log('🔓 Decoded Token:', decodedToken);
} catch (error) {
  console.error('❌ LINE login failed:', error);
}
```

### 3. Backend API Test

Test the backend authentication endpoint:

```javascript
// Test backend LINE authentication
import { auth } from './lib/supabase';

try {
  const result = await auth.signInWithLine();
  console.log('✅ Backend authentication successful');
  console.log('👤 User:', result.user);
  console.log('🔐 Session established');
} catch (error) {
  console.error('❌ Backend authentication failed:', error);
}
```

### 4. Manual Backend API Test

```bash
# Test the API endpoint directly
curl -X POST http://localhost:3001/auth/line \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "your_test_token_here",
    "lineProfile": {
      "userId": "test_user_123",
      "displayName": "Test User",
      "pictureUrl": "https://example.com/avatar.jpg"
    }
  }'
```

### 5. Supabase Session Test

```javascript
// Test Supabase session after authentication
import { supabase } from './lib/supabase';

// Check current session
const { data: { session }, error } = await supabase.auth.getSession();
if (session) {
  console.log('✅ Supabase session active');
  console.log('👤 User ID:', session.user.id);
  console.log('📧 Email:', session.user.email);
  console.log('🔑 Access Token:', session.access_token ? 'Present' : 'Missing');
} else {
  console.log('❌ No active Supabase session');
}

// Test database access
const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('*')
  .eq('line_user_id', 'your_line_user_id')
  .single();

if (profile) {
  console.log('✅ Profile found in database:', profile);
} else {
  console.log('❌ Profile not found:', profileError);
}
```

## Expected Results

### Successful Authentication Flow:
1. ✅ LIFF initializes correctly
2. ✅ User can log in with LINE
3. ✅ LINE profile and ID token are retrieved
4. ✅ Backend API validates the token
5. ✅ Supabase user is created/found
6. ✅ Custom JWT token is generated
7. ✅ Supabase session is established
8. ✅ Profile is created/updated in database

### Error Scenarios to Test:
- ❌ Invalid LIFF ID
- ❌ User not logged in to LINE
- ❌ Invalid/expired ID token
- ❌ Backend server not running
- ❌ Missing environment variables
- ❌ Invalid Supabase credentials

## Troubleshooting

### Common Issues and Solutions:

1. **LIFF Initialization Fails**:
   - Check LIFF_ID is correct
   - Ensure HTTPS (use ngrok for local development)
   - Verify LIFF app configuration in LINE Developer Console

2. **LINE Login Fails**:
   - User might need to grant permissions
   - Check redirect URL configuration
   - Verify LIFF app permissions

3. **Backend Authentication Fails**:
   - Check backend server is running on port 3001
   - Verify environment variables are set
   - Check Supabase service role key permissions

4. **Database Issues**:
   - Verify `profiles` table exists
   - Check RLS policies allow user creation
   - Verify Supabase admin permissions

5. **JWT Token Issues**:
   - Verify JWT secret is correctly copied from Supabase
   - Check token expiration settings
   - Ensure service role key has admin permissions

## Debug Commands

### Check Environment Variables:
```bash
# Frontend
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_LIFF_ID
echo $NEXT_PUBLIC_API_URL

# Backend
echo $SUPABASE_JWT_SECRET
echo $SUPABASE_SERVICE_KEY
```

### Check Server Status:
```bash
# Backend
curl http://localhost:3001

# Frontend
curl http://localhost:3000
```

### Database Verification:
```sql
-- Check profiles table
SELECT * FROM profiles WHERE line_user_id IS NOT NULL;

-- Check auth.users table
SELECT * FROM auth.users WHERE email LIKE '%@line.users.sharetrust';
```

## Performance Monitoring

Monitor these metrics during testing:

1. **Authentication Response Time**: Should be < 2 seconds
2. **LIFF Initialization Time**: Should be < 1 second
3. **Database Query Time**: Should be < 500ms
4. **JWT Token Generation**: Should be < 100ms

## Next Steps

After successful testing:

1. **Deploy to Production**: Update environment variables for production
2. **Enable HTTPS**: Use SSL certificates for production
3. **Add Monitoring**: Implement error tracking and performance monitoring
4. **Security Audit**: Review security measures and implement enhancements
5. **Load Testing**: Test with multiple concurrent users

## Support

If you encounter issues:

1. Check browser console for JavaScript errors
2. Check backend logs for server errors
3. Verify Supabase configuration
4. Review LINE Developer Console settings
5. Check this guide for common solutions