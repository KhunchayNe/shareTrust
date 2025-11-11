# ShareTrust Development Guide

ShareTrust is a LINE-integrated account sharing platform with trust scoring, escrow system, and fraud detection capabilities. This guide helps Claude instances understand the architecture and be productive quickly.

## Project Overview

**ShareTrust** enables safe subscription sharing through:
- LINE LIFF authentication for user onboarding
- Trust scoring system based on transaction history
- Escrow payment handling (PromptPay/Stripe)
- AI-powered fraud detection
- PostgreSQL backend via Supabase

## Architecture

### Directory Structure
```
/Users/siwapan/dev/sandbox/ai_projects/shareTrust/
├── 01_supabase/           # Database schema and types
├── 02_api/               # NestJS backend API
├── 03_frontend/          # Next.js frontend with LINE LIFF
├── .env.example          # Environment configuration template
└── overview.md           # System specifications
```

### Technology Stack
- **Frontend**: Next.js 16, TypeScript, Tailwind CSS, LINE LIFF SDK
- **Backend**: NestJS, TypeScript, Supabase integration
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: LINE Login + Supabase Auth + JWT
- **Payment**: PromptPay + Stripe integration
- **AI/ML**: OpenAI/Gemini for fraud detection

## Development Workflows

### Frontend Development
```bash
cd /Users/siwapan/dev/sandbox/ai_projects/shareTrust/03_frontend
npm install
npm run dev          # Development server on http://localhost:3000
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
```

### Backend Development
```bash
cd /Users/siwapan/dev/sandbox/ai_projects/shareTrust/02_api
npm install
npm run start:dev    # Development with hot reload (port 3001)
npm run build        # Production build
npm run start:prod   # Production mode
npm run test         # Unit tests
npm run test:e2e     # End-to-end tests
npm run lint         # ESLint
```

### Database Setup
1. Create Supabase project
2. Apply schema from `/Users/siwapan/dev/sandbox/ai_projects/shareTrust/01_supabase/schema.sql`
3. Configure LINE OAuth provider in Supabase dashboard
4. Set up RLS policies (already included in schema)

## Authentication Architecture

### LINE LIFF Integration
The app uses LINE Front-end Framework (LIFF) for authentication:

**Flow:**
1. User opens app in LINE chat → LIFF initialization
2. LINE login via `@line/liff` SDK
3. ID token verification with Supabase
4. JWT token generation for API access
5. Profile creation in `profiles` table

**Key Files:**
- `/Users/siwapan/dev/sandbox/ai_projects/shareTrust/03_frontend/lib/line.ts` - LINE LIFF wrapper
- `/Users/siwapan/dev/sandbox/ai_projects/shareTrust/03_frontend/lib/supabase.ts` - Auth integration
- `/Users/siwapan/dev/sandbox/ai_projects/shareTrust/03_frontend/contexts/AuthContext.tsx` - React auth context
- `/Users/siwapan/dev/sandbox/ai_projects/shareTrust/02_api/src/auth/auth.service.ts` - Backend auth handling

### Environment Setup
Required environment variables (see `/Users/siwapan/dev/sandbox/ai_projects/shareTrust/.env.example`):
```
NEXT_PUBLIC_LIFF_ID=your_liff_id_here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Database Schema

### Core Tables

**profiles** - User accounts extending Supabase auth.users
- Links LINE user ID to Supabase auth
- Trust metrics (trust_score, trust_level, is_verified)
- Verification data (encrypted JSONB)

**sharing_groups** - Subscription sharing posts
- Categories (Streaming 🎬, AI Tools 🧠, Gaming 🎮, Software 💼)
- Escrow status tracking
- Member limits and pricing

**transactions** - Payment and escrow records
- Multi-currency support (THB default)
- Payment method tracking (promptpay, stripe)

**trust_events** - Trust score changes
- Automatic score updates via database triggers
- Reference tracking for audit trails

**verifications** - Identity verification
- Phone, ID card, PromptPay verification
- Admin approval workflow

### Key Relationships
```
profiles (1:N) sharing_groups (creator)
profiles (N:M) sharing_groups (members via group_members)
sharing_groups (1:N) transactions
profiles (1:N) trust_events
profiles (1:N) verifications
```

### Database Triggers
- `update_trust_score()` - Automatically recalculates trust scores
- `update_group_members()` - Maintains current member counts

### Row Level Security (RLS)
- Public read access to active sharing groups
- Verified users can create groups
- Group members can access group messages
- Admin access to reports and sensitive data

## Trust Scoring System

### Score Calculation
Trust scores are calculated automatically based on:
- **Positive events**: Successful transactions, verifications, group completions
- **Negative events**: Failed payments, reports, rule violations
- **Neutral events**: Profile updates, group joins

### Trust Levels
- Level 1: 0-4 points (New user)
- Level 2: 5-19 points (Basic trust)
- Level 3: 20-49 points (Established)
- Level 4: 50-99 points (Trusted)
- Level 5: 100+ points (Highly trusted)

### Badges System
User badges stored in `user_badges` table:
- ✅ Verified - Identity confirmed
- 🔒 Trusted 50+ - High trust score
- 🧭 Safe Partner - No violations

## Escrow System Design

### Payment Flow
1. User joins sharing group → Payment initiated
2. Funds held in escrow (PromptPay/Stripe)
3. Group reaches required members → Funds released to creator
4. Insufficient members/timeline expires → Automatic refund

### Escrow Statuses
- `pending` - Waiting for payments
- `funded` - All payments received
- `released` - Funds distributed
- `refunded` - Payments returned

### Integration Points
- **PromptPay**: Thai QR code payment system
- **Stripe**: International payment processing
- **Webhooks**: Payment status notifications

## Security Considerations

### Authentication Security
- LINE ID token verification
- JWT with configurable expiration (default 7d)
- Secure session management via Supabase
- RLS policies for data access control

### Data Protection
- Encrypted verification data in JSONB
- Environment-based configuration
- CORS restrictions for frontend domains
- SQL injection prevention via parameterized queries

### Fraud Detection
- AI message analysis for suspicious patterns
- Cross-reference duplicate information
- Automated risk scoring (0-100)
- Admin review workflow for flagged content

### Payment Security
- Escrow system prevents direct fund transfers
- Payment reference tracking
- Webhook signature verification
- Automatic refund mechanisms

## API Architecture

### NestJS Structure
```
src/
├── auth/                 # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/       # JWT strategy
│   └── guards/          # Auth guards
├── config/              # Configuration files
└── app.module.ts        # Root module
```

### API Patterns
- RESTful endpoints with `/api` prefix
- JWT-based authentication
- DTO validation with class-validator
- Error handling with NestJS filters
- CORS enabled for frontend

### Key Endpoints
- `POST /api/auth/line` - LINE authentication
- `GET /api/auth/profile` - User profile data
- `POST /api/auth/refresh` - Token refresh
- `PUT /api/auth/profile` - Profile updates

## Key Architectural Patterns

### Context-Based State Management
- React Context for authentication state
- Real-time auth state synchronization
- Profile data caching and refresh

### Service Layer Pattern
- `LineService` - LINE LIFF operations
- `AuthService` - Authentication logic
- `SupabaseService` - Database operations

### Event-Driven Trust Updates
- Database triggers for trust score updates
- Automatic level calculation
- Audit trail via trust_events

### Multi-Tenant Data Access
- Row Level Security for data isolation
- User-scoped query filtering
- Admin override capabilities

## Testing Strategy

### Frontend Testing
- Component testing with Jest/React Testing Library
- LIFF mocking for authentication flows
- Supabase auth mocking

### Backend Testing
- Unit tests for services and controllers
- Integration tests with test database
- E2E tests for authentication flows

### Database Testing
- Schema validation tests
- RLS policy testing
- Trigger functionality tests

## Deployment Considerations

### Frontend Deployment
- Next.js static generation for performance
- Environment-specific configuration
- CDN optimization for LINE LIFF assets

### Backend Deployment
- NestJS production optimizations
- Environment configuration management
- Database connection pooling

### Monitoring
- Authentication event logging
- Payment transaction monitoring
- AI fraud detection metrics
- Performance tracking

## Common Development Tasks

### Adding New Authentication Provider
1. Configure in Supabase dashboard
2. Add environment variables
3. Update frontend auth context
4. Backend provider integration

### Extending Trust System
1. Add new trust event types
2. Update scoring logic in triggers
3. Extend badge system
4. Update UI components

### New Payment Method Integration
1. Add payment method enum
2. Implement payment service
3. Update webhook handlers
4. Modify escrow logic

### Fraud Detection Enhancement
1. Add AI analysis endpoint
2. Implement message scanning
3. Update risk scoring algorithm
4. Create admin review tools

## Troubleshooting

### Common Issues
- **LIFF initialization failures**: Check LIFF_ID and LINE app configuration
- **Supabase auth errors**: Verify RLS policies and auth configuration
- **CORS issues**: Update allowed origins in NestJS config
- **Database connection**: Check Supabase URL and keys

### Debugging Tips
- Use browser dev tools for LIFF debugging
- Check Supabase logs for RLS policy violations
- Monitor network requests for API errors
- Review database trigger logs

## Performance Optimizations

### Frontend
- Next.js static generation for SEO
- Image optimization with next/image
- Code splitting for LIFF SDK
- Caching for profile data

### Backend
- Database query optimization
- Connection pooling with Supabase
- JWT token caching
- API response compression

### Database
- Optimized indexes for frequent queries
- Efficient RLS policy implementations
- Query result caching where appropriate