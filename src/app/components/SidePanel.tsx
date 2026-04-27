import { ReactNode, useEffect, useState } from "react";
import { X } from "lucide-react";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}

export function SidePanel({ isOpen, onClose, title, children, width = "480px" }: SidePanelProps) {
  const [mounted, setMounted] = useState(isOpen);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // pequeño delay para que el browser pinte el estado inicial antes de la transición
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998]"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 bg-white shadow-2xl z-[9999] flex flex-col"
        style={{
          width,
          transform: visible ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          borderTopLeftRadius: "8px",
          borderBottomLeftRadius: "8px",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3F4F6]">
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#1F2937", margin: 0 }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-[6px] flex items-center justify-center hover:bg-[#F9FAFB] transition-colors"
            style={{ border: "none", background: "transparent", cursor: "pointer" }}
          >
            <X size={20} style={{ color: "#6B7280" }} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}
