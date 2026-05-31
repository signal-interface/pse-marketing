import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="w-14 h-14 rounded-[14px] bg-navy flex items-center justify-center mb-8">
        <span className="text-steel-light font-bold text-lg">S</span>
      </div>
      <h1 className="text-4xl font-bold text-text mb-4">
        Page Not Found
      </h1>
      <p className="text-text-secondary mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="text-sm font-semibold text-steel hover:text-text transition-colors"
      >
        &larr; Back to Home
      </Link>
    </main>
  );
}
