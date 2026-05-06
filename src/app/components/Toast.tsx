import { useState, useCallback } from "react";
import { X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ToastMsg {
  id: string;
  message: string;
  type: "success" | "error";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateToastId() {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToasts() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  const addToast = useCallback((message: string, type: "success" | "error") => {
    const id = generateToastId();
    setToasts((t) => [...t, { id, message, type }]);
    if (type === "success") {
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
    }
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return { toasts, addToast, dismissToast };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastMsg[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 px-4 py-3 rounded-[8px] shadow-lg pointer-events-auto"
          style={{
            background: t.type === "success" ? "#1F2937" : "#DC2626",
            color: "#FFFFFF",
            fontSize: "13px",
            fontWeight: 500,
            minWidth: "280px",
            maxWidth: "420px",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => onDismiss(t.id)}
            className="flex-shrink-0 opacity-60 hover:opacity-100"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
