import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="w-14 h-14 rounded-[14px] bg-gradient-to-br from-navy to-blue flex items-center justify-center mb-8">
        <span className="text-white font-extrabold text-lg">PSE</span>
      </div>
      <h1 className="font-serif text-4xl font-bold text-navy mb-4">
        Page Not Found
      </h1>
      <p className="text-muted mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="text-sm font-semibold text-blue hover:text-navy transition-colors"
      >
        &larr; Back to Home
      </Link>
    </main>
  );
}
