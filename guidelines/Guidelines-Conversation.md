# VerbumLocal - Conversation Components

## Conversation Bubbles

### Agent Bubble (Blue)
```
bg-[#4023FF]/10 dark:bg-[#5e61ff]/10
border border-[#4023FF]/20 dark:border-[#5e61ff]/20
text-[#1F2937] dark:text-white
```

### Client Bubble (Orange)
```
bg-[#FF9332]/10
border border-[#FF9332]/20
text-[#1F2937] dark:text-white
```

---

## Character Counter

### Limit: 240 characters

```tsx
<span className="text-xs text-[#6B7280] dark:text-[#A0A0A0]">
  {count}/240
</span>
```

**Over limit styling:**
```
text-[#DC2626] font-medium
```

---

## Transcript Components

### TranscriptBubble Structure
- Border radius: `rounded-[8px]`
- Padding: `p-4`
- Spacing between bubbles: `space-y-2`
- Font size: `text-sm`

### Timestamps
```
text-[10px] text-[#6B7280] dark:text-[#A0A0A0]
```

---

## Session Cards (History)

### Card Base
```
bg-white dark:bg-[#1a1a2a]
border border-[#E5E7EB] dark:border-[#2a2a3a]
rounded-[8px]
hover:border-[#4023FF]/30 dark:hover:border-[#5e61ff]/30
transition-colors
```

### Session Metadata
- Date: `text-sm text-[#6B7280] dark:text-[#A0A0A0]`
- Duration: `text-xs text-[#9CA3AF]`
- Status indicators: Use Status Pills (see Guidelines-Controls.md)
