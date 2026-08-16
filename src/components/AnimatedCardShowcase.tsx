"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AnimatedCardShowcaseProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getItemKey?: (item: T, index: number) => string | number;
}

export function AnimatedCardShowcase<T>({
  items,
  renderItem,
  getItemKey,
}: AnimatedCardShowcaseProps<T>) {
  const [[currentIndex, direction], setPage] = useState<[number, number]>([0, 0]);
  const prefersReducedMotion = useReducedMotion();
  const isAnimatingRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const total = items.length;

  const paginate = useCallback(
    (newDirection: number) => {
      if (isAnimatingRef.current) return;

      setPage(([prevIndex]) => {
        const nextIndex = prevIndex + newDirection;
        if (nextIndex < 0 || nextIndex >= total) {
          return [prevIndex, 0];
        }
        isAnimatingRef.current = true;
        return [nextIndex, newDirection];
      });

      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 450);
    },
    [total]
  );

  const goToIndex = useCallback(
    (targetIndex: number) => {
      if (isAnimatingRef.current) return;
      setPage(([prevIndex]) => {
        if (targetIndex === prevIndex) return [prevIndex, 0];
        const newDirection = targetIndex > prevIndex ? 1 : -1;
        isAnimatingRef.current = true;
        return [targetIndex, newDirection];
      });

      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 450);
    },
    []
  );

  // Touch handlers for swipe support
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;

    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    // Trigger swipe if horizontal movement is prominent and above threshold (40px)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0 && currentIndex < total - 1) {
        paginate(1);
      } else if (deltaX > 0 && currentIndex > 0) {
        paginate(-1);
      }
    }
  };

  if (total === 0) {
    return null;
  }

  const slideVariants = {
    enter: (dir: number) => ({
      x: prefersReducedMotion ? 0 : dir > 0 ? 140 : -140,
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: prefersReducedMotion ? 0 : dir < 0 ? 140 : -140,
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 0.96,
    }),
  };

  const activeItem = items[currentIndex];
  const itemKey = getItemKey ? getItemKey(activeItem, currentIndex) : currentIndex;

  return (
    <div
      className="relative w-full max-w-4xl mx-auto flex flex-col items-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Bar with Counter & Arrow Controls */}
      {total > 1 && (
        <div className="w-full flex items-center justify-between mb-3 sm:mb-4 px-1 sm:px-2">
          {/* Index Counter */}
          <div className="neo-inset-sm px-3 py-1 rounded-full text-xs font-semibold text-primary tracking-wider">
            {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => paginate(-1)}
              disabled={currentIndex === 0}
              className="p-2 sm:p-2.5 rounded-xl neo-button disabled:opacity-40 disabled:pointer-events-none transition-all touch-manipulation"
              aria-label="Previous item"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
            </button>
            <button
              onClick={() => paginate(1)}
              disabled={currentIndex === total - 1}
              className="p-2 sm:p-2.5 rounded-xl neo-button disabled:opacity-40 disabled:pointer-events-none transition-all touch-manipulation"
              aria-label="Next item"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
            </button>
          </div>
        </div>
      )}

      {/* Animated Card Viewport */}
      <div className="w-full relative overflow-hidden flex items-center justify-center p-1">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={itemKey}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "tween", duration: 0.5, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 },
            }}
            className="w-full"
          >
            {renderItem(activeItem, currentIndex)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Dot Indicators */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-5">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 touch-manipulation ${
                idx === currentIndex
                  ? "w-7 neo-button-primary"
                  : "w-2.5 neo-button opacity-70 hover:opacity-100"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
