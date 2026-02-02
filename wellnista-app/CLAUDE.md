# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NubSook (Wellnista) is a Progressive Web App for personal nutrition and wellness tracking. Built with Next.js 15 App Router, it provides health tracking (BMI, blood pressure, mental health), food analysis via AI, barcode scanning, and e-commerce features.

**Production URL:** https://app.wellnista.world

## Development Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build
npm run lint     # ESLint
npm start        # Start production server
```

## Tech Stack

- **Framework:** Next.js 15.2 with App Router (React 19)
- **Styling:** Material-UI 7 + Tailwind CSS
- **Database/Auth:** Supabase (PostgreSQL)
- **Payments:** Stripe
- **AI:** OpenAI for food analysis and menu recommendations
- **Platform Integration:** LINE LIFF for LINE app features
- **Barcode Scanning:** ZXing, Quagga2

## Architecture

### Directory Structure

```
app/
├── api/                    # API routes (serverless functions)
│   ├── analyze-food/       # OpenAI food image analysis
│   ├── analyze-mental-health/
│   ├── menu-recommendation/
│   ├── create-checkout-session/  # Stripe
│   └── webhooks/           # Payment webhooks
├── components/             # Shared React components
├── lib/
│   ├── api/               # API clients (Supabase, LIFF, OpenAI)
│   ├── context/           # React Context providers
│   └── types/             # TypeScript definitions
├── hooks/                 # Custom React hooks
├── [feature-routes]/      # Feature pages (bmi/, blood-pressure/, etc.)
└── layout.tsx             # Root layout with providers

config/                    # App configuration
├── app.ts                 # Branding, metadata
└── featureFlags.ts        # Feature toggles

i18n/                      # Internationalization
└── messages/              # Translations (th, en, zh, ja, ko, id)
```

### State Management

Three React Context providers in `app/lib/context/`:
- **AuthContext** - Supabase authentication state
- **CartContext** - Shopping cart persistence
- **CoinContext** - Rewards/points system

### Feature Flags

Features are controlled via `config/featureFlags.ts`. Use helper functions:

```typescript
import { isBmiTrackingEnabled, isMarketEnabled } from '@/config/featureFlags';

if (isBmiTrackingEnabled()) {
  // render BMI features
}
```

### Internationalization

Six languages supported. Use the `useI18n` hook:

```typescript
import { useI18n } from '@/i18n';

const { t, locale, setLocale } = useI18n();
t('common.save'); // Returns translated string
```

Language preference stored in localStorage (`wellnista-language`).

### Theme

- Primary color: `#9F9260` (warm brown)
- Secondary color: `#FFF4D2` (cream)
- Font: Kanit (Thai-optimized)

Configured in `app/theme.ts` (MUI) and `tailwind.config.ts`.

## Key Integration Points

### Supabase

Client initialized in `app/lib/api/supabase.ts`. Tables include:
- `bmi_tracking` - BMI records
- `blood_pressure_tracking` - BP readings
- `mental_health_tracking` - Mental health entries

### OpenAI

Used for food analysis (`/api/analyze-food`) and menu recommendations (`/api/menu-recommendation`). Client in `app/lib/api/openai.ts`.

### Stripe

Checkout sessions created via `/api/create-checkout-session`. Webhooks handled at `/api/webhooks`.

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
OPENAI_API_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_LIFF_ID
```

## PWA

Service worker configured via `next-pwa`. PWA is disabled in development (`next.config.ts`).
