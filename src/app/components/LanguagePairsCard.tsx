import { useState } from "react";
import { Info } from "lucide-react";
import { Tooltip } from "./Tooltip";
import { getAIVoiceColor, getConfColor } from "../utils/qualityColors";

interface LanguagePair {
  pair: string;
  count: number;
  width: string;
  aiOff: number;
  conf: number;
}

const languagePairsData: LanguagePair[] = [
  { pair: "en-US › nl-BE", count: 13, width: "2%", aiOff: 51, conf: 65 },
  { pair: "nl-BE › en-US", count: 10, width: "1.5%", aiOff: 22, conf: 81 },
  { pair: "es-MX › en-US", count: 117, width: "15%", aiOff: 18, conf: 91 },
  { pair: "es-MX › de-DE", count: 8, width: "1%", aiOff: 12, conf: 93 },
  { pair: "en-US › it-IT", count: 357, width: "45%", aiOff: 4, conf: 92 },
  { pair: "en-US › de-DE", count: 625, width: "80%", aiOff: 1, conf: 95 },
  { pair: "en-US › fr-FR", count: 1050, width: "95%", aiOff: 3, conf: 94 },
  { pair: "en-US › es-MX", count: 1240, width: "100%", aiOff: 2, conf: 96 },
];

interface LanguagePairsCardProps {
  onOpenQualityAlert?: () => void;
}

export function LanguagePairsCard({ onOpenQualityAlert }: LanguagePairsCardProps) {
  const [sortBy, setSortBy] = useState<"attention" | "volume">("attention");
  const [showQuality, setShowQuality] = useState(true);
  const [showInfoPopover, setShowInfoPopover] = useState(false);

  // Sort data based on selected tab
  const sortedData = [...languagePairsData].sort((a, b) => {
    if (sortBy === "attention") {
      // Sort by AI Voice Off (descending - worst first)
      return b.aiOff - a.aiOff;
    } else {
      // Sort by volume (descending - highest first)
      return b.count - a.count;
    }
  });

  return (
    <div className="px-4 pt-4 pb-2 bg-white rounded-[10px] border border-[#E5E7EB] flex flex-col">
      {/* Title with Segmented Control */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 relative">
          <p className="m-0" style={{ fontSize: "14px", fontWeight: 600, color: "rgba(0,0,0,0.9)" }}>
            Language Pairs
          </p>
          <button
            onClick={() => setShowInfoPopover(!showInfoPopover)}
            className="w-4 h-4 rounded flex items-center justify-center transition-colors"
            style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0 }}
          >
            <Info size={14} style={{ color: "#9CA3AF" }} />
          </button>

          {/* Info Popover */}
          {showInfoPopover && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-[9998]"
                onClick={() => setShowInfoPopover(false)}
              />

              {/* Popover */}
              <div
                className="absolute top-full left-0 mt-2 z-[9999] bg-white rounded-[8px] border border-[#E5E7EB] overflow-hidden"
                style={{
                  minWidth: "480px",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
                }}
              >
                {/* Upward Triangle Arrow */}
                <div
                  className="absolute -top-2 left-4"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "8px solid transparent",
                    borderRight: "8px solid transparent",
                    borderBottom: "8px solid #0A1628"
                  }}
                />

                {/* Navy Header Bar */}
                <div
                  className="px-4 py-3"
                  style={{ background: "#0A1628" }}
                >
                  <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF", margin: 0 }}>
                    Quality Thresholds
                  </h4>
                </div>

                {/* Table */}
                <div className="flex flex-col p-4">
                  {/* Header Row */}
                  <div className="grid grid-cols-5 gap-3 pb-2 border-b border-[#E5E7EB]" style={{ marginBottom: "8px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280" }}></div>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#0E9E6E", textAlign: "center" }}>Excellent</div>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#10B981", textAlign: "center" }}>Good</div>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#F59E0B", textAlign: "center" }}>Poor</div>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#DC2626", textAlign: "center" }}>Critical</div>
                  </div>

                  {/* Conf. Row */}
                  <div className="grid grid-cols-5 gap-3 py-2 border-b border-[#F3F4F6]">
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#1F2937" }}>Conf.</div>
                    <div style={{ fontSize: "12px", color: "#6B7280", textAlign: "center" }}>90-100%</div>
                    <div style={{ fontSize: "12px", color: "#6B7280", textAlign: "center" }}>70-89%</div>
                    <div style={{ fontSize: "12px", color: "#6B7280", textAlign: "center" }}>50-69%</div>
                    <div style={{ fontSize: "12px", color: "#6B7280", textAlign: "center" }}>0-49%</div>
                  </div>

                  {/* AI Voice Off Row */}
                  <div className="grid grid-cols-5 gap-3 py-2">
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#1F2937" }}>AI Voice Off</div>
                    <div style={{ fontSize: "12px", color: "#6B7280", textAlign: "center" }}>{"< 15%"}</div>
                    <div style={{ fontSize: "12px", color: "#6B7280", textAlign: "center" }}>15-20%</div>
                    <div style={{ fontSize: "12px", color: "#6B7280", textAlign: "center" }}>20-30%</div>
                    <div style={{ fontSize: "12px", color: "#6B7280", textAlign: "center" }}>{"> 30%"}</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex gap-2 bg-[#F8F8FA] p-1 rounded-[8px] border border-[#E5E7EB]">
          <button
            onClick={() => setSortBy("attention")}
            className="px-1.5 py-0.5 rounded-[6px] transition-all"
            style={{
              fontSize: "12px",
              fontWeight: 500,
              background: sortBy === "attention" ? "rgba(64,35,255,0.12)" : "transparent",
              color: sortBy === "attention" ? "#4023FF" : "#6B7280"
            }}
            onMouseEnter={(e) => {
              if (sortBy !== "attention") {
                e.currentTarget.style.background = "rgba(0,0,0,0.03)";
              }
            }}
            onMouseLeave={(e) => {
              if (sortBy !== "attention") {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            Needs Attention
          </button>
          <button
            onClick={() => setSortBy("volume")}
            className="px-1.5 py-0.5 rounded-[6px] transition-all"
            style={{
              fontSize: "12px",
              fontWeight: 500,
              background: sortBy === "volume" ? "rgba(64,35,255,0.12)" : "transparent",
              color: sortBy === "volume" ? "#4023FF" : "#6B7280"
            }}
            onMouseEnter={(e) => {
              if (sortBy !== "volume") {
                e.currentTarget.style.background = "rgba(0,0,0,0.03)";
              }
            }}
            onMouseLeave={(e) => {
              if (sortBy !== "volume") {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            Volume
          </button>
        </div>
      </div>

      {/* Column headers - fixed height to prevent jumping */}
      <div className="flex items-center justify-end gap-2 mb-1 pr-1" style={{ minHeight: "16.5px" }}>
        {showQuality && (
          <>
            <Tooltip content="AI translation confidence score">
              <span
                className="cursor-help"
                style={{
                  fontSize: "12px",
                  color: "#9CA3AF",
                  textDecoration: "underline",
                  textDecorationColor: "#9CA3AF",
                  minWidth: "36px",
                  textAlign: "right",
                  paddingLeft: "4px",
                  paddingRight: "4px"
                }}
              >
                Conf.
              </span>
            </Tooltip>
            <Tooltip content="Sessions where agent disabled AI Voice">
              <span
                className="cursor-help"
                style={{
                  fontSize: "12px",
                  color: "#9CA3AF",
                  textDecoration: "underline",
                  textDecorationColor: "#9CA3AF"
                }}
              >
                AI Voice
              </span>
            </Tooltip>
          </>
        )}
      </div>

      {/* Language pairs list */}
      <div className="flex flex-col">
        {sortedData.map((item, idx) => {
          // Highlight the worst performer (en-US › nl-BE with 51% AI Voice Off) regardless of tab
          const needsAttention = item.pair === "en-US › nl-BE";

          return (
            <div
              key={item.pair}
              className="flex items-center gap-2 group cursor-pointer px-[0px] py-[12px]"
              onClick={needsAttention && onOpenQualityAlert ? onOpenQualityAlert : undefined}
              style={{
                borderBottom: idx < sortedData.length - 1 ? "1px solid #F3F4F6" : "none",
                background: needsAttention ? "rgba(220,38,38,0.05)" : "transparent",
                marginLeft: "-16px",
                marginRight: "-16px",
                paddingLeft: "16px",
                paddingRight: "16px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                  fontWeight: 500,
                  fontFamily: "'Poppins', sans-serif",
                  whiteSpace: "nowrap",
                  minWidth: "110px",
                }}
              >
                {item.pair}
              </span>
              <div
                className="flex-1 h-1 rounded-[2px] overflow-hidden"
                style={{ background: "#F3F4F6" }}
              >
                <div
                  className="h-1 rounded-[2px] transition-all"
                  style={{
                    background: "rgba(64,35,255,0.35)",
                    width: item.width,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: "12px",
                  color: "#9CA3AF",
                  whiteSpace: "nowrap",
                  minWidth: "35px",
                  textAlign: "right"
                }}
              >
                {item.count}
              </span>
              {showQuality && (
                <>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: getConfColor(item.conf),
                      minWidth: "45px",
                      textAlign: "center"
                    }}
                  >
                    {item.conf}%
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: getAIVoiceColor(item.aiOff),
                      minWidth: "38px",
                      textAlign: "center"
                    }}
                  >
                    {item.aiOff}%
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Quality breakdown toggle */}
      <div className="mt-auto pt-3 border-t border-[#F3F4F6]">
        <button
          onClick={() => setShowQuality(!showQuality)}
          style={{ fontSize: "12px", color: "#6B7280", background: "none", border: "none", cursor: "pointer" }}
        >
          {showQuality ? "Showing" : "Hidden"} quality breakdown · <span style={{ color: "#4023FF" }}>{showQuality ? "Hide" : "Show"}</span>
        </button>
      </div>
    </div>
  );
}
