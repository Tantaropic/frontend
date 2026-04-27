# Sukuk-Sweep — Core Features

## Overview

A micro-investing app that rounds up daily purchases and automatically invests spare change into Sharia-compliant instruments (Sukuk & ETFs). Built for the MENA region where inflation punishes fiat savings and traditional interest-bearing accounts violate Islamic finance principles.

---

## 1. Smart Round-Up Engine

- Connect to transaction feed (Open Banking / SMS parsing / manual entry)
- Round up each purchase to the nearest 1, 5, or 10 (user chooses multiplier)
- Daily/weekly sweep threshold — accumulate until a minimum is reached (e.g., 50 EGP) before investing
- Pause/resume anytime — user stays in full control

**Example:** Coffee costs 45 EGP → rounds to 50 EGP → 5 EGP goes to investment pool

---

## 2. Sharia-Compliant Investment Allocation

- Pre-vetted pool of Sukuk and Sharia-compliant ETFs
- User selects a risk profile:
  - **Conservative** — 100% Sukuk
  - **Balanced** — 60% Sukuk / 40% ETF
  - **Growth** — Higher equity ETF allocation
- Fractional ownership — micro-amounts pooled across users to access instruments that normally require large minimums
- Automatic rebalancing based on selected profile

---

## 3. Portfolio Dashboard

- Real-time view: total invested, current returns, breakdown by asset
- Insight cards: *"Your coffee habit has earned you X EGP this year"*
- Sharia compliance badge on every asset — transparency builds trust
- Performance charts showing growth over time

---

## 4. Zakat Integration

- Auto-calculate Zakat owed (2.5%) on qualifying investments held for 1 lunar year
- Option to auto-deduct and donate to verified charities
- Clear breakdown: which assets qualify, which don't
- **Killer differentiator** — no Western micro-investing app offers this

---

## 5. Goal-Based Savings

- Tag round-ups to specific goals: "Hajj Fund", "Emergency Fund", "Wedding", "New Car"
- Visual progress bars — gamify the saving experience
- Set target amount + date — app calculates if round-ups alone will get you there or if top-ups are needed

---

## 6. Social & Family Features (Nice-to-Have)

- **Family pool:** parents + siblings contribute round-ups to a shared goal
- **Gift Sukuk:** send fractional bonds as Eid/wedding gifts instead of cash
- **Leaderboard:** "You've invested more than 70% of users this month"

---

## Hackathon Priority Matrix

| Priority | Feature | Effort |
|----------|---------|--------|
| Must Build | Round-up engine | Medium |
| Must Build | Risk profile selection | Low |
| Must Build | Portfolio dashboard | Medium |
| Must Build | Zakat calculator | Low |
| Should Build | Goal tagging + progress bars | Medium |
| Nice to Have | Family pools | High |
| Nice to Have | Gift Sukuk | Medium |
| Nice to Have | Leaderboard | Low |
| Nice to Have | Receipt OCR | High |
| Nice to Have | Auto-rebalancing | Medium |

---

## Transaction Feed Integration Options

| Approach | Best For | Complexity |
|----------|----------|------------|
| Open Banking API (Lean Technologies, Tarabut Gateway) | Production | High |
| SMS Parsing | Hackathon prototype | Medium |
| Manual + Receipt OCR | Cash-heavy economies | Medium |
| Mock API (JSON Server) | Hackathon demo | Low |

**Hackathon recommendation:** Mock Open Banking API for demo, SMS parsing for working prototype.
