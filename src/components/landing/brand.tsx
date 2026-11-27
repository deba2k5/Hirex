import { useId } from 'react';

export const BRAND = {
  name: 'Recruitix',
  tagline: 'Intelligent talent assessment',
  repo: 'https://github.com/deba2k5/Recruitix',
};

/** The Recruitix monogram: a champagne ring with a stylised R. Pure SVG, no image file. */
export function BrandMark({ className = 'h-9 w-9' }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Recruitix">
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f1dfb4" />
          <stop offset=".55" stopColor="#d8b97a" />
          <stop offset="1" stopColor="#a98643" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="12" fill="#0a0c11" stroke={`url(#g${id})`} strokeWidth="1.4" />
      <path
        d="M13 29V11h8.2c3.3 0 5.3 1.8 5.3 4.6 0 2.4-1.5 4.1-3.8 4.5L27.5 29h-3.9l-4.2-8.4H16.6V29H13Zm3.6-11.4h4.3c1.4 0 2.2-.8 2.2-2s-.8-2-2.2-2h-4.3v4Z"
        fill={`url(#g${id})`}
      />
    </svg>
  );
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-display text-[1.65rem] leading-none tracking-tight text-ivory ${className}`}>
      Recruit<span className="italic text-champagne">ix</span>
    </span>
  );
}
