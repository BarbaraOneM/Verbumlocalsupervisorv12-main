# VerbumLocal - Interactive Controls

## Segmented Controls

### Theme Selector / Multi-Option Control
```tsx
<div className="flex items-center gap-1 bg-white dark:bg-[#121212] 
     border border-[#E5E7EB] dark:border-[#2a2a3a] rounded-[8px] p-1">
  <button className="flex-1 py-2 text-xs font-medium rounded-[6px] transition-colors
                     bg-[rgba(94,97,255,0.15)] text-[#5e61ff]">
    Selected Option
  </button>
  <button className="flex-1 py-2 text-xs font-medium rounded-[6px] transition-colors
                     text-[#6B7280] dark:text-[#A0A0A0] 
                     hover:bg-[#F3F4F6] dark:hover:bg-[#1a1a1a]">
    Unselected Option
  </button>
</div>
```

**Container:**
- Background: `bg-white dark:bg-[#121212]`
- Border: `border-[#E5E7EB] dark:border-[#2a2a3a]`
- Border radius: `rounded-[8px]`
- Padding: `p-1`, Layout: `gap-1`

**Buttons:**
- Selected: `bg-[rgba(94,97,255,0.15)] text-[#5e61ff]` (both modes)
- Unselected: `text-[#6B7280] dark:text-[#A0A0A0]`
- Hover: `hover:bg-[#F3F4F6] dark:hover:bg-[#1a1a1a]`

---

## Toggle Switches

### Standard Toggle
```tsx
// Active
<button className="w-11 h-6 rounded-full transition-colors relative
                   bg-[#4023FF] dark:bg-[#5e61ff]">
  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform
                  translate-x-[22px]" />
</button>

// Inactive
<button className="w-11 h-6 rounded-full transition-colors relative
                   bg-[#D1D5DB] dark:bg-[#2a2a3a]">
  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform
                  translate-x-[2px]" />
</button>
```

**Properties:**
- Container: `w-11 h-6` (44x24px)
- Toggle circle: `w-5 h-5` (20x20px)
- Active: `bg-[#4023FF] dark:bg-[#5e61ff]`, position `translate-x-[22px]`
- Inactive: `bg-[#D1D5DB] dark:bg-[#2a2a3a]`, position `translate-x-[2px]`

---

## Volume Sliders

### Voice Input Slider (Green)
```tsx
<input type="range" 
       className="w-full h-1 rounded-full appearance-none bg-[#D1D5DB] dark:bg-[#2a2a3a]
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                  [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                  [&::-webkit-slider-thumb]:bg-[#10B981] [&::-webkit-slider-thumb]:cursor-pointer" />
```

### AI Playback Slider (Purple)
```tsx
<input type="range" 
       className="w-full h-1 rounded-full appearance-none bg-[#D1D5DB] dark:bg-[#2a2a3a]
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                  [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                  [&::-webkit-slider-thumb]:bg-[#A83DFF] [&::-webkit-slider-thumb]:cursor-pointer" />
```

**Cockpit Classes:**
- Voice input active: `.active` → green color
- AI playback active: `.ai-active` → purple color

---

## Status Pills

### TopBar Status Indicator
```tsx
// Idle
<span className="px-2 py-1 rounded-full text-[10px] font-medium
                 bg-[#6B7280]/10 text-[#6B7280]">Idle</span>

// Listening
<span className="px-2 py-1 rounded-full text-[10px] font-medium
                 bg-[#10B981]/10 text-[#10B981]">Listening</span>

// Speaking
<span className="px-2 py-1 rounded-full text-[10px] font-medium
                 bg-[#4023FF]/10 dark:bg-[#5e61ff]/10 text-[#4023FF] dark:text-[#5e61ff]">Speaking</span>

// Error
<span className="px-2 py-1 rounded-full text-[10px] font-medium
                 bg-[#DC2626]/10 text-[#DC2626]">Error</span>
```

**Pattern:** `bg-[color]/10` background, `text-[color]` text

---

## AI Speaking Indicator

### Animated Bars Component
```tsx
<div className="flex items-end gap-0.5 h-4">
  <div className="w-0.5 bg-[#A83DFF] rounded-full animate-[wave_1s_ease-in-out_infinite]" 
       style={{ animationDelay: '0s', height: '40%' }} />
  <div className="w-0.5 bg-[#A83DFF] rounded-full animate-[wave_1s_ease-in-out_infinite]" 
       style={{ animationDelay: '0.1s', height: '100%' }} />
  <div className="w-0.5 bg-[#A83DFF] rounded-full animate-[wave_1s_ease-in-out_infinite]" 
       style={{ animationDelay: '0.2s', height: '60%' }} />
</div>
```

**Animation CSS:**
```css
@keyframes wave {
  0%, 100% { height: var(--start-height); }
  50% { height: 100%; }
}
```
