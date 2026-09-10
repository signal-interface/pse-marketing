# PSE public investor entry

PSE sends public investor interest to one intake URL:

`https://www.srholdingsllc.com/investors?venture=pse&source=pse-marketing#investor-form`

The desktop navigation, mobile navigation, and homepage investor CTA use the shared
`INVESTOR_INTEREST_URL` constant. Public PSE pages do not link to the Signal investor
portal.

The rendered regression test in
`src/components/__tests__/investorLinks.test.tsx` checks both navigation layouts, the
homepage CTA, the exact venture/source/fragment contract, and exclusion of the Signal
investor URL. This repository defines the outbound link only; availability and access
policy for the destination remain the destination owner's responsibility.
