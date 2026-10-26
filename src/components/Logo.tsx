import React from 'react';

interface LogoMarkProps {
  className?: string;
}

/** The Route-S mark: a path from pickup (white dot) to drop (teal marker). */
export const LogoMark: React.FC<LogoMarkProps> = ({ className = 'h-10 w-10' }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="100" height="100" rx="22" fill="#0284C7" />
    <path
      d="M32 74 C70 78 74 52 50 50 C26 48 30 22 62 27"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="30" cy="74" r="5" fill="#FFFFFF" />
    <circle cx="68" cy="26" r="10" fill="#2DD4BF" />
    <circle cx="68" cy="26" r="3.5" fill="#FFFFFF" />
  </svg>
);

const TONES = {
  default: { safi: 'text-slate-950', drop: 'text-sky-600' },
  onDark: { safi: 'text-white', drop: 'text-sky-400' },
} as const;

interface LogoProps {
  className?: string;
  /** Use "onDark" on dark backgrounds such as the footer. */
  tone?: keyof typeof TONES;
}

/** Mark + "SafiDrop" wordmark. */
export const Logo: React.FC<LogoProps> = ({ className = '', tone = 'default' }) => (
  <span className={`flex items-center gap-2.5 ${className}`}>
    <LogoMark className="h-10 w-10 shrink-0 drop-shadow-sm" />
    <span className={`text-lg font-extrabold leading-none ${TONES[tone].safi}`}>
      Safi<span className={TONES[tone].drop}>Drop</span>
    </span>
  </span>
);
