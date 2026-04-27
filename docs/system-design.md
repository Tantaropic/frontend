# SukukSweep — Frontend System Design

## Overview

SukukSweep is an Arabic-first (RTL), Sharia-compliant micro-investing web application. The frontend is a **pure presentation layer** — all business logic is either mocked or will be handled by a future backend API. The UI communicates trust, calm, and growth through a soft green + warm neutral palette with glassmorphism and Islamic geometric motifs.

---

## Tech Stack

| Layer | Tool | Version | Why |
|-------|------|---------|-----|
| Framework | Next.js | 16.2.x (App Router) | SSR + file-based routing |
| Language | TypeScript | 5.9.x | Type safety across data models |
| Styling | TailwindCSS | 4.2.x | Utility-first, design token support |
| UI Primitives | shadcn/ui | latest | Accessible, unstyled components |
| Animation | Framer Motion | 12.x | Page transitions, card animations |
| Animation | GSAP + @gsap/react | 3.15.x | Counter animations, micro-interactions |
| Charts | Recharts | 3.x | Pie chart, area chart |
| Icons | Lucide React | latest | Consistent icon set |
| Utilities | clsx + tailwind-merge | latest | Safe class merging (cn()) |
| Package Manager | pnpm | 10.x | Fast, disk-efficient |

---

## Directory Structure

```
src/
├── app/                    ← Next.js App Router pages
│   ├── layout.tsx          ← Root layout: RTL, fonts, HTML metadata
│   ├── globals.css         ← Design tokens, base styles, utility classes
│   ├── page.tsx            ← Redirect → /onboarding
│   ├── onboarding/page.tsx
│   ├── dashboard/page.tsx
│   ├── transactions/page.tsx
│   ├── goals/page.tsx
│   ├── zakat/page.tsx
│   └── insights/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx         ← Desktop sidebar (fixed right, RTL)
│   │   └── MobileNav.tsx       ← Mobile bottom tab bar
│   ├── ui/                     ← Custom primitives + shadcn overrides
│   │   ├── AnimatedCard.tsx    ← Framer Motion card w/ hover lift
│   │   ├── AnimatedCounter.tsx ← GSAP number counter
│   │   ├── AnimatedProgressBar.tsx ← Framer Motion fill bar
│   │   ├── GlassCard.tsx       ← Glassmorphism wrapper
│   │   ├── SukukBadge.tsx      ← Status / label pills
│   │   └── PageTransition.tsx  ← AnimatePresence wrapper
│   └── decorative/
│       ├── GeometricPattern.tsx ← Islamic geometric CSS overlay
│       └── FloatingOrbs.tsx     ← Blurred gradient orbs
│
├── data/                   ← Mock data (replaces API until backend ready)
│   ├── transactions.ts
│   ├── assets.ts
│   ├── goals.ts
│   ├── insights.ts
│   └── zakat.ts
│
├── hooks/
│   ├── useGsapCounter.ts       ← GSAP counter animation hook
│   └── useAnimateOnView.ts     ← IntersectionObserver trigger hook
│
├── lib/
│   └── utils.ts            ← cn(), formatEGP(), calcRoundup(), etc.
│
└── types/
    └── index.ts            ← All shared TypeScript interfaces
```

---

## Design System

### Color Palette

All colors use OKLCH for perceptual uniformity. Defined as CSS custom properties in `globals.css`.

| Token | OKLCH | Purpose |
|-------|-------|---------|
| `--sukuk-green` | `oklch(0.48 0.14 152)` | Primary brand — CTAs, active states |
| `--sukuk-green-light` | `oklch(0.65 0.12 152)` | Gradients, hover states |
| `--sukuk-green-muted` | `oklch(0.92 0.04 152)` | Active nav background, badge fill |
| `--sukuk-gold` | `oklch(0.72 0.12 85)` | Gold asset, secondary accent |
| `--sukuk-beige` | `oklch(0.96 0.012 90)` | Warm background tones |
| `--sukuk-cream` | `oklch(0.98 0.006 95)` | Page background |
| `--sukuk-warm-gray` | `oklch(0.88 0.008 95)` | Dividers, subtle borders |
| `--background` | `oklch(0.98 0.005 95)` | Warm off-white page base |

### Chart Colors

```
Chart 1 (Green):    oklch(0.48 0.14 152)   ← Gold asset in pie
Chart 2 (Gold):     oklch(0.72 0.12 85)    ← Index fund in pie
Chart 3 (Blue-Gray):oklch(0.55 0.10 230)   ← High-risk in pie
```

### Typography

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| Headings | IBM Plex Sans Arabic | 500, 600, 700 | H1–H4, hero text, card titles |
| Body | Tajawal | 300, 400, 500 | Paragraphs, labels, microcopy |

**Font loading:** Google Fonts via `<link>` preconnect in `layout.tsx`. Declared as `--font-heading` and `--font-body` CSS vars.

### Spacing & Radius

- Border radius base: `0.75rem` (12px)
- Card radius: `rounded-2xl` (16px)
- Pill radius: `rounded-full`
- Consistent padding scale: `p-4` (mobile) → `p-6` (desktop)

### Glassmorphism Utility Classes

Defined in `globals.css` `@layer utilities`:

```css
.glass        /* 65% white bg, blur(16px) — standard cards */
.glass-strong /* 80% white bg, blur(24px) — hero elements */
```

---

## Component Architecture

### Design Principles

1. **No page-specific logic in shared components** — all data props come from pages
2. **RTL-first** — use `start/end` Tailwind variants, not `left/right`
3. **Animation is additive** — base layout works without JS animations
4. **Composition over configuration** — prefer small, focused components

### Component Contracts

#### `AnimatedCard`
```tsx
<AnimatedCard
  delay={0.2}       // entrance delay (seconds)
  hoverable={true}  // enables hover lift
  className="..."   // additional Tailwind classes
>
  {children}
</AnimatedCard>
```

#### `AnimatedCounter`
```tsx
<AnimatedCounter
  value={13000}
  duration={1.8}
  decimals={0}
  prefix=""
  suffix=" جنيه"
  label="إجمالي المحفظة"
  className="text-4xl font-bold"
/>
```

#### `AnimatedProgressBar`
```tsx
<AnimatedProgressBar
  value={63}         // 0–100
  delay={0.5}        // animation delay
  showLabel={true}   // show % at end
  color="#2d7a4f"    // optional custom color
/>
```

#### `SukukBadge`
```tsx
<SukukBadge variant="invested">✓ مُستثمر</SukukBadge>
<StatusBadge status="pending" />
```

#### `GlassCard`
```tsx
<GlassCard strong={false} className="p-6">
  {children}
</GlassCard>
```

---

## Data Flow (Frontend-Only)

```
Mock Data Files (src/data/)
        │
        ▼
   Page Component
        │
        ├──► Presentational Components (AnimatedCard, Chart, etc.)
        │
        └──► Shared UI Primitives (SukukBadge, GlassCard, etc.)
```

**Future API Integration:** Replace `import { mockTransactions } from "@/data/transactions"` with a `useSWR` or `React Query` call to the backend endpoint. All component contracts remain unchanged.

---

## RTL Implementation

- `<html dir="rtl" lang="ar">` set in root `layout.tsx`
- Tailwind uses `start/end` variants (RTL-aware), e.g., `ps-4`, `me-2`, `border-s`
- Framer Motion `origin-right` on progress bars for RTL fill direction
- Sidebar fixed to the **right** side (`fixed end-0 top-0`)
- All text is Arabic by default; no i18n library needed (single-language app)

---

## Animation Strategy

| Effect | Tool | Where |
|--------|------|-------|
| Page transitions | Framer Motion `AnimatePresence` | `PageTransition.tsx` |
| Card entrance (fadeInUp) | Framer Motion `initial/animate` | `AnimatedCard.tsx` |
| Card hover lift | Framer Motion `whileHover` | `AnimatedCard.tsx` |
| List item stagger | Framer Motion `variants` | Per-page (Dashboard, Transactions) |
| Number counter | GSAP `gsap.to()` | `useGsapCounter.ts` |
| Progress bar fill | Framer Motion `scaleX` | `AnimatedProgressBar.tsx` |
| Floating orbs | Framer Motion `animate` loop | `FloatingOrbs.tsx` |
| Scroll trigger | `IntersectionObserver` | `useAnimateOnView.ts` |

---

## Performance Considerations

- **`"use client"`** directive only on components that use browser APIs or hooks
- All page `page.tsx` files are server components by default (no `"use client"`)
- Google Fonts loaded with `display=swap` to avoid FOIT
- Decorative components (`FloatingOrbs`, `GeometricPattern`) are `pointer-events-none` + `aria-hidden`
- Mock data is static imports — zero network overhead

---

## File Naming Conventions

| Pattern | Examples |
|---------|---------|
| Pages | `page.tsx` (Next.js convention) |
| Components | `PascalCase.tsx` |
| Hooks | `use{Name}.ts` (camelCase) |
| Data files | `camelCase.ts` |
| Types | `index.ts` (barrel file) |

---

## Future Backend Integration Points

| Mock File | Replace With |
|-----------|-------------|
| `data/transactions.ts` | `GET /api/transactions` |
| `data/assets.ts` | `GET /api/portfolio` |
| `data/goals.ts` | `GET /api/goals` |
| `data/insights.ts` | `GET /api/insights` (LLM-generated) |
| `data/zakat.ts` | `GET /api/zakat/calculate` |

All data shapes are defined in `src/types/index.ts` and match the backend entity contracts from `core-features.md`.
