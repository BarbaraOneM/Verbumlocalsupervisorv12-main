You are designing a web admin panel called VerbumLocal Supervisor Panel — a real-time translation management tool used in call center environments, built by OneMeta.
You have access to the VerbumLocal design system guidelines (already uploaded). Follow them strictly for colors, typography, spacing, components, and interaction states.

PRODUCT CONTEXT
This panel is used by supervisors to manage their call center teams, monitor translation sessions in real time, and review historical session data. The supervisor belongs to a tenant (a company like "Nexbridge"). The panel is white-labeled per tenant.

DESIGN SYSTEM — KEY TOKENS (apply these, don't invent alternatives)
Font: Poppins (400, 500, 600)
Grid: 8pt base

Primary:        #4023FF  (dark mode: #5e61ff)
Primary light:  rgba(64,35,255,0.12)
Success:        #10B981
Error:          #DC2626
Warning:        #F59E0B
Client/User:    #FF9332
HIPAA badge:    #5B5FF2

Background:     #F3F4F6
Surface:        #FFFFFF
Border:         #E5E7EB
Text primary:   #1F2937
Text secondary: #6B7280
Text muted:     #9CA3AF

Border radius — buttons: 8px / cards: 10–12px / badges: 4px / pills: full
Sidebar nav buttons: border-2, border-transparent (inactive), border-primary (active)

BRANDING PATTERN
* Top of sidebar: VerbumLocal “L” logo icon (navy #4023FF square, rounded 8px) + tenant name ("Nexbridge") + "Admin Panel" label in muted uppercase
* Footer of sidebar: user avatar (initials) + name + role "Supervisor" + chevron
* Footer of login page: "A product by OneMeta"
* Do NOT use "Alorica" or any real company name. Use "Nexbridge" as the fictional tenant throughout.

SIDEBAR (expanded state — use this as default)
Left sidebar, 220px wide, white background, border-right. Navigation groups:
Platform:
* Dashboard (grid icon)
* Sessions (table icon)
* Teams (people icon)
Settings:
* Profile Settings (gear icon)
Active state: primary color background tint + primary border. Inactive: transparent border, gray icon/text.

PAGES TO DESIGN — build all of these:
1. Login
* Centered card on gray background (#F3F4F6)
* Top of card: VerbumLocal logo icon + "Nexbridge" + "Admin Panel" label
* Divider
* Title: "Sign in" / Subtitle: "Enter your credentials to continue"
* Fields: Email address (with envelope icon), Password (with lock icon + show/hide toggle)
* Row: "Remember me" checkbox + "Forgot password?" link in primary color
* CTA button: full-width, primary (#4023FF), "Sign in"
* Footer outside card: "A product by OneMeta" with small dot accent in primary
2. Dashboard
* Sidebar expanded (default)
* Header: breadcrumb "Nexbridge › Admin Panel" + page title "Dashboard" + welcome "Welcome back, Morgan" + HIPAA Inactive badge (top right)
* KPI row 1 (4 cards): My Teams / Team Agents / Active Sessions / Total Sessions
* KPI row 2 (4 cards): Sessions (7d) / Completed Sessions / Paused Sessions / Avg. Duration (this one uses primary color tint bg)
* Bottom row (3 columns): Top Language Pairs (with inline bar chart) / Quick Actions (4 items with icon + title + subtitle + chevron) / Recent Activity (5 rows with dot + session ID + timestamp + "Completed" pill)
3. Sessions (list)
* Sidebar expanded, Sessions nav item active
* Page title "Sessions" + subtitle "Viewing sessions for [Team Name]"
* Filters bar: Search input + Export button (secondary)
* Table columns: Session ID / Agent / Team / Status / Opt-Out / Language Pair / Duration / Start Time
* Status badge: "completed" in green pill
* Language pair: shown as "EN-US → ES-MX" chips
* Pagination at bottom
* 10–12 rows of fictional data
4. Session Details
* Full page (not modal), back navigation arrow + "Session Details" title + session ID as subtitle
* Share + Export buttons top right
* Top card: Agent name / Team name / Start Time / End Time / Duration / Language Pair + "completed" badge
* Transcript section below: search bar + Combined / Dual Stream toggle (segmented control)
* Combined view default: chronological messages, AGENT (blue, left-aligned) and CUSTOMER (orange, right-aligned), each with: label badge, timestamp, confidence %, original text (italic, muted), translation (bold)
* Dual Stream: two-column layout, Agent Stream left / Customer Stream right
5. Teams (list)
* Sidebar expanded, Teams nav item active
* Page title "Teams" + subtitle "View and manage your teams"
* Search input + grid/list view toggle
* Card per team: team name / description / supervisor name + "Supervisor" label / agent count / language count / member avatar stack + "+N more" / "Active" green badge
* 1–2 fictional teams
6. Team Details
* Back navigation + team name as title + description as subtitle
* Stats row: Team Members / Active Sessions / Total Sessions (3 small KPI cards)
* Two tabs: "Team Details" (active) and "Members (12)" Team Details tab:
    * Team Information section: Team Name field / Description textarea / Supervisor field / Save Changes + Cancel buttons
    * Language Configuration section: subtitle "Manage languages enabled for this team from System Settings" / multi-tag input showing enabled languages as removable chips / Add Language dropdown / Note: "Languages are sourced from System Settings..."
* Members tab:
    * "Current Members" section: list of agents with avatar + name + email + remove (×) button
    * "Add Members" section: search agents input + empty state "No agents found" with icon
    * Note at bottom: "Only active agents are available for selection..."
7. Profile Settings
* Sidebar expanded, Profile Settings nav item active
* Page title "Profile Settings" + subtitle "Manage your account information and preferences"
* Card 1 — Personal Information: subtitle "Your account information (read-only)" / First Name + Last Name fields (disabled/read-only style) / Email field (read-only)
* Card 2 — Change Password: subtitle "Update your password to keep your account secure" / Current Password / New Password (with helper "Password must be at least 8 characters") / Confirm New Password / "Change Password" button (primary)

GENERAL RULES
* All pages share the same sidebar (expanded, 220px)
* Use Poppins throughout
* No gradients, no heavy shadows — clean flat surfaces
* Cards: white bg, 1px border #E5E7EB, border-radius 10–12px
* Inputs: border #D1D5DB, border-radius 8px, focus border #4023FF
* All fictional data must be consistent across pages (same agent names, same session IDs where referenced)
* The design should feel like a professional SaaS admin panel — clean, functional, no decorative noise
* Dark mode is NOT required for this first pass