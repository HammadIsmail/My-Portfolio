"use client";

import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { usePortfolio } from "@/context/PortfolioContext";
import Skills3DSphere, { SkillItem } from "./Skills3DSphere";

const ALL_SKILLS: SkillItem[] = [
  // Frontend
  { name: "React", icon: "logos:react", category: "Frontend", level: "Expert" },
  { name: "Next.js", icon: "logos:nextjs-icon", category: "Frontend", level: "Expert" },
  { name: "TypeScript", icon: "logos:typescript-icon", category: "Frontend", level: "Advanced" },
  { name: "React Native", icon: "logos:react", category: "Frontend", level: "Advanced" },
  { name: "TailwindCSS", icon: "logos:tailwindcss-icon", category: "Frontend", level: "Expert" },

  // Backend
  { name: "Node.js", icon: "logos:nodejs-icon", category: "Backend", level: "Advanced" },
  { name: "FastAPI", icon: "devicon:fastapi", category: "Backend", level: "Advanced" },
  { name: "MongoDB", icon: "logos:mongodb-icon", category: "Backend", level: "Expert" },
  { name: "PostgreSQL", icon: "logos:postgresql", category: "Backend", level: "Proficient" },
  { name: "SQLite", icon: "devicon:sqlite", category: "Backend", level: "Proficient" },
  { name: "Socket.IO", icon: "simple-icons:socketdotio", category: "Backend", level: "Advanced" },
  { name: "Neo4j", icon: "logos:neo4j", category: "Backend", level: "Advanced" },
  { name: "Redis", icon: "logos:redis", category: "Backend", level: "Advanced" },
  { name: "Kafka", icon: "logos:kafka", category: "Backend", level: "Advanced" },

  // AI & ML
  { name: "AI Integration", icon: "hugeicons:ai-brain-04", category: "AI & ML", level: "Expert" },
  { name: "OpenAI APIs", icon: "simple-icons:openai", category: "AI & ML", level: "Expert" },
  { name: "Ollama", icon: "simple-icons:ollama", category: "AI & ML", level: "Advanced" },

  // Cloud & Tools
  { name: "AWS", icon: "logos:aws", category: "Cloud & Tools", level: "Proficient" },
  { name: "Docker", icon: "logos:docker-icon", category: "Cloud & Tools", level: "Advanced" },
  { name: "Git", icon: "logos:git-icon", category: "Cloud & Tools", level: "Expert" },
  { name: "GitHub", icon: "mdi:github", category: "Cloud & Tools", level: "Expert" },
  { name: "Postman", icon: "logos:postman-icon", category: "Cloud & Tools", level: "Advanced" },
  { name: "Prisma", icon: "logos:prisma", category: "Cloud & Tools", level: "Advanced" },
];

const CATEGORIES = ["All", "Frontend", "Backend", "AI & ML", "Cloud & Tools"];

const Skills = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"3d" | "grid">("3d");
  const sectionRef = useRef<HTMLElement>(null);
  const { isMobile } = usePortfolio();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const displayedSkills =
    activeCategory === "All"
      ? ALL_SKILLS
      : ALL_SKILLS.filter((s) => s.category === activeCategory);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className={isMobile ? "py-10 sm:py-16 bg-muted/30" : "py-6 bg-muted/30"}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Header Title & Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-foreground text-center sm:text-left">
              Technical Skills
            </h2>
            <p className="text-sm text-muted-foreground mt-1 text-center sm:text-left">
              Explore technologies in 3D interactive space or standard view
            </p>
          </div>

          {/* View Switcher Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-2xl neo-inset-sm bg-card/80">
            <button
              onClick={() => setViewMode("3d")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                viewMode === "3d"
                  ? "neo-button-primary shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon icon="lucide:globe" className="w-4 h-4" />
              <span>3D Sphere</span>
            </button>

            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                viewMode === "grid"
                  ? "neo-button-primary shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon icon="lucide:layout-grid" className="w-4 h-4" />
              <span>Grid View</span>
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-4 mb-6">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                activeCategory === category
                  ? "neo-button-primary"
                  : "neo-button text-muted-foreground hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Dynamic Display (3D Sphere vs Grid View) */}
        {viewMode === "3d" ? (
          <div className="w-full">
            <Skills3DSphere
              skills={ALL_SKILLS}
              activeCategory={activeCategory}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {displayedSkills.map((skill, index) => (
              <div
                key={skill.name}
                className={`flex flex-col items-center p-4 sm:p-6 rounded-2xl neo-raised-sm neo-raised-hover transition-all duration-300 ${
                  isVisible ? "animate-fade-in" : "opacity-0"
                }`}
                style={{
                  animationDelay: isVisible ? `${index * 40}ms` : "0ms",
                }}
              >
                <div 
                  className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center p-2.5 rounded-2xl neo-inset-sm mb-3"
                  data-skill={skill.name}
                >
                  <Icon 
                    icon={skill.icon} 
                    className={`w-full h-full ${(skill.name === "Kafka" || skill.name === "Neo4j") ? "kafka-neo4j-icon" : ""}`} 
                  />
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-center text-foreground">
                  {skill.name}
                </h3>
                <span className="text-[10px] text-primary font-medium mt-1 px-2 py-0.5 rounded-full neo-inset-sm">
                  {skill.category}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
