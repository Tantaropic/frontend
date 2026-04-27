# Sukuk-Sweep — 3-Day Hackathon Plan

## Timeline Overview

| Date | Milestone | Deliverable |
|------|-----------|-------------|
| April 27 | Foundation | Idea application submitted |
| April 28 | Core Product | 1-min prototype video |
| April 29 | First Review | 2-min progress video |
| April 30 | Second Review | 2-min progress video |
| May 1 | Final Submission | Public GitHub repo + 5-min presentation video |

---

## Day 1 — April 27 (Idea + Foundation)

**Deadline: Submit project idea application by end of day**

### Morning (4 hours)

| Time | Task | Owner |
|------|------|-------|
| 0-1h | Finalize idea pitch, fill out idea application form | All team |
| 1-3h | Design system architecture + data flow diagram | Backend dev |
| 1-3h | Create wireframes/UI mockups (Figma) for 4 screens: Onboarding, Transaction Feed, Portfolio Dashboard, Goals | Designer/Frontend |
| 3-4h | Set up repo, project structure, CI, choose tech stack | Backend dev |

### Afternoon (4 hours)

| Time | Task | Owner |
|------|------|-------|
| 4-6h | Build mock Open Banking API — fake transaction feed with realistic Egyptian merchant data | Backend dev |
| 4-6h | Build onboarding flow UI (sign up, link bank, pick risk profile) | Frontend dev |
| 6-8h | Implement round-up engine logic: `ceil(amount) → difference → accumulate` | Backend dev |
| 6-8h | Build transaction feed screen showing purchases + round-ups | Frontend dev |

### Day 1 Deliverables

- [ ] Idea application submitted
- [ ] Round-up engine working with mock data
- [ ] 2 screens functional (onboarding + transaction feed)

---

## Day 2 — April 28 (Core Product)

**Deadline: Record 1-min prototype video by end of day**

### Morning (4 hours)

| Time | Task | Owner |
|------|------|-------|
| 0-2h | Build Sukuk/ETF mock catalog with 5-8 real Islamic instruments | Backend dev |
| 0-2h | Build portfolio dashboard UI: pie chart, total invested, returns | Frontend dev |
| 2-4h | Investment allocation engine: split round-ups by risk profile (Conservative/Balanced/Growth) | Backend dev |
| 2-4h | Goal-based savings UI: create goal, progress bar, target date | Frontend dev |

### Afternoon (4 hours)

| Time | Task | Owner |
|------|------|-------|
| 4-5h | Zakat calculator: compute 2.5% on qualifying investments held 1 lunar year | Backend dev |
| 4-5h | Zakat screen UI + donate button | Frontend dev |
| 5-7h | Integration: connect all screens end-to-end, fix bugs | All team |
| 7-8h | **Record 1-min prototype video** — show the full user journey | All team |

### Day 2 Deliverables

- [ ] Full working prototype: round-up → invest → dashboard → Zakat
- [ ] 1-min video uploaded (Google Drive or unlisted YouTube)

---

## Day 3 — April 29 → May 1 (Polish + Present)

### April 29 — First Review

**Deadline: Record 2-min progress video**

| Time | Task |
|------|------|
| Morning | Add "Your coffee earned you X EGP" insight cards, notification system |
| Morning | Edge cases: pause/resume round-ups, change risk profile, withdraw funds |
| Afternoon | Polish UI: animations, Arabic localization, dark mode |
| Evening | **Record 2-min progress video** |

### April 30 — Second Review

**Deadline: Record 2-min progress video**

| Time | Task |
|------|------|
| Morning | Add family pool feature (shared goal, multiple contributors) if time allows |
| Afternoon | Load testing, bug fixes, performance optimization |
| Evening | **Record 2-min progress video** |

### May 1 — Final Submission

**Deadline: Push code to public GitHub + upload 5-min final presentation video**

| Time | Task |
|------|------|
| Morning | Clean up code, add README with setup instructions, architecture diagram |
| Afternoon | Prepare final presentation using provided template |
| Afternoon | Record 5-min presentation video |
| Evening | Push to public GitHub repo, upload video, submit |

---

## Screen Build Order

Build in this order — each screen is demo-ready before moving to the next:

```
Screen 1: Onboarding (Day 1 AM)
    ↓
Screen 2: Transaction Feed + Round-ups (Day 1 PM)
    ↓
Screen 3: Portfolio Dashboard (Day 2 AM)
    ↓
Screen 4: Goals + Zakat (Day 2 PM)
    ↓
Screen 5: Insights/Notifications (Day 3)
```

---

## Suggested Tech Stack

| Layer | Tool | Why |
|-------|------|-----|
| Frontend | React Native or Flutter | Cross-platform, fast to build |
| Backend | Node.js + Express or FastAPI | Quick API development |
| Database | Firebase or Supabase | Real-time, free tier, auth built-in |
| Mock Banking | JSON Server or custom Express routes | Simulate transaction feed |
| Charts | Victory Native or fl_chart | Portfolio visualization |
| Hosting | Vercel / Railway | Free, instant deploy |

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Can't finish investment engine | Pre-calculate returns, show static portfolio data |
| UI takes too long | Use a component library (Shadcn, NativeBase) — don't build from scratch |
| Team member blocked | Everyone can demo any feature — no single points of failure |
| Video deadline missed | Record rough video early on Day 2, polish later if time allows |

---

## Video Checklist

### 1-min Video (April 28)
- [ ] Show app opening
- [ ] Demo a purchase being rounded up
- [ ] Show money flowing into Sukuk
- [ ] Flash the portfolio dashboard

### 2-min Videos (April 29 & 30)
- [ ] Explain what was built since last video
- [ ] Live demo of new features
- [ ] Brief mention of what's next

### 5-min Final Video (May 1)
- [ ] Problem statement (30s)
- [ ] Solution overview (30s)
- [ ] Live demo — full user journey (2min)
- [ ] Architecture & tech stack (30s)
- [ ] Business model & impact (30s)
- [ ] Team & next steps (30s)
- [ ] Use the provided presentation template
