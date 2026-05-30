interface BadgeProps {
  children: React.ReactNode;
}

export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-block bg-[#dbeafe] text-blue-accent text-xs font-semibold font-mono uppercase tracking-[0.08em] px-3 py-1 rounded-full">
      {children}
    </span>
  );
}
