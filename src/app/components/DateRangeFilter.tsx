import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type FilterValue = "last7" | "last30" | "custom";

interface DateRangeFilterProps {
  value: FilterValue;
  onChange: (v: FilterValue) => void;
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerPos, setPickerPos] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const label =
    value === "custom" && dateRange.from && dateRange.to
      ? `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd")}`
      : value === "last30"
      ? `${format(new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), "MMM dd")} - ${format(new Date(), "MMM dd")}`
      : `${format(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), "MMM dd")} - ${format(new Date(), "MMM dd")}`;

  return (
    <div className="flex items-center gap-2">
      <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.6)", fontWeight: 500 }}>Date range</span>
      <div className="relative" ref={dropdownRef}>
        <button
          ref={buttonRef}
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center justify-between px-3 py-1 rounded-[8px] border bg-white"
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "rgba(0,0,0,0.9)",
            minWidth: "180px",
            borderColor: showDropdown || value !== "last7" ? "#4023FF" : "#E5E7EB",
          }}
        >
          <span>{label}</span>
          <ChevronDown size={16} style={{ color: "#6B7280" }} />
        </button>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute top-full right-0 mt-2 bg-white rounded-[8px] border border-[#E5E7EB] shadow-lg z-50" style={{ minWidth: "180px" }}>
            {(["last7", "last30"] as FilterValue[]).map((opt, i) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setShowDropdown(false); }}
                className="w-full px-3 py-2 text-left hover:bg-[#F9FAFB] transition-colors flex items-center justify-between"
                style={{ fontSize: "14px", fontWeight: 400, color: "rgba(0,0,0,0.9)", borderBottom: i === 0 ? "1px solid #F3F4F6" : undefined }}
              >
                <span>{opt === "last7" ? "Last 7 days" : "Last 30 days"}</span>
                {value === opt && <Check size={16} style={{ color: "#4023FF" }} />}
              </button>
            ))}
            <button
              onClick={() => {
                onChange("custom");
                setShowDropdown(false);
                if (buttonRef.current) {
                  const rect = buttonRef.current.getBoundingClientRect();
                  setPickerPos({ top: rect.bottom + 8, left: rect.left });
                }
                setShowPicker(true);
              }}
              className="w-full px-3 py-2 text-left hover:bg-[#F9FAFB] transition-colors rounded-b-[8px] flex items-center justify-between"
              style={{ fontSize: "14px", fontWeight: 400, color: "rgba(0,0,0,0.9)" }}
            >
              <span>Custom</span>
              {value === "custom" && <Check size={16} style={{ color: "#4023FF" }} />}
            </button>
          </div>
        )}

        {/* Date Picker Modal */}
        {showPicker && (
          <div
            className="fixed inset-0 z-[9999]"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setShowPicker(false)}
          >
            <div
              className="absolute bg-white rounded-[8px] p-4 border border-[#E5E7EB] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{ top: `${pickerPos.top}px`, left: `${pickerPos.left - 150}px`, width: "fit-content" }}
            >
              <h6 className="text-xs font-medium text-[#1F2937] mb-[8px] mt-[0px] mr-[0px] ml-[16px]">Select Date Range</h6>
              <style>{`
                .rdp { --rdp-cell-size: 40px; --rdp-accent-color: #4023FF; --rdp-background-color: rgba(64,35,255,0.1); margin: 0; }
                .rdp-months { justify-content: center; }
                .rdp-month { margin: 0; }
                .rdp-caption { display: flex; justify-content: center; align-items: center; padding: 0; padding-top: 4px; margin-bottom: 16px; position: relative; }
                .rdp-caption_label { font-size: 16px; font-weight: 500; color: #1F2937; }
                .rdp-nav { display: flex; align-items: center; gap: 4px; }
                .rdp-nav_button { width: 32px; height: 32px; border-radius: 6px; border: 1px solid #E5E7EB; background: transparent; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
                .rdp-nav_button:hover { background: #F9FAFB; }
                .rdp-nav_button_previous { position: absolute; left: 4px; }
                .rdp-nav_button_next { position: absolute; right: 4px; }
                .rdp-head_cell { font-size: 14px; font-weight: 500; color: #6B7280; text-transform: uppercase; width: 40px; }
                .rdp-table { width: 100%; border-collapse: collapse; }
                .rdp-head_row { display: flex; }
                .rdp-row { display: flex; width: 100%; margin-top: 8px; }
                .rdp-cell { padding: 0; text-align: center; position: relative; }
                .rdp-day { width: 40px; height: 40px; border-radius: 8px; font-size: 14px; font-weight: 400; color: #1F2937; border: none; background: transparent; cursor: pointer; padding: 0; }
                .rdp-day:hover:not(.rdp-day_selected):not(.rdp-day_disabled) { background: #F9FAFB; }
                .rdp-day_selected, .rdp-day_range_start, .rdp-day_range_end { background: #4023FF !important; color: white !important; font-weight: 500; }
                .rdp-day_range_start { border-radius: 8px 0 0 8px; }
                .rdp-day_range_end { border-radius: 0 8px 8px 0; }
                .rdp-day_range_middle { background: rgba(64,35,255,0.3) !important; color: #1F2937 !important; border-radius: 0; }
                .rdp-day_today { background: #F9FAFB; font-weight: 600; }
                .rdp-day_disabled { color: #D1D5DB; cursor: not-allowed; opacity: 0.3; }
                .rdp-day_outside { color: #D1D5DB; opacity: 0.5; }
              `}</style>
              <div className="rounded-lg p-[12px]">
                <DayPicker
                  mode="range"
                  selected={
                    dateRange.from && dateRange.to
                      ? { from: dateRange.from, to: dateRange.to }
                      : dateRange.from
                      ? { from: dateRange.from, to: undefined }
                      : undefined
                  }
                  onSelect={(range) => {
                    setDateRange(range ? { from: range.from || null, to: range.to || null } : { from: null, to: null });
                  }}
                  numberOfMonths={1}
                />
              </div>
              <div className="mt-[8px] flex gap-3 justify-end">
                <button
                  onClick={() => { setShowPicker(false); onChange("last7"); setDateRange({ from: null, to: null }); }}
                  className="px-[24px] py-[8px] rounded-[8px] text-sm font-medium text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { if (dateRange.from && dateRange.to) setShowPicker(false); }}
                  disabled={!dateRange.from || !dateRange.to}
                  className="px-[24px] py-[8px] rounded-[8px] text-sm font-medium bg-[#4023FF] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3519CC] transition-colors"
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
