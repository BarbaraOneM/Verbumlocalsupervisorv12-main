# VerbumLocal Design System Guidelines

## Overview
VerbumLocal is a product ecosystem by OneMeta. These guidelines cover two surfaces:

- **VerbumLocal Agent App** — desktop/electron application for real-time voice translation used by call center agents
- **VerbumLocal Supervisor Panel** — web management application used by supervisors to manage teams, monitor sessions, and review session history

Both surfaces share the same visual identity and design tokens, but have context-specific layout and interaction patterns documented in the relevant files.

## Guideline Files

| File | Content |
|------|---------|
| [Guidelines-Colors.md](./Guidelines-Colors.md) | Brand colors, neutral palette, dark mode, specific use cases, tag colors |
| [Guidelines-Typography.md](./Guidelines-Typography.md) | Font family, weights, sizes, hierarchy |
| [Guidelines-Buttons.md](./Guidelines-Buttons.md) | Sidebar buttons, session controls, badges (HIPAA, language chips) |
| [Guidelines-Tags.md](./Guidelines-Tags.md) | Tag pills, semitransparent color pattern (5%/15%/70%) |
| [Guidelines-Conversation.md](./Guidelines-Conversation.md) | Bubbles, transcripts, character limits (240), session cards |
| [Guidelines-Modals.md](./Guidelines-Modals.md) | Modal base, confirmation modals, form modals, search & highlighting, z-index |
| [Guidelines-Controls.md](./Guidelines-Controls.md) | Segmented controls, toggles, status pills |
| [Guidelines-Visual.md](./Guidelines-Visual.md) | Icons, tooltips, borders, radius, shadows |
| [Guidelines-Layout.md](./Guidelines-Layout.md) | Sidebar (web panel), page layout, content area |
| [Guidelines-Interactions.md](./Guidelines-Interactions.md) | Hover, focus, active, disabled states, dark mode, accessibility |
| [Guidelines-Code.md](./Guidelines-Code.md) | Code standards, patterns, file organization |

---

## Design Principles

### "Zen" Philosophy
- Minimalist and clean design
- Reduce unnecessary options and complexity
- Focus on essential functionality
- Distraction-free interfaces

### Grid System
- **Base**: 8 points (8px)
- All spacing, margins, and paddings must be multiples of 8
- Examples: 8px, 16px, 24px, 32px, 40px, etc.

---

## Task Rules

Before executing any task, read the relevant guideline files based on the type of work requested:

| When you need... | Read these files first |
|---|---|
| **Buttons** (sidebar, primary, secondary) | `Guidelines-Buttons.md`, `Guidelines-Colors.md` |
| **Tags or badges** | `Guidelines-Tags.md`, `Guidelines-Buttons.md` |
| **Bubbles or transcripts** | `Guidelines-Conversation.md`, `Guidelines-Colors.md` |
| **Modals or dialogs** | `Guidelines-Modals.md`, `Guidelines-Colors.md` |
| **Toggles, pills, segmented controls** | `Guidelines-Controls.md`, `Guidelines-Colors.md` |
| **Icons, tooltips, borders** | `Guidelines-Visual.md` |
| **Sidebar or page layout** | `Guidelines-Layout.md`, `Guidelines-Buttons.md`, `Guidelines-Colors.md` |
| **Colors or theming** | `Guidelines-Colors.md` |
| **Typography** | `Guidelines-Typography.md` |
| **Interactions or animations** | `Guidelines-Interactions.md`, `Guidelines-Colors.md` |
| **Code structure** | `Guidelines-Code.md` |
| **Full feature or page** | Read ALL guideline files |

---

## Notes

- Maintain consistency between similar components across both surfaces
- Strictly follow the 8-point grid system
- Some base components may have styling (e.g. gap/typography) baked in as defaults. Explicitly set any styling from these guidelines to override them.
- For the Supervisor Panel web app, always reference `theme.css` for CSS variable names

---

## Version History

- **v1.0** - Initial guidelines based on VerbumLocal Agent Dashboard
  - Colors: Updated client from green (#10B981) to orange (#FF9332)
  - Sidebar: Buttons aligned with border-2 and border-transparent
  - Overlay: Always enabled, icon toggle Minimize2/Maximize2
- **v1.1** - Component Library sync (March 2026)
  - Added Tags component with semitransparent color pattern
  - Added Segmented Controls documentation
  - Added Toggle Switches, Volume Sliders, Status Pills, AI Speaking Indicator
  - Added Language Chips (neutral style)
  - Documented Tag color palette in Guidelines-Colors.md
- **v1.2** - Granular reorganization & Layout consistency (March 2026)
  - Split Components guide into 6 focused files: Buttons, Tags, Conversation, Modals, Controls, Visual
  - Sidebar spacing standardized to 16px (collapsed and expanded states)
  - Added Cockpit controls documentation (voice-input/AI-playback)
  - Documented character limits (240) and session cards
  - Improved search table with granular file mapping
- **v1.3** - Supervisor Panel web app added (March 2026)
  - Clarified dual-surface scope: Agent App (desktop) + Supervisor Panel (web)
  - Updated Layout, Modals, Interactions, Code, and Typography for web context
  - Removed agent-specific layout references from shared guidelines
  - Added theme.css as CSS variable source for Supervisor Panel
