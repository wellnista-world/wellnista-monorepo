# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wellnista AI (formerly NubSook / นับสุข, rebranded 2026-09-24) is a Progressive Web App for personal nutrition and wellness tracking. Built with Next.js 16 App Router, it provides health tracking (BMI, blood pressure, mental health), food analysis via AI, barcode scanning, and e-commerce features.

**Production URL:** https://app.wellnista.world

## Development Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build
npm run lint     # ESLint (flat config; `next lint` was removed in Next 16)
npm test         # Vitest in watch mode
npm run test:run # Vitest once (CI)
npm start        # Start production server
```

## Testing

Vitest + jsdom + React Testing Library (`vitest.config.mts`, `vitest.setup.ts`). Tests live in
`__tests__` folders next to the code they cover and use explicit `vitest` imports (no globals):

- `app/lib/utils/__tests__/nutritionCalculator.test.ts` - Harris-Benedict BMR/TDEE, carb math, validation
- `app/lib/utils/__tests__/cartUtils.test.ts` - per-user localStorage carts, merge, totals
- `config/__tests__/config.test.ts` - product catalogue integrity + localisation, country codes, feature flags
- `i18n/__tests__/i18n.test.tsx` - I18nProvider (default/stored locale, fallback to Thai, `{param}`
  interpolation) and catalogue checks: every English key has a Thai fallback (since `t()` falls back
  to Thai before returning the raw key) and every locale has every key Thai has, so a new string must
  be added to all six files.

## Tech Stack

- **Framework:** Next.js 16 with App Router (React 19). `next build --webpack` because next-pwa hooks into webpack; `next dev` runs on Turbopack with the PWA plugin skipped.
- **Styling:** Material-UI 9 (slotProps API: `slotProps.input` / `htmlInput` / `inputLabel` / `paper` instead of the removed `InputProps` / `inputProps` / `InputLabelProps` / `PaperProps`) + Tailwind CSS 4 (theme lives in `app/globals.css` `@theme`; there is no tailwind.config.ts)
- **Database/Auth:** Supabase (PostgreSQL)
- **Payments:** Stripe (checkout redirects to the hosted Checkout Session `url`; Stripe.js `redirectToCheckout` no longer exists)
- **AI:** OpenAI for food analysis and menu recommendations
- **Platform Integration:** LINE LIFF for LINE app features
- **Barcode Scanning:** ZXing (`@zxing/library`, used by `app/scan`). Quagga2, `@zxing/browser` and the barcode-detector polyfill were unused and removed 2026-09-23.

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

### Theme (Wellnista AI, dark)

Design tokens live in `app/globals.css` `@theme` and are mirrored in `app/theme.ts` (MUI dark
palette). Canvas `#0a0e0b` with a deep-green radial glow, cards `#151b16` (`.wa-card`), raised
`#1e2721`, text `#f1f5ee` / muted `#9aa69c`, accent lime `#cdf565` → mint `#7fe7b6`
(`.wa-gradient`, `.wa-gradient-text`). Font: Kanit.

The legacy Tailwind names (`primary` / `secondary` / `accent` / `neutral` / `muted`) are
**remapped** to these tokens, and an unlayered "compat layer" at the bottom of `globals.css`
repaints `bg-white`, `text-gray-*`, `border-gray-*` inside `main` onto the dark surfaces, so
screens that have not been rebuilt yet still look coherent. Rebuilt so far: layout header,
`TabBar` (floating bar with the AI scan action raised in the middle), `home`, `select`,
`scan/scan-image` (macro rings via `components/ui/RingGauge`), `IndicatorRow`, `IntroductionStatus`.
Helper classes: `.wa-card`, `.wa-chip`, `.wa-chip--active`, `.wa-iconwell`, `.wa-btn`
(`--ghost`, `--danger`), `.wa-eyebrow`. New screens should use these instead of MUI layout.

**Light theme.** `ThemeModeProvider` (`app/lib/context/ThemeModeContext.tsx`) owns the
preference (`dark` / `light` / `system`, localStorage key `wellnista-theme`, default dark), sets
`data-theme` on `<html>`, keeps the `theme-color` meta in sync and hands MUI the matching palette
from `createAppTheme(mode)`. The CSS tokens are overridden under `:root[data-theme="light"]` in
`globals.css`; because Tailwind v4 utilities read the variables, every screen and the compat
layer re-skin automatically. In light mode the accent used for text/icons darkens for contrast
(`--color-lime` → `#3f7a0b`) while gradient fills keep the bright lime→mint via
`--color-lime-fill` / `--color-mint-fill`. A bootstrap script (`THEME_BOOTSTRAP_SCRIPT` in
`app/lib/theme-mode.ts`, inlined in `<head>`) applies the stored theme before first paint. UI:
sun/moon button in the header (`toggle()`), and a Dark / Light / System control on Settings
(`components/ThemeSwitcher.tsx`). Pure helpers are unit-tested in `app/lib/__tests__/theme-mode.test.ts`.

## Key Integration Points

### Supabase

Client initialized in `app/lib/api/supabase.ts`. Tables include:
- `bmi_tracking` - BMI records
- `blood_pressure_tracking` - BP readings
- `mental_health_tracking` - Mental health entries

### OpenAI

Used for food analysis (`/api/analyze-food`) and menu recommendations (`/api/menu-recommendation`).

- `openai` v7 requires **Node.js 22**; `package.json` `engines.node` is `>=22` so Vercel picks a
  matching runtime.
- `/api/analyze-food` returns `null` only when the model says the picture is not food. Configuration,
  API and parsing failures come back as an error response with a `code` (`not_configured`,
  `openai_error`, `bad_response`) and the scan page shows the reason (e.g. OpenAI credits
  exhausted) instead of "no food data found". Before 2026-09-23 every failure was swallowed into
  `null`, which is how an `insufficient_quota` 429 showed up as "ไม่พบข้อมูลอาหาร".
- The vision model is `OPENAI_FOOD_MODEL` (default `gpt-4o`), overridable without a deploy.
- `parseFoodAnalysis()` is pure and unit-tested (`app/lib/api/__tests__/analyze-food.test.ts`).
- The scan page downscales the captured frame to 1280px JPEG (q=0.85) before upload so phone
  photos stay under Vercel's 4.5 MB request limit.

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

`next-pwa` 5.6 is unmaintained and its `workbox-build` chain depends on a vulnerable
`serialize-javascript` (build-time only, GHSA-5c6j-r48x-rmvq). `package.json` `overrides` pins
`serialize-javascript` to `^7.1.1`, which brings `npm audit` to 0 and still generates `public/sw.js`.
The maintained fork `@ducanh2912/next-pwa` (last release 2024) has the same chain, so switching
would not help; Serwist (`@serwist/next`) is the long-term replacement if the plugin ever breaks.
