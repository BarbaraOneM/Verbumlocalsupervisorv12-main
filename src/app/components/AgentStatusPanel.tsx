import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Agent {
  name: string;
  status: "available" | "in-session" | "offline";
  team?: string;
  languagePair?: string;
  elapsedTime?: string;
  hasAlert?: boolean;
  lastSeen?: string;
}

interface AgentStatusPanelProps {
  agents: Agent[];
  showTeamBadge: boolean;
  focusSection?: "available" | "in-session" | "offline";
}

export function AgentStatusPanel({ agents, showTeamBadge, focusSection }: AgentStatusPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(focusSection === "offline" ? ["available", "in-session", "offline"] : ["available", "in-session"])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const availableAgents = agents.filter(a => a.status === "available");
  const inSessionAgents = agents.filter(a => a.status === "in-session");
  const offlineAgents = agents.filter(a => a.status === "offline");

  return (
    <div className="flex flex-col">
      {/* Available Section */}
      <div id="available-section">
        <button
          onClick={() => toggleSection("available")}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F9FAFB] transition-colors"
          style={{ border: "none", background: "transparent", cursor: "pointer", textAlign: "left" }}
        >
          <div className="flex items-center gap-2">
            {expandedSections.has("available") ? (
              <ChevronDown size={16} style={{ color: "#6B7280" }} />
            ) : (
              <ChevronRight size={16} style={{ color: "#6B7280" }} />
            )}
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#1F2937" }}>
              Available · {availableAgents.length}
            </span>
          </div>
        </button>
        {expandedSections.has("available") && (
          <div className="px-6 pb-4">
            {availableAgents.map((agent, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 py-2"
                style={{ borderBottom: idx < availableAgents.length - 1 ? "1px solid #F9FAFB" : "none" }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#10B981" }} />
                <span style={{ fontSize: "14px", fontWeight: 500, color: "#1F2937" }}>{agent.name}</span>
                {showTeamBadge && agent.team && (
                  <span
                    className="px-2 py-0.5 rounded-[4px]"
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      background: "#F3F4F6",
                      color: "#6B7280"
                    }}
                  >
                    {agent.team}
                  </span>
                )}
                <span className="ml-auto" style={{ fontSize: "14px", color: "#6B7280" }}>Online · available</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* In Session Section */}
      <div id="in-session-section" className="border-t border-[#F3F4F6]">
        <button
          onClick={() => toggleSection("in-session")}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F9FAFB] transition-colors"
          style={{ border: "none", background: "transparent", cursor: "pointer", textAlign: "left" }}
        >
          <div className="flex items-center gap-2">
            {expandedSections.has("in-session") ? (
              <ChevronDown size={16} style={{ color: "#6B7280" }} />
            ) : (
              <ChevronRight size={16} style={{ color: "#6B7280" }} />
            )}
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#1F2937" }}>
              In Session · {inSessionAgents.length}
            </span>
          </div>
        </button>
        {expandedSections.has("in-session") && (
          <div className="px-6 pb-4">
            {inSessionAgents.map((agent, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 py-2"
                style={{ borderBottom: idx < inSessionAgents.length - 1 ? "1px solid #F9FAFB" : "none" }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#10B981" }} />
                <span style={{ fontSize: "14px", fontWeight: 500, color: "#1F2937" }}>{agent.name}</span>
                {showTeamBadge && agent.team && (
                  <span
                    className="px-2 py-0.5 rounded-[4px]"
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      background: "#F3F4F6",
                      color: "#6B7280"
                    }}
                  >
                    {agent.team}
                  </span>
                )}
                <span style={{ fontSize: "14px", color: "#6B7280" }}>{agent.languagePair}</span>
                {agent.hasAlert && (
                  <div className="w-1.5 h-1.5 rounded-[1px] flex-shrink-0 ml-auto" style={{ background: "#F59E0B" }} />
                )}
                <span className={agent.hasAlert ? "" : "ml-auto"} style={{ fontSize: "14px", color: "#6B7280", fontFamily: "'Poppins', sans-serif" }}>
                  {agent.elapsedTime}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Offline Section */}
      <div id="offline-section" className="border-t border-[#F3F4F6]">
        <button
          onClick={() => toggleSection("offline")}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F9FAFB] transition-colors"
          style={{ border: "none", background: "transparent", cursor: "pointer", textAlign: "left" }}
        >
          <div className="flex items-center gap-2">
            {expandedSections.has("offline") ? (
              <ChevronDown size={16} style={{ color: "#6B7280" }} />
            ) : (
              <ChevronRight size={16} style={{ color: "#6B7280" }} />
            )}
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#1F2937" }}>
              Offline · {offlineAgents.length}
            </span>
          </div>
        </button>
        {expandedSections.has("offline") && (
          <div className="px-6 pb-4">
            {offlineAgents.map((agent, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 py-2"
                style={{ borderBottom: idx < offlineAgents.length - 1 ? "1px solid #F9FAFB" : "none" }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#9CA3AF" }} />
                <span style={{ fontSize: "14px", fontWeight: 500, color: "#1F2937" }}>{agent.name}</span>
                {showTeamBadge && agent.team && (
                  <span
                    className="px-2 py-0.5 rounded-[4px]"
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      background: "#F3F4F6",
                      color: "#6B7280"
                    }}
                  >
                    {agent.team}
                  </span>
                )}
                <span className="ml-auto" style={{ fontSize: "14px", color: "#9CA3AF" }}>
                  Last seen {agent.lastSeen}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
