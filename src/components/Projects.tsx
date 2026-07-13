"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePortfolio } from "@/context/PortfolioContext";

// Define the type so the component knows what to expect
type ProjectType = {
  id: string | number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  imagePosition: string;
};

const Projects = ({ projects }: { projects: ProjectType[] }) => {
  const { ref, isVisible } = useScrollAnimation();
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const router = useRouter();
  const { openCaseStudy, isMobile } = usePortfolio();

  const getParallaxOffset = (index: number) => {
    if (!sectionRef.current) return 0;
    const sectionTop = sectionRef.current.offsetTop;
    const relativeScroll = scrollY - sectionTop;
    return relativeScroll * 0.15 * (index % 2 === 0 ? 1 : -1);
  };

  return (
    <section ref={sectionRef} id="projects" className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16">Projects</h2>
        <div ref={ref} className="relative">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={isMobile ? "sticky top-20" : "sticky top-4"}
              style={{
                zIndex: index + 1,
                paddingBottom: index === projects.length - 1 ? '0' : '2rem'
              }}
            >
              <Card
                className={`overflow-hidden border-none shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-700 bg-card ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                  transform: isVisible ? `scale(${1 - index * 0.02})` : 'translateY(40px)',
                  transformOrigin: 'top center'
                }}
              >
                <div className={`grid lg:grid-cols-2 gap-0 ${project.imagePosition === 'left' ? 'lg:grid-flow-dense' : ''}`}>
                  <div className={`p-6 sm:p-8 lg:p-12 flex flex-col justify-center ${project.imagePosition === 'left' ? 'lg:col-start-2' : ''}`}>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{project.title}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto min-h-[44px]"
                        onClick={() =>
                          isMobile
                            ? router.push(`/project/${project.id}`)
                            : openCaseStudy(String(project.id))
                        }
                      >
                        View Case Study
                      </Button>
                    </div>
                  </div>
                  <div className={`relative aspect-[4/3] lg:aspect-auto overflow-hidden ${project.imagePosition === 'left' ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-100 ease-out"
                      style={{
                        transform: `translateY(${getParallaxOffset(index)}px) scale(1.1)`
                      }}
                    />
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
