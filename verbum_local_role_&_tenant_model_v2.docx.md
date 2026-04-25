**Verbum Local — Role & Tenant Model**

*v2 · March 2026 · For validation with dev team and stakeholders*

# **1\. Hierarchy overview**

Verbum Local operates on a 3-level hierarchy. Each level can see its children but cannot alter their internal configuration. The main structural difference between a Tenant and an Organization is that tenants can create child organizations, while organizations cannot create further children.

| Level | Name | Examples | Description |
| ----- | :---- | :---- | :---- |
| **0** | **Onemeta** | onemeta.ai | Platform owner. Global visibility, read-only access over tenants. |
| **1** | **Tenant** | Alorica, Invictus, Acme | Client company. Can create child organizations. Shared or dedicated instance. |
| **2** | **Organization / Subtenant** | Acme Colombia, Acme Mexico | Department or branch. Lowest level — cannot create children. |

# **2\. Role definitions**

Verbum Local has 4 product roles: Super Admin → Admin → Supervisor → Agent. All 4 roles exist at both Tenant (L1) and Organization (L2) level. The Platform Super Admin is not a product role — it represents the Onemeta operator level (infrastructure only). The scope of each role is limited by the JWT (tenantId \+ subTenantId \+ tenantLevel).

| Role | Level | Main responsibilities |
| :---- | :---- | :---- |
| **Platform Super Admin** | Onemeta only (level 0\) — infrastructure, not a product role | Operates the Onemeta platform. Creates and manages tenants. Read-only visibility over all tenants and organizations. Cannot access or edit private client data. This role does not exist within Tenant or Organization levels. |
| **Super Admin** | Tenant (L1) and Organization (L2) | Full control within their level (god mode). Manages users, teams, settings, branding, languages, and replies. Tenant Super Admin can create child organizations. Org Super Admin cannot. Can change roles of Admin, Supervisor, and Agent — not other Super Admins. |
| **Admin** | Tenant (L1) and Organization (L2) | Manages users, teams, languages, and system settings within their level. Cannot modify Super Admins or other Admins — only equal or lower roles. Cannot create child organizations. |
| **Supervisor** | Tenant (L1) and Organization (L2) | Oversees assigned teams — agents, sessions, replies, and compliance. Scoped to their level only. Cannot create organizations or change system settings. Web admin panel only. |
| **Agent** | Tenant (L1) and Organization (L2) | End user. Operational use (translation/sessions). Desktop app only. No access to the web admin panel. |

# **3\. Navigation by level**

The admin panel navigation changes depending on the user's tenantLevel. The key difference: Onemeta sees 'Tenants', tenant admins see 'Organizations', org admins see neither tab.

| Onemeta (level 0\) | Tenant admin (level 1\) | Org admin (level 2\) |
| :---- | :---- | :---- |
| Dashboard, Sessions, Teams, Users, Tenants, Metrics, Settings | Dashboard, Sessions, Teams, Users, Organizations, Metrics, Settings | Dashboard, Sessions, Teams, Users, Metrics, Settings (no Organizations tab) |

# **4\. RBAC matrix**

Abbreviations: SA \= Super Admin, Sup. \= Supervisor. See legend below the table.

| Action | OneMeta | Tenant SA | Tenant Admin | Tenant Sup. | Tenant Agent | Org SA | Org Sup. |
| :---- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| **Structure / Hierarchy** |  |  |  |  |  |  |  |
| **Create tenant** | **Yes** | No | No | No | No | No | No |
| **View tenant list** | Read-only | No | No | No | No | No | No |
| **Create organization / subtenant** | No | **Yes** | No | No | No | No | No |
| **View child organizations** | Read-only | **Yes** | **Yes** | No | No | N/A | N/A |
| **Edit / pause organization** | No | **TBD** | **TBD** | No | No | No | No |
| **Users & Roles** |  |  |  |  |  |  |  |
| **View users in own scope** | Read-only | **Yes** | **Yes** | Read-only | No | **Yes** | Read-only |
| **Create users** | No | **Yes** | **Yes** | No | No | **Yes** | No |
| **Assign roles** *Equal or lower only* | No | **Yes** | **Yes** | No | No | **Yes** | No |
| **Add / remove users from team** | No | **Yes** | **Yes** | **Yes** | No | **Yes** | **Yes** |
| **Teams** |  |  |  |  |  |  |  |
| **View teams** | No | **Yes** | **Yes** | **Yes** | No | **Yes** | **Yes** |
| **Create teams** | No | **Yes** | **Yes** | No | No | **Yes** | No |
| **Edit team details** *Sup: assigned teams only* | No | **Yes** | **Yes** | **Yes** | No | **Yes** | **Yes** |
| **Sessions & Metrics** |  |  |  |  |  |  |  |
| **View sessions** | Read-only | **Yes** | **Yes** | **Yes** | Own | **Yes** | **Yes** |
| **Export sessions** *Sup: own teams only* | Read-only | **Yes** | **Yes** | **Yes** | No | **Yes** | **Yes** |
| **View metrics (own scope)** | Read-only | **Yes** | **Yes** | **Yes** | No | **Yes** | **Yes** |
| **View child metrics** | Read-only | **Yes** | **Yes** | No | No | N/A | N/A |
| **View language pair usage** *Sup: own teams only* | Read-only | **Yes** | **Yes** | **Yes** | No | **Yes** | **Yes** |
| **Settings & Configuration** |  |  |  |  |  |  |  |
| **Edit branding** | No | **Yes** | **Yes** | No | No | **Yes** | No |
| **Configure languages / voices** | No | **Yes** | **Yes** | No | No | **Yes** | No |
| **System settings** | No | **Yes** | **Yes** | No | No | **Yes** | No |
| **View cross-tenant data** | Read-only | No | No | No | No | No | No |

**Legend**

| Yes / Full | Action fully permitted | No / N/A | Action not permitted or not applicable |
| :---- | :---- | :---- | :---- |
| **Read-only** | Can view but not edit | **TBD** | Pending confirmation from dev / stakeholders |
| **Own** | Own sessions / data only | **SA** | Super Admin |

# **5\. Confirmed rules**

The following rules are confirmed from dev team responses and meeting transcripts.

| Rule | Detail |
| :---- | :---- |
| **Data autonomy** | Onemeta can never perform DELETE or UPDATE on internal configuration of any tenant or organization. |
| **No settings inheritance** | Each node configures its own settings from scratch. No inheritance from parent to child. |
| **Horizontal isolation** | Sibling organizations cannot see each other's data. E.g., Acme Colombia cannot see Acme Mexico's data, even though they share the same parent tenant. |
| **Supervisor scope** | Supervisors are local to their tenant/org. They do not affect other levels or sibling nodes. |
| **Teams visibility for Onemeta** | Onemeta cannot see internal teams of tenants (compliance). It can see aggregated metrics only. |
| **Organizations \= lowest level** | Organizations cannot create child organizations. The UI must hide the Organizations tab at this level. |
| **Session context (JWT)** | Permissions are validated by tenantId \+ subTenantId \+ tenantLevel (onemeta | tenant | subtenant). What a user sees \= role \+ tenantLevel combined. |
| **New tenant onboarding** | Creating a tenant includes in the same step: name, slug, contact email, and first admin user. Pending: branding (logo/colors) via Azure Storage. |

# **6\. Open points — needs validation**

The following items are still open and need explicit confirmation from dev / stakeholders before finalizing documentation or implementation.

| Open point | Context / question for validation |
| :---- | :---- |
| **User 1-to-many membership** | Agent currently belongs to 1 team at a time (1-to-1). Supervisor can manage more than 1 team. Admin/Super Admin do not belong to teams — they see their full scope downward. Intent to move Agent to 1-to-many is confirmed; implementation pending — will impact permission model when done. |
| **Edit / pause organization** | Can the Tenant Super Admin edit, pause, archive, or deactivate child organizations? Needs dev confirmation — involves backend state logic. |
| **Teams: scope and visibility** | Confirmed: teams exist at both Tenant (L1) and Org (L2) level, local to where they were created. |
| **Onemeta platform-level actions** | Currently read-only over tenant config. Whether OneMeta needs platform-level actions (pause tenant, suspend, support mode/impersonation) is pending confirmation. |
| **Branding at Organization level** | Confirmed: both Tenant (L1) and Org (L2) can have their own branding (logo/colors). |

# **7\. Executive summary**

**Proposed model:**

* Onemeta is the platform-level parent. It has read-only visibility across all tenants and organizations. It cannot edit internal configuration of any client. The Platform Super Admin is infrastructure — not a product role.

* Verbum Local has 4 product roles: Super Admin, Admin, Supervisor, and Agent. All 4 exist at both Tenant (L1) and Organization (L2) level.

* Super Admin has full control within their level. Admin manages users, teams, and settings but cannot modify Super Admins. Supervisor oversees assigned teams only. Agent uses the desktop app only — no web admin access.

* Tenants and Organizations use the same role model and menus. The main structural difference is that Tenants can create child Organizations; Organizations cannot create further children.

* Permissions are defined by: role \+ scope \+ hierarchy level (JWT claims).

* Settings are local to each node — no inheritance from parent to child.

* Horizontal isolation is enforced: sibling organizations cannot see each other's data.

**Note:** User 1-to-many membership is currently 1-to-1 in implementation but intended to change. When implemented it will impact the permission validation model.

*Verbum Local — Role & Tenant Model v1 · March 2026 · Internal draft for validation*