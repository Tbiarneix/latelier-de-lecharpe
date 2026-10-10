"use client";

import { MotionConfig } from "framer-motion";

/** Les animations suivent la préférence système « réduire les animations ». */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
