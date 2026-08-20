"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Code } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { useRouter } from "next/navigation";

export interface ProjectData {
  id: string | number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
}

interface OrbitingProjects3DProps {
  projects: ProjectData[];
}

export const OrbitingProjects3D: React.FC<OrbitingProjects3DProps> = ({ projects }) => {
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startAngleRef = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { openCaseStudy, isMobile } = usePortfolio();
  const router = useRouter();

  const total = projects.length;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radiusX = Math.min(centerX, centerY) * 0.72;
      const radiusY = radiusX * 0.38;

      const rings = [
        { color: "#22c55e", glow: "rgba(34, 197, 94, 0.85)", tilt: -Math.PI / 4, speed: 1.2 },
        { color: "#a855f7", glow: "rgba(168, 85, 247, 0.85)", tilt: Math.PI / 3.5, speed: 0.9 },
        { color: "#f59e0b", glow: "rgba(245, 158, 11, 0.85)", tilt: Math.PI / 1.8, speed: 1.4 },
      ];

      rings.forEach((ring, idx) => {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(ring.tilt);

        ctx.beginPath();
        ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 4;
        ctx.shadowColor = ring.glow;
        ctx.shadowBlur = 20;
        ctx.stroke();

        const sphereAngle = time * ring.speed + (idx * Math.PI) / 1.5;
        const sx = radiusX * Math.cos(sphereAngle);
        const sy = radiusY * Math.sin(sphereAngle);

        ctx.beginPath();
        ctx.arc(sx, sy, 9, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = ring.color;
        ctx.shadowBlur = 22;
        ctx.fill();
        ctx.restore();
      });

      ctx.save();
      ctx.translate(centerX, centerY);

      const outerGlow = ctx.createRadialGradient(0, 0, 10, 0, 0, 65);
      outerGlow.addColorStop(0, "rgba(168, 85, 247, 0.65)");
      outerGlow.addColorStop(1, "rgba(168, 85, 247, 0)");
      ctx.beginPath();
      ctx.arc(0, 0, 65, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();

      const nucleusGradient = ctx.createRadialGradient(0, 0, 6, 0, 0, 38);
      nucleusGradient.addColorStop(0, "#f3e8ff");
      nucleusGradient.addColorStop(0.4, "#c084fc");
      nucleusGradient.addColorStop(0.8, "#9333ea");
      nucleusGradient.addColorStop(1, "#581c87");

      const pulse = Math.sin(time * 2.5) * 3;
      ctx.beginPath();
      ctx.arc(0, 0, 34 + pulse, 0, Math.PI * 2);
      ctx.fillStyle = nucleusGradient;
      ctx.shadowColor = "#a855f7";
      ctx.shadowBlur = 32;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(-9, -9, 9, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fill();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    if (isHovered || isDragging || total === 0) return;
    let animationFrame: number;

    const autoRotate = () => {
      setOrbitAngle((prev) => prev + 0.004);
      animationFrame = requestAnimationFrame(autoRotate);
    };

    animationFrame = requestAnimationFrame(autoRotate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isHovered, isDragging, total]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    startAngleRef.current = orbitAngle;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    setOrbitAngle(startAngleRef.current + deltaX * 0.005);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePrev = () => {
    const step = (2 * Math.PI) / Math.max(total, 1);
    setOrbitAngle((prev) => prev + step);
  };

  const handleNext = () => {
    const step = (2 * Math.PI) / Math.max(total, 1);
    setOrbitAngle((prev) => prev - step);
  };

  const handleDetailsClick = (projectId: string | number) => {
    if (isMobile) {
      router.push(`/project/${projectId}`);
    } else {
      openCaseStudy(String(projectId));
    }
  };

  if (total === 0) return null;

  const bannerAccents = [
    { titleColor: "text-purple-400" },
    { titleColor: "text-emerald-400" },
    { titleColor: "text-sky-400" },
    { titleColor: "text-amber-400" },
    { titleColor: "text-rose-400" },
  ];

  const getActiveIndex = () => {
    const step = (2 * Math.PI) / total;
    let normalized = ((-orbitAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    return Math.round(normalized / step) % total;
  };

  const activeIndex = getActiveIndex();

  return (
    <div
      ref={containerRef}
      className="relative w-full py-8 overflow-hidden min-h-[640px] flex flex-col items-center justify-center select-none touch-none cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[25]">
        <canvas
          ref={canvasRef}
          width={520}
          height={520}
          className="max-w-[85vw] max-h-[520px] h-auto object-contain"
        />
      </div>

      <div className="relative z-50 w-full flex items-center justify-between px-3 sm:px-8 mb-4 max-w-5xl">
        <div className="bg-card/90 backdrop-blur-sm border-2 border-[var(--pop-border)] shadow-[2.5px_2.5px_0px_#1e1b2e] dark:shadow-[2.5px_2.5px_0px_#ffffff] px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-black tracking-wide text-foreground flex items-center gap-1.5 whitespace-nowrap">
          <span>PROJECTS</span>
          <span className="text-purple-600 font-extrabold">({activeIndex + 1}/{total})</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2 sm:p-2.5 rounded-full bg-card border-2 border-[var(--pop-border)] shadow-[2.5px_2.5px_0px_#1e1b2e] dark:shadow-[2.5px_2.5px_0px_#ffffff] hover:translate-y-[-2px] transition-all"
            aria-label="Orbit left"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 sm:p-2.5 rounded-full bg-card border-2 border-[var(--pop-border)] shadow-[2.5px_2.5px_0px_#1e1b2e] dark:shadow-[2.5px_2.5px_0px_#ffffff] hover:translate-y-[-2px] transition-all"
            aria-label="Orbit right"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
          </button>
        </div>
      </div>

      <div className="relative w-full max-w-5xl min-h-[480px] flex items-center justify-center">
        {projects.map((project, idx) => {
          const cardAngle = (idx * 2 * Math.PI) / total + orbitAngle;

          const radiusX = 340;
          const radiusZ = 180;
          
          const x = radiusX * Math.sin(cardAngle);
          const z = radiusZ * Math.cos(cardAngle);
          const y = Math.sin(cardAngle * 2) * 12;

          const depthFactor = (z + radiusZ) / (2 * radiusZ);

          const scale = 0.68 + depthFactor * 0.37;
          const opacity = 0.35 + depthFactor * 0.65;
          const zIndex = Math.floor(depthFactor * 30) + 10;
          const rotateY = -Math.sin(cardAngle) * 22;

          const isFrontMost = depthFactor > 0.85;
          const accent = bannerAccents[idx % bannerAccents.length];

          return (
            <motion.div
              key={project.id}
              initial={false}
              animate={{
                x,
                y,
                scale,
                opacity,
                rotateY,
              }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 20,
              }}
              style={{
                zIndex,
                transformStyle: "preserve-3d",
              }}
              onClick={() => {
                const targetAngle = -(idx * 2 * Math.PI) / total;
                setOrbitAngle(targetAngle);
              }}
              className={`absolute w-[280px] sm:w-[330px] cursor-pointer ${
                isFrontMost ? "pointer-events-auto" : "pointer-events-auto filter brightness-90 hover:brightness-100"
              }`}
            >
              <div
                className={`bg-card rounded-3xl border-3 border-[var(--pop-border)] overflow-hidden transition-all duration-300 ${
                  isFrontMost
                    ? "shadow-[7px_7px_0px_#1e1b2e] dark:shadow-[7px_7px_0px_#ffffff] ring-2 ring-purple-500/40"
                    : "shadow-[4px_4px_0px_#1e1b2e] dark:shadow-[4px_4px_0px_#ffffff]"
                }`}
              >
                <div className="bg-[#1e172a] px-4 py-3 flex items-center justify-center gap-2 border-b-2.5 border-[var(--pop-border)]">
                  <Code className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span className={`font-black text-sm sm:text-lg tracking-wide ${accent.titleColor} truncate`}>
                    {project.title}
                  </span>
                </div>

                <div className="p-4 sm:p-6 bg-card flex flex-col justify-between min-h-[240px]">
                  <div>
                    <h3 className="text-base sm:text-xl font-black text-foreground mb-2 text-center">
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 text-center mb-4 font-medium">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-1.5 mb-5">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-slate-100 dark:bg-slate-800 text-foreground border border-[var(--pop-border)] shadow-[1px_1px_0px_#1e1b2e]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDetailsClick(project.id);
                    }}
                    className="w-full py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs sm:text-sm border-2.5 border-[var(--pop-border)] shadow-[3.5px_3.5px_0px_#1e1b2e] dark:shadow-[3.5px_3.5px_0px_#ffffff] hover:translate-y-[-2px] transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Details ✦</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="relative z-50 flex items-center justify-center gap-2 mt-4">
        {projects.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              const targetAngle = -(idx * 2 * Math.PI) / total;
              setOrbitAngle(targetAngle);
            }}
            className={`h-3 rounded-full transition-all duration-300 border border-[var(--pop-border)] ${
              idx === activeIndex
                ? "w-8 bg-purple-600 shadow-[2px_2px_0px_#1e1b2e]"
                : "w-3 bg-slate-300 dark:bg-slate-700"
            }`}
            aria-label={`Orbit to project ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default OrbitingProjects3D;
