# Screen Spec: Profile Settings

**Product**: Verbum Local — Web Management Platform
**Target user**: All roles (Supervisor, Admin, Super Admin)
**Version**: v1.2
**Status**: Draft · 2026-05-05
**Author**: Barbara Kleiman
**Assumptions**: Display Language controls the UI language of the platform (not reply language) and is sourced from the i18n language list. Personal info is read-only for all roles — editable only by Admin/SA from the Users screen. Profile Settings is not in the side panel navbar — accessible only from the user menu. Agent App is developed separately; this spec applies to the web management platform only. Alorica Revolt used as production reference.

---

## 1. Purpose & Goal

Allows any authenticated user to view their account information, update their password, and set their preferred platform display language. It is a personal settings screen — not an admin or configuration surface.

---

## 2. Entry Points

- **User menu (bottom of side panel)** → click "Profile Settings"

> Profile Settings is not exposed as a standalone item in the side panel navbar. The Settings group in the navbar will house future admin-level configuration screens. Profile Settings remains a personal/account surface, accessed from the user menu only.

---

## 3. Permissions & Access

| Role | Can view | Can edit personal info | Can update password | Can set display language |
|------|----------|-----------------------|---------------------|--------------------------|
| Super Admin | ✅ | ❌ (read-only) | ✅ | ✅ |
| Admin | ✅ | ❌ (read-only) | ✅ | ✅ |
| Supervisor | ✅ | ❌ (read-only) | ✅ | ✅ |

> Personal info (name, email) is managed by Admin/SA from the Users screen. It cannot be edited from Profile Settings by any role.

---

## 4. Screen Sections

### 4.1 Personal Information

**Purpose**: Shows the user's account details for reference. Read-only for all roles.

**Content**:
- `First Name`: Text, read-only, pre-filled from account
- `Last Name`: Text, read-only, pre-filled from account
- `Email`: Text, read-only, pre-filled from account
- Helper text below fields: "To update your name or email, contact your Admin."

**States**:
- `Default`: Fields pre-filled with authenticated user's data
- `Loading`: Skeleton placeholders while data loads
- `Error`: Inline message in section: "Couldn't load your profile information. Please refresh the page."

**Note**: No CTA in this section. No edit affordance. Fields render visually distinct from editable inputs (disabled/muted style).

---

### 4.2 Update Password

**Purpose**: Allows the user to update their account password.

**Content**:
- `Current Password`: Password input · Required
- `New Password`: Password input · Required · Password requirements shown as inline hints (see below)
- `Confirm New Password`: Password input · Required · Must match New Password

**Password requirements** (shown as inline hint list below New Password field, always visible):
- At least 8 characters
- At least one uppercase letter
- At least one number
- At least one special character (!@#$%^&*)

Requirements update to ✅ / ❌ state as the user types (live inline validation).

**States**:
- `Default`: All fields empty
- `Submitting`: Button shows loading state, fields disabled
- `Success`: Fields clear → toast: "Password updated successfully."
- `Error`: Inline validation per field (see Section 7)

**Post-update behavior**: Active session is maintained — no forced re-login. Sessions on other devices are invalidated automatically.

**Actions**:
| Action | Label | Behavior | Role restriction |
|--------|-------|----------|-----------------|
| Submit | "Update Password" | Validates fields, calls password update API | All roles |

---

### 4.3 Display Language

**Purpose**: Sets the user's preferred language for the platform UI. Personal preference — does not affect other users, team settings, or reply language.

**Content**:
- `Display Language`: Dropdown selector
  - Options: sourced from the platform's i18n language list
  - Default: language detected from browser/account on first login, or previously saved preference
  - Shows current selection on load

**States**:
- `Default`: Dropdown shows current saved language
- `Saving`: Brief loading indicator on selection change
- `Success`: Toast: "Display language updated"
- `Error`: Toast: "Failed to update display language. Please try again."

**Actions**:
| Action | Label | Behavior | Role restriction |
|--------|-------|----------|-----------------|
| Change language | Dropdown selection | Auto-saves on selection change — no separate save button | All roles |

> Auto-save pattern keeps this section lightweight. Consistent with the language selector in the Replies screen.

---

## 5. Modals & Overlays

No modals on this screen.

---

## 6. Edge Cases & Business Rules

- Personal info cannot be edited from this screen by any role. Helper text communicates this inline (see Section 4.1).
- Forgot password is not available from this screen — user is already authenticated. Forgot password lives on the login screen (separate flow, not yet speced).
- Password update does not force re-login on the active session. Other device sessions are invalidated.
- Display language is a per-user preference stored in the account — not in browser or localStorage.
- Display language change takes effect immediately [PENDING — confirm with dev if page reload is required].
- This screen is shared across roles. No conditional sections per role in MVP.

---

## 7. Error States

| Scenario | UI treatment | Message copy |
|----------|-------------|--------------|
| Profile data fails to load | Inline error in Personal Information section | "Couldn't load your profile information. Please refresh the page." |
| Current password incorrect | Inline error below field | "Incorrect password." |
| New password fails requirements | Live validation per requirement (✅ / ❌ per rule) | Per-rule inline indicators |
| Confirm password doesn't match | Inline error below field | "Passwords don't match." |
| Password update API failure | Toast | "Couldn't update your password. Please try again." |
| Password update success | Toast | "Password updated successfully." |
| Display language save failure | Toast | "Failed to update display language. Please try again." |
| Display language save success | Toast | "Display language updated." |

---

## 8. Copy & Labels

| Element | Copy | Notes |
|---------|------|-------|
| Page title | "Profile Settings" | |
| Page subtitle | "Manage your account information and preferences" | From Alorica reference |
| Section: Personal Information | "Personal Information" | |
| Section subtitle | "Your account information" | "(read-only)" removed — helper text handles this |
| Helper text | "To update your name or email, contact your Admin." | Below fields in Personal Information section |
| Section: Update Password | "Update Password" | |
| Section subtitle | "Keep your account secure by using a strong password." | |
| Password CTA | "Update Password" | |
| Field: Current Password | "Current Password" | |
| Field: New Password | "New Password" | |
| Field: Confirm New Password | "Confirm New Password" | |
| Requirement hint | "At least 8 characters" | Live ✅ / ❌ |
| Requirement hint | "At least one uppercase letter" | Live ✅ / ❌ |
| Requirement hint | "At least one number" | Live ✅ / ❌ |
| Requirement hint | "At least one special character (!@#$%^&*)" | Live ✅ / ❌ |
| Section: Display Language | "Display Language" | |
| Section subtitle | "Choose the language you want to use across the platform." | |

---

## 9. Open Questions

- [ ] **Display language — page reload** — Does a language change take effect instantly or require a reload? [Dev]
- [ ] **2FA** — Evaluate whether two-factor authentication is needed given the sensitivity of data accessible to Supervisors and above. Proposed for Phase II or III. [PM + Sec]

---

## Appendix

- Related screens: User Menu Button (`spec-supervisor-user-menu.md`)
- Related specs: `spec-supervisor-sessions.md` · `spec-supervisor-replies.md`
- Reference: Alorica Revolt — Profile Settings (production)

---

*v1.1 — 2026-05-05: Removed navbar entry point. Added i18n reference for Display Language. Removed Agent access open question.*
*v1.2 — 2026-05-05: Renamed password section to "Update Password". Added password complexity rules with live validation. Added helper text in Personal Information. Removed "(read-only)" from subtitle. Shortened error copy to "Incorrect password." Added post-update session behavior. Added 2FA open question. Removed related tickets and design files from Appendix. Removed Agent row from permissions table.*
