# VerbumLocal - Layout Guidelines

## Surface: Supervisor Panel (Web App)

The Supervisor Panel is a browser-based management application. Layout follows standard web app conventions: fixed sidebar, scrollable main content area, no draggable overlays.

---

## Sidebar

### States
- **Expanded**: 220px wide — default for Supervisor Panel
- **Collapsed**: 56px wide, icons only — available as toggle
- **Default state**: Expanded in Supervisor Panel

### Structure
1. **Top Rail**: Logo icon + tenant name + "Admin Panel" label
2. **Nav Section**: Grouped navigation items with section labels
3. **Bottom Rail**: User avatar + name + role + chevron (opens user menu)

### Top Rail
```
Height: 64px
Padding: 16px
Content: VL logo icon (32px, #4023FF, rounded-[8px]) + tenant name (600, 13px) + "Admin Panel" (400, 10px, muted uppercase)
Border-bottom: 1px solid #E5E7EB
```

### Navigation Groups
```
Section label: 10px, 500, #9CA3AF, uppercase, letter-spacing 0.06em
Padding above first group: 16px
Gap between buttons: 4px (space-y-1)
Gap between groups: 16px
```

### Spacing & Padding

**Expanded Sidebar:**
- Container padding: `px-3 py-4`
- Nav buttons: `w-full p-3 gap-3` (12px padding, 12px gap between icon and label)
- Button label: 12px, 500, matches icon color

**Collapsed Sidebar:**
- Container: `py-4`, centered icons
- Nav buttons: `w-9 h-9` (36px square), centered icon
- Gap between buttons: `space-y-2` (8px)

### Consistency Rule
Both states use the same color tokens and border logic. Active/hover states are identical regardless of expanded/collapsed.

### Bottom Rail
```
Border-top: 1px solid #E5E7EB
Padding: 12px
User row: avatar (30px circle, initials) + name (12px, 500) + role (10px, muted) + chevron
Hover: bg-[#F9FAFB]
```

---

## Page Layout (Main Content Area)

### Structure
```
<div class="flex h-screen">
  <Sidebar />                          /* fixed, 220px */
  <main class="flex-1 overflow-y-auto bg-[#F3F4F6] p-6">
    <PageHeader />                     /* title + breadcrumb + actions */
    <PageContent />                    /* cards, tables, forms */
  </main>
</div>
```

### Page Header
```
Breadcrumb: 11px, #9CA3AF — e.g. "Nexbridge › Admin Panel"
Page title: h1, 22px, 600, #1F2937
Subtitle/welcome: 13px, 400, #6B7280
Top-right slot: badges, export buttons, secondary actions
Margin-bottom: 24px
```

### Content Area
```
Background: #F3F4F6
Padding: 24px (p-6)
Max-width: none — full width within available space
Gap between sections: 20px
```

### Cards
```
Background: #FFFFFF
Border: 1px solid #E5E7EB
Border-radius: 10px–12px
Padding: 16px–18px
Shadow: none (border is sufficient)
```

### KPI Cards Grid
```
Grid: 4 columns, gap 12px
Responsive: collapse to 2 columns below 900px
```

### Tables
```
Background: #FFFFFF
Border: 1px solid #E5E7EB
Border-radius: 10px
Header row: bg-[#F9FAFB], text 11px 500 uppercase #6B7280
Body rows: 48px height, border-bottom 1px solid #F3F4F6
Hover row: bg-[#F9FAFB]
Pagination: below table, centered
```

---

## Surface: Agent App (Desktop)

The Agent App is a desktop/electron application with a compact sidebar and a cockpit-style bottom control bar. Overlay windows are draggable floating panels.

### Sidebar (Agent App)
- **Default state**: Collapsed (icons only)
- Nav items: Call Desk, Session History, Quick Replies, Live Companion
- Bottom: Settings + agent profile

### Overlay Window (Agent App only)
- Draggable floating panel, initial position center-right
- Backdrop: `bg-[rgba(10,10,18,0.5)] backdrop-blur-sm`
- Minimize button: Minimize2 icon
- Scroll to bottom: `bg-[#4023FF]`

### Cockpit — Bottom Controls (Agent App only)
- Fixed bar at bottom of dashboard
- Voice input slider: Green (`#10B981`)
- AI playback slider: Purple (`#A83DFF`)
- Mute buttons with state indicators
