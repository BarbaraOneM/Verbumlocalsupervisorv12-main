import { useState, useEffect, useRef } from "react";
import { Shield, TrendingDown, TrendingUp, Clock, RefreshCw, Lock, VolumeX, AlertTriangle, ChevronLeft, ChevronRight, Headphones, CalendarCheck, UserRoundCheck, ListChecks, Users, ClockAlert, Activity } from "lucide-react";
import { Tooltip } from "../components/Tooltip";
import { DateRangeFilter } from "../components/DateRangeFilter";
import { Sidebar } from "../components/Sidebar";
import { LanguagePairsCard } from "../components/LanguagePairsCard";
import { ReplyUsageCard } from "../components/ReplyUsageCard";
import { SidePanel } from "../components/SidePanel";
import { AgentStatusPanel } from "../components/AgentStatusPanel";
import { QualityAlertPanel } from "../components/QualityAlertPanel";
import { ActivityPanel } from "../components/ActivityPanel";
import type { Session } from "../components/ActivityPanel";

export default function Dashboard() {
  const [activeTeam, setActiveTeam] = useState<"all" | "alpha" | "beta">("all");
  const [activeTab, setActiveTab] = useState<"all" | "live" | "alerts">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);
  const [showRefreshTooltip, setShowRefreshTooltip] = useState(false);
  const refreshTooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setJustUpdated(false);
    setTimeout(() => {
      setIsRefreshing(false);
      setJustUpdated(true);
      setTimeout(() => setJustUpdated(false), 4000);
    }, 1200);
  };
  const [dateRangeFilter, setDateRangeFilter] = useState<"last7" | "last30" | "custom">("last7");
  const [openPanel, setOpenPanel] = useState<"agent-status" | "quality-alert" | null>(null);
  const [activityPanelOpen, setActivityPanelOpen] = useState(true);
  const [panelWidth, setPanelWidth] = useState(320);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(320);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const delta = startXRef.current - e.clientX;
      const newWidth = Math.max(240, Math.min(500, startWidthRef.current + delta));
      setPanelWidth(newWidth);
    };
    const handleMouseUp = () => { isDraggingRef.current = false; };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  const [agentFocusSection, setAgentFocusSection] = useState<"available" | "in-session" | "offline">("available");

  // Team data
  const teamData = {
    all: {
      teams: "2 teams · 12 agents",
      agentsOnline: "8 / 12",
      agentsActive: "6 / 12 · 2 available",
      sessionsToday: "142",
      hasShield: false
    },
    alpha: {
      agentCount: "6 agents",
      agentsOnline: "5 / 6",
      agentsActive: "4 / 6 · 1 available",
      sessionsToday: "47",
      hasShield: true
    },
    beta: {
      agentCount: "6 agents",
      agentsOnline: "3 / 6",
      agentsActive: "2 / 6 · 1 available",
      sessionsToday: "73",
      hasShield: false
    }
  };


  const allSessions: Session[] = [
    { id: "#69cac6f7", status: "Live", agent: "Ishan Ibanez", team: "Alpha", pair: "en-US › es-MX", time: "now", dotColor: "#10B981", hipaa: true, speaker: false },
    { id: "#69cac6d3", status: "Live", agent: "Aa'isha Akhtar", team: "Alpha", pair: "en-GB › es-MX", time: "2m ago", dotColor: "#10B981", hipaa: true, speaker: false },
    { id: "#69cac8e5", status: "Live", agent: "Glen Harper", team: "Beta", pair: "en-US › fr-FR", time: "4m ago", dotColor: "#10B981", hipaa: false, speaker: false },
    { id: "#69cac9a2", status: "Live", agent: "Kiran Kaur", team: "Alpha", pair: "de-DE › en-US", time: "7m ago", dotColor: "#10B981", hipaa: true, speaker: false },
    { id: "#69cacb14", status: "Live", agent: "Alice Johnson", team: "Alpha", pair: "en-US › it-IT", time: "9m ago", dotColor: "#10B981", hipaa: true, speaker: false },
    { id: "#69cacc57", status: "Live", agent: "Layla Odom", team: "Beta", pair: "es-MX › en-US", time: "11m ago", dotColor: "#10B981", hipaa: false, speaker: false },
    { id: "#69cac6d3", status: "Completed", agent: "Zackary Walls", team: "Alpha", pair: "en-US › es-MX", time: "15:47", dotColor: "#5B5FF2", hipaa: true, speaker: false },
    { id: "#69cabd46", status: "Completed", agent: "John Doe", team: "Beta", pair: "en-US › fr-FR", time: "15:14", dotColor: "#9CA3AF", hipaa: false, speaker: false },
    { id: "#69caif72", status: "Completed", agent: "Aaliyah Snow", team: "Alpha", pair: "en-GB › es-MX", time: "15:01", dotColor: "#5B5FF2", hipaa: true, speaker: false },
    { id: "#69ca2987", status: "Completed", agent: "Avery Park", team: "Beta", pair: "en-US › nl-BE", time: "14:58", dotColor: "rgba(255,95,56,0.7)", hipaa: false, speaker: true },
    { id: "#78f2bda3", status: "Completed", agent: "Jane Smith", team: "Beta", pair: "es-ES › de-DE", time: "14:02", dotColor: "rgba(245,158,11,0.7)", hipaa: false, speaker: false, alert: true },
    { id: "#83acef12", status: "Completed", agent: "Morgan Taylor", team: "Alpha", pair: "it-IT › pt-PT", time: "13:47", dotColor: "#5B5FF2", hipaa: true, speaker: false },
    { id: "#83ac1a45", status: "Completed", agent: "Jordan Lee", team: "Beta", pair: "en-US › de-DE", time: "13:22", dotColor: "#9CA3AF", hipaa: false, speaker: false },
    { id: "#72bd9c21", status: "Completed", agent: "Casey Chen", team: "Alpha", pair: "fr-FR › en-US", time: "12:58", dotColor: "#5B5FF2", hipaa: true, speaker: false },
    { id: "#61ef7d89", status: "Completed", agent: "Riley Martinez", team: "Beta", pair: "en-GB › es-MX", time: "12:35", dotColor: "#5B5FF2", hipaa: true, speaker: false },
    { id: "#54ca8b12", status: "Completed", agent: "Saul Velez", team: "Alpha", pair: "de-DE › en-US", time: "12:10", dotColor: "#5B5FF2", hipaa: true, speaker: false },
  ];

  const filteredSessions = allSessions.filter(session => {
    if (activeTab === "live") return session.status === "Live";
    if (activeTab === "alerts") return session.alert === true || session.speaker === true;
    return true;
  });

  const hasUnreadAlerts = allSessions.some(s => s.alert);

  // Mock agent data
  const mockAgents = [
    { name: "Ishan Ibanez", status: "in-session" as const, team: "Alpha", languagePair: "en-US › es-MX", elapsedTime: "00:14:32", hasAlert: false },
    { name: "Aa'isha Akhtar", status: "in-session" as const, team: "Alpha", languagePair: "en-GB › es-MX", elapsedTime: "00:08:15", hasAlert: false },
    { name: "Glen Harper", status: "in-session" as const, team: "Beta", languagePair: "en-US › fr-FR", elapsedTime: "00:22:47", hasAlert: true },
    { name: "Kiran Kaur", status: "in-session" as const, team: "Beta", languagePair: "en-GB › es-MX", elapsedTime: "00:05:33", hasAlert: false },
    { name: "Avery Park", status: "in-session" as const, team: "Alpha", languagePair: "en-US › nl-BE", elapsedTime: "00:31:12", hasAlert: true },
    { name: "Alice Johnson", status: "in-session" as const, team: "Beta", languagePair: "en-US › de-DE", elapsedTime: "00:12:08", hasAlert: false },
    { name: "John Doe", status: "available" as const, team: "Alpha" },
    { name: "Jane Smith", status: "available" as const, team: "Beta" },
    { name: "Layla Odom", status: "offline" as const, team: "Alpha", lastSeen: "5 min ago" },
    { name: "Zackary Walls", status: "offline" as const, team: "Beta", lastSeen: "12 min ago" },
    { name: "Aaliyah Snow", status: "offline" as const, team: "Alpha", lastSeen: "23 min ago" },
    { name: "Saul Velez", status: "offline" as const, team: "Beta", lastSeen: "47 min ago" },
  ];

  return (
    <div
      className="flex h-screen"
      style={{
        fontFamily: "'Poppins', sans-serif",
        background: "#F8F8FA",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-[0px] pt-[16px] pb-[24px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-[24px] py-[0px]">
          <h1 className="m-0 flex items-center gap-2" style={{ fontSize: "20px", fontWeight: 600, color: "#1F2937" }}>
            <span>Dashboard</span>
            {activeTeam !== "all" && (
              <>
                <span style={{ color: "#9CA3AF" }}>·</span>
                <span>{activeTeam === "alpha" ? "Alpha" : "Beta"}</span>
                {teamData[activeTeam].hasShield && (
                  <Shield size={18} style={{ color: "#4023FF", strokeWidth: 2 }} />
                )}
              </>
            )}
          </h1>

          {/* Segmented control and HIPAA badge row */}
          <div className="flex items-center gap-4">
              {/* Team selector segmented control */}
              <div className="flex gap-2 bg-white p-1 rounded-[8px] border border-[#E5E7EB]">
                <button
                  onClick={() => setActiveTeam("all")}
                  className="px-4 py-0.5 rounded-[6px] transition-all"
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    background: activeTeam === "all" ? "rgba(64,35,255,0.12)" : "transparent",
                    color: activeTeam === "all" ? "#4023FF" : "#6B7280"
                  }}
                  onMouseEnter={(e) => {
                    if (activeTeam !== "all") {
                      e.currentTarget.style.background = "rgba(0,0,0,0.03)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTeam !== "all") {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  All Teams
                </button>
                <button
                  onClick={() => setActiveTeam("alpha")}
                  className="px-4 py-0.5 rounded-[6px] flex items-center gap-1.5 transition-all"
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    background: activeTeam === "alpha" ? "rgba(64,35,255,0.12)" : "transparent",
                    color: activeTeam === "alpha" ? "#4023FF" : "#6B7280"
                  }}
                  onMouseEnter={(e) => {
                    if (activeTeam !== "alpha") {
                      e.currentTarget.style.background = "rgba(0,0,0,0.03)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTeam !== "alpha") {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <span>Alpha</span>
                  <Tooltip content="HIPAA active. Transcripts not stored for this team." position="bottom">
                    <span className="cursor-help inline-flex items-center" style={{ marginTop: "2.5px" }}>
                      <Shield
                        size={14}
                        style={{ color: "#5B5FF2" }}
                      />
                    </span>
                  </Tooltip>
                </button>
                <button
                  onClick={() => setActiveTeam("beta")}
                  className="px-4 py-0.5 rounded-[6px] transition-all"
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    background: activeTeam === "beta" ? "rgba(64,35,255,0.12)" : "transparent",
                    color: activeTeam === "beta" ? "#4023FF" : "#6B7280"
                  }}
                  onMouseEnter={(e) => {
                    if (activeTeam !== "beta") {
                      e.currentTarget.style.background = "rgba(0,0,0,0.03)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTeam !== "beta") {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  Beta
                </button>
              </div>
            </div>
          </div>

        {/* Body: left sections + right activity panel */}
        <div className="flex items-stretch">
        <div className="flex-1 min-w-0">

        {/* Subheader Bar */}


        {/* Row 1 - Team Status (with gray background) */}
        <div className="bg-[#EEEFF1] border-t border-b border-[#E5E7EB] px-6 pt-3 pb-4 mb-3 rounded-[0px]">
          {/* Section Label */}
          <div className="flex items-center justify-between mb-2">
            <p style={{ fontSize: "12px", fontWeight: 500, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.14px", margin: 0 }}>
              TEAM STATUS — <span style={{ color: "#4023FF" }}>NOW</span>
            </p>
            {/* Updated timestamp + collapsed activity panel button */}
            <div className="flex items-center gap-2" style={{ fontSize: "12px", color: "#9CA3AF", paddingRight: !activityPanelOpen ? "32px" : "0px", transition: "padding-right 0.35s cubic-bezier(0.4, 0, 0.2, 1)" }}>
              <span>{justUpdated ? "Mar 19 ・ 15:58 — Just updated" : "Mar 19 ・ 15:58 - Updated 3 min ago"}</span>

              <div className="relative"
                onMouseEnter={() => { refreshTooltipTimer.current = setTimeout(() => setShowRefreshTooltip(true), 500); }}
                onMouseLeave={() => { if (refreshTooltipTimer.current) clearTimeout(refreshTooltipTimer.current); setShowRefreshTooltip(false); }}
              >
                <button
                  onClick={handleRefresh}
                  className="flex items-center justify-center hover:text-[#6B7280] transition-colors"
                  style={{ background: "none", border: "none", padding: 0, cursor: isRefreshing ? "default" : "pointer", color: "#9CA3AF" }}
                >
                  <RefreshCw size={12} style={{ animation: isRefreshing ? "spin 0.8s linear infinite" : "none" }} />
                </button>
                {showRefreshTooltip && !isRefreshing && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded-[6px] whitespace-nowrap pointer-events-none"
                    style={{ background: "#1F2937", color: "#fff", fontSize: "11px", fontWeight: 400, zIndex: 9999 }}>
                    Update
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4 Cards Grid */}
          {/* Single card with 4 stat sections */}
          <div className="bg-white rounded-[10px] border border-[#E5E7EB] flex divide-x divide-[#F3F4F6]">

            {/* Teams & Agents */}
            <div className="flex-1 px-4 pt-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.9)", fontWeight: 400 }}>
                  Teams & Agents
                </span>
                <div className="w-7 h-7 rounded-[6px] flex items-center justify-center" style={{ background: "rgba(94,97,255,0.08)" }}>
                  <Users size={14} style={{ color: "#4023FF" }} />
                </div>
              </div>
              <div className="mb-1" style={{ fontSize: "22px", fontWeight: 600, color: "rgba(0,0,0,0.9)", lineHeight: 1.1 }}>
                {activeTeam === "all" ? teamData.all.teams : teamData[activeTeam].agentCount}
              </div>
              <div style={{ fontSize: "12px", color: "rgba(0,0,0,0.6)", fontWeight: 400 }}>
                {activeTeam === "all" ? (
                  <>Your assigned teams · <a href="#" style={{ color: "#4023FF", textDecoration: "none" }}>View teams →</a></>
                ) : (
                  <>{activeTeam === "alpha" ? "Alpha" : "Beta"} · <a href="#" style={{ color: "#4023FF", textDecoration: "none" }}>View team →</a></>
                )}
              </div>
            </div>

            {/* Agents Online */}
            <div
              className="flex-1 px-4 pt-4 pb-3 cursor-pointer hover:bg-[#FAFAFA] transition-colors rounded-none"
              onClick={() => { setAgentFocusSection("available"); setOpenPanel("agent-status"); }}
            >
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.9)", fontWeight: 400 }}>Agents Online</span>
                <div className="w-7 h-7 rounded-[6px] flex items-center justify-center" style={{ background: "rgba(16,185,129,0.08)" }}>
                  <UserRoundCheck size={14} style={{ color: "#10B981" }} />
                </div>
              </div>
              <div className="mb-1" style={{ fontSize: "22px", fontWeight: 600, color: "rgba(0,0,0,0.9)", lineHeight: 1.1 }}>
                {activeTeam === "all" ? teamData.all.agentsOnline : teamData[activeTeam].agentsOnline}
              </div>
              <div style={{ fontSize: "12px", color: "rgba(0,0,0,0.6)", fontWeight: 400 }}>Logged in right now</div>
            </div>

            {/* Agents in Active Session */}
            <div
              className="flex-1 px-4 pt-4 pb-3 cursor-pointer hover:bg-[#FAFAFA] transition-colors"
              onClick={() => { setAgentFocusSection("in-session"); setOpenPanel("agent-status"); }}
            >
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.9)", fontWeight: 400 }}>Agents in Active Session</span>
                <div className="w-7 h-7 rounded-[6px] flex items-center justify-center" style={{ background: "rgba(94,97,255,0.08)" }}>
                  <Headphones size={14} style={{ color: "#5E61FF" }} />
                </div>
              </div>
              <div className="mb-1" style={{ fontSize: "22px", fontWeight: 600, color: "rgba(0,0,0,0.9)", lineHeight: 1.1 }}>
                {activeTeam === "all" ? teamData.all.agentsActive : teamData[activeTeam].agentsActive}
              </div>
              <div style={{ fontSize: "12px", color: "rgba(0,0,0,0.6)", fontWeight: 400 }}>
                In active session · <a href="#" style={{ color: "#4023FF", textDecoration: "none" }}>See who's available →</a>
              </div>
            </div>

            {/* Sessions Today */}
            <div className="flex-1 px-4 pt-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.9)", fontWeight: 400 }}>Sessions Today</span>
                <div className="w-7 h-7 rounded-[6px] flex items-center justify-center" style={{ background: "rgba(94,97,255,0.08)" }}>
                  <CalendarCheck size={14} style={{ color: "#5E61FF" }} />
                </div>
              </div>
              <div className="mb-1" style={{ fontSize: "22px", fontWeight: 600, color: "rgba(0,0,0,0.9)", lineHeight: 1.1 }}>
                {activeTeam === "all" ? teamData.all.sessionsToday : teamData[activeTeam].sessionsToday}
              </div>
              <div style={{ fontSize: "12px", color: "rgba(0,0,0,0.6)", fontWeight: 400 }}>Completed today so far</div>
            </div>

          </div>
        </div>

        {/* Row 2 - Session Performance */}
        <div className="mb-3 p-[0px]">
          {/* Section Label with Date Range Filter */}
          <div className="flex items-center justify-between mb-2 px-[24px] py-[0px]">
            <p style={{ fontSize: "12px", fontWeight: 500, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.14px" }}>
              SESSION PERFORMANCE — PERIOD
            </p>
            <DateRangeFilter value={dateRangeFilter} onChange={setDateRangeFilter} />
          </div>

          {/* 2 Cards Grid */}
          <div className="grid grid-cols-2 gap-3 px-[24px] py-[0px]">
            {/* Sessions */}
            <div className="px-4 pt-4 pb-2 bg-white rounded-[10px] border border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.9)", fontWeight: 400 }}>
                  Sessions
                </span>
                <div
                  className="w-7 h-7 rounded-[6px] flex items-center justify-center"
                  style={{ background: "rgba(94,97,255,0.08)" }}
                >
                  <ListChecks size={14} style={{ color: "#5E61FF" }} />
                </div>
              </div>
              <div style={{ fontSize: "22px", fontWeight: 600, color: "rgba(0,0,0,0.9)", lineHeight: 1.2, marginBottom: "1px" }}>
                1,464 Completed
              </div>
              <div style={{ fontSize: "12px", fontWeight: 400, color: "rgba(0,0,0,0.6)", marginBottom: "5px" }}>
                This period
              </div>
              <div
                className="flex items-center gap-1"
                style={{ fontSize: "12px", fontWeight: 500, color: "#DC2626" }}
              >
                <TrendingDown size={11} />
                7% {dateRangeFilter === "last7" ? "vs last week" : dateRangeFilter === "last30" ? "vs last month" : "vs prior period"}
              </div>
            </div>

            {/* Avg. Duration */}
            <div className="px-4 pt-4 pb-2 bg-white rounded-[10px] border border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.9)", fontWeight: 400 }}>
                  Avg. Duration
                </span>
                <div
                  className="w-7 h-7 rounded-[6px] flex items-center justify-center"
                  style={{ background: "rgba(16,185,129,0.08)" }}
                >
                  <Clock size={14} style={{ color: "#10B981" }} />
                </div>
              </div>
              <div
                className="mb-1"
                style={{ fontSize: "22px", fontWeight: 600, color: "rgba(0,0,0,0.9)", lineHeight: 1.1 }}
              >
                00:23:58
              </div>
              <div style={{ fontSize: "12px", color: "rgba(0,0,0,0.6)", fontWeight: 400, marginBottom: "5px" }}>
                Per session this period · <a href="#" style={{ color: "#4023FF", textDecoration: "none" }}>See long sessions →</a>
              </div>
              <div
                className="flex items-center gap-1"
                style={{ fontSize: "12px", fontWeight: 500, color: "#059669" }}
              >
                <TrendingDown size={14} />
                3% {dateRangeFilter === "last7" ? "vs last week" : dateRangeFilter === "last30" ? "vs last month" : "vs prior period"}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom 2 panels */}
        <div className="grid grid-cols-2 gap-3 px-[24px] py-[0px]">
          {/* Language Pairs */}
          <LanguagePairsCard onOpenQualityAlert={() => setOpenPanel("quality-alert")} />

          {/* Reply Usage */}
          <ReplyUsageCard />
        </div>
        </div>{/* end flex-1 min-w-0 */}

        {/* Recent Activity Right Panel */}
        <ActivityPanel
          isOpen={activityPanelOpen}
          onToggle={() => setActivityPanelOpen(!activityPanelOpen)}
          panelWidth={panelWidth}
          onResizeStart={(e) => {
            isDraggingRef.current = true;
            startXRef.current = e.clientX;
            startWidthRef.current = panelWidth;
            e.preventDefault();
          }}
          isDragging={isDraggingRef.current}
          sessions={allSessions}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        </div>{/* end flex items-start */}
      </main>

      {/* Side Panels */}
      <SidePanel
        isOpen={openPanel === "agent-status"}
        onClose={() => setOpenPanel(null)}
        title="Agent Status"
      >
        <AgentStatusPanel
          agents={mockAgents}
          showTeamBadge={activeTeam === "all"}
          focusSection={agentFocusSection}
        />
      </SidePanel>

      <SidePanel
        isOpen={openPanel === "quality-alert"}
        onClose={() => setOpenPanel(null)}
        title="Quality Alert"
      >
        <QualityAlertPanel
          languagePair="en-US › nl-BE"
          aiVoiceOff={51}
          confidence={65}
          sessionsCount={13}
          trendPercentage={8}
          trendDirection="up"
          trendLabel={dateRangeFilter === "last7" ? "vs last week" : dateRangeFilter === "last30" ? "vs last month" : "vs prior period"}
          topAgents={[
            { name: "Avery Park", percentage: 78 },
            { name: "Glen Harper", percentage: 65 },
            { name: "Kiran Kaur", percentage: 42 }
          ]}
        />
      </SidePanel>
    </div>
  );
}