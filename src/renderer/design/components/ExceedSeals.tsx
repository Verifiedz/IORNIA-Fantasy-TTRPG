import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { resolveMotion, type MotionSetting } from "../motion";

// Three wax seals, broken one at a time — CLAUDE.md's "3 per encounter ...
// shown as three seals that are broken one at a time."
export function ExceedSeals({
  used,
  total = 3,
  onBurn,
  motionSetting = "full",
}: {
  used: number;
  total?: number;
  onBurn: () => void;
  motionSetting?: MotionSetting;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const effectiveMotion = resolveMotion(motionSetting);

  useGSAP(
    () => {
      const seals = containerRef.current?.querySelectorAll<HTMLElement>(
        "[data-broken='true']",
      );
      if (!seals?.length || effectiveMotion === "off") return;

      if (effectiveMotion === "reduced") {
        gsap.fromTo(seals, { opacity: 1 }, { opacity: 0.35, duration: 0.3 });
        return;
      }

      gsap.fromTo(
        seals,
        { scale: 1, opacity: 1 },
        { scale: 0.85, opacity: 0.35, duration: 0.4, ease: "power2.out" },
      );
    },
    { scope: containerRef, dependencies: [used, effectiveMotion] },
  );

  return (
    <div ref={containerRef} className="flex gap-2">
      {Array.from({ length: total }, (_, i) => {
        const broken = used > i;
        return (
          <button
            key={i}
            onClick={onBurn}
            disabled={broken}
            data-broken={broken}
            title={broken ? "Broken" : "Burn"}
            className={`h-6 w-6 rounded-full border-2 ${
              broken
                ? "border-parchment-dark/40 bg-night-deep"
                : "border-gold bg-gold/30"
            }`}
          />
        );
      })}
    </div>
  );
}
