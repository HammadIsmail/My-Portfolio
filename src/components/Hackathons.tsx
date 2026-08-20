"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useRouter } from "next/navigation";
import { usePortfolio } from "@/context/PortfolioContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useHackathonsQuery } from "@/hooks/usePortfolioQueries";
import { AnimatedCardShowcase } from "@/components/AnimatedCardShowcase";
import { Trophy, ExternalLink } from "lucide-react";

const Hackathons = () => {
  const { ref, isVisible } = useScrollAnimation();
  const router = useRouter();
  const { openHackathon, isMobile } = usePortfolio();
  const { data: hackathons, isLoading } = useHackathonsQuery();
  const hackathonList = hackathons || [];

  if (isLoading && !hackathons) {
    return (
      <section id="hackathons" className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-6">
          <Skeleton className="h-64 sm:h-80 w-full rounded-3xl" />
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="hackathons" className="py-8 sm:py-12 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="text-center sm:text-left mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 border-2 border-[var(--pop-border)] font-extrabold text-xs mb-2 shadow-[2px_2px_0px_#1e1b2e]">
            <Trophy className="w-3.5 h-3.5" />
            <span>COMPETITIONS & HACKATHONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            Hackathon Victories
          </h2>
        </div>

        {hackathonList.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground font-bold">
            No hackathons posted yet. Stay tuned!
          </div>
        ) : (
          <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <AnimatedCardShowcase
              items={hackathonList}
              getItemKey={(hackathon) => hackathon.id}
              renderItem={(hackathon) => (
                <div className="pop-card-lg p-6 sm:p-8 flex flex-col space-y-6 w-full">
                  {/* Cover Image */}
                  <div className="w-full aspect-[16/10] sm:aspect-video rounded-2xl overflow-hidden border-2.5 border-[var(--pop-border)] shadow-[3.5px_3.5px_0px_#1e1b2e] flex items-center justify-center p-3 bg-slate-100 dark:bg-slate-900">
                    <img
                      src={hackathon.image}
                      alt={hackathon.title}
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-foreground leading-tight">
                      {hackathon.title}
                    </h3>
                  </div>

                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base font-medium">
                    {hackathon.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {hackathon.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 dark:bg-slate-800 text-foreground border border-[var(--pop-border)] shadow-[1.5px_1.5px_0px_#1e1b2e]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full">
                    <button
                      className="flex-1 py-3.5 px-6 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm border-2.5 border-[var(--pop-border)] shadow-[3.5px_3.5px_0px_#1e1b2e]"
                      onClick={() =>
                        isMobile
                          ? router.push(`/hackathon/${hackathon.id}`)
                          : openHackathon(hackathon.id)
                      }
                    >
                      View Full Story ✦
                    </button>
                    
                    {hackathon.demoUrl && (
                      <a
                        href={hackathon.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3.5 px-6 rounded-full bg-card hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground font-extrabold text-sm border-2 border-[var(--pop-border)] shadow-[3.5px_3.5px_0px_#1e1b2e] flex items-center justify-center gap-1.5"
                      >
                        <ExternalLink className="w-4 h-4 text-purple-600" />
                        <span>Live Demo</span>
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
