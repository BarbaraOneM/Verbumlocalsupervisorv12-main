import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { Sidebar } from "../components/Sidebar";
import { Tooltip } from "../components/Tooltip";
import {
  Plus, Search, Upload, Download, ChevronDown,
  MoreHorizontal, Pencil, Trash2, RefreshCw, X,
  Columns2, Info, Check, AlertTriangle,
  TrendingUp, Star, Users, ChevronUp,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Reply {
  id: string;
  categoryId: string;
  title: string;
  message: string;
  tags: string[];
  enabled: boolean;
  useCount: number;
  language: string;
}

interface Category {
  id: string;
  name: string;
  isAutoGreeting?: boolean;
  enabled: boolean;
  language: string;
  description: string;
  assignedTeams: string[];
}

interface ToastMsg {
  id: string;
  message: string;
  type: "success" | "error";
}

type SortOption = "title-asc" | "title-desc" | "most-used" | "least-used";

// ─── Tag color palette (deterministic by tag name hash) ───────────────────────

const TAG_PALETTE = [
  "#5e61ff", "#3b82f6", "#10b981", "#06b6d4",
  "#8b5cf6", "#ec4899", "#f59e0b", "#ef4444",
];

function getTagColor(tag: string): string {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = ((hash * 31) + tag.charCodeAt(i)) & 0xffffffff;
  }
  return TAG_PALETTE[Math.abs(hash) % TAG_PALETTE.length];
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const TEAMS = ["Alpha", "Beta"];

const SUPPORTED_LANGUAGES = [
  { code: "en-US", label: "English — United States" },
  { code: "es-MX", label: "Spanish — Mexico" },
  { code: "fr-FR", label: "French — France" },
  { code: "pt-BR", label: "Portuguese — Brazil" },
  { code: "ar",    label: "Arabic" },
  { code: "zh-CN", label: "Chinese — Simplified" },
  { code: "de-DE", label: "German — Germany" },
];

const DISPLAY_LANGUAGES = [
  { code: "original", label: "Original" },
  { code: "en", label: "English (EN)" },
  { code: "es", label: "Spanish (ES)" },
  { code: "fr", label: "French (FR)" },
  { code: "pt", label: "Portuguese (PT)" },
  { code: "ar", label: "Arabic (AR)" },
];

const INITIAL_CATEGORIES: Category[] = [
  {
    id: "auto",
    name: "Auto Greetings",
    isAutoGreeting: true,
    enabled: true,
    language: "en-US",
    description: "Automatically played at the start of each call",
    assignedTeams: ["Alpha", "Beta"],
  },
  {
    id: "c1",
    name: "Greetings",
    enabled: true,
    language: "en-US",
    description: "Opening phrases and welcome messages",
    assignedTeams: ["Alpha", "Beta"],
  },
  {
    id: "c2",
    name: "Account Verification",
    enabled: true,
    language: "en-US",
    description: "Phrases for verifying customer identity",
    assignedTeams: ["Alpha"],
  },
  {
    id: "c3",
    name: "On Hold",
    enabled: true,
    language: "en-US",
    description: "Messages used when placing a customer on hold",
    assignedTeams: ["Alpha", "Beta"],
  },
  {
    id: "c4",
    name: "Escalation",
    enabled: false,
    language: "en-US",
    description: "Phrases for transferring or escalating calls",
    assignedTeams: ["Beta"],
  },
];

const INITIAL_REPLIES: Reply[] = [
  // Auto Greetings
  { id: "r0a", categoryId: "auto", title: "Standard Opening", message: "Thank you for calling. My name is your interpreter today. How can I help you?", tags: [], enabled: true, useCount: 0, language: "en-US" },
  { id: "r0b", categoryId: "auto", title: "Medical Line Greeting", message: "Hello, this is your language interpreter. I'll be assisting with this call. Please proceed when ready.", tags: [], enabled: true, useCount: 0, language: "en-US" },
  // Greetings
  { id: "r1a", categoryId: "c1", title: "Hello, how can I assist you today?", message: "Hello! Thank you for reaching out. My name is your interpreter and I'm here to help. How can I assist you today?", tags: ["greeting", "welcome"], enabled: true, useCount: 142, language: "en-US" },
  { id: "r1b", categoryId: "c1", title: "Welcome back", message: "Welcome back! It's great to speak with you again. How can I help you today?", tags: ["greeting", "returning"], enabled: true, useCount: 88, language: "en-US" },
  { id: "r1c", categoryId: "c1", title: "Good morning / afternoon", message: "Good morning! I hope you're doing well today. I'm here to help you. What can I assist you with?", tags: ["greeting"], enabled: true, useCount: 61, language: "en-US" },
  { id: "r1d", categoryId: "c1", title: "How may I direct your call?", message: "Thank you for calling. How may I direct your call today? I'm ready to assist you.", tags: ["greeting", "routing"], enabled: false, useCount: 9, language: "en-US" },
  // Account Verification
  { id: "r2a", categoryId: "c2", title: "Please provide your account number", message: "For security purposes, could you please provide your account number or the last four digits of your ID?", tags: ["verification", "security"], enabled: true, useCount: 203, language: "en-US" },
  { id: "r2b", categoryId: "c2", title: "Verify date of birth", message: "To verify your identity, could you please confirm your date of birth and the zip code associated with your account?", tags: ["verification", "identity"], enabled: true, useCount: 176, language: "en-US" },
  { id: "r2c", categoryId: "c2", title: "Security question", message: "I need to ask you a security question to access your account. Are you ready?", tags: ["verification", "security"], enabled: true, useCount: 94, language: "en-US" },
  { id: "r2d", categoryId: "c2", title: "Unable to verify identity", message: "I'm sorry, I wasn't able to verify your identity with the information provided. Could you try a different form of identification?", tags: ["verification", "error"], enabled: true, useCount: 38, language: "en-US" },
  { id: "r2e", categoryId: "c2", title: "Identity confirmed", message: "Thank you! Your identity has been verified successfully. How can I assist you today?", tags: ["verification", "success"], enabled: true, useCount: 189, language: "en-US" },
  // On Hold
  { id: "r3a", categoryId: "c3", title: "Please hold for a moment", message: "I need to put you on hold for just a moment while I look into this for you. I'll be back with you shortly.", tags: ["hold"], enabled: true, useCount: 312, language: "en-US" },
  { id: "r3b", categoryId: "c3", title: "Thank you for your patience", message: "Thank you so much for your patience. I appreciate you holding. Let me continue assisting you now.", tags: ["hold", "patience"], enabled: true, useCount: 287, language: "en-US" },
  { id: "r3c", categoryId: "c3", title: "Brief hold needed", message: "I apologize for the inconvenience. I need to place you on a brief hold. It should only take a minute or two.", tags: ["hold"], enabled: false, useCount: 41, language: "en-US" },
  // Escalation
  { id: "r4a", categoryId: "c4", title: "Transfer to supervisor", message: "I'm going to transfer you to a supervisor who will be better equipped to help you with this matter. One moment please.", tags: ["escalation", "supervisor"], enabled: true, useCount: 57, language: "en-US" },
  { id: "r4b", categoryId: "c4", title: "Escalating your case", message: "I understand this situation requires additional attention. I'm escalating your case to our specialist team right now.", tags: ["escalation", "priority"], enabled: true, useCount: 33, language: "en-US" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId() {
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: "#FBBF24", color: "#000", fontWeight: 500, borderRadius: "2px" }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function getLangLabel(code: string): string {
  return SUPPORTED_LANGUAGES.find(l => l.code === code)?.label ?? code;
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={!disabled ? onChange : undefined}
      disabled={disabled}
      className={`relative flex-shrink-0 rounded-full transition-colors ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
      style={{ width: 44, height: 24, background: checked ? "#4023FF" : "#D1D5DB" }}
    >
      <div
        className="absolute top-[2px] w-5 h-5 bg-white rounded-full transition-transform"
        style={{ transform: checked ? "translateX(22px)" : "translateX(2px)" }}
      />
    </button>
  );
}

// ─── Small Toggle (for table rows) ────────────────────────────────────────────

function SmallToggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="relative flex-shrink-0 rounded-full transition-colors cursor-pointer"
      style={{ width: 32, height: 18, background: checked ? "#4023FF" : "#D1D5DB" }}
    >
      <div
        className="absolute bg-white rounded-full transition-transform"
        style={{ width: 14, height: 14, top: 2, transform: checked ? "translateX(16px)" : "translateX(2px)" }}
      />
    </button>
  );
}

// ─── Tiny Toggle (compact — for table status column) ─────────────────────────

function TinyToggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="relative flex-shrink-0 rounded-full transition-colors cursor-pointer"
      style={{ width: 26, height: 14, background: checked ? "#4023FF" : "#D1D5DB" }}
    >
      <div
        className="absolute bg-white rounded-full transition-transform"
        style={{ width: 10, height: 10, top: 2, transform: checked ? "translateX(13px)" : "translateX(2px)" }}
      />
    </button>
  );
}

// ─── Tag Chip ─────────────────────────────────────────────────────────────────

function TagChip({ tag }: { tag: string }) {
  const color = getTagColor(tag);
  return (
    <span
      className="px-2.5 py-1 border rounded-full text-xs font-medium whitespace-nowrap"
      style={{
        background: `${color}0D`,
        borderColor: `${color}26`,
        color: `${color}B3`,
      }}
    >
      {tag}
    </span>
  );
}

function TagList({ tags }: { tags: string[] }) {
  const max = 2;
  const visible = tags.slice(0, max);
  const hidden = tags.slice(max);
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {visible.map(tag => <TagChip key={tag} tag={tag} />)}
      {hidden.length > 0 && (
        <Tooltip content={hidden.join(", ")} position="top" compact>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-medium cursor-default"
            style={{ background: "#F3F4F6", color: "#6B7280", border: "1px solid #E5E7EB" }}
          >
            +{hidden.length}
          </span>
        </Tooltip>
      )}
    </div>
  );
}

// ─── Tag Input ────────────────────────────────────────────────────────────────

function TagInput({ tags, onChange, allTags }: { tags: string[]; onChange: (t: string[]) => void; allTags: string[] }) {
  const [input, setInput] = useState("");
  const [showSug, setShowSug] = useState(false);

  const norm = input.trim().toLowerCase();
  const suggestions = norm ? allTags.filter(t => t.includes(norm) && !tags.includes(t)) : [];

  function addTag(tag: string) {
    const n = tag.trim().toLowerCase();
    if (n && !tags.includes(n)) onChange([...tags, n]);
    setInput("");
    setShowSug(false);
  }
  function removeTag(tag: string) { onChange(tags.filter(t => t !== tag)); }

  function handleKey(e: React.KeyboardEvent) {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }

  return (
    <div className="relative">
      <div
        className="flex flex-wrap gap-1.5 items-center min-h-[38px] px-3 py-1.5 rounded-[8px] border border-[#D1D5DB] bg-white cursor-text transition-colors"
      >
        {tags.map(tag => {
          const c = getTagColor(tag);
          return (
            <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ background: `${c}0D`, border: `1px solid ${c}26`, color: `${c}B3` }}>
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:opacity-70"><X size={10} /></button>
            </span>
          );
        })}
        <input
          value={input}
          onChange={e => { setInput(e.target.value); setShowSug(true); }}
          onKeyDown={handleKey}
          onFocus={() => setShowSug(true)}
          onBlur={() => setTimeout(() => setShowSug(false), 150)}
          placeholder={tags.length === 0 ? "Add tags... (press Enter or comma to add)" : ""}
          className="flex-1 min-w-[120px] outline-none bg-transparent"
          style={{ fontSize: "13px", color: "#374151" }}
        />
      </div>
      {showSug && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E7EB] rounded-[8px] shadow-lg z-[250] overflow-hidden">
          {suggestions.slice(0, 6).map(s => (
            <button key={s} type="button" onMouseDown={() => addTag(s)}
              className="w-full text-left px-3 py-2 hover:bg-[#F8F8FA] transition-all"
              style={{ fontSize: "13px", color: "#374151" }}>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Toast System ─────────────────────────────────────────────────────────────

function ToastContainer({ toasts, onDismiss }: { toasts: ToastMsg[]; onDismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id}
          className="flex items-center gap-3 px-4 py-3 rounded-[8px] shadow-lg pointer-events-auto"
          style={{
            background: t.type === "success" ? "#1F2937" : "#DC2626",
            color: "#FFFFFF", fontSize: "13px", fontWeight: 500,
            minWidth: "280px", maxWidth: "420px",
          }}>
          <span className="flex-1">{t.message}</span>
          <button onClick={() => onDismiss(t.id)} className="flex-shrink-0 opacity-60 hover:opacity-100"><X size={14} /></button>
        </div>
      ))}
    </div>
  );
}

function useToasts() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const addToast = useCallback((message: string, type: "success" | "error") => {
    const id = generateId();
    setToasts(t => [...t, { id, message, type }]);
    if (type === "success") {
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
    }
  }, []);
  const dismissToast = useCallback((id: string) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);
  return { toasts, addToast, dismissToast };
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────

function ConfirmModal({
  title, body, confirmLabel, onConfirm, onCancel, destructive = false,
}: {
  title: string; body: React.ReactNode; confirmLabel: string;
  onConfirm: () => void; onCancel: () => void; destructive?: boolean;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(10,10,18,0.5)", fontFamily: "'Poppins', sans-serif" }}
      onMouseDown={e => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="bg-white rounded-[12px] shadow-xl p-6" style={{ width: "448px", maxWidth: "calc(100vw - 48px)" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1F2937", marginBottom: "12px" }}>{title}</h3>
        <div style={{ fontSize: "13px", color: "#6B7280", lineHeight: "1.6", marginBottom: "24px" }}>{body}</div>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-[8px] border border-[#E5E7EB] hover:bg-[#F3F4F6] transition-all"
            style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-[8px] transition-all hover:opacity-90"
            style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF", background: destructive ? "#DC2626" : "#4023FF" }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Form Field ───────────────────────────────────────────────────────────────

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: "12px", fontWeight: 500, color: "#374151", display: "block", marginBottom: "6px" }}>
        {label}{required && <span style={{ color: "#DC2626", marginLeft: "3px" }}>*</span>}
      </label>
      {children}
      {error && <p style={{ fontSize: "11px", color: "#DC2626", marginTop: "4px" }}>{error}</p>}
    </div>
  );
}

function InputField({ value, onChange, placeholder, maxLength, onFocus, onBlur, disabled }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  maxLength?: number; onFocus?: () => void; onBlur?: () => void; disabled?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      disabled={disabled}
      className="w-full px-3 py-2 rounded-[8px] border border-[#D1D5DB] transition-colors bg-white disabled:bg-[#F9FAFB] disabled:cursor-not-allowed"
      style={{ fontSize: "13px", color: "#374151", outline: "none" }}
      onFocus={e => { e.target.style.borderColor = "#4023FF"; onFocus?.(); }}
      onBlur={e => { e.target.style.borderColor = "#D1D5DB"; onBlur?.(); }}
    />
  );
}

function SelectField({ value, onChange, children }: {
  value: string; onChange: (v: string) => void; children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-[8px] border border-[#D1D5DB] bg-white transition-colors appearance-none"
      style={{ fontSize: "13px", color: value ? "#374151" : "#9CA3AF", outline: "none" }}
      onFocus={e => (e.target.style.borderColor = "#4023FF")}
      onBlur={e => (e.target.style.borderColor = "#D1D5DB")}
    >
      {children}
    </select>
  );
}

// ─── Language Change Warning ──────────────────────────────────────────────────

function LangChangeWarning({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 px-3 py-2.5 rounded-[8px] border"
      style={{ background: "#FEFCE8", borderColor: "#FACC15" }}>
      <AlertTriangle size={14} style={{ color: "#A16207", flexShrink: 0, marginTop: "1px" }} />
      <p style={{ fontSize: "12px", color: "#A16207" }}>{message}</p>
    </div>
  );
}

// ─── Category Modal (Create / Edit) ──────────────────────────────────────────

interface CategoryFormData {
  name: string;
  language: string;
  description: string;
  assignedTeams: string[];
}

function CategoryModal({
  mode, initial, onSave, onCancel,
}: {
  mode: "create" | "edit";
  initial?: Category;
  onSave: (data: CategoryFormData) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [language, setLanguage] = useState(initial?.language ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [assignedTeams, setAssignedTeams] = useState<string[]>(initial?.assignedTeams ?? []);
  const [errors, setErrors] = useState<{ name?: string; language?: string }>({});
  const [langChanged, setLangChanged] = useState(false);

  const originalLang = useRef(initial?.language ?? "");

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onCancel]);

  function handleLangChange(v: string) {
    setLanguage(v);
    if (mode === "edit" && v !== originalLang.current) setLangChanged(true);
    else setLangChanged(false);
  }

  function validate() {
    const e: { name?: string; language?: string } = {};
    if (!name.trim()) e.name = "Category name cannot be empty";
    if (!language) e.language = "Language is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    onSave({ name: name.trim(), language, description: description.trim(), assignedTeams });
  }

  const hasChanges = mode === "create" || (
    name !== (initial?.name ?? "") ||
    language !== (initial?.language ?? "") ||
    description !== (initial?.description ?? "") ||
    JSON.stringify(assignedTeams.sort()) !== JSON.stringify([...(initial?.assignedTeams ?? [])].sort())
  );
  const canSave = name.trim() && language && (mode === "create" || hasChanges);

  function toggleTeam(team: string) {
    setAssignedTeams(ts => ts.includes(team) ? ts.filter(t => t !== team) : [...ts, team]);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(10,10,18,0.5)", fontFamily: "'Poppins', sans-serif" }}
      onMouseDown={e => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="bg-white rounded-[12px] shadow-xl" style={{ width: "512px", maxWidth: "calc(100vw - 48px)", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-0">
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1F2937" }}>
            {mode === "create" ? "Create Category" : "Edit Category"}
          </h3>
          <button onClick={onCancel} className="p-1.5 rounded-[6px] hover:bg-[#F3F4F6] transition-all">
            <X size={16} style={{ color: "#6B7280" }} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto flex flex-col gap-4">
          {langChanged && (
            <LangChangeWarning message="Language changed. Please review and update the Name to match the selected language." />
          )}
          <Field label="Name" required error={errors.name}>
            <InputField value={name} onChange={v => { setName(v); if (errors.name) setErrors(e => ({ ...e, name: undefined })); }} placeholder="Category name" maxLength={60} />
            <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px" }}>{name.length}/60 characters</p>
          </Field>

          <Field label="Language" required error={errors.language}>
            <div className="relative">
              <SelectField value={language} onChange={handleLangChange}>
                <option value="" disabled>Select language…</option>
                {SUPPORTED_LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </SelectField>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9CA3AF" }} />
            </div>
          </Field>

          <Field label="Description">
            <InputField value={description} onChange={setDescription} placeholder="Optional — short description for context" />
          </Field>

          <Field label="Assign to teams">
            <div className="flex flex-col gap-2">
              {TEAMS.map(team => (
                <label key={team} className="flex items-center gap-2.5 cursor-pointer">
                  <div
                    onClick={() => toggleTeam(team)}
                    className="w-4 h-4 rounded-[4px] border flex items-center justify-center flex-shrink-0 cursor-pointer transition-all"
                    style={{
                      background: assignedTeams.includes(team) ? "#4023FF" : "#FFFFFF",
                      borderColor: assignedTeams.includes(team) ? "#4023FF" : "#D1D5DB",
                    }}
                  >
                    {assignedTeams.includes(team) && <Check size={10} style={{ color: "#FFFFFF" }} />}
                  </div>
                  <span style={{ fontSize: "13px", color: "#374151" }}>{team}</span>
                </label>
              ))}
            </div>
            <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "6px" }}>
              Selecting a team makes this category active for that team immediately on save.
            </p>
          </Field>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 pb-6 pt-2 border-t border-[#F3F4F6]">
          <button onClick={onCancel} type="button"
            className="px-4 py-2 rounded-[8px] border border-[#E5E7EB] hover:bg-[#F3F4F6] transition-all"
            style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>
            Cancel
          </button>
          <button onClick={handleSubmit as unknown as React.MouseEventHandler}
            disabled={!canSave}
            className="px-4 py-2 rounded-[8px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF", background: "#4023FF" }}
            onMouseEnter={e => { if (canSave) e.currentTarget.style.background = "#3419cc"; }}
            onMouseLeave={e => (e.currentTarget.style.background = "#4023FF")}>
            {mode === "create" ? "Create Category" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Reply Modal (Create / Edit) ──────────────────────────────────────────────

interface ReplyFormData {
  categoryId: string;
  language: string;
  title: string;
  message: string;
  tags: string[];
  enabled: boolean;
}

function ReplyModal({
  mode, initial, categories, defaultCategoryId, isAutoGreeting, allTags, onSave, onCancel,
}: {
  mode: "create" | "edit";
  initial?: Reply;
  categories: Category[];
  defaultCategoryId: string;
  isAutoGreeting: boolean;
  allTags: string[];
  onSave: (data: ReplyFormData) => void;
  onCancel: () => void;
}) {
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? defaultCategoryId);
  const [language, setLanguage] = useState(initial?.language ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [message, setMessage] = useState(initial?.message ?? "");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [enabled, setEnabled] = useState(initial?.enabled ?? true);
  const [errors, setErrors] = useState<{ title?: string; message?: string; language?: string; category?: string }>({});
  const [langChanged, setLangChanged] = useState(false);

  const originalLang = useRef(initial?.language ?? "");

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onCancel]);

  function handleLangChange(v: string) {
    setLanguage(v);
    if (mode === "edit" && v !== originalLang.current) setLangChanged(true);
    else setLangChanged(false);
  }

  function validate() {
    const e: typeof errors = {};
    if (!categoryId) e.category = "Category is required";
    if (!language) e.language = "Language is required";
    if (!title.trim()) e.title = "Title is required";
    if (!message.trim()) e.message = "Message cannot be empty";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    onSave({ categoryId, language, title: title.trim(), message: message.trim(), tags, enabled });
  }

  const hasChanges = mode === "create" || (
    categoryId !== (initial?.categoryId ?? "") ||
    language !== (initial?.language ?? "") ||
    title !== (initial?.title ?? "") ||
    message !== (initial?.message ?? "") ||
    JSON.stringify(tags) !== JSON.stringify(initial?.tags ?? []) ||
    enabled !== (initial?.enabled ?? true)
  );
  const canSave = categoryId && language && title.trim() && message.trim() && (mode === "create" || hasChanges);

  const regularCategories = categories.filter(c => !c.isAutoGreeting);
  const isAutoMode = isAutoGreeting || categories.find(c => c.id === categoryId)?.isAutoGreeting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(10,10,18,0.5)", fontFamily: "'Poppins', sans-serif" }}
      onMouseDown={e => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="bg-white rounded-[12px] shadow-xl" style={{ width: "512px", maxWidth: "calc(100vw - 48px)", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-0">
          <div className="flex items-center gap-2">
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1F2937" }}>
              {isAutoMode
                ? (mode === "create" ? "Create Auto Greeting" : "Edit Auto Greeting")
                : (mode === "create" ? "Create Reply" : "Edit Reply")}
            </h3>
            {isAutoMode && (
              <Tooltip
                content="Keep it short, friendly, and easy to understand when spoken. Aim for 150–240 characters. Avoid long sentences or complex phrasing."
                position="bottom">
                <Info size={14} style={{ color: "#9CA3AF", cursor: "help" }} />
              </Tooltip>
            )}
          </div>
          <button onClick={onCancel} className="p-1.5 rounded-[6px] hover:bg-[#F3F4F6] transition-all">
            <X size={16} style={{ color: "#6B7280" }} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto flex flex-col gap-4">
          {langChanged && (
            <LangChangeWarning message="Language changed. Please review and update the Title and Message to match the selected language." />
          )}

          {/* Category — only for regular replies */}
          {!isAutoGreeting && (
            <Field label="Category" required error={errors.category}>
              <div className="relative">
                <SelectField value={categoryId} onChange={setCategoryId}>
                  <option value="" disabled>Select category…</option>
                  {regularCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </SelectField>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9CA3AF" }} />
              </div>
            </Field>
          )}

          <Field label="Language" required error={errors.language}>
            <div className="relative">
              <SelectField value={language} onChange={handleLangChange}>
                <option value="" disabled>Select language…</option>
                {SUPPORTED_LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </SelectField>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9CA3AF" }} />
            </div>
          </Field>

          <Field label="Title" required error={errors.title}>
            <InputField
              value={title}
              onChange={v => { setTitle(v); if (errors.title) setErrors(e => ({ ...e, title: undefined })); }}
              placeholder="Reply title"
              maxLength={80}
            />
            <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px" }}>{title.length}/80</p>
          </Field>

          <Field label="Message" required error={errors.message}>
            <div className="relative">
              <textarea
                value={message}
                onChange={e => { setMessage(e.target.value); if (errors.message) setErrors(er => ({ ...er, message: undefined })); }}
                maxLength={240}
                rows={4}
                placeholder="Reply message"
                className="w-full px-3 py-2 rounded-[8px] border border-[#D1D5DB] resize-none transition-colors"
                style={{ fontSize: "13px", color: "#374151", outline: "none" }}
                onFocus={e => (e.target.style.borderColor = "#4023FF")}
                onBlur={e => (e.target.style.borderColor = "#D1D5DB")}
              />
              <span style={{ position: "absolute", bottom: "8px", right: "10px", fontSize: "11px", color: "#9CA3AF", pointerEvents: "none" }}>
                {message.length}/240
              </span>
            </div>
          </Field>

          {/* Tags — not shown for Auto Greetings */}
          {!isAutoMode && (
            <Field label="Tags">
              <TagInput tags={tags} onChange={setTags} allTags={allTags} />
              <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px" }}>
                Press Enter or comma to add. Lowercase normalized.
              </p>
            </Field>
          )}

          {/* Status — not shown for Auto Greetings */}
          {!isAutoMode && (
            <div className="flex items-center justify-between py-1">
              <div>
                <div style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>Status</div>
                <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
                  {enabled ? "Published — visible to agents" : "Inactive — hidden from agents"}
                </div>
              </div>
              <Toggle checked={enabled} onChange={() => setEnabled(v => !v)} />
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 pb-6 pt-2 border-t border-[#F3F4F6]">
          <button onClick={onCancel} type="button"
            className="px-4 py-2 rounded-[8px] border border-[#E5E7EB] hover:bg-[#F3F4F6] transition-all"
            style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>
            Cancel
          </button>
          <button onClick={handleSubmit as unknown as React.MouseEventHandler}
            disabled={!canSave}
            className="px-4 py-2 rounded-[8px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF", background: "#4023FF" }}
            onMouseEnter={e => { if (canSave) e.currentTarget.style.background = "#3419cc"; }}
            onMouseLeave={e => (e.currentTarget.style.background = "#4023FF")}>
            {mode === "create" ? (isAutoMode ? "Create Greeting" : "Create Reply") : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Bulk Upload Modal ────────────────────────────────────────────────────────

function BulkUploadModal({
  file, onConfirm, onCancel,
}: {
  file: File; onConfirm: (count: number) => void; onCancel: () => void;
}) {
  const [parsed, setParsed] = useState<{ valid: number; invalid: number; errors: string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        const rows = Array.isArray(json) ? json : [];
        let valid = 0;
        const errors: string[] = [];
        rows.forEach((r: Record<string, unknown>, i: number) => {
          const missing = ["category", "language", "title", "message"].filter(f => !r[f]);
          if (missing.length > 0) {
            errors.push(`Row ${i + 1}: missing ${missing.join(", ")}`);
          } else {
            valid++;
          }
        });
        setParsed({ valid, invalid: errors.length, errors });
      } catch {
        setParsed({ valid: 0, invalid: 1, errors: ["Invalid JSON format"] });
      }
      setLoading(false);
    };
    reader.readAsText(file);
  }, [file]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(10,10,18,0.5)", fontFamily: "'Poppins', sans-serif" }}
      onMouseDown={e => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="bg-white rounded-[12px] shadow-xl p-6" style={{ width: "448px", maxWidth: "calc(100vw - 48px)" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1F2937", marginBottom: "12px" }}>Upload Replies</h3>
        {loading ? (
          <p style={{ fontSize: "13px", color: "#9CA3AF" }}>Parsing file…</p>
        ) : (
          <>
            <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: "1.6", marginBottom: "12px" }}>
              This will add all valid replies from your file to the library. Existing replies won't be overwritten.
            </p>
            <div className="mb-4 px-3 py-2.5 rounded-[8px] border border-[#E5E7EB]"
              style={{ background: "#F9FAFB" }}>
              <p style={{ fontSize: "13px", color: "#374151" }}>
                <strong>{parsed?.valid}</strong> valid {parsed?.valid === 1 ? "reply" : "replies"} found
                {parsed?.invalid ? <span style={{ color: "#DC2626" }}> · {parsed.invalid} invalid</span> : ""}
              </p>
              {parsed?.errors && parsed.errors.length > 0 && (
                <div className="mt-2 max-h-[100px] overflow-y-auto">
                  {parsed.errors.map((err, i) => (
                    <p key={i} style={{ fontSize: "11px", color: "#DC2626" }}>{err}</p>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onCancel} className="px-4 py-2 rounded-[8px] border border-[#E5E7EB] hover:bg-[#F3F4F6] transition-all"
            style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>
            Cancel
          </button>
          <button
            onClick={() => onConfirm(parsed?.valid ?? 0)}
            disabled={!parsed || parsed.valid === 0}
            className="px-4 py-2 rounded-[8px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF", background: "#4023FF" }}>
            Upload {parsed?.valid ? `${parsed.valid} ${parsed.valid === 1 ? "Reply" : "Replies"}` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Export Modal ─────────────────────────────────────────────────────────────

function ExportModal({ count, onConfirm, onCancel }: { count: number; onConfirm: () => void; onCancel: () => void }) {
  return (
    <ConfirmModal
      title="Export Replies"
      body={`This will download all visible replies (${count}) as a JSON file.`}
      confirmLabel="Export"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

// ─── Category List (Left Panel) ───────────────────────────────────────────────

function CategoryPanel({
  categories,
  selectedId,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  onToggle,
  replyCounts,
}: {
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
  onToggle: (cat: Category) => void;
  replyCounts: Record<string, number>;
}) {
  const [hoverMenu, setHoverMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setHoverMenu(null);
      }
    }
    if (hoverMenu) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [hoverMenu]);

  return (
    <div className="flex flex-col h-full" style={{ width: 240, background: "#FFFFFF", borderRight: "1px solid #E5E7EB" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#E5E7EB]">
        <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
          Categories
        </span>
        <Tooltip content="Create Category" position="right" compact>
          <button
            onClick={onAdd}
            className="w-7 h-7 rounded-[6px] flex items-center justify-center transition-all hover:bg-[rgba(64,35,255,0.08)]"
            style={{ color: "#4023FF" }}>
            <Plus size={16} />
          </button>
        </Tooltip>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-1.5">
        {categories.map(cat => {
          const isSelected = cat.id === selectedId;
          const count = replyCounts[cat.id] ?? 0;
          return (
            // Outer wrapper: horizontal padding creates the "inset pill" margin
            <div key={cat.id} className="group relative px-2 py-[2px]">

              {/* ── Pill row ── */}
              <div
                onClick={() => onSelect(cat.id)}
                className="flex items-center gap-3 cursor-pointer transition-all rounded-[8px]"
                style={{
                  background: isSelected ? "rgba(64,35,255,0.08)" : "transparent",
                  borderLeft: isSelected ? "3px solid #4023FF" : "3px solid transparent",
                  padding: "8px 10px",
                  paddingLeft: isSelected ? "9px" : "12px",
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#F9FAFB"; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
              >
                {/* Toggle — not for auto greetings */}
                {!cat.isAutoGreeting ? (
                  <div onClick={e => { e.stopPropagation(); onToggle(cat); }} className="flex-shrink-0">
                    <TinyToggle checked={cat.enabled} onChange={() => onToggle(cat)} />
                  </div>
                ) : (
                  <div style={{ width: 26, flexShrink: 0 }} />
                )}

                {/* Name + team count — stacked vertically */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {cat.isAutoGreeting && (
                      <Tooltip content="This greeting is played automatically at the start of each call" position="right" compact>
                        <RefreshCw size={11} style={{ color: "#4023FF", flexShrink: 0 }} />
                      </Tooltip>
                    )}
                    <Tooltip content={`Language: ${getLangLabel(cat.language)}`} position="right" compact>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: isSelected ? 600 : 400,
                          color: isSelected ? "#4023FF" : "#374151",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          display: "block",
                        }}
                      >
                        {cat.name}
                      </span>
                    </Tooltip>
                  </div>
                  {/* Team count — always visible, inside the pill */}
                  <div style={{ fontSize: "10px", color: "#9CA3AF", marginTop: "2px", lineHeight: 1 }}>
                    {cat.assignedTeams.length} {cat.assignedTeams.length === 1 ? "team" : "teams"}
                  </div>
                </div>

                {/* Right slot: count badge ↔ ••• swap on hover */}
                <div
                  className="relative flex-shrink-0 flex items-center justify-center"
                  style={{ width: "28px", height: "20px" }}
                  ref={hoverMenu === cat.id ? menuRef : undefined}
                >
                  {/* Count badge — pill shaped, fades out on hover (regular categories only) */}
                  <span
                    className={`absolute inset-0 flex items-center justify-center rounded-full transition-opacity ${!cat.isAutoGreeting ? "group-hover:opacity-0" : ""}`}
                    style={{ fontSize: "10px", fontWeight: 600, color: "#6B7280", background: "#F3F4F6" }}
                  >
                    {count}
                  </span>

                  {/* ••• button — fades in on hover, replaces badge */}
                  {!cat.isAutoGreeting && (
                    <>
                      <button
                        onClick={e => { e.stopPropagation(); setHoverMenu(hoverMenu === cat.id ? null : cat.id); }}
                        className="absolute inset-0 flex items-center justify-center rounded-[4px] hover:bg-[#E5E7EB] opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: "#6B7280" }}
                      >
                        <MoreHorizontal size={14} />
                      </button>

                      {/* Dropdown — relative to this container */}
                      {hoverMenu === cat.id && (
                        <div
                          className="absolute right-0 top-full mt-1 bg-white border border-[#E5E7EB] rounded-[8px] shadow-lg z-30 overflow-hidden"
                          style={{ minWidth: "120px" }}
                        >
                          <button
                            onClick={e => { e.stopPropagation(); setHoverMenu(null); onEdit(cat); }}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#F8F8FA] transition-all text-left"
                            style={{ fontSize: "13px", color: "#374151" }}
                          >
                            <Pencil size={13} style={{ color: "#6B7280" }} />
                            Edit
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); setHoverMenu(null); onDelete(cat); }}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#FEF2F2] transition-all text-left"
                            style={{ fontSize: "13px", color: "#DC2626" }}
                          >
                            <Trash2 size={13} />
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Replies Table (Right Panel) ──────────────────────────────────────────────

function RepliesTable({
  replies,
  category,
  sortBy,
  showUseCount,
  searchQuery,
  allCategories,
  isSearchMode,
  onToggleReply,
  onEditReply,
  onDeleteReply,
}: {
  replies: Reply[];
  category: Category | undefined;
  sortBy: SortOption;
  showUseCount: boolean;
  searchQuery: string;
  allCategories: Category[];
  isSearchMode: boolean;
  onToggleReply: (reply: Reply) => void;
  onEditReply: (reply: Reply) => void;
  onDeleteReply: (reply: Reply) => void;
}) {
  const isAuto = category?.isAutoGreeting;

  // Sort
  const sorted = [...replies].sort((a, b) => {
    if (sortBy === "title-asc") return a.title.localeCompare(b.title);
    if (sortBy === "title-desc") return b.title.localeCompare(a.title);
    if (sortBy === "most-used") return b.useCount - a.useCount;
    if (sortBy === "least-used") return a.useCount - b.useCount;
    return 0;
  });

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px]">
        {isSearchMode ? (
          <>
            <p style={{ fontSize: "14px", color: "#374151", fontWeight: 500, marginBottom: "4px" }}>No results found.</p>
            <p style={{ fontSize: "13px", color: "#9CA3AF" }}>Try searching by title, message, or use # to search tags.</p>
          </>
        ) : (
          <p style={{ fontSize: "13px", color: "#9CA3AF" }}>
            No replies in this category yet. Click + Add Reply to create one.
          </p>
        )}
      </div>
    );
  }

  // Table header
  const thStyle: React.CSSProperties = {
    fontSize: "11px", fontWeight: 500, color: "#6B7280",
    textTransform: "uppercase", letterSpacing: "0.04em",
    padding: "10px 14px", textAlign: "left",
    background: "#F9FAFB", borderBottom: "1px solid #E5E7EB",
    whiteSpace: "nowrap",
  };

  return (
    <div className="w-full">
      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {!isAuto && <th style={{ ...thStyle, width: "52px" }}>Status</th>}
            <th style={{ ...thStyle }}>Title</th>
            <th style={{ ...thStyle }}>Message</th>
            {!isAuto && <th style={{ ...thStyle, width: "180px" }}>Tags</th>}
            {isSearchMode && <th style={{ ...thStyle, width: "140px" }}>Category</th>}
            {!isAuto && showUseCount && <th style={{ ...thStyle, width: "100px" }}>Use Count</th>}
            <th style={{ ...thStyle, width: "72px" }}></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((reply) => {
            const replyCategory = allCategories.find(c => c.id === reply.categoryId);
            const deleteDisabled = isAuto && (category?.assignedTeams.length ?? 0) > 0;
            return (
              <tr
                key={reply.id}
                style={{
                  borderBottom: "1px solid #F3F4F6",
                  background: "#FFFFFF",
                  opacity: !isAuto && !reply.enabled ? 0.55 : 1,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#FAFAFA")}
                onMouseLeave={e => (e.currentTarget.style.background = "#FFFFFF")}
              >
                {/* Status toggle */}
                {!isAuto && (
                  <td style={{ padding: "12px 14px", verticalAlign: "middle" }}>
                    <TinyToggle checked={reply.enabled} onChange={() => onToggleReply(reply)} />
                  </td>
                )}

                {/* Title */}
                <td style={{ padding: "12px 14px", verticalAlign: "top", minWidth: "180px", maxWidth: "280px" }}>
                  <Tooltip content={`Language: ${getLangLabel(reply.language)}`} position="top" compact>
                    <span style={{ fontSize: "13px", fontWeight: 500, color: "#1F2937", cursor: "default" }}>
                      {isSearchMode ? highlightText(reply.title, searchQuery.replace(/^#/, "")) : reply.title}
                    </span>
                  </Tooltip>
                </td>

                {/* Message */}
                <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                  <span style={{ fontSize: "13px", color: "#374151", lineHeight: "1.6" }}>
                    {isSearchMode ? highlightText(reply.message, searchQuery.replace(/^#/, "")) : reply.message}
                  </span>
                </td>

                {/* Tags */}
                {!isAuto && (
                  <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                    {reply.tags.length > 0 ? (
                      <TagList tags={reply.tags} />
                    ) : (
                      <span style={{ fontSize: "12px", color: "#D1D5DB" }}>—</span>
                    )}
                  </td>
                )}

                {/* Category chip (search mode) */}
                {isSearchMode && (
                  <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                    <span
                      className="px-2 py-0.5 rounded-[4px]"
                      style={{ fontSize: "11px", fontWeight: 500, color: "#6B7280", background: "#F3F4F6", whiteSpace: "nowrap" }}>
                      {replyCategory?.name ?? "—"}
                    </span>
                  </td>
                )}

                {/* Use Count */}
                {!isAuto && showUseCount && (
                  <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: reply.useCount > 0 ? "#374151" : "#D1D5DB",
                      }}>
                      {reply.useCount}
                    </span>
                  </td>
                )}

                {/* Actions */}
                <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditReply(reply)}
                      className="p-1.5 rounded-[6px] hover:bg-[rgba(64,35,255,0.08)] transition-all"
                      title="Edit reply">
                      <Pencil size={13} style={{ color: "#4023FF" }} />
                    </button>
                    {deleteDisabled ? (
                      <Tooltip
                        content="Cannot delete a greeting while it is assigned to teams."
                        position="top"
                        compact>
                        <span className="p-1.5 rounded-[6px] opacity-30 cursor-not-allowed inline-flex">
                          <Trash2 size={13} style={{ color: "#DC2626" }} />
                        </span>
                      </Tooltip>
                    ) : (
                      <button
                        onClick={() => onDeleteReply(reply)}
                        className="p-1.5 rounded-[6px] hover:bg-[#FEF2F2] transition-all"
                        title="Delete reply">
                        <Trash2 size={13} style={{ color: "#DC2626" }} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


// ─── Stats Banner (Phase II — mocked data preview) ───────────────────────────
// PHASE II — connect to backend analytics endpoint when available.
// All values below are hardcoded placeholders for stakeholder review only.

const STATS_MOCK = [
  {
    label: "Reply Adoption Rate",
    value: "73%",
    subtext: "of sessions used at least one reply",
    icon: TrendingUp,
    iconColor: "#10B981",
  },
  {
    label: "Top Category",
    value: "Account Verification",
    subtext: "most used this week",
    icon: Star,
    iconColor: "#F59E0B",
  },
  {
    label: "Most Active Team",
    value: "Alpha",
    subtext: "highest reply usage",
    icon: Users,
    iconColor: "#4023FF",
  },
  {
    label: "Unused Replies",
    value: "8",
    subtext: "no uses in the last 30 days",
    icon: AlertTriangle,
    iconColor: "#EF4444",
  },
] as const;

function StatsBanner() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      className="mx-6 mb-4 flex-shrink-0 rounded-[10px] border border-[#E5E7EB] bg-white overflow-hidden"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
    >
      {/* ── Header row — always visible, clickable to toggle ── */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-3 transition-colors hover:bg-[#FAFAFA]"
        style={{ borderBottom: expanded ? "1px solid #F3F4F6" : "none" }}
      >
        <div className="flex items-center gap-3">
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
            Reply Stats
          </span>
          <span style={{ fontSize: "12px", color: "#9CA3AF" }}>Last 7 days</span>
          {/* Phase II badge */}
          <span
            style={{
              fontSize: "10px", fontWeight: 600, color: "#A16207",
              background: "#FEFCE8", border: "1px solid #FACC15",
              borderRadius: "4px", padding: "1px 6px",
            }}
          >
            PHASE II
          </span>
        </div>
        <div style={{ color: "#9CA3AF", display: "flex", alignItems: "center" }}>
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </div>
      </button>

      {/* ── Cards + footer — visible when expanded ── */}
      {expanded && (
        <div className="px-5 py-4">
          {/* 4 stat cards */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {STATS_MOCK.map(({ label, value, subtext, icon: Icon, iconColor }) => (
              <div
                key={label}
                className="p-4 rounded-[10px] border border-[#E5E7EB] bg-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: "11px", fontWeight: 500, color: "#9CA3AF" }}>
                    {label}
                  </span>
                  <div
                    className="w-6 h-6 rounded-[6px] flex items-center justify-center flex-shrink-0"
                    style={{ background: `${iconColor}14` }}
                  >
                    <Icon size={13} style={{ color: iconColor }} />
                  </div>
                </div>
                <div
                  style={{
                    fontSize: value.length > 8 ? "15px" : "20px",
                    fontWeight: 600, color: "#1F2937",
                    lineHeight: 1.2, marginBottom: "4px",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}
                >
                  {value}
                </div>
                <div style={{ fontSize: "11px", color: "#9CA3AF", lineHeight: 1.4 }}>
                  {subtext}
                </div>
              </div>
            ))}
          </div>

          {/* Footer link */}
          <div className="flex justify-end">
            <Link
              to="/dashboard"
              style={{ fontSize: "12px", color: "#4023FF", fontWeight: 500, textDecoration: "none" }}
              className="hover:underline"
            >
              See full stats in Dashboard →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Replies Page ────────────────────────────────────────────────────────

export default function Replies() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [replies, setReplies] = useState<Reply[]>(INITIAL_REPLIES);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("auto");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("title-asc");
  const [showUseCount, setShowUseCount] = useState(false);
  const [displayLang, setDisplayLang] = useState("original");
  const { toasts, addToast, dismissToast } = useToasts();

  // ── Dropdowns state ──
  const [showSortDrop, setShowSortDrop] = useState(false);
  const [showColDrop, setShowColDrop] = useState(false);
  const [showLangDrop, setShowLangDrop] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const colRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Modal state ──
  type ModalState =
    | { type: "create-category" }
    | { type: "edit-category"; category: Category }
    | { type: "delete-category"; category: Category }
    | { type: "toggle-off-category"; category: Category }
    | { type: "create-reply" }
    | { type: "edit-reply"; reply: Reply }
    | { type: "delete-reply"; reply: Reply }
    | { type: "bulk-upload"; file: File }
    | { type: "export" }
    | null;

  const [modal, setModal] = useState<ModalState>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (showSortDrop && sortRef.current && !sortRef.current.contains(e.target as Node)) setShowSortDrop(false);
      if (showColDrop && colRef.current && !colRef.current.contains(e.target as Node)) setShowColDrop(false);
      if (showLangDrop && langRef.current && !langRef.current.contains(e.target as Node)) setShowLangDrop(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showSortDrop, showColDrop, showLangDrop]);

  // ── Derived data ──
  const isSearchMode = searchQuery.trim().length > 0;
  const isTagSearch = searchQuery.trim().startsWith("#");
  const effectiveQuery = isTagSearch ? searchQuery.trim().slice(1).toLowerCase() : searchQuery.trim().toLowerCase();

  const replyCounts = Object.fromEntries(
    categories.map(c => [c.id, replies.filter(r => r.categoryId === c.id).length])
  );

  const allTags = [...new Set(replies.flatMap(r => r.tags))];

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  const visibleReplies = isSearchMode
    ? replies.filter(r => {
        if (isTagSearch) return r.tags.some(t => t.includes(effectiveQuery));
        return (
          r.title.toLowerCase().includes(effectiveQuery) ||
          r.message.toLowerCase().includes(effectiveQuery)
        );
      })
    : replies.filter(r => r.categoryId === selectedCategoryId);

  const searchResultCount = isSearchMode ? visibleReplies.length : 0;

  const currentDisplayLangLabel = DISPLAY_LANGUAGES.find(l => l.code === displayLang)?.label ?? "Original";

  // ── Category actions ──
  function handleCreateCategory(data: CategoryFormData) {
    const newCat: Category = {
      id: generateId(),
      name: data.name,
      language: data.language,
      description: data.description,
      assignedTeams: data.assignedTeams,
      enabled: true,
    };
    setCategories(cs => [...cs, newCat]);
    setModal(null);
    addToast("Category created", "success");
  }

  function handleEditCategory(data: CategoryFormData) {
    if (modal?.type !== "edit-category") return;
    setCategories(cs => cs.map(c =>
      c.id === modal.category.id
        ? { ...c, name: data.name, language: data.language, description: data.description, assignedTeams: data.assignedTeams }
        : c
    ));
    setModal(null);
    addToast("Category updated successfully", "success");
  }

  function handleDeleteCategory() {
    if (modal?.type !== "delete-category") return;
    const id = modal.category.id;
    setCategories(cs => cs.filter(c => c.id !== id));
    setReplies(rs => rs.filter(r => r.categoryId !== id));
    if (selectedCategoryId === id) {
      setSelectedCategoryId(categories.find(c => c.id !== id)?.id ?? "auto");
    }
    setModal(null);
    addToast("Category deleted successfully", "success");
  }

  function handleToggleCategory(cat: Category) {
    if (!cat.enabled) {
      // Turning ON — no confirmation
      setCategories(cs => cs.map(c => c.id === cat.id ? { ...c, enabled: true } : c));
    } else {
      // Turning OFF — show confirmation with team count
      setModal({ type: "toggle-off-category", category: cat });
    }
  }

  function confirmToggleOff() {
    if (modal?.type !== "toggle-off-category") return;
    setCategories(cs => cs.map(c => c.id === modal.category.id ? { ...c, enabled: false } : c));
    setModal(null);
  }

  // ── Reply actions ──
  function handleCreateReply(data: ReplyFormData) {
    const newReply: Reply = {
      id: generateId(),
      categoryId: data.categoryId,
      language: data.language,
      title: data.title,
      message: data.message,
      tags: data.tags,
      enabled: data.enabled,
      useCount: 0,
    };
    setReplies(rs => [...rs, newReply]);
    setModal(null);
    const cat = categories.find(c => c.id === data.categoryId);
    if (cat?.isAutoGreeting) addToast("Auto greeting message created", "success");
    else addToast("Reply created", "success");
  }

  function handleEditReply(data: ReplyFormData) {
    if (modal?.type !== "edit-reply") return;
    setReplies(rs => rs.map(r =>
      r.id === modal.reply.id
        ? { ...r, ...data }
        : r
    ));
    setModal(null);
    const cat = categories.find(c => c.id === data.categoryId);
    if (cat?.isAutoGreeting) addToast("Greeting message saved", "success");
    else addToast("Reply updated successfully", "success");
  }

  function handleDeleteReply() {
    if (modal?.type !== "delete-reply") return;
    setReplies(rs => rs.filter(r => r.id !== modal.reply.id));
    setModal(null);
    const cat = categories.find(c => c.id === modal.reply.categoryId);
    if (cat?.isAutoGreeting) addToast("Greeting deleted successfully", "success");
    else addToast("Reply deleted successfully", "success");
  }

  function handleToggleReply(reply: Reply) {
    setReplies(rs => rs.map(r => r.id === reply.id ? { ...r, enabled: !r.enabled } : r));
  }

  // ── Bulk Upload ──
  function handleBulkUploadConfirm(count: number) {
    setModal(null);
    addToast(`${count} ${count === 1 ? "reply" : "replies"} uploaded successfully`, "success");
  }

  // ── Export ──
  function handleExport() {
    const exportData = visibleReplies.map(r => ({
      title: r.title,
      message: r.message,
      language: r.language,
      category: categories.find(c => c.id === r.categoryId)?.name ?? "",
      tags: r.tags,
      status: r.enabled ? "on" : "off",
    }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `replies-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setModal(null);
    addToast("Replies exported successfully", "success");
  }

  // ── Display language ──
  function handleDisplayLangChange(code: string) {
    setDisplayLang(code);
    setShowLangDrop(false);
    // PENDING: actual translation logic — UI state only for now
    addToast("Display language updated", "success");
  }

  const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: "title-asc", label: "Title A–Z" },
    { value: "title-desc", label: "Title Z–A" },
    { value: "most-used", label: "Most Used" },
    { value: "least-used", label: "Least Used" },
  ];

  const currentSortLabel = SORT_OPTIONS.find(s => s.value === sortBy)?.label ?? "Sort";

  return (
    <div className="flex h-screen" style={{ fontFamily: "'Poppins', sans-serif", background: "#F9FAFB" }}>
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">

        {/* ── Page Header ── */}
        <div className="px-6 pt-5 pb-4 flex-shrink-0">
          <h1 className="m-0" style={{ fontSize: "20px", fontWeight: 600, color: "#1F2937" }}>Replies</h1>
          <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "2px" }}>Configure preset replies</p>
          <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "1px" }}>
            Create and manage the messages available to agents during conversations.
          </p>
        </div>

        {/* ── Stats Banner — Phase II preview ── */}
        <StatsBanner />

        {/* ── Card Container ── */}
        <div
          className="mx-6 mb-6 flex-1 overflow-hidden flex"
          style={{ background: "#FFFFFF", borderRadius: "10px", border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >

          {/* ── Left Panel: Categories ── */}
          <CategoryPanel
            categories={categories}
            selectedId={selectedCategoryId}
            onSelect={id => { setSelectedCategoryId(id); setSearchQuery(""); }}
            onAdd={() => setModal({ type: "create-category" })}
            onEdit={cat => setModal({ type: "edit-category", category: cat })}
            onDelete={cat => setModal({ type: "delete-category", category: cat })}
            onToggle={handleToggleCategory}
            replyCounts={replyCounts}
          />

          {/* ── Right Panel: Replies ── */}
          <div className="flex flex-col flex-1 overflow-hidden">

          {/* Toolbar */}
          <div className="flex-shrink-0 flex items-center gap-3 px-5 py-3 bg-white border-b border-[#E5E7EB]">
            {/* Panel title + language selector */}
            <div className="flex items-center gap-2 mr-2">
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#1F2937" }}>
                {isSearchMode ? (
                  <span style={{ color: "#6B7280" }}>
                    {searchResultCount} result{searchResultCount !== 1 ? "s" : ""} matching{" "}
                    <strong style={{ color: "#1F2937" }}>"{searchQuery}"</strong>
                  </span>
                ) : (
                  selectedCategory?.name ?? "Replies"
                )}
              </span>

              {/* Language display selector */}
              <div className="relative" ref={langRef}>
                <Tooltip
                  content="Language in which replies are shown. Replies in other languages will be translated automatically."
                  position="bottom"
                  compact>
                  <button
                    onClick={() => setShowLangDrop(v => !v)}
                    className="flex items-center gap-1 px-2 py-1 rounded-[6px] border border-[#E5E7EB] hover:border-[#4023FF] transition-all"
                    style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", background: "#FAFAFA" }}>
                    {displayLang === "original" ? "ORIG" : displayLang.toUpperCase()}
                    <ChevronDown size={10} />
                  </button>
                </Tooltip>
                {showLangDrop && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-[#E5E7EB] rounded-[8px] shadow-lg z-[250] overflow-hidden"
                    style={{ minWidth: "180px" }}>
                    {DISPLAY_LANGUAGES.map(l => (
                      <button
                        key={l.code}
                        onClick={() => handleDisplayLangChange(l.code)}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#F8F8FA] transition-all text-left"
                        style={{ fontSize: "13px", color: "#374151" }}>
                        {l.label}
                        {displayLang === l.code && <Check size={13} style={{ color: "#4023FF" }} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Search */}
            <div className="relative flex-1" style={{ maxWidth: "360px" }}>
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search replies… (use # to search tags)"
                className="w-full pl-8 pr-8 py-2 rounded-[8px] border border-[#E5E7EB] bg-white transition-colors"
                style={{ fontSize: "13px", color: "#374151", outline: "none" }}
                onFocus={e => (e.target.style.borderColor = "#4023FF")}
                onBlur={e => (e.target.style.borderColor = "#E5E7EB")}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity">
                  <X size={13} style={{ color: "#9CA3AF" }} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 ml-auto flex-shrink-0">
              {/* Sort dropdown */}
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setShowSortDrop(v => !v)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-[8px] border border-[#E5E7EB] hover:border-[#4023FF] bg-white transition-all"
                  style={{ fontSize: "12px", fontWeight: 500, color: "#374151" }}>
                  <span>{currentSortLabel}</span>
                  <ChevronDown size={12} style={{ color: "#9CA3AF" }} />
                </button>
                {showSortDrop && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-[#E5E7EB] rounded-[8px] shadow-lg z-[250] overflow-hidden"
                    style={{ minWidth: "160px" }}>
                    {SORT_OPTIONS.map(opt => (
                      <button key={opt.value}
                        onClick={() => { setSortBy(opt.value); setShowSortDrop(false); }}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#F8F8FA] transition-all text-left"
                        style={{ fontSize: "13px", color: sortBy === opt.value ? "#4023FF" : "#374151", fontWeight: sortBy === opt.value ? 500 : 400 }}>
                        {opt.label}
                        {sortBy === opt.value && <Check size={13} style={{ color: "#4023FF" }} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Columns dropdown */}
              {!selectedCategory?.isAutoGreeting && (
                <div className="relative" ref={colRef}>
                  <button
                    onClick={() => setShowColDrop(v => !v)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-[8px] border border-[#E5E7EB] hover:border-[#4023FF] bg-white transition-all"
                    style={{ fontSize: "12px", fontWeight: 500, color: "#374151" }}>
                    <Columns2 size={13} />
                    Columns
                    <ChevronDown size={12} style={{ color: "#9CA3AF" }} />
                  </button>
                  {showColDrop && (
                    <div className="absolute top-full right-0 mt-1 bg-white border border-[#E5E7EB] rounded-[8px] shadow-lg z-[250] overflow-hidden"
                      style={{ minWidth: "180px" }}>
                      <button
                        onClick={() => { setShowUseCount(v => !v); setShowColDrop(false); }}
                        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[#F8F8FA] transition-all text-left"
                        style={{ fontSize: "13px", color: "#374151" }}>
                        Use Count
                        <div
                          className="w-4 h-4 rounded-[4px] border flex items-center justify-center"
                          style={{ background: showUseCount ? "#4023FF" : "#FFFFFF", borderColor: showUseCount ? "#4023FF" : "#D1D5DB" }}>
                          {showUseCount && <Check size={10} style={{ color: "#FFFFFF" }} />}
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Add Reply */}
              <button
                onClick={() => setModal({ type: "create-reply" })}
                className="flex items-center gap-1.5 px-3 py-2 rounded-[8px] transition-all"
                style={{ fontSize: "12px", fontWeight: 600, color: "#FFFFFF", background: "#4023FF" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#3419cc")}
                onMouseLeave={e => (e.currentTarget.style.background = "#4023FF")}>
                <Plus size={13} />
                Add Reply
              </button>

              {/* Bulk Upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-[8px] border border-[#E5E7EB] hover:border-[#4023FF] bg-white transition-all"
                style={{ fontSize: "12px", fontWeight: 500, color: "#374151" }}>
                <Upload size={13} style={{ color: "#6B7280" }} />
                Upload Bulk
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) setModal({ type: "bulk-upload", file });
                  e.target.value = "";
                }}
              />

              {/* Export */}
              <button
                onClick={() => setModal({ type: "export" })}
                className="flex items-center gap-1.5 px-3 py-2 rounded-[8px] border border-[#E5E7EB] hover:border-[#4023FF] bg-white transition-all"
                style={{ fontSize: "12px", fontWeight: 500, color: "#374151" }}>
                <Download size={13} style={{ color: "#6B7280" }} />
                Export
              </button>
            </div>
          </div>

          {/* Table area */}
          <div className="flex-1 overflow-y-auto bg-white">
            <RepliesTable
              replies={visibleReplies}
              category={selectedCategory}
              sortBy={sortBy}
              showUseCount={showUseCount}
              searchQuery={searchQuery}
              allCategories={categories}
              isSearchMode={isSearchMode}
              onToggleReply={handleToggleReply}
              onEditReply={reply => setModal({ type: "edit-reply", reply })}
              onDeleteReply={reply => setModal({ type: "delete-reply", reply })}
            />
          </div>
        </div>
        </div>{/* ── end Card Container ── */}
      </main>

      {/* ── Modals ── */}

      {modal?.type === "create-category" && (
        <CategoryModal mode="create" onSave={handleCreateCategory} onCancel={() => setModal(null)} />
      )}
      {modal?.type === "edit-category" && (
        <CategoryModal mode="edit" initial={modal.category} onSave={handleEditCategory} onCancel={() => setModal(null)} />
      )}
      {modal?.type === "delete-category" && (
        <ConfirmModal
          title="Delete this category?"
          body="This will permanently remove the category and all its replies. Agents will no longer see or use them during calls."
          confirmLabel="Delete Category"
          onConfirm={handleDeleteCategory}
          onCancel={() => setModal(null)}
          destructive
        />
      )}
      {modal?.type === "toggle-off-category" && (
        <ConfirmModal
          title="Turn off this category?"
          body={
            <>
              This category is currently active in{" "}
              <strong>{modal.category.assignedTeams.length} {modal.category.assignedTeams.length === 1 ? "team" : "teams"}</strong>.
              {" "}Turning it off will hide it from agents in all those teams immediately.
            </>
          }
          confirmLabel="Turn Off"
          onConfirm={confirmToggleOff}
          onCancel={() => setModal(null)}
          destructive
        />
      )}
      {modal?.type === "create-reply" && (
        <ReplyModal
          mode="create"
          categories={categories}
          defaultCategoryId={selectedCategoryId}
          isAutoGreeting={selectedCategory?.isAutoGreeting ?? false}
          allTags={allTags}
          onSave={handleCreateReply}
          onCancel={() => setModal(null)}
        />
      )}
      {modal?.type === "edit-reply" && (
        <ReplyModal
          mode="edit"
          initial={modal.reply}
          categories={categories}
          defaultCategoryId={modal.reply.categoryId}
          isAutoGreeting={categories.find(c => c.id === modal.reply.categoryId)?.isAutoGreeting ?? false}
          allTags={allTags}
          onSave={handleEditReply}
          onCancel={() => setModal(null)}
        />
      )}
      {modal?.type === "delete-reply" && (
        <ConfirmModal
          title="Delete this reply?"
          body={
            categories.find(c => c.id === modal.reply.categoryId)?.isAutoGreeting
              ? "Delete Greeting Message? This action cannot be undone."
              : "Once deleted, agents won't be able to use this reply anymore. This action can't be undone."
          }
          confirmLabel={
            categories.find(c => c.id === modal.reply.categoryId)?.isAutoGreeting
              ? "Delete"
              : "Delete Reply"
          }
          onConfirm={handleDeleteReply}
          onCancel={() => setModal(null)}
          destructive
        />
      )}
      {modal?.type === "bulk-upload" && (
        <BulkUploadModal
          file={modal.file}
          onConfirm={handleBulkUploadConfirm}
          onCancel={() => setModal(null)}
        />
      )}
      {modal?.type === "export" && (
        <ExportModal
          count={visibleReplies.length}
          onConfirm={handleExport}
          onCancel={() => setModal(null)}
        />
      )}

      {/* ── Toasts ── */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
