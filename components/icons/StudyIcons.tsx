/**
 * Line-art icons for the 4-week perception study stats.
 * Single-stroke, editorial — matches FLO's existing Amazon/Shopify icon vocabulary.
 * All icons use currentColor so parent text-color classes control the stroke.
 */

type IconProps = { className?: string; size?: number };

export function FaceIcon({ className = "", size = 56 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} strokeLinecap="round" strokeLinejoin="round">
      {/* Hair bun */}
      <path d="M32 8c3.3 0 6 2.7 6 6 0 1.4-.5 2.7-1.3 3.7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M32 8c-3.3 0-6 2.7-6 6 0 1.4.5 2.7 1.3 3.7" stroke="currentColor" strokeWidth="1.5" />
      {/* Face oval */}
      <path d="M21 22c0-2 1-4 3-5 2-.8 5-1.5 8-1.5s6 .7 8 1.5c2 1 3 3 3 5v6c0 8-5 14-11 14s-11-6-11-14v-6z" stroke="currentColor" strokeWidth="1.5" />
      {/* Eyes */}
      <circle cx="27" cy="30" r="0.8" fill="currentColor" />
      <circle cx="37" cy="30" r="0.8" fill="currentColor" />
      {/* Mouth */}
      <path d="M30 37c1 1 3 1 4 0" stroke="currentColor" strokeWidth="1.3" />
      {/* Skin marks (acne) */}
      <circle cx="24" cy="34" r="0.6" fill="currentColor" />
      <circle cx="40" cy="33" r="0.6" fill="currentColor" />
      <circle cx="42" cy="38" r="0.5" fill="currentColor" />
      <circle cx="23" cy="27" r="0.5" fill="currentColor" />
      {/* Neck */}
      <path d="M28 43v4M36 43v4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M22 52c0-3 4-5 10-5s10 2 10 5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function FollicleIcon({ className = "", size = 56 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} strokeLinecap="round" strokeLinejoin="round">
      {/* Skin surface rectangle */}
      <rect x="12" y="30" width="40" height="18" rx="1" stroke="currentColor" strokeWidth="1.5" />
      {/* Follicle bulb */}
      <ellipse cx="32" cy="42" rx="3" ry="4" stroke="currentColor" strokeWidth="1.5" />
      {/* Hair strand rising */}
      <path d="M32 38 C 32 24, 34 16, 38 10" stroke="currentColor" strokeWidth="1.5" />
      {/* Second softer strand */}
      <path d="M30 38 C 28 26, 27 18, 25 14" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />
      {/* Ground stippling */}
      <path d="M18 38 L 20 38 M 44 38 L 46 38" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function HairIcon({ className = "", size = 56 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} strokeLinecap="round" strokeLinejoin="round">
      {/* Head profile */}
      <path d="M28 48c-6 0-10-4-10-10V22c0-6 5-11 11-11 3 0 5 .8 7 2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M36 13c4 2 6 6 6 10" stroke="currentColor" strokeWidth="1.5" />
      {/* Hair flow */}
      <path d="M42 23c4 3 6 8 6 14 0 7-4 13-10 15" stroke="currentColor" strokeWidth="1.5" />
      <path d="M44 28c3 3 4 7 3 11" stroke="currentColor" strokeWidth="1.3" opacity="0.7" />
      <path d="M46 36c2 2 3 5 2 8" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      {/* Eye */}
      <circle cx="26" cy="28" r="0.8" fill="currentColor" />
      {/* Nose hint */}
      <path d="M22 30c-1 2-1 4 0 5" stroke="currentColor" strokeWidth="1.2" />
      {/* Sparkles */}
      <path d="M50 18l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="currentColor" />
      <path d="M52 30l.8 1.5L54 32l-1.2.5L52 34l-.8-1.5L50 32l1.2-.5z" fill="currentColor" />
    </svg>
  );
}

export function DropletIcon({ className = "", size = 56 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} strokeLinecap="round" strokeLinejoin="round">
      {/* Droplet shape */}
      <path d="M30 10 C 20 24, 14 32, 14 40 a 16 14 0 0 0 32 0 c 0-8 -6-16 -16-30 z" stroke="currentColor" strokeWidth="1.5" />
      {/* Inner shine */}
      <path d="M22 38c0-4 2-7 5-9" stroke="currentColor" strokeWidth="1.3" opacity="0.7" />
      {/* Checkmark badge */}
      <circle cx="48" cy="16" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M45 16l2.5 2.5L52 14" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
