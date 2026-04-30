# Spec: Supervisor — Teams Screen

**Product:** Verbum Local
**Surface:** Web Management Platform
**Role:** Supervisor
**Status:** Draft — pending stakeholder review
**Version:** v1.0 · April 2026
**Related:** RBAC Matrix v3.2 · Supervisor Flows v2 · Sessions Screen Spec · Dashboard Spec v1.3

---

## Purpose

The Teams screen is the primary operational workspace for the Supervisor. From here they manage the teams they're assigned to: viewing team health at a glance, editing team configuration, managing members, configuring available languages, toggling reply categories on/off, and managing compliance and technical settings.

Scoped strictly to the Supervisor's own assigned teams. A Supervisor cannot see or access any team they are not assigned to.

---

## Permissions

| Action | Supervisor |
|--------|------------|
| View teams | Own assigned teams only |
| Edit team name / description | Own teams only |
| Change supervisor assignment | No — Admin only |
| Create teams | No — Admin only |
| Delete teams | No — Admin only |
| Add / remove members | Own teams only |
| Configure languages | Own teams, from admin-enabled pool only |
| Toggle reply categories on/off | Own teams only |
| Toggle HIPAA | Own teams only |
| Configure SDK Translation Mode | Own teams only — PENDING Dayanna review |

---

## Teams List Page

### Header

- Page title: "Teams"
- Subtitle: "View and manage your teams"
- Team count: "[N] teams" — shown top right, alongside view toggle

### Search

- Search input: placeholder "Search teams..."
- Filters by team name, real-time
- No additional filters in MVP

### View toggle

- Default: **Card view**
- Toggle: Card / List — **NTH**

### Card view

Each card displays:

| Element | Notes |
|---------|-------|
| Team name | Bold. Shield icon inline if HIPAA active |
| Description | Subtitle text, muted |
| Agents count | "👥 [N] agents" |
| Languages count | "🌐 [N] languages" |
| Reply categories count | "💬 [N] categories" |

No supervisor name. No language chips.

Shield tooltip: "HIPAA active — transcripts not stored for this team"

Clicking a card navigates to Team Detail.

### List view — NTH

| Column | Notes |
|--------|-------|
| Team name | Shield icon if HIPAA active |
| Agents | Count |
| Languages | Count |
| Categories | Count |
| → | Navigate to detail |

### States

| State | Trigger | Behavior |
|-------|---------|----------|
| Loading | Page load | Skeleton cards |
| Populated | Teams exist | Cards rendered |
| Empty — no teams assigned | Supervisor has no teams | Blocking empty state: "You don't have any teams assigned yet. Contact your Admin to get started." |
| Search — no results | No match for query | "No teams match your search." + Reset link |

---

## Team Detail Page

### Header

- Back button (← Teams)
- Team name — bold, large. Shield icon inline if HIPAA active
- Description — subtitle, muted, editable via Settings tab
- No breadcrumb, no supervisor field

### Stats Cards

Shown below the header, above the tabs. Always visible regardless of active tab.

| Card | Value | Notes |
|------|-------|-------|
| Team Members | 18 agents | Total agents currently assigned |
| In Session | 3 / 18 | Agents actively in a session right now. [PENDING: confirm backend event availability] |
| Sessions Today | 24 | Completed sessions today (calendar day) |
| Top Language Pair | EN-US → ES-MX | Most used pair in the last 7 days |

### Tab structure

Tabs in order: **Members · Languages · Replies · Settings**

---

## Tab: Members

### Current Members section

- Section title: "Current Members"
- Subtitle: "Agents currently assigned to this team"
- Member count label: "Team Members ([N])"

Each member row:

| Element | Notes |
|---------|-------|
| Avatar | Initials, colored circle |
| Full name | Bold |
| Email | Muted, secondary |
| Status chip | Online (green) · In Session (blue) · Offline — "Last seen X ago" (gray) — **NTH** |
| Remove button | × icon, right-aligned. Triggers confirmation |

Remove confirmation:
- Title: "Remove [Agent Name] from this team?"
- Body: "They will lose access to this team's sessions, languages, and replies."
- Buttons: [Cancel] [Remove]

### Add Members section

- Section title: "Add Members"
- Subtitle: "Select agents to add to this team"
- Search input: placeholder "Search agents..."

Agent list behavior:

| Agent state | Display | Selectable |
|-------------|---------|------------|
| Unassigned, active | Name + email — normal | ✅ Yes |
| Assigned to another team | Name + email + "Assigned to [Team Name]" chip — disabled/muted | ❌ No |
| Inactive | Name + email + "Inactive" chip — disabled/muted | ❌ No |

Note below list: "Only unassigned active agents can be added to a team."

### States

| State | Trigger | Behavior |
|-------|---------|----------|
| No members | Team has no agents | Empty state: "No agents assigned yet. Use the search below to add members." |
| No agents available to add | All agents assigned or inactive | Empty state in search results: "No agents available. All active agents are already assigned to a team." |

---

## Tab: Languages

### Enabled Languages section

- Section title: "Language Configuration"
- Subtitle: "Manage languages enabled for this team"
- Label: "Enabled Languages"

Active languages shown as chips:
- Format: "English - United States (en)" with × to remove
- Removing a language triggers confirmation if there are active sessions using it [PENDING: confirm behavior]

### Add Language section

- Label: "Add Language"
- Dropdown / searchable select: "Select a language to add"
- Only shows languages from the admin-enabled pool that are not already active for this team
- Languages not in the admin pool are not shown or searchable

Note: "Languages are sourced from your organization's language pool. To request additional languages, contact your Admin."

### States

| State | Trigger | Behavior |
|-------|---------|----------|
| No languages configured | Team has no languages | Empty state: "No languages configured yet. Add languages from the pool below." |
| Pool empty | Admin has enabled no languages | Dropdown shows: "No languages available. Contact your Admin." |

---

## Tab: Replies

### Reply Categories section

- Section title: "Reply Categories"
- Subtitle: "Enable or disable reply categories for agents on this team"

Each category row:

| Element | Notes |
|---------|-------|
| Category name | Bold |
| Reply count | "[N] replies" — muted |
| Toggle | On / Off |

- Toggle ON: agents on this team can see and use replies in this category
- Toggle OFF: category hidden from agents on this team immediately
- No CRUD here — category management lives in the Replies page (side panel)

Note: "To create or edit reply categories, go to Replies in the main navigation."

### States

| State | Trigger | Behavior |
|-------|---------|----------|
| No categories in pool | No categories created yet | Empty state: "No reply categories available yet. Go to Replies to create your first category." + "Go to Replies →" link |
| All categories disabled | Supervisor toggled all off | Informational note: "No reply categories are currently enabled for this team. Agents won't see any preset replies." |

---

## Tab: Settings

### Team Information section

- Section title: "Team Information"
- Subtitle: "Update team name and description"

| Field | Type | Notes |
|-------|------|-------|
| Team Name | Text input | Required |
| Description | Textarea | Optional |

- Actions: [Cancel] [Save Changes]
- Supervisor cannot edit supervisor assignment — that field is not shown
- On save success: inline confirmation "Changes saved"
- On save error: inline error "Unable to save changes. Please try again."

### Security & Compliance section

- Section title: "Security & Compliance"

**HIPAA Compliance toggle**

| State | Behavior |
|-------|----------|
| Off → On | Confirmation modal: "Enable HIPAA Compliance?" — "When enabled, this team operates with HIPAA-compliant handling rules. Sessions will not be stored and transcripts will not be saved." — [Cancel] [Enable HIPAA] |
| On → Off | Warning modal: "Disable HIPAA Compliance?" — "Turning off HIPAA compliance means sensitive health information may no longer be protected according to HIPAA standards. This could result in compliance violations. Are you sure you want to continue?" — [Cancel] [Disable HIPAA] |
| Locked by Admin | Toggle visible but disabled. Tooltip: "HIPAA compliance is required for this team. Contact your Admin to change this setting." — **PENDING: confirm hipaa_locked field with dev** |

Rules:
- Change applies to new sessions only. Active sessions continue under previous setting.
- When HIPAA is on: sessions show metadata but no transcript. Export transcript not available.

### SDK Translation Mode section

- Section title: "SDK Translation Mode"
- **PENDING: full definition subject to Dayanna review**

| Option | Description |
|--------|-------------|
| STT + TTS (default) | Sequential pipeline: speech → text → translation → speech |
| S2S — Speech to Speech | Full pipeline in one step. Potentially faster — no benchmark yet |

Rules:
- Change does not apply to active sessions
- Agents must restart the desktop app for the new mode to take effect
- Agent sees a read-only indicator of the active mode in their app status bar

Helper text: "Changes to translation mode take effect after agents restart the desktop app."

---

## Copy Reference

| Element | Text |
|---------|------|
| Page title | Teams |
| Page subtitle | View and manage your teams |
| Search placeholder | Search teams... |
| Empty — no teams | You don't have any teams assigned yet. Contact your Admin to get started. |
| Empty — search no results | No teams match your search. |
| Shield tooltip | HIPAA active — transcripts not stored for this team |
| Members tab — section title | Current Members |
| Members tab — subtitle | Agents currently assigned to this team |
| Add members — section title | Add Members |
| Add members — subtitle | Select agents to add to this team |
| Add members — search placeholder | Search agents... |
| Add members — assigned chip | Assigned to [Team Name] |
| Add members — note | Only unassigned active agents can be added to a team. |
| Remove member — modal title | Remove [Agent Name] from this team? |
| Remove member — modal body | They will lose access to this team's sessions, languages, and replies. |
| Languages — section title | Language Configuration |
| Languages — subtitle | Manage languages enabled for this team |
| Languages — add label | Add Language |
| Languages — add placeholder | Select a language to add |
| Languages — pool note | Languages are sourced from your organization's language pool. To request additional languages, contact your Admin. |
| Replies — section title | Reply Categories |
| Replies — subtitle | Enable or disable reply categories for agents on this team |
| Replies — nav note | To create or edit reply categories, go to Replies in the main navigation. |
| Settings — team info title | Team Information |
| Settings — team info subtitle | Update team name and description |
| Settings — save success | Changes saved |
| Settings — save error | Unable to save changes. Please try again. |
| Settings — compliance title | Security & Compliance |
| Settings — HIPAA enable modal title | Enable HIPAA Compliance? |
| Settings — HIPAA enable modal body | When enabled, this team operates with HIPAA-compliant handling rules. Sessions will not be stored and transcripts will not be saved. |
| Settings — HIPAA disable modal title | Disable HIPAA Compliance? |
| Settings — HIPAA disable modal body | Turning off HIPAA compliance means sensitive health information may no longer be protected according to HIPAA standards. This could result in compliance violations. Are you sure you want to continue? |
| Settings — HIPAA locked tooltip | HIPAA compliance is required for this team. Contact your Admin to change this setting. |
| Settings — SDK section title | SDK Translation Mode |
| Settings — SDK helper text | Changes to translation mode take effect after agents restart the desktop app. |

---

## NTH (Nice to Have — out of MVP scope)

| Feature | Notes |
|---------|-------|
| List view toggle | Cards are default. List toggle for density at scale |
| Status chip on members | Online / In Session / Offline — design now, implement later |
| Team inactive state | Admin-managed. Supervisor only sees active teams |
| Color label per team | Useful at scale. Premature for MVP |
| Filter by language / HIPAA | Useful if supervisor manages many teams |

---

## Open Questions

- [PENDING] Confirm "In Session" backend event availability — affects stat card reliability
- [PENDING] Confirm behavior when removing a language that has active sessions using it
- [PENDING] Confirm `hipaa_locked` field with dev — for Admin-forced HIPAA edge case
- [PENDING] SDK Translation Mode — full definition pending Dayanna review
- [PENDING] Column preference persistence — confirm if tab state (active tab) persists across sessions per user
