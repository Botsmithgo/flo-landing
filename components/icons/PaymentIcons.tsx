/**
 * Payment-method brand marks — inline SVGs.
 *
 * All four are rendered in their brand-correct colors by default.
 * Pass `monochrome` to make them inherit currentColor (useful on small
 * pill badges where full brand colors would look noisy).
 */

type IconProps = { className?: string; monochrome?: boolean };

export function ApplePayIcon({ className = "", monochrome = false }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 24"
      className={className}
      aria-label="Apple Pay"
      role="img"
      fill={monochrome ? "currentColor" : "#000"}
    >
      {/* Apple glyph */}
      <path d="M12.97 5.58c.75-.92 1.26-2.22 1.12-3.52-1.1.05-2.45.72-3.23 1.62-.69.8-1.3 2.11-1.14 3.37 1.23.1 2.48-.61 3.25-1.47zm1.12 1.73c-1.8-.1-3.33.98-4.19.98-.87 0-2.19-.95-3.62-.92-1.86.03-3.58 1.08-4.54 2.74-1.93 3.35-.5 8.33 1.4 11.05.93 1.35 2.04 2.84 3.5 2.8 1.4-.05 1.94-.91 3.63-.91 1.7 0 2.17.91 3.62.88 1.5-.03 2.46-1.37 3.37-2.72.94-1.4 1.38-2.77 1.41-2.85-.03-.02-2.84-1.12-2.87-4.42-.03-2.76 2.27-4.08 2.37-4.15-1.29-1.92-3.32-2.14-4.08-2.18z" fill={monochrome ? "currentColor" : "#000"} />
      {/* Pay wordmark */}
      <g fill={monochrome ? "currentColor" : "#000"}>
        <path d="M24.35 8.42h3.45c2.11 0 3.56 1.45 3.56 3.56 0 2.11-1.48 3.58-3.6 3.58h-1.99v3.67h-1.42V8.42zm1.42 5.92h1.66c1.47 0 2.3-.78 2.3-2.35 0-1.56-.83-2.33-2.29-2.33h-1.67v4.68z" />
        <path d="M32.13 17.4c0-1.29.99-2.09 2.74-2.19l2.02-.12v-.57c0-.82-.56-1.31-1.49-1.31-.88 0-1.44.42-1.58 1.08h-1.3c.08-1.33 1.22-2.31 2.93-2.31 1.68 0 2.76.9 2.76 2.29v4.82h-1.3v-1.15h-.03c-.39.78-1.28 1.28-2.2 1.28-1.37 0-2.35-.85-2.35-2.09zm4.76-.67v-.58l-1.82.11c-.9.06-1.41.47-1.41 1.11 0 .66.54 1.09 1.37 1.09 1.08 0 1.86-.73 1.86-1.73z" />
        <path d="M40.02 22.28v-1.1c.1.02.32.04.43.04.63 0 .97-.27 1.18-.95l.12-.4-2.36-6.54h1.48l1.64 5.31h.03l1.64-5.31h1.44l-2.45 6.87c-.56 1.58-1.2 2.09-2.55 2.09-.11 0-.44-.01-.54-.03z" />
      </g>
    </svg>
  );
}

export function GooglePayIcon({ className = "", monochrome = false }: IconProps) {
  if (monochrome) {
    return (
      <svg viewBox="0 0 64 24" className={className} aria-label="Google Pay" role="img" fill="currentColor">
        <text x="0" y="17" fontFamily="Arial, sans-serif" fontWeight="500" fontSize="14">G Pay</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 24" className={className} aria-label="Google Pay" role="img">
      {/* Google G */}
      <g>
        <path d="M13.5 12.18c0-.43-.04-.84-.11-1.24H7v2.35h3.65c-.16.85-.64 1.56-1.36 2.05v1.7h2.2c1.29-1.19 2.03-2.94 2.03-4.86z" fill="#4285F4" />
        <path d="M7 18.5c1.84 0 3.38-.61 4.51-1.65l-2.2-1.7c-.61.41-1.39.65-2.31.65-1.78 0-3.29-1.2-3.83-2.82H.9v1.76C2.04 16.94 4.35 18.5 7 18.5z" fill="#34A853" />
        <path d="M3.17 12.98c-.14-.41-.22-.85-.22-1.3 0-.45.08-.89.22-1.3V8.62H.9C.33 9.75 0 11.03 0 12.38c0 1.35.33 2.63.9 3.76l2.27-1.76z" fill="#FBBC04" />
        <path d="M7 6.76c1 0 1.9.34 2.6 1.02l1.95-1.95C10.38 4.75 8.84 4 7 4 4.35 4 2.04 5.56.9 7.82l2.27 1.76C3.71 7.96 5.22 6.76 7 6.76z" fill="#EA4335" />
      </g>
      {/* Pay wordmark */}
      <g fill="#5F6368">
        <text x="17" y="17" fontFamily="Arial, sans-serif" fontWeight="500" fontSize="14">Pay</text>
      </g>
    </svg>
  );
}

export function PayPalIcon({ className = "", monochrome = false }: IconProps) {
  if (monochrome) {
    return (
      <svg viewBox="0 0 64 24" className={className} aria-label="PayPal" role="img" fill="currentColor">
        <text x="0" y="17" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="14" fontStyle="italic">PayPal</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 24" className={className} aria-label="PayPal" role="img">
      {/* Simplified PayPal mark — double P in brand blues */}
      <g>
        <path
          d="M8.2 4.5h5.6c2.66 0 4.5 1.37 4.5 3.72 0 2.8-2.27 4.58-5.5 4.58h-2.06l-.72 3.9H7.6L8.2 4.5zm1.54 6.6h1.63c1.87 0 2.92-.88 2.92-2.48 0-1.16-.8-1.78-2.24-1.78h-1.5l-.81 4.26z"
          fill="#003087"
        />
        <path
          d="M16.8 4.5h5.6c2.66 0 4.5 1.37 4.5 3.72 0 2.8-2.27 4.58-5.5 4.58h-2.06l-.72 3.9H16.2L16.8 4.5zm1.54 6.6h1.63c1.87 0 2.92-.88 2.92-2.48 0-1.16-.8-1.78-2.24-1.78h-1.5l-.81 4.26z"
          fill="#009CDE"
        />
      </g>
      <text x="30" y="17" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="13" fontStyle="italic" fill="#003087">PayPal</text>
    </svg>
  );
}

export function CreditCardIcon({ className = "", monochrome = false }: IconProps) {
  // Generic card — always monochrome, uses currentColor
  void monochrome;
  return (
    <svg
      viewBox="0 0 24 16"
      className={className}
      aria-label="Credit card"
      role="img"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="1" width="22" height="14" rx="2" />
      <path d="M1 5.5h22" />
      <path d="M4 10.5h4" />
      <path d="M10 10.5h2" />
    </svg>
  );
}
