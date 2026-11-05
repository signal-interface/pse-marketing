import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import Navbar, { MOBILE_MENU_ID } from "../layout/Navbar";
import DemoRequestForm from "../forms/DemoRequestForm";

/**
 * Regression coverage for the Nov 5, 2026 mobile acceptance findings
 * (issue #55): MOB-01 success-screen positioning and MOB-02 mobile menu
 * accessibility. Server rendering with per-call useState overrides lets us
 * assert the rendered contract for each state without a DOM.
 */
const hookState = vi.hoisted(() => ({
  overrides: [] as unknown[],
  call: 0,
}));

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  const useState = ((initialState: unknown) => {
    const index = hookState.call++;
    const value = index < hookState.overrides.length && hookState.overrides[index] !== undefined
      ? hookState.overrides[index]
      : typeof initialState === "function"
        ? (initialState as () => unknown)()
        : initialState;
    return [value, () => undefined];
  }) as unknown as typeof actual.useState;
  return { ...actual, useState };
});

beforeAll(() => {
  vi.stubGlobal("React", React);
});

beforeEach(() => {
  hookState.call = 0;
  hookState.overrides = [];
});

function render(element: React.ReactElement, overrides: unknown[]) {
  hookState.call = 0;
  hookState.overrides = overrides;
  return renderToStaticMarkup(element);
}

function toggleTag(markup: string) {
  const match = markup.match(/<button\b[^>]*aria-controls="[^"]*"[^>]*>/);
  expect(match, "mobile menu toggle button").not.toBeNull();
  return match![0];
}

describe("MOB-02 mobile menu toggle", () => {
  it("exposes aria-expanded=false, an Open name and aria-controls when closed", () => {
    const tag = toggleTag(render(<Navbar />, [false]));
    expect(tag).toContain('type="button"');
    expect(tag).toContain('aria-expanded="false"');
    expect(tag).toContain('aria-label="Open menu"');
    expect(tag).toContain(`aria-controls="${MOBILE_MENU_ID}"`);
  });

  it("exposes aria-expanded=true, a Close name and a matching menu id when open", () => {
    const markup = render(<Navbar />, [true]);
    const tag = toggleTag(markup);
    expect(tag).toContain('aria-expanded="true"');
    expect(tag).toContain('aria-label="Close menu"');
    expect(markup).toContain(`id="${MOBILE_MENU_ID}"`);
  });

  it("renders a 44x44 CSS px target with a visible keyboard focus indicator", () => {
    const tag = toggleTag(render(<Navbar />, [false]));
    // Tailwind w-11/h-11 = 2.75rem = 44px.
    expect(tag).toMatch(/\bw-11\b/);
    expect(tag).toMatch(/\bh-11\b/);
    expect(tag).toMatch(/focus-visible:outline-2\b/);
    expect(tag).not.toContain("Toggle menu");
  });

  it("hides the decorative icon from assistive technology", () => {
    const markup = render(<Navbar />, [false]);
    const button = markup.slice(markup.indexOf(toggleTag(markup)));
    const svg = button.slice(0, button.indexOf("</button>")).match(/<svg\b[^>]*>/);
    expect(svg?.[0]).toContain('aria-hidden="true"');
  });
});

describe("MOB-01 success screen", () => {
  const SCHEDULING_URL = "https://cal.example.test/pse/demo";
  // DemoRequestForm useState order: formData, submitted, schedulingUrl, submitting.
  const successState = (url: string | null) => [undefined, true, url, false];

  it("renders a scroll-margin panel with a programmatically focusable heading", () => {
    const markup = render(<DemoRequestForm />, successState(SCHEDULING_URL));
    expect(markup).toMatch(/<div[^>]*data-testid="demo-success-panel"[^>]*class="scroll-mt-24"/);
    expect(markup).toMatch(/<h2[^>]*tabindex="-1"[^>]*>Demo request received<\/h2>/);
  });

  it("keeps the scheduling CTA inside the panel with the server-supplied URL unchanged", () => {
    const markup = render(<DemoRequestForm />, successState(SCHEDULING_URL));
    const panel = markup.slice(markup.indexOf('data-testid="demo-success-panel"'));
    expect(panel).toContain(`href="${SCHEDULING_URL}"`);
    expect(panel).toContain("Schedule your PSE demonstration");
  });

  it("preserves the no-scheduling confirmation copy and renders no invented CTA", () => {
    const markup = render(<DemoRequestForm />, successState(null));
    expect(markup).toContain("We&#x27;ll reach out within one business day to schedule your walkthrough.");
    expect(markup).not.toContain("Schedule your PSE demonstration");
  });

  it("does not render the success panel before submission", () => {
    const markup = render(<DemoRequestForm />, []);
    expect(markup).not.toContain("demo-success-panel");
    expect(markup).toContain("<form");
  });
});
