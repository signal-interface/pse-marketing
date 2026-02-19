import { Check } from "lucide-react";

export default function DashboardPreview() {
  return (
    <div className="flex-1 max-w-[480px]">
      <div className="bg-white rounded-[20px] p-7 shadow-[0_24px_64px_rgba(0,0,0,0.07),0_2px_4px_rgba(0,0,0,0.03)] border border-border">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-xs text-muted font-medium uppercase tracking-[0.06em] mb-1">
              Active Employees
            </div>
            <div className="text-[34px] font-extrabold text-navy tracking-[-0.03em]">
              2,847
            </div>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-mint/10 text-mint text-[13px] font-semibold">
            CHAP AI: 0 Violations
          </div>
        </div>

        {/* Next Payroll Run */}
        <div className="bg-sand rounded-[14px] p-5 mb-4">
          <div className="flex justify-between mb-2.5">
            <span className="text-sm font-semibold text-navy">
              Next Payroll Run
            </span>
            <span className="text-sm text-blue font-bold">Feb 28</span>
          </div>
          <div className="h-2 bg-[#e2e6ec] rounded">
            <div className="h-2 bg-gradient-to-r from-blue to-mint rounded w-[72%]" />
          </div>
          <div className="text-xs text-muted mt-2">
            72% pre-validated — 4 items need review
          </div>
        </div>

        {/* Status grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: "Tax Filing", status: "On Track", color: "text-mint" },
            { label: "Benefits Sync", status: "Pending", color: "text-[#f59e0b]" },
            { label: "Audit Trail", status: "Complete", color: "text-mint" },
          ].map((item) => (
            <div
              key={item.label}
              className="py-3.5 px-2.5 bg-warm rounded-[10px] text-center"
            >
              <div className="text-xs font-semibold text-navy mb-1">
                {item.label}
              </div>
              <div className={`text-[11px] font-semibold ${item.color}`}>
                {item.status}
              </div>
            </div>
          ))}
        </div>

        <a
          href="#demo"
          className="block mt-4 pt-3 text-center text-sm font-semibold text-blue no-underline border-t border-border"
        >
          Request Access →
        </a>
      </div>
    </div>
  );
}
