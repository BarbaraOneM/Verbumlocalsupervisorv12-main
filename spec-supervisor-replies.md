# Verbum Local — Supervisor Panel
# Screen Spec: Replies
**Version:** 1.1  
**Status:** In Progress — Implementation review  
**Author:** Barbara Kleiman  
**Last updated:** 2026-05-04

---

## 1. Overview

The Replies screen is the central management interface for the supervisor's preset reply library. It allows supervisors to create, edit, organize, enable/disable, and export replies and categories used by agents during live sessions.

**Primary user:** Supervisor  
**Access:** Main nav → Replies  
**Scope:** Applies to all teams the supervisor manages. Team-level assignment is handled separately in Teams > tab Replies.

---

## 2. Page Layout

Page header above the card container, consistent with Sessions and Teams pages:
- **H1:** "Replies"
- **Subtitle:** "Configure preset replies"
- **Description:** "Create and manage the messages available to agents during conversations."

The split panel lives inside a **white card container** with border-radius and subtle box-shadow, matching the card style used in Sessions and Teams. Page background: `#F9FAFB`.

```
Replies
Configure preset replies
Create and manage the messages available to agents during conversations.

┌────────────────────────────────────────────────────────────────────┐  ← card
│  Categories ＋  │  Greetings  [EN▾]  🔍  Title A–Z  Columns  + Add Reply  ⬆  ⬇  │
│─────────────────┼──────────────────────────────────────────────────│
│  🔄 Auto Greet  │  STATUS │ TITLE │ MESSAGE │ TAGS │ ✏️ 🗑️        │
│  ── Greetings ◀ │  ────────────────────────────────────────────── │
│  ── Qualifiers  │  row...                                          │
└────────────────────────────────────────────────────────────────────┘
```

### Left Panel — Categories

- Fixed width (~240px)
- Header label: "Categories" (sentence case) + `＋` button (right-aligned) → triggers Create Category modal
- Special categories (always at top, non-deleteable, non-reorderable):
  - **Auto Greetings** — with autoplay icon (🔄). Tooltip on icon: "This greeting is played automatically at the start of each call." No toggle (activation is per-team, managed in Teams > tab Replies).
- Regular categories below, in creation order (reorder: Phase II)
- Each category row shows:
  - **Toggle** (compact size, same size as reply status toggles) — controls global visibility across all teams
  - **Category name**
  - **Reply count badge** — rounded pill shape (border-radius: 999px)
  - **"N teams"** — muted smaller text below the category name, always visible
  - On hover: reply count badge replaced by `•••` menu (same position, right-aligned) → Edit / Delete. Badge reappears on mouse out.
- **Active category:** pill-style highlight with horizontal padding, lavender background, `border-left: 3px solid #4023FF`, border-radius matching design system pill. "N teams" sits inside the pill below the name.
- Tooltip on category name hover → shows source language of that category. Delay: 500ms.

### Right Panel — Replies Table

**Fixed columns:** Status | Title ↕ | Message | Tags | Actions (edit + delete)  
**Optional via "Columns ▾" dropdown:** Use Count (default: OFF)

- **Status:** compact toggle, per reply, independent of category toggle. Column width: ~64–72px.
- **Title:** sortable (A–Z / Z–A / Most used / Least used). Hover → tooltip shows source language (~500ms delay).
- **Message:** full text, no truncation. Row height variable.
- **Tags:** colored chips (color auto-assigned via hash of tag string, palette of 8–10 colors, consistent across views). Lowercase. Collapse to `+N` on overflow, hover `+N` → tooltip shows all hidden tags.
- **Use Count** *(optional, default OFF):* numeric badge — uses in last 30 days. Sorting by Most/Least used works regardless of column visibility.
- **Actions:** Edit (✏️) and Delete (🗑️) always visible, right-aligned. No "ACTIONS" column header.
- **Inactive reply row:** when Status toggle is OFF, apply both: row background `#F9FAFB` + reduced opacity on title and message text (`color: #9CA3AF` or equivalent muted token). Both signals together are required — background alone is insufficient to communicate inactive state.
- **Row dividers:** `border-bottom: 1px solid #F3F4F6` on every row.

---

## 3. Stats Banner *(Phase II)*

> **Phase II — not in MVP.** Include in Figma for reference but do not implement in first release.

Collapsible banner above the table (chevron to collapse/expand). Shows:

| Card | Data |
|---|---|
| Reply adoption rate | % of sessions with ≥1 preset reply used (last 7d) |
| Top category | Most used category, excluding Auto Greetings (last 7d) |
| Highest adoption team | Team with the most reply usage (last 7d) |
| Unused replies | Count of replies with 0 uses in last 30d |

Period: fixed 7 days. Link: "See full stats in Dashboard →"

---

## 4. Language Display Selector

- Located in the right panel header, next to "Replies" label: `[EN ▾]`
- Dropdown of all available languages + "Original"
- Selecting a language: translates reply titles, messages, and category names in the supervisor's view only
- Does **not** affect what agents see
- Tags are **not** translated — always shown in original language
- If translation is processing: lazy loader appears in the affected fields only
- Tooltip on hover (ⓘ icon): "Language in which replies are shown. Replies in other languages will be translated automatically."
- Tooltip delay: 500ms show / 0ms hide (consistent with all other tooltips in the screen)
- Success toast: "Display language updated"
- Error toast: "Failed to update display language. Please try again"

---

## 5. Search

- Global search across all categories (title + message content)
- Tag search: prefix with `#` → e.g., `#greeting`
- Results shown cross-category. Each row displays a category indicator (e.g., chip or label: "Qualifiers")
- Matching text highlighted in results
- Result count shown: "3 results matching 'payment'"
- Click on result → navigates to that category in the left panel + highlights the reply row in the table
- Clear: `✕` icon in search field → returns to full list
- No results state: "No results found. Try searching by title, message, or use # to search tags."

---

## 6. Categories

### 6.1 Create Category

Triggered by: `＋ Add Category` in left panel.

**Modal: Create Category**

Fields:
| Field | Type | Required | Notes |
|---|---|---|---|
| Name | Text input | Yes | Max 60 chars. Validation: "Category name cannot be empty" |
| Language | Dropdown | Yes | Source language of the content. Validation: "Language is required" |
| Description | Text input | No | Optional. Short description for context |
| Assign to teams | Checkbox list | No | Optional. Shows all supervisor's teams. Selecting = category active for that team immediately on save |

- Save button: disabled until Name + Language are filled
- On save: category appears in list, badge shows selected team count
- Success toast: "Category created"
- Error toast: "Couldn't create the category. Please try again"

### 6.2 Edit Category

Triggered by: hover category row → `•••` → Edit.

**Modal: Edit Category**

Pre-filled fields: Name, Language, Description, current team assignments (if any).

- Language change → yellow warning block: "Language changed. Please review and update the Name to match the selected language." Non-blocking — user can save without updating.
- Save button: disabled if no changes
- Success toast: "Category updated successfully"
- Error toast: "Something went wrong while saving. Please try again"

### 6.3 Delete Category

Triggered by: hover category row → `•••` → Delete.

**Confirmation modal:**
> **Delete this category?**  
> This will permanently remove the category and all its replies. Agents will no longer see or use them during calls.  
> [Cancel] [Delete Category]

- On confirm: category and all its replies removed
- Success toast: "Category deleted successfully"
- Error toast: "Couldn't delete the category. Please try again"

### 6.4 Toggle Category (Global)

- Toggle on category row: turns category on/off for **all teams** that have it active
- Turning OFF triggers a confirmation modal:

> **Turn off this category?**  
> This category is currently active in **N teams**. Turning it off will hide it from agents in all those teams immediately.  
> [Cancel] [Turn Off]

- Turning ON: no confirmation needed
- Error toast: "Couldn't update category visibility. Please try again"

---

## 7. Auto Greetings

### Behavior

- Special category. Fixed at top of category list. Not deleteable. Not renameable.
- Autoplay icon (🔄) indicates messages are auto-triggered at call start
- Can contain multiple greeting messages (no global default)
- Table columns: **Title** | **Message** | **Actions** (no Status toggle, no Tags, no Use Count)
- Each message is editable and deleteable — **except** if it is currently assigned to one or more teams (delete icon disabled with tooltip: "This greeting is assigned to one or more teams. Unassign it from all teams before deleting.")

### Create Auto Greeting

Triggered by: `+ Add Reply` while Auto Greetings category is selected.

Modal fields: Language, Title, Message (max 240 chars, counter shown). No Tags field. No Status toggle.

Best practices tooltip (ⓘ on modal title): "Keep it short, friendly, and easy to understand when spoken. Aim for 150–240 characters. Avoid long sentences or complex phrasing."

### Edit Auto Greeting

Same modal, pre-filled. Save disabled if no changes.

### Delete Auto Greeting

Confirmation modal: "Delete Greeting Message? This action cannot be undone." [Cancel] [Delete]

If only one greeting exists: delete icon disabled with tooltip.

### Team assignment

Auto Greetings category assignment to teams is handled in **Teams > tab Replies**:
- No toggle on/off for Auto Greetings in Teams tab
- Dropdown: "Auto greeting for this team" → lists all replies in Auto Greetings category
- Selecting a reply activates it for that team
- "None" = no auto greeting plays for that team

---

## 8. Replies (Regular Categories)

### 8.1 Create Reply

Triggered by: `+ Add Reply` in right panel header, while any regular category is selected.

**Modal: Create Reply**

Fields:
| Field | Type | Required | Notes |
|---|---|---|---|
| Category | Dropdown | Yes | Pre-filled with currently selected category. Editable. |
| Language | Dropdown | Yes | Source language of this reply's content |
| Title | Text input | Yes | Max 50 chars. Validation: "Title is required" |
| Message | Textarea | Yes | Max 240 chars. Counter shown (e.g., "134/240") |
| Tags | Tag input | No | Free-text with autocomplete. Color auto-assigned from palette. Lowercase normalized. |
| Status | Toggle | No | Default: On (Published). Off = hidden from agents |

- Language change → yellow warning: "Language changed. Please review and update the Title and Message to match the selected language." Non-blocking.
- Save button: disabled until required fields filled
- Success toast: "Reply created"
- Error toast: "Couldn't save the reply. Please try again"

**Validation messages:**
- Title empty: "Title is required"
- Message empty: "Message cannot be empty"
- Language empty: "Language is required"

### 8.2 Edit Reply

Triggered by: ✏️ icon on reply row.

**Modal: Edit Reply**

Pre-filled: Category, Language, Title, Message, Tags, Status toggle.

Same language change warning as Create. Save disabled if no changes.

Success toast: "Reply updated successfully"  
Error toast: "Couldn't save changes to the reply. Please try again"

### 8.3 Delete Reply

Triggered by: 🗑️ icon on reply row.

**Confirmation modal:**
> **Delete this reply?**  
> Once deleted, agents won't be able to use this reply anymore. This action can't be undone.  
> [Cancel] [Delete Reply]

Success toast: "Reply deleted successfully"  
Error toast: "Couldn't delete the reply. Please try again"

### 8.4 Status Toggle (per reply)

- Toggle visible in Status column
- On: reply is available to agents in any team that has the category active
- Off: reply is hidden from agents, but not deleted (acts as draft/inactive state)
- No confirmation required
- Error toast: "Couldn't update reply visibility. Please try again"

### 8.5 Use Count & Sorting

- Each reply shows a numeric badge in "Use Count" column: number of times used in last 30 days
- 0 = never used in period (badge shown as "0" or grayed out)
- Column is sortable: Most used (desc) / Least used (asc)
- Combined with Title sort: A–Z / Z–A
- No "Most Used" or "Least Used" category section — this is handled through column sorting

---

## 9. Tags

- Free-text input with autocomplete based on previously used tags
- Color: auto-assigned from predefined palette on first use; consistent across views
- Normalized to lowercase on save
- Displayed as colored chips in the table
- Overflow: chips collapse to `+N` badge. Hover `+N` → tooltip shows all hidden tags
- Search: prefix `#` in global search to filter by tag. Hidden tags are made visible if matched.
- Tags are not translated when display language changes

---

## 10. Bulk Upload

Triggered by: `⬆ Upload bulk` in right panel header.

- Format: JSON
- Each entry must include: `category`, `language`, `title`, `message`
- Optional per entry: `tags`, `status` (defaults to "on" if omitted)
- **Confirmation modal before upload:**
  > **Upload replies?**  
  > This will add all valid replies from your file to the library. Existing replies won't be overwritten.  
  > [Cancel] [Upload]
- On complete: shows upload report (success count / error count + list of failed rows with reason)
- Success toast: "X replies uploaded successfully"
- Error toast (file-level): "Upload failed. Please check your file format and try again"

---

## 11. Export

Triggered by: `⬇ Export` in right panel header.

**Confirmation modal:**
> **Export replies?**  
> This will download all visible replies as a JSON file.  
> [Cancel] [Export]

- Downloads: `replies-export-[date].json`
- Each entry includes: title, message, language, category, tags (if any), status
- Success toast: "Replies exported successfully"
- Error toast: "Export failed. Please try again"

---

## 12. Empty States

| Context | Message |
|---|---|
| Category with no replies | "No replies in this category yet. Click + Add Reply to create one." |
| Search with no results | "No results found. Try searching by title, message, or use # to search tags." |
| Auto Greetings empty | "No auto greetings yet. Click + Add Reply to create one." |

---

## 13. Toasts & Error Handling — Summary

All success toasts: bottom-right, auto-dismiss (~3s).  
All error toasts: bottom-right, persist until dismissed or action retried.

| Action | Success | Error |
|---|---|---|
| Create category | "Category created" | "Couldn't create the category. Please try again" |
| Edit category | "Category updated successfully" | "Something went wrong while saving. Please try again" |
| Delete category | "Category deleted successfully" | "Couldn't delete the category. Please try again" |
| Create reply | "Reply created" | "Couldn't save the reply. Please try again" |
| Edit reply | "Reply updated successfully" | "Couldn't save changes to the reply. Please try again" |
| Delete reply | "Reply deleted successfully" | "Couldn't delete the reply. Please try again" |
| Create auto greeting | "Auto greeting message created" | "Couldn't save the auto greeting message. Please try again" |
| Edit auto greeting | "Greeting message saved" | "Couldn't save the auto greeting. Please try again" |
| Delete auto greeting | "Greeting deleted successfully" | "We couldn't delete the greeting. Please try again" |
| Export | "Replies exported successfully" | "Export failed. Please try again" |
| Bulk upload | "X replies uploaded successfully" | "Upload failed. Please check your file format and try again" |
| Display language | "Display language updated" | "Failed to update display language. Please try again" |
| Toggle category (global) | — | "Couldn't update category visibility. Please try again" |
| Toggle reply status | — | "Couldn't update reply visibility. Please try again" |

---

## 14. Permissions & Constraints

- Supervisor can only manage replies and categories within their own organization
- Team assignment (which categories are active per team) is managed in Teams > tab Replies — not in this screen
- Auto Greetings category: cannot be renamed, reordered, or deleted
- Supervisors cannot see or edit replies created by other organizations
- Audit log (action + actor + timestamp): **Phase II** — to be surfaced in Profile Settings or equivalent

---

## 15. Open Items / PENDING

| # | Item | Owner | Notes |
|---|---|---|---|
| P-01 | Stats Banner — backend data availability | Dev | Cards defined (§3). Confirm backend support before Phase II implementation |
| P-02 | Tag color palette — implementation | Dev | Random with consistency: color assigned on first use via hash of tag string, mapped to a predefined palette of 8–10 colors. Same tag always renders same color across all views. |
| P-03 | Use Count — data source | Dev | Confirm event tracking exists for reply usage per session |
| P-04 | Bulk upload — JSON schema validation | Dev | Define exact error messages for malformed entries |
| P-05 | Audit log — scope and location | Design + PM | Phase II. Supervisor-scoped first, then Admin org-wide |
| P-06 | Category reordering | Design | Out of scope MVP. Phase II: drag-and-drop in left panel |
| P-07 | Archive replies/categories | Design + PM | Out of scope MVP. Phase II: soft-delete with recoverable state |
| P-08 | "X teams" badge — clickable detail view | Design | Phase II: click → Teams filtered by category |

---

*Spec maintained by Barbara Kleiman. Reference: Agentis for Genesys (Phase 1 + Phase 2 flows). Figma: [EDITABLE — add link]*
