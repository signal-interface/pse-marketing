import Link from "next/link";

const cards = [
  {
    title: "Marketing Engine Health",
    description: "View the local Marketing Engine health surface. Contract-backed health data will be wired in during the engine implementation sequence.",
    href: "/internal/engine-health",
    status: "Available",
  },
  {
    title: "Lead Review",
    description: "Per-lead internal review routes already exist. A consolidated leads index is not yet implemented.",
    href: null,
    status: "Detail routes only",
  },
];

export default function InternalHomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-12 text-neutral-100">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-neutral-400">PSE Internal</p>
          <h1 className="text-3xl font-semibold tracking-tight">Administration</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">
            Private operational surfaces for Payroll Synergy Experts. This area is not linked from the public site and requires internal authentication.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <section key={card.title} className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-medium">{card.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-neutral-400">{card.description}</p>
                </div>
                <span className="whitespace-nowrap rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-300">
                  {card.status}
                </span>
              </div>

              {card.href ? (
                <Link
                  href={card.href}
                  className="inline-flex rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium transition hover:border-neutral-500 hover:bg-neutral-800"
                >
                  Open
                </Link>
              ) : (
                <span className="text-xs text-neutral-500">No index route yet</span>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
