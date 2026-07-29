import Link from "next/link";
import { DEMO_ANCHOR } from "@/lib/constants";
import { TRUST_CONTACTS_LIVE } from "@/lib/flags";

const TRUST_ADDRESSES = [
  "trust@payrollsynergyexperts.com",
  "security@payrollsynergyexperts.com",
] as const;

/**
 * Contact block for trust pages. The dedicated addresses are rendered only
 * when TRUST_CONTACTS_LIVE is true — a published security contact that
 * bounces invites a disclosure no one receives. No mailto: links anywhere.
 */
export default function TrustContact() {
  if (TRUST_CONTACTS_LIVE) {
    return (
      <div className="rounded-lg border border-border bg-ice p-5">
        <p className="mb-2 text-sm font-semibold text-text">Contact</p>
        {TRUST_ADDRESSES.map((address) => (
          <p key={address} className="text-sm text-text-secondary">
            {address}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-ice p-5">
      <p className="mb-2 text-sm font-semibold text-text">Contact</p>
      <p className="text-sm text-text-secondary">
        Questions about security or data handling? Reach us through the{" "}
        <Link href={DEMO_ANCHOR} className="font-semibold text-navy underline">
          demo request form
        </Link>
        .
      </p>
    </div>
  );
}
