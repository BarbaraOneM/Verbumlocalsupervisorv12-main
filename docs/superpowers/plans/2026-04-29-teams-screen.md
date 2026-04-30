# Teams Screen Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the Supervisor Teams screen — list view (cards) + team detail view (4 tabs: Members, Languages, Replies, Settings) inside a single `Teams.tsx` file.

**Architecture:** Single file with local `useState` for list↔detail navigation (no new routes). All tab content rendered inline. Confirmation modals inline. Mock data at top of file. No new component files — reuse Sidebar directly for detail view layout.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, lucide-react, Poppins font, design tokens from Guidelines-Colors.md

---

### Task 1: Teams List View

**Files:** `src/app/pages/Teams.tsx` (full replace of stub)

- [x] Types: `TeamData`, `TeamMember`, `Language`, `ReplyCategory`
- [x] Mock data: 2 teams (Alpha HIPAA, Beta plain), each with members/languages/categories
- [x] List view: page header ("Teams" + subtitle + count), search input, card grid
- [x] Each card: team name + optional Shield, description, 3 stats (agents / languages / categories)
- [x] Empty state (no teams) and search-no-results state
- [x] `selectedTeam` state drives list↔detail switch

---

### Task 2: Team Detail — Shell, Header, Stats, Tabs

**Files:** `src/app/pages/Teams.tsx`

- [x] Detail layout: `<Sidebar>` + `<main>` (no PageLayout — needs custom header)
- [x] Header: back button "← Teams", team name + Shield if HIPAA, description muted
- [x] Stats bar: Team Members · In Session (PENDING placeholder) · Sessions Today · Top Language Pair
- [x] Tab bar: Members · Languages · Replies · Settings
- [x] Active tab state renders correct content panel

---

### Task 3: Members Tab

**Files:** `src/app/pages/Teams.tsx`

- [x] "Current Members" section — member rows: avatar + name + email + remove button
- [x] Remove confirmation modal: title "Remove [Name] from this team?" — cancel/confirm
- [x] "Add Members" section — search input filters available agents
- [x] Available agent list: unassigned (selectable) · assigned-to-other (disabled chip) · inactive (disabled chip)
- [x] "Add" button per selectable agent, triggers adding to current members
- [x] Note: "Only unassigned active agents can be added to a team."
- [x] Empty state: no members, no available agents

---

### Task 4: Languages Tab

**Files:** `src/app/pages/Teams.tsx`

- [x] "Language Configuration" section — enabled languages as removable chips
- [x] Remove language: direct (PENDING confirmation behavior — no modal, instant for MVP)
- [x] "Add Language" dropdown — searchable, shows only pool languages not already active
- [x] Pool note copy at bottom
- [x] Empty state: no languages configured

---

### Task 5: Replies Tab

**Files:** `src/app/pages/Teams.tsx`

- [x] "Reply Categories" section — each row: name + reply count + toggle
- [x] Toggle on/off updates local state — uses Guidelines-Controls.md toggle pattern
- [x] "All categories off" informational note when all disabled
- [x] Empty state: no categories in pool
- [x] Nav note: "To create or edit reply categories, go to Replies in the main navigation."

---

### Task 6: Settings Tab

**Files:** `src/app/pages/Teams.tsx`

- [x] "Team Information" section — name input + description textarea + Cancel/Save
- [x] Save success ("Changes saved") and error ("Unable to save changes. Please try again.") inline states
- [x] "Security & Compliance" section — HIPAA toggle
- [x] HIPAA enable modal: title "Enable HIPAA Compliance?" + correct body copy + Cancel/Enable HIPAA buttons
- [x] HIPAA disable modal: title "Disable HIPAA Compliance?" + warning body copy + Cancel/Disable HIPAA buttons
- [x] HIPAA locked state: toggle disabled + tooltip (PENDING hipaa_locked field — rendered as always-unlocked in MVP)
- [x] "SDK Translation Mode" section — two radio options (STT+TTS default / S2S) + helper text
- [x] PENDING label on SDK section matching spec status

---

## PENDING items — do not implement behavior, mark visually

| Item | Treatment |
|------|-----------|
| "In Session" stat card | Show value as "—" with `[PENDING]` tooltip |
| HIPAA locked by Admin | Not rendered in MVP (no `hipaa_locked` field yet) |
| Language removal confirmation | Remove immediately, no modal |
| SDK Translation Mode | Render section with PENDING badge, controls disabled |
| Tab state persistence | Not implemented — resets on navigation |
