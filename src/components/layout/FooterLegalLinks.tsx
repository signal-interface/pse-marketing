"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FooterLegalLinks() {
  const pathname = usePathname();

  return (
    <div className="flex gap-4">
      <Link
        href="/privacy"
        className={`text-[13px] no-underline transition-colors ${
          pathname === "/privacy"
            ? "text-steel-200 font-semibold"
            : "text-steel-muted hover:text-white"
        }`}
      >
        Privacy Policy
      </Link>
      <Link
        href="/terms"
        className={`text-[13px] no-underline transition-colors ${
          pathname === "/terms"
            ? "text-steel-200 font-semibold"
            : "text-steel-muted hover:text-white"
        }`}
      >
        Terms
      </Link>
    </div>
  );
}
