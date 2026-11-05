import { describe, expect, it, vi } from "vitest";
import {
  REDUCED_MOTION_QUERY,
  prefersReducedMotion,
  revealSuccessPanel,
} from "../revealSuccessPanel";

function targets() {
  const calls: string[] = [];
  const panel = {
    scrollIntoView: vi.fn(() => calls.push("scroll")),
  };
  const heading = {
    focus: vi.fn(() => calls.push("focus")),
  };
  return { panel, heading, calls };
}

describe("MOB-01 revealSuccessPanel", () => {
  it("smooth-scrolls the success panel to the top of the viewport, then focuses its heading without a second scroll", () => {
    const { panel, heading, calls } = targets();
    revealSuccessPanel(panel, heading, () => ({ matches: false }));

    expect(panel.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    expect(heading.focus).toHaveBeenCalledWith({ preventScroll: true });
    expect(calls).toEqual(["scroll", "focus"]);
  });

  it("jumps instantly when the user prefers reduced motion (global CSS smooth scrolling would otherwise animate 'auto')", () => {
    const { panel, heading } = targets();
    const matchMedia = vi.fn(() => ({ matches: true }));
    revealSuccessPanel(panel, heading, matchMedia);

    expect(matchMedia).toHaveBeenCalledWith(REDUCED_MOTION_QUERY);
    expect(panel.scrollIntoView).toHaveBeenCalledWith({ behavior: "instant", block: "start" });
  });

  it("falls back to motion-allowed when matchMedia is missing or throws", () => {
    expect(prefersReducedMotion(undefined)).toBe(false);
    expect(
      prefersReducedMotion(() => {
        throw new Error("unsupported");
      }),
    ).toBe(false);
  });

  it("is a no-op without a panel and tolerates a missing heading", () => {
    const { heading } = targets();
    expect(() => revealSuccessPanel(null, heading)).not.toThrow();
    expect(heading.focus).not.toHaveBeenCalled();

    const { panel } = targets();
    expect(() => revealSuccessPanel(panel, null)).not.toThrow();
    expect(panel.scrollIntoView).toHaveBeenCalledOnce();
  });
});
