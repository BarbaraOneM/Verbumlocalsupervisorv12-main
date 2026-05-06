# Screen Spec: User Menu Button

**Product**: Verbum Local — Web Management Platform
**Target user**: All roles (Supervisor, Admin, Super Admin)
**Version**: v1.2
**Status**: Draft · 2026-05-05
**Author**: Barbara Kleiman
**Assumptions**: User menu is a persistent element at the bottom of the side panel, visible to all authenticated roles. Profile Settings is accessible only from this menu — not from the navbar. Activity drawer is fully functional in prototype; "Phase II" chip is a roadmap signal for stakeholders only. Users cannot have multiple roles across tenants. Based on Alorica Revolt production reference.

---

## 1. Purpose & Goal

Provides quick access to the user's identity context, profile settings, activity log, and logout — without leaving the current screen. Acts as the primary anchor for account-level actions across the platform.

---

## 2. Location & Trigger

- **Location**: Bottom of the left side panel, persistent across all screens
- **Trigger**: Click on the user element (avatar + name + email)
- **Behavior**: Opens a popover anchored to the bottom-left

---

## 3. User Menu — Anatomy

### Collapsed state (always visible in side panel)

| Element | Content | Notes |
|---------|---------|-------|
| Avatar / initials | User's initials (e.g., "MV" for Morgan Vance) | Circle, colored background |
| Name | Full name | Truncated if long |
| Email | Account email | Truncated with ellipsis |
| Expand indicator | Chevron (up/down) | Indicates clickable |

---

### Expanded state (popover on click)

**Header block** (non-interactive):
- Avatar with initials
- Full name (bold)
- Email
- Role tag — pill with role label and defined styles (see Role Tag Styles below)

**Menu items:**

| Item | Icon | Behavior | Phase |
|------|------|----------|-------|
| Profile Settings | Person icon | Navigates to Profile Settings page. Only entry point — not in navbar. | MVP |
| Activity `Phase II` | Clock / history icon | Opens Activity drawer (right side, over current screen). Fully functional in prototype. "Phase II" chip is a roadmap signal only. | Phase II |
| Log out | Arrow-out icon | Ends session → redirects to login | MVP |

> **Order**: Profile Settings → Activity → Log out. Log out always last, visually separated with a divider.

---

### Role Tag Styles

Defined colors use existing design system tokens. All three share the same indigo family — weight communicates hierarchy.

| Role | Background | Text | Rationale |
|------|-----------|------|-----------|
| Supervisor | `#C7D2FE` | `#3730A3` | Light fill — most common role on this surface. Contrast ratio ~4.6:1 (passes WCAG AA). Revisit if contrast feels insufficient in Figma. |
| Admin | `#4023FF` | `#FFFFFF` | Filled accent — higher hierarchy |
| Super Admin | `#1A0A99` | `#FFFFFF` | Dark accent — maximum hierarchy |

---

## 4. Logout Behavior

- Click "Log out" → ends session immediately, redirects to login screen
- No confirmation modal — logout is reversible (user can log back in)

---

## 5. Activity Drawer — `Phase II`

### Overview

Accessed from the user menu. Opens as a right-side drawer over the current screen without navigating away. Fully functional in prototype.

**Label by role:**
- Supervisor → **"Activity"** (operational, day-to-day follow-up)
- Admin / Super Admin → **"Audit Log"** (formal compliance and accountability scope)

**Scope**: all configuration actions that affected the Supervisor's teams, regardless of who performed them. Session events (started, ended, etc.) are excluded — those live in Dashboard / Recent Activity and Sessions.

### Drawer anatomy

- **Header**: "Activity" (or "Audit Log" per role) + close button (X)
- **Filter bar**: Action type (dropdown) + Date range (dropdown)
- **Log list**: Chronological, newest first. No expandable rows.
- **Close behavior**: X button · Esc key · click outside drawer

---

### Entry format by object type

**Teams** — actor-first:
> `[Actor]` `[action]` `[object]` in `[Team]` · `[Date, Time]`
> — `Ana Torres` removed `Carlos Méndez` from `Team Alpha` · May 5, 3:42 PM
> — `Ana Torres` enabled HIPAA compliance on `Team Alpha` · May 5, 3:42 PM
> — `Ana Torres` renamed team `Team Alpha` to `North Squad` · May 5, 3:42 PM

**Replies & Categories** — action-first:
> `[Action]` · `"[Reply or category title]"` in `[Category]` by `[Actor]` · `[Date, Time]`
> — Reply edited · `"Welcome back"` in `Greetings` by `Ana Torres` · May 5, 3:42 PM
> — Category created · `"Greetings"` by `Ana Torres` · May 5, 3:42 PM
> — Reply deleted · `"Thanks for calling"` in `Closings` by `Ana Torres` · May 5, 3:42 PM

**Language pool changes:**
> `[Action]` · `[Language code]` `[added to / removed from]` `[Team]` by `[Actor]` · `[Date, Time]`
> — Language added · `ES-MX` added to `Team Alpha` by `Ana Torres` · May 5, 3:42 PM
> — Language removed · `FR-FR` removed from `Team Alpha` by `Ana Torres` · May 5, 3:42 PM

**Own account actions** — no actor (implicit: self):
> `[Action]` · `[Date, Time]`
> — Password changed · May 5, 3:42 PM
> — Display language changed · `English → Spanish` · May 5, 3:42 PM

---

### Entry types tracked

| Area | Events |
|------|--------|
| Replies | Created · Edited · Deleted · Enabled · Disabled |
| Categories | Created · Edited · Deleted · Enabled / disabled for a team |
| Auto Greeting | Assigned to team · Changed · Removed from team |
| Teams | Member added · Member removed · Name/description edited · HIPAA enabled · HIPAA disabled |
| Language pool | Language added to team · Language removed from team |
| Own account | Password changed · Display language changed |

> **Excluded:** session events (covered by Dashboard + Sessions) and role changes (Admin/SA scope only).

---

### Scope by role

| Role | Sees | Drawer label |
|------|------|-------------|
| Supervisor | All actions affecting their assigned teams + own account actions | "Activity" |
| Admin | Org-wide: all teams, supervisors, users within the org | "Audit Log" |
| Super Admin | Global: all tenants | "Audit Log" |

---

### Filters

| Filter | Options |
|--------|---------|
| Action type | All · Replies · Categories · Teams · Languages · Account |
| Date range | Last 7 days · Last 30 days · Custom |

---

### States

| State | Behavior |
|-------|----------|
| Loading | Skeleton list while fetching |
| Empty — no activity | "No activity to show for this period." |
| Empty — filters applied | "No results match your filters. Try adjusting the date range or action type." |
| Error | "Couldn't load activity. Please try again." + retry link |

---

### Open questions

- [ ] **Retention** — How far back does history go? Is there a retention limit? [Dev]
- [ ] **Export** — Is exporting the activity log needed for compliance in Admin/SA scope? Out of scope for Supervisor drawer. [PM]

---

## 6. Edge Cases & Business Rules

- User menu is always visible — cannot be hidden or collapsed independently of the side panel
- Role tag reflects the user's product role, not the platform tier (e.g., "Supervisor", not "L1")
- Users cannot have multiple roles across tenants — role tag always reflects the single active role
- Drawer does not navigate away from the current screen — it overlays it

---

## 7. Copy & Labels

| Element | Copy | Notes |
|---------|------|-------|
| Menu item: profile | "Profile Settings" | |
| Menu item: activity | "Activity" | Supervisor view. Admin/SA see "Audit Log" |
| Menu item: logout | "Log out" | Two words, lowercase "out" |
| Role tag: Supervisor | "Supervisor" | bg `#C7D2FE` · text `#3730A3` |
| Role tag: Admin | "Admin" | bg `#4023FF` · text `#FFFFFF` |
| Role tag: Super Admin | "Super Admin" | bg `#1A0A99` · text `#FFFFFF` |
| Drawer title (Supervisor) | "Activity" | |
| Drawer title (Admin / SA) | "Audit Log" | |
| Drawer empty state | "No activity to show for this period." | |
| Drawer error | "Couldn't load activity. Please try again." | |
| Filter: action type | "Action type" | |
| Filter: date range | "Date range" | |

---

## 8. Open Questions

- [ ] **Avatar background color** — Random per user, role-based, or fixed? [Design]

---

## Appendix

- Related screens: Profile Settings (`spec-supervisor-profile-settings.md`)
- Reference: Alorica Revolt — User menu (production, bottom of side panel)

---

*v1.1 — 2026-05-05: Activity confirmed fully functional in prototype. "Phase II" chip is roadmap signal only. Profile Settings confirmed as sole entry point (not in navbar).*
*v1.2 — 2026-05-05: Added role tag color definitions (Supervisor `#C7D2FE`/`#3730A3` · Admin `#4023FF` · SA `#1A0A99`). Confirmed "Activity" for Supervisor, "Audit Log" for Admin/SA. Confirmed no multi-tenant roles. Removed logout confirmation open question (confirmed: no modal). Removed export from Supervisor scope (Admin/SA only). Removed related tickets and design files from Appendix.*
