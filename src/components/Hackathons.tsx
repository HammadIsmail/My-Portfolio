"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePortfolio } from "@/context/PortfolioContext";

type HackathonType = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  imagePosition: string;
  demoUrl?: string;
  githubUrl?: string;
};

const Hackathons = ({ hackathons }: { hackathons: HackathonType[] }) => {
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
  const { openHackathon, isMobile } = usePortfolio();

  const getParallaxOffset = (index: number) => {
    if (!sectionRef.current) return 0;
    const sectionTop = sectionRef.current.offsetTop;
    const relativeScroll = scrollY - sectionTop;
    return relativeScroll * 0.15 * (index % 2 === 0 ? 1 : -1);
  };

  return (
    <section ref={sectionRef} id="hackathons" className={isMobile ? "py-12 sm:py-16 lg:py-20" : "py-6"}>
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 font-serif">
          Hackathons
        </h2>
        
        {hackathons.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No hackathons posted yet. Stay tuned!
          </div>
        ) : (
          <div ref={ref} className={isMobile ? "relative space-y-6" : "relative"}>
            {hackathons.map((hackathon, index) => (
              <div
                key={hackathon.id}
                className={isMobile ? "" : "sticky top-4"}
                style={
                  isMobile
                    ? undefined
                    : {
                        zIndex: index + 1,
                        paddingBottom: index === hackathons.length - 1 ? "0" : "2rem",
                      }
                }
              >
                <Card
                  className={`overflow-hidden border-none shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-700 bg-card ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                  style={{
                    transitionDelay: `${index * 100}ms`,
                    transform:
                      isVisible && !isMobile
                        ? `scale(${1 - index * 0.02})`
                        : isVisible
                          ? undefined
                          : "translateY(40px)",
                    transformOrigin: "top center",
                  }}
                >
                  <div className={`grid lg:grid-cols-2 gap-0 ${hackathon.imagePosition === 'left' ? 'lg:grid-flow-dense' : ''}`}>
                    <div className={`p-6 sm:p-8 lg:p-12 flex flex-col justify-center ${hackathon.imagePosition === 'left' ? 'lg:col-start-2' : ''}`}>
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Hackathon Experience</span>
                      <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{hackathon.title}</h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
                        {hackathon.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                        {hackathon.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto min-h-[44px]"
                          onClick={() =>
                            isMobile
                              ? router.push(`/hackathon/${hackathon.id}`)
                              : openHackathon(hackathon.id)
                          }
                        >
                          View Experience
                        </Button>
                        
                        {hackathon.demoUrl && (
                          <Button
                            variant="outline"
                            className="w-full sm:w-auto min-h-[44px] hover:bg-primary/10 hover:text-primary transition-colors"
                            asChild
                          >
                            <a href={hackathon.demoUrl} target="_blank" rel="noopener noreferrer">
                              Live Demo
                            </a>
                          </Button>
                        )}

                        {hackathon.githubUrl && (
                          <Button
                            variant="outline"
                            className="w-full sm:w-auto min-h-[44px] hover:bg-primary/10 hover:text-primary transition-colors"
                            asChild
                          >
                            <a href={hackathon.githubUrl} target="_blank" rel="noopener noreferrer">
                              Github Repo
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className={`relative aspect-[4/3] lg:aspect-auto overflow-hidden ${hackathon.imagePosition === 'left' ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                      <img
                        src={hackathon.image}
                        alt={hackathon.title}
                        className="w-full h-full object-cover transition-transform duration-100 ease-out"
                        style={
                          isMobile
                            ? undefined
                            : {
                                transform: `translateY(${getParallaxOffset(index)}px) scale(1.1)`,
                              }
                        }
                      />
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hackathons;
