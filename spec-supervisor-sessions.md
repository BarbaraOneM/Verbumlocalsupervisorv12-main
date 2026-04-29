# Spec: Supervisor — Sessions Screen

**Product:** Verbum Local
**Surface:** Web Management Platform
**Role:** Supervisor
**Status:** Draft
**Related:** `/products/verbum-local/CLAUDE.md` · `supervisor-dashboard-CLAUDE.md` · VerbumLocal_RBAC_Matrixv3_2

---

## Purpose

Allows Supervisors to view, filter, and export sessions scoped to their assigned teams. Primary use cases: reviewing transcripts, searching by keyword or agent, identifying long sessions or problematic language pairs, and auditing translation quality over time. Complements the Dashboard — Dashboard is for real-time alerts and aggregated metrics; Sessions is for investigation and historical detail.

---

## Permissions

| Action | Supervisor |
|--------|------------|
| View sessions | Own teams only |
| View transcript | Blocked if HIPAA active on team |
| Export sessions (CSV, TXT & PDF (Individual sessions only)) | Own teams only |
| Delete sessions | No |
| View sessions from other teams or orgs | No |

---

## Screen layout

### Header
- Page title: "Sessions"
- Subtitle when filtered to a specific team: "Viewing sessions for [Team Name]"

### Filters
All filters are cumulative. Resetting returns all filters to their default values.

| Filter | Options | Default |
|--------|---------|---------|
| Team | Dropdown: All teams · Team A · Team B — shown only if Supervisor has >1 team | All teams |
| Date range | Displays actual date range (e.g. `Apr 21 – Apr 28`). Options: Last 7 days · Last 30 days · Custom. Active filter shown with highlighted/colored state. | Last 7 days — dates written out |
| Agent language | All Languages · [language list] | All Languages |
| Customer language | All Languages · [language list] | All Languages |
| Search | Text input: "Session ID or keyword" | Empty |
| Reset | Clears all filters to defaults | — |

### Session table

- Default sort: Start Time descending (most recent first)
- Sortable columns: Session ID · Agent · Status · Language Pair · Duration · Start Time
- Non-sortable columns: Team · AI Voice · HIPAA · Actions
- Active sessions pinned to top with "● Live" badge regardless of sort order
- Clicking a row opens Session Detail modal
- Each row also has explicit action buttons (see Actions column)
- Pagination: "Showing 1–20 of [N] sessions · Page 1 of [N]"

#### Columns

| # | Column | Type | Notes |
|---|--------|------|-------|
| 1 | Session ID | Fixed | Short format: `#88291` |
| 2 | Agent | Fixed | Agent name |
| 3 | Status | Fixed | Badge: "● Live" (green) · "Completed" |
| 4 | Start Time | Fixed | Format: `Mar 30, 2026 15:54` |
| 5 | Team | Togglable — default visible | Most useful in All teams view |
| 6 | Language Pair | Togglable — default visible | Format: `EN-US → ES-MX` |
| 7 | Duration | Togglable — default visible | Format: `HH:MM:SS` |
| 8 | AI Voice | Togglable — default visible | Speaker icon: active / muted (red). Renamed from Opt-Out. |
| 9 | HIPAA | Togglable — default visible | Shield icon (colored): HIPAA active · Dash (—): HIPAA inactive |
| 10 | Actions | Fixed | View detail · Download transcript |

#### Column visibility control
- "Columns" button — top right of table, left of Export
- Opens a dropdown checklist of all togglable columns
- Fixed columns listed but disabled — cannot be hidden
- Last configuration saved per user, persists across sessions

---

## Screen states

| State | Trigger | Behavior |
|-------|---------|----------|
| Loading | Page load or filter change | Skeleton rows |
| List — active sessions | Sessions currently in progress | "● Live" badge (green), pinned to top |
| List — completed sessions | Sessions ended | "Completed" badge, standard row |
| HIPAA session | Team has HIPAA active | Shield icon in HIPAA column. Transcript not accessible in detail. |
| Empty — no sessions | No sessions match current filters | Empty state message + Reset CTA |
| Empty — no teams assigned | Supervisor has no teams | Blocking empty state — no table shown |
| Session detail | Row click or View button | Session Detail modal |

---

## Session detail

Opens as a modal. Keeps the sessions list visible behind it, preserving filter context. Transcript is read-only and available only after the session has ended — no real-time updates.

### Modal header

| Element | Behavior | HIPAA condition |
|---------|----------|-----------------|
| Title | "Session Details" | Lock icon shown next to title |
| Session ID | Always visible | — |
| Status badge | Completed / Live | — |
| Agent name | Always visible | — |
| Team | Always visible | — |
| Start Time + End Time | Always visible | — |
| Duration | Always visible | — |
| Language pair | Always visible | — |
| AI Voice status | Always visible | — |
| Share button | Copies a direct link to this session. Recipient lands on the session detail page. | — |
| Export button | Exports session metadata as CSV, TXT & PDF. Transcript not included. | Same — metadata only, no transcript |

### Session summary block
Shown above the transcript. Gives a quick quality snapshot before reading the full conversation. Hidden when HIPAA is active.

- Total messages in session
- Agent vs. customer message ratio (e.g. Agent 60% · Customer 40%)
- % of messages with confidence score below 40%

### AI Voice OFF banner
Shown between the modal header and transcript body when AI Voice was disabled during the session. Visible to Supervisor as contextual information. Shown when HIPAA is active.

- Icon: muted speaker (red)
- Shows: "AI Voice: OFF" · timestamp of when it was disabled · "Reason: [reason]"

### Transcript

Single scrollable container — one scroll for the entire transcript, no per-message scroll. Each message card shows: speaker label (AGENT / CUSTOMER), timestamp, confidence score with color coding, original text, translation.

| Element | Behavior |
|---------|----------|
| Confidence score color | Green 2 (#0E9E6E): 90%+  ·  Green 1 (#10B981): 70-89%  ·  Yellow (#F59E0B): 50–69%  ·  Red (#DC2626.): below 49% |
| Jump to low confidence | Scrolls to first message with confidence below 40%. Subsequent clicks advance to the next. |
| Search transcript | Keyword search, highlights matching text. Works in Combined and Dual Stream views. |
| Combined view (default) | All messages in a single chronological stream interleaved by timestamp. Best for reading conversation narrative. |
| Dual Stream view | Agent Stream and Customer Stream side by side. Synchronized scroll — both columns advance together by timestamp. Best for analyzing response gaps, message balance, and confidence distribution by side. |
| Scroll to latest | Jumps to the most recent message. |

### Transcript — HIPAA state

| Element | Default | When HIPAA is active |
|---------|---------|----------------------|
| Modal title icon | None | Lock icon |
| Transcript body | Full bilingual transcript, read-only | Hidden — shield icon + blocked message |
| Search transcript | Available | Not shown |
| Combined / Dual Stream toggle | Available | Not shown |
| Jump to low confidence | Available | Not shown |
| Session summary block | Visible | Hidden |
| AI Voice OFF banner | Shown if applicable | Shown if applicable |

### Modal states

| State | Trigger | Behavior |
|-------|---------|----------|
| Loading | Modal opens, data not yet available | Spinner in transcript area. Header metadata loads first if available. |
| Loaded — standard | Session data available, no HIPAA | Full transcript with all controls |
| Loaded — AI Voice OFF | Session had AI Voice disabled | AI Voice OFF banner shown above transcript. Transcript fully accessible. |
| Loaded — HIPAA | Team has HIPAA active | Lock icon in title. Transcript replaced with shield icon + blocked message. No transcript controls shown. |
| Error | Session data failed to load | Error icon + title + message + Retry button. Header metadata persists if already loaded. |

---

## Behavior specifications

### Sorting
- Default: Start Time descending
- Sortable: Session ID · Agent · Status · Language Pair · Duration · Start Time
- Live sessions always pinned to top regardless of sort
- Non-sortable: Team · AI Voice · HIPAA · Actions

### Column visibility
- Default: all columns visible
- Fixed columns cannot be hidden — shown as disabled in Columns dropdown
- Togglable columns can be hidden individually
- Last configuration saved per user, persists across sessions
- If Supervisor has only one team, Team column still appears but Team filter is not shown

### Export
- Export button (top right) exports all sessions matching the current filter state as CSV and TXT
- Bulk export never includes transcripts, regardless of HIPAA status
- Individual session export (per row or modal footer) exports that session's metadata as CSV, TXT and PDF
- If export is large: informational toast shown, Export button enters loading state while processing

### Filters
- All filters are cumulative
- Date range filter always shows actual dates (e.g. `Apr 21 – Apr 28`), not just the preset label
- Active filters shown with highlighted/colored state so the Supervisor always knows what they are looking at
- Team filter only shown if Supervisor manages more than one team
- Reset returns all filters to defaults and reloads the full session list

### Pagination
- 20 rows per page
- Format: "Showing 1–20 of [N] sessions · Page 1 of [N]"
- Navigating pages does not reset filters or sort order

---

## Edge cases

- Supervisor assigned to a mix of HIPAA and non-HIPAA teams: HIPAA restriction applies per session row, not globally.
- In "All teams" view, Team column defaults to visible since rows span multiple teams.
- If Supervisor has only one team assigned, Team filter is not shown.
- If a Supervisor is removed from a team, access to that team's sessions is revoked immediately. Historical sessions are no longer visible. Revisit in a future phase if audit access becomes a requirement.
- Column visibility preference saved per user, persists across sessions.
- Export format: CSV, TXT & PDF (Individual sessions only).
- Transcript is read-only, available only after session ends.
- Default date range is Last 7 days — displayed as actual dates. If no sessions exist in that period, empty state is shown with Reset CTA. Supervisor can widen the range manually.

---

## Copy reference

| Element | Text |
|---------|------|
| Page title | Sessions |
| Subtitle — team view | Viewing sessions for [Team Name] |
| Empty state — no sessions | No sessions yet for this period. Adjust your filters or check back later. |
| Empty state — no teams | You don't have any teams assigned yet. Contact your Admin to get started. |
| HIPAA column tooltip — active | HIPAA mode is active for this team |
| HIPAA column tooltip — inactive | HIPAA mode is not active for this team |
| AI Voice tooltip — active | AI Voice was enabled for this session |
| AI Voice tooltip — off | AI Voice was disabled for this session |
| Export CTA | Export |
| Columns toggle CTA | Columns |
| Live badge | ● Live |
| Completed badge | Completed |
| Date range options | Last 7 days · Last 30 days · Custom |
| Search placeholder | Session ID or keyword |
| Reset filters | Reset |
| Pagination | Showing 1–[N] of [N] sessions · Page [N] of [N] |
| Large export — notification title | Processing Large Export |
| Large export — notification body | Your file contains a high volume of data and may take a few minutes to generate. Please keep this tab open to ensure the download starts successfully. |
| Modal — search placeholder | Search transcript... |
| Modal — share button | Share |
| Modal — share confirmation | Link copied to clipboard |
| Modal — scroll to latest | Scroll to latest |
| Modal — jump to low confidence | Jump to low confidence |
| Modal — Combined view label | Combined |
| Modal — Dual Stream view label | Dual Stream |
| Modal — Dual Stream agent column | Agent Stream ([N] lines) |
| Modal — Dual Stream customer column | Customer Stream ([N] lines) |
| Modal — HIPAA blocked title | Transcript hidden for security |
| Modal — HIPAA blocked body | HIPAA mode was active during this session. Transcript is not available to protect patient privacy. |
| Modal — error title | Unable to load session details |
| Modal — error body | There was a problem retrieving this session. Please try again. |
| Modal — error retry button | Retry |
| Modal — close button | Close |
| Modal — AI Voice OFF banner label | AI Voice: OFF |
| Modal — AI Voice OFF banner reason prefix | Reason: |

---

## Open questions

- [PENDING: Confirm if "In Active Session" backend event is available — affects Live badge reliability]
- [PENDING: Confirm max date range for Custom export]
- [PENDING: Confirm Accuracy % is calculable per session from backend]
