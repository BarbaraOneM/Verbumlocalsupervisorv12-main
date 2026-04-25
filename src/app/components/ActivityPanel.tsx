import { useState } from "react";
import { ChevronLeft, ChevronRight, Activity, ClockAlert, VolumeX, Lock } from "lucide-react";

export interface Session {
  id: string;
  status: "Live" | "Completed";
  agent: string;
  pair: string;
  time: string;
  dotColor: string;
  hipaa: boolean;
  speaker: boolean;
  alert?: boolean;
}

interface ActivityPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  panelWidth: number;
  onResizeStart: (e: React.MouseEvent<HTMLDivElement>) => void;
  isDragging: boolean;
  sessions: Session[];
  activeTab: "all" | "live" | "alerts";
  onTabChange: (tab: "all" | "live" | "alerts") => void;
}

export function ActivityPanel({
  isOpen,
  onToggle,
  panelWidth,
  onResizeStart,
  isDragging,
  sessions,
  activeTab,
  onTabChange,
}: ActivityPanelProps) {
  const [showLegend, setShowLegend] = useState(false);

  const hasUnreadAlerts = sessions.some(s => s.alert);

  const filteredSessions = sessions.filter(session => {
    if (activeTab === "live") return session.status === "Live";
    if (activeTab === "alerts") return session.alert;
    return true;
  });

  return (
    <div
      className={`flex-shrink-0 flex flex-col relative ${isOpen ? "bg-white border-l border-t border-[#E5E7EB]" : "bg-transparent"}`}
      style={{
        width: isOpen ? `${panelWidth}px` : "48px",
        transition: isDragging ? "none" : "width 0.2s ease",
        overflow: isOpen ? "hidden" : "visible",
        position: isOpen ? "sticky" : "fixed",
        top: isOpen ? 0 : "97px",
        right: isOpen ? "auto" : 0,
        alignSelf: isOpen ? "flex-start" : "auto",
        maxHeight: isOpen ? "calc(100vh - 24px)" : "auto",
        zIndex: isOpen ? "auto" : 50,
      }}
    >
      {/* Resize handle */}
      {isOpen && (
        <div
          className="absolute left-0 top-0 bottom-0 w-0 cursor-col-resize z-10 hover:bg-[#4023FF] hover:opacity-20"
          onMouseDown={onResizeStart}
        />
      )}

      {/* Panel header */}
      <div
        className={`flex-shrink-0 flex ${isOpen ? "border-b border-[#E5E7EB] items-center" : "items-center justify-center"}`}
        style={{ padding: isOpen ? "16px 12px" : "10px 0px 0px 0px", minHeight: isOpen ? "57px" : "auto", gap: "8px" }}
      >
        {isOpen ? (
          /* Expanded: simple chevron button */
          <button
            onClick={onToggle}
            className="w-7 h-7 rounded-[6px] flex items-center justify-center flex-shrink-0 hover:bg-[#F3F4F6] transition-colors"
          >
            <ChevronRight size={14} style={{ color: "#6B7280" }} />
          </button>
        ) : (
          /* Collapsed: pill button — right corners flush with panel edge */
          <button
            onClick={onToggle}
            className="flex items-center gap-1 px-2 border border-[#E5E7EB] bg-white hover:border-[#4023FF] transition-colors"
            style={{ height: "32px", borderRadius: "8px 0 0 8px" }}
          >
            <ChevronLeft size={13} style={{ color: "#6B7280" }} />
            <Activity size={13} style={{ color: "#6B7280" }} />
          </button>
        )}
        {isOpen && (
          <div className="relative flex-1 min-w-0">
            <p
              className="m-0 cursor-help truncate"
              style={{ fontSize: "14px", fontWeight: 600, color: "rgba(0,0,0,0.9)" }}
              onMouseEnter={() => setShowLegend(true)}
              onMouseLeave={() => setShowLegend(false)}
            >
              Recent Activity
            </p>
            {showLegend && (
              <div
                className="absolute top-full left-0 mt-2 z-[9999] pointer-events-none"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <div
                  className="px-3 py-2 rounded-[8px] shadow-lg"
                  style={{
                    background: "#1F2937",
                    color: "#FFFFFF",
                    fontSize: "12px",
                    fontWeight: 400,
                    lineHeight: "16.5px",
                    minWidth: "200px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: "#10B981" }} />
                      <span>Live session</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: "#5B5FF2" }} />
                      <span>HIPAA protected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: "rgba(255,95,56,0.7)" }} />
                      <span>AI Voice disabled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-[6px] h-[6px] rounded-[1px] flex-shrink-0" style={{ background: "rgba(245,158,11,0.7)" }} />
                      <span>Long session alert</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: "#9CA3AF" }} />
                      <span>Completed</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {isOpen && (
          <div className="flex gap-1 bg-[#F8F8FA] p-1 rounded-[8px] border border-[#E5E7EB] flex-shrink-0">
            <button
              onClick={() => onTabChange("all")}
              className="px-1.5 py-0.5 rounded-[6px] transition-all"
              style={{
                fontSize: "11px",
                fontWeight: 500,
                background: activeTab === "all" ? "rgba(64,35,255,0.12)" : "transparent",
                color: activeTab === "all" ? "#4023FF" : "#6B7280"
              }}
            >
              All
            </button>
            <button
              onClick={() => onTabChange("live")}
              className="px-1.5 py-0.5 rounded-[6px] transition-all"
              style={{
                fontSize: "11px",
                fontWeight: 500,
                background: activeTab === "live" ? "rgba(64,35,255,0.12)" : "transparent",
                color: activeTab === "live" ? "#4023FF" : "#6B7280"
              }}
            >
              Live
            </button>
            <button
              onClick={() => onTabChange("alerts")}
              className="px-1.5 py-0.5 rounded-[6px] relative transition-all"
              style={{
                fontSize: "11px",
                fontWeight: 500,
                background: activeTab === "alerts" ? "rgba(64,35,255,0.12)" : "transparent",
                color: activeTab === "alerts" ? "#4023FF" : "#6B7280"
              }}
            >
              Alerts
              {hasUnreadAlerts && activeTab !== "alerts" && (
                <div
                  className="absolute top-[3px] right-[3px] w-1 h-1 rounded-full"
                  style={{ background: "#FF5F38" }}
                />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Session list */}
      {isOpen && (
        <div className="flex flex-col flex-1 overflow-hidden px-3">
          <div className="flex flex-col overflow-y-auto flex-1">
            {filteredSessions.map((session, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 py-[8px]"
                style={{
                  borderBottom: idx < filteredSessions.length - 1 ? "1px solid #F3F4F6" : "none",
                }}
              >
                <div
                  className={`w-[6px] h-[6px] ${session.alert ? 'rounded-[1px]' : 'rounded-full'} flex-shrink-0`}
                  style={{ background: session.dotColor }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-0.5 flex-wrap">
                    {session.alert && <ClockAlert size={13} style={{ color: "rgba(245,158,11,0.7)" }} />}
                    {session.speaker && <VolumeX size={13} style={{ color: "#FF5F38" }} />}
                    {session.hipaa && <Lock size={13} style={{ color: "#5B5FF2" }} />}
                    <span
                      className="px-1.5 py-0.5 rounded-[4px]"
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        background: session.status === "Live" ? "rgba(16,185,129,0.08)" : "#F3F4F6",
                        color: session.status === "Live" ? "#10B981" : "#6B7280",
                      }}
                    >
                      {session.status}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#374151", fontWeight: 500 }} className="truncate">
                    {session.agent}
                  </div>
                  <div style={{ fontSize: "11px", color: "#9CA3AF" }} className="truncate">
                    {session.pair}
                  </div>
                </div>
                <div style={{ fontSize: "11px", color: "#9CA3AF", flexShrink: 0 }}>
                  {session.time}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="pt-3 pb-3 border-t border-[#F3F4F6] flex-shrink-0">
            {activeTab === "all" && (
              <a href="#" className="text-[12px] text-[#4023FF] hover:underline" style={{ fontWeight: 500 }}>
                View all sessions →
              </a>
            )}
            {activeTab === "live" && (
              <div style={{ fontSize: "12px", color: "#6B7280", fontStyle: "italic" }}>
                {filteredSessions.length} live session{filteredSessions.length !== 1 ? 's' : ''}
              </div>
            )}
            {activeTab === "alerts" && (
              <div className="flex flex-col gap-1.5" style={{ fontSize: "11px", color: "#6B7280" }}>
                <div className="flex items-center gap-2">
                  <div className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: "rgba(255,95,56,0.7)" }} />
                  <span>AI Voice disabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-[6px] h-[6px] rounded-[1px] flex-shrink-0" style={{ background: "rgba(245,158,11,0.7)" }} />
                  <span>Long session alert</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
