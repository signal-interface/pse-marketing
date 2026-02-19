import { SITE, SOCIAL } from "@/lib/constants";

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
                "Payroll Processing",
                "Tax & Compliance",
                "Workforce Analytics",
                "Advisory",
              ].map((s) => (
                <a
                  key={s}
                  href="#services"
                  className="text-sm text-steel-muted no-underline hover:text-white transition-colors py-1"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold text-steel uppercase tracking-[0.08em] mb-4">
              Platform
            </h4>
            <div className="flex flex-col gap-1">
              <a
                href="#chap"
                className="text-sm text-steel-muted no-underline hover:text-white transition-colors py-1"
              >
                CHAP AI
              </a>
              <a
                href="#chap"
                className="text-sm text-steel-muted no-underline hover:text-white transition-colors py-1"
              >
                CHAP Guard
              </a>
              <a
                href="#demo"
                className="text-sm text-steel-muted no-underline hover:text-white transition-colors py-1"
              >
                Request Access
              </a>
            </div>
          </div>

          {/* Follow */}
          <div>
            <h4 className="text-xs font-semibold text-steel uppercase tracking-[0.08em] mb-4">
              Follow
            </h4>
            <div className="flex flex-col gap-1">
              <a
                href={SOCIAL.x.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on X"
                className="text-sm text-steel-muted no-underline hover:text-white transition-colors py-1"
              >
                X {SOCIAL.x.handle}
              </a>
              <a
                href={SOCIAL.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="text-sm text-steel-muted no-underline hover:text-white transition-colors py-1"
              >
                IG {SOCIAL.instagram.handle}
              </a>
              <a
                href={SOCIAL.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on LinkedIn"
                className="text-sm text-steel-muted no-underline hover:text-white transition-colors py-1"
              >
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
          <div className="flex gap-4">
            <a
              href="#"
              className="text-[13px] text-steel-muted no-underline hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-[13px] text-steel-muted no-underline hover:text-white transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
