"use client";

// Reads ?t=... client-side (never re-sent to any server via referrer;
// page sets referrer: no-referrer), posts it once to session/start, and
// replaces the history entry so the raw token does not persist as the
// active URL.

import { useEffect, useState } from "react";

type State = "working" | "invalid" | "error";

const SAFE_INVALID_MESSAGE =
  "This discovery link is no longer active. Request a new link to continue.";

export default function DiscoveryStartClient() {
  const [state, setState] = useState<State>("working");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("t");
    if (!token) {
      setState("invalid");
      return;
    }
    // Remove the token from the address bar/history immediately.
    window.history.replaceState(null, "", "/discovery/start");

    (async () => {
      try {
        const res = await fetch("/api/discovery/session/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        if (res.ok) {
          const json = (await res.json()) as { redirectTo?: string };
          window.location.replace(json.redirectTo || "/discovery/questionnaire");
          return;
        }
        setState(res.status === 500 ? "error" : "invalid");
      } catch {
        setState("error");
      }
    })();
  }, []);

  return (
    <main className="min-h-screen bg-ice flex items-center justify-center px-8">
      <div className="max-w-[480px] w-full bg-white rounded-2xl border border-border shadow-md p-10 text-center">
        <h1 className="text-xl font-bold text-text mb-3">
          Governance Discovery
        </h1>
        {state === "working" && (
          <p className="text-[15px] text-text-secondary">
            Preparing your questionnaire&hellip;
          </p>
        )}
        {state === "invalid" && (
          <p className="text-[15px] text-text-secondary">
            {SAFE_INVALID_MESSAGE}
          </p>
        )}
        {state === "error" && (
          <p className="text-[15px] text-text-secondary">
            Something went wrong on our side. Please try the link again in a
            moment, or email{" "}
            <a
              href="mailto:info@payrollsynergyexperts.com"
              className="text-steel underline"
            >
              info@payrollsynergyexperts.com
            </a>
            .
          </p>
        )}
      </div>
    </main>
  );
}
