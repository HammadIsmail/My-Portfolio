"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useGsapCircularScroll(dependencyList: any[] = []) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const cards = containerRef.current.querySelectorAll<HTMLElement>(".gsap-card");
    if (!cards || cards.length === 0) return;

    const triggers: ScrollTrigger[] = [];

    cards.forEach((card) => {
      // Set initial 3D perspective styles for circular arc effect
      gsap.set(card, {
        transformPerspective: 1000,
        transformOrigin: "center center -200px",
      });

      const trigger = ScrollTrigger.create({
        trigger: card,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress; // 0 (bottom of screen) -> 1 (top of screen)
          // Circular arc math: progress centered at 0.5
          const arcAngle = (progress - 0.5) * 35; // degrees tilt
          const scale = 1 - Math.abs(progress - 0.5) * 0.15;
          const opacity = Math.sin(progress * Math.PI); // smooth fade in/out at edges

          gsap.to(card, {
            rotationX: -arcAngle,
            rotationZ: (progress - 0.5) * 4,
            scale: Math.max(0.85, scale),
            opacity: Math.max(0.3, opacity),
            duration: 0.2,
            ease: "power1.out",
            overwrite: "auto",
          });
        },
      });

      triggers.push(trigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [dependencyList]);

  return containerRef;
}
