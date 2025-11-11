# ShareTrust Frontend

A LINE-integrated subscription sharing platform with trust scoring, escrow payments, and fraud detection capabilities.

## 🎯 Project Overview

ShareTrust enables safe subscription sharing through:

- **LINE LIFF Authentication** - Seamless login via LINE messaging app
- **Trust Scoring System** - Build reputation through successful transactions
- **Escrow Payment Handling** - Secure payments with PromptPay/Stripe integration
- **Fraud Detection** - AI-powered analysis for safe sharing
- **Mobile-First Design** - Optimized for LINE in-app experience

## 🏗️ Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: LINE LIFF SDK
- **Backend**: Supabase (PostgreSQL + Auth)
- **State Management**: React Context
- **Build Tool**: Next.js with Turbopack

## 📱 UI Architecture

### Design System

The application uses a comprehensive design system built with Tailwind CSS:

#### Color Palette

- **Primary**: LINE Green (`#00C300`)
- **Secondary**: Trust Blue (`#0066CC`)
- **Accent**: Orange (`#FF6B35`)
- **Trust Levels**: 5-tier color system from Gray to Amber
- **Escrow Status**: Yellow, Blue, Green, Red for different states

#### Typography

- **Font**: Inter (optimized for readability)
- **Scale**: Responsive sizing from `2xs` to `4xl`
- **Weights**: 400, 500, 600, 700, 800 available

#### Spacing System

- CSS Custom Properties for consistent spacing
- Mobile-first responsive breakpoints
- Safe area insets for iOS devices

### Component Architecture

#### Core UI Components (`/components/ui`)

- **Button** - Multiple variants and sizes
- **Card** - Flexible content containers
- **Input** - Form inputs with validation
- **Modal** - Overlay dialogs
- **Badge** - Status indicators
- **LoadingSpinner** - Loading states

#### Layout Components (`/components/layout`)

- **AppLayout** - Main application wrapper
- **Header** - Navigation headers
- **BottomNavigation** - Mobile navigation
- **Container** - Responsive containers

#### Feature Components

- **Authentication** (`/components/auth`)
  - `LoginButton` - LINE login integration
  - `UserProfile` - User profile display

- **Trust System** (`/components/trust`)
  - `TrustBadge` - Trust level indicators
  - `TrustProgress` - Progress bars
  - `TrustMeter` - Circular progress meters

- **Payment** (`/components/payment`)
  - `EscrowStatus` - Payment status tracking
  - `PaymentMethod` - Payment method selection
  - `QRCodePayment` - PromptPay QR codes

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- LINE Developers account
- Supabase project

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd 03_frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables**

   ```env
   NEXT_PUBLIC_LIFF_ID=your_liff_id_here
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

5. **Run development server**

   ```bash
   npm run dev
   ```

6. **Open in browser**
   Navigate to `http://localhost:3000`

## 📂 Project Structure

```
03_frontend/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and design tokens
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page
│   └── profile/           # Profile page
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   ├── auth/             # Authentication components
│   ├── trust/            # Trust scoring components
│   ├── payment/          # Payment/escrow components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
│   ├── utils.ts          # Helper functions
│   ├── line.ts           # LIFF integration
│   └── supabase.ts       # Database client
├── types/                # TypeScript definitions
│   └── index.ts          # Type definitions
├── public/               # Static assets
├── tailwind.config.ts    # Tailwind configuration
├── next.config.ts        # Next.js configuration
└── package.json          # Dependencies
```

## 🎨 Design Principles

### Mobile-First Design

- Optimized for LINE in-app experience
- Touch-friendly 44px minimum tap targets
- Safe area handling for notched devices
- Gesture support for common actions

### Accessibility

- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard navigation
- High contrast mode support
- Reduced motion preferences

### Performance

- Core Web Vitals optimization
- Lazy loading for images
- Code splitting by route
- Optimized bundle sizes

## 🔧 Configuration

### Tailwind CSS Configuration

Custom theme extensions in `tailwind.config.ts`:

- LINE brand colors
- Trust level color palette
- Escrow status colors
- Responsive typography scale
- Custom animations

### LIFF Configuration

Set up in LINE Developers Console:

1. Create LIFF app
2. Set LIFF ID in environment
3. Configure scopes (profile)
4. Set endpoint URL
5. Enable bot link feature

### Supabase Configuration

1. Create Supabase project
2. Configure LINE OAuth provider
3. Set up database schema
4. Configure Row Level Security (RLS)
5. Set environment variables

## 📱 Responsive Breakpoints

```css
/* Mobile-first approach */
xs: 375px   /* iPhone SE */
sm: 414px   /* iPhone Pro */
md: 768px   /* iPad mini */
lg: 1024px  /* iPad */
xl: 1280px  /* Desktop */
2xl: 1536px /* Large desktop */
```

## 🎯 Key Features

### Authentication Flow

1. LIFF initialization
2. LINE login redirect
3. Profile data retrieval
4. Supabase user creation/update
5. JWT token generation

### Trust Scoring System

- **Level 1** (0-4 pts): New user (Gray)
- **Level 2** (5-19 pts): Basic trust (Yellow)
- **Level 3** (20-49 pts): Established (Blue)
- **Level 4** (50-99 pts): Trusted (Green)
- **Level 5** (100+ pts): Highly trusted (Amber)

### Escrow System

- Payment collection and holding
- Automatic refunds on failure
- Fund release on success
- Status tracking and notifications

## 🔒 Security Considerations

### Authentication

- LINE ID token verification
- Secure session management
- JWT with expiration
- CSRF protection

### Data Protection

- Encrypted verification data
- Environment-based configuration
- Input validation and sanitization
- SQL injection prevention

### Payment Security

- Escrow system prevents direct transfers
- Payment reference tracking
- Webhook signature verification
- Automatic refund mechanisms

## 🧪 Testing

### Component Testing

```bash
npm run test
```

### E2E Testing (Playwright)

```bash
npm run test:e2e
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run type-check
```

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Static Generation

```bash
npm run build:static
```

## 📊 Performance Metrics

Target Core Web Vitals:

- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

## 🔄 CI/CD Integration

### GitHub Actions

- Automated testing on PR
- Build validation
- Type checking
- Linting checks

### Deployment

- Vercel integration
- Environment-specific configs
- Rollback capabilities
- Performance monitoring

## 🤝 Contributing

1. Follow the established code patterns
2. Use TypeScript for all new code
3. Add comprehensive tests
4. Update documentation
5. Follow accessibility guidelines

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For technical support:

1. Check the documentation
2. Review the codebase
3. Check GitHub issues
4. Contact the development team

---

Built with ❤️ for safe subscription sharing
