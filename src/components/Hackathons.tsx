"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePortfolio } from "@/context/PortfolioContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useHackathonsQuery } from "@/hooks/usePortfolioQueries";

import { AnimatedCardShowcase } from "@/components/AnimatedCardShowcase";

const Hackathons = () => {
  const { ref, isVisible } = useScrollAnimation();
  const router = useRouter();
  const { openHackathon, isMobile } = usePortfolio();
  const { data: hackathons, isLoading } = useHackathonsQuery();
  const hackathonList = hackathons || [];

  if (isLoading && !hackathons) {
    return (
      <section id="hackathons" className={isMobile ? "py-12 sm:py-16" : "py-6"}>
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 font-serif">
            Hackathons
          </h2>
          <div className="space-y-6">
            {[1].map((i) => (
              <div key={i} className="bg-card border border-border rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
                <Skeleton className="h-64 sm:h-80 w-full rounded-2xl" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-12 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="hackathons" className={isMobile ? "py-12 sm:py-16" : "py-8"}>
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <h2 className="block md:hidden text-3xl sm:text-4xl font-bold text-center mb-8 font-serif">
          Hackathons
        </h2>
        
        {hackathonList.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No hackathons posted yet. Stay tuned!
          </div>
        ) : (
          <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <AnimatedCardShowcase
              items={hackathonList}
              getItemKey={(hackathon) => hackathon.id}
              renderItem={(hackathon) => (
                <div
                  className="neo-raised neo-raised-hover rounded-3xl p-6 sm:p-8 flex flex-col space-y-6 w-full"
                >
                  {/* Cover Image at top */}
                  <div className="w-full relative aspect-[16/10] sm:aspect-video rounded-2xl overflow-hidden neo-inset flex items-center justify-center p-3 sm:p-6">
                    <img
                      src={hackathon.image}
                      alt={hackathon.title}
                      className="w-full h-full object-contain max-h-[460px] rounded-xl"
                    />
                  </div>

                  {/* Subtitle Badge */}
                  <div>
                    <span className="inline-block neo-inset-sm text-xs font-semibold uppercase tracking-wider text-primary px-3 py-1 rounded-full">
                      Hackathon Experience
                    </span>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif leading-tight text-foreground mt-2">
                      {hackathon.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                    {hackathon.description}
                  </p>

                  {/* Golden Pill Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {hackathon.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs sm:text-sm px-3.5 py-1.5 rounded-full neo-pill-accent font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Stacked Full-Width Pill Buttons */}
                  <div className="flex flex-col gap-3 pt-4 w-full">
                    <button
                      className="w-full rounded-2xl py-3.5 px-6 text-base font-semibold neo-button-primary touch-manipulation"
                      onClick={() =>
                        isMobile
                          ? router.push(`/hackathon/${hackathon.id}`)
                          : openHackathon(hackathon.id)
                      }
                    >
                      View Experience
                    </button>
                    
                    {hackathon.demoUrl && (
                      <a
                        href={hackathon.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-center rounded-2xl py-3.5 px-6 text-base font-medium neo-button touch-manipulation"
                      >
                        Live Demo
                      </a>
                    )}

                    {hackathon.githubUrl && (
                      <a
                        href={hackathon.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-center rounded-2xl py-3.5 px-6 text-base font-medium neo-button touch-manipulation"
                      >
                        Github Repo
                      </a>
                    )}
                  </div>
                </div>
              )}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Hackathons;
