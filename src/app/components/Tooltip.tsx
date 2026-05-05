import { ReactNode, useState, useRef, useCallback } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  compact?: boolean;
}

/**
 * Tooltip — renders at document root level (fixed positioning) to avoid
 * clipping by overflow:hidden containers. 500ms show delay, 0ms hide.
 */
export function Tooltip({ content, children, position = "top", compact = false }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const GAP = 8; // px gap between trigger and tooltip

  const handleMouseEnter = useCallback(() => {
    timerRef.current = setTimeout(() => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      let top = 0;
      let left = 0;

      switch (position) {
        case "top":
          top = rect.top;           // tooltip renders above via transform
          left = rect.left + rect.width / 2;
          break;
        case "bottom":
          top = rect.bottom + GAP;
          left = rect.left + rect.width / 2;
          break;
        case "left":
          top = rect.top + rect.height / 2;
          left = rect.left;         // tooltip renders left via transform
          break;
        case "right":
          top = rect.top + rect.height / 2;
          left = rect.right + GAP;
          break;
      }

      setCoords({ top, left });
      setIsVisible(true);
    }, 500);
  }, [position]);

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsVisible(false);
  }, []);

  // CSS transform per position — anchors the tooltip box to the right edge
  const transformMap: Record<string, string> = {
    top:    `translateX(-50%) translateY(calc(-100% - ${GAP}px))`,
    bottom: "translateX(-50%)",
    left:   `translateX(calc(-100% - ${GAP}px)) translateY(-50%)`,
    right:  "translateY(-50%)",
  };

  return (
    <div
      ref={wrapperRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {isVisible && content && coords && (
        <div
          style={{
            position: "fixed",
            top: coords.top,
            left: coords.left,
            transform: transformMap[position],
            zIndex: 99999,
            pointerEvents: "none",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <div
            className="rounded-[8px] shadow-lg"
            style={{
              background: "#1F2937",
              color: "#FFFFFF",
              fontSize: "13px",
              fontWeight: 400,
              lineHeight: "1.5",
              minWidth: compact ? "auto" : "220px",
              maxWidth: compact ? "160px" : "380px",
              whiteSpace: "normal",
              wordWrap: "break-word",
              paddingLeft: "12px",
              paddingRight: "12px",
              paddingTop: "8px",
              paddingBottom: "8px",
            }}
          >
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
