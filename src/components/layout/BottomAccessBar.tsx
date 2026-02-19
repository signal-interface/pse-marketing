import { Play, Lock } from "lucide-react";

export default function BottomAccessBar() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-[rgba(11,29,58,0.97)] backdrop-blur-md px-6 sm:px-10 py-3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5"
      role="complementary"
      aria-label="Quick access"
    >
      <span className="text-white/60 text-[13px] font-medium">
        Interested?
      </span>
      <a
        href="#preview"
        className="inline-flex items-center gap-2 px-[18px] py-[7px] text-[13px] rounded-lg bg-white/[0.08] text-white border border-white/[0.12] hover:bg-white/[0.15] transition-all"
      >
        <Play size={13} strokeWidth={2} aria-hidden="true" />
        Watch Preview
      </a>
      <a
        href="#demo"
        className="inline-flex items-center gap-2 px-[18px] py-[7px] text-[13px] rounded-lg font-semibold bg-navy text-white hover:bg-navy-light transition-all"
      >
        <Lock size={13} strokeWidth={2} aria-hidden="true" />
        Request Access
      </a>
    </div>
  );
}
