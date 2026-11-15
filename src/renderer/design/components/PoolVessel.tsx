import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { resolveMotion, type MotionSetting } from "../motion";

const MARKS = [90, 75, 50, 25];

// The sheet's pool vessel: the number updates instantly, the fill
// animates to match, per CLAUDE.md's "two animated vessels ... the
// number updates instantly; the animation follows." Animates `transform`
// (scaleX) only, never `width`, per the design system's motion rule.
export function PoolVessel({
  value,
  depleted = false,
  motionSetting = "full",
}: {
  value: number;
  depleted?: boolean;
  motionSetting?: MotionSetting;
}) {
  const fillRef = useRef<HTMLDivElement>(null);
  const effectiveMotion = resolveMotion(motionSetting);
  const scale = Math.max(0, Math.min(1, value / 100));

  useGSAP(
    () => {
      const fill = fillRef.current;
      if (!fill) return;

      if (effectiveMotion === "off") {
        gsap.set(fill, { scaleX: scale });
        return;
      }

      if (effectiveMotion === "reduced") {
        // Cross-fade only: snap to the new level, pulse opacity instead
        // of tweening the fill's width/scale.
        gsap.set(fill, { scaleX: scale });
        gsap.fromTo(fill, { opacity: 0.4 }, { opacity: 1, duration: 0.3 });
        return;
      }

      gsap.to(fill, { scaleX: scale, duration: 0.6, ease: "power2.out" });
    },
    { scope: fillRef, dependencies: [scale, effectiveMotion] },
  );

  return (
    <div className="relative h-5 w-full overflow-hidden rounded border border-gold/40 bg-night-deep">
      <div
        ref={fillRef}
        className={`h-full w-full origin-left ${depleted ? "bg-blood" : "bg-gold"}`}
        style={{ transform: `scaleX(${scale})` }}
      />
      {MARKS.map((mark) => (
        <div
          key={mark}
          className="absolute top-0 h-full w-px bg-night/60"
          style={{ left: `${mark}%` }}
        />
      ))}
    </div>
  );
}
