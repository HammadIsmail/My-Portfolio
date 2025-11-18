import { Code, Palette, Smartphone, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Skills = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const skills = [
    { name: "UI/UX Design", level: 95, icon: Palette },
    { name: "Figma", level: 90, icon: Code },
    { name: "Responsive Design", level: 88, icon: Smartphone },
    { name: "Prototyping", level: 85, icon: Zap },
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
      className="py-12 sm:py-16 lg:py-20 bg-muted/30"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16">
          Skills
        </h2>

        {/* Icon Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <div
                key={skill.name}
                className={`flex flex-col items-center p-6 sm:p-8 rounded-2xl bg-card hover:shadow-[var(--shadow-hover)] transition-all duration-300 ${
                  isVisible ? "animate-fade-in" : "opacity-0"
                }`}
                style={{
                  animationDelay: isVisible ? `${index * 100}ms` : "0ms",
                }}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-primary/10 mb-3 sm:mb-4">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-center">
                  {skill.name}
                </h3>
              </div>
            );
          })}
        </div>

        {/* Progress Bars */}
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              className={`${isVisible ? "animate-fade-in" : "opacity-0"}`}
              style={{
                animationDelay: isVisible ? `${index * 150}ms` : "0ms",
              }}
            >
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <span className="text-sm sm:text-base font-medium">
                  {skill.name}
                </span>
                <span className="text-sm sm:text-base font-semibold text-primary">
                  {skill.level}%
                </span>
              </div>
              <div className="h-2 sm:h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: isVisible ? `${skill.level}%` : "0%",
                    transitionDelay: isVisible ? `${index * 150}ms` : "0ms",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
