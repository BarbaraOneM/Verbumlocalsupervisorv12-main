import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { LayoutDashboard, Users, Settings, ChevronDown, ChevronLeft, ChevronRight, Shield, Folder, MessageSquare } from "lucide-react";
import logoImage from "../../assets/619bbd22cfce479fb2faca904fc9762f8f470fb6.png";
import { Tooltip } from "./Tooltip";

export function Sidebar() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      className={`${sidebarCollapsed ? 'w-[80px]' : 'w-[255px]'} flex-shrink-0 flex flex-col relative transition-all duration-300`}
      style={{
        background: "#FFFFFF",
        borderRight: "1px solid #E5E7EB",
      }}
    >
      {/* Collapse Button - positioned to overflow right edge of sidebar */}
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
        className={`px-4 py-4 flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-[10px]'}`}
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
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center h-[49px] w-[49px] mx-auto' : 'gap-3'} p-3 rounded-[8px] border transition-all`}
            style={{
              background: location.pathname === '/dashboard' ? "rgba(64,35,255,0.15)" : "rgba(0,0,0,0.02)",
              borderColor: location.pathname === '/dashboard' ? "#4023FF" : "#D1D5DB",
              color: location.pathname === '/dashboard' ? "#4023FF" : "#6B7280",
              fontSize: "14px",
              fontWeight: 500,
            }}
            onClick={() => navigate('/dashboard')}
            onMouseEnter={(e) => {
              if (location.pathname !== '/dashboard') {
                e.currentTarget.style.borderColor = "#4023FF";
                e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                e.currentTarget.style.color = "#4023FF";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== '/dashboard') {
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
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center h-[49px] w-[49px] mx-auto' : 'gap-3'} p-3 rounded-[8px] border transition-all`}
            style={{
              background: location.pathname === '/sessions' ? "rgba(64,35,255,0.15)" : "rgba(0,0,0,0.02)",
              borderColor: location.pathname === '/sessions' ? "#4023FF" : "#D1D5DB",
              color: location.pathname === '/sessions' ? "#4023FF" : "#6B7280",
              fontSize: "14px",
              fontWeight: 500,
            }}
            onClick={() => navigate('/sessions')}
            onMouseEnter={(e) => {
              if (location.pathname !== '/sessions') {
                e.currentTarget.style.borderColor = "#4023FF";
                e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                e.currentTarget.style.color = "#4023FF";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== '/sessions') {
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
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center h-[49px] w-[49px] mx-auto' : 'gap-3'} p-3 rounded-[8px] border transition-all`}
            style={{
              background: location.pathname === '/teams' ? "rgba(64,35,255,0.15)" : "rgba(0,0,0,0.02)",
              borderColor: location.pathname === '/teams' ? "#4023FF" : "#D1D5DB",
              color: location.pathname === '/teams' ? "#4023FF" : "#6B7280",
              fontSize: "14px",
              fontWeight: 500,
            }}
            onClick={() => navigate('/teams')}
            onMouseEnter={(e) => {
              if (location.pathname !== '/teams') {
                e.currentTarget.style.borderColor = "#4023FF";
                e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                e.currentTarget.style.color = "#4023FF";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== '/teams') {
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
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center h-[49px] w-[49px] mx-auto' : 'gap-3'} p-3 rounded-[8px] border transition-all`}
            style={{
              background: location.pathname === '/replies' ? "rgba(64,35,255,0.15)" : "rgba(0,0,0,0.02)",
              borderColor: location.pathname === '/replies' ? "#4023FF" : "#D1D5DB",
              color: location.pathname === '/replies' ? "#4023FF" : "#6B7280",
              fontSize: "14px",
              fontWeight: 500,
            }}
            onClick={() => navigate('/replies')}
            onMouseEnter={(e) => {
              if (location.pathname !== '/replies') {
                e.currentTarget.style.borderColor = "#4023FF";
                e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                e.currentTarget.style.color = "#4023FF";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== '/replies') {
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

        {/* Settings Section */}
        {!sidebarCollapsed && (
          <span
            className="px-1 mt-[16px]"
            style={{
              fontSize: "10px",
              fontWeight: 500,
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Settings
          </span>
        )}

        {/* Profile Settings */}
        <Tooltip content={sidebarCollapsed ? "Profile Settings" : ""} position="right" compact>
          <button
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center h-[49px] w-[49px] mx-auto' : 'gap-3'} p-3 rounded-[8px] border transition-all`}
            style={{
              background: location.pathname === '/settings' ? "rgba(64,35,255,0.15)" : "rgba(0,0,0,0.02)",
              borderColor: location.pathname === '/settings' ? "#4023FF" : "#D1D5DB",
              color: location.pathname === '/settings' ? "#4023FF" : "#6B7280",
              fontSize: "14px",
              fontWeight: 500,
            }}
            onClick={() => navigate('/settings')}
            onMouseEnter={(e) => {
              if (location.pathname !== '/settings') {
                e.currentTarget.style.borderColor = "#4023FF";
                e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                e.currentTarget.style.color = "#4023FF";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== '/settings') {
                e.currentTarget.style.borderColor = "#D1D5DB";
                e.currentTarget.style.background = "rgba(0,0,0,0.02)";
                e.currentTarget.style.color = "#6B7280";
              }
            }}
          >
            <Settings size={20} />
            {!sidebarCollapsed && <span>Profile Settings</span>}
          </button>
        </Tooltip>
      </div>

      {/* Sidebar Bottom - User */}
      <div
        className="px-3 py-3 mt-auto"
        style={{
          borderTop: "1px solid #E5E7EB",
        }}
      >
        <div
          className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-2'} p-2 rounded-[8px] cursor-pointer transition-all`}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#F9FAFB";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
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
              <div className="flex-1">
                <div style={{ fontSize: "14px", fontWeight: 500, color: "#1F2937" }}>
                  Morgan Vance
                </div>
                <div style={{ fontSize: "10px", color: "#9CA3AF" }}>Supervisor</div>
              </div>
              <ChevronDown size={13} style={{ color: "#D1D5DB" }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
