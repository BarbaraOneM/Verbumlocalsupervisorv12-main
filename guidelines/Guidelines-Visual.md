# VerbumLocal - Visual Elements

## Icons

### Icon System
- **Library**: lucide-react
- **Standard size**: `w-5 h-5` (20x20px)
- **Small size**: `w-4 h-4` (16x16px)
- **Large size**: `w-6 h-6` (24x24px)

### Overlay Toggle
- **When closed**: `<Maximize2 />` (maximize)
- **When open**: `<Minimize2 />` (minimize)
- Use the same icon in both collapsed and expanded sidebar

---

## Tooltips

### Standard Tooltip
```tsx
<div className="relative group">
  <button>Icon or Button</button>
  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-2 
       bg-[#1F2937] dark:bg-[#2A2A2A] text-white text-xs rounded-[6px] 
       whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 
       transition-opacity shadow-lg z-50">
    Tooltip text
  </div>
</div>
```

**Properties:**
- Background: `bg-[#1F2937]` (light), `bg-[#2A2A2A]` (dark)
- Text: `text-white text-xs`
- Border radius: `rounded-[6px]`
- Padding: `px-3 py-2`
- Position: Below element with `mt-2` spacing
- Animation: `opacity-0` → `group-hover:opacity-100`
- Shadow: `shadow-lg`

---

## Borders & Radius

### Border Radius
```
Buttons: rounded-[8px]
Cards: rounded-[8px] or rounded-[12px]
Modals: rounded-[12px]
Small badges: rounded-[4px]
Avatars: rounded-full
Pills: rounded-full
```

### Border Width
- Sidebar buttons: `border-2` (2px)
- Cards and containers: `border` (1px)
- Active states: always `border-2`

---

## Shadows

### Standard Shadows
```
Cards: shadow-sm
Modals: shadow-xl
Tooltips: shadow-lg
Overlay: No shadow (uses backdrop-blur-sm)
```
