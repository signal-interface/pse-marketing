import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";
import Navbar from "../layout/Navbar";
import InvestorInterest from "../sections/InvestorInterest";

const navbarHookState = vi.hoisted(() => ({
  menuOpen: false,
  stateCall: 0,
}));

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  const useState = ((initialState: unknown) => {
    const value = navbarHookState.stateCall++ === 0 ? navbarHookState.menuOpen : initialState;
    return [value, () => undefined];
  }) as unknown as typeof actual.useState;

  return { ...actual, useState };
});

const APPROVED_INVESTOR_URL =
  "https://www.srholdingsllc.com/investors?venture=pse&source=pse-marketing#investor-form";

beforeAll(() => {
  vi.stubGlobal("React", React);
});

function anchorHrefs(markup: string) {
  return Array.from(markup.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g), ([, href]) =>
    href.replaceAll("&amp;", "&"),
  );
}

function renderNavbar(menuOpen: boolean) {
  navbarHookState.menuOpen = menuOpen;
  navbarHookState.stateCall = 0;
  return renderToStaticMarkup(React.createElement(Navbar));
}

describe("public investor entry links", () => {
  it("renders the approved investor URL in desktop navigation", () => {
    const hrefs = anchorHrefs(renderNavbar(false));

    expect(hrefs.filter((href) => href === APPROVED_INVESTOR_URL)).toHaveLength(1);
  });

  it("renders the approved investor URL in the open mobile navigation", () => {
    const hrefs = anchorHrefs(renderNavbar(true));

    expect(hrefs.filter((href) => href === APPROVED_INVESTOR_URL)).toHaveLength(2);
  });

  it("routes the body CTA to the same approved investor intake", () => {
    const hrefs = anchorHrefs(renderToStaticMarkup(React.createElement(InvestorInterest)));

    expect(hrefs).toContain(APPROVED_INVESTOR_URL);
  });

  it("does not render a public Signal investor CTA", () => {
    const markup = [
      renderNavbar(true),
      renderToStaticMarkup(React.createElement(InvestorInterest)),
    ].join("");

    expect(markup).not.toContain("signal-executive-interface.vercel.app/investor");
  });
});
