import { Check, AlertTriangle } from "lucide-react";

export default function DashboardPreview() {
  return (
    <div className="flex-1 max-w-[480px]">
      <div className="bg-white rounded-[20px] p-7 shadow-[0_24px_64px_rgba(0,0,0,0.07),0_2px_4px_rgba(0,0,0,0.03)] border border-border">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-border-light">
          <span
            className="w-2 h-2 rounded-full bg-green"
            style={{ animation: "pulse-green 2s infinite" }}
          />
          <span className="text-sm font-semibold text-text">
            CHAP AI &mdash; Pre-Run Compliance
          </span>
          <span className="ml-auto text-xs text-text-tertiary">Feb 28, 2026</span>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <div className="py-3.5 px-2.5 bg-ice rounded-[10px] text-center">
            <div className="text-[22px] font-extrabold text-text tracking-[-0.02em]">
              2,847
            </div>
            <div className="text-[11px] font-medium text-text-tertiary mt-0.5">
              Employees
            </div>
          </div>
          <div className="py-3.5 px-2.5 bg-green-bg rounded-[10px] text-center">
            <div className="text-[22px] font-extrabold text-green tracking-[-0.02em]">
              96%
            </div>
            <div className="text-[11px] font-medium text-text-tertiary mt-0.5">
              Pre-validated
            </div>
          </div>
          <div className="py-3.5 px-2.5 bg-green-bg rounded-[10px] text-center">
            <div className="text-[22px] font-extrabold text-green tracking-[-0.02em]">
              0
            </div>
            <div className="text-[11px] font-medium text-text-tertiary mt-0.5">
              Violations
            </div>
          </div>
        </div>

        {/* Flag rows */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-green-bg">
            <Check
              size={14}
              strokeWidth={2.5}
              className="text-green shrink-0"
              aria-hidden="true"
            />
            <span className="text-sm text-text">Federal tax filing</span>
            <span className="ml-auto text-xs font-medium text-green">Clear</span>
          </div>
          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-amber-bg">
            <AlertTriangle
              size={14}
              strokeWidth={2.5}
              className="text-amber shrink-0"
              aria-hidden="true"
            />
            <span className="text-sm text-text">CA overtime</span>
            <span className="ml-auto text-xs font-medium text-amber">Warning</span>
          </div>
          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-green-bg">
            <Check
              size={14}
              strokeWidth={2.5}
              className="text-green shrink-0"
              aria-hidden="true"
            />
            <span className="text-sm text-text">Benefits reconciliation</span>
            <span className="ml-auto text-xs font-medium text-green">Clear</span>
          </div>
        </div>
      </div>
    </div>
  );
}
