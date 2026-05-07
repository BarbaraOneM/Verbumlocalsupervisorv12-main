# Component Spec: Confidence Chips & Message Latency

**Product**: Verbum Local — Agent App  
**Target user**: Agent (active session) · Agent (Session Details) · Supervisor / Admin / Super Admin (Session Details — future scope)  
**Version**: v1.2  
**Status**: Draft · May 2026  
**Author**: [EDITABLE]  
**Phase**: Phase 2 (currently in development)  
**Assumptions**:
- QE and Translation Score values are calculated in real time by the SDK. They cannot be recalculated post-session.
- Message Latency card is shown only when data is available for that utterance.
- Confidence color coding follows tokens defined in the Dashboard Spec (section 8c).
- The diamond indicator (◈) in bubbles is a read-only AI speaking indicator — no action, no interaction.

---

## 1. Purpose & Goal

Give agents visibility into the transcription and translation quality of each message during an active session, and on-demand access to pipeline latency values — without interrupting the conversation flow.

The same components appear in Session History → Session Details so that agents can review quality post-session. For Supervisor, Admin, and Super Admin roles, access to these components in Session Details is future scope.

---

## 2. Entry Points

### Agent App — active session
- Chips appear automatically on each bubble once the score is available for that utterance.
- The Message Latency card is triggered by user interaction (see section 4.2).

### Session Details modal — Agent (current scope)
- Chips and Message Latency are shown in the conversation view of the modal.
- Layout differs from the active session — see section 5.

### Session Details modal — Supervisor / Admin / Super Admin (future scope)
- Same components replicated for post-session review.
- Do not implement in this iteration. Documented here for design continuity.

---

## 3. Permissions & Access

| Role | Chips visible | Message Latency | Notes |
|------|--------------|-----------------|-------|
| Agent | ✅ | ✅ (on demand) | Active session + Session Details |
| Supervisor | ✅ (future) | ✅ (future) | Session Details modal only |
| Admin | ✅ (future) | ✅ (future) | Session Details modal only |
| Super Admin | ✅ (future) | ✅ (future) | Session Details modal only |

---

## 4. Components

### 4.1 Confidence Chips

Two quality chips shown inline in the metadata row of each bubble, placed next to the language label. Always visible once the score is available for that utterance.

#### Location in the metadata row

**Agent bubble:**
`◈ · [QE chip] [TA chip] · English (United States) · 14:31 › · You`

**Customer bubble:**
`Customer · Español (Mexico) · [QE chip] [TA chip] · 14:32 › · ◈`

Chips are placed next to the language label in both cases. The timestamp sits at the end of the row with a `›` chevron indicating it is interactive (see 4.2).

#### Chip: QE (Transcription Quality)

| Property | Value |
|----------|-------|
| **Measures** | Audio-to-text transcription quality |
| **Shape** | Rectangular, low border-radius (~4px) |
| **Icon** | Small wave / mic icon, fixed mid-gray color |
| **Background** | Fixed neutral — `#F4F4F5` |
| **Numeric value** | Color follows confidence level (see table below) |
| **Tooltip (hover)** | "Transcription quality · [level]" — e.g. "Transcription quality · Good" |

#### Chip: Translation Accuracy (TA)

> Previously referred to as "Translation Score." Renamed to "Translation Accuracy" for clarity — "Score" describes the data type, not what is being measured. "Accuracy" is more descriptive for agents and is consistent with "Transcription Quality" as a paired label.

| Property | Value |
|----------|-------|
| **Measures** | Translation accuracy |
| **Shape** | Pill, full border-radius |
| **Icon** | Small A↔B arrows icon, fixed mid-gray color |
| **Background** | Fixed neutral — `#F4F4F5` |
| **Numeric value** | Color follows confidence level (see table below) |
| **Tooltip (hover)** | "Translation accuracy · [level]" — e.g. "Translation accuracy · Excellent" |

#### Numeric value color coding

Same system as Dashboard Spec (section 8c). Color applies to the numeric value only — chip background is always `#F4F4F5`.

| Range | Level | Color | Hex |
|-------|-------|-------|-----|
| 90–100% | Excellent | Green bright | `#059669` |
| 70–89% | Good | Green muted | `#10B981` |
| 50–69% | Poor | Amber | `#F59E0B` |
| 0–49% | Critical | Red | `#DC2626` |

#### Chip states

| State | Behavior |
|-------|----------|
| Score available | Chip visible with value and color |
| Score not yet available | Chip hidden — no placeholder, no skeleton |
| AI Voice OFF | Chips remain visible if score is available. If no score exists for that utterance, chip is hidden |

---

### 4.2 Message Latency Card

Floating card showing pipeline latency values for a given utterance. Triggered by user interaction — hidden by default.

#### Trigger

Click on the **timestamp** of any bubble. The timestamp always shows a `›` chevron to its right, visible at all times (not only on hover). On hover: cursor pointer + tooltip delay showing `"View message latency"`.

#### Open behavior

- Click on any timestamp → opens the Message Latency cards for **all visible bubbles** simultaneously.
- The action is global — not scoped to the clicked bubble only.
- Second click on the same timestamp, or click on the background outside any card → closes all cards.

#### Card positioning

The card appears **beside the bubble** it belongs to, aligned to the top of that bubble.

| Bubble type | Card position |
|-------------|--------------|
| Customer bubble (left-aligned) | Card appears to the **right** of the bubble |
| Agent bubble (right-aligned) | Card appears to the **left** of the bubble |

The card is floating — it does not push or reflow transcript content.

#### Card content

Three values only (confirmed with Gina):

| Label | Example |
|-------|---------|
| STT proc | 12ms |
| TTS synth | 1000ms |
| Total avg | 1559ms |

Card header: "Message Latency" label in small gray text + ⓘ info icon to the right. The ⓘ opens a tooltip with a short description of each metric.

#### Card style

| Property | Value |
|----------|-------|
| Background | White |
| Border | `1px solid #E4E4E7` |
| Box shadow | Subtle (popover-level) |
| Border radius | 8px |
| Width | Fixed, compact (~200–220px) |

#### Card states

| State | Behavior |
|-------|----------|
| Data available | Card visible with 3 values |
| No data for that utterance | Card does not appear for that bubble. Other bubbles with data show their cards normally |
| AI Voice OFF (utterance with no TTS) | PENDING — confirm with devs what values to show for TTS synth and Total avg (see Open Questions) |

---

## 5. Session Details Modal — Agent (current scope)

The Session Details modal presents the conversation as a full-width vertical list — no side-by-side bubbles. A floating side card is not viable in this layout.

### Chips in Session Details

Chips QE and TA are shown in the metadata row of each message, next to the language label — consistent with the Agent App pattern.

Metadata row format in the modal:
`CUSTOMER · Spanish - Mexico · [QE chip] [TA chip] · 14:18 ›`
`AGENT · English - United States · [QE chip] [TA chip] · 14:20 ›`

### Message Latency in Session Details

- **Trigger**: same as active session — click on the timestamp `›` of any message.
- **Presentation**: instead of a floating side card, the latency values expand as a **second row directly below the message metadata** for that message.
- Expanded row shows 3 values inline: `STT proc: 12ms · TTS synth: 1000ms · Total: 1559ms`
- Second click on the same timestamp → collapses.
- Action is global: clicking any timestamp opens the latency row for all visible messages simultaneously.

### Pipeline Latency section (session-level average)

Shown above the conversation, between the modal header and the transcript. Displays the session-wide average, not per-utterance values.

Side-by-side layout:
- **Left**: Pipeline Latency — always present when data is available. Shows 3 values: STT proc · TTS synth · Total avg
- **Right**: AI Voice OFF banner — shown only when AI Voice was disabled during the session
- When no AI Voice OFF event exists → Pipeline Latency spans full width

---

## 6. Session Details Modal — Supervisor / Admin / Super Admin (future scope)

> ⚠️ Do not implement in this iteration. Documented for design continuity only.

Same components as the Agent Session Details view (section 5). Scope and timing to be confirmed.

---

## 7. Edge Cases & Business Rules

- Scores are calculated in real time by the SDK. If a score is not available for an utterance, chips are simply not shown — no skeleton, no placeholder.
- The diamond indicator (◈) is a read-only AI speaking indicator. It disappears when AI Voice is OFF. It has no action and does not interact with the Message Latency card.
- Chips remain in the metadata row when AI Voice is OFF, as long as a score exists for that utterance.
- If a bubble has no pipeline timing data, its card does not appear when the timestamp is clicked. Other bubbles with data show their cards normally.
- Chip background color is always fixed neutral (`#F4F4F5`). Only the numeric value changes color.
- The `›` chevron on the timestamp is always visible — not only on hover.

---

## 8. Copy & Labels

| Element | Copy |
|---------|------|
| QE chip tooltip | "Transcription quality · [level]" |
| TA chip tooltip | "Translation accuracy · [level]" |
| Timestamp hover tooltip | "View message latency" |
| Message Latency card header | "Message Latency" |
| Card ⓘ tooltip — STT proc | "Time to process speech-to-text" |
| Card ⓘ tooltip — TTS synth | "Time to synthesize text-to-speech" |
| Card ⓘ tooltip — Total avg | "Total pipeline latency for this utterance" |
| No data | `—` |

---

## 9. Open Questions

- [ ] **Final iconography**: wave/mic icon for QE chip and A↔B arrows for TA chip — confirm with Gina before implementing.
- [ ] **Score delay mid-session**: is there a transitional state where the score hasn't arrived yet but the bubble is already on screen? Confirm with Euro whether there's a delay between bubble render and score availability.
- [ ] **AI Voice OFF + TTS synth**: confirm with devs what values to show for TTS synth and Total avg when AI Voice was OFF for that utterance.
- [ ] **Confidence Score in Dashboard vs these chips**: confirm with Euro whether the "Confidence Score" used in the Dashboard (Language Pairs panel, Quality Alert card) maps to Translation Accuracy (TA), QE, or a separate aggregated value.
- [ ] **Future scope — Session Details for Supervisor / Admin / Super Admin**: confirm implementation timing.

---

## Appendix

- **Color tokens**: Dashboard Spec section 8c (confidence thresholds)
- **Diamond indicator (◈)**: AI speaking state — read-only, do not modify behavior
- **Session Details modal**: see `spec-supervisor-sessions.md` and `supervisor-sessions-handoff.docx`
- **Related tickets**: [EDITABLE]
- **Design files**: [EDITABLE]

---

*v1.0 — May 2026: initial version.*  
*v1.1 — May 2026: translated to English; corrected Session Details scope (Agent = current, Supervisor/Admin/Super Admin = future); renamed card to "Message Latency"; added `›` chevron to timestamp (always visible); removed lightning icon from card header; added `1px solid #E4E4E7` border + box-shadow to card; AI Voice OFF + timing behavior moved to open question; added Confidence Score dashboard mapping as open question.*  
*v1.2 — May 2026: renamed "Translation Score" to "Translation Accuracy" throughout. Rationale: "Score" describes the data type, not what is being measured. "Translation Accuracy" is more descriptive for agents and creates a consistent pair with "Transcription Quality."*
