import { ReactNode, useState } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  compact?: boolean;
}

export function Tooltip({ content, children, position = "top", compact = false }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && content && (
        <div
          className={`absolute z-[9999] ${positionClasses[position]} pointer-events-none`}
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <div
            className="rounded-[8px] shadow-lg"
            style={{
              background: "#1F2937",
              color: "#FFFFFF",
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "16.5px",
              minWidth: compact ? "auto" : "220px",
              maxWidth: compact ? "120px" : "380px",
              whiteSpace: "normal",
              wordWrap: "break-word",
              paddingLeft: "16px",
              paddingRight: "16px",
              paddingTop: "10px",
              paddingBottom: "10px",
            }}
          >
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
