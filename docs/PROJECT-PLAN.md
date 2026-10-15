# Go Clean It: Project Plan

Project manager: Muhammad Farid Hasyim. Team: Rasyha Naufal (lead developer), Abdillah Ridho (developer), Rasyid (field, QR and testing lead). The developers build with Claude Code. Last updated: 15 Oct 2026.
Live prototype: https://gocleanit.vercel.app · Repo: https://github.com/luxelineproject7-source/Go-Clean-It
Full technical spec: [BLUEPRINT.md](BLUEPRINT.md) · Design decisions: [DESIGN-UPDATE.md](DESIGN-UPDATE.md)

**The schedule baseline, budget, risk register and evaluation plan now live in [PROJECT-MANAGEMENT-PLAN.md](PROJECT-MANAGEMENT-PLAN.md). Where its dates differ from the dates below, the management plan wins. This file stays as the weekly tracker and health check.**

How to use this file: update the tracker (section 1) and the weekly log (section 10) every week. A task is only marked Done when its proof exists. Dates after today are proposals, not promises.

Status legend: **Done** (proof exists) · **Doing** · **Blocked** (waiting on a person) · **Todo** · **Later**

---

## 1. Progress tracker

| Track | Phase | Status | Proof |
|---|---|---|---|
| A. Prototype | A1 Understand blueprint | Done | Summary reviewed with Farid |
| A. Prototype | A2 Clickable prototype (4 roles) | Done | [index.html](../index.html), 5-step demo passes |
| A. Prototype | A3 UX: light theme, loading, guest flow, WhatsApp button | Done | Commits `48218d4`, earlier prototype versions |
| A. Prototype | A4 Room QR + floor QR + admin QR sheet | Done | Admin "QR" tab shows scannable codes |
| A. Prototype | A5 GitHub + Vercel deploy | Done | Live at gocleanit.vercel.app |
| A. Prototype | A6 Shared data across phones (Supabase) | Done, needs your cross-device check | Commit `a86aa96`, curl test: write OK, second Accept returns nothing |
| A. Prototype | A7 Email notification to coordinator | **Blocked** | Waiting for Web3Forms access key |
| B. Pilot readiness | B1 Friends test | Todo | Test sheet filled (section 9) |
| B. Pilot readiness | B2 Decisions with lecturer and facility unit | Todo | Section 8 answered |
| B. Pilot readiness | B3 Week 0 baseline measured | Todo | `docs/pilot-week0.md` has real numbers |
| C. Real build | C0 to C7 (blueprint phases 0 to 7) | Later | Starts after B2 |

Overall: Track A 6 of 7 phases done (about 85%), Track B 0%, Track C 0%.

---

## 2. Project facts

| Item | Value |
|---|---|
| Problem | Nobody knows who to tell when a room is dirty, cleaners do not know where to go, faculty cannot see response speed |
| Pilot | 1 building (Gedung A, Fakultas Teknik in the sample data), about 40 rooms, up to 50 reports per day, about 20 users |
| Success metric | Median time from reported to accepted under 15 minutes, and at least 80% of reports accepted. Compared with the Week 0 baseline |
| Reporter access | Guest, no login, no app. QR on door or on floor |
| Notifications | WhatsApp to cleaners (real build). Email to coordinator (prototype) |
| Hosting | Vercel (web), Supabase (database) |
| Language | UI in Bahasa Indonesia. Code and docs in English |

---

## 3. People and responsibilities

| Person or group | Role in project | Decides | Needed for |
|---|---|---|---|
| Muhammad Farid Hasyim | Project manager and owner | Scope, priorities, what ships | Everything |
| Rasyha Naufal | Lead developer (front end, deploys) | How screens and deploys are built | C-track |
| Abdillah Ridho | Developer (back end, security, notifications) | How the database and security tests are built | C-track |
| Rasyid | Field, QR and testing lead | Plate placement, test sessions, training | B1, B3, plates, pilot |
| Lecturer (master user) | Sponsor and reviewer | Whether the idea is accepted, which building | B2, B5 |
| Facility unit | Real users and data owner | Cleaners, shifts, coordinator number | B2, B3, C-track |
| Cleaners | Daily users | Nothing, but must be able to use it | B1, pilot |
| Supervisor (per faculty) | Escalation contact | Reassignments | B2, pilot |
| Friends (testers) | Early feedback | Nothing | B1 |
| Claude Code | Coding tool used by the developers | How to implement within the blueprint rules | A, C |

Full role split, RACI matrix and workload per person: [PROJECT-MANAGEMENT-PLAN.md](PROJECT-MANAGEMENT-PLAN.md) sections 1.1 and 2.8.

Rule from the blueprint: no silent changes to the ERD or security rules. Any change updates BLUEPRINT.md in the same commit.

---

## 4. Scope

In the pilot: QR report with no login, cleaner queue with atomic accept, proof photo, rating, supervisor dashboard with escalation at 10 minutes, admin QR and user management, WhatsApp notifications.
Not in the pilot: payments, live GPS, in-app chat, native app, AI features, multi-university tenancy.

---

## 5. Code map and health check

### 5.1 Code map

| File | What it is | Key parts | Check it works |
|---|---|---|---|
| [index.html](../index.html) | The whole prototype, no build step | see 5.2 | Open the live site, run the 5-step demo |
| [supabase-setup.sql](../supabase-setup.sql) | Creates the shared `items` table and the open demo policies | one table, four policies | Run in Supabase SQL Editor, expect "Success" |
| [README.md](../README.md) | How to deploy, connect Supabase, set up email | Deploy, Shared data, Email | A new person can follow it from scratch |
| [BLUEPRINT.md](BLUEPRINT.md) | Spec for the real build (11 tables, RLS, 22 security tests) | section 6 security, section 9 phases | Read before each Track C phase |
| [DESIGN-UPDATE.md](DESIGN-UPDATE.md) | Why guests need no login, how notifications work | login model table | Matches blueprint section 6.3 |
| [package.json](../package.json) | Declares a static project for Vercel | none | Vercel builds with no settings |

### 5.2 Inside index.html (search for these names)

| Area | Function or name | Purpose |
|---|---|---|
| Data | `ROOMS`, `FLOORS`, `USERS`, `CATS`, `STATUS` | Sample building, floors, people, categories |
| Rules | `createReport`, `accept`, `escalateStale`, `dispatch` | Rate limit, duplicate merge, atomic accept, 10-minute escalation |
| Storage | `sb`, `touch`, `flush`, `poll`, `resetShared` | Read and write the Supabase table, poll every 3 seconds |
| Notifications | `notify`, `notifyGuest`, `sendMail`, `emailNotify`, `waLink` | WhatsApp-style messages in the log, email through Web3Forms |
| Screens | `roomView`, `floorView`, `formView`, `reportView`, `cleanerView`, `taskView`, `supervisorView`, `adminView` | One function per screen |
| Shell | `render`, `act`, `apply` | Draw the page, handle clicks |

### 5.3 Health check (run weekly, takes 5 minutes)

| # | Check | How | Healthy result |
|---|---|---|---|
| H1 | Site is up | Open https://gocleanit.vercel.app (Ctrl+F5) | Splash, then the report screen |
| H2 | Database connected | Open "Alat uji" in the app | "Data bersama" says Tersambung |
| H3 | Reports are shared | File a report on phone A, open Petugas Dedi on phone B | Report appears within about 5 seconds |
| H4 | Atomic accept | "Alat uji", press "Dedi dan Sari menerima bersamaan" | Exactly one winner |
| H5 | Escalation | File a report, press "Maju 10 menit" | Report shows "Diteruskan ke supervisor" |
| H6 | Email | "Alat uji", press "Kirim email uji" | Email arrives (check spam). Blocked until A7 |
| H7 | QR links | Scan a QR from the admin "QR" tab with a phone | Opens that room |
| H8 | Latest code deployed | GitHub shows the latest commit, Vercel shows Ready | Same commit on both |
| H9 | Database size | Supabase > Reports or Database page | Far below the free limit (photos are stored in rows, so watch this) |

### 5.4 Known gaps (prototype only)

| # | Gap | Why it matters | Fixed in |
|---|---|---|---|
| G1 | Database table is open to anyone with the public key | Anyone can read or change reports | C2 (RLS and SQL functions) |
| G2 | Shift and role checks happen in the browser | A tester can pretend to be any role | C2 |
| G3 | Photos are stored inside database rows | Rows grow fast | C2 (private storage bucket) |
| G4 | Updates arrive by polling every 3 seconds | Not instant | C3/C4 (realtime) |
| G5 | "Maju 10 menit" edits timestamps | Demo trick, not real time | Removed in C5 (pg_cron) |
| G6 | WhatsApp messages are simulated | No real cleaner is notified | C5 |
| G7 | No audit trail, last write wins | History can be overwritten | C2 (append-only `report_event`) |

---

## 6. Work plan, line by line

Estimates are working days for one builder. Proposed dates start Mon 12 Oct 2026.

### Track A: Prototype

| ID | Task | Owner | Est | Status | Done when / proof |
|---|---|---|---|---|---|
| A1.1 | Read blueprint and list open decisions | Claude | 0.5 | Done | 8 decisions listed |
| A2.1 | Build clickable prototype (reporter, cleaner, supervisor, admin) | Claude | 2 | Done | Demo steps 1 to 5 pass |
| A3.1 | Light theme, splash, skeleton and button loading | Claude | 0.5 | Done | Visible in app |
| A3.2 | Guest reporting, WhatsApp contact button | Claude | 0.5 | Done | Room page shows both buttons |
| A4.1 | Floor QR with room picker and "Area umum" | Claude | 0.5 | Done | Floor flow works |
| A4.2 | Admin QR tab with real QR codes | Claude | 0.5 | Done | Phone scan opens the room |
| A5.1 | Create GitHub repo and push | Farid + Claude | 0.2 | Done | Repo has `main` |
| A5.2 | Deploy on Vercel | Farid | 0.2 | Done | gocleanit.vercel.app |
| A6.1 | Create Supabase project and run SQL | Farid | 0.2 | Done | "Success. No rows returned" |
| A6.2 | Connect app to Supabase and test | Claude | 0.5 | Done | Commit `a86aa96`, curl tests |
| A6.3 | Cross-device test on the live site | Farid | 0.2 | Todo | H3 and H4 pass on two phones |
| A7.1 | Create Web3Forms form and send access key | Farid | 0.1 | **Blocked** | Key received. Form creation failed earlier, retry or switch to FormSubmit |
| A7.2 | Put key in code, push, press "Kirim email uji" | Claude + Farid | 0.2 | Todo | Email arrives |

### Track B: Pilot readiness (proposed Oct 12 to Oct 30)

| ID | Task | Owner | Est | Due | Done when / proof |
|---|---|---|---|---|---|
| B1.1 | Write the friends test script (section 9) | Claude | 0.3 | 14 Oct | Script in repo |
| B1.2 | Run test with 5 friends on their own phones | Farid | 1 | 17 Oct | 5 filled answer sheets |
| B1.3 | Fix the top 5 problems found | Claude | 1 | 20 Oct | Each problem closed in the log |
| B2.1 | Demo to the lecturer | Farid | 0.5 | 21 Oct | Notes written down |
| B2.2 | Answer open decisions 1 to 11 (section 8) | Farid + lecturer + facility unit | 1 | 24 Oct | Decisions filled in with names and dates |
| B3.1 | Measure Week 0 baseline: for 5 working days note how long each cleaning request takes from request to start | Facility unit | 5 | 30 Oct | `docs/pilot-week0.md` with real numbers |
| B3.2 | Choose the pilot building and list its rooms | Facility unit | 1 | 24 Oct | Room list with floors |
| B3.3 | Collect cleaner names, phone numbers, shifts (with consent) | Facility unit | 1 | 27 Oct | Sheet ready for seed data |

### Track C: Real build (follows blueprint section 9, starts after B2)

One phase at a time. Each phase ends with a commit, a 5-line English and Indonesian summary, and passing tests.

| ID | Blueprint phase | What gets built | Est | Gate (proof) |
|---|---|---|---|---|
| C0 | Phase 0 Scaffold | Next.js app, Supabase CLI, local database, `.gitignore`, `.env.example`, README stub | 1 | Dev server shows a page, local Supabase starts |
| C1 | Phase 1 Schema and seed | Migrations 001 to 003 (including `qr_code`), `seed.sql`, `scripts/seed-users.ts`, generated types | 1.5 | `supabase db reset` runs clean, seed rows visible |
| C2 | Phase 2 Security core, no UI | Migrations 004 to 006 (RLS, functions, storage), tests S1 to S11, S15, S16, S18 to S22 | 4 | `npm run test:db` all green. Remove one policy and see a test fail |
| C3 | Phase 3 Reporter flow | Guest QR landing, floor picker, form, device token, photo upload, status page, rating, cancel | 3 | Guest files a report in 3 taps. Tests S9, S12, S19, S20, S22 pass |
| C4 | Phase 4 Cleaner flow | Admin-issued sign-in, queue, accept, start, finish with photo | 2.5 | S6, S7, S8 pass. Two browsers: one winner |
| C5 | Phase 5 Notifications and escalation | Task links (migration 008), `notify-staff`, WhatsApp provider, signed webhook, pg_cron escalation | 3.5 | Real message received. Test with `escalate_stale_reports('5 seconds')`. S13 and S17 pass |
| C6 | Phase 6 Supervisor and admin | Dashboard from `v_response_times`, reassign, QR sheet PDF, TOTP for supervisor and admin | 3 | Dashboard median equals a hand calculation |
| C7 | Phase 7 Hardening and launch | Security headers, photo retention job, README, production Supabase and Vercel | 2 | `curl -I` shows headers. S14 passes. A new person runs the project from the README |

Estimated total for Track C: about 20 working days (4 weeks) after decisions are made.

---

## 7. Risks

| # | Risk | Likelihood | Impact | What we do |
|---|---|---|---|---|
| R1 | Cleaners do not use phones for tasks (the riskiest assumption) | Medium | High | Test with 2 to 3 real cleaners in B2. Make the WhatsApp link the only step they need |
| R2 | Nobody answers the WhatsApp coordinator number | Medium | High | Decide in B2.2 who answers and when. Escalation covers the rest |
| R3 | Spam or prank reports from open QR | Medium | Medium | Rate limits, bot check, retire a QR (blueprint 6.9) |
| R4 | University wants campus-only reporting | Low | Medium | Add campus-email check before the form |
| R5 | WhatsApp Business account takes time to approve | High | Medium | Prototype uses email and the console log. Apply early |
| R6 | Personal data (names, numbers, photos) mishandled | Medium | High | Follow blueprint 6.2 and 6.11. Confirm retention with the university |
| R7 | Free plan limits (Supabase, Vercel, email) reached | Low | Low | Watch H9. Upgrade only if the pilot works |
| R8 | Prototype mistaken for the finished system | Medium | Medium | Say clearly: open table, simulated WhatsApp, no real security yet (G1 to G7) |
| R9 | Scope creep | Medium | Medium | Anything not in section 4 goes to "Later" |

---

## 8. Open decisions

| # | Question | Default | Who decides | Needed by | Answer |
|---|---|---|---|---|---|
| 1 | How cleaners sign in | One-time WhatsApp link, long session | Facility unit | 24 Oct | |
| 2 | Allowed email domains (optional reporter account only) | Not needed for guests | Farid | Before C3 | |
| 3 | WhatsApp provider and who pays | Official provider, `console` for now | Lecturer + facility unit | 24 Oct | |
| 4 | Do cleaners have WhatsApp on their own phones | Yes | Facility unit | 24 Oct | |
| 5 | Retention: photos 90 days, reports 1 year | As blueprint | University | Before C7 | |
| 6 | One supervisor per faculty with a reachable number | Yes | Facility unit | 24 Oct | |
| 7 | Pilot building (about 40 rooms) | Gedung A sample | Lecturer | 24 Oct | |
| 8 | Week 0 baseline measured manually | Yes | Facility unit | 30 Oct | |
| 9 | QR layout: room QR plus floor QR | About 40 room stickers plus one per floor | Farid + facility unit | 24 Oct | |
| 10 | WhatsApp contact button: one coordinator number or one per building | One number | Facility unit | 24 Oct | |
| 11 | Guests from outside campus allowed | Yes, with limits | Lecturer | 24 Oct | |
| 12 | Email address for prototype notifications | Farid's address | Farid | Now | |

---

## 9. Friends test (B1)

Send the link https://gocleanit.vercel.app and ask each friend to do this on their own phone. Tell them first: it is a test, the data is public, do not type real personal data, and a typed WhatsApp number is emailed to Farid.

| Step | Ask the friend to | Watch for |
|---|---|---|
| 1 | Open the link and pick "Pelapor". Tap a door sticker, report "Toilet kotor" | Did they find the button without help? How many taps? |
| 2 | Open "Laporanku" and look at the status | Do they understand the status words? |
| 3 | Switch role to Petugas Dedi and accept the report | Do they see it within 5 seconds? |
| 4 | Start the work, finish with "Pakai foto contoh" | Is "foto sesudah" clear? |
| 5 | Switch back to Pelapor and give 5 stars | Is rating easy to find? |
| 6 | Open the Admin "QR" tab and scan a QR with another phone | Does it open the right room? |

Answer sheet per friend: time to finish step 1 (seconds), anything confusing (free text), anything broken (free text), would a cleaner manage this (yes, no, why).

---

## 10. Weekly log

| Week | Dates | Planned | Done | Problems | Next |
|---|---|---|---|---|---|
| 1 | 5 to 11 Oct | Read blueprint, build prototype | Prototype, guest flow, floor QR, GitHub, Vercel, Supabase shared data | Web3Forms form creation errored. Data was per-browser before Supabase | Cross-device test, email key |
| 2 | 12 to 18 Oct | A6.3, A7, B1.1, B1.2 | | | |
| 3 | 19 to 25 Oct | B1.3, B2.1, B2.2, B3.2, B3.3 | | | |
| 4 | 26 Oct to 1 Nov | B3.1, start C0 and C1 | | | |

---

## 11. Decision record

| Date | Decision | Reason |
|---|---|---|
| 2026-10-09 | Reporters are guests, no login | Lecturer asked why not WhatsApp. Login is the biggest barrier |
| 2026-10-09 | Room QR plus floor QR through a `qr_code` table | Fewer stickers, replaceable stickers, same report data |
| 2026-10-10 | Email through Web3Forms from the browser, no server | No secrets, no Vercel settings |
| 2026-10-10 | Shared data through an open Supabase table for the prototype only | Friends need to see each other's reports. Security comes in C2 |

---

## 12. Definition of done

Prototype done: tracker rows A1 to A7 Done, health checks H1 to H8 pass, five friends have tested.
Pilot ready: Section 8 decisions 1 to 11 answered, Week 0 baseline measured, a lecturer has seen the demo.
Real build done (blueprint section 11): security tests S1 to S22 pass, the 5-step demo works on a phone, the service role key appears nowhere in client code or git, and Farid can explain the ERD, the atomic accept, why RLS is the boundary, and why `report_event` is the truth.
