/** A simple cross in front of a rising sun. Decorative, so hidden from screen readers. */
export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <circle cx="24" cy="30" r="17" fill="#FFE2AD" />
      <path d="M7 30a17 17 0 0 1 34 0Z" fill="#F2A93B" />
      <g stroke="#F2A93B" strokeWidth="2.5" strokeLinecap="round">
        <path d="M24 5v4M9.5 11.5l2.8 2.8M38.5 11.5l-2.8 2.8M3 24h4M41 24h4" />
      </g>
      <rect x="21" y="12" width="6" height="30" rx="1.5" fill="#1A4F8B" />
      <rect x="14" y="19" width="20" height="6" rx="1.5" fill="#1A4F8B" />
      <path d="M4 42h40" stroke="#1A4F8B" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
