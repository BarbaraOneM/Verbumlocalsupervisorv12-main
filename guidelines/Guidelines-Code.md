# VerbumLocal - Code Standards

## Class Naming
- Use Tailwind v4 classes
- Prefer inline Tailwind over custom CSS
- Organize classes: layout > spacing > colors > text > effects
- Use template literals for conditional states
- Reference CSS variables from theme.css where available (e.g. `bg-[var(--card)]`, `text-[var(--foreground)]`)

---

## Component Structure
```tsx
// Recommended structure example
<button
  onClick={handleClick}
  disabled={isDisabled}
  className={`
    w-full p-3 rounded-[8px] border-2 transition-all 
    flex items-center gap-3
    ${isActive 
      ? 'bg-[rgba(94,97,255,0.12)] border-[#5E61FF] text-[#5E61FF]' 
      : 'bg-[rgba(0,0,0,0.02)] border-transparent text-[#374151]'
    }
  `}
  aria-label="Action name"
>
  <Icon className="w-4 h-4" />
  <span className="text-sm font-medium">Label</span>
</button>
```

---

## File Organization

### Supervisor Panel (Web App)
```
/src/app/
  /dashboard/
    - page.tsx
  /sessions/
    - page.tsx
    - [id]/page.tsx
  /teams/
    - page.tsx
    - [id]/page.tsx
  /settings/
    - profile/page.tsx
  /components/
    - Sidebar.tsx
    - PageHeader.tsx
    - KPICard.tsx
    - SessionsTable.tsx
    - SessionDetails.tsx
    - TeamCard.tsx
    - TeamDetails.tsx
    - MembersTab.tsx
```

### Agent App (Desktop)
```
/src/app/components/
  - AgentDashboard.tsx
  - SettingsModal.tsx
  - SessionDetailsModal.tsx
  - SessionsHistory.tsx
  - RepliesPage.tsx
```

---

## Common Patterns

### Conditional Styling
```tsx
className={`base-classes ${
  condition1
    ? 'state1-classes'
    : condition2
    ? 'state2-classes'
    : 'default-classes'
}`}
```

### Toggle States
```tsx
const [isOpen, setIsOpen] = useState(false);

// Style toggle
className={isOpen ? 'active-styles' : 'inactive-styles'}
```

### Disabled Logic
```tsx
disabled={!isDirty || isSubmitting}
className={`${
  !isDirty
    ? 'opacity-40 cursor-not-allowed'
    : 'hover:bg-[#4d50e0] cursor-pointer'
}`}
```

### Table Row
```tsx
<tr className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors cursor-pointer">
  <td className="px-4 py-3 text-sm text-[#374151]">...</td>
</tr>
```
