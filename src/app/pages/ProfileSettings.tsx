import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "react-router";
import { PageLayout } from "../components/PageLayout";
import { useToasts, ToastContainer } from "../components/Toast";

// ─── Input ────────────────────────────────────────────────────────────────────

const inputBase: React.CSSProperties = {
  fontSize: "13px",
  color: "#1F2937",
  border: "1px solid #D1D5DB",
  borderRadius: "8px",
  padding: "8px 12px",
  width: "100%",
  outline: "none",
  background: "#FFFFFF",
  fontFamily: "'Poppins', sans-serif",
};

const inputReadOnly: React.CSSProperties = {
  ...inputBase,
  background: "#F3F4F6",
  color: "#6B7280",
  cursor: "default",
  borderColor: "#E5E7EB",
  opacity: 1,
};

const inputDisabled: React.CSSProperties = {
  ...inputBase,
  background: "#F9FAFB",
  color: "#6B7280",
  cursor: "not-allowed",
  opacity: 0.85,
};

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="bg-white rounded-[10px] border border-[#E5E7EB] p-6"
      style={{ marginBottom: "16px" }}
    >
      <div style={{ marginBottom: "20px" }}>
        <h2
          style={{ fontSize: "14px", fontWeight: 600, color: "#1F2937", margin: 0 }}
        >
          {title}
        </h2>
        <p
          style={{
            fontSize: "12px",
            color: "#6B7280",
            margin: "4px 0 0 0",
          }}
        >
          {subtitle}
        </p>
      </div>
      {children}
    </div>
  );
}

// ─── Label ────────────────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        fontSize: "12px",
        fontWeight: 500,
        color: "#374151",
        display: "block",
        marginBottom: "6px",
      }}
    >
      {children}
    </label>
  );
}

// ─── Section 1: Personal Information ─────────────────────────────────────────
// QA: append ?profileErr=1 to the URL to preview the error state.

function PersonalInformation() {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const err =
      typeof window !== "undefined" && window.location.search.includes("profileErr=1");
    const t = window.setTimeout(() => setStatus(err ? "error" : "ready"), 650);
    return () => clearTimeout(t);
  }, []);

  return (
    <SectionCard title="Personal Information" subtitle="Your account information">
      {status === "loading" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {["First Name", "Last Name", "Email"].map((label) => (
            <div key={label}>
              <FieldLabel>{label}</FieldLabel>
              <div
                style={{
                  height: "36px",
                  borderRadius: "8px",
                  background: "linear-gradient(90deg, #F3F4F6 0%, #E5E7EB 50%, #F3F4F6 100%)",
                  backgroundSize: "200% 100%",
                  animation: "profile-shimmer 1.2s ease-in-out infinite",
                }}
              />
            </div>
          ))}
          <style>{`@keyframes profile-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
        </div>
      )}

      {status === "error" && (
        <p style={{ fontSize: "13px", color: "#DC2626", margin: 0, lineHeight: 1.5 }}>
          Couldn&apos;t load your profile information. Please refresh the page.
        </p>
      )}

      {status === "ready" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <FieldLabel>First Name</FieldLabel>
            <input
              style={inputReadOnly}
              value="Morgan"
              readOnly
              tabIndex={-1}
              aria-readonly="true"
              onFocus={(e) => e.target.blur()}
            />
          </div>
          <div>
            <FieldLabel>Last Name</FieldLabel>
            <input
              style={inputReadOnly}
              value="Vance"
              readOnly
              tabIndex={-1}
              aria-readonly="true"
              onFocus={(e) => e.target.blur()}
            />
          </div>
          <div>
            <FieldLabel>Email</FieldLabel>
            <input
              style={inputReadOnly}
              value="morgan.vance@nexbridge.com"
              readOnly
              tabIndex={-1}
              aria-readonly="true"
              onFocus={(e) => e.target.blur()}
            />
          </div>
          <p
            style={{
              fontSize: "12px",
              color: "#6B7280",
              margin: "4px 0 0 0",
            }}
          >
            To update your name or email, contact your Admin.
          </p>
        </div>
      )}
    </SectionCard>
  );
}

// ─── Section 2: Update Password ───────────────────────────────────────────────
// Prototype QA: current password "wrong" → "Incorrect password."; "!api!" → error toast.

interface PasswordReq {
  label: string;
  test: (v: string) => boolean;
}

const PASSWORD_REQS: PasswordReq[] = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "At least one uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "At least one number", test: (v) => /[0-9]/.test(v) },
  {
    label: "At least one special character (!@#$%^&*)",
    test: (v) => /[!@#$%^&*]/.test(v),
  },
];

function PasswordField({
  label,
  value,
  onChange,
  disabled,
  error,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder ?? ""}
          style={{
            ...(disabled ? inputDisabled : inputBase),
            paddingRight: "40px",
          }}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          disabled={disabled}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: disabled ? "not-allowed" : "pointer",
            padding: "0",
            color: "#9CA3AF",
            display: "flex",
            alignItems: "center",
          }}
          tabIndex={-1}
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {error && (
        <p style={{ fontSize: "12px", color: "#EF4444", margin: "4px 0 0 0" }}>
          {error}
        </p>
      )}
    </div>
  );
}

function UpdatePassword({ addToast }: { addToast: (msg: string, type: "success" | "error") => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentError, setCurrentError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const reqs = PASSWORD_REQS.map((r) => ({ ...r, met: r.test(next) }));
  const allMet = reqs.every((r) => r.met);
  const canSubmit = allMet && current.length > 0 && confirm.length > 0 && !submitting;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setCurrentError("");
    setConfirmError("");

    if (next !== confirm) {
      setConfirmError("Passwords don't match.");
      return;
    }

    setSubmitting(true);

    window.setTimeout(() => {
      setSubmitting(false);
      /* Prototype: current password "wrong" → inline error; "!api!" → toast error */
      if (current === "wrong") {
        setCurrentError("Incorrect password.");
        return;
      }
      if (current === "!api!") {
        addToast("Couldn't update your password. Please try again.", "error");
        return;
      }
      setCurrent("");
      setNext("");
      setConfirm("");
      addToast("Password updated successfully.", "success");
    }, 800);
  }

  return (
    <SectionCard
      title="Update Password"
      subtitle="Keep your account secure by using a strong password."
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <PasswordField
          label="Current Password"
          value={current}
          onChange={(v) => { setCurrent(v); setCurrentError(""); }}
          disabled={submitting}
          error={currentError}
        />

        <div>
          <PasswordField
            label="New Password"
            value={next}
            onChange={setNext}
            disabled={submitting}
          />
          {/* Requirements */}
          <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {reqs.map((r) => (
              <div
                key={r.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  color: "#374151",
                }}
              >
                <span style={{ width: "18px", flexShrink: 0, textAlign: "center" }} aria-hidden>
                  {next.length === 0 ? "\u00a0" : r.met ? "\u2705" : "\u274c"}
                </span>
                <span>{r.label}</span>
              </div>
            ))}
          </div>
        </div>

        <PasswordField
          label="Confirm New Password"
          value={confirm}
          onChange={(v) => { setConfirm(v); setConfirmError(""); }}
          disabled={submitting}
          error={confirmError}
        />

        <div>
          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              background: canSubmit ? "#4023FF" : "#9CA3AF",
              color: "#FFFFFF",
              borderRadius: "8px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              border: "none",
              cursor: canSubmit ? "pointer" : "not-allowed",
              fontFamily: "'Poppins', sans-serif",
              transition: "background 0.15s",
            }}
          >
            {submitting ? "Updating…" : "Update Password"}
          </button>
        </div>
      </form>
    </SectionCard>
  );
}

// ─── Section 3: Display Language ──────────────────────────────────────────────
// QA: ?langErr=1 — first language change simulates save error (param is then cleared).

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "pt", label: "Portuguese" },
  { value: "de", label: "German" },
];

function DisplayLanguage({ addToast }: { addToast: (msg: string, type: "success" | "error") => void }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [lang, setLang] = useState("en");
  const [saving, setSaving] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    const prev = lang;
    if (val === prev) return;
    const simulateFail = searchParams.get("langErr") === "1";
    setLang(val);
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      if (simulateFail) {
        setLang(prev);
        setSearchParams(
          (sp) => {
            sp.delete("langErr");
            return sp;
          },
          { replace: true },
        );
        addToast("Failed to update display language. Please try again.", "error");
        return;
      }
      addToast("Display language updated", "success");
    }, 450);
  }

  return (
    <SectionCard
      title="Display Language"
      subtitle="Choose the language you want to use across the platform."
    >
      <div>
        <FieldLabel>Display Language</FieldLabel>
        <div style={{ position: "relative", maxWidth: "320px" }}>
          <select
            value={lang}
            onChange={handleChange}
            disabled={saving}
            style={{
              ...inputBase,
              appearance: "none",
              WebkitAppearance: "none",
              paddingRight: "36px",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
          <div
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#6B7280",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        {saving && (
          <p style={{ fontSize: "12px", color: "#6B7280", marginTop: "6px" }}>
            Saving…
          </p>
        )}
      </div>
    </SectionCard>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfileSettings() {
  const { toasts, addToast, dismissToast } = useToasts();

  return (
    <PageLayout title="Profile Settings">
      <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "24px", marginTop: "-4px" }}>
        Manage your account information and preferences
      </p>
      <div style={{ maxWidth: "680px" }}>
        <PersonalInformation />
        <UpdatePassword addToast={addToast} />
        <DisplayLanguage addToast={addToast} />
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </PageLayout>
  );
}
