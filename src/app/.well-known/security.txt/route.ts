// RFC 9116 security.txt — the first thing a security researcher looks
// for. Served as a route (not a static public/ file) so it stays behind
// TRUST_CONTACTS_LIVE: publishing a mailbox that doesn't receive is the
// failure the flag exists to prevent.
//
// Expires is REQUIRED by RFC 9116 and is set one year out — refresh
// before 2027-07-31 (calendar reminder owned by Tom).
import { TRUST_CONTACTS_LIVE } from "@/lib/flags";

export function GET(): Response {
  if (!TRUST_CONTACTS_LIVE) {
    return new Response(null, { status: 404 });
  }
  const body = [
    "Contact: mailto:security@payrollsynergyexperts.com",
    "Preferred-Languages: en",
    "Canonical: https://payrollsynergyexperts.com/.well-known/security.txt",
    "Expires: 2027-07-31T00:00:00.000Z",
    "",
  ].join("\n");
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
