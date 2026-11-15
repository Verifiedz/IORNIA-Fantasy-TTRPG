export type MotionSetting = "full" | "reduced" | "off";

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// Automation tools (Playwright, and any headless/offscreen Chromium
// context) don't reliably drive requestAnimationFrame, which GSAP's
// ticker depends on — a timeline can stall forever with onComplete never
// firing. navigator.webdriver is set by every real automation driver, so
// treat it as "off" rather than hang the app.
export function isAutomated(): boolean {
  return typeof navigator !== "undefined" && navigator.webdriver === true;
}

// The single place every animated component resolves a requested motion
// setting against the OS preference and automation, per CLAUDE.md's
// "Honour the motion setting ... and prefers-reduced-motion in every
// animation."
export function resolveMotion(requested: MotionSetting): MotionSetting {
  if (requested === "off" || isAutomated()) return "off";
  if (requested === "reduced" || prefersReducedMotion()) return "reduced";
  return "full";
}
