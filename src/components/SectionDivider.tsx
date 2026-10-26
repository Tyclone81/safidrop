import React from 'react';

type DividerVariant = 'wave' | 'suds';

interface SectionDividerProps {
  variant?: DividerVariant;
  /** Tailwind background class matching the section ABOVE, e.g. "bg-sky-600". */
  bgClass: string;
  /** Tailwind fill class matching the section BELOW, e.g. "fill-white". */
  fillClass: string;
  /** Mirror the curve so consecutive waves don't look identical. */
  flip?: boolean;
  /** Shorter version for subtle, low-contrast transitions. */
  compact?: boolean;
}

// Bubbles are plain circles (not stretched with the SVG), positioned in % of the divider.
const BUBBLES = [
  { left: '12%', bottom: '78%', size: 16, teal: false },
  { left: '15%', bottom: '95%', size: 8, teal: true },
  { left: '38%', bottom: '62%', size: 12, teal: false },
  { left: '47%', bottom: '88%', size: 8, teal: false },
  { left: '55%', bottom: '58%', size: 22, teal: false },
  { left: '58%', bottom: '84%', size: 9, teal: true },
  { left: '70%', bottom: '56%', size: 14, teal: false },
  { left: '83%', bottom: '84%', size: 18, teal: false },
  { left: '91%', bottom: '82%', size: 8, teal: true },
];

/** Soft curved edge between a coloured section and the one below it. */
export const SectionDivider: React.FC<SectionDividerProps> = ({
  variant = 'wave',
  bgClass,
  fillClass,
  flip = false,
  compact = false,
}) => (
  <div className={`relative -mb-px w-full leading-none ${bgClass}`} aria-hidden="true">
    {variant === 'suds' &&
      BUBBLES.map((bubble, index) => (
        <span
          key={index}
          className={`absolute rounded-full ${
            bubble.teal ? 'bg-teal-300/70' : 'border border-white/40 bg-white/15'
          }`}
          style={{
            left: bubble.left,
            bottom: bubble.bottom,
            width: bubble.size,
            height: bubble.size,
          }}
        />
      ))}
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={`block w-full ${
        compact ? 'h-[32px] sm:h-[48px] lg:h-[64px]' : 'h-[56px] sm:h-[80px] lg:h-[110px]'
      }`}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path
        d="M0 64 C180 24 360 24 540 60 C720 96 900 104 1080 70 C1230 42 1350 36 1440 48 L1440 120 L0 120 Z"
        className={fillClass}
      />
    </svg>
  </div>
);

interface FooterWaveProps {
  /** Colour of the section above, where the teal fades in. Defaults to white. */
  fromColor?: string;
}

/**
 * Layered transition into the footer: page colour fades to teal, a white swoosh
 * rises to the right, and the dark footer sits beneath it.
 */
export const FooterWave: React.FC<FooterWaveProps> = ({ fromColor = '#FFFFFF' }) => (
  <div
    className="relative -mb-px w-full leading-none"
    style={{ backgroundImage: `linear-gradient(to bottom, ${fromColor}, #2DD4BF)` }}
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 1440 240"
      preserveAspectRatio="none"
      className="block h-[110px] w-full sm:h-[160px] lg:h-[240px]"
    >
      <path
        d="M0 192 C160 198 330 218 579 215 C860 212 1060 120 1250 55 C1330 28 1390 8 1440 0 L1440 240 L0 240 Z"
        className="fill-white"
      />
      <path
        d="M0 206 C160 212 340 236 625 235 C900 232 1100 160 1300 128 C1360 118 1410 112 1440 110 L1440 240 L0 240 Z"
        className="fill-slate-950"
      />
    </svg>
  </div>
);
