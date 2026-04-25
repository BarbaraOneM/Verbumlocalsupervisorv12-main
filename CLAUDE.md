# Verbum Local — Product Context

Companion to: `/onemeta-claude/CLAUDE.md`
Source docs: My_PRD_Local_App, verbum_local_role_model_v2, VerbumLocal_RBAC_Matrixv3_2, VerbumLocal_Supervisor_Dashboard_Spec_v1_1, VerbumLocal_Supervisor_Flows_v2

---

## What it is
Desktop app + web management platform for real-time bilingual translation, built for BPOs and enterprise contact centers.
On-premise deployment — works without CCaaS integration via virtual mic/speaker (Verbum Mic / Verbum Speaker).
Compatible with any platform that uses system mic/speaker inputs: telephony apps, web conferencing (Google Meet, Zoom, etc.), and other audio-based tools.
Strategic position: entry point into OneMeta's broader platform (web features, analytics, CCaaS integrations where available).

**Key differentiator vs Agentis:** Agentis lives inside Genesys Cloud. Local is platform-agnostic — works with any app that uses system audio by routing through Verbum virtual devices.

---

## Design system
Unified across all surfaces (desktop app + web management platform).
Entry point: `/products/verbum-local/design-system/Guidelines.md`
Before writing or editing any UI code, read the relevant guideline files from that folder.

---

## Two surfaces
- **Desktop app** — Agent-only. Real-time translation during calls.
- **Web Management Platform** — Admin, Super Admin, Supervisor. Configuration, monitoring, analytics.

---

## Hierarchy model
3-level structure. Each level sees its children but cannot alter their internal configuration.

| Level | Name | Examples |
|-------|------|----------|
| 0 | OneMeta (platform owner — internal only) | OneMeta |
| 1 | Tenant | Alorica, Invictus, Acme |
| 2 | Organization / Subtenant | Acme Colombia, Acme Mexico |

**Note:** Level 0 is OneMeta as platform owner — has its own web UI for creating and managing tenants, but access is restricted to OneMeta internal users only. The 4 client-facing roles (Super Admin, Admin, Supervisor, Agent) exist at Tenant (L1) and Org (L2) level only.

**Key rules:**
- Tenant can create child organizations. Organizations cannot create children.
- No settings inheritance — each node configures from scratch.
- Horizontal isolation — sibling orgs cannot see each other's data.
- OneMeta (level 0) visibility and edit scope over tenants: [PENDING — confirm what OneMeta can and cannot modify as global admin]

---

## Roles (do not mix)

Hierarchy: **Super Admin → Admin → Supervisor → Agent**

| Role | Surface | Scope |
|------|---------|-------|
| **Super Admin** | Web only | Owner of their level (Tenant or Org). Manages branding, settings, users, teams. Tenant SA can create child orgs; Org SA cannot. |
| **Admin** | Web only | Manages users, teams, languages, and system settings within their level. Cannot modify Super Admins or other Admins — only lower roles (Supervisor, Agent). |
| **Supervisor** | Web only | Monitors sessions and teams. Scoped to assigned teams only. Cannot change system settings or create orgs. |
| **Agent** | Desktop app only | Operational use — translation/sessions. No access to web management platform. |

**Scope rule:** Role + tenantLevel (JWT: tenantId + subTenantId + tenantLevel) = what the user sees.
**Supervisor scope:** Tenant Supervisor sees all teams within tenant. Org Supervisor sees teams within org. Permissions are identical — only data scope differs.

---

## RBAC highlights (key rules per area)

**Users**
- Super Admin / Admin: full CRUD on users at own level.
- Admin cannot change Super Admin or other Admin roles — only lower roles (Supervisor, Agent).
- Supervisor: read-only on user list, no user management.
- Agent: no access to user management.

**Teams**
- Teams exist at both Tenant (L1) and Org (L2) level, local to where they were created.
- Agent: belongs to one team at a time. [PENDING: intent to move to 1-to-many — will impact permission model when implemented]
- Supervisor: can manage more than one team. Can edit team info and assign/remove agents for own teams only. Cannot assign supervisors to teams.
- Admin / Super Admin: do not belong to teams — see all teams within their scope level downward.

**SDK Translation Mode** (team-level setting)
- STT + TTS (default) vs S2S (Speech-to-Speech).
- Configurable by Super Admin, Admin, Supervisor (own teams).
- Changes don't apply to active sessions — agent must restart app.
- Agent sees read-only indicator in desktop app status bar.

**Languages**
- Cascade: Super Admin / Admin configure global catalog → pool → Supervisor selects from pool for own teams.
- Agent: no language management access.

**Replies / Responses**
- Supervisor: full CRUD on categories and replies for own teams.
- SA/Admin: can edit/delete any reply regardless of creator.
- Agent: browse and use only (enabled replies only).

**Branding**
- Both Tenant (L1) and Org (L2) can have their own branding (logo/colors).
- Configurable by Super Admin and Admin at their respective level.

**Sessions**
- Super Admin / Admin: all sessions.
- Supervisor: own teams only.
- Agent: own sessions only. Transcript access blocked if HIPAA is active.

**HIPAA**
- When active on a team: no transcript stored, no transcript access.
- Supervisor sees 🔒 HIPAA badge next to team name in dashboard header.
- Agent decides whether to use auto-greeting in call; Supervisor enables it.

---

## Confirmed architecture rules
- OneMeta edit/delete scope over tenant config: [PENDING — confirm what OneMeta can and cannot modify as global admin]
- No settings inheritance between levels.
- Sibling orgs are horizontally isolated.
- Supervisor scope is always local to their tenant/org.

---

## Navigation by level (web platform)
| Level | Nav tabs |
|-------|----------|
| OneMeta (0) | Dashboard, Sessions, Teams, Users, Tenants, Metrics, Settings |
| Tenant Admin (1) | Dashboard, Sessions, Teams, Users, Organizations, Metrics, Settings |
| Org Admin (2) | Dashboard, Sessions, Teams, Users, Metrics, Settings (no Organizations tab) |

---

## Supervisor Dashboard
See: `/products/verbum-local/supervisor-dashboard-CLAUDE.md`
Current spec: v1.1 (March 2026) — draft, pending stakeholder review.

---

## MVP scope
- Virtual mic/speaker for CCaaS-agnostic operation.
- Real-time transcription both sides (<500ms).
- Bi-directional translation + TTS (<1.5s latency).
- Live bilingual transcript UI.
- Configurable language pairs.
- Secure encrypted streaming (GDPR / HIPAA / SOC2).

## Not yet implemented
- Voice word/tone customization (volume and speed implemented, word not).
- Session history replay (defined, not confirmed for MVP).
- Data consumption definition (pending).

---

## Open items [PENDING]
- Confirm "In Active Session" event availability in backend.
- Edit/pause organization action for Tenant SA: marked TBD.
- Storage / retention policy (7, 15, 30, 90 days): configured from backend only. No UI for this yet.