"use client";

import { services } from "@/data/services";
import { Layers, LayoutGrid, Orbit } from "lucide-react";
import { useState } from "react";
import ServiceCard from "./ServiceCard";
import { OrbitingServices3D } from "./OrbitingServices3D";

const Services = () => {
  const [viewMode, setViewMode] = useState<"3d" | "grid">("3d");

  return (
    <section id="services" className="py-8 sm:py-12 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300 border-2 border-[var(--pop-border)] font-extrabold text-xs mb-2 shadow-[2px_2px_0px_#1e1b2e]">
              <Layers className="w-3.5 h-3.5" />
              <span>SOLUTIONS & EXPERTISE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight whitespace-nowrap">
              Technical Services
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-medium">
              Building scalable web applications, AI-powered solutions, and cross-platform mobile experiences.
            </p>
          </div>

          {/* 3D Orbit vs Grid View Switcher */}
          <div className="inline-flex items-center p-1.5 bg-card border-2.5 border-[var(--pop-border)] rounded-full shadow-[3px_3px_0px_#1e1b2e] dark:shadow-[3px_3px_0px_#ffffff] self-start md:self-auto">
            <button
              onClick={() => setViewMode("3d")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                viewMode === "3d"
                  ? "bg-sky-500 text-white border-1.5 border-[var(--pop-border)] shadow-[2px_2px_0px_#1e1b2e]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Orbit className="w-3.5 h-3.5" />
              <span>3D Orbit</span>
            </button>

            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                viewMode === "grid"
                  ? "bg-purple-600 text-white border-1.5 border-[var(--pop-border)] shadow-[2px_2px_0px_#1e1b2e]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
          </div>
        </div>

        {/* View Mode Rendering */}
        {viewMode === "3d" ? (
          <OrbitingServices3D services={services} />
        ) : (
          <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;