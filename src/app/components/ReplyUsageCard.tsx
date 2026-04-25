import { useState } from "react";

interface Reply {
  text: string;
  count: number;
}

interface AgentUsage {
  rank: number;
  name: string;
  type: "Preset" | "Typed";
  total: number;
  sessions: number;
}

const repliesData: Reply[] = [
  { text: "Thank you for calling", count: 847 },
  { text: "Please hold", count: 623 },
  { text: "Can you repeat that?", count: 512 },
  { text: "One moment please", count: 401 },
  { text: "Have a great day", count: 356 },
  { text: "How may I assist you?", count: 324 },
  { text: "Connecting you with support", count: 285 },
  { text: "Please verify your info", count: 213 },
  { text: "What is your account number?", count: 198 },
  { text: "Thank you for your patience", count: 150 },
];

const agentUsageData: AgentUsage[] = [
  { rank: 1, name: "Aa'isha Akhtar", type: "Preset", total: 312, sessions: 94 },
  { rank: 2, name: "Ishan Ibanez", type: "Preset", total: 290, sessions: 90 },
  { rank: 3, name: "Kiran Kaur", type: "Preset", total: 243, sessions: 88 },
  { rank: 4, name: "Glen Harper", type: "Preset", total: 201, sessions: 52 },
  { rank: 5, name: "Avery Park", type: "Preset", total: 184, sessions: 45 },
  { rank: 6, name: "Alice Johnson", type: "Preset", total: 156, sessions: 37 },
  { rank: 7, name: "Layla Odom", type: "Typed", total: 139, sessions: 26 },
  { rank: 8, name: "Zackary Walls", type: "Preset", total: 108, sessions: 21 },
  { rank: 9, name: "Aaliyah Snow", type: "Preset", total: 95, sessions: 18 },
  { rank: 10, name: "Saul Velez", type: "Typed", total: 46, sessions: 11 },
];

export function ReplyUsageCard() {
  const [viewMode, setViewMode] = useState<"top10" | "agentUsage">("top10");

  return (
    <div className="px-4 pt-4 pb-2 bg-white rounded-[10px] border border-[#E5E7EB]">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <p className="m-0" style={{ fontSize: "14px", fontWeight: 600, color: "rgba(0,0,0,0.9)" }}>
          Reply Usage
        </p>
      </div>

      <div
        className="mb-2"
        style={{ fontSize: "28px", fontWeight: 600, color: "rgba(0,0,0,0.9)", lineHeight: 1 }}
      >
        68%
      </div>
      <div style={{ fontSize: "12px", color: "rgba(0,0,0,0.6)", marginBottom: "12px" }}>
        of sessions used at least one reply
      </div>

      {/* Chart and breakdown section */}
      <div className="mb-4">
        <p style={{ fontSize: "14px", color: "#6B7280", fontWeight: 500, marginBottom: "12px" }}>
          Type of reply used
        </p>

        {/* Donut Chart with center label */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative" style={{ width: "110px", height: "110px" }}>
            <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: "rotate(-90deg)" }}>
              {/* Background circle */}
              <circle cx="55" cy="55" r="40" fill="none" stroke="#E5E7EB" strokeWidth="20" />
              {/* Preset segment - 72% (259.2 degrees) */}
              <circle
                cx="55"
                cy="55"
                r="40"
                fill="none"
                stroke="#D9B8FF"
                strokeWidth="20"
                strokeDasharray="181 251"
                strokeDashoffset="0"
              />
              {/* Typed segment - 28% */}
              <circle
                cx="55"
                cy="55"
                r="40"
                fill="none"
                stroke="#FFD966"
                strokeWidth="20"
                strokeDasharray="70 251"
                strokeDashoffset="-181"
              />
            </svg>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div style={{ fontSize: "10px", fontWeight: 500, color: "rgba(0,0,0,0.9)", lineHeight: 1.1, textAlign: "center" }}>
                <div style={{ fontSize: "12px" }}>72%</div>
                <div style={{ fontSize: "10px" }}>Preset</div>
              </div>
            </div>
          </div>

          {/* Breakdown bars */}
          <div className="flex-1 flex flex-col gap-2">
            {/* Preset */}
            <div className="flex gap-2 items-center">
              <span style={{ fontSize: "14px", color: "#6B7280", minWidth: "48px" }}>Preset</span>
              <div className="flex-1 h-1 rounded-full bg-[#E5E7EB] overflow-hidden">
                <div style={{ width: "72%", height: "100%", background: "#D9B8FF", borderRadius: "999px" }} />
              </div>
              <span style={{ fontSize: "12px", color: "#6B7280", minWidth: "24px", textAlign: "right" }}>72%</span>
            </div>
            {/* Typed */}
            <div className="flex gap-2 items-center">
              <span style={{ fontSize: "14px", color: "#6B7280", minWidth: "48px" }}>Typed</span>
              <div className="flex-1 h-1 rounded-full bg-[#E5E7EB] overflow-hidden">
                <div style={{ width: "32%", height: "100%", background: "#FFD966", borderRadius: "999px" }} />
              </div>
              <span style={{ fontSize: "12px", color: "#6B7280", minWidth: "24px", textAlign: "right" }}>32%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#E5E7EB] mx-[0px] my-[32px]"></div>

      {/* Section with segmented control */}
      <div className="flex items-center justify-between mx-[0px] mt-[0px] mb-[30px]">
        <p style={{ fontSize: "14px", color: "#6B7280", fontWeight: 500 }}>
          {viewMode === "top10" ? "Top 10 replies" : "Agent reply usage"}
        </p>
        <div className="flex gap-2 bg-[#F8F8FA] p-1 rounded-[8px] border border-[#E5E7EB]">
          <button
            onClick={() => setViewMode("top10")}
            className="px-1.5 py-0.5 rounded-[6px] transition-all"
            style={{
              fontSize: "12px",
              fontWeight: 500,
              background: viewMode === "top10" ? "rgba(64,35,255,0.12)" : "transparent",
              color: viewMode === "top10" ? "#4023FF" : "#6B7280"
            }}
            onMouseEnter={(e) => {
              if (viewMode !== "top10") {
                e.currentTarget.style.background = "rgba(0,0,0,0.03)";
              }
            }}
            onMouseLeave={(e) => {
              if (viewMode !== "top10") {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            Top 10
          </button>
          <button
            onClick={() => setViewMode("agentUsage")}
            className="px-1.5 py-0.5 rounded-[6px] transition-all"
            style={{
              fontSize: "12px",
              fontWeight: 500,
              background: viewMode === "agentUsage" ? "rgba(64,35,255,0.12)" : "transparent",
              color: viewMode === "agentUsage" ? "#4023FF" : "#6B7280"
            }}
            onMouseEnter={(e) => {
              if (viewMode !== "agentUsage") {
                e.currentTarget.style.background = "rgba(0,0,0,0.03)";
              }
            }}
            onMouseLeave={(e) => {
              if (viewMode !== "agentUsage") {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            Agent Usage
          </button>
        </div>
      </div>

      {/* Column headers - fixed height to prevent jumping */}
      {viewMode === "agentUsage" && (
        <div className="flex items-center gap-2 mb-2" style={{ minHeight: "16px" }}>
          <span style={{ fontSize: "14px", color: "#9CA3AF", fontWeight: 400, minWidth: "180px" }}>
            Agent
          </span>
          <span style={{ fontSize: "14px", color: "#9CA3AF", fontWeight: 400, minWidth: "70px", textAlign: "center" }}>
            Type
          </span>
          <span style={{ fontSize: "14px", color: "#9CA3AF", fontWeight: 400, minWidth: "50px", textAlign: "right" }}>
            Total
          </span>
          <span style={{ fontSize: "14px", color: "#9CA3AF", fontWeight: 400, minWidth: "50px", textAlign: "right" }}>
            % sess.
          </span>
        </div>
      )}

      {/* Content area - fixed min height to prevent jumping */}
      <div style={{ minHeight: "300px" }}>
        {viewMode === "top10" ? (
          /* Top 10 replies list */
          <div className="flex flex-col gap-1">
            {repliesData.map((reply, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1"
                style={{
                  borderBottom: idx < 9 ? "1px solid #F9FAFB" : "none",
                }}
              >
                <span style={{ fontSize: "14px", color: "#1F2937", fontWeight: 400 }}>
                  {reply.text}
                </span>
                <span style={{ fontSize: "12px", color: "#6B7280", fontWeight: 500 }}>
                  {reply.count}
                </span>
              </div>
            ))}
          </div>
        ) : (
          /* Agent usage list */
          <div className="flex flex-col gap-1.5">
            {agentUsageData.map((agent, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 py-1"
                style={{
                  borderBottom: idx < 9 ? "1px solid #F9FAFB" : "none",
                }}
              >
                <div className="flex items-center gap-2" style={{ minWidth: "180px" }}>
                  <span style={{ fontSize: "14px", color: "#9CA3AF", fontWeight: 400, minWidth: "20px" }}>
                    {agent.rank}
                  </span>
                  <span style={{ fontSize: "14px", color: "#1F2937", fontWeight: 400 }}>
                    {agent.name}
                  </span>
                </div>
                <div style={{ minWidth: "70px", textAlign: "center" }}><span
                    className="px-2 py-0.5 rounded-[4px] inline-block"
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: agent.type === "Preset" ? "#BB84FB" : "#E8B20E",
                      background: agent.type === "Preset" ? "rgba(217,184,255,0.2)" : "rgba(255,217,102,0.2)",
                    }}
                  >{agent.type}</span></div>
                <span style={{ fontSize: "14px", color: "#6B7280", fontWeight: 500, minWidth: "50px", textAlign: "right" }}>
                  {agent.total}
                </span>
                <span style={{ fontSize: "14px", color: "#6B7280", fontWeight: 600, minWidth: "50px", textAlign: "right" }}>
                  {agent.sessions}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
