"use client";

import { useEffect } from "react";
import { initScrollDepth } from "@/lib/analytics";

export default function ScrollDepthTracker() {
  useEffect(() => initScrollDepth(), []);
  return null;
}
