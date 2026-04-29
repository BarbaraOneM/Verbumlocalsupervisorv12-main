import { useState, useRef, useEffect, useCallback } from "react";
import { PageLayout } from "../components/PageLayout";
import { DateRangeFilter } from "../components/DateRangeFilter";
import {
  ChevronDown, ChevronUp, Eye, Download, Volume2, VolumeX,
  Shield, Columns2, X, Search, Lock,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SessionRow {
  id: string;
  agent: string;
  status: "Live" | "Completed";
  startTime: string;
  endTime?: string;
  team: string;
  languagePair: string;
  duration: string;
  aiVoice: "enabled" | "disabled";
  hipaa: boolean;
}

interface TranscriptMessage {
  id: number;
  speaker: "AGENT" | "CUSTOMER";
  timestamp: string;
  original: string;
  translation: string;
  confidence: number;
}

type SortColumn = "id" | "agent" | "status" | "languagePair" | "duration" | "startTime";
type SortDir = "asc" | "desc";
type VisibleCols = { team: boolean; languagePair: boolean; duration: boolean; aiVoice: boolean; hipaa: boolean };

// ─── Constants ────────────────────────────────────────────────────────────────

const SESSIONS_TOTAL = 1464;
const PER_PAGE = 20;

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockTranscript: TranscriptMessage[] = [
  { id: 1, speaker: "AGENT", timestamp: "14:22:05", original: "Good afternoon, thank you for calling support. How can I help you today?", translation: "Buenas tardes, gracias por llamar al soporte. ¿Cómo puedo ayudarle hoy?", confidence: 96 },
  { id: 2, speaker: "CUSTOMER", timestamp: "14:22:18", original: "Hola, tengo un problema con mi cuenta. No puedo iniciar sesión.", translation: "Hello, I have a problem with my account. I cannot log in.", confidence: 92 },
  { id: 3, speaker: "AGENT", timestamp: "14:22:35", original: "I understand. Can I have your account number please?", translation: "Entiendo. ¿Me puede dar su número de cuenta, por favor?", confidence: 98 },
  { id: 4, speaker: "CUSTOMER", timestamp: "14:22:50", original: "Sí, es el 4872-9031.", translation: "Yes, it is 4872-9031.", confidence: 88 },
  { id: 5, speaker: "AGENT", timestamp: "14:23:10", original: "Thank you. Let me pull up your account and verify the details.", translation: "Gracias. Déjeme ver su cuenta y verificar los detalles.", confidence: 95 },
  { id: 6, speaker: "CUSTOMER", timestamp: "14:23:45", original: "¿Cuánto tiempo tomará?", translation: "How long will it take?", confidence: 72 },
  { id: 7, speaker: "AGENT", timestamp: "14:24:02", original: "Just a moment. I can see there is a temporary lock on your account.", translation: "Un momento. Puedo ver que hay un bloqueo temporal en su cuenta.", confidence: 91 },
  { id: 8, speaker: "CUSTOMER", timestamp: "14:24:20", original: "¿Por qué está bloqueada? Yo nunca intenté entrar varias veces.", translation: "Why is it blocked? I never tried to log in multiple times.", confidence: 34 },
  { id: 9, speaker: "AGENT", timestamp: "14:24:38", original: "For security, we automatically lock accounts after several incorrect attempts.", translation: "Por seguridad, bloqueamos las cuentas automáticamente después de varios intentos incorrectos.", confidence: 89 },
  { id: 10, speaker: "CUSTOMER", timestamp: "14:25:01", original: "Ah entiendo. ¿Pueden desbloquearlo ahora mismo?", translation: "Ah I understand. Can you unlock it right now?", confidence: 65 },
  { id: 11, speaker: "AGENT", timestamp: "14:25:20", original: "Yes, I will unlock it now. You will receive a password reset email shortly.", translation: "Sí, lo desbloquearé ahora. Recibirá un correo para restablecer su contraseña.", confidence: 94 },
  { id: 12, speaker: "CUSTOMER", timestamp: "14:25:45", original: "Perfecto, muchas gracias por su ayuda rápida.", translation: "Perfect, thank you very much for your quick help.", confidence: 97 },
];

const mockSessions: SessionRow[] = [
  { id: "#88305", agent: "Maria Santos",   status: "Live",      startTime: "Apr 28, 2026 14:22",                              team: "Alpha", languagePair: "EN-US → ES-MX", duration: "00:08:14", aiVoice: "enabled",  hipaa: true  },
  { id: "#88304", agent: "Ishan Ibanez",   status: "Live",      startTime: "Apr 28, 2026 14:07",                              team: "Beta",  languagePair: "EN-US → PT-BR", duration: "00:23:01", aiVoice: "disabled", hipaa: false },
  { id: "#88303", agent: "Kiran Kaur",     status: "Completed", startTime: "Apr 28, 2026 13:45", endTime: "Apr 28, 2026 14:17", team: "Alpha", languagePair: "EN-US → ES-MX", duration: "00:31:22", aiVoice: "enabled",  hipaa: true  },
  { id: "#88302", agent: "Glen Harper",    status: "Completed", startTime: "Apr 28, 2026 13:20", endTime: "Apr 28, 2026 13:41", team: "Beta",  languagePair: "EN-US → FR-FR", duration: "00:21:08", aiVoice: "disabled", hipaa: false },
  { id: "#88301", agent: "Avery Park",     status: "Completed", startTime: "Apr 28, 2026 12:58", endTime: "Apr 28, 2026 13:14", team: "Alpha", languagePair: "EN-US → AR",    duration: "00:15:47", aiVoice: "enabled",  hipaa: true  },
  { id: "#88300", agent: "Alice Johnson",  status: "Completed", startTime: "Apr 28, 2026 12:30", endTime: "Apr 28, 2026 13:02", team: "Beta",  languagePair: "EN-US → ES-MX", duration: "00:32:15", aiVoice: "enabled",  hipaa: false },
  { id: "#88299", agent: "Layla Odom",     status: "Completed", startTime: "Apr 28, 2026 11:45", endTime: "Apr 28, 2026 12:18", team: "Alpha", languagePair: "EN-US → ZH-CN", duration: "00:33:10", aiVoice: "enabled",  hipaa: true  },
  { id: "#88298", agent: "Zackary Walls",  status: "Completed", startTime: "Apr 28, 2026 11:20", endTime: "Apr 28, 2026 11:38", team: "Beta",  languagePair: "EN-US → ES-MX", duration: "00:18:44", aiVoice: "disabled", hipaa: false },
  { id: "#88297", agent: "Aaliyah Snow",   status: "Completed", startTime: "Apr 28, 2026 10:55", endTime: "Apr 28, 2026 11:19", team: "Alpha", languagePair: "EN-US → ES-MX", duration: "00:24:02", aiVoice: "enabled",  hipaa: true  },
  { id: "#88296", agent: "Saul Velez",     status: "Completed", startTime: "Apr 28, 2026 10:30", endTime: "Apr 28, 2026 10:51", team: "Beta",  languagePair: "EN-US → PT-BR", duration: "00:21:33", aiVoice: "enabled",  hipaa: false },
  { id: "#88295", agent: "Maria Santos",   status: "Completed", startTime: "Apr 28, 2026 09:58", endTime: "Apr 28, 2026 10:24", team: "Alpha", languagePair: "EN-US → ES-MX", duration: "00:26:14", aiVoice: "disabled", hipaa: true  },
  { id: "#88294", agent: "Ishan Ibanez",   status: "Completed", startTime: "Apr 28, 2026 09:30", endTime: "Apr 28, 2026 09:55", team: "Beta",  languagePair: "EN-US → ES-MX", duration: "00:24:58", aiVoice: "enabled",  hipaa: false },
  { id: "#88293", agent: "Kiran Kaur",     status: "Completed", startTime: "Apr 28, 2026 09:00", endTime: "Apr 28, 2026 09:28", team: "Alpha", languagePair: "EN-US → FR-FR", duration: "00:28:11", aiVoice: "enabled",  hipaa: true  },
  { id: "#88292", agent: "Glen Harper",    status: "Completed", startTime: "Apr 27, 2026 17:45", endTime: "Apr 27, 2026 18:02", team: "Beta",  languagePair: "EN-US → AR",    duration: "00:17:22", aiVoice: "disabled", hipaa: false },
  { id: "#88291", agent: "Avery Park",     status: "Completed", startTime: "Apr 27, 2026 16:30", endTime: "Apr 27, 2026 16:49", team: "Alpha", languagePair: "EN-US → ES-MX", duration: "00:18:32", aiVoice: "enabled",  hipaa: true  },
  { id: "#88290", agent: "Alice Johnson",  status: "Completed", startTime: "Apr 27, 2026 15:55", endTime: "Apr 27, 2026 16:19", team: "Beta",  languagePair: "EN-US → ZH-CN", duration: "00:24:15", aiVoice: "disabled", hipaa: false },
  { id: "#88289", agent: "Layla Odom",     status: "Completed", startTime: "Apr 27, 2026 15:20", endTime: "Apr 27, 2026 15:36", team: "Alpha", languagePair: "EN-US → ES-MX", duration: "00:15:47", aiVoice: "enabled",  hipaa: true  },
  { id: "#88288", agent: "Zackary Walls",  status: "Completed", startTime: "Apr 27, 2026 14:50", endTime: "Apr 27, 2026 15:22", team: "Beta",  languagePair: "EN-US → FR-FR", duration: "00:32:08", aiVoice: "enabled",  hipaa: false },
  { id: "#88287", agent: "Aaliyah Snow",   status: "Completed", startTime: "Apr 27, 2026 14:15", endTime: "Apr 27, 2026 14:37", team: "Alpha", languagePair: "EN-US → ES-MX", duration: "00:21:53", aiVoice: "enabled",  hipaa: true  },
  { id: "#88286", agent: "Saul Velez",     status: "Completed", startTime: "Apr 27, 2026 13:40", endTime: "Apr 27, 2026 14:08", team: "Beta",  languagePair: "EN-US → PT-BR", duration: "00:28:30", aiVoice: "disabled", hipaa: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function confidenceColor(score: number) {
  if (score >= 90) return "#0E9E6E";
  if (score >= 70) return "#10B981";
  if (score >= 50) return "#F59E0B";
  return "#DC2626";
}
function confidenceBg(score: number) {
  if (score >= 90) return "rgba(14,158,110,0.08)";
  if (score >= 70) return "rgba(16,185,129,0.08)";
  if (score >= 50) return "rgba(245,158,11,0.08)";
  return "rgba(220,38,38,0.1)";
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} style={{ background: "#FEF3C7", padding: "0 1px", borderRadius: "2px" }}>
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

function sortSessions(sessions: SessionRow[], col: SortColumn, dir: SortDir): SessionRow[] {
  const live = sessions.filter(s => s.status === "Live");
  const done = [...sessions.filter(s => s.status !== "Live")].sort((a, b) => {
    const av = a[col === "id" ? "id" : col === "agent" ? "agent" : col === "status" ? "status" : col === "languagePair" ? "languagePair" : col === "duration" ? "duration" : "startTime"];
    const bv = b[col === "id" ? "id" : col === "agent" ? "agent" : col === "status" ? "status" : col === "languagePair" ? "languagePair" : col === "duration" ? "duration" : "startTime"];
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return dir === "asc" ? cmp : -cmp;
  });
  return [...live, ...done];
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

// ─── Session Detail Modal ─────────────────────────────────────────────────────

function SessionDetailModal({ session, onClose }: { session: SessionRow; onClose: () => void }) {
  const [view, setView] = useState<"combined" | "dual">("combined");
  const [search, setSearch] = useState("");
  const [lowConfIdx, setLowConfIdx] = useState(0);
  const lowConfRefs = useRef<(HTMLDivElement | null)[]>([]);
  const transcript = session.hipaa ? [] : mockTranscript;
  const lowConfMessages = transcript.filter(m => m.confidence < 40);
  const agentCount = transcript.filter(m => m.speaker === "AGENT").length;
  const customerCount = transcript.filter(m => m.speaker === "CUSTOMER").length;
  const total = transcript.length;
  const lowConfPct = total > 0 ? Math.round((transcript.filter(m => m.confidence < 40).length / total) * 100) : 0;

  const filtered = search.trim()
    ? transcript.filter(
        m =>
          m.original.toLowerCase().includes(search.toLowerCase()) ||
          m.translation.toLowerCase().includes(search.toLowerCase())
      )
    : transcript;

  function jumpToLowConf() {
    const el = lowConfRefs.current[lowConfIdx % lowConfMessages.length];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setLowConfIdx(i => i + 1);
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const canDownload = !session.hipaa && session.status === "Completed";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(17,24,39,0.5)", fontFamily: "'Poppins', sans-serif" }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-[12px] shadow-2xl flex flex-col"
        style={{ width: "740px", maxWidth: "calc(100vw - 48px)", maxHeight: "90vh" }}
      >
        {/* ── Modal Header ── */}
        <div className="px-6 pt-5 pb-4 border-b border-[#E5E7EB] flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#1F2937", margin: 0 }}>
                Session Details
              </h2>
              {session.hipaa && <Lock size={14} style={{ color: "#5B5FF2" }} />}
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1.5 rounded-[6px] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-all"
                style={{ fontSize: "12px", fontWeight: 500, color: "#374151" }}
              >
                Share
              </button>
              {canDownload && (
                <button
                  className="px-3 py-1.5 rounded-[6px] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-all"
                  style={{ fontSize: "12px", fontWeight: 500, color: "#374151" }}
                >
                  Export
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-[6px] hover:bg-[#F3F4F6] transition-all"
              >
                <X size={17} style={{ color: "#6B7280" }} />
              </button>
            </div>
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-4 gap-x-4 gap-y-3">
            {[
              { label: "Session ID", value: session.id },
              { label: "Agent",      value: session.agent },
              { label: "Team",       value: session.team },
              { label: "Language Pair", value: session.languagePair },
              { label: "Start Time", value: session.startTime },
              { label: "End Time",   value: session.status === "Live" ? "In progress" : (session.endTime ?? "—") },
              { label: "Duration",   value: session.duration },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 500, marginBottom: "2px" }}>{label}</div>
                <div style={{ fontSize: "13px", color: "#1F2937", fontWeight: 500 }}>{value}</div>
              </div>
            ))}
            <div>
              <div style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 500, marginBottom: "4px" }}>Status</div>
              <span
                className="px-1.5 py-0.5 rounded-[4px]"
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  background: session.status === "Live" ? "rgba(16,185,129,0.08)" : "#F3F4F6",
                  color: session.status === "Live" ? "#10B981" : "#6B7280",
                }}
              >
                {session.status === "Live" ? "● " : ""}{session.status}
              </span>
            </div>
          </div>

          {/* AI Voice row */}
          <div className="flex items-center gap-1.5 mt-3">
            <span style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 500 }}>AI Voice:</span>
            {session.aiVoice === "enabled" ? (
              <><Volume2 size={13} style={{ color: "#9CA3AF" }} /><span style={{ fontSize: "12px", color: "#6B7280" }}>Enabled</span></>
            ) : (
              <><VolumeX size={13} style={{ color: "#FF5F38" }} /><span style={{ fontSize: "12px", color: "#FF5F38", fontWeight: 500 }}>Disabled</span></>
            )}
          </div>
        </div>

        {/* ── Modal Body ── */}
        <div className="flex-1 overflow-y-auto">
          {session.hipaa ? (
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
              <Shield size={38} style={{ color: "#5B5FF2", marginBottom: "14px" }} />
              <div style={{ fontSize: "15px", fontWeight: 600, color: "#1F2937", marginBottom: "8px" }}>
                Transcript hidden for security
              </div>
              <div style={{ fontSize: "13px", color: "#6B7280", maxWidth: "360px", lineHeight: "1.6" }}>
                HIPAA mode was active during this session. Transcript is not available to protect patient privacy.
              </div>
            </div>
          ) : (
            <>
              {/* AI Voice OFF banner */}
              {session.aiVoice === "disabled" && (
                <div
                  className="flex items-center gap-3 px-6 py-3 border-b border-[#E5E7EB]"
                  style={{ background: "rgba(255,95,56,0.05)" }}
                >
                  <VolumeX size={14} style={{ color: "#FF5F38", flexShrink: 0 }} />
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#FF5F38" }}>AI Voice: OFF</span>
                  <span style={{ fontSize: "12px", color: "#6B7280" }}>— Disabled during this session</span>
                </div>
              )}

              {/* Session Summary */}
              <div className="px-6 py-4 border-b border-[#E5E7EB]">
                <div style={{ fontSize: "11px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
                  Session Summary
                </div>
                <div className="flex gap-8">
                  <div>
                    <div style={{ fontSize: "22px", fontWeight: 600, color: "#1F2937", lineHeight: 1 }}>{total}</div>
                    <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "3px" }}>Total messages</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "22px", fontWeight: 600, color: "#1F2937", lineHeight: 1 }}>
                      {Math.round((agentCount / total) * 100)}% · {Math.round((customerCount / total) * 100)}%
                    </div>
                    <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "3px" }}>Agent · Customer</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "22px", fontWeight: 600, color: lowConfPct > 0 ? "#DC2626" : "#1F2937", lineHeight: 1 }}>
                      {lowConfPct}%
                    </div>
                    <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "3px" }}>Below 40% confidence</div>
                  </div>
                </div>
              </div>

              {/* Transcript controls */}
              <div className="px-6 py-3 border-b border-[#E5E7EB] flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search transcript..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-[6px] border border-[#E5E7EB]"
                    style={{ fontSize: "13px", color: "#374151", outline: "none" }}
                  />
                </div>
                {lowConfMessages.length > 0 && (
                  <button
                    onClick={jumpToLowConf}
                    className="px-3 py-1.5 rounded-[6px] border transition-all hover:bg-[#FEF2F2]"
                    style={{ fontSize: "12px", fontWeight: 500, color: "#DC2626", borderColor: "#FCA5A5", whiteSpace: "nowrap" }}
                  >
                    Jump to low confidence
                  </button>
                )}
                <div className="flex gap-1 bg-[#F8F8FA] p-1 rounded-[8px] border border-[#E5E7EB] flex-shrink-0">
                  {(["combined", "dual"] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className="px-2 py-0.5 rounded-[6px] transition-all"
                      style={{
                        fontSize: "11px",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        background: view === v ? "rgba(64,35,255,0.12)" : "transparent",
                        color: view === v ? "#4023FF" : "#6B7280",
                      }}
                    >
                      {v === "combined" ? "Combined" : "Dual Stream"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transcript messages */}
              <div className="px-6 py-4">
                {view === "combined" ? (
                  <div className="flex flex-col gap-2.5">
                    {filtered.map((msg, i) => {
                      const isLow = msg.confidence < 40;
                      const lowIdx = lowConfMessages.findIndex(m => m.id === msg.id);
                      return (
                        <div
                          key={msg.id}
                          ref={lowIdx >= 0 ? el => { lowConfRefs.current[lowIdx] = el; } : undefined}
                          className="p-3 rounded-[8px] border"
                          style={{ borderColor: isLow ? "#FECACA" : "#E5E7EB", background: isLow ? "#FFF5F5" : "#FAFAFA" }}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span
                                className="px-1.5 py-0.5 rounded"
                                style={{
                                  fontSize: "10px", fontWeight: 700, letterSpacing: "0.04em",
                                  background: msg.speaker === "AGENT" ? "rgba(64,35,255,0.1)" : "#F3F4F6",
                                  color: msg.speaker === "AGENT" ? "#4023FF" : "#374151",
                                }}
                              >
                                {msg.speaker}
                              </span>
                              <span style={{ fontSize: "11px", color: "#9CA3AF" }}>{msg.timestamp}</span>
                            </div>
                            <span
                              className="px-1.5 py-0.5 rounded"
                              style={{ fontSize: "11px", fontWeight: 500, background: confidenceBg(msg.confidence), color: confidenceColor(msg.confidence) }}
                            >
                              {msg.confidence}%
                            </span>
                          </div>
                          <div style={{ fontSize: "13px", color: "#1F2937", lineHeight: "1.5", marginBottom: "4px" }}>
                            {highlightText(msg.original, search)}
                          </div>
                          <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: "1.5", fontStyle: "italic" }}>
                            {highlightText(msg.translation, search)}
                          </div>
                        </div>
                      );
                    })}
                    {filtered.length === 0 && search && (
                      <div className="text-center py-10" style={{ fontSize: "13px", color: "#9CA3AF" }}>
                        No messages match "{search}"
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {(["AGENT", "CUSTOMER"] as const).map(spk => (
                      <div key={spk}>
                        <div style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
                          {spk === "AGENT" ? "Agent" : "Customer"} Stream ({transcript.filter(m => m.speaker === spk).length} lines)
                        </div>
                        <div className="flex flex-col gap-2">
                          {transcript.filter(m => m.speaker === spk).map(msg => (
                            <div key={msg.id} className="p-3 rounded-[8px] border border-[#E5E7EB]" style={{ background: "#FAFAFA" }}>
                              <div className="flex items-center justify-between mb-1.5">
                                <span style={{ fontSize: "11px", color: "#9CA3AF" }}>{msg.timestamp}</span>
                                <span className="px-1.5 py-0.5 rounded" style={{ fontSize: "11px", fontWeight: 500, background: confidenceBg(msg.confidence), color: confidenceColor(msg.confidence) }}>
                                  {msg.confidence}%
                                </span>
                              </div>
                              <div style={{ fontSize: "12px", color: "#1F2937", lineHeight: "1.5", marginBottom: "3px" }}>{msg.original}</div>
                              <div style={{ fontSize: "11px", color: "#6B7280", lineHeight: "1.5", fontStyle: "italic" }}>{msg.translation}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── Modal Footer ── */}
        <div className="px-6 py-4 border-t border-[#E5E7EB] flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-[8px] border border-[#E5E7EB] hover:bg-[#F3F4F6] transition-all"
            style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sort icon ────────────────────────────────────────────────────────────────

function SortIcon({ col, sortCol, sortDir }: { col: SortColumn; sortCol: SortColumn; sortDir: SortDir }) {
  if (col !== sortCol) return <span style={{ fontSize: "10px", color: "#D1D5DB", marginLeft: "3px" }}>↕</span>;
  return sortDir === "asc"
    ? <ChevronUp size={12} style={{ color: "#4023FF", marginLeft: "2px", display: "inline" }} />
    : <ChevronDown size={12} style={{ color: "#4023FF", marginLeft: "2px", display: "inline" }} />;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Sessions() {
  const [teamFilter, setTeamFilter]       = useState<string>("all");
  const [showTeamDrop, setShowTeamDrop]   = useState(false);
  const [dateFilter, setDateFilter]       = useState<"last7" | "last30" | "custom">("last7");
  const [searchQuery, setSearchQuery]     = useState("");
  const [sortCol, setSortCol]             = useState<SortColumn>("startTime");
  const [sortDir, setSortDir]             = useState<SortDir>("desc");
  const [currentPage, setCurrentPage]     = useState(1);
  const [visibleColumns, setVisibleColumns] = useState<VisibleCols>({ team: true, languagePair: true, duration: true, aiVoice: true, hipaa: true });
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionRow | null>(null);

  const columnMenuRef  = useRef<HTMLDivElement>(null);
  const teamDropRef    = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (columnMenuRef.current && !columnMenuRef.current.contains(e.target as Node)) setShowColumnMenu(false);
      if (teamDropRef.current && !teamDropRef.current.contains(e.target as Node)) setShowTeamDrop(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCloseModal = useCallback(() => setSelectedSession(null), []);

  function handleSort(col: SortColumn) {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("desc"); }
    setCurrentPage(1);
  }

  // Filter + sort
  const filteredSessions = (() => {
    let r = mockSessions;
    if (teamFilter !== "all") r = r.filter(s => s.team === teamFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      r = r.filter(s => s.id.toLowerCase().includes(q) || s.agent.toLowerCase().includes(q));
    }
    return sortSessions(r, sortCol, sortDir);
  })();

  const hasFilters    = teamFilter !== "all" || searchQuery.trim() !== "";
  const displayTotal  = hasFilters ? filteredSessions.length : SESSIONS_TOTAL;
  const totalPages    = Math.ceil(displayTotal / PER_PAGE);
  const startIdx      = (currentPage - 1) * PER_PAGE + 1;
  const endIdx        = Math.min(currentPage * PER_PAGE, displayTotal);

  const teamLabel = teamFilter === "all" ? "All teams" : teamFilter;

  const SORTABLE: Record<string, SortColumn | null> = {
    "SESSION ID": "id", "AGENT": "agent", "STATUS": "status",
    "START TIME": "startTime", "TEAM": null, "LANGUAGE PAIR": "languagePair",
    "DURATION": "duration", "AI VOICE": null, "HIPAA": null, "ACTIONS": null,
  };

  function thClass(col: SortColumn | null) {
    return col ? "cursor-pointer select-none hover:text-[#374151] transition-colors" : "";
  }

  function canDownload(s: SessionRow) {
    return !s.hipaa && s.status === "Completed";
  }

  return (
    <PageLayout title="Sessions">

      {/* ── Filters ── */}
      <div
        className="flex items-center gap-3 mb-5 p-3 rounded-[10px] border"
        style={{ background: "#FFFFFF", borderColor: "#E5E7EB" }}
      >
        {/* Team */}
        <div className="relative" ref={teamDropRef}>
          <button
            onClick={() => setShowTeamDrop(v => !v)}
            className="flex items-center gap-2 px-3 py-2 rounded-[8px] border transition-all"
            style={{
              fontSize: "13px", fontWeight: 500,
              color: teamFilter !== "all" ? "#4023FF" : "#374151",
              borderColor: teamFilter !== "all" ? "#4023FF" : "#E5E7EB",
              background: teamFilter !== "all" ? "rgba(64,35,255,0.05)" : "#FFFFFF",
            }}
          >
            {teamLabel}
            <ChevronDown size={13} />
          </button>
          {showTeamDrop && (
            <div className="absolute top-full left-0 mt-1 rounded-[8px] border border-[#E5E7EB] shadow-lg z-20 overflow-hidden" style={{ background: "#FFFFFF", minWidth: "180px" }}>
              {["all", "Alpha", "Beta"].map(opt => (
                <button
                  key={opt}
                  onClick={() => { setTeamFilter(opt); setShowTeamDrop(false); setCurrentPage(1); }}
                  className="w-full text-left px-3 py-2 hover:bg-[#F8F8FA] transition-all"
                  style={{
                    fontSize: "13px",
                    fontWeight: teamFilter === opt ? 600 : 400,
                    color: teamFilter === opt ? "#4023FF" : "#374151",
                  }}
                >
                  {opt === "all" ? "All teams" : opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date range */}
        <DateRangeFilter value={dateFilter} onChange={v => setDateFilter(v)} />

        {/* Agent language */}
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-[8px] border border-[#E5E7EB] transition-all"
          style={{ fontSize: "13px", fontWeight: 500, color: "#374151", background: "#FFFFFF" }}
        >
          <span style={{ fontSize: "11px", color: "#9CA3AF" }}>Agent</span>
          All Languages
          <ChevronDown size={13} />
        </button>

        {/* Customer language */}
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-[8px] border border-[#E5E7EB] transition-all"
          style={{ fontSize: "13px", fontWeight: 500, color: "#374151", background: "#FFFFFF" }}
        >
          <span style={{ fontSize: "11px", color: "#9CA3AF" }}>Customer</span>
          All Languages
          <ChevronDown size={13} />
        </button>

        {/* Search */}
        <div className="flex-1 relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Session ID or keyword"
            className="w-full pl-8 pr-3 py-2 rounded-[8px] border border-[#E5E7EB]"
            style={{ fontSize: "13px", color: "#374151", outline: "none" }}
          />
        </div>

        {/* Reset */}
        <button
          onClick={() => { setTeamFilter("all"); setSearchQuery(""); setCurrentPage(1); }}
          style={{ fontSize: "13px", fontWeight: 500, color: "#4023FF" }}
          className="hover:underline flex-shrink-0"
        >
          Reset
        </button>
      </div>

      {/* ── Table container ── */}
      <div className="rounded-[10px] border overflow-hidden" style={{ background: "#FFFFFF", borderColor: "#E5E7EB" }}>

        {/* Table toolbar */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b"
          style={{ borderColor: "#E5E7EB", background: "#FAFAFA" }}
        >
          <div style={{ fontSize: "13px", color: "#6B7280" }}>
            Showing {startIdx.toLocaleString()}–{endIdx.toLocaleString()} of {displayTotal.toLocaleString()} sessions
          </div>
          <div className="flex items-center gap-2">
            {/* Columns toggle */}
            <div className="relative" ref={columnMenuRef}>
              <button
                onClick={() => setShowColumnMenu(v => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border transition-all hover:border-[#4023FF]"
                style={{ fontSize: "13px", fontWeight: 500, color: "#374151", borderColor: "#E5E7EB", background: "#FFFFFF" }}
              >
                <Columns2 size={14} />
                Columns
                <ChevronDown size={13} />
              </button>
              {showColumnMenu && (
                <div
                  className="absolute right-0 mt-1.5 w-48 rounded-[8px] border border-[#E5E7EB] shadow-lg p-3 z-20"
                  style={{ background: "#FFFFFF" }}
                >
                  <div className="flex flex-col gap-2">
                    {/* Fixed (disabled) */}
                    {["Session ID", "Agent", "Status", "Start Time", "Actions"].map(col => (
                      <label key={col} className="flex items-center gap-2" style={{ cursor: "not-allowed", opacity: 0.5 }}>
                        <input type="checkbox" checked readOnly disabled />
                        <span style={{ fontSize: "12px", color: "#6B7280" }}>{col}</span>
                      </label>
                    ))}
                    <div style={{ height: "1px", background: "#E5E7EB", margin: "2px 0" }} />
                    {/* Togglable */}
                    {(Object.keys(visibleColumns) as (keyof VisibleCols)[]).map(key => {
                      const labels: Record<keyof VisibleCols, string> = { team: "Team", languagePair: "Language Pair", duration: "Duration", aiVoice: "AI Voice", hipaa: "HIPAA" };
                      return (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={visibleColumns[key]}
                            onChange={e => setVisibleColumns(prev => ({ ...prev, [key]: e.target.checked }))}
                          />
                          <span style={{ fontSize: "12px", color: "#374151" }}>{labels[key]}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Export */}
            <button
              className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] border transition-all hover:bg-[#F3F4F6]"
              style={{ fontSize: "13px", fontWeight: 500, color: "#374151", borderColor: "#E5E7EB", background: "#FFFFFF" }}
            >
              <Download size={14} />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#FAFAFA", borderBottom: "1px solid #E5E7EB" }}>
              {([
                { label: "SESSION ID",    col: "id"          as SortColumn },
                { label: "AGENT",         col: "agent"       as SortColumn },
                { label: "STATUS",        col: "status"      as SortColumn },
                { label: "START TIME",    col: "startTime"   as SortColumn },
              ]).map(({ label, col }) => (
                <th
                  key={label}
                  onClick={() => handleSort(col)}
                  className={`px-5 py-3 text-left ${thClass(col)}`}
                  style={{ fontSize: "11px", fontWeight: 600, color: "#9CA3AF", letterSpacing: "0.04em" }}
                >
                  {label}
                  <SortIcon col={col} sortCol={sortCol} sortDir={sortDir} />
                </th>
              ))}
              {visibleColumns.team && (
                <th className="px-5 py-3 text-left" style={{ fontSize: "11px", fontWeight: 600, color: "#9CA3AF", letterSpacing: "0.04em" }}>TEAM</th>
              )}
              {visibleColumns.languagePair && (
                <th
                  onClick={() => handleSort("languagePair")}
                  className={`px-5 py-3 text-left ${thClass("languagePair")}`}
                  style={{ fontSize: "11px", fontWeight: 600, color: "#9CA3AF", letterSpacing: "0.04em" }}
                >
                  LANGUAGE PAIR <SortIcon col="languagePair" sortCol={sortCol} sortDir={sortDir} />
                </th>
              )}
              {visibleColumns.duration && (
                <th
                  onClick={() => handleSort("duration")}
                  className={`px-5 py-3 text-left ${thClass("duration")}`}
                  style={{ fontSize: "11px", fontWeight: 600, color: "#9CA3AF", letterSpacing: "0.04em" }}
                >
                  DURATION <SortIcon col="duration" sortCol={sortCol} sortDir={sortDir} />
                </th>
              )}
              {visibleColumns.aiVoice && (
                <th className="px-5 py-3 text-left" style={{ fontSize: "11px", fontWeight: 600, color: "#9CA3AF", letterSpacing: "0.04em" }}>AI VOICE</th>
              )}
              {visibleColumns.hipaa && (
                <th className="px-5 py-3 text-left" style={{ fontSize: "11px", fontWeight: 600, color: "#9CA3AF", letterSpacing: "0.04em" }}>HIPAA</th>
              )}
              <th className="px-5 py-3 text-left" style={{ fontSize: "11px", fontWeight: 600, color: "#9CA3AF", letterSpacing: "0.04em" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.length === 0 ? (
              <tr>
                <td
                  colSpan={5 + Object.values(visibleColumns).filter(Boolean).length + 1}
                  className="px-5 py-12 text-center"
                  style={{ fontSize: "13px", color: "#9CA3AF" }}
                >
                  No sessions yet for this period. Adjust your filters or check back later.
                </td>
              </tr>
            ) : (
              filteredSessions.map((session, idx) => (
                <tr
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  style={{ borderBottom: idx < filteredSessions.length - 1 ? "1px solid #F3F4F6" : "none", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F8F8FA")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#FFFFFF")}
                >
                  <td className="px-5 py-3" style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>
                    {session.id}
                  </td>
                  <td className="px-5 py-3" style={{ fontSize: "13px", color: "#374151" }}>
                    {session.agent}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="px-1.5 py-0.5 rounded-[4px]"
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        background: session.status === "Live" ? "rgba(16,185,129,0.08)" : "#F3F4F6",
                        color: session.status === "Live" ? "#10B981" : "#6B7280",
                      }}
                    >
                      {session.status === "Live" ? "● " : ""}{session.status}
                    </span>
                  </td>
                  <td className="px-5 py-3" style={{ fontSize: "13px", color: "#6B7280" }}>
                    {session.startTime}
                  </td>
                  {visibleColumns.team && (
                    <td className="px-5 py-3" style={{ fontSize: "13px", color: "#6B7280" }}>{session.team}</td>
                  )}
                  {visibleColumns.languagePair && (
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded" style={{ fontSize: "12px", fontWeight: 500, background: "#F3F4F6", color: "#374151" }}>
                          {session.languagePair.split(" → ")[0]}
                        </span>
                        <span style={{ fontSize: "12px", color: "#9CA3AF" }}>→</span>
                        <span className="px-1.5 py-0.5 rounded" style={{ fontSize: "12px", fontWeight: 500, background: "#F3F4F6", color: "#374151" }}>
                          {session.languagePair.split(" → ")[1]}
                        </span>
                      </div>
                    </td>
                  )}
                  {visibleColumns.duration && (
                    <td className="px-5 py-3" style={{ fontSize: "13px", color: "#6B7280" }}>{session.duration}</td>
                  )}
                  {visibleColumns.aiVoice && (
                    <td className="px-5 py-3">
                      {session.aiVoice === "enabled"
                        ? <Volume2 size={15} style={{ color: "#9CA3AF" }} title="AI Voice was enabled for this session" />
                        : <VolumeX size={15} style={{ color: "#FF5F38" }} title="AI Voice was disabled for this session" />}
                    </td>
                  )}
                  {visibleColumns.hipaa && (
                    <td className="px-5 py-3">
                      {session.hipaa
                        ? <Shield size={15} style={{ color: "#5B5FF2" }} title="HIPAA mode is active for this team" />
                        : <span style={{ fontSize: "14px", color: "#D1D5DB" }}>—</span>}
                    </td>
                  )}
                  <td className="px-5 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedSession(session)}
                        className="p-1.5 rounded-[6px] hover:bg-[#F3F4F6] transition-all"
                        title="View details"
                      >
                        <Eye size={15} style={{ color: "#6B7280" }} />
                      </button>
                      <button
                        disabled={!canDownload(session)}
                        className={`p-1.5 rounded-[6px] transition-all ${canDownload(session) ? "hover:bg-[#F3F4F6]" : "opacity-30 cursor-not-allowed"}`}
                        title={!canDownload(session) ? (session.hipaa ? "Transcript not available — HIPAA mode is active for this team" : "Session in progress") : "Download transcript"}
                      >
                        <Download size={15} style={{ color: "#6B7280" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div
        className="flex items-center justify-between mt-4 px-5 py-3 rounded-[10px] border"
        style={{ background: "#FFFFFF", borderColor: "#E5E7EB" }}
      >
        <div style={{ fontSize: "12px", color: "#6B7280" }}>
          Showing {startIdx.toLocaleString()}–{endIdx.toLocaleString()} of {displayTotal.toLocaleString()} sessions
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded-[6px] border hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{ fontSize: "12px", borderColor: "#E5E7EB" }}
          >
            ←
          </button>
          {getPageNumbers(currentPage, totalPages).map((n, i) =>
            n === "..." ? (
              <span key={`ellipsis-${i}`} style={{ fontSize: "12px", color: "#9CA3AF", padding: "0 4px" }}>…</span>
            ) : (
              <button
                key={n}
                onClick={() => setCurrentPage(n as number)}
                className="px-2.5 py-1 rounded-[6px] border transition-all"
                style={{
                  fontSize: "12px",
                  borderColor: currentPage === n ? "#4023FF" : "#E5E7EB",
                  background: currentPage === n ? "rgba(64,35,255,0.12)" : "#FFFFFF",
                  color: currentPage === n ? "#4023FF" : "#6B7280",
                  fontWeight: currentPage === n ? 600 : 400,
                  minWidth: "30px",
                }}
              >
                {n}
              </button>
            )
          )}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded-[6px] border hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{ fontSize: "12px", borderColor: "#E5E7EB" }}
          >
            →
          </button>
        </div>
        <div style={{ fontSize: "12px", color: "#6B7280" }}>
          Page {currentPage} of {totalPages.toLocaleString()}
        </div>
      </div>

      {/* ── Session Detail Modal ── */}
      {selectedSession && (
        <SessionDetailModal session={selectedSession} onClose={handleCloseModal} />
      )}
    </PageLayout>
  );
}
