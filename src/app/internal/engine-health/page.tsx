import Link from "next/link";

const rows = [
  ["Marketing Core", "Not connected", "Shared runtime scaffolding has not started."],
  ["PSE Product Contract", "Planned", "Contract v0.1 is defined; runtime binding is pending."],
  ["Plugins", "Not connected", "Plugin interfaces are being finalized before implementation."],
  ["Faraday telemetry", "Deferred", "Optional future sink; not required for Marketing Engine operation."],
  ["Shield telemetry", "Deferred", "Optional future governance/security sink; not required for Marketing Engine operation."],
];

export default function EngineHealthPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-12 text-neutral-100">
      <div className="mx-auto max-w-5xl">
        <Link href="/internal" className="text-sm text-neutral-400 hover:text-neutral-200">
          ← PSE Internal
        </Link>

        <div className="mt-8 mb-8">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-neutral-400">Marketing Engine</p>
          <h1 className="text-3xl font-semibold tracking-tight">Engine Health</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-400">
            Temporary PSE viewer for the agnostic Marketing Engine health contract. This page intentionally reports implementation state only until the shared runtime begins emitting health telemetry.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60">
          <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-neutral-800 px-6 py-4 md:grid-cols-[1fr_180px_2fr]">
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">Component</span>
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">State</span>
            <span className="hidden text-xs font-medium uppercase tracking-wider text-neutral-500 md:block">Detail</span>
          </div>
          {rows.map(([component, state, detail]) => (
            <div key={component} className="grid grid-cols-[1fr_auto] gap-4 border-b border-neutral-800 px-6 py-5 last:border-b-0 md:grid-cols-[1fr_180px_2fr]">
              <span className="text-sm font-medium">{component}</span>
              <span className="text-sm text-neutral-300">{state}</span>
              <span className="col-span-2 text-sm leading-6 text-neutral-500 md:col-span-1">{detail}</span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs leading-5 text-neutral-500">
          This surface is not the system of record for Marketing Engine health. It is the first protected visual consumer and will later consume the same Health Contract that can be exposed to Faraday and Shield.
        </p>
      </div>
    </main>
  );
}
