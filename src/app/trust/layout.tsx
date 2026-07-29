import type { Metadata } from "next";
import type { ReactNode } from "react";
import { TRUST_LAYER_ENABLED } from "@/lib/flags";

// Indexing is derived from the release flag, never set per page. While the
// flag is off every route 404s, so noindex would be dead code; the moment
// the flag turns on, the trust center should be findable — procurement and
// security reviewers search for it by name.
export const metadata: Metadata = {
  robots: TRUST_LAYER_ENABLED
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function TrustLayout({ children }: { children: ReactNode }) {
  return children;
}
