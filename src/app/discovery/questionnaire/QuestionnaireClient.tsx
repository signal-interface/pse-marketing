"use client";

// Governance discovery questionnaire.
//
// Four short sections mirroring the server allowlist exactly. Autosaves
// (debounced) through the session cookie; save/resume across visits;
// submit finalizes and the session becomes read-only. All validation
// authority lives server-side — this form only shapes input.

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ShieldCheck } from "lucide-react";

type LoadState =
  | "loading"
  | "no-session"
  | "active"
  | "submitting"
  | "done"
  | "error";

interface Answers {
  organizationSize: string;
  operatingRegions: string; // comma-separated in the UI; array on the wire
  payrollFrequencies: string;
  hcmSystem: string;
  payrollProvider: string;
  operatingModel: string;
  payrollTeamSize: string;
  topConcerns: string[]; // exactly 3 slots in the UI
  reportingMaturity: string; // select value; int on the wire
  complianceConfidence: string;
  governanceConfidence: string;
  desiredFutureState: string;
  meetingPurpose: string;
}

const EMPTY: Answers = {
  organizationSize: "",
  operatingRegions: "",
  payrollFrequencies: "",
  hcmSystem: "",
  payrollProvider: "",
  operatingModel: "",
  payrollTeamSize: "",
  topConcerns: ["", "", ""],
  reportingMaturity: "",
  complianceConfidence: "",
  governanceConfidence: "",
  desiredFutureState: "",
  meetingPurpose: "",
};

const INPUT_CLS =
  "w-full px-4 py-3 border border-border rounded-lg text-[15px] font-sans outline-none focus:border-steel-light focus:ring-1 focus:ring-steel-light transition-colors bg-white placeholder:text-text-tertiary";
const LABEL_CLS = "block text-[13px] font-semibold text-text mb-1.5";
const SELECT_CLS = (filled: boolean) =>
  `${INPUT_CLS} ${filled ? "text-text" : "text-text-tertiary"}`;

// UI state → wire payload matching the server allowlist. Empty values are
// omitted so partial saves stay valid.
function toPayload(a: Answers): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (a.organizationSize) out.organizationSize = a.organizationSize;
  const regions = a.operatingRegions
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean)
    .slice(0, 30);
  if (regions.length) out.operatingRegions = regions;
  if (a.payrollFrequencies) out.payrollFrequencies = a.payrollFrequencies;
  if (a.hcmSystem.trim()) out.hcmSystem = a.hcmSystem.trim();
  if (a.payrollProvider.trim()) out.payrollProvider = a.payrollProvider.trim();
  if (a.operatingModel) out.operatingModel = a.operatingModel;
  if (a.payrollTeamSize.trim()) out.payrollTeamSize = a.payrollTeamSize.trim();
  const concerns = a.topConcerns.map((c) => c.trim()).filter(Boolean);
  if (concerns.length) out.topConcerns = concerns;
  if (a.reportingMaturity) out.reportingMaturity = Number(a.reportingMaturity);
  if (a.complianceConfidence)
    out.complianceConfidence = Number(a.complianceConfidence);
  if (a.governanceConfidence)
    out.governanceConfidence = Number(a.governanceConfidence);
  if (a.desiredFutureState.trim())
    out.desiredFutureState = a.desiredFutureState.trim();
  if (a.meetingPurpose.trim()) out.meetingPurpose = a.meetingPurpose.trim();
  return out;
}

// Wire answers → UI state on resume.
function fromPayload(p: Record<string, unknown>): Answers {
  const s = (v: unknown) => (typeof v === "string" ? v : "");
  const n = (v: unknown) =>
    typeof v === "number" && Number.isFinite(v) ? String(v) : "";
  const concerns = Array.isArray(p.topConcerns)
    ? (p.topConcerns as string[])
    : [];
  return {
    organizationSize: s(p.organizationSize),
    operatingRegions: Array.isArray(p.operatingRegions)
      ? (p.operatingRegions as string[]).join(", ")
      : "",
    payrollFrequencies: s(p.payrollFrequencies),
    hcmSystem: s(p.hcmSystem),
    payrollProvider: s(p.payrollProvider),
    operatingModel: s(p.operatingModel),
    payrollTeamSize: s(p.payrollTeamSize),
    topConcerns: [concerns[0] ?? "", concerns[1] ?? "", concerns[2] ?? ""],
    reportingMaturity: n(p.reportingMaturity),
    complianceConfidence: n(p.complianceConfidence),
    governanceConfidence: n(p.governanceConfidence),
    desiredFutureState: s(p.desiredFutureState),
    meetingPurpose: s(p.meetingPurpose),
  };
}

export default function QuestionnaireClient() {
  const [state, setState] = useState<LoadState>("loading");
  const [firstName, setFirstName] = useState("");
  const [company, setCompany] = useState("");
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const [schedulingUrl, setSchedulingUrl] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answersRef = useRef(answers);
  answersRef.current = answers;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/discovery/session");
        if (res.status === 401) {
          setState("no-session");
          return;
        }
        if (!res.ok) {
          setState("error");
          return;
        }
        const json = (await res.json()) as {
          firstName: string;
          company: string;
          answers: Record<string, unknown>;
          completed: boolean;
          schedulingUrl?: string | null;
        };
        setFirstName(json.firstName);
        setCompany(json.company);
        setAnswers(fromPayload(json.answers ?? {}));
        setSchedulingUrl(json.schedulingUrl ?? null);
        setState(json.completed ? "done" : "active");
      } catch {
        setState("error");
      }
    })();
  }, []);

  const save = useCallback(async () => {
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/discovery/session/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: toPayload(answersRef.current) }),
      });
      setSaveStatus(res.ok ? "saved" : "idle");
    } catch {
      setSaveStatus("idle");
    }
  }, []);

  const update = useCallback(
    (patch: Partial<Answers>) => {
      setAnswers((prev) => ({ ...prev, ...patch }));
      setSaveStatus("idle");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(save, 2000);
    },
    [save]
  );

  const submit = async () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSubmitError("");
    setState("submitting");
    try {
      const res = await fetch("/api/discovery/session/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: toPayload(answers) }),
      });
      if (res.ok) {
        const json = (await res.json().catch(() => ({}))) as {
          schedulingUrl?: string | null;
        };
        setSchedulingUrl(json.schedulingUrl ?? null);
        setState("done");
        return;
      }
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      setSubmitError(
        json.error === "invalid_answers"
          ? "One of the answers couldn't be accepted. Please review and try again."
          : "Something went wrong submitting. Your progress is saved — please try again."
      );
      setState("active");
    } catch {
      setSubmitError(
        "Network error. Your progress is saved — please try again."
      );
      setState("active");
    }
  };

  return (
    <main className="min-h-screen bg-ice py-16 px-6">
      <div className="max-w-[640px] mx-auto">
        {state === "loading" && (
          <Card>
            <p className="text-[15px] text-text-secondary text-center">
              Loading your questionnaire&hellip;
            </p>
          </Card>
        )}

        {state === "no-session" && (
          <Card>
            <h1 className="text-xl font-bold text-text mb-3 text-center">
              Governance Discovery
            </h1>
            <p className="text-[15px] text-text-secondary text-center">
              This discovery link is no longer active. Request a new link to
              continue.
            </p>
          </Card>
        )}

        {state === "error" && (
          <Card>
            <p className="text-[15px] text-text-secondary text-center">
              Something went wrong on our side. Please refresh, or email{" "}
              <a
                href="mailto:info@payrollsynergyexperts.com"
                className="text-steel underline"
              >
                info@payrollsynergyexperts.com
              </a>
              .
            </p>
          </Card>
        )}

        {state === "done" && (
          <Card>
            <div className="w-[52px] h-[52px] rounded-full bg-green-bg flex items-center justify-center mx-auto mb-4">
              <Check size={24} strokeWidth={3} className="text-green" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold text-text mb-2 text-center">
              Discovery questionnaire received
            </h1>
            <p className="text-[15px] text-text-secondary text-center">
              Thank you{firstName ? `, ${firstName}` : ""}. Your responses are
              in, and your discovery session is the next step
              {schedulingUrl
                ? " — pick a time that works for you."
                : " — you\u2019ll receive direct access to schedule it."}
            </p>
            {schedulingUrl && (
              <div className="text-center mt-6">
                <a
                  href={schedulingUrl}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-[15px] font-semibold bg-navy text-white hover:bg-navy-dark hover:-translate-y-px hover:shadow-md transition-all"
                >
                  Schedule your discovery session
                </a>
                <p className="text-[13px] text-text-tertiary mt-3">
                  We&rsquo;ve also emailed you this link.
                </p>
              </div>
            )}
          </Card>
        )}

        {(state === "active" || state === "submitting") && (
          <>
            <header className="mb-8">
              <span className="inline-block text-xs font-semibold text-steel uppercase tracking-[0.08em] mb-3">
                Governance Discovery
              </span>
              <h1 className="text-[clamp(1.75rem,4vw,2.25rem)] font-bold tracking-[-0.02em] text-text mb-3">
                {firstName ? `${firstName}, tell` : "Tell"} us about payroll at{" "}
                {company || "your organization"}
              </h1>
              <p className="text-[15px] text-text-secondary leading-[1.7]">
                About five minutes, on your environment and priorities — so the
                discovery session is about your operation, not a generic pitch.
              </p>
              <div className="flex items-center gap-2 mt-4 text-[13px] text-text-secondary">
                <ShieldCheck size={16} strokeWidth={2} className="text-steel shrink-0" aria-hidden="true" />
                No payroll data or employee information is requested — and none
                can be submitted here.
              </div>
            </header>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void submit();
              }}
              className="flex flex-col gap-6"
            >
              <Section title="Your environment">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="organizationSize" className={LABEL_CLS}>
                      Organization size
                    </label>
                    <select
                      id="organizationSize"
                      value={answers.organizationSize}
                      onChange={(e) => update({ organizationSize: e.target.value })}
                      className={SELECT_CLS(!!answers.organizationSize)}
                    >
                      <option value="">Select range</option>
                      <option value="1-50">1 – 50</option>
                      <option value="51-200">51 – 200</option>
                      <option value="201-500">201 – 500</option>
                      <option value="500+">500+</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="payrollFrequencies" className={LABEL_CLS}>
                      Payroll frequency
                    </label>
                    <select
                      id="payrollFrequencies"
                      value={answers.payrollFrequencies}
                      onChange={(e) => update({ payrollFrequencies: e.target.value })}
                      className={SELECT_CLS(!!answers.payrollFrequencies)}
                    >
                      <option value="">Select frequency</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Biweekly</option>
                      <option value="semimonthly">Semimonthly</option>
                      <option value="monthly">Monthly</option>
                      <option value="mixed">Mixed / multiple</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="operatingRegions" className={LABEL_CLS}>
                    Where you run payroll
                  </label>
                  <input
                    id="operatingRegions"
                    type="text"
                    placeholder="e.g. California, New York, UK (comma-separated)"
                    value={answers.operatingRegions}
                    onChange={(e) => update({ operatingRegions: e.target.value })}
                    className={INPUT_CLS}
                  />
                </div>
              </Section>

              <Section title="Your systems">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="hcmSystem" className={LABEL_CLS}>
                      HCM system
                    </label>
                    <input
                      id="hcmSystem"
                      type="text"
                      placeholder="e.g. Workday, UKG"
                      value={answers.hcmSystem}
                      onChange={(e) => update({ hcmSystem: e.target.value })}
                      className={INPUT_CLS}
                    />
                  </div>
                  <div>
                    <label htmlFor="payrollProvider" className={LABEL_CLS}>
                      Payroll provider
                    </label>
                    <input
                      id="payrollProvider"
                      type="text"
                      placeholder="e.g. ADP, Dayforce"
                      value={answers.payrollProvider}
                      onChange={(e) => update({ payrollProvider: e.target.value })}
                      className={INPUT_CLS}
                    />
                  </div>
                  <div>
                    <label htmlFor="operatingModel" className={LABEL_CLS}>
                      Payroll operating model
                    </label>
                    <select
                      id="operatingModel"
                      value={answers.operatingModel}
                      onChange={(e) => update({ operatingModel: e.target.value })}
                      className={SELECT_CLS(!!answers.operatingModel)}
                    >
                      <option value="">Select model</option>
                      <option value="internal">Run internally</option>
                      <option value="outsourced">Outsourced</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="payrollTeamSize" className={LABEL_CLS}>
                      Payroll team size
                    </label>
                    <input
                      id="payrollTeamSize"
                      type="text"
                      placeholder="e.g. 3"
                      value={answers.payrollTeamSize}
                      onChange={(e) => update({ payrollTeamSize: e.target.value })}
                      className={INPUT_CLS}
                    />
                  </div>
                </div>
              </Section>

              <Section title="Your priorities">
                <div>
                  <span className={LABEL_CLS}>
                    Top operational concerns (up to three)
                  </span>
                  <div className="flex flex-col gap-3">
                    {answers.topConcerns.map((concern, i) => (
                      <input
                        key={i}
                        type="text"
                        aria-label={`Concern ${i + 1}`}
                        placeholder={
                          ["e.g. Multi-state tax exposure", "e.g. Off-cycle audit trail", "e.g. Vendor accountability"][i]
                        }
                        value={concern}
                        onChange={(e) => {
                          const next = [...answers.topConcerns] as Answers["topConcerns"];
                          next[i] = e.target.value;
                          update({ topConcerns: next });
                        }}
                        className={INPUT_CLS}
                      />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <ScaleSelect
                    id="reportingMaturity"
                    label="Reporting maturity"
                    hint="1 = minimal, 5 = advanced"
                    max={5}
                    value={answers.reportingMaturity}
                    onChange={(v) => update({ reportingMaturity: v })}
                  />
                  <ScaleSelect
                    id="complianceConfidence"
                    label="Compliance confidence"
                    hint="1 = low, 10 = high"
                    max={10}
                    value={answers.complianceConfidence}
                    onChange={(v) => update({ complianceConfidence: v })}
                  />
                  <ScaleSelect
                    id="governanceConfidence"
                    label="Governance confidence"
                    hint="1 = low, 10 = high"
                    max={10}
                    value={answers.governanceConfidence}
                    onChange={(v) => update({ governanceConfidence: v })}
                  />
                </div>
              </Section>

              <Section title="Looking ahead">
                <div>
                  <label htmlFor="desiredFutureState" className={LABEL_CLS}>
                    What would &ldquo;payroll is governed&rdquo; look like for
                    you?
                  </label>
                  <textarea
                    id="desiredFutureState"
                    rows={4}
                    maxLength={2000}
                    placeholder="In your own words — the future state you want."
                    value={answers.desiredFutureState}
                    onChange={(e) => update({ desiredFutureState: e.target.value })}
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label htmlFor="meetingPurpose" className={LABEL_CLS}>
                    What should the discovery session focus on?
                  </label>
                  <textarea
                    id="meetingPurpose"
                    rows={3}
                    maxLength={1000}
                    placeholder="The one thing you most want to get out of the conversation."
                    value={answers.meetingPurpose}
                    onChange={(e) => update({ meetingPurpose: e.target.value })}
                    className={INPUT_CLS}
                  />
                </div>
              </Section>

              {submitError && (
                <p className="text-[14px] text-red-600" role="alert">
                  {submitError}
                </p>
              )}

              <div className="flex items-center justify-between gap-4">
                <span
                  className="text-[13px] text-text-tertiary"
                  aria-live="polite"
                >
                  {saveStatus === "saving" && "Saving\u2026"}
                  {saveStatus === "saved" && "Progress saved"}
                  {saveStatus === "idle" && "Autosaves as you go"}
                </span>
                <button
                  type="submit"
                  disabled={state === "submitting"}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-[15px] font-semibold bg-navy text-white hover:bg-navy-dark hover:-translate-y-px hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {state === "submitting" ? "Submitting\u2026" : "Submit questionnaire"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-md p-10 mt-20">
      {children}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="bg-white rounded-2xl border border-border shadow-sm p-7 flex flex-col gap-4">
      <legend className="sr-only">{title}</legend>
      <h2 className="text-[15px] font-bold text-text -mb-1">{title}</h2>
      {children}
    </fieldset>
  );
}

function ScaleSelect({
  id,
  label,
  hint,
  max,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  max: number;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={LABEL_CLS}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={SELECT_CLS(!!value)}
      >
        <option value="">{hint}</option>
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <option key={n} value={String(n)}>
            {n}
          </option>
        ))}
      </select>
    </div>
  );
}
