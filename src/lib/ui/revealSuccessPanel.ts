/**
 * Bring a just-rendered success panel into view and move focus to its heading.
 *
 * On mobile the demo form is much taller than the confirmation card that
 * replaces it, so after a successful submit the browser keeps its old scroll
 * offset and the viewport lands near the footer, with the confirmation and
 * scheduling CTA above it (acceptance finding MOB-01).
 *
 * - Scrolls the panel to the top of the viewport (the panel's own
 *   `scroll-margin-top` clears the fixed header).
 * - Honours `prefers-reduced-motion: reduce` with an instant jump. The global
 *   `html { scroll-behavior: smooth }` means "auto" would still animate, so
 *   "instant" is required.
 * - Focuses the heading with `preventScroll` so assistive technology
 *   announces the confirmation without a second scroll jump.
 */
export interface RevealTarget {
  scrollIntoView(options: ScrollIntoViewOptions): void;
}

export interface FocusTarget {
  focus(options?: FocusOptions): void;
}

export type MotionQuery = (query: string) => { matches: boolean };

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(matchMedia?: MotionQuery): boolean {
  if (typeof matchMedia !== "function") return false;
  try {
    return matchMedia(REDUCED_MOTION_QUERY).matches;
  } catch {
    return false;
  }
}

export function revealSuccessPanel(
  panel: RevealTarget | null,
  heading: FocusTarget | null,
  matchMedia?: MotionQuery,
): void {
  if (!panel) return;
  panel.scrollIntoView({
    behavior: prefersReducedMotion(matchMedia) ? "instant" : "smooth",
    block: "start",
  });
  heading?.focus({ preventScroll: true });
}
