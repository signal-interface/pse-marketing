"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 sm:px-10 py-3.5 flex items-center justify-between transition-all duration-300 ${
        solid
          ? "bg-[rgba(253,253,253,0.92)] backdrop-blur-xl border-b border-black/5"
          : "bg-transparent"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <Link
        href="/"
        className="flex items-center gap-3 no-underline text-inherit"
        aria-label="Payroll Synergy Experts home"
      >
        <div className="w-[38px] h-[38px] rounded-[10px] bg-gradient-to-br from-navy to-blue flex items-center justify-center text-white font-extrabold text-[13px]">
          PSE
        </div>
        <span className="font-bold text-[17px] tracking-tight">
          Payroll Synergy Experts
        </span>
      </Link>

      {/* Desktop */}
      <div className="hidden md:flex items-center gap-7">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-muted no-underline text-sm font-medium hover:text-text transition-colors"
          >
            {link.label}
          </a>
        ))}
        <a
          href="#demo"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[13px] font-semibold bg-mint text-white hover:bg-mint-dark hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(46,196,182,0.3)] transition-all"
        >
          Request Access
        </a>
        <a
          href="#demo"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[13px] font-semibold bg-navy text-white hover:bg-navy-light hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(11,29,58,0.25)] transition-all"
        >
          Request Demo
        </a>
      </div>

      {/* Mobile toggle */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-muted hover:text-text"
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {menuOpen && (
        <div className="absolute top-full left-0 right-0 md:hidden bg-white border-b border-border px-6 py-4 shadow-lg">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm text-muted hover:text-text no-underline transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#demo"
            onClick={() => setMenuOpen(false)}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[13px] font-semibold bg-navy text-white"
          >
            Request Demo
          </a>
        </div>
      )}
    </nav>
  );
}
