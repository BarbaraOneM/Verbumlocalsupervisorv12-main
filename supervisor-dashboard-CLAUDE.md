# Verbum Local — Supervisor Dashboard

Companion to: `/products/verbum-local/CLAUDE.md`
Spec version: v1.1 · March 2026 · Draft — pending stakeholder and engineering review.
Based on: Supervisor Flows v2, RBAC Matrix v3.2, design critique sessions March 2026.

---

## Scope
Supervisor sees data scoped to own assigned teams only.
- Tenant Supervisor → all teams within tenant.
- Org Supervisor → teams within org.
Permissions identical — only data scope differs.

---

## Dashboard header (persistent controls)
| Element | Behavior | Condition |
|---------|----------|-----------|
| **Team filter** | Dropdown/pill tabs: "All teams \| Team A \| Team B". Scopes ALL cards at once. | Only shown if supervisor has >1 team. Hidden for single team (show team name as static text instead). |
| **Date range** | Last 7 days / Last 30 days / Custom. Filters all period metrics. | Always visible. |
| **Last updated** | "↻ Updated 3 min ago" — relative timestamp, top-right. Manual refresh on click. | Always visible. |

---

## Row 1 — Real-time status
*What is happening right now? All values live, not aggregated.*

| Card | Example | Notes |
|------|---------|-------|
| **Teams & Agents** | 2 teams · 12 agents | Clickable → Teams page. |
| **Agents Online** | 8 / 12 online | Ratio logged-in vs total. Label: "Logged in". Green dot on icon. |
| **In Active Session** | 6 / 12 in session | Distinct from online — agent may be logged in but not translating. Label: "Currently translating". [PENDING: confirm event availability in backend] |
| **Active Sessions** | 56 open now | Count of open sessions across all teams. Real-time snapshot. |

---

## Row 2 — Period performance
*How is volume, quality, and behavior trending? All values scoped to date range filter.*

| Card | Example | Notes |
|------|---------|-------|
| **Sessions** | 1,464 completed · 1,520 total · ↓6% | Completed + Total as primary. Delta vs previous period. |
| **Sessions (7d)** | 1,520 · ↓6% vs last week | Delta with color: red = drop, green = growth. |
| **Avg. Session Duration** | 00:23:58 · ↑2% | White card — no special background. |
| **AI Voice Off Rate** | 23% · ↑4% vs last week | Adoption signal, not failure metric. Use **amber** delta when increasing, not red. |

⚠️ AI Voice Off Rate: agents may disable AI Voice for technical, aesthetic, or operational reasons. Do not frame as caused by translation confidence. Amber = something worth investigating, not a confirmed failure.

---

## Bottom panels

**Language Pairs**
Bar chart by language pair (volume). Logarithmic or normalized scale to prevent dominant pairs from collapsing the chart. Quality signals (AI Voice Off %, Avg. Confidence Score) shown on hover or via expandable toggle — not as table columns.

**Reply Usage**
Usage rate (% of sessions with at least one reply) + type breakdown (Preset / Typed / Spoken as stacked bar) + top 5 replies by count.
Empty state: "No reply data yet. Set up your first reply category →"

**Recent Activity + Quick Actions**
Top: session feed. Active sessions first with green "● Live" badge (agent name, language pair, duration, 🔒 if HIPAA). Completed sessions below.
Bottom: state-aware Quick Actions (not static nav duplicates). Examples:
- "View sessions with AI Voice off" if off-rate >30%
- "Add agents to [team]" if a team has no members
- "Export this week's report" always available.

---

## HIPAA visibility
| Location | Indicator | Behavior |
|----------|-----------|----------|
| Dashboard header | 🔒 badge next to team name | Shown when a HIPAA-active team is selected in team filter. |
| Session feed | 🔒 icon on session row | Transcript not available for HIPAA sessions. |

---

## Key design decisions (locked)
- Team filter is global — not per card.
- AI Voice Off Rate moved to Row 2 (period metric, not real-time state).
- Avg. Confidence Score moved to Language Pairs panel for per-pair context.
- Quick Actions are contextual — replace static nav shortcuts from previous design.
- All cards use white background — lavender inconsistency from prior design removed.