# VerbumLocal - Tags System

## Tag Pills (Replies Page)

### Base Structure
```tsx
<span className="px-2.5 py-1 border rounded-full text-xs font-medium whitespace-nowrap 
     bg-[color]/5 border-[color]/15 text-[color]/70">
  Tag Name
</span>
```

**Properties:**
- Padding: `px-2.5 py-1`
- Border radius: `rounded-full`
- Typography: `text-xs font-medium`
- Border: `border`
- Layout: `whitespace-nowrap`

---

## Color Pattern (Semitransparent)

```
bg-[color]/5     ← Background at 5% opacity
border-[color]/15 ← Border at 15% opacity
text-[color]/70   ← Text at 70% opacity
```

---

## Color Examples

```tsx
// Verification (Purple)
bg-[#5e61ff]/5 border-[#5e61ff]/15 text-[#5e61ff]/70

// Account (Green)
bg-[#10b981]/5 border-[#10b981]/15 text-[#10b981]/70

// Contact (Cyan)
bg-[#06b6d4]/5 border-[#06b6d4]/15 text-[#06b6d4]/70

// Email (Purple)
bg-[#8b5cf6]/5 border-[#8b5cf6]/15 text-[#8b5cf6]/70

// Default/Fallback (Gray)
bg-[#6B7280]/5 border-[#6B7280]/15 text-[#6B7280]/70
```

---

## Usage

- Use in lists with `flex items-center gap-2 flex-wrap`
- Works in both light and dark mode
- Default fallback: `bg-[#6B7280]/5 border-[#6B7280]/15 text-[#6B7280]/70`
