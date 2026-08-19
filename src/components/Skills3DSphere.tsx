"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Icon } from "@iconify/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export interface SkillItem {
  name: string;
  icon: string;
  category: string;
  level?: string;
  description?: string;
}

interface Skills3DSphereProps {
  skills: SkillItem[];
  activeCategory?: string;
  onSelectSkill?: (skill: SkillItem) => void;
  className?: string;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
  skill: SkillItem;
  id: string;
}

interface ProjectedPoint extends Point3D {
  screenX: number;
  screenY: number;
  scale: number;
  opacity: number;
  zIndex: number;
}

export const Skills3DSphere: React.FC<Skills3DSphereProps> = ({
  skills,
  activeCategory = "All",
  onSelectSkill,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [radius, setRadius] = useState<number>(200);

  // Filter skills based on category
  const filteredSkills = useMemo(() => {
    if (!activeCategory || activeCategory === "All") return skills;
    return skills.filter(
      (s) => s.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [skills, activeCategory]);

  // Rotation angles and velocities
  const rotationRef = useRef({ rx: 0, ry: 0, vx: 0.003, vy: 0.004 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const isHoveredRef = useRef(false);

  // Responsive radius calculation
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight || 500;

      // Determine radius based on width first (original behavior)
      let r = 230;
      if (width < 480) {
        r = 120;
      } else if (width < 768) {
        r = 165;
      } else if (width < 1024) {
        r = 200;
      }

      // Ensure it doesn't exceed 40% of the container height to prevent top/bottom clipping
      const maxRadiusByHeight = height * 0.4;
      if (r > maxRadiusByHeight) {
        r = Math.max(70, Math.floor(maxRadiusByHeight));
      }

      setRadius(r);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Fibonacci Sphere coordinate calculation
  const rawPoints = useMemo<Point3D[]>(() => {
    const count = filteredSkills.length;
    if (count === 0) return [];

    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    return filteredSkills.map((skill, index) => {
      // Fibonacci spiral distribution
      const theta = 2 * Math.PI * index / goldenRatio;
      const phi = Math.acos(1 - (2 * (index + 0.5)) / count);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return {
        x,
        y,
        z,
        skill,
        id: `${skill.name}-${index}`,
      };
    });
  }, [filteredSkills, radius]);

  // Projected 2D points state
  const [projectedPoints, setProjectedPoints] = useState<ProjectedPoint[]>([]);

  // Animation Loop using GSAP ticker
  useEffect(() => {
    const focalLength = 400;

    const tick = () => {
      const rot = rotationRef.current;

      // Physics deceleration or ambient auto-rotation
      if (!isDraggingRef.current) {
        if (!isHoveredRef.current) {
          // Restore to ambient rotation speed smoothly
          rot.vx += (0.003 - rot.vx) * 0.05;
          rot.vy += (0.004 - rot.vy) * 0.05;
        } else {
          // Slow down when hovering over a node
          rot.vx *= 0.92;
          rot.vy *= 0.92;
        }
      } else {
        // Friction when dragging
        rot.vx *= 0.95;
        rot.vy *= 0.95;
      }

      rot.rx += rot.vx;
      rot.ry += rot.vy;

      const cosX = Math.cos(rot.rx);
      const sinX = Math.sin(rot.rx);
      const cosY = Math.cos(rot.ry);
      const sinY = Math.sin(rot.ry);

      const projected: ProjectedPoint[] = rawPoints.map((pt) => {
        // Rotation around X axis
        const y1 = pt.y * cosX - pt.z * sinX;
        const z1 = pt.y * sinX + pt.z * cosX;

        // Rotation around Y axis
        const x2 = pt.x * cosY + z1 * sinY;
        const z2 = -pt.x * sinY + z1 * cosY;

        // Perspective scale & depth projection
        const scale = focalLength / (focalLength - z2);
        const screenX = x2 * scale;
        const screenY = y1 * scale;

        // Opacity mapping [-radius, radius] => [0.25, 1]
        const normZ = z2 / radius; // -1 to 1
        const opacity = Math.max(0.2, Math.min(1, (normZ + 1.2) / 2.2));
        const zIndex = Math.floor((normZ + 2) * 100);

        return {
          ...pt,
          screenX,
          screenY,
          scale: Math.max(0.5, Math.min(1.3, scale * 0.85)),
          opacity,
          zIndex,
        };
      });

      setProjectedPoints(projected);

      // Render constellation connections on canvas
      const canvas = canvasRef.current;
      if (canvas && projected.length > 0) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const width = canvas.width;
          const height = canvas.height;
          ctx.clearRect(0, 0, width, height);

          const centerX = width / 2;
          const centerY = height / 2;

          const maxDist = radius * 1.35;

          for (let i = 0; i < projected.length; i++) {
            for (let j = i + 1; j < projected.length; j++) {
              const p1 = projected[i];
              const p2 = projected[j];

              // Skip connections if both points are in the far background
              if (p1.opacity < 0.35 && p2.opacity < 0.35) continue;

              const dx = p1.screenX - p2.screenX;
              const dy = p1.screenY - p2.screenY;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < maxDist) {
                const lineAlpha = (1 - dist / maxDist) * Math.min(p1.opacity, p2.opacity) * 0.35;
                ctx.beginPath();
                ctx.moveTo(centerX + p1.screenX, centerY + p1.screenY);
                ctx.lineTo(centerX + p2.screenX, centerY + p2.screenY);
                ctx.strokeStyle = `rgba(234, 179, 8, ${lineAlpha})`; // Gold/Yellow theme accent
                ctx.lineWidth = Math.max(0.6, lineAlpha * 2);
                ctx.stroke();
              }
            }
          }
        }
      }
    };

    // Use GSAP ticker for 60fps smooth loop
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
    };
  }, [rawPoints, radius]);

  // Synchronize canvas dimensions with container
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Mouse & Touch Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;

    rotationRef.current.vy = dx * 0.005;
    rotationRef.current.rx -= dy * 0.005;

    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-[460px] sm:h-[540px] md:h-[600px] flex items-center justify-center select-none overflow-hidden touch-none cursor-grab active:cursor-grabbing rounded-3xl p-4",
        !className && "neo-raised",
        className
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
        <div
          className="rounded-full bg-primary/20 blur-3xl transition-all duration-700"
          style={{ width: radius * 2.2, height: radius * 2.2 }}
        />
      </div>

      {/* Background Constellation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Floating 3D Nodes */}
      <div className="absolute top-1/2 left-1/2 w-0 h-0 flex items-center justify-center">
        {projectedPoints.map((pt) => {
          const isHovered = hoveredSkill?.name === pt.skill.name;
          const isSelected = selectedSkill?.name === pt.skill.name;

          return (
            <div
              key={pt.id}
              className="absolute top-0 left-0 transition-transform duration-75 ease-out"
              style={{
                transform: `translate3d(${pt.screenX}px, ${pt.screenY}px, 0px) translate(-50%, -50%) scale(${isHovered ? pt.scale * 1.25 : pt.scale
                  })`,
                opacity: pt.opacity,
                zIndex: isHovered ? 9999 : pt.zIndex,
              }}
              onMouseEnter={() => {
                setHoveredSkill(pt.skill);
                isHoveredRef.current = true;
              }}
              onMouseLeave={() => {
                setHoveredSkill(null);
                isHoveredRef.current = false;
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSkill(pt.skill);
                onSelectSkill?.(pt.skill);
              }}
            >
              <div
                className={`group flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl transition-all duration-300 backdrop-blur-md cursor-pointer ${isHovered || isSelected
                    ? "neo-raised ring-2 ring-primary shadow-xl bg-card/95 scale-110"
                    : pt.opacity > 0.6
                      ? "neo-raised-sm bg-card/80 hover:bg-card"
                      : "neo-inset-sm bg-card/60"
                  }`}
              >
                <div
                  className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center shrink-0"
                  data-skill={pt.skill.name}
                >
                  <Icon
                    icon={pt.skill.icon}
                    className={`w-full h-full transition-transform duration-300 ${isHovered ? "scale-110 rotate-6" : ""
                      } ${(pt.skill.name === "Kafka" || pt.skill.name === "Neo4j") ? "kafka-neo4j-icon" : ""}`}
                  />
                </div>
                <span
                  className={`text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-colors ${isHovered || isSelected
                      ? "text-primary font-bold"
                      : "text-foreground/90"
                    }`}
                >
                  {pt.skill.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Active Skill Badge / Tooltip */}
      {(hoveredSkill || selectedSkill) && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-2xl neo-raised bg-card/90 backdrop-blur-md border border-primary/30 shadow-2xl flex items-center gap-3 animate-fade-in pointer-events-none z-50">
          <div className="w-8 h-8 flex items-center justify-center p-1 rounded-xl neo-inset-sm bg-primary/10">
            <Icon
              icon={(hoveredSkill || selectedSkill)!.icon}
              className="w-full h-full text-primary"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">
                {(hoveredSkill || selectedSkill)!.name}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full neo-inset-sm text-primary font-semibold">
                {(hoveredSkill || selectedSkill)!.category}
              </span>
            </div>
            {(hoveredSkill || selectedSkill)!.level && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Proficiency: <span className="text-foreground font-medium">{(hoveredSkill || selectedSkill)!.level}</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Drag Instruction Banner */}
      <div className="absolute top-4 right-4 pointer-events-none flex items-center gap-1.5 px-3 py-1.5 rounded-full neo-inset-sm bg-card/70 text-[11px] text-muted-foreground backdrop-blur-sm">
        <Icon icon="lucide:move-3d" className="w-3.5 h-3.5 text-primary animate-pulse" />
        <span>Drag & Rotate 3D</span>
      </div>
    </div>
  );
};

export default Skills3DSphere;
