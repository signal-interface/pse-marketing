import { publishableClaims } from "@/content/trust/claims";

/**
 * Renders the publishable (status === "current") claims for a surface.
 * This component is the only way trust pages surface capability statements —
 * no hardcoded capability prose belongs in the page components.
 */
export default function ClaimList({ surface }: { surface: string }) {
  const claims = publishableClaims(surface);
  if (claims.length === 0) return null;

  return (
    <ul className="flex flex-col gap-4">
      {claims.map((claim) => (
        <li
          key={claim.id}
          className="rounded-lg border border-border bg-white p-5"
        >
          <p className="text-[15px] leading-[1.7] text-text">{claim.statement}</p>
          <p className="mt-2 text-xs text-steel">
            Status: current · Last reviewed {claim.lastReviewed}
          </p>
        </li>
      ))}
    </ul>
  );
}
