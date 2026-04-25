# VerbumLocal - Interaction States & Accessibility

## Interaction States

### Hover
- Smooth transition: `transition-all`
- Border color change on buttons
- Background color change on rows and list items
- Duration: default (150-200ms)

### Focus
- Border color changes to primary (`#5E61FF`)
- No default outline (use border instead)
- Visible ring on inputs: `focus:ring-2 focus:ring-[#5E61FF]/20`

### Active/Selected
- Background with primary color opacity
- Visible border in primary color
- Icon and text in primary color

### Disabled
- Opacity: 40%
- Cursor: not-allowed
- Gray colors
- No hover effects

---

## Supervisor Panel — Web App Patterns

### Navigation
- Active nav item uses primary color background tint + primary border
- Clicking a nav item navigates to that page (full page transition, no modal)
- Breadcrumb updates on every page

### Tables
- Row hover: `bg-[#F9FAFB]`
- Clickable rows use `cursor-pointer`
- Sortable columns show sort icon on hover
- Pagination: previous/next + page numbers

### Forms
- Input focus: border changes to `#5E61FF`, soft ring
- Validation errors: red border (`#DC2626`) + error message below field
- Read-only fields: `bg-[#F3F4F6]`, no focus ring, cursor-default
- Save/submit buttons: disabled until form is dirty or valid

### Search
- Implemented in Sessions list and Session Details transcript
- Yellow highlighting on matches: `bg-[#FBBF24]`
- Results counter shown inline
- Case-insensitive by default

---

## Agent App — Desktop Patterns

### Session Management (Agent App only)
- Only one button in Call Desk: Start Session (idle) or End Session (active)
- Overlay button always enabled, independent of session state
- Navigation buttons disabled during active session

### Device Testing (Agent App only)
- UI for microphone and audio testing
- Visual preview of audio levels
- Test buttons with clear feedback

---

## Dark Mode

### Implementation
- Use `dark:` prefix on all classes
- Always provide both states (light/dark)
- Maintain adequate contrast in both modes

### Contrast
- Text on background: minimum AA compliance
- Active buttons: clearly distinguishable
- Icons: sufficient contrast in both modes

---

## Accessibility

### Labels
- All icon-only buttons have `aria-label`
- Form inputs have associated `<label>` elements
- Disabled states are visually communicated (opacity + cursor)

### Keyboard Navigation
- Logical tab order throughout all pages
- Visible focus state on all interactive elements
- Enter/Space to activate buttons
- Escape to close modals
