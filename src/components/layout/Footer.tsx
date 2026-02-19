import { SITE, SOCIAL } from "@/lib/constants";
import SocialIcons from "@/components/ui/SocialIcons";

export default function Footer() {
  return (
    <footer className="px-6 sm:px-10 pt-14 pb-8 bg-navy text-white/45">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue to-mint flex items-center justify-center text-white font-extrabold text-[11px]">
                PSE
              </div>
              <span className="font-bold text-[15px] text-white">
                {SITE.name}
              </span>
            </div>
            <p className="text-[13px] leading-[1.7] max-w-[280px]">
              Modern payroll operations and compliance controls for growing
              businesses.
            </p>
            <div className="mt-4">
              <SocialIcons />
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white/70 text-xs font-bold mb-3.5 tracking-[0.06em] uppercase">
              Services
            </h4>
            <div className="flex flex-col gap-2">
              {["Payroll Processing", "Tax & Compliance", "CHAP AI", "Advisory"].map(
                (s) => (
                  <a
                    key={s}
                    href="#services"
                    className="text-[13px] text-white/40 no-underline hover:text-white/70 transition-colors"
                  >
                    {s}
                  </a>
                )
              )}
            </div>
          </div>

          {/* Platform + Follow */}
          <div>
            <h4 className="text-white/70 text-xs font-bold mb-3.5 tracking-[0.06em] uppercase">
              Platform
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href="#preview"
                className="text-[13px] text-white/40 no-underline hover:text-white/70 transition-colors"
              >
                Preview
              </a>
              <a
                href="#demo"
                className="text-[13px] text-white/40 no-underline hover:text-white/70 transition-colors"
              >
                Request Access
              </a>
            </div>
            <div className="mt-3 text-[11px] text-white/25">
              Platform access is by invitation only.
            </div>

            <h4 className="text-white/70 text-xs font-bold mb-2.5 mt-5 tracking-[0.06em] uppercase">
              Follow
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href={SOCIAL.x.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-white/40 no-underline hover:text-white/70 transition-colors"
              >
                X {SOCIAL.x.handle}
              </a>
              <a
                href={SOCIAL.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-white/40 no-underline hover:text-white/70 transition-colors"
              >
                IG {SOCIAL.instagram.handle}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.06] pt-5 flex flex-wrap justify-between gap-3">
          <span className="text-xs">
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
