export const PRODUCT_TOUR_ENABLED =
  process.env.PRODUCT_TOUR_ENABLED === "true";

export const TRUST_LAYER_ENABLED =
  process.env.TRUST_LAYER_ENABLED === "true";

// trust@/security@ do not exist yet. While false, trust pages route contact
// through the demo request path; no address is rendered anywhere.
export const TRUST_CONTACTS_LIVE =
  process.env.TRUST_CONTACTS_LIVE === "true";
