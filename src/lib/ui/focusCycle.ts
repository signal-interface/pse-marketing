/**
 * Keyboard focus containment for the open mobile menu (Vega finding after
 * PR #63): the full-height menu overlay covers the page, so Tab must not move
 * focus to controls hidden behind it. While the menu is open, Tab and
 * Shift+Tab cycle through the visible header controls and menu links only.
 *
 * This is deliberately not a modal dialog: no role change, no scroll lock,
 * and containment ends as soon as the menu closes.
 */

/** Return the element that should receive focus for a Tab/Shift+Tab press. */
export function nextInFocusCycle<T>(
  items: readonly T[],
  active: T | null,
  backwards: boolean,
): T | null {
  const count = items.length;
  if (count === 0) return null;
  const index = active === null ? -1 : items.indexOf(active);
  if (index === -1) return backwards ? items[count - 1] : items[0];
  return items[(index + (backwards ? -1 : 1) + count) % count];
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Visible, keyboard-focusable elements inside the given roots, in DOM order. */
export function visibleFocusables(roots: ReadonlyArray<Element | null>): HTMLElement[] {
  const found: HTMLElement[] = [];
  for (const root of roots) {
    if (!root) continue;
    root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR).forEach((el) => {
      // display:none (e.g. desktop-only links on mobile) has no client rects.
      if (el.getClientRects().length > 0 && !el.closest('[aria-hidden="true"]')) {
        found.push(el);
      }
    });
  }
  return found;
}
