"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useGsap3DCircularCarousel(itemCount: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateCarousel = useCallback((targetIndex: number) => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll<HTMLElement>(".gsap-circular-card");
    if (!cards || cards.length === 0) return;

    const containerWidth = containerRef.current.offsetWidth || 700;

    cards.forEach((card, index) => {
      const delta = index - targetIndex; // 0 = active card in center
      const absDelta = Math.abs(delta);

      // Clean 3D Circular Arc trajectory:
      // Active card (delta === 0): centered (x=0, opacity=1, zIndex=100, rotateY=0, rotateZ=0, scale=1)
      // Past cards (delta < 0): offset to RIGHT with smooth arc fade out
      // Upcoming cards (delta > 0): offset to LEFT with smooth arc fade out
      const x = delta < 0 ? absDelta * (containerWidth * 0.85) : -delta * (containerWidth * 0.85);
      const y = Math.pow(absDelta, 1.8) * 50;
      const rotateY = delta < 0 ? -Math.min(50, absDelta * 40) : Math.min(50, delta * 40);
      const rotateZ = delta < 0 ? -Math.min(15, absDelta * 10) : Math.min(15, delta * 10);
      const scale = Math.max(0.65, 1 - absDelta * 0.2);
      // Fast opacity fade so inactive cards don't obstruct active card
      const opacity = absDelta < 0.1 ? 1 : Math.max(0, 1 - absDelta * 1.5);
      const zIndex = absDelta < 0.5 ? 100 : Math.max(1, 50 - Math.round(absDelta * 20));

      gsap.to(card, {
        x,
        y,
        rotationY: rotateY,
        rotationZ: rotateZ,
        scale,
        opacity,
        zIndex,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current || itemCount <= 0) return;

    const containerEl = containerRef.current;
    const cards = containerEl.querySelectorAll<HTMLElement>(".gsap-circular-card");
    if (!cards || cards.length === 0) return;

    // Detect scroll container (.overflow-y-auto or window)
    const scrollerEl = containerEl.closest(".overflow-y-auto") || window;

    gsap.set(containerEl, {
      perspective: 1200,
      transformStyle: "preserve-3d",
    });

    cards.forEach((card) => {
      gsap.set(card, {
        transformOrigin: "center center -150px",
        backfaceVisibility: "hidden",
      });
    });

    // Initial position
    updateCarousel(0);

    // ScrollTrigger instance configured with custom scroller
    const trigger = ScrollTrigger.create({
      trigger: containerEl,
      scroller: scrollerEl,
      start: "top 35%",
      end: `+=${itemCount * 250}`,
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;
        const targetFloat = progress * (itemCount - 1);
        setActiveIndex(Math.round(targetFloat));
        updateCarousel(targetFloat);
      },
    });

    // Mouse wheel handler for instant feedback
    let wheelTimeout: NodeJS.Timeout;
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 10) {
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          setActiveIndex((prev) => {
            const dir = e.deltaY > 0 ? 1 : -1;
            const nextIdx = Math.max(0, Math.min(itemCount - 1, prev + dir));
            updateCarousel(nextIdx);
            return nextIdx;
          });
        }, 40);
      }
    };

    containerEl.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      trigger.kill();
      containerEl.removeEventListener("wheel", handleWheel);
    };
  }, [itemCount, updateCarousel]);

  const goToNext = () => {
    setActiveIndex((prev) => {
      const nextIdx = Math.min(itemCount - 1, prev + 1);
      updateCarousel(nextIdx);
      return nextIdx;
    });
  };

  const goToPrev = () => {
    setActiveIndex((prev) => {
      const prevIdx = Math.max(0, prev - 1);
      updateCarousel(prevIdx);
      return prevIdx;
    });
  };

  return { containerRef, activeIndex, goToNext, goToPrev };
}
