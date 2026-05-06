import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Sidebar } from "../components/Sidebar";
import { Tooltip } from "../components/Tooltip";
import {
  Shield, Users, Globe, MessageSquare,
  ChevronLeft, X, Search, ChevronDown, Plus,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TeamMember {
  id: string;
  name: string;
  email: string;
}

interface ReplyCategory {
  id: string;
  name: string;
  count: number;
  enabled: boolean;
}

interface TeamData {
  id: string;
  name: string;
  description: string;
  hipaa: boolean;
  members: TeamMember[];
  languages: string[];
  categories: ReplyCategory[];
  sdkMode: "stt-tts" | "s2s";
  sessionsToday: number;
  topLanguage: string;
}

interface AgentPoolEntry {
  id: string;
  name: string;
  email: string;
  assignedTo?: string;
  inactive?: boolean;
}

interface LanguageOption {
  code: string;
  label: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

// Auto greetings sourced from the "Auto Greetings" category in the Replies library.
// PENDING: replace with live fetch from /api/replies?category=auto when available.
interface AutoGreetingOption {
  id: string;
  title: string;
}

const AUTO_GREETINGS_MOCK: AutoGreetingOption[] = [
  { id: "ag1", title: "Standard Opening" },
  { id: "ag2", title: "Medical Line Greeting" },
];

const LANGUAGE_POOL: LanguageOption[] = [
  { code: "en-US", label: "English — United States (en-US)" },
  { code: "es-MX", label: "Spanish — Mexico (es-MX)" },
  { code: "fr-FR", label: "French — France (fr-FR)" },
  { code: "ar",    label: "Arabic (ar)" },
  { code: "pt-BR", label: "Portuguese — Brazil (pt-BR)" },
  { code: "zh-CN", label: "Chinese — Simplified (zh-CN)" },
  { code: "de-DE", label: "German — Germany (de-DE)" },
  { code: "ja",    label: "Japanese (ja)" },
];

const INITIAL_AGENT_POOL: AgentPoolEntry[] = [
  { id: "ap1", name: "Nina Patel",    email: "nina.patel@verbum.co" },
  { id: "ap2", name: "Omar Rivas",    email: "omar.rivas@verbum.co" },
  { id: "ap3", name: "Priya Chen",    email: "priya.chen@verbum.co" },
  { id: "ap4", name: "Jake Morrison", email: "jake.morrison@verbum.co", assignedTo: "Beta" },
  { id: "ap5", name: "Tara Mitchell", email: "tara.mitchell@verbum.co", inactive: true },
];

const MOCK_TEAMS: TeamData[] = [
  {
    id: "t1",
    name: "Alpha",
    description: "Primary support team handling medical and health-related accounts.",
    hipaa: true,
    members: [
      { id: "m1", name: "Maria Santos",  email: "maria.santos@verbum.co" },
      { id: "m2", name: "Kiran Kaur",    email: "kiran.kaur@verbum.co" },
      { id: "m3", name: "Avery Park",    email: "avery.park@verbum.co" },
      { id: "m4", name: "Aaliyah Snow",  email: "aaliyah.snow@verbum.co" },
      { id: "m5", name: "Layla Odom",    email: "layla.odom@verbum.co" },
      { id: "m6", name: "Derek Chan",    email: "derek.chan@verbum.co" },
      { id: "m7", name: "Sofia Ruiz",    email: "sofia.ruiz@verbum.co" },
      { id: "m8", name: "Marco Bianchi", email: "marco.bianchi@verbum.co" },
    ],
    languages: ["en-US", "es-MX", "ar"],
    categories: [
      { id: "c1", name: "Greetings",            count: 8,  enabled: true  },
      { id: "c2", name: "Account Verification", count: 12, enabled: true  },
      { id: "c3", name: "On Hold",              count: 5,  enabled: true  },
      { id: "c4", name: "Escalation",           count: 7,  enabled: false },
      { id: "c5", name: "Technical Support",    count: 10, enabled: true  },
    ],
    sdkMode: "stt-tts",
    sessionsToday: 14,
    topLanguage: "EN-US → ES-MX",
  },
  {
    id: "t2",
    name: "Beta",
    description: "General support team for commercial and retail customers.",
    hipaa: false,
    members: [
      { id: "m9",  name: "Ishan Ibanez",  email: "ishan.ibanez@verbum.co" },
      { id: "m10", name: "Glen Harper",   email: "glen.harper@verbum.co" },
      { id: "m11", name: "Alice Johnson", email: "alice.johnson@verbum.co" },
      { id: "m12", name: "Zackary Walls", email: "zackary.walls@verbum.co" },
      { id: "m13", name: "Saul Velez",    email: "saul.velez@verbum.co" },
      { id: "m14", name: "Priya Mehta",   email: "priya.mehta@verbum.co" },
      { id: "m15", name: "James Park",    email: "james.park@verbum.co" },
      { id: "m16", name: "Lily Chen",     email: "lily.chen@verbum.co" },
      { id: "m17", name: "Tom Nguyen",    email: "tom.nguyen@verbum.co" },
      { id: "m18", name: "Carlos Díaz",   email: "carlos.diaz@verbum.co" },
      { id: "m19", name: "Fatima Hassan", email: "fatima.hassan@verbum.co" },
      { id: "m20", name: "Yuki Tanaka",   email: "yuki.tanaka@verbum.co" },
    ],
    languages: ["en-US", "es-MX", "fr-FR", "pt-BR", "zh-CN"],
    categories: [
      { id: "c1", name: "Greetings",            count: 8,  enabled: true  },
      { id: "c2", name: "Account Verification", count: 12, enabled: false },
      { id: "c3", name: "On Hold",              count: 5,  enabled: true  },
      { id: "c4", name: "Escalation",           count: 7,  enabled: true  },
      { id: "c5", name: "Technical Support",    count: 10, enabled: true  },
    ],
    sdkMode: "stt-tts",
    sessionsToday: 31,
    topLanguage: "EN-US → ES-MX",
  },
];

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
  const palette = ["#4023FF", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#F97316"];
  const color = palette[name.charCodeAt(0) % palette.length];
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, background: `${color}18`, color, fontSize: Math.round(size * 0.36), fontWeight: 600 }}
    >
      {initials}
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, disabled, compact }: {
  checked: boolean; onChange: () => void; disabled?: boolean; compact?: boolean;
}) {
  const w  = compact ? "26px" : "44px";
  const h  = compact ? "14px" : "24px";
  const cw = compact ? "10px" : "20px";
  const tx = compact ? "13px" : "22px";
  return (
    <button
      onClick={!disabled ? onChange : undefined}
      disabled={disabled}
      className={`relative flex-shrink-0 rounded-full transition-colors ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
      style={{ width: w, height: h, background: checked ? "#4023FF" : "#D1D5DB" }}
    >
      <div
        className="absolute top-[2px] bg-white rounded-full transition-transform"
        style={{ width: cw, height: cw, transform: checked ? `translateX(${tx})` : "translateX(2px)" }}
      />
    </button>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────

function ConfirmModal({
  title, body, confirmLabel, onConfirm, onCancel, destructive = false,
}: {
  title: string; body: string; confirmLabel: string;
  onConfirm: () => void; onCancel: () => void; destructive?: boolean;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(10,10,18,0.5)", fontFamily: "'Poppins', sans-serif" }}
      onMouseDown={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="bg-white rounded-[12px] shadow-xl p-6" style={{ width: "448px", maxWidth: "calc(100vw - 48px)" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1F2937", marginBottom: "12px" }}>{title}</h3>
        <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: "1.6", marginBottom: "24px" }}>{body}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-[8px] border border-[#E5E7EB] hover:bg-[#F3F4F6] transition-all"
            style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-[8px] transition-all"
            style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF", background: destructive ? "#DC2626" : "#4023FF" }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[10px] border border-[#E5E7EB] p-5 mb-4">
      <div style={{ marginBottom: subtitle ? "2px" : "16px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#1F2937", margin: 0 }}>{title}</h2>
      </div>
      {subtitle && (
        <p style={{ fontSize: "12px", color: "#6B7280", marginBottom: "16px", marginTop: "2px" }}>{subtitle}</p>
      )}
      {children}
    </div>
  );
}

// ─── Teams List View ──────────────────────────────────────────────────────────

function TeamsListView({
  teams, searchQuery, setSearchQuery, onSelect,
}: {
  teams: TeamData[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelect: (team: TeamData) => void;
}) {
  const filtered = searchQuery.trim()
    ? teams.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : teams;

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="m-0 flex items-center gap-2" style={{ fontSize: "20px", fontWeight: 600, color: "#1F2937" }}>
            <span>Teams</span>
          </h1>
          <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "3px" }}>View and manage your teams</p>
        </div>
        <span
          className="px-2.5 py-1 rounded-[6px] border border-[#E5E7EB]"
          style={{ fontSize: "12px", color: "#6B7280", background: "#FAFAFA", marginTop: "4px" }}
        >
          {teams.length} teams
        </span>
      </div>

      {/* Search */}
      <div className="relative mb-5" style={{ maxWidth: "320px" }}>
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search teams..."
          className="w-full pl-8 pr-3 py-2 rounded-[8px] border border-[#E5E7EB] bg-white"
          style={{ fontSize: "13px", color: "#374151", outline: "none" }}
        />
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p style={{ fontSize: "14px", color: "#9CA3AF", marginBottom: "8px" }}>No teams match your search.</p>
          <button
            onClick={() => setSearchQuery("")}
            style={{ fontSize: "13px", color: "#4023FF", fontWeight: 500 }}
            className="hover:underline"
          >
            Reset
          </button>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {filtered.map(team => (
            <div
              key={team.id}
              onClick={() => onSelect(team)}
              className="p-5 rounded-[10px] border bg-white cursor-pointer transition-all hover:shadow-sm"
              style={{ borderColor: "#E5E7EB" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#4023FF")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#E5E7EB")}
            >
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontSize: "15px", fontWeight: 600, color: "#1F2937" }}>{team.name}</span>
                {team.hipaa && (
                  <Tooltip content="HIPAA active — transcripts not stored for this team" position="top" compact>
                    <Shield size={14} style={{ color: "#5B5FF2" }} />
                  </Tooltip>
                )}
              </div>
              <p style={{ fontSize: "12px", color: "#6B7280", marginBottom: "18px", lineHeight: "1.6" }}>
                {team.description}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Users size={13} style={{ color: "#9CA3AF" }} />
                  <span style={{ fontSize: "12px", color: "#6B7280" }}>{team.members.length} agents</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe size={13} style={{ color: "#9CA3AF" }} />
                  <span style={{ fontSize: "12px", color: "#6B7280" }}>{team.languages.length} languages</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageSquare size={13} style={{ color: "#9CA3AF" }} />
                  <span style={{ fontSize: "12px", color: "#6B7280" }}>{team.categories.length} categories</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Team Detail View ─────────────────────────────────────────────────────────

function TeamDetailView({ initialTeam, onBack }: { initialTeam: TeamData; onBack: () => void }) {
  type Tab = "Members" | "Languages" | "Replies" | "Settings";
  const [activeTab, setActiveTab] = useState<Tab>("Members");

  // Mutable team state
  const [members,    setMembers]    = useState<TeamMember[]>([...initialTeam.members]);
  const [agentPool,  setAgentPool]  = useState<AgentPoolEntry[]>([...INITIAL_AGENT_POOL]);
  const [languages,  setLanguages]  = useState<string[]>([...initialTeam.languages]);
  const [categories, setCategories] = useState<ReplyCategory[]>(initialTeam.categories.map(c => ({ ...c })));
  const [hipaaOn,    setHipaaOn]    = useState(initialTeam.hipaa);
  const [sdkMode,    setSdkMode]    = useState(initialTeam.sdkMode);

  // ── Members tab state ──
  const [memberSearch,   setMemberSearch]   = useState("");
  const [confirmRemove,  setConfirmRemove]  = useState<TeamMember | null>(null);

  function addMember(agent: AgentPoolEntry) {
    setMembers(m => [...m, { id: agent.id, name: agent.name, email: agent.email }]);
    setAgentPool(p => p.filter(a => a.id !== agent.id));
  }
  function removeMember(member: TeamMember) {
    setMembers(m => m.filter(a => a.id !== member.id));
    setAgentPool(p => [...p, { id: member.id, name: member.name, email: member.email }]);
    setConfirmRemove(null);
  }

  // Default (no search): only unassigned + active agents.
  // Search active: all matches, with disabled chips for assigned/inactive.
  const filteredPool = memberSearch.trim()
    ? agentPool.filter(a =>
        a.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
        a.email.toLowerCase().includes(memberSearch.toLowerCase())
      )
    : agentPool.filter(a => !a.assignedTo && !a.inactive);

  // ── Languages tab state ──
  const [showLangDrop, setShowLangDrop] = useState(false);

  const availableLangs = LANGUAGE_POOL.filter(l => !languages.includes(l.code));

  function addLanguage(code: string) {
    setLanguages(l => [...l, code]);
    setShowLangDrop(false);
  }
  function removeLanguage(code: string) {
    setLanguages(l => l.filter(c => c !== code));
  }

  // ── Replies tab state ──
  const [autoGreetingId, setAutoGreetingId] = useState<string | null>(null);
  const [greetingToasts, setGreetingToasts] = useState<Array<{ id: string; msg: string }>>([]);

  function addGreetingToast(msg: string) {
    const id = Math.random().toString(36).slice(2);
    setGreetingToasts(t => [...t, { id, msg }]);
    setTimeout(() => setGreetingToasts(t => t.filter(x => x.id !== id)), 3000);
  }

  function handleAutoGreetingChange(value: string) {
    const newId = value === "" ? null : value;
    setAutoGreetingId(newId);
    if (newId === null) {
      addGreetingToast("Auto greeting removed");
    } else {
      addGreetingToast("Auto greeting updated");
    }
  }

  function toggleCategory(id: string) {
    setCategories(cats => cats.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
  }
  const allDisabled = categories.every(c => !c.enabled);

  // ── Settings tab state ──
  const [teamName, setTeamName]           = useState(initialTeam.name);
  const [teamDesc, setTeamDesc]           = useState(initialTeam.description);
  const [saveState, setSaveState]         = useState<"idle" | "success" | "error">("idle");
  const [hipaaModal, setHipaaModal]       = useState<"enable" | "disable" | null>(null);

  function handleSave() {
    setSaveState("success");
    setTimeout(() => setSaveState("idle"), 3000);
  }
  function handleCancel() {
    setTeamName(initialTeam.name);
    setTeamDesc(initialTeam.description);
    setSaveState("idle");
  }
  function confirmHipaaChange() {
    setHipaaOn(v => !v);
    setHipaaModal(null);
  }

  // ── Render ──
  const TABS: Tab[] = ["Members", "Languages", "Replies", "Settings"];

  return (
    <div className="flex h-screen" style={{ fontFamily: "'Poppins', sans-serif", background: "#F9FAFB" }}>
      <Sidebar />

      <main className="flex-1 overflow-y-auto pt-[16px] pb-[24px] px-[24px]">

        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-1 mb-4 transition-colors hover:text-[#4023FF]"
          style={{ fontSize: "13px", fontWeight: 500, color: "#6B7280" }}
        >
          <ChevronLeft size={15} />
          Teams
        </button>

        {/* Team header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="m-0" style={{ fontSize: "20px", fontWeight: 600, color: "#1F2937" }}>
              {teamName}
            </h1>
            {hipaaOn && (
              <Tooltip content="HIPAA active — transcripts not stored for this team" position="right" compact>
                <Shield size={17} style={{ color: "#5B5FF2" }} />
              </Tooltip>
            )}
          </div>
          <p style={{ fontSize: "13px", color: "#6B7280" }}>{teamDesc}</p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Team Members",    value: `${members.length} agents` },
            { label: "In Session",      value: "—", pending: true },
            { label: "Sessions Today",  value: String(initialTeam.sessionsToday) },
            { label: "Top Language Pair", value: initialTeam.topLanguage },
          ].map(({ label, value, pending }) => (
            <div key={label} className="p-4 rounded-[10px] border border-[#E5E7EB] bg-white">
              <div className="flex items-center gap-1.5 mb-1">
                <div style={{ fontSize: "11px", fontWeight: 500, color: "#9CA3AF" }}>{label}</div>
                {pending && (
                  <Tooltip content="Pending backend event availability" position="top" compact>
                    <span style={{ fontSize: "9px", fontWeight: 600, color: "#A16207", background: "#FEFCE8", border: "1px solid #FACC15", borderRadius: "3px", padding: "0 4px" }}>
                      PENDING
                    </span>
                  </Tooltip>
                )}
              </div>
              <div style={{ fontSize: "20px", fontWeight: 600, color: "#1F2937", lineHeight: 1.2 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-[#E5E7EB] mb-5">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2.5 transition-all"
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: activeTab === tab ? "#4023FF" : "#6B7280",
                borderBottom: `2px solid ${activeTab === tab ? "#4023FF" : "transparent"}`,
                marginBottom: "-1px",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Members Tab ── */}
        {activeTab === "Members" && (
          <>
            <SectionCard title="Current Members" subtitle="Agents currently assigned to this team">
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", marginBottom: "12px" }}>
                Team Members ({members.length})
              </div>
              {members.length === 0 ? (
                <p style={{ fontSize: "13px", color: "#9CA3AF", textAlign: "center", padding: "24px 0" }}>
                  No agents assigned yet. Use the search below to add members.
                </p>
              ) : (
                <div>
                  {members.map((member, idx) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 py-3"
                      style={{ borderBottom: idx < members.length - 1 ? "1px solid #F3F4F6" : "none" }}
                    >
                      <Avatar name={member.name} size={36} />
                      <div className="flex-1 min-w-0">
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#1F2937" }}>{member.name}</div>
                        <div style={{ fontSize: "12px", color: "#9CA3AF" }}>{member.email}</div>
                      </div>
                      <button
                        onClick={() => setConfirmRemove(member)}
                        className="p-1.5 rounded-[6px] hover:bg-[#F3F4F6] transition-all"
                        title={`Remove ${member.name}`}
                      >
                        <X size={14} style={{ color: "#9CA3AF" }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title="Add Members" subtitle="Select agents to add to this team">
              <div className="relative mb-4">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
                <input
                  type="text"
                  value={memberSearch}
                  onChange={e => setMemberSearch(e.target.value)}
                  placeholder="Search agents..."
                  className="w-full pl-8 pr-3 py-2 rounded-[8px] border border-[#E5E7EB] bg-white"
                  style={{ fontSize: "13px", color: "#374151", outline: "none" }}
                />
              </div>

              {filteredPool.length === 0 && memberSearch.trim() ? (
                <p style={{ fontSize: "13px", color: "#9CA3AF", textAlign: "center", padding: "16px 0" }}>
                  No agents available. All active agents are already assigned to a team.
                </p>
              ) : (
                <div className="mb-3">
                  {filteredPool.map((agent, idx) => {
                    const isDisabled = !!agent.assignedTo || !!agent.inactive;
                    return (
                      <div
                        key={agent.id}
                        className="flex items-center gap-3 py-2.5"
                        style={{
                          borderBottom: idx < filteredPool.length - 1 ? "1px solid #F3F4F6" : "none",
                          opacity: isDisabled ? 0.5 : 1,
                        }}
                      >
                        <Avatar name={agent.name} size={32} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span style={{ fontSize: "13px", fontWeight: 500, color: "#1F2937" }}>{agent.name}</span>
                            {agent.assignedTo && (
                              <span
                                className="px-2 py-0.5 rounded-[4px]"
                                style={{ fontSize: "11px", fontWeight: 500, color: "#6B7280", background: "#F3F4F6" }}
                              >
                                Assigned to {agent.assignedTo}
                              </span>
                            )}
                            {agent.inactive && (
                              <span
                                className="px-2 py-0.5 rounded-[4px]"
                                style={{ fontSize: "11px", fontWeight: 500, color: "#9CA3AF", background: "#F3F4F6" }}
                              >
                                Inactive
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: "12px", color: "#9CA3AF" }}>{agent.email}</div>
                        </div>
                        {!isDisabled && (
                          <button
                            onClick={() => addMember(agent)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-[6px] border border-[#4023FF] transition-all hover:bg-[rgba(64,35,255,0.05)]"
                            style={{ fontSize: "12px", fontWeight: 500, color: "#4023FF" }}
                          >
                            <Plus size={12} />
                            Add
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              <p style={{ fontSize: "11px", color: "#9CA3AF" }}>
                Only unassigned active agents can be added to a team.
              </p>
            </SectionCard>
          </>
        )}

        {/* ── Languages Tab ── */}
        {activeTab === "Languages" && (
          <SectionCard title="Language Configuration" subtitle="Manage languages enabled for this team">
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", marginBottom: "10px" }}>
              Enabled Languages
            </div>

            {languages.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#9CA3AF", marginBottom: "20px" }}>
                No languages configured yet. Add languages from the pool below.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 mb-5">
                {languages.map(code => {
                  const lang = LANGUAGE_POOL.find(l => l.code === code);
                  return (
                    <div
                      key={code}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] border border-[#E5E7EB]"
                      style={{ background: "#FAFAFA" }}
                    >
                      <span style={{ fontSize: "12px", color: "#374151" }}>{lang?.label ?? code}</span>
                      <button
                        onClick={() => removeLanguage(code)}
                        className="transition-colors hover:text-[#DC2626]"
                        style={{ color: "#9CA3AF", display: "flex", alignItems: "center" }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="border-t border-[#F3F4F6] pt-4 mb-3">
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", marginBottom: "8px" }}>
                Add Language
              </div>
              {availableLangs.length === 0 ? (
                <div
                  className="px-3 py-2 rounded-[8px] border border-[#E5E7EB]"
                  style={{ fontSize: "13px", color: "#9CA3AF", background: "#FAFAFA" }}
                >
                  No languages available. Contact your Admin.
                </div>
              ) : (
                <div className="relative" style={{ maxWidth: "360px" }}>
                  <button
                    onClick={() => setShowLangDrop(v => !v)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-[8px] border border-[#E5E7EB] bg-white transition-all hover:border-[#4023FF]"
                    style={{ fontSize: "13px", color: "#6B7280" }}
                  >
                    Select a language to add
                    <ChevronDown size={14} />
                  </button>
                  {showLangDrop && (
                    <div
                      className="absolute top-full left-0 right-0 mt-1 rounded-[8px] border border-[#E5E7EB] shadow-lg z-20 overflow-hidden"
                      style={{ background: "#FFFFFF" }}
                    >
                      {availableLangs.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => addLanguage(lang.code)}
                          className="w-full text-left px-3 py-2.5 hover:bg-[#F8F8FA] transition-all"
                          style={{ fontSize: "13px", color: "#374151" }}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <p style={{ fontSize: "11px", color: "#9CA3AF", lineHeight: "1.6", marginTop: "16px" }}>
              Languages are sourced from your organization's language pool. To request additional languages, contact your Admin.
            </p>
          </SectionCard>
        )}

        {/* ── Replies Tab ── */}
        {activeTab === "Replies" && (
          <>
          {/* Auto Greeting section */}
          <SectionCard
            title="Auto Greeting"
            subtitle="Select the greeting that plays automatically at the start of every call for agents on this team."
          >
            {AUTO_GREETINGS_MOCK.length === 0 ? (
              /* Empty state — no greetings exist in the pool */
              <div className="py-4">
                <p style={{ fontSize: "13px", color: "#9CA3AF", marginBottom: "6px" }}>
                  No auto greetings available yet.
                </p>
                <Link
                  to="/replies"
                  style={{ fontSize: "13px", color: "#4023FF", fontWeight: 500, textDecoration: "none" }}
                  className="hover:underline"
                >
                  Go to Replies to create your first one →
                </Link>
              </div>
            ) : (
              <div style={{ maxWidth: "400px" }}>
                {/* Dropdown */}
                <div className="relative mb-3">
                  <select
                    value={autoGreetingId ?? ""}
                    onChange={e => handleAutoGreetingChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-[8px] border border-[#D1D5DB] bg-white appearance-none transition-colors"
                    style={{ fontSize: "13px", color: autoGreetingId ? "#374151" : "#9CA3AF", outline: "none", paddingRight: "36px" }}
                    onFocus={e => (e.target.style.borderColor = "#4023FF")}
                    onBlur={e => (e.target.style.borderColor = "#D1D5DB")}
                  >
                    <option value="">None — no auto greeting</option>
                    {AUTO_GREETINGS_MOCK.map(g => (
                      <option key={g.id} value={g.id}>{g.title}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "#9CA3AF" }}
                  />
                </div>

                {/* Helper text */}
                <p style={{ fontSize: "11px", color: "#9CA3AF", lineHeight: "1.6" }}>
                  The selected greeting plays automatically when a call starts. Agents cannot change this.
                </p>
              </div>
            )}

            {/* Toasts */}
            {greetingToasts.map(t => (
              <div
                key={t.id}
                className="fixed bottom-4 right-4 z-[9999] flex items-center gap-3 px-4 py-3 rounded-[8px] shadow-lg"
                style={{ background: "#1F2937", color: "#FFFFFF", fontSize: "13px", fontWeight: 500, minWidth: "220px" }}
              >
                {t.msg}
              </div>
            ))}
          </SectionCard>

          {/* Reply Categories section */}
          <SectionCard title="Reply Categories" subtitle="Enable or disable reply categories for agents on this team">
            {categories.length === 0 ? (
              <div className="py-8 text-center">
                <p style={{ fontSize: "13px", color: "#9CA3AF", marginBottom: "8px" }}>
                  No reply categories available yet.
                </p>
                <Link to="/replies" style={{ fontSize: "13px", color: "#4023FF", fontWeight: 500, textDecoration: "none" }} className="hover:underline">
                  Go to Replies to create your first category →
                </Link>
              </div>
            ) : (
              <>
                {categories.map((cat, idx) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between py-3"
                    style={{ borderBottom: idx < categories.length - 1 ? "1px solid #F3F4F6" : "none" }}
                  >
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#1F2937" }}>{cat.name}</div>
                      <div style={{ fontSize: "12px", color: "#9CA3AF" }}>{cat.count} replies</div>
                    </div>
                    <Toggle compact checked={cat.enabled} onChange={() => toggleCategory(cat.id)} />
                  </div>
                ))}

                {allDisabled && (
                  <div
                    className="mt-4 px-3 py-3 rounded-[8px] border"
                    style={{ background: "#FFFBEB", borderColor: "#FACC15" }}
                  >
                    <p style={{ fontSize: "12px", color: "#A16207" }}>
                      No reply categories are currently enabled for this team. Agents won't see any preset replies.
                    </p>
                  </div>
                )}

                <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "16px" }}>
                  To create or edit reply categories, go to{" "}
                  <Link to="/replies" style={{ color: "#4023FF", textDecoration: "none" }} className="hover:underline">
                    Replies
                  </Link>{" "}
                  in the main navigation.
                </p>
              </>
            )}
          </SectionCard>
          </>
        )}

        {/* ── Settings Tab ── */}
        {activeTab === "Settings" && (
          <>
            {/* Team Information */}
            <SectionCard title="Team Information" subtitle="Update team name and description">
              <div style={{ maxWidth: "480px" }}>
                <div className="mb-4">
                  <label
                    style={{ fontSize: "12px", fontWeight: 500, color: "#374151", display: "block", marginBottom: "6px" }}
                  >
                    Team Name
                  </label>
                  <input
                    value={teamName}
                    onChange={e => { setTeamName(e.target.value); setSaveState("idle"); }}
                    className="w-full px-3 py-2 rounded-[8px] border border-[#D1D5DB] transition-all"
                    style={{ fontSize: "13px", color: "#374151", outline: "none" }}
                    onFocus={e => (e.target.style.borderColor = "#4023FF")}
                    onBlur={e => (e.target.style.borderColor = "#D1D5DB")}
                  />
                </div>
                <div className="mb-5">
                  <label
                    style={{ fontSize: "12px", fontWeight: 500, color: "#374151", display: "block", marginBottom: "6px" }}
                  >
                    Description <span style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 400 }}>Optional</span>
                  </label>
                  <textarea
                    value={teamDesc}
                    onChange={e => { setTeamDesc(e.target.value); setSaveState("idle"); }}
                    rows={3}
                    className="w-full px-3 py-2 rounded-[8px] border border-[#D1D5DB] resize-none transition-all"
                    style={{ fontSize: "13px", color: "#374151", outline: "none" }}
                    onFocus={e => (e.target.style.borderColor = "#4023FF")}
                    onBlur={e => (e.target.style.borderColor = "#D1D5DB")}
                  />
                </div>
                <div className="flex items-center justify-end gap-3">
                  {saveState === "success" && (
                    <span style={{ fontSize: "12px", color: "#10B981" }}>Changes saved</span>
                  )}
                  {saveState === "error" && (
                    <span style={{ fontSize: "12px", color: "#DC2626" }}>Unable to save changes. Please try again.</span>
                  )}
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-[8px] border border-[#E5E7EB] hover:bg-[#F3F4F6] transition-all"
                    style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-[8px] transition-all"
                    style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF", background: "#4023FF" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#3419cc")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#4023FF")}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </SectionCard>

            {/* Security & Compliance */}
            <SectionCard title="Security & Compliance">
              <div className="flex items-start justify-between" style={{ maxWidth: "480px" }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#1F2937", marginBottom: "3px" }}>
                    HIPAA Compliance
                  </div>
                  <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: "1.5", maxWidth: "320px" }}>
                    When enabled, sessions operate with HIPAA-compliant handling. Transcripts are not stored.
                  </div>
                  {hipaaOn && (
                    <div
                      className="inline-flex items-center gap-1.5 mt-2 px-2 py-1 rounded-[4px]"
                      style={{ background: "rgba(91,95,242,0.08)", border: "1px solid rgba(91,95,242,0.2)" }}
                    >
                      <Shield size={11} style={{ color: "#5B5FF2" }} />
                      <span style={{ fontSize: "11px", fontWeight: 500, color: "#5B5FF2" }}>HIPAA active</span>
                    </div>
                  )}
                </div>
                <Toggle
                  checked={hipaaOn}
                  onChange={() => setHipaaModal(hipaaOn ? "disable" : "enable")}
                />
              </div>
            </SectionCard>

            {/* SDK Translation Mode */}
            <SectionCard title="SDK Translation Mode">
              <div className="flex items-center gap-2 mb-2">
                <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>
                  Translation pipeline mode for this team's sessions.
                </p>
                <span
                  className="px-2 py-0.5 rounded-[4px]"
                  style={{ fontSize: "10px", fontWeight: 600, color: "#A16207", background: "#FEFCE8", border: "1px solid #FACC15", whiteSpace: "nowrap" }}
                >
                  PENDING
                </span>
              </div>
              <p style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "16px" }}>
                Full definition subject to Dayanna review. Options shown for reference only.
              </p>

              <div className="flex flex-col gap-3" style={{ maxWidth: "420px" }}>
                {[
                  {
                    value: "stt-tts" as const,
                    label: "STT + TTS",
                    desc: "Sequential pipeline: speech → text → translation → speech",
                    badge: "Default",
                  },
                  {
                    value: "s2s" as const,
                    label: "S2S — Speech to Speech",
                    desc: "Full pipeline in one step. Potentially faster — no benchmark yet.",
                    badge: null,
                  },
                ].map(opt => (
                  <label
                    key={opt.value}
                    className="flex items-start gap-3 p-3 rounded-[8px] border cursor-pointer transition-all"
                    style={{
                      borderColor: sdkMode === opt.value ? "#4023FF" : "#E5E7EB",
                      background: sdkMode === opt.value ? "rgba(64,35,255,0.03)" : "#FFFFFF",
                    }}
                  >
                    <input
                      type="radio"
                      name="sdkMode"
                      value={opt.value}
                      checked={sdkMode === opt.value}
                      onChange={() => setSdkMode(opt.value)}
                      className="mt-0.5 flex-shrink-0"
                      style={{ accentColor: "#4023FF" }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#1F2937" }}>{opt.label}</span>
                        {opt.badge && (
                          <span
                            className="px-1.5 py-0.5 rounded-[4px]"
                            style={{ fontSize: "10px", fontWeight: 500, color: "#6B7280", background: "#F3F4F6" }}
                          >
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px" }}>{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "14px" }}>
                Changes to translation mode take effect after agents restart the desktop app.
              </p>
            </SectionCard>
          </>
        )}
      </main>

      {/* ── HIPAA Confirmation Modals ── */}
      {hipaaModal === "enable" && (
        <ConfirmModal
          title="Enable HIPAA Compliance?"
          body="When enabled, this team operates with HIPAA-compliant handling rules. Sessions will not be stored and transcripts will not be saved."
          confirmLabel="Enable HIPAA"
          onConfirm={confirmHipaaChange}
          onCancel={() => setHipaaModal(null)}
        />
      )}
      {hipaaModal === "disable" && (
        <ConfirmModal
          title="Disable HIPAA Compliance?"
          body="Turning off HIPAA compliance means sensitive health information may no longer be protected according to HIPAA standards. This could result in compliance violations. Are you sure you want to continue?"
          confirmLabel="Disable HIPAA"
          onConfirm={confirmHipaaChange}
          onCancel={() => setHipaaModal(null)}
          destructive
        />
      )}

      {/* ── Remove Member Confirmation ── */}
      {confirmRemove && (
        <ConfirmModal
          title={`Remove ${confirmRemove.name} from this team?`}
          body="They will lose access to this team's sessions, languages, and replies."
          confirmLabel="Remove"
          onConfirm={() => removeMember(confirmRemove)}
          onCancel={() => setConfirmRemove(null)}
          destructive
        />
      )}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function Teams() {
  const [selectedTeam, setSelectedTeam] = useState<TeamData | null>(null);
  const [searchQuery,  setSearchQuery]  = useState("");

  if (selectedTeam) {
    return (
      <TeamDetailView
        initialTeam={selectedTeam}
        onBack={() => setSelectedTeam(null)}
      />
    );
  }

  return (
    <div className="flex h-screen" style={{ fontFamily: "'Poppins', sans-serif", background: "#F9FAFB" }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto pt-[16px] pb-[24px] px-[24px]">
        {MOCK_TEAMS.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <p style={{ fontSize: "14px", color: "#374151", fontWeight: 500, marginBottom: "6px" }}>
              You don't have any teams assigned yet.
            </p>
            <p style={{ fontSize: "13px", color: "#9CA3AF" }}>
              Contact your Admin to get started.
            </p>
          </div>
        ) : (
          <TeamsListView
            teams={MOCK_TEAMS}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelect={setSelectedTeam}
          />
        )}
      </main>
    </div>
  );
}
