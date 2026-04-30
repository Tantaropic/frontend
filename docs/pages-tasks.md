# SukukSweep — Pages & Tasks Breakdown

> **Status Legend:** 🔴 Not Started | 🟡 In Progress | 🟢 Done | ⭐ Priority

---

## Page Build Order

```
1. /onboarding     ← Start here (Day 1 AM) ⭐
2. /transactions   ← Day 1 PM
3. /dashboard      ← Day 2 AM ⭐ (most visual)
4. /goals          ← Day 2 PM
5. /zakat          ← Day 2 PM
6. /insights       ← Day 3 (if time allows)
```

---

## Page 1: Onboarding (`/onboarding`) 🟢

**Layout:** Full-page (no sidebar). `FloatingOrbs` + `GeometricPattern` background.

**UX Pattern:** Multi-step stepper — 5 steps, progress dots at top. No sidebar or nav.

---

### Step 1 — Hero Section

**Components needed:**
- `FloatingOrbs` — background decorative orbs
- `GeometricPattern` — subtle background texture
- Heading: "فلوسك بتكبر من غير ما تحس"
- Subheading: "كل عملية شراء بتقربك لهدفك — استثمر فكتتك بدون ما تحس"
- CTA button: "ابدأ رحلتك ←" → advances to Step 2

**Animations:**
- `motion.h1`: `fadeInUp`, delay 0ms, duration 600ms
- `motion.p`: `fadeInUp`, delay 200ms
- `motion.button`: `fadeInUp`, delay 400ms, `whileHover` scale 1.03

**Implementation tasks:**
- [ ] Create `src/app/onboarding/page.tsx` — replace stub with full component
- [ ] Build stepper component (progress dots + step counter) — inline or extract
- [ ] Style hero heading with `text-gradient-green` + `font-heading`
- [ ] Add `FloatingOrbs` and `GeometricPattern` as absolute overlays
- [ ] Wire CTA button to advance step state

---

### Step 2 — Sign-up Form

**Components needed:**
- `GlassCard` wrapper
- shadcn `Input` × 3: الاسم الكامل / البريد الإلكتروني / رقم الهاتف
- shadcn `Label` for each field
- shadcn `Button`: "التالي ←"
- "لديك حساب؟ سجّل دخولك" link (mock — no action)

**Animations:**
- Fields stagger: each `Input` group `fadeInUp` with 100ms interval
- Submit button `whileHover` lift

**Implementation tasks:**
- [ ] Build form layout inside `GlassCard`
- [ ] Add RTL-compatible `Input` with Arabic placeholders
- [ ] Local state for field values (no submission — mock only)
- [ ] Validate fields are not empty before advancing (simple check)
- [ ] "التالي" button advances to Step 3

---

### Step 3 — Bank Connection Card

**Components needed:**
- `GlassCard` wrapper
- Bank logo row: Banque Misr / CIB / NBE (SVG or styled divs with names)
- Connection status: "جاري الربط..." → "✓ تم الربط بنجاح"
- GSAP pulse animation on the connect icon during loading state

**Animations:**
- GSAP `pulse-ring` on the connect icon (1.5s)
- After 1.5s → status transitions to success (Framer Motion `AnimatePresence`)
- Green checkmark `scale` from 0 to 1

**Implementation tasks:**
- [ ] Build `BankConnectionCard` component (can be inline on step)
- [ ] `useEffect` timer: after 1500ms set `connected = true`
- [ ] Animate status change with `AnimatePresence`
- [ ] "التالي" button only enabled after `connected = true`

---

### Step 4 — Risk Profile Selector

**Components needed:**
- 3 × `AnimatedCard` arranged in a responsive row/grid
- Each card: icon + Arabic title + description + return range
- Selected state: green border + green background tint

**Card data:**
```
محافظ (Conservative)   → 100% صكوك         → عائد متوقع: 4–7%
متوازن (Balanced)      → 60% صكوك / 40% ETF → عائد متوقع: 7–11%
نمو (Growth)           → عقارات + أسهم       → عائد متوقع: 11–18%
```

**Animations:**
- Cards stagger entrance: 0ms / 150ms / 300ms delay
- `whileHover` lift on unselected cards
- Selected card: Framer Motion `layoutId` animated border highlight

**Implementation tasks:**
- [ ] Define `riskProfiles[]` array (inline data, 3 items)
- [ ] Map to `AnimatedCard` with click handler
- [ ] Track `selectedRisk` in component state
- [ ] Apply selected styles conditionally
- [ ] "التالي" button disabled until one card selected

---

### Step 5 — Round-up Settings

**Components needed:**
- `GlassCard` wrapper
- shadcn `Switch`: "تفعيل التقريب التلقائي" label
- shadcn `Select`: "التقريب إلى" → أقرب 1 جنيه / 5 جنيه / 10 جنيه
- Live preview: "شراء بـ 87 جنيه → يُستثمر 3 جنيه" (updates with multiplier)

**Animations:**
- Preview row animates value change with GSAP counter when multiplier changes
- `Switch` toggles with smooth Framer Motion layout animation

**Implementation tasks:**
- [ ] `roundupEnabled` boolean state
- [ ] `multiplier` state: 1 | 5 | 10
- [ ] Live preview calculation using `calcRoundup(87, multiplier)` from `lib/utils.ts`
- [ ] Animate preview number with `useGsapCounter` on multiplier change
- [ ] "ابدأ الاستثمار الآن ←" (final CTA) → `router.push('/dashboard')`

---

### Onboarding Shared Layout Notes

- **Stepper dots:** 5 dots at the top center, filled progressively with sukuk-green
- **Back button:** visible on steps 2–5, top-right corner (absolute positioned)
- **Step counter:** "خطوة 2 من 5" — small muted text below dots
- **Transition between steps:** Framer Motion `AnimatePresence` with `slideLeft` effect

---

## Page 2: Transactions (`/transactions`) 🟢

**Layout:** App shell with Sidebar + MobileNav. Page content scrolls.

### Components to Build

| Component | Description |
|-----------|-------------|
| `TransactionHeader` | Mini balance card + today's invested amount |
| `SimulatePurchaseButton` | Adds fake transaction to list with animation |
| `TransactionList` | Animated list of `TransactionItem` components |
| `TransactionItem` | Merchant icon + name + amount + badge + roundup |
| `DailySummaryCard` | Collapsible daily totals |

### Key Tasks

- [ ] Create app shell layout wrapping `Sidebar + MobileNav + content`
- [ ] Display `mockTransactions` as animated list (Framer Motion stagger)
- [ ] "محاكاة عملية شراء" button → prepends new transaction with entrance animation
- [ ] `StatusBadge` (invested/pending) on each item
- [ ] "X جنيه مُستثمر" badge in sukuk-green per transaction
- [ ] Group transactions by date with section headers

---

## Page 3: Dashboard (`/dashboard`) 🟢

> **Most visually impressive page — spend the most time here.**

### Components to Build

| Component | Description |
|-----------|-------------|
| `BalanceCard` | Hero balance with GSAP `AnimatedCounter` + shimmer effect |
| `PortfolioChart` | Recharts `PieChart` — 3 slices (Gold/Index/HighRisk) |
| `AssetBreakdownList` | Row per asset: name + allocation% + value + sharia badge |
| `InsightCardsRow` | Horizontal scroll of `AIInsightCard` components |
| `AIInsightCard` | Glassmorphism card with icon + title + highlight number |
| `QuickActions` | 3 pill buttons: إضافة / سحب / إيقاف مؤقت |

### Key Tasks

- [ ] Build `BalanceCard` with `AnimatedCounter` showing 13,000 EGP
- [ ] Configure `PieChart` from Recharts with custom colors from `mockAssets`
- [ ] Build `AssetBreakdownList` with `SukukBadge variant="sharia"` on each row
- [ ] Build `InsightCardsRow` with horizontal scroll and `AnimatedCard` per insight
- [ ] Stagger all cards with Framer Motion (0, 0.1, 0.2, 0.3 delays)
- [ ] Quick action buttons with `whileTap` scale animation
- [ ] Background: `bg-sukuk-gradient` with `FloatingOrbs` behind `BalanceCard`

---

## Page 4: Goals (`/goals`) 🟢

### Components to Build

| Component | Description |
|-----------|-------------|
| `GoalCard` | Title + emoji + progress bar + amounts + date |
| `CreateGoalModal` | shadcn `Dialog` — form: title / target / date |
| `GoalProgressBar` | `AnimatedProgressBar` with goal color |

### Key Tasks

- [ ] Map `mockGoals` to `GoalCard` with stagger animation
- [ ] `AnimatedProgressBar` per goal (different delay per card)
- [ ] Progress label: "23,400 من 80,000 جنيه"
- [ ] Days remaining: "باقي 700 يوم"
- [ ] Projected reach: "بالمعدل الحالي هتوصل في مارس 2028"
- [ ] "إضافة هدف +" button → opens `CreateGoalModal`
- [ ] `CreateGoalModal`: title input, amount input, date picker (shadcn), submit adds to local state

---

## Page 5: Zakat (`/zakat`) 🔴

### Components to Build

| Component | Description |
|-----------|-------------|
| `ZakatSummaryCard` | Total owed + 2.5% rate + animated counter |
| `AssetEligibilityTable` | Each asset row: name / value / held months / eligible / amount |
| `ZakatInfoSection` | Simple explainer: what is Zakat, nisab, lunar year |
| `DonateButton` | CTA with mock confirmation toast |

### Key Tasks

- [ ] Use `mockZakatData` from `data/zakat.ts`
- [ ] `AnimatedCounter` for total Zakat owed (325.25 جنيه)
- [ ] Table rows: green checkmark if eligible, gray × if not
- [ ] "تبرع الآن" button → mock success toast (shadcn `sonner` or custom)
- [ ] Nisab threshold notice: "الحد الأدنى للنصاب: 15,000 جنيه"
- [ ] Info accordion: shadcn `Accordion` with common Zakat questions in Arabic

---

## Page 6: Insights (`/insights`) 🔴

### Components to Build

| Component | Description |
|-----------|-------------|
| `InsightCard` | Full-size version of the dashboard insight card |
| `SpendingBehaviorChart` | Recharts `BarChart` — spending by category |
| `EmotionalNudgeList` | Chronological list of all insights |

### Key Tasks

- [ ] Map all `mockInsights` to full `InsightCard` components
- [ ] Group by type: habit / milestone / nudge / zakat
- [ ] `SpendingBehaviorChart` — mock category data (مطاعم / مواصلات / تسوق...)
- [ ] Stagger cards with Framer Motion
- [ ] Filter tabs (shadcn `Tabs`): الكل / عادات / إنجازات / زكاة

---

## Shared App Shell (needed before pages 2–6)

**File:** `src/app/(app)/layout.tsx` (or wrapping logic in each page)

- [ ] Create layout wrapper that includes `Sidebar` + `MobileNav`
- [ ] Content area: `lg:pe-60` padding to account for sidebar width
- [ ] `PageTransition` wrapping `{children}`
- [ ] Mobile: add `pb-16` padding to clear bottom nav bar

---

## Reusable Components Backlog

These will be extracted as needed during page implementation:

| Component | Needed By | Priority |
|-----------|-----------|----------|
| `Toast / Sonner` | Zakat donate, Simulate Purchase | Medium |
| `Accordion` | Zakat info section | Low |
| `EmptyState` | Empty goals / transactions | Low |
| `LoadingSkeleton` | Future API integration | Low |
| `ConfirmDialog` | Withdraw / donate actions | Low |
