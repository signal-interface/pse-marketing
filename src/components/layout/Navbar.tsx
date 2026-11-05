"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { DEMO_ANCHOR, NAV_LINKS } from "@/lib/constants";
import { nextInFocusCycle, visibleFocusables } from "@/lib/ui/focusCycle";

export const MOBILE_MENU_ID = "mobile-navigation-menu";

export default function Navbar() {
  // menuOpen must remain the first useState call (see investorLinks test).
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // MOB-02: Escape closes the open mobile menu and returns focus to the toggle.
  // While the menu overlay is showing, Tab/Shift+Tab cycle through the visible
  // header controls and menu links only, so focus never lands on a control
  // hidden behind the overlay. Containment ends when the menu closes.
  useEffect(() => {
    if (!menuOpen) return;
    const overlayShowing = () => (menuRef.current?.getClientRects().length ?? 0) > 0;
    const insideMenuOrHeader = (node: EventTarget | null) =>
      node instanceof Node &&
      (!!navRef.current?.contains(node) || !!menuRef.current?.contains(node));

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !overlayShowing()) return;
      const items = visibleFocusables([navRef.current, menuRef.current]);
      const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const target = nextInFocusCycle(items, active, event.shiftKey);
      if (target) {
        event.preventDefault();
        target.focus();
      }
    };
    // Backstop for focus moved by other means (e.g. assistive technology).
    const onFocusIn = (event: FocusEvent) => {
      if (overlayShowing() && !insideMenuOrHeader(event.target)) {
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 bg-[rgba(255,255,255,0.92)] backdrop-blur-[20px] border-b border-border transition-shadow duration-300 ${
          scrolled ? "shadow-sm" : ""
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-[1200px] mx-auto px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 no-underline text-inherit"
            aria-label="Payroll Synergy Experts home"
          >
            <div className="w-9 h-9 rounded-lg bg-navy flex items-center justify-center text-steel-light font-bold text-base">
              S
            </div>
            <span className="font-semibold text-[15px] text-text tracking-[-0.01em]">
              Payroll Synergy Experts
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-text-secondary no-underline text-sm font-medium hover:text-text transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href={DEMO_ANCHOR}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-md text-[13px] font-semibold bg-navy text-white hover:bg-navy-dark hover:-translate-y-px transition-all tracking-[0.01em]"
            >
              Request a Demo
            </a>
          </div>

          {/* Mobile toggle: 44x44 target; -mr-3 keeps the 20px icon on the
              same visual edge as before. */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="md:hidden -mr-3 inline-flex items-center justify-center w-11 h-11 rounded-md text-text hover:text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls={MOBILE_MENU_ID}
          >
            {menuOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          id={MOBILE_MENU_ID}
          className="fixed top-16 left-0 right-0 bottom-0 md:hidden bg-white px-8 py-6 z-[99] flex flex-col gap-2"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3.5 text-base font-medium text-text no-underline border-b border-border-light"
            >
              {link.label}
            </a>
          ))}
          <a
            href={DEMO_ANCHOR}
            onClick={() => setMenuOpen(false)}
            className="mt-4 inline-block text-center px-6 py-3.5 rounded-md text-[15px] font-semibold bg-navy text-white"
          >
            Request a Demo
          </a>
        </div>
      )}
    </>
  );
}
