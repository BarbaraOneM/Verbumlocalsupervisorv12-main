import { useState, useEffect, useRef } from "react";
import { Shield, TrendingDown, TrendingUp, Clock, RefreshCw, Lock, VolumeX, AlertTriangle, ChevronDown, ChevronLeft, ChevronRight, Headphones, CalendarCheck, UserRoundCheck, ListChecks, Users, ClockAlert, Calendar, Check, Activity } from "lucide-react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Tooltip } from "../components/Tooltip";
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
  const [dateRangeFilter, setDateRangeFilter] = useState<"last7" | "last30" | "custom">("last7");
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerPosition, setDatePickerPosition] = useState({ top: 0, left: 0 });
  const dateDropdownRef = useRef<HTMLDivElement>(null);
  const dateButtonRef = useRef<HTMLButtonElement>(null);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target as Node)) {
        setShowDateDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allSessions: Session[] = [
    { id: "#69cac6f7", status: "Live", agent: "Ishan Ibanez", pair: "en-US › es-MX", time: "now", dotColor: "#10B981", hipaa: false, speaker: false },
    { id: "#69cac6d3", status: "Live", agent: "Aa'isha Akhtar", pair: "en-GB › es-MX", time: "2m ago", dotColor: "#10B981", hipaa: false, speaker: false },
    { id: "#69cac8e5", status: "Live", agent: "Glen Harper", pair: "en-US › fr-FR", time: "4m ago", dotColor: "#10B981", hipaa: false, speaker: false },
    { id: "#69cac9a2", status: "Live", agent: "Kiran Kaur", pair: "de-DE › en-US", time: "7m ago", dotColor: "#10B981", hipaa: true, speaker: false },
    { id: "#69cacb14", status: "Live", agent: "Alice Johnson", pair: "en-US › it-IT", time: "9m ago", dotColor: "#10B981", hipaa: false, speaker: false },
    { id: "#69cacc57", status: "Live", agent: "Layla Odom", pair: "es-MX › en-US", time: "11m ago", dotColor: "#10B981", hipaa: false, speaker: false },
    { id: "#69cac6d3", status: "Completed", agent: "Zackary Walls", pair: "en-US › es-MX", time: "15:47", dotColor: "#5B5FF2", hipaa: true, speaker: false },
    { id: "#69cabd46", status: "Completed", agent: "John Doe", pair: "en-US › fr-FR", time: "15:14", dotColor: "#9CA3AF", hipaa: false, speaker: false },
    { id: "#69caif72", status: "Completed", agent: "Aaliyah Snow", pair: "en-GB › es-MX", time: "15:01", dotColor: "#5B5FF2", hipaa: true, speaker: false },
    { id: "#69ca2987", status: "Completed", agent: "Avery Park", pair: "en-US › nl-BE", time: "14:58", dotColor: "rgba(255,95,56,0.7)", hipaa: false, speaker: true },
    { id: "#78f2bda3", status: "Completed", agent: "Jane Smith", pair: "es-ES › de-DE", time: "14:02", dotColor: "rgba(245,158,11,0.7)", hipaa: false, speaker: false, alert: true },
    { id: "#83acef12", status: "Completed", agent: "Morgan Taylor", pair: "it-IT › pt-PT", time: "13:47", dotColor: "#9CA3AF", hipaa: false, speaker: false },
    { id: "#83ac1a45", status: "Completed", agent: "Jordan Lee", pair: "en-US › de-DE", time: "13:22", dotColor: "#9CA3AF", hipaa: false, speaker: false },
    { id: "#72bd9c21", status: "Completed", agent: "Casey Chen", pair: "fr-FR › en-US", time: "12:58", dotColor: "#9CA3AF", hipaa: false, speaker: false },
    { id: "#61ef7d89", status: "Completed", agent: "Riley Martinez", pair: "en-GB › es-MX", time: "12:35", dotColor: "#5B5FF2", hipaa: true, speaker: false },
    { id: "#54ca8b12", status: "Completed", agent: "Saul Velez", pair: "de-DE › en-US", time: "12:10", dotColor: "#9CA3AF", hipaa: false, speaker: false },
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
      <main className="flex-1 overflow-y-auto px-[0px] py-[24px]">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 px-[24px] py-[0px]">
          <div>
            <div style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "2px" }}>
              VerbumLocal <span style={{ color: "#6B7280" }}>› Supervisor Panel</span>
            </div>
            <h1 className="m-0 flex items-center gap-2" style={{ fontSize: "22px", fontWeight: 600, color: "#1F2937" }}>
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
            
          </div>

          <div className="flex flex-col items-end gap-2">
            {/* Updated timestamp */}
            <div className="flex items-center gap-2" style={{ fontSize: "12px", color: "#9CA3AF" }}>
              <span>Mar 19 ・ 15:58 - Updated 3 min ago</span>
              <RefreshCw size={12} />
            </div>

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

        </div>

        {/* Body: left sections + right activity panel */}
        <div className="flex items-start">
        <div className="flex-1 min-w-0">

        {/* Subheader Bar */}


        {/* Row 1 - Team Status (with gray background) */}
        <div className="bg-[#EEEFF1] border-t border-b border-[#E5E7EB] px-6 pt-3 pb-4 mb-5 rounded-[0px]">
          {/* Section Label */}
          <div className="mb-2">
            <p style={{ fontSize: "14px", fontWeight: 500, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.14px" }}>
              TEAM STATUS — <span style={{ color: "#4023FF" }}>NOW</span>
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-4 gap-4">
            {/* Teams & Agents */}
            <div className="px-4 pt-4 pb-2 bg-white rounded-[10px] border border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.9)", fontWeight: 400 }}>
                  Teams & Agents
                </span>
                <div
                  className="w-7 h-7 rounded-[6px] flex items-center justify-center"
                  style={{ background: "rgba(94,97,255,0.08)" }}
                >
                  <Users size={14} style={{ color: "#4023FF" }} />
                </div>
              </div>
              <div
                className="mb-1"
                style={{ fontSize: "22px", fontWeight: 600, color: "rgba(0,0,0,0.9)", lineHeight: 1.1 }}
              >
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
              className="px-4 pt-4 pb-2 bg-white rounded-[10px] border border-[#E5E7EB] cursor-pointer hover:border-[#4023FF] transition-colors"
              onClick={() => {
                setAgentFocusSection("available");
                setOpenPanel("agent-status");
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.9)", fontWeight: 400 }}>
                  Agents Online
                </span>
                <div
                  className="w-7 h-7 rounded-[6px] flex items-center justify-center relative"
                  style={{ background: "rgba(16,185,129,0.08)" }}
                >
                  <UserRoundCheck size={14} style={{ color: "#10B981" }} />

                </div>
              </div>
              <div
                className="mb-1"
                style={{ fontSize: "22px", fontWeight: 600, color: "rgba(0,0,0,0.9)", lineHeight: 1.1 }}
              >
                {activeTeam === "all" ? teamData.all.agentsOnline : teamData[activeTeam].agentsOnline}
              </div>
              <div style={{ fontSize: "12px", color: "rgba(0,0,0,0.6)", fontWeight: 400 }}>
                Logged in right now
              </div>
            </div>

            {/* Agents in Active Session */}
            <div
              className="px-4 pt-4 pb-2 bg-white rounded-[10px] border border-[#E5E7EB] cursor-pointer hover:border-[#4023FF] transition-colors"
              onClick={() => {
                setAgentFocusSection("in-session");
                setOpenPanel("agent-status");
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.9)", fontWeight: 400 }}>
                  Agents in Active Session
                </span>
                <div
                  className="w-7 h-7 rounded-[6px] flex items-center justify-center"
                  style={{ background: "rgba(94,97,255,0.08)" }}
                >
                  <Headphones size={14} style={{ color: "#5E61FF" }} />
                </div>
              </div>
              <div
                className="mb-1"
                style={{ fontSize: "22px", fontWeight: 600, color: "rgba(0,0,0,0.9)", lineHeight: 1.1 }}
              >
                {activeTeam === "all" ? teamData.all.agentsActive : teamData[activeTeam].agentsActive}
              </div>
              <div style={{ fontSize: "12px", color: "rgba(0,0,0,0.6)", fontWeight: 400 }}>
                In active session · <a href="#" style={{ color: "#4023FF", textDecoration: "none" }}>See who's available →</a>
              </div>
            </div>

            {/* Sessions Today */}
            <div className="px-4 pt-4 pb-2 bg-white rounded-[10px] border border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.9)", fontWeight: 400 }}>
                  Sessions Today
                </span>
                <div
                  className="w-7 h-7 rounded-[6px] flex items-center justify-center"
                  style={{ background: "rgba(94,97,255,0.08)" }}
                >
                  <CalendarCheck size={14} style={{ color: "#5E61FF" }} />
                </div>
              </div>
              <div
                className="mb-1"
                style={{ fontSize: "22px", fontWeight: 600, color: "rgba(0,0,0,0.9)", lineHeight: 1.1 }}
              >
                {activeTeam === "all" ? teamData.all.sessionsToday : teamData[activeTeam].sessionsToday}
              </div>
              <div style={{ fontSize: "12px", color: "rgba(0,0,0,0.6)", fontWeight: 400, marginBottom: "5px" }}>
                Completed today so far
              </div>

            </div>
          </div>
        </div>

        {/* Row 2 - Session Performance */}
        <div className="mb-5 p-[0px]">
          {/* Section Label with Date Range Filter */}
          <div className="flex items-center justify-between mb-2 px-[24px] py-[0px]">
            <p style={{ fontSize: "14px", fontWeight: 500, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.14px" }}>
              SESSION PERFORMANCE — PERIOD
            </p>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.6)", fontWeight: 500 }}>Date range</span>
              <div className="relative" ref={dateDropdownRef}>
                <button
                  ref={dateButtonRef}
                  onClick={() => setShowDateDropdown(!showDateDropdown)}
                  className="flex items-center justify-between px-3 py-2 rounded-[8px] border bg-white"
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "rgba(0,0,0,0.9)",
                    minWidth: "180px",
                    borderColor: showDateDropdown || dateRangeFilter !== "last7" ? "#4023FF" : "#E5E7EB"
                  }}
                >
                  <span>
                    {dateRangeFilter === "custom" && dateRange?.from && dateRange?.to
                      ? `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd")}`
                      : dateRangeFilter === "last7"
                      ? `${format(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), "MMM dd")} - ${format(new Date(), "MMM dd")}`
                      : dateRangeFilter === "last30"
                      ? `${format(new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), "MMM dd")} - ${format(new Date(), "MMM dd")}`
                      : `${format(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), "MMM dd")} - ${format(new Date(), "MMM dd")}`}
                  </span>
                  <ChevronDown size={16} style={{ color: "#6B7280" }} />
                </button>

                {/* Dropdown Menu */}
                {showDateDropdown && (
                  <div
                    className="absolute top-full right-0 mt-2 bg-white rounded-[8px] border border-[#E5E7EB] shadow-lg z-50"
                    style={{ minWidth: "180px" }}
                  >
                    <button
                      onClick={() => {
                        setDateRangeFilter("last7");
                        setShowDateDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-[#F9FAFB] transition-colors flex items-center justify-between"
                      style={{
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "rgba(0,0,0,0.9)",
                        borderBottom: "1px solid #F3F4F6"
                      }}
                    >
                      <span>Last 7 days</span>
                      {dateRangeFilter === "last7" && <Check size={16} style={{ color: "#4023FF" }} />}
                    </button>
                    <button
                      onClick={() => {
                        setDateRangeFilter("last30");
                        setShowDateDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-[#F9FAFB] transition-colors flex items-center justify-between"
                      style={{
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "rgba(0,0,0,0.9)",
                        borderBottom: "1px solid #F3F4F6"
                      }}
                    >
                      <span>Last 30 days</span>
                      {dateRangeFilter === "last30" && <Check size={16} style={{ color: "#4023FF" }} />}
                    </button>
                    <button
                      onClick={() => {
                        setDateRangeFilter("custom");
                        setShowDateDropdown(false);
                        if (dateButtonRef.current) {
                          const rect = dateButtonRef.current.getBoundingClientRect();
                          setDatePickerPosition({
                            top: rect.bottom + 8,
                            left: rect.left
                          });
                        }
                        setShowDatePicker(true);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-[#F9FAFB] transition-colors rounded-b-[8px] flex items-center justify-between"
                      style={{
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "rgba(0,0,0,0.9)"
                      }}
                    >
                      <span>Custom</span>
                      {dateRangeFilter === "custom" && <Check size={16} style={{ color: "#4023FF" }} />}
                    </button>
                  </div>
                )}

                {/* Date Picker Modal */}
                {showDatePicker && (
                  <div
                    className="fixed inset-0 z-[9999]"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    onClick={() => setShowDatePicker(false)}
                  >
                    <div
                      className="absolute bg-white rounded-[8px] p-4 border border-[#E5E7EB] shadow-2xl"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        top: `${datePickerPosition.top}px`,
                        left: `${datePickerPosition.left - 150}px`,
                        width: 'fit-content'
                      }}
                    >
                      <h6 className="text-xs font-medium text-[#1F2937] mb-[8px] mt-[0px] mr-[0px] ml-[16px]">Select Date Range</h6>
                      <style>{`
                        .rdp {
                          --rdp-cell-size: 40px;
                          --rdp-accent-color: #4023FF;
                          --rdp-background-color: rgba(64, 35, 255, 0.1);
                          margin: 0;
                        }
                        .rdp-months {
                          justify-content: center;
                        }
                        .rdp-month {
                          margin: 0;
                        }
                        .rdp-caption {
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          padding: 0;
                          padding-top: 4px;
                          margin-bottom: 16px;
                          position: relative;
                        }
                        .rdp-caption_label {
                          font-size: 16px;
                          font-weight: 500;
                          color: #1F2937;
                        }
                        .rdp-nav {
                          display: flex;
                          align-items: center;
                          gap: 4px;
                        }
                        .rdp-nav_button {
                          width: 32px;
                          height: 32px;
                          border-radius: 6px;
                          border: 1px solid #E5E7EB;
                          background: transparent;
                          cursor: pointer;
                          display: inline-flex;
                          align-items: center;
                          justify-content: center;
                        }
                        .rdp-nav_button:hover {
                          background: #F9FAFB;
                        }
                        .rdp-nav_button_previous {
                          position: absolute;
                          left: 4px;
                        }
                        .rdp-nav_button_next {
                          position: absolute;
                          right: 4px;
                        }
                        .rdp-head_cell {
                          font-size: 14px;
                          font-weight: 500;
                          color: #6B7280;
                          text-transform: uppercase;
                          width: 40px;
                        }
                        .rdp-table {
                          width: 100%;
                          border-collapse: collapse;
                        }
                        .rdp-head_row {
                          display: flex;
                        }
                        .rdp-row {
                          display: flex;
                          width: 100%;
                          margin-top: 8px;
                        }
                        .rdp-cell {
                          padding: 0;
                          text-align: center;
                          position: relative;
                        }
                        .rdp-day {
                          width: 40px;
                          height: 40px;
                          border-radius: 8px;
                          font-size: 14px;
                          font-weight: 400;
                          color: #1F2937;
                          border: none;
                          background: transparent;
                          cursor: pointer;
                          padding: 0;
                        }
                        .rdp-day:hover:not(.rdp-day_selected):not(.rdp-day_disabled) {
                          background: #F9FAFB;
                        }
                        .rdp-day_selected, .rdp-day_range_start, .rdp-day_range_end {
                          background: #4023FF !important;
                          color: white !important;
                          font-weight: 500;
                        }
                        .rdp-day_range_start {
                          border-radius: 8px 0 0 8px;
                        }
                        .rdp-day_range_end {
                          border-radius: 0 8px 8px 0;
                        }
                        .rdp-day_range_middle {
                          background: rgba(64, 35, 255, 0.3) !important;
                          color: #1F2937 !important;
                          border-radius: 0;
                        }
                        .rdp-day_today {
                          background: #F9FAFB;
                          font-weight: 600;
                        }
                        .rdp-day_disabled {
                          color: #D1D5DB;
                          cursor: not-allowed;
                          opacity: 0.3;
                        }
                        .rdp-day_outside {
                          color: #D1D5DB;
                          opacity: 0.5;
                        }
                      `}</style>
                      <div className="rounded-lg p-[12px] p-[8px]">
                        <DayPicker
                          mode="range"
                          selected={dateRange.from && dateRange.to ? { from: dateRange.from, to: dateRange.to } : dateRange.from ? { from: dateRange.from, to: undefined } : undefined}
                          onSelect={(range) => {
                            if (range) {
                              setDateRange({ from: range.from || null, to: range.to || null });
                            } else {
                              setDateRange({ from: null, to: null });
                            }
                          }}
                          numberOfMonths={1}
                        />
                      </div>
                      <div className="mt-[8px] flex gap-3 justify-end p-[0px] mr-[0px] mb-[0px] ml-[0px]">
                        <button
                          onClick={() => {
                            setShowDatePicker(false);
                            setDateRangeFilter("last7");
                            setDateRange({ from: null, to: null });
                          }}
                          className="px-[24px] py-[8px] rounded-[8px] text-sm font-medium text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            if (dateRange.from && dateRange.to) {
                              setShowDatePicker(false);
                            }
                          }}
                          disabled={!dateRange.from || !dateRange.to}
                          className="px-[24px] py-[8px] rounded-[8px] text-sm font-medium bg-[#4023FF] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3519CC] transition-colors"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2 Cards Grid */}
          <div className="grid grid-cols-2 gap-4 px-[24px] py-[0px]">
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
        <div className="grid grid-cols-2 gap-4 px-[24px] py-[0px]">
          {/* Language Pairs */}
          <LanguagePairsCard />

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