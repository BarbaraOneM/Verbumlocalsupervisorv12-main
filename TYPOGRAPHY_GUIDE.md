# Typography Scale - VerbumLocal Supervisor Panel

## Font Size Scale

Use CSS variables from `theme.css` for consistent typography:

| Variable | Size | Usage |
|----------|------|-------|
| `--vl-text-xs` | 10px | Tiny labels, uppercase section headers |
| `--vl-text-sm` | 12px | Small labels, metadata, secondary info |
| `--vl-text-base` | 14px | **Body text, buttons, form inputs** |
| `--vl-text-lg` | 18px | Large text, small headings |
| `--vl-text-xl` | 22px | Page headings, titles |
| `--vl-text-2xl` | 24px | Large metric values |
| `--vl-text-3xl` | 32px | Extra large metric values |

## Migration Guide

**Old → New:**
- `11px` → `12px` (--vl-text-sm) - Small labels, metadata
- `12px` → `14px` (--vl-text-base) - Body text, default size
- `14px` → `14px` (--vl-text-base) - Keep as body
- `18px` → `18px` (--vl-text-lg) - Keep for headings
- `22px` → `22px` (--vl-text-xl) - Keep for large headings
- `24px` → `24px` (--vl-text-2xl) - Keep for values
- `32px` → `32px` (--vl-text-3xl) - Keep for large values

## Examples

```tsx
// Section headers (uppercase)
<h4 style={{ fontSize: "10px", ... }}>METRICS THIS PERIOD</h4>

// Metadata, timestamps
<span style={{ fontSize: "12px", ... }}>Last updated 2m ago</span>

// Body text, buttons, labels
<span style={{ fontSize: "14px", ... }}>Agent name</span>

// Card titles
<h3 style={{ fontSize: "18px", ... }}>Language Pairs</h3>

// Panel headings
<h2 style={{ fontSize: "22px", ... }}>en-US › nl-BE</h2>

// Metric values
<div style={{ fontSize: "24px", ... }}>51%</div>
<div style={{ fontSize: "32px", ... }}>65%</div>
```
