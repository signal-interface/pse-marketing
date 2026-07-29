import Link from "next/link";
import { SITE, SOCIAL } from "@/lib/constants";
import FooterLegalLinks from "./FooterLegalLinks";

export default function Footer() {
  return (
    <footer className="px-8 pt-14 pb-8 bg-navy text-steel-muted">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-lg bg-navy-light flex items-center justify-center text-steel-light font-bold text-base">
                S
              </div>
              <span className="font-semibold text-[15px] text-steel-muted">
                {SITE.name}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-steel max-w-[280px] mt-3">
              Audit-first payroll intelligence for multi-state employers.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold text-steel uppercase tracking-[0.08em] mb-4">
              Services
            </h4>
            <div className="flex flex-col gap-1">
              {[
                { name: "Payroll Processing", slug: "payroll-processing" },
                { name: "Tax & Compliance", slug: "tax-compliance" },
                { name: "Workforce Analytics", slug: "workforce-analytics" },
                { name: "Benefits Integration", slug: "benefits-integration" },
                { name: "System Integration", slug: "system-integration" },
                { name: "Advisory", slug: "strategic-advisory" },
              ].map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="text-sm text-steel-muted no-underline hover:text-white transition-colors py-1"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold text-steel uppercase tracking-[0.08em] mb-4">
              Platform
            </h4>
            <div className="flex flex-col gap-1">
              <Link
                href="/chap-ai"
                className="text-sm text-steel-muted no-underline hover:text-white transition-colors py-1"
              >
                CHAP AI
              </Link>
              <Link
                href="/#demo"
                className="text-sm text-steel-muted no-underline hover:text-white transition-colors py-1"
              >
                Request Access
              </Link>
            </div>
          </div>

          {/* Follow */}
          <div>
            <h4 className="text-xs font-semibold text-steel uppercase tracking-[0.08em] mb-4">
              Follow
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href={SOCIAL.x.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on X"
                className="inline-flex items-center gap-2.5 text-sm text-steel-muted no-underline hover:text-white transition-colors py-1"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                {SOCIAL.x.handle}
              </a>
              <a
                href={SOCIAL.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="inline-flex items-center gap-2.5 text-sm text-steel-muted no-underline hover:text-white transition-colors py-1"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
                {SOCIAL.instagram.handle}
              </a>
              <a
                href={SOCIAL.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on LinkedIn"
                className="inline-flex items-center gap-2.5 text-sm text-steel-muted no-underline hover:text-white transition-colors py-1"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.08] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-[13px] text-steel">
            &copy; 2026 {SITE.name}. All rights reserved.
          </span>
          <FooterLegalLinks />
        </div>
      </div>
    </footer>
  );
}
