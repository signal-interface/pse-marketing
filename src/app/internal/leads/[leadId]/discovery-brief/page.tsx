// /internal/leads/[leadId]/discovery-brief — internal review surface.
//
// Protected by Basic-auth middleware on /internal/*. Server component:
// reads the latest brief directly through the lib (no client fetch, no
// exposure of internal API mechanics). Generates on first view if a
// completed questionnaire exists, so Meeting-1 prep is one URL.

import type { Metadata } from "next";
import {
  generateDiscoveryBrief,
  getLatestBrief,
  type BriefRecord,
} from "@/lib/commercial/discovery-brief";
import type { Provenance } from "@/lib/commercial/discovery-brief-schema";

export const metadata: Metadata = {
  title: "Discovery Brief — PSE Internal",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const PROVENANCE_LABEL: Record<Provenance, { label: string; cls: string }> = {
  customer_stated: { label: "Customer stated", cls: "bg-ice text-steel" },
  derived_summary: { label: "Derived summary", cls: "bg-green-bg text-green" },
  open_question: { label: "Open question", cls: "bg-amber-50 text-amber-700" },
  prep_note: { label: "Prep note", cls: "bg-gray-100 text-text-secondary" },
};

export default async function DiscoveryBriefPage({
  params,
}: {
  params: Promise<{ leadId: string }>;
}) {
  const raw = (await params).leadId;
  const leadId = /^\d{1,10}$/.test(raw) ? Number(raw) : null;
  if (leadId === null) {
    return <Shell><p className="text-[15px] text-text-secondary">Invalid lead ID.</p></Shell>;
  }

  let brief: BriefRecord | null = await getLatestBrief(leadId);
  let generationNote: string | null = null;
  if (!brief) {
    const result = await generateDiscoveryBrief(leadId, {
      actorType: "TEAM_MEMBER",
      source: "internal/discovery-brief-page",
    });
    if (result.ok) {
      brief = result.brief;
    } else {
      generationNote =
        result.reason === "not_found"
          ? "Lead not found."
          : result.reason === "questionnaire_not_completed"
            ? "No completed questionnaire for this lead yet — the brief is generated from submitted answers."
            : "Lead is not in a brief-eligible state.";
    }
  }

  if (!brief) {
    return (
      <Shell>
        <h1 className="text-xl font-bold text-text mb-3">Discovery Brief — Lead #{leadId}</h1>
        <p className="text-[15px] text-text-secondary">{generationNote}</p>
      </Shell>
    );
  }

  return (
    <Shell>
      <header className="mb-8">
        <span className="inline-block text-xs font-semibold text-steel uppercase tracking-[0.08em] mb-2">
          Internal — sales preparation
        </span>
        <h1 className="text-2xl font-bold tracking-[-0.02em] text-text mb-2">
          Discovery Brief — Lead #{brief.leadId}
        </h1>
        <p className="text-[13px] text-text-tertiary">
          Version {brief.version} · {brief.generatorVersion} · generated{" "}
          {brief.generatedAt.toISOString().slice(0, 16).replace("T", " ")} UTC
        </p>
        <p className="text-[13px] text-text-secondary mt-3 leading-[1.6] border-l-2 border-border pl-3">
          {brief.content.disclaimer}
        </p>
      </header>

      <div className="flex flex-col gap-6">
        {brief.content.sections.map((section) => (
          <section
            key={section.id}
            className="bg-white rounded-2xl border border-border shadow-sm p-6"
          >
            <h2 className="text-[15px] font-bold text-text mb-4">{section.title}</h2>
            {section.statements.length === 0 ? (
              <p className="text-[14px] text-text-tertiary">Nothing provided.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {section.statements.map((statement, i) => {
                  const p = PROVENANCE_LABEL[statement.provenance];
                  return (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className={`shrink-0 mt-0.5 text-[11px] font-semibold px-2 py-0.5 rounded ${p.cls}`}
                        title={
                          statement.sourceFields.length
                            ? `Source: ${statement.sourceFields.join(", ")}`
                            : "No questionnaire field source"
                        }
                      >
                        {p.label}
                      </span>
                      <span className="text-[14px] text-text leading-[1.6]">
                        {statement.text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ))}

        <section className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <h2 className="text-[15px] font-bold text-text mb-3">
            Source answers (authoritative)
          </h2>
          <pre className="text-[12px] text-text-secondary bg-ice rounded-lg p-4 overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(brief.answersSnapshot, null, 2)}
          </pre>
        </section>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-ice py-12 px-6">
      <div className="max-w-[760px] mx-auto">{children}</div>
    </main>
  );
}
