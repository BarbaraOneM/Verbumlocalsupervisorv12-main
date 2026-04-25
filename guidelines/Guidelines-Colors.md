# VerbumLocal - Color Palette

## Brand Colors

### Primary - Deep Blue/Indigo (OneMeta)

**Both surfaces use the same primary color:**
```
Primary:       #4023FF
Primary Light: rgba(64, 35, 255, 0.12)
Primary Hover: #3419cc
Dark mode:     #5e61ff / rgba(94, 97, 255, 0.15)
```

**Primary use**: Navigation buttons, active states, borders, primary CTAs, main interactive elements.

### Additional Colors
```
Client/User:     #FF9332  (Orange — improved contrast)
Success/Active:  #10B981  (Green)
Error/Danger:    #DC2626  (Red)
Warning bg:      #FEFCE8
Warning border:  #FACC15
Warning text:    #A16207
```

---

## Neutral Colors

### Light Mode
```
Page background:  #F9FAFB  (--base-bg)
Surface/card:     #FFFFFF   (--card)
Surface alt:      #F3F4F6   (--secondary / --sidebar-bg)
Border default:   #E5E7EB   (--border)
Border input:     #D1D5DB
Text primary:     #1F2937   (--text-primary / --foreground)
Text secondary:   #6B7280   (--text-secondary / --muted-foreground)
Text muted:       #9CA3AF   (--text-muted)
```

### Dark Mode
```
Background:    #1a1a2e    (--background)
Card:          #252543    (--card)
Border:        rgba(255,255,255,0.1)
Text primary:  rgba(255,255,255,0.9)
Text secondary:#FFFFFF99
```

---

## Specific Use Cases
```
Search highlight:  #FBBF24  (Yellow)
HIPAA badge:       #5B5FF2  (Indigo) + rgba(91, 95, 242, 0.1) background
AI Playback:       #A83DFF  (Purple/Violet) — Agent App only
Overlay bg:        rgba(10, 10, 18, 0.5) — Agent App only
```

---

## Tag Colors (Replies / Session Tags)

Tags use a semitransparent pattern:

**Pattern:**
```
bg-[color]/5      ← Background at 5% opacity
border-[color]/15 ← Border at 15% opacity
text-[color]/70   ← Text at 70% opacity
```

**Available Colors:**
```
Verification: #5e61ff   Identity:   #3b82f6
Account:      #10b981   Contact:    #06b6d4
Email:        #8b5cf6   Phone:      #ec4899
Support:      #10b981   Triage:     #f59e0b
Billing:      #f59e0b   Transfer:   #8b5cf6
Hold:         #ec4899   Wait:       #06b6d4
Greeting:     #10b981   Welcome:    #3b82f6
Technical:    #ef4444   Error:      #dc2626
Password:     #f59e0b   Security:   #f97316
Escalation:   #ef4444   Supervisor: #dc2626
Urgent:       #f59e0b   Priority:   #f97316
Default:      #6B7280   (fallback for undefined tags)
```