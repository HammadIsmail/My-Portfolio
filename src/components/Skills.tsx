"use client";

import React, { useState } from "react";
import { Zap } from "lucide-react";
import Skills3DSphere, { SkillItem } from "./Skills3DSphere";

export const ALL_SKILLS: SkillItem[] = [
  // Frontend & Core
  { name: "TypeScript", icon: "logos:typescript-icon", category: "Frontend Core", level: "Expert" },
  { name: "React.js", icon: "logos:react", category: "Frontend Core", level: "Expert" },
  { name: "Tailwind CSS", icon: "logos:tailwindcss-icon", category: "Frontend Core", level: "Expert" },
  { name: "JavaScript", icon: "logos:javascript", category: "Frontend Core", level: "Expert" },
  { name: "Next.js", icon: "logos:nextjs-icon", category: "Frameworks & 3D", level: "Expert" },
  { name: "Three.js / 3D", icon: "logos:threejs", category: "Frameworks & 3D", level: "Advanced" },
  { name: "Framer Motion", icon: "logos:framer", category: "Frameworks & 3D", level: "Advanced" },

  // Design & Tools
  { name: "Figma / UX", icon: "logos:figma", category: "Design & Tools", level: "Advanced" },
  { name: "Web Audio API", icon: "lucide:music", category: "Design & Tools", level: "Advanced" },
  { name: "Git / GitHub", icon: "logos:git-icon", category: "Design & Tools", level: "Expert" },
  { name: "REST / GraphQL", icon: "logos:graphql", category: "Backend & Cloud", level: "Advanced" },
  { name: "CSS Animations", icon: "logos:css-3", category: "Frontend Core", level: "Expert" },
  { name: "Vite", icon: "logos:vitejs", category: "Design & Tools", level: "Advanced" },

  // Backend & Cloud
  { name: "Node.js", icon: "logos:nodejs-icon", category: "Backend & Cloud", level: "Advanced" },
  { name: "FastAPI", icon: "devicon:fastapi", category: "Backend & Cloud", level: "Advanced" },
  { name: "MongoDB", icon: "logos:mongodb-icon", category: "Backend & Cloud", level: "Expert" },
  { name: "PostgreSQL", icon: "logos:postgresql", category: "Backend & Cloud", level: "Proficient" },
  { name: "Socket.IO", icon: "simple-icons:socketdotio", category: "Backend & Cloud", level: "Advanced" },
  { name: "Docker", icon: "logos:docker-icon", category: "Backend & Cloud", level: "Advanced" },
  { name: "AWS", icon: "logos:aws", category: "Backend & Cloud", level: "Proficient" },
];

const CATEGORIES = ["All", "Frontend Core", "Frameworks & 3D", "Design & Tools", "Backend & Cloud"];

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <section id="skills" className="py-12 sm:py-16 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl flex flex-col items-center">
        {/* Top Badge & Section Title */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border-2 border-[var(--pop-border)] font-extrabold text-xs mb-3 shadow-[2.5px_2.5px_0px_#1e1b2e] dark:shadow-[2.5px_2.5px_0px_#ffffff]">
          <Zap className="w-4 h-4 fill-emerald-500 text-emerald-500" />
          <span>SKILLS & TOOLKIT</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight text-center mb-8">
          Skills
        </h2>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold border-2 border-[var(--pop-border)] transition-all ${
                  isActive
                    ? "bg-purple-600 text-white shadow-[3px_3px_0px_#1e1b2e] dark:shadow-[3px_3px_0px_#ffffff]"
                    : "bg-card text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 shadow-[2px_2px_0px_#1e1b2e] dark:shadow-[2px_2px_0px_#ffffff]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* 3D Skills Sphere Container */}
        <div className="w-full pop-card-lg p-2 sm:p-4 bg-card/90">
          <Skills3DSphere
            skills={ALL_SKILLS}
            activeCategory={activeCategory}
            className="border-none shadow-none bg-transparent"
          />
        </div>
      </div>
    </section>
  );
};

export default Skills;
