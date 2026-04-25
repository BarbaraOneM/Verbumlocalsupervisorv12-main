# VerbumLocal - Typography

## Font Family
```css
font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

Available via CSS variable in theme.css:
```css
--font-family: 'Poppins', sans-serif;
```

## Font Weights
- Regular: 400 (`--font-weight-normal`)
- Medium: 500 (`--font-weight-medium`)
- Semibold: 600
- Bold: 700

## Base Font Size
```css
--font-size: 16px;
```

## Hierarchy

### Supervisor Panel (Web App)
```
Page title (h1):     22px, 600, #1F2937
Section title (h2):  18px, 600, #1F2937
Card title (h3):     13px, 600, #1F2937
Body text:           13–14px, 400, #374151
Label:               12px, 500, #374151
Helper/muted text:   11–12px, 400, #6B7280
Metadata/timestamp:  10–11px, 400, #9CA3AF
Badge/pill text:     10px, 500
```

### Agent App (Desktop)
```
Body text:           text-sm (14px) is the most common base size
Small text:          text-xs (12px) for metadata and secondary labels
Headings:            defined in theme.css base styles
```

## theme.css Base Styles

The following element defaults are defined in `@layer base` in theme.css. Tailwind utility classes override them automatically:

```
h1: text-2xl, font-weight-medium, line-height 1.5
h2: text-xl,  font-weight-medium, line-height 1.5
h3: text-lg,  font-weight-medium, line-height 1.5
h4: text-base, font-weight-medium, line-height 1.5
label: text-base, font-weight-medium, line-height 1.5
button: text-base, font-weight-medium, line-height 1.5
input: text-base, font-weight-normal, line-height 1.5
```

To override, apply Tailwind utility classes directly on the element (e.g. `text-sm`, `font-semibold`).
