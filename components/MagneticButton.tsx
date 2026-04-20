"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { ReactNode, useRef } from "react";

type MagneticButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  strength?: number;
  as?: "a" | "button";
};

export default function MagneticButton({
  children,
  href,
  onClick,
  className = "",
  strength = 0.35,
  as,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 18, stiffness: 180, mass: 0.6 });
  const springY = useSpring(y, { damping: 18, stiffness: 180, mass: 0.6 });

  function handleMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mx = e.clientX - rect.left - rect.width / 2;
    const my = e.clientY - rect.top - rect.height / 2;
    x.set(mx * strength);
    y.set(my * strength);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const Tag = (as ?? (href ? "a" : "button")) as "a" | "button";
  const elProps = Tag === "a"
    ? { href }
    : { onClick, type: "button" as const };

  return (
    <motion.span
      style={{ x: springX, y: springY, display: "inline-block" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {/* @ts-expect-error - dynamic tag polymorphism */}
      <Tag ref={ref} className={className} {...elProps}>
        {children}
      </Tag>
    </motion.span>
  );
}
