# VerbumLocal - Modals & Overlays

## Modal Base

```
bg-white dark:bg-[#1a1a2a]
border border-[#E5E7EB] dark:border-[#2a2a3a]
rounded-[12px]
shadow-xl
```

---

## Overlay Background

```
bg-[rgba(10,10,18,0.5)]
backdrop-blur-sm
```

---

## Modal Variants

### Confirmation Modal
Used for destructive or irreversible actions (e.g. remove member, delete team).

Structure:
- Title: action name (e.g. "Remove member")
- Body: short description of consequence
- Footer: Cancel (secondary) + Confirm (primary or destructive)

```
Width: max-w-md (448px)
Padding: p-6
Footer gap: gap-3, justify-end
```

### Form Modal
Used for create/edit actions (e.g. create team, edit settings).

Structure:
- Title: technical action name (e.g. "Create Team", not "Add New Team")
- Body: form fields with labels
- Footer: Cancel + Save/Submit (primary)

```
Width: max-w-lg (512px)
Padding: p-6
Field gap: space-y-4
```

### Info/Detail Modal
Used for read-only detail views (e.g. session details preview).

Structure:
- Title + optional subtitle/ID
- Body: metadata + content
- Footer: Close + optional export action

---

## Modal Naming Convention

Modal titles must use the technical action being performed, not generic UI labels.

```
✅ "Create Team"         ❌ "Add New Team"
✅ "Remove Member"       ❌ "Delete"
✅ "Export Session"      ❌ "Download"
✅ "Edit Team Details"   ❌ "Settings"
```

---

## "Zen" Philosophy
- Show only what the user needs to complete the action
- No unnecessary tabs or options inside modals
- One clear primary action per modal

---

## Search & Highlighting

### Search Input
```
bg-white dark:bg-[#1E1E2E]
border border-[#D1D5DB] dark:border-[#2a2a3a]
focus:border-[#5E61FF] dark:focus:border-[#5e61ff]
rounded-[8px] px-4 py-2
```

### Search Highlight
```
bg-[#FBBF24] text-black font-medium
```

### Search Match Counter
```
text-xs text-[#6B7280] dark:text-[#A0A0A0]
bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)]
px-2 py-1 rounded-[4px]
```

---

## Dropdown z-index
```
z-[250]
```
All dropdowns inside modals must use `z-[250]` to appear above modal content.

---

## Agent App: Settings Modal (Desktop only)

Applies only to the Agent App desktop surface.

### Tabs
- "General" — auto greeting, agent voice preview
- "Audio & System" — device selection, microphone/speaker testing

### Audio Selection
- Device list with radio buttons
- Visual preview of audio levels
- Test buttons with clear feedback
