import { describe, expect, it } from "vitest";
import { nextInFocusCycle, visibleFocusables } from "../focusCycle";

// Mirrors the open mobile menu at 390px: visible header controls, then the
// six menu entries (5 links + Request a Demo).
const items = ["logo", "toggle", "chap", "services", "risk", "intel", "investors", "demo"];

describe("open mobile menu focus cycle", () => {
  it("wraps forward from the last menu link to the first header control instead of leaving the overlay", () => {
    expect(nextInFocusCycle(items, "demo", false)).toBe("logo");
  });

  it("wraps backward from the first header control to the last menu link", () => {
    expect(nextInFocusCycle(items, "logo", true)).toBe("demo");
  });

  it("moves forward and backward through the menu in DOM order", () => {
    expect(nextInFocusCycle(items, "toggle", false)).toBe("chap");
    expect(nextInFocusCycle(items, "chap", true)).toBe("toggle");
    expect(nextInFocusCycle(items, "investors", false)).toBe("demo");
  });

  it("pulls focus that is outside the cycle back into it", () => {
    expect(nextInFocusCycle(items, "hidden-hero-cta", false)).toBe("logo");
    expect(nextInFocusCycle(items, "hidden-hero-cta", true)).toBe("demo");
    expect(nextInFocusCycle(items, null, false)).toBe("logo");
  });

  it("does nothing when there is nothing to focus", () => {
    expect(nextInFocusCycle([], "logo", false)).toBeNull();
  });
});

describe("visibleFocusables", () => {
  function el(name: string, visible: boolean, hiddenAncestor = false) {
    return {
      name,
      getClientRects: () => ({ length: visible ? 1 : 0 }),
      closest: (sel: string) => (hiddenAncestor && sel === '[aria-hidden="true"]' ? {} : null),
    };
  }
  function root(children: ReturnType<typeof el>[]) {
    return {
      querySelectorAll: () => ({ forEach: (fn: (c: unknown) => void) => children.forEach(fn) }),
    } as unknown as Element;
  }

  it("skips display:none desktop links and aria-hidden content, keeps DOM order across roots", () => {
    const nav = root([el("logo", true), el("desktop-link", false), el("toggle", true)]);
    const menu = root([el("chap", true), el("decorative", true, true), el("demo", true)]);
    const names = visibleFocusables([nav, null, menu]).map((e) => (e as unknown as { name: string }).name);
    expect(names).toEqual(["logo", "toggle", "chap", "demo"]);
  });
});
