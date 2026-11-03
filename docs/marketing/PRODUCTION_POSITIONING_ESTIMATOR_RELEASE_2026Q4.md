# PSE Marketing — Production Positioning and Estimator Disclosure (Release 1, 2026-Q4)

**Scope and founder direction:** PSE marketing is a production website, with limited public distribution as determined by its current publication controls. The site is not to display 'Coming Soon', 'Beta', 'Pilot', 'Early Access' or waitlist-style positioning. Marketing edits are allowed only in `signal-interface/pse-marketing`. PSE Core, CHAP runtime and Context Hub are separate build-scope evaluations.

## Changes

1. Removed publicly displayed non-production status labels from homepage service cards, services catalog, CHAP Guard presentation, and dynamic service detail pages.
2. Unified customer-facing calls to action around `/#demo` rather than service-specific 'Notify Me When Available' forms. This preserves the existing production demo intake and does not add new backend behavior.
3. Removed `https://schema.org/PreOrder` from CHAP AI's SoftwareApplication metadata; removed the extension from the stated `operatingSystem` metadata, avoiding a structured-data availability claim about the extension. Existing presentation of CHAP Guard remains informational; illustrated scan examples retain their explicit illustrative label.
4. Reframed the compliance-risk estimator as a **modeled scenario** based on cited public figures **and internal assumptions**. The 33% error-rate calibration was already labeled internally as lacking a locatable primary external citation and **remains unchanged numerically**, as do the resulting formulas. Site copy now identifies the 33% calibration, estimated deposit amounts, investigation probability, and state/industry risk multipliers as assumptions rather than agency statistics. Internal source comments no longer assert all model values are externally sourced. PDF methodology already identifies the 33% factor as internal; independent financial-model validation and true sensitivity analysis are separate future enhancements.

## Boundaries and factual accuracy

**Production-only** is a commercial identity standard, not a claim that every software integration, regulation, client deployment, or scenario output has been independently verified. No new deployment capability is invented. The directory's dated source references, noindex editorial constraints, full 51-jurisdiction coverage, and legal caveats remain unchanged. Marketing claims should stay specific and verifiable; no blanket regulatory-compliance certification or unearned financial benefit guarantee is introduced.

## Technical release conditions

Exact-head CI typechecking, unit/contract tests, marketing lint and Next.js optimized build; Vercel preview success; approved scoped merge; exact commit production deployment READY; apex/www alias checks and observed fatal/error logs. Direct end-to-end marketing browser/mobile and request/demo workflows remain separately testable and should not be stated as validated based on CI alone.

## Follow-on work

Evaluate source benchmarks and estimator calibration in detail before altering the underlying risk model. Separately verify marketing demo lead delivery and the full site browser/mobile journey. No automatic SEO indexing change or operational PSE Core/Context Hub modification is authorized.
