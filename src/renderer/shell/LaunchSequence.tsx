import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(SplitText, DrawSVGPlugin);

export type MotionSetting = "full" | "reduced" | "off";

interface LaunchSequenceProps {
  motionSetting?: MotionSetting;
  onComplete: () => void;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function LaunchSequence({
  motionSetting = "full",
  onComplete,
}: LaunchSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ruleRef = useRef<SVGPathElement>(null);

  const effectiveMotion: MotionSetting =
    motionSetting === "off"
      ? "off"
      : prefersReducedMotion()
        ? "reduced"
        : motionSetting;

  useGSAP(
    () => {
      if (effectiveMotion === "off") {
        onComplete();
        return;
      }

      if (effectiveMotion === "reduced") {
        gsap
          .timeline({ onComplete })
          .to(containerRef.current, { opacity: 0, duration: 0.3, delay: 0.3 });
        return;
      }

      const split = SplitText.create(titleRef.current, { type: "chars" });

      gsap
        .timeline({ onComplete })
        .from(split.chars, {
          opacity: 0,
          y: 16,
          duration: 0.4,
          stagger: 0.04,
          ease: "power2.out",
        })
        .fromTo(
          ruleRef.current,
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 0.5, ease: "power1.inOut" },
          "-=0.1",
        )
        .to(containerRef.current, { opacity: 0, duration: 0.3, delay: 0.4 });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-night"
    >
      <h1
        ref={titleRef}
        className="font-wordmark text-5xl tracking-widest text-gold-bright"
      >
        IORNIA
      </h1>
      <svg width="220" height="8" viewBox="0 0 220 8" aria-hidden="true">
        <path
          ref={ruleRef}
          d="M4 4 H216"
          stroke="var(--color-gold)"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>
  );
}
