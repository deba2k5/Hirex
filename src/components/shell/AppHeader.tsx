import type { ReactNode } from 'react';
import { BrandMark, Wordmark } from '@/components/landing/brand';

interface Props {
  /** small label beside the logo, e.g. "Assessments" */
  section?: string;
  /** the signed-in person, shown as an avatar chip */
  user?: { name?: string | null; email?: string | null } | null;
  /** buttons on the right */
  children?: ReactNode;
}

/** The floating pill that tops every signed-in screen, matching the landing page nav. */
export default function AppHeader({ section, user, children }: Props) {
  const label = (user?.name || user?.email || '').trim();
  const initial = label ? label[0].toUpperCase() : '';
  return (
    <header className="sticky top-3 z-30 flex justify-center px-3 sm:top-4">
      <div className="floating-nav flex w-full max-w-[1120px] items-center justify-between gap-3 rounded-full border border-white/10 bg-ink-900/70 py-2 pl-3 pr-2 backdrop-blur-2xl">
        <div className="flex min-w-0 items-center gap-3">
          <BrandMark className="h-9 w-9 shrink-0" />
          <Wordmark className="hidden sm:inline" />
          {section && (
            <>
              <span className="hidden h-5 w-px bg-white/15 sm:block" />
              <span className="truncate text-[.7rem] font-semibold uppercase tracking-[.24em] text-champagne">{section}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {children}
          {initial && (
            <span
              title={label}
              className="ml-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-champagne-light to-champagne-deep font-display text-lg text-ink-950"
            >
              {initial}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

/** A quiet header button. */
export function HeaderButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-4 py-2 text-[.8rem] font-medium text-white/65 transition-colors hover:bg-white/[.06] hover:text-ivory"
    >
      {children}
    </button>
  );
}
