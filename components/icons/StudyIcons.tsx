"use client";

import Image from "next/image";

/**
 * Line-art icons for the 4-week perception study stats.
 *
 * 3 of 4 are PNG files supplied by FLO's asset library (icon-face.png,
 * icon-follicle.png, icon-droplet.png). They render black-on-transparent.
 * On dark surfaces (ShowerStudy) pass `dark` to invert to white.
 *
 * HairIcon remains inline SVG (no FLO counterpart provided) — uses currentColor
 * so parent text-color class controls stroke directly.
 */

type IconProps = { className?: string; size?: number; dark?: boolean };

function ImgIcon({ src, alt, className = "", size = 56, dark = false }: IconProps & { src: string; alt: string }) {
  return (
    <span className={`inline-block ${className}`} style={{ width: size, height: size }}>
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={dark ? "invert brightness-[1.08]" : ""}
      />
    </span>
  );
}

export function FaceIcon(props: IconProps) {
  return (
    <ImgIcon
      src="/product/icon-face.png"
      alt=""
      {...props}
    />
  );
}

export function FollicleIcon(props: IconProps) {
  return (
    <ImgIcon
      src="/product/icon-follicle.png"
      alt=""
      {...props}
    />
  );
}

export function DropletIcon(props: IconProps) {
  return (
    <ImgIcon
      src="/product/icon-droplet.png"
      alt=""
      {...props}
    />
  );
}

/**
 * HairIcon stays as inline SVG — no PNG counterpart supplied by FLO.
 * Inherits currentColor for parent text-color theming.
 */
export function HairIcon({ className = "", size = 56 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} strokeLinecap="round" strokeLinejoin="round">
      <path d="M28 48c-6 0-10-4-10-10V22c0-6 5-11 11-11 3 0 5 .8 7 2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M36 13c4 2 6 6 6 10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M42 23c4 3 6 8 6 14 0 7-4 13-10 15" stroke="currentColor" strokeWidth="1.5" />
      <path d="M44 28c3 3 4 7 3 11" stroke="currentColor" strokeWidth="1.3" opacity="0.7" />
      <path d="M46 36c2 2 3 5 2 8" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <circle cx="26" cy="28" r="0.8" fill="currentColor" />
      <path d="M22 30c-1 2-1 4 0 5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M50 18l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="currentColor" />
      <path d="M52 30l.8 1.5L54 32l-1.2.5L52 34l-.8-1.5L50 32l1.2-.5z" fill="currentColor" />
    </svg>
  );
}
