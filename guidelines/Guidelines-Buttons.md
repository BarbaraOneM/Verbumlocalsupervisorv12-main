# VerbumLocal - Buttons & Badges

## Sidebar Buttons (Expanded and Collapsed)

### Base Structure
```tsx
className={`
  [width] [height] rounded-[8px] border-2 transition-all flex items-center justify-center
  ${conditional-states}
`}
```

### States

**Normal (Inactive)**
```
bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.02)]
border-transparent
text-[#374151] dark:text-[#D1D5DB]
hover:text-[#1F2937] dark:hover:text-white
hover:border-[#4023FF]/30 dark:hover:border-[#5e61ff]/30
```

**Active/Selected**
```
bg-[rgba(64,35,255,0.15)] dark:bg-[rgba(94,97,255,0.15)]
border-[#4023FF] dark:border-[#5e61ff]
text-[#4023FF] dark:text-white
```

**Disabled**
```
bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.02)]
border-transparent
text-[#9CA3AF] dark:text-[#A0A0A0]
opacity-40
cursor-not-allowed
```

### Sizes
- Collapsed: `w-10 h-10` (40x40px)
- Expanded: `w-full p-3` (padding 12px)

### Important Rules
- Always use `border-2` (not `border`)
- Normal state always uses `border-transparent`
- Maintain consistency between expanded and collapsed sidebar

---

## Session Control Buttons

### Start Session (Blue Primary)
```
bg-[#4023FF] hover:bg-[#3419cc] dark:bg-[#5e61ff] dark:hover:bg-[#7679ff]
text-white
rounded-[8px] px-4 py-2
transition-all
```

### End Session (Dark Red)
```
bg-[#7f1d1d] hover:bg-[#991b1b]
text-white
rounded-[8px] px-4 py-2
transition-all
```

---

## Badges

### HIPAA Badge
```tsx
<div className="px-2 py-1 bg-[rgba(91,95,242,0.1)] dark:bg-[rgba(91,95,242,0.15)] 
     rounded-[4px] border border-[#5B5FF2]/20 dark:border-[#5B5FF2]/30">
  <Shield className="w-3 h-3 text-[#5B5FF2]" />
  <span className="text-[10px] font-medium text-[#5B5FF2]">HIPAA</span>
</div>
```

### Language Chips (Neutral Style)
```tsx
<div className="px-2 py-0.5 rounded-[4px] bg-[#6B7280]/5 border border-[#6B7280]/15">
  <span className="text-[10px] font-medium text-[#6B7280]/70">en-us</span>
</div>
```

**Properties:**
- Padding: `px-2 py-0.5`
- Border radius: `rounded-[4px]`
- Background: `bg-[#6B7280]/5` (neutral, semitransparent)
- Border: `border-[#6B7280]/15`
- Text: `text-[10px] font-medium text-[#6B7280]/70`
