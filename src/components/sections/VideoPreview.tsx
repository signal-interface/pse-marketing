import { Play, ArrowRight } from "lucide-react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function VideoPreview() {
  return (
    <section
      id="preview"
      className="py-28 px-6 sm:px-10 max-w-[1200px] mx-auto text-center"
    >
      <RevealOnScroll>
        <h2 className="font-serif text-[clamp(2rem,4vw,2.75rem)] font-bold tracking-[-0.02em] text-navy mb-3.5">
          See it in action
        </h2>
        <p className="text-lg text-muted mb-12 max-w-[600px] mx-auto">
          Watch how PSE catches compliance violations in real time across
          multi-state payroll.
        </p>
      </RevealOnScroll>

      <RevealOnScroll delay="reveal-d1">
        <div className="bg-navy rounded-[20px] aspect-video max-w-[900px] mx-auto flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue/[0.15] via-transparent to-mint/10" />
          <div className="w-20 h-20 rounded-full bg-white/[0.12] flex items-center justify-center backdrop-blur-[10px] cursor-pointer relative hover:bg-white/[0.18] transition-all">
            <Play size={32} fill="white" stroke="none" aria-hidden="true" />
          </div>
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
            <span className="text-sm text-white/50">
              Platform trailer — coming soon
            </span>
            <a
              href="#demo"
              className="text-[13px] text-mint font-semibold no-underline flex items-center gap-1.5"
            >
              Request a Demo{" "}
              <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
            </a>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
