"use client";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";

const Skills = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { isMobile } = usePortfolio();

  const skills = [
    { name: "React", icon: "logos:react" },
    { name: "Next.js", icon: "logos:nextjs-icon" },
    { name: "TypeScript", icon: "logos:typescript-icon" },
    { name: "Node.js", icon: "logos:nodejs-icon" },
    { name: "React Native", icon: "logos:react" },
    { name: "TailwindCSS", icon: "logos:tailwindcss-icon" },
    { name: "MongoDB", icon: "logos:mongodb-icon" },
    { name: "PostgreSQL", icon: "logos:postgresql" },
    { name: "SQLite", icon: "devicon:sqlite" },
    { name: "Socket.IO", icon: "simple-icons:socketdotio" },
    { name: "AWS", icon: "logos:aws" },
    { name: "FastAPI", icon: "devicon:fastapi" },
    { name: "AI Integration", icon: "hugeicons:ai-brain-04" },
    { name: "OpenAI APIs", icon: "simple-icons:openai" }
  ];

  const tools = [
    { name: "Git", icon: "logos:git-icon" },
    { name: "GitHub", icon: "mdi:github" },
    { name: "Postman", icon: "logos:postman-icon" },
    { name: "Docker", icon: "logos:docker-icon" },
    { name: "Ollama", icon: "simple-icons:ollama" },
    { name: "Prisma", icon: "logos:prisma" }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
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

  return (
    <section
      ref={sectionRef}
      id="skills"
      className={isMobile ? "py-12 sm:py-16 lg:py-20 bg-muted/30" : "py-6 bg-muted/30"}
    >
      <div className="container mx-auto px-4 sm:px-6">
        {isMobile && (
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16">
            Skills
          </h2>
        )}

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              className={`flex flex-col items-center p-4 sm:p-6 rounded-2xl bg-card hover:shadow-[var(--shadow-hover)] transition-all duration-300 ${
                isVisible ? "animate-fade-in" : "opacity-0"
              }`}
              style={{
                animationDelay: isVisible ? `${index * 50}ms` : "0ms",
              }}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-3">
                <Icon icon={skill.icon} className="w-full h-full" />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-center">
                {skill.name}
              </h3>
            </div>
          ))}
        </div>

        {/* Tools Section */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
            Tools
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {tools.map((tool, index) => (
              <div
                key={tool.name}
                className={`flex flex-col items-center p-4 sm:p-6 rounded-2xl bg-card hover:shadow-[var(--shadow-hover)] transition-all duration-300 ${
                  isVisible ? "animate-fade-in" : "opacity-0"
                }`}
                style={{
                  animationDelay: isVisible ? `${(skills.length + index) * 50}ms` : "0ms",
                }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-3">
                  <Icon icon={tool.icon} className="w-full h-full" />
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-center">
                  {tool.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
