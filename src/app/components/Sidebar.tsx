import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  type ReactNode,
  type CSSProperties,
} from "react";
import { useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Folder,
  MessageSquare,
  User,
  History,
  LogOut,
} from "lucide-react";
import logoImage from "../../assets/619bbd22cfce479fb2faca904fc9762f8f470fb6.png";
import { Tooltip } from "./Tooltip";
import { SidePanel } from "./SidePanel";

// ─── Mock activity data ───────────────────────────────────────────────────────
// QA error state: sessionStorage.setItem("verbum_activity_fail_next", "1") then open Activity.

type ActionTypeFilter = "all" | "replies" | "categories" | "teams" | "languages" | "account";
type DateRangeFilter = "7days" | "30days" | "custom";

function Em({ children }: { children: ReactNode }) {
  return <span style={{ fontWeight: 600, color: "#3730A3" }}>{children}</span>;
}

function formatActivityTime(d: Date): string {
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

interface ActivityItem {
  id: string;
  kind: Exclude<ActionTypeFilter, "all">;
  at: Date;
  line: ReactNode;
}

/** Prototype “as-of” time — only events on or before this instant appear */
const ACTIVITY_NOW = new Date("2026-05-05T15:42:00");

function startOfRollingDays(now: Date, days: number): Date {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
}

function itemInDateRange(item: ActivityItem, range: DateRangeFilter, now: Date): boolean {
  if (item.at > now) return false;
  if (range === "custom") return true; /* [PENDING] full custom range — for now, all history through “now” */
  const days = range === "7days" ? 7 : 30;
  const start = startOfRollingDays(now, days);
  return item.at >= start;
}

const ACTIVITY_ITEMS: ActivityItem[] = [
  {
    id: "1",
    kind: "teams",
    at: new Date("2026-05-05T15:42:00"),
    line: (
      <>
        <Em>Ana Torres</Em> removed <Em>Carlos Méndez</Em> from <Em>Team Alpha</Em>
      </>
    ),
  },
  {
    id: "2",
    kind: "account",
    at: new Date("2026-05-05T15:42:00"),
    line: <>Password changed</>,
  },
  {
    id: "3",
    kind: "replies",
    at: new Date("2026-05-05T14:15:00"),
    line: (
      <>
        Reply edited · <Em>&quot;Welcome back&quot;</Em> in <Em>Greetings</Em> by <Em>Ana Torres</Em>
      </>
    ),
  },
  {
    id: "4",
    kind: "languages",
    at: new Date("2026-05-05T13:00:00"),
    line: (
      <>
        Language added · <Em>ES-MX</Em> added to <Em>Team Alpha</Em> by <Em>Ana Torres</Em>
      </>
    ),
  },
  {
    id: "5",
    kind: "teams",
    at: new Date("2026-05-04T11:20:00"),
    line: (
      <>
        <Em>Ana Torres</Em> enabled HIPAA compliance on <Em>Team Alpha</Em>
      </>
    ),
  },
  {
    id: "6",
    kind: "account",
    at: new Date("2026-05-04T09:00:00"),
    line: (
      <>
        Display language changed · <Em>English → Spanish</Em>
      </>
    ),
  },
  {
    id: "7",
    kind: "teams",
    at: new Date("2026-05-03T09:05:00"),
    line: (
      <>
        <Em>Ana Torres</Em> renamed team <Em>Team Alpha</Em> to <Em>North Squad</Em>
      </>
    ),
  },
  {
    id: "8",
    kind: "categories",
    at: new Date("2026-05-02T16:30:00"),
    line: (
      <>
        Category created · <Em>&quot;Greetings&quot;</Em> by <Em>Ana Torres</Em>
      </>
    ),
  },
  {
    id: "9",
    kind: "replies",
    at: new Date("2026-05-01T10:00:00"),
    line: (
      <>
        Reply deleted · <Em>&quot;Thanks for calling&quot;</Em> in <Em>Closings</Em> by{" "}
        <Em>Ana Torres</Em>
      </>
    ),
  },
  {
    id: "10",
    kind: "languages",
    at: new Date("2026-04-30T15:00:00"),
    line: (
      <>
        Language removed · <Em>FR-FR</Em> removed from <Em>Team Alpha</Em> by <Em>Ana Torres</Em>
      </>
    ),
  },
  {
    id: "11",
    kind: "languages",
    at: new Date("2026-04-20T12:00:00"),
    line: (
      <>
        Language added · <Em>EN-US</Em> added to <Em>Team Beta</Em> by <Em>Ana Torres</Em>
      </>
    ),
  },
].sort((a, b) => b.at.getTime() - a.at.getTime()) as ActivityItem[];

// ─── ActivityDrawer ───────────────────────────────────────────────────────────

interface ActivityDrawerProps {
  onClose: () => void;
}

function ActivityDrawer({ onClose }: ActivityDrawerProps) {
  const [actionType, setActionType] = useState<ActionTypeFilter>("all");
  const [dateRange, setDateRange] = useState<DateRangeFilter>("7days");
  const [loadState, setLoadState] = useState<"loading" | "ok" | "error">("loading");

  function loadActivity() {
    setLoadState("loading");
    window.setTimeout(() => {
      if (typeof window !== "undefined" && window.sessionStorage.getItem("verbum_activity_fail_next") === "1") {
        window.sessionStorage.removeItem("verbum_activity_fail_next");
        setLoadState("error");
        return;
      }
      setLoadState("ok");
    }, 450);
  }

  useEffect(() => {
    loadActivity();
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const selectStyle: CSSProperties = {
    fontSize: "13px",
    color: "#374151",
    border: "1px solid #D1D5DB",
    borderRadius: "8px",
    padding: "8px 12px",
    paddingRight: "34px",
    background: "#FFFFFF",
    cursor: "pointer",
    fontFamily: "'Poppins', sans-serif",
    outline: "none",
    width: "100%",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
  };

  const byDate = ACTIVITY_ITEMS.filter((item) => itemInDateRange(item, dateRange, ACTIVITY_NOW));

  const filtered =
    actionType === "all" ? byDate : byDate.filter((e) => e.kind === actionType);

  const emptyNoActivityInPeriod = byDate.length === 0;
  const emptyFromFilters = !emptyNoActivityInPeriod && filtered.length === 0;

  return (
    <SidePanel isOpen onClose={onClose} title="Activity" width="480px">
      <div style={{ fontFamily: "'Poppins', sans-serif" }}>
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #F3F4F6",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginBottom: "6px",
                }}
              >
                Action type
              </label>
              <div style={{ position: "relative" }}>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value as ActionTypeFilter)}
                  style={selectStyle}
                >
                  <option value="all">All</option>
                  <option value="replies">Replies</option>
                  <option value="categories">Categories</option>
                  <option value="teams">Teams</option>
                  <option value="languages">Languages</option>
                  <option value="account">Account</option>
                </select>
                <ChevronDown
                  size={14}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#6B7280",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginBottom: "6px",
                }}
              >
                Date range
              </label>
              <div style={{ position: "relative" }}>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as DateRangeFilter)}
                  style={selectStyle}
                >
                  <option value="7days">Last 7 days</option>
                  <option value="30days">Last 30 days</option>
                  <option value="custom">Custom</option>
                </select>
                <ChevronDown
                  size={14}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#6B7280",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>
          </div>
          {dateRange === "custom" && (
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#9CA3AF",
                lineHeight: 1.4,
              }}
            >
              Custom date range is not available yet (pending). Showing all activity through today.
            </p>
          )}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0" }}>
          {loadState === "loading" && (
            <div style={{ padding: "12px 24px" }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    padding: "14px 0",
                    borderBottom: i < 5 ? "1px solid #F3F4F6" : "none",
                  }}
                >
                  <div
                    style={{
                      height: "10px",
                      background: "#F3F4F6",
                      borderRadius: "4px",
                      width: i % 2 ? "72%" : "88%",
                      marginBottom: "8px",
                    }}
                  />
                  <div
                    style={{
                      height: "10px",
                      background: "#F3F4F6",
                      borderRadius: "4px",
                      width: "40%",
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {loadState === "error" && (
            <div
              style={{
                padding: "44px 24px",
                textAlign: "center",
                fontSize: "14px",
                color: "#6B7280",
                lineHeight: 1.5,
              }}
            >
              Couldn&apos;t load activity. Please try again.{" "}
              <button
                type="button"
                onClick={loadActivity}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  color: "#4023FF",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Poppins', sans-serif",
                  textDecoration: "underline",
                }}
              >
                Retry
              </button>
            </div>
          )}

          {loadState === "ok" && emptyNoActivityInPeriod && (
            <div
              style={{
                padding: "44px 24px",
                textAlign: "center",
                fontSize: "14px",
                color: "#9CA3AF",
              }}
            >
              No activity to show for this period.
            </div>
          )}

          {loadState === "ok" && emptyFromFilters && (
            <div
              style={{
                padding: "44px 24px",
                textAlign: "center",
                fontSize: "14px",
                color: "#9CA3AF",
              }}
            >
              No results match your filters. Try adjusting the date range or action type.
            </div>
          )}

          {loadState === "ok" &&
            filtered.length > 0 &&
            filtered.map((entry, i) => (
              <div
                key={entry.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "14px 24px",
                  borderBottom: i < filtered.length - 1 ? "1px solid #F3F4F6" : "none",
                  transition: "background 0.12s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#F9FAFB";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    color: "#374151",
                    lineHeight: 1.45,
                    flex: 1,
                  }}
                >
                  {entry.line} · {formatActivityTime(entry.at)}
                </span>
              </div>
            ))}
        </div>
      </div>
    </SidePanel>
  );
}

// ─── User menu role tag (all variants for reuse / future roles) ────────────────

type ProductRole = "supervisor" | "admin" | "super_admin";

const ROLE_TAG_STYLES: Record<ProductRole, { background: string; color: string }> = {
  supervisor: { background: "#C7D2FE", color: "#3730A3" },
  admin: { background: "#4023FF", color: "#FFFFFF" },
  super_admin: { background: "#1A0A99", color: "#FFFFFF" },
};

const ROLE_LABELS: Record<ProductRole, string> = {
  supervisor: "Supervisor",
  admin: "Admin",
  super_admin: "Super Admin",
};

function RoleTag({ role }: { role: ProductRole }) {
  const s = ROLE_TAG_STYLES[role];
  return (
    <span
      style={{
        display: "inline-block",
        background: s.background,
        color: s.color,
        fontSize: "11px",
        fontWeight: 600,
        borderRadius: "9999px",
        padding: "2px 8px",
      }}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}

const MOCK_USER_ROLE: ProductRole = "supervisor";

// ─── UserMenuButton + popover ─────────────────────────────────────────────────

interface UserMenuButtonProps {
  sidebarCollapsed: boolean;
}

function UserMenuButton({ sidebarCollapsed }: UserMenuButtonProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ left: 0, bottom: 0 });
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    function place() {
      const r = triggerRef.current!.getBoundingClientRect();
      setPopoverPos({
        left: r.left,
        bottom: window.innerHeight - r.top + 8,
      });
    }
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, sidebarCollapsed]);

  useEffect(() => {
    if (!open) return;
    function handleMouseDown(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const menuItemStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    padding: "9px 12px",
    fontSize: "13px",
    color: "#374151",
    background: "none",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontFamily: "'Poppins', sans-serif",
    textAlign: "left",
    transition: "background 0.1s",
  };

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-2"} p-2 rounded-[8px] cursor-pointer transition-all`}
        style={{ position: "relative" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = "#F9FAFB";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = "transparent";
        }}
      >
        <div
          className="w-[30px] h-[30px] rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: "rgba(64,35,255,0.12)",
            fontSize: "12px",
            fontWeight: 600,
            color: "#4023FF",
          }}
        >
          MV
        </div>

        {!sidebarCollapsed && (
          <>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#1F2937",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Morgan Vance
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#9CA3AF",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                morgan.vance@nexbridge.com
              </div>
            </div>
            <div style={{ flexShrink: 0, color: "#9CA3AF" }}>
              {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </>
        )}
      </div>

      {open && (
        <div
          ref={popoverRef}
          style={{
            position: "fixed",
            left: popoverPos.left,
            bottom: popoverPos.bottom,
            width: "260px",
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 300,
            overflow: "hidden",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <div
            style={{
              padding: "14px 14px 12px 14px",
              borderBottom: "1px solid #E5E7EB",
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(64,35,255,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: 600,
                color: "#4023FF",
                flexShrink: 0,
              }}
            >
              MV
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#1F2937",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Morgan Vance
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#6B7280",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginBottom: "6px",
                }}
              >
                morgan.vance@nexbridge.com
              </div>
              <RoleTag role={MOCK_USER_ROLE} />
            </div>
          </div>

          <div style={{ padding: "6px" }}>
            <button
              type="button"
              style={menuItemStyle}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#F9FAFB";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "none";
              }}
              onClick={() => {
                setOpen(false);
                navigate("/settings");
              }}
            >
              <User size={15} style={{ color: "#6B7280", flexShrink: 0 }} />
              <span>Profile Settings</span>
            </button>

            <button
              type="button"
              style={menuItemStyle}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#F9FAFB";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "none";
              }}
              onClick={() => {
                setOpen(false);
                setDrawerOpen(true);
              }}
            >
              <History size={15} style={{ color: "#6B7280", flexShrink: 0 }} />
              <span style={{ flex: 1 }}>Activity</span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#A16207",
                  background: "#FEFCE8",
                  border: "1px solid #FACC15",
                  borderRadius: "4px",
                  padding: "1px 5px",
                  flexShrink: 0,
                }}
              >
                Phase II
              </span>
            </button>

            <div
              style={{
                height: "1px",
                background: "#E5E7EB",
                margin: "4px 0",
              }}
            />

            <button
              type="button"
              style={{ ...menuItemStyle, color: "#EF4444" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#FEF2F2";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "none";
              }}
              onClick={() => {
                setOpen(false);
                navigate("/");
              }}
            >
              <LogOut size={15} style={{ color: "#EF4444", flexShrink: 0 }} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}

      {drawerOpen && <ActivityDrawer onClose={() => setDrawerOpen(false)} />}
    </>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export function Sidebar() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      className={`${sidebarCollapsed ? "w-[80px]" : "w-[255px]"} flex-shrink-0 flex flex-col relative transition-all duration-300`}
      style={{
        background: "#FFFFFF",
        borderRight: "1px solid #E5E7EB",
      }}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute top-3 -right-3 z-[110] h-8 w-6 rounded-[8px] bg-[#FFFFFF] border border-[#D1D5DB] transition-all flex items-center justify-center hover:border-[#4023FF] group shadow-md"
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#1F2937] transition-colors" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-[#6B7280] group-hover:text-[#1F2937] transition-colors" />
        )}
      </button>

      {/* Sidebar Top */}
      <div
        className={`px-4 py-4 flex items-center ${sidebarCollapsed ? "justify-center" : "gap-[10px]"}`}
        style={{
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <img
          src={logoImage}
          alt="VerbumLocal"
          className="w-8 h-8 rounded-[8px] flex-shrink-0"
        />
        {!sidebarCollapsed && (
          <div className="flex flex-col gap-[1px]">
            <span
              className="leading-[1.2]"
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#1F2937",
              }}
            >
              VerbumLocal East
            </span>
            <span
              style={{
                fontSize: "10px",
                color: "#9CA3AF",
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              Supervisor Panel
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4 flex flex-col gap-3">
        {/* Platform Section */}
        {!sidebarCollapsed && (
          <span
            className="px-1"
            style={{
              fontSize: "10px",
              fontWeight: 500,
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Platform
          </span>
        )}

        {/* Dashboard */}
        <Tooltip content={sidebarCollapsed ? "Dashboard" : ""} position="right" compact>
          <button
            className={`w-full flex items-center ${sidebarCollapsed ? "justify-center h-[49px] w-[49px] mx-auto" : "gap-3"} p-3 rounded-[8px] border transition-all`}
            style={{
              background: location.pathname === "/dashboard" ? "rgba(64,35,255,0.15)" : "rgba(0,0,0,0.02)",
              borderColor: location.pathname === "/dashboard" ? "#4023FF" : "#D1D5DB",
              color: location.pathname === "/dashboard" ? "#4023FF" : "#6B7280",
              fontSize: "14px",
              fontWeight: 500,
            }}
            onClick={() => navigate("/dashboard")}
            onMouseEnter={(e) => {
              if (location.pathname !== "/dashboard") {
                e.currentTarget.style.borderColor = "#4023FF";
                e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                e.currentTarget.style.color = "#4023FF";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== "/dashboard") {
                e.currentTarget.style.borderColor = "#D1D5DB";
                e.currentTarget.style.background = "rgba(0,0,0,0.02)";
                e.currentTarget.style.color = "#6B7280";
              }
            }}
          >
            <LayoutDashboard size={20} />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </button>
        </Tooltip>

        {/* Sessions */}
        <Tooltip content={sidebarCollapsed ? "Sessions" : ""} position="right" compact>
          <button
            className={`w-full flex items-center ${sidebarCollapsed ? "justify-center h-[49px] w-[49px] mx-auto" : "gap-3"} p-3 rounded-[8px] border transition-all`}
            style={{
              background: location.pathname === "/sessions" ? "rgba(64,35,255,0.15)" : "rgba(0,0,0,0.02)",
              borderColor: location.pathname === "/sessions" ? "#4023FF" : "#D1D5DB",
              color: location.pathname === "/sessions" ? "#4023FF" : "#6B7280",
              fontSize: "14px",
              fontWeight: 500,
            }}
            onClick={() => navigate("/sessions")}
            onMouseEnter={(e) => {
              if (location.pathname !== "/sessions") {
                e.currentTarget.style.borderColor = "#4023FF";
                e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                e.currentTarget.style.color = "#4023FF";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== "/sessions") {
                e.currentTarget.style.borderColor = "#D1D5DB";
                e.currentTarget.style.background = "rgba(0,0,0,0.02)";
                e.currentTarget.style.color = "#6B7280";
              }
            }}
          >
            <Folder size={20} />
            {!sidebarCollapsed && <span>Sessions</span>}
          </button>
        </Tooltip>

        {/* Teams */}
        <Tooltip content={sidebarCollapsed ? "Teams" : ""} position="right" compact>
          <button
            className={`w-full flex items-center ${sidebarCollapsed ? "justify-center h-[49px] w-[49px] mx-auto" : "gap-3"} p-3 rounded-[8px] border transition-all`}
            style={{
              background: location.pathname === "/teams" ? "rgba(64,35,255,0.15)" : "rgba(0,0,0,0.02)",
              borderColor: location.pathname === "/teams" ? "#4023FF" : "#D1D5DB",
              color: location.pathname === "/teams" ? "#4023FF" : "#6B7280",
              fontSize: "14px",
              fontWeight: 500,
            }}
            onClick={() => navigate("/teams")}
            onMouseEnter={(e) => {
              if (location.pathname !== "/teams") {
                e.currentTarget.style.borderColor = "#4023FF";
                e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                e.currentTarget.style.color = "#4023FF";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== "/teams") {
                e.currentTarget.style.borderColor = "#D1D5DB";
                e.currentTarget.style.background = "rgba(0,0,0,0.02)";
                e.currentTarget.style.color = "#6B7280";
              }
            }}
          >
            <Users size={20} />
            {!sidebarCollapsed && <span>Teams</span>}
          </button>
        </Tooltip>

        {/* Replies */}
        <Tooltip content={sidebarCollapsed ? "Replies" : ""} position="right" compact>
          <button
            className={`w-full flex items-center ${sidebarCollapsed ? "justify-center h-[49px] w-[49px] mx-auto" : "gap-3"} p-3 rounded-[8px] border transition-all`}
            style={{
              background: location.pathname === "/replies" ? "rgba(64,35,255,0.15)" : "rgba(0,0,0,0.02)",
              borderColor: location.pathname === "/replies" ? "#4023FF" : "#D1D5DB",
              color: location.pathname === "/replies" ? "#4023FF" : "#6B7280",
              fontSize: "14px",
              fontWeight: 500,
            }}
            onClick={() => navigate("/replies")}
            onMouseEnter={(e) => {
              if (location.pathname !== "/replies") {
                e.currentTarget.style.borderColor = "#4023FF";
                e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                e.currentTarget.style.color = "#4023FF";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== "/replies") {
                e.currentTarget.style.borderColor = "#D1D5DB";
                e.currentTarget.style.background = "rgba(0,0,0,0.02)";
                e.currentTarget.style.color = "#6B7280";
              }
            }}
          >
            <MessageSquare size={20} />
            {!sidebarCollapsed && <span>Replies</span>}
          </button>
        </Tooltip>
      </div>

      {/* Sidebar Bottom — User Menu */}
      <div
        className="px-3 py-3 mt-auto"
        style={{
          borderTop: "1px solid #E5E7EB",
        }}
      >
        <UserMenuButton sidebarCollapsed={sidebarCollapsed} />
      </div>
    </div>
  );
}
