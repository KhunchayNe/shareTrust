# LINE LIFF Setup Guide for ShareTrust

This guide walks you through setting up LINE LIFF for the ShareTrust application, including resolving common 400 errors and development configuration.

## 🚨 Current Issues & Solutions

### Problem: HTTP 400 Error on LIFF Initialization
**Symptoms:**
- `channel not found` error
- 400 Bad Request from LINE API
- LIFF initialization fails immediately

**Root Causes:**
1. ❌ Using `http://localhost` instead of HTTPS
2. ❌ LIFF app not properly configured in LINE Developer Console
3. ❌ Endpoint URL mismatch
4. ❌ Missing or incorrect LIFF ID

## 🛠️ Step-by-Step Solution

### 1. LINE Developer Console Setup

1. **Go to LINE Developers Console**: https://developers.line.biz/console/
2. **Select or create a provider/channel**
3. **Enable LINE Login**:
   - Go to "LINE Login" tab
   - Click "Enable LINE Login"
   - Set app type to "Web app"
4. **Configure LIFF App**:
   - Go to "LIFF" tab
   - Click "Add"
   - **LIFF App Settings**:
     ```
     LIFF App Name: ShareTrust
     LIFF App Size: Full
     Endpoint URL: https://your-secure-url.com  (from ngrok/localtunnel)
     Scope: profile, openid, email
     Bot Linkage: Off (optional)
     ```

### 2. Get Your LIFF Credentials

From LINE Developer Console, note:
- **Channel ID** (e.g., 2008451153)
- **LIFF ID** (e.g., 2008451153-5ebQ8Zee)
- **Channel Secret** (keep secret)

### 3. Local Development Setup

**Option A: Using ngrok (Recommended)**
```bash
# Install ngrok
npm install -g ngrok

# Start your frontend
cd 03_frontend
npm run dev

# In another terminal, start ngrok
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
```

**Option B: Using localtunnel**
```bash
# Install localtunnel
npm install -g localtunnel

# Start your frontend
cd 03_frontend
npm run dev

# In another terminal, start localtunnel
lt --port 3000

# Copy the HTTPS URL
```

**Option C: Automated Setup Script**
```bash
# Use our provided script
cd 03_frontend
./scripts/setup-liff-dev.sh
```

### 4. Environment Configuration

Create `.env.local` in `/03_frontend/`:

```env
# LINE LIFF Configuration
NEXT_PUBLIC_LIFF_ID=2008451153-5ebQ8Zee
NEXT_PUBLIC_LINE_CHANNEL_ID=2008451153
NEXT_PUBLIC_LINE_BOT_ID=your_bot_user_id

# Development URL (from ngrok/localtunnel)
NEXT_PUBLIC_DEV_URL=https://abc123.ngrok.io

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 5. Update LINE Developer Console

1. Go back to LINE Developer Console
2. Edit your LIFF app
3. Update **Endpoint URL** with your HTTPS tunnel URL:
   ```
   Endpoint URL: https://abc123.ngrok.io
   ```
4. Save changes
5. **Wait 1-2 minutes** for changes to propagate

### 6. Test Your LIFF App

1. **Start your development server**:
   ```bash
   cd 03_frontend
   npm run dev
   ```

2. **Access via tunnel URL**:
   Open `https://abc123.ngrok.io` in your browser

3. **Enable debug panel** (optional):
   Add this to any component to see LIFF debug info:
   ```tsx
   import { LiffDebug } from "@/components/LiffDebug";

   // In your component
   <LiffDebug />
   ```

## 🔍 Debugging Common Issues

### Issue: "channel not found"
- **Cause**: Invalid LIFF ID or channel not properly configured
- **Solution**:
  1. Verify LIFF ID matches LINE Developer Console
  2. Ensure channel is active
  3. Check that LINE Login is enabled

### Issue: "Failed to fetch" or network errors
- **Cause**: Using HTTP instead of HTTPS
- **Solution**:
  1. Always use HTTPS URLs
  2. Use ngrok/localtunnel for local development
  3. Check firewall/antivirus blocking

### Issue: "Invalid endpoint URL"
- **Cause**: Endpoint URL doesn't match LIFF configuration
- **Solution**:
  1. Update Endpoint URL in LINE Developer Console
  2. Ensure URL matches exactly (no trailing slashes unless specified)
  3. Wait for propagation (1-2 minutes)

### Issue: LIFF works in LINE app but not in browser
- **Cause**: External browser configuration missing
- **Solution**:
  1. Set `withLoginOnExternalBrowser: true` in LIFF init
  2. Ensure redirect URI is HTTPS
  3. Check OAuth redirect URIs in LINE Login settings

## 📱 Testing Scenarios

### 1. In LINE App (Primary)
- Open LINE > Add friend > Search for your LINE Official Account
- Tap the LIFF app link
- Should initialize immediately

### 2. In External Browser (Secondary)
- Open the tunnel URL directly in browser
- Should prompt for LINE login
- Redirect back after authentication

### 3. Mobile Testing
- Test on both iOS and Android
- Check behavior in different browsers
- Verify login flow works end-to-end

## 🛡️ Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure proper CORS settings in your backend
4. **Token Security**: Handle access tokens securely
5. **Validation**: Validate LIFF ID tokens on your backend

## 🚀 Production Deployment

1. **Domain Setup**: Use a custom domain with valid SSL certificate
2. **CORS Configuration**: Update LINE Developer Console with production URL
3. **Environment Variables**: Set production values securely
4. **Monitoring**: Monitor LIFF initialization success rates
5. **Fallback**: Provide fallback for when LIFF is unavailable

## 🔧 Advanced Configuration

### Custom LIFF Features
Enable additional features in LINE Developer Console:
- `chat_message.write`: Send messages to users
- `profile`: Access user profile information
- `openid`: OpenID Connect authentication

### Scopes Configuration
```
Required Scopes:
- profile: Basic user profile
- openid: OpenID Connect
- email: User email (optional)

Optional Scopes:
- chat_message.write: Send messages
```

### Bot Integration (Optional)
If you want to send messages to users:
1. Create a LINE Bot in your channel
2. Add `chat_message.write` scope
3. Use messaging API to send notifications

## 📞 Support Resources

- **LINE LIFF Documentation**: https://developers.line.biz/en/reference/liff/
- **LINE Developer Console**: https://developers.line.biz/console/
- **Community Support**: https://www.line-community.me/
- **Issue Tracking**: Check browser console for detailed error messages

## 🎯 Quick Troubleshooting Checklist

- [ ] HTTPS URL is being used
- [ ] LIFF ID is correct and matches console
- [ ] Endpoint URL is updated in LINE Developer Console
- [ ] Channel is active and LINE Login is enabled
- [ ] Waiting for propagation (1-2 minutes)
- [ ] Environment variables are properly set
- [ ] No firewall/antivirus blocking
- [ ] Browser console shows no network errors
- [ ] Testing in both LINE app and external browser

## 📝 Next Steps

1. ✅ Complete the setup using this guide
2. ✅ Test LIFF initialization with debug panel
3. ✅ Implement user authentication flow
4. ✅ Add error handling for edge cases
5. ✅ Deploy to production with proper SSL

This should resolve your HTTP 400 LIFF initialization error and provide a solid foundation for LINE integration in ShareTrust.