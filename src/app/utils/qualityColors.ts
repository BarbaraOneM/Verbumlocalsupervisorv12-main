/**
 * Quality color utility functions based on the Quality Thresholds defined in the design system.
 * Uses CSS variables: --vl-quality-excellent, --vl-quality-good, --vl-quality-poor, --vl-quality-critical
 */

export function getAIVoiceColor(aiOff: number): string {
  // AI Voice Off Rate - lower is better
  if (aiOff < 15) return "#0E9E6E"; // Excellent: < 15%
  if (aiOff >= 15 && aiOff < 20) return "#10B981"; // Good: 15-20%
  if (aiOff >= 20 && aiOff <= 30) return "#F59E0B"; // Poor: 20-30%
  return "#DC2626"; // Critical: > 30%
}

export function getConfColor(conf: number): string {
  // Confidence Score - higher is better
  if (conf >= 90) return "#0E9E6E"; // Excellent: 90-100%
  if (conf >= 70 && conf < 90) return "#10B981"; // Good: 70-89%
  if (conf >= 50 && conf < 70) return "#F59E0B"; // Poor: 50-69%
  return "#DC2626"; // Critical: 0-49%
}
