import { TrendingUp, TrendingDown, AlertTriangle, ArrowUpRight } from "lucide-react";
import { getAIVoiceColor, getConfColor } from "../utils/qualityColors";

interface TopAgent {
  name: string;
  percentage: number;
}

interface AIVoiceOffReason {
  reason: string;
  percentage: number;
  opacity: number;
}

interface QualityAlertPanelProps {
  languagePair: string;
  aiVoiceOff: number;
  confidence: number;
  sessionsCount: number;
  trendPercentage: number;
  trendDirection: "up" | "down";
  trendLabel: string;
  topAgents: TopAgent[];
  aiVoiceOffReasons?: AIVoiceOffReason[];
  worstSession?: {
    id: string;
    agent: string;
    duration: string;
    date: string;
    confidence: number;
  };
}

export function QualityAlertPanel({
  languagePair,
  aiVoiceOff,
  confidence,
  sessionsCount,
  trendPercentage,
  trendDirection,
  trendLabel,
  topAgents,
  aiVoiceOffReasons = [
    { reason: "Technical issue", percentage: 46, opacity: 1 },
    { reason: "Language barrier", percentage: 31, opacity: 0.6 },
    { reason: "Voice quality", percentage: 23, opacity: 0.35 }
  ],
  worstSession = {
    id: "#69ca2987",
    agent: "Avery Park",
    duration: "00:31:12",
    date: "Mar 17",
    confidence: 22
  }
}: QualityAlertPanelProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Top Section - Pair Highlight */}
      <div className="border-b border-[#E5E7EB] px-[24px] py-[16px]">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 style={{ fontSize: "22px", fontWeight: 600, color: "#1F2937", margin: 0, marginBottom: "4px" }}>
              {languagePair}
            </h3>
            <div style={{ fontSize: "14px", color: "#6B7280" }}>
              {sessionsCount} sessions this period
            </div>
          </div>
          <span
            className="px-2 py-1 rounded-[4px] flex items-center gap-1"
            style={{
              fontSize: "14px",
              fontWeight: 600,
              background: "#FFEFEF",
              color: "#DC2626"
            }}
          >
            <AlertTriangle size={14} style={{ color: "#DC2626" }} />
            NEEDS ATTENTION
          </span>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="px-6 py-6 border-b border-[#E5E7EB]">
        <h4 style={{ fontSize: "12px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px", marginTop: 0 }}>
          METRICS THIS PERIOD
        </h4>
        <div className="flex flex-col gap-4">
          {/* Confidence - moved to top */}
          <div>
            <div style={{ fontSize: "14px", color: "#6B7280", marginBottom: "4px" }}>
              <span style={{ fontWeight: 600 }}>Confidence</span> <span style={{ color: "#9CA3AF" }}>・ Below 70% = poor</span>
            </div>
            <div style={{ fontSize: "28px", fontWeight: 600, color: "#D97706" }}>65%</div>
            <div style={{ fontSize: "12px", color: "#D97706", fontWeight: 400 }}>
              ↓ 3% vs last week  ·  8 of 13 sessions below threshold
            </div>
          </div>

          {/* AI Voice Off - moved to second */}
          <div>
            <div style={{ fontSize: "14px", color: "#6B7280", marginBottom: "4px" }}>
              <span style={{ fontWeight: 600 }}>AI voice off</span> <span style={{ color: "#9CA3AF" }}>・ Threshold: 30%</span>
            </div>
            <div style={{ fontSize: "28px", fontWeight: 600, color: "#DC2626" }}>{aiVoiceOff}%</div>
            <div style={{ fontSize: "12px", color: "#DC2626", fontWeight: 400 }}>
              ↑ 8% vs last week  ·  +21 pp over threshold
            </div>
          </div>
        </div>
      </div>

      {/* AI Voice Off Reasons Section */}
      <div className="px-6 py-6 border-b border-[#E5E7EB]">
        <h4 style={{ fontSize: "12px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px", marginTop: 0 }}>
          AI VOICE OFF — REASONS REPORTED
        </h4>
        <div className="flex flex-col gap-3">
          {aiVoiceOffReasons.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span style={{ fontSize: "14px", fontWeight: 400, color: "#1F2937", minWidth: "110px" }}>
                {item.reason}
              </span>
              <div className="flex-1 h-1 rounded-[2px] overflow-hidden" style={{ background: "#F3F4F6" }}>
                <div
                  className="h-1 rounded-[2px]"
                  style={{
                    background: `rgba(220, 38, 38, ${item.opacity})`,
                    width: `${item.percentage}%`
                  }}
                />
              </div>
              <span style={{ fontSize: "12px", color: "#9CA3AF", minWidth: "32px", textAlign: "right" }}>
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Agents Section */}
      <div className="px-6 py-6 border-b border-[#E5E7EB]">
        <h4 style={{ fontSize: "12px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px", marginTop: 0 }}>
          HIGHEST AI VOICE OFF — THIS PAIR
        </h4>
        <div className="flex flex-col gap-1">
          {topAgents.map((agent, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2"
              style={{ borderBottom: idx < topAgents.length - 1 ? "1px solid #F9FAFB" : "none" }}
            >
              <span style={{ fontSize: "14px", fontWeight: 500, color: "#1F2937" }}>
                {agent.name}
              </span>
              <span style={{ fontSize: "14px", fontWeight: 500, color: agent.percentage >= 65 ? "#DC2626" : "#D97706" }}>
                {agent.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Worst Session Section */}
      <div className="px-6 py-6 border-b border-[#E5E7EB] flex-1">
        <h4 style={{ fontSize: "12px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px", marginTop: 0 }}>
          WORST SESSION THIS PERIOD
        </h4>
        <div
          className="p-4 rounded-[6px] flex items-center justify-between cursor-pointer border border-[#E5E7EB] hover:border-[#4023FF] transition-colors"
          style={{ background: "#F9FAFB" }}
        >
          <div>
            <a
              href="#"
              className="flex items-center gap-1"
              style={{
                fontSize: "12px",
                fontWeight: 400,
                marginBottom: "4px",
                textDecoration: "none"
              }}
            >
              <span style={{ color: "#374151" }}>Session</span>
              <span style={{ color: "#4023FF", textDecoration: "underline" }}>{worstSession.id}</span>
              <ArrowUpRight size={12} style={{ color: "#4023FF" }} />
            </a>
            <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
              {worstSession.agent} · {worstSession.duration} · {worstSession.date}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "18px", fontWeight: 500, color: "#DC2626" }}>
              {worstSession.confidence}%
            </div>
            <div style={{ fontSize: "10px", color: "#9CA3AF" }}>conf.</div>
          </div>
        </div>
      </div>

      {/* Footer CTAs */}
      <div className="px-6 py-4">
        <div className="flex gap-4 items-center">
          <a
            href="#"
            className="flex-[2] hover:underline"
            style={{
              color: "#4023FF",
              fontSize: "12px",
              fontWeight: 600,
              textDecoration: "none",
              cursor: "pointer"
            }}
          >
            Review sessions for this pair →
          </a>
          <button
            className="flex-1 px-3 py-2 rounded-[6px] transition-colors"
            style={{
              background: "#F9FAFB",
              color: "#1F2937",
              fontSize: "12px",
              fontWeight: 500,
              border: "0.5px solid #E5E7EB",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#E5E7EB";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#F9FAFB";
            }}
          >
            Flag for QA
          </button>
        </div>
      </div>
    </div>
  );
}
