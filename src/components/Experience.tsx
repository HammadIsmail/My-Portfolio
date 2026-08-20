"use client";

import { MapPin, Calendar, Briefcase } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Skeleton } from "@/components/ui/skeleton";
import { useExperiencesQuery } from "@/hooks/usePortfolioQueries";

const Experience = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { data: experiences, isLoading } = useExperiencesQuery();
  const experienceList = experiences || [];

  return (
    <section ref={ref} id="experience" className="py-8 sm:py-12 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="text-center sm:text-left mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border-2 border-[var(--pop-border)] font-extrabold text-xs mb-2 shadow-[2px_2px_0px_#1e1b2e]">
            <Briefcase className="w-3.5 h-3.5" />
            <span>CAREER PATH</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            Work Experience
          </h2>
        </div>

        {isLoading && !experiences ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-44 w-full rounded-3xl" />
            ))}
          </div>
        ) : experienceList.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground font-bold">
            No experiences available to display.
          </div>
        ) : (
          <div className="space-y-6">
            {experienceList.map((exp, index) => (
              <div
                key={exp.id || index}
                className={`pop-card-lg p-5 sm:p-8 transition-all duration-500 hover:translate-y-[-2px] ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                {/* Role Header */}
                <div className="flex flex-col gap-1.5 mb-3">
                  <h3 className="text-xl sm:text-2xl font-black text-foreground">
                    {exp.role}
                  </h3>

                  {/* Company Name & Hybrid Pill in SAME LINE with Spacing */}
                  <div className="flex justify-between flex-wrap items-center gap-3 sm:gap-4 mt-0.5">
                    <span className="text-base sm:text-lg font-extrabold text-purple-600 dark:text-purple-400">
                      {exp.company}
                    </span>
                    <span className="px-3.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-300 border-2 border-[var(--pop-border)] font-extrabold text-xs shadow-[2px_2px_0px_#1e1b2e]">
                      {exp.workType}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-extrabold text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-[var(--pop-border)]">
                    <MapPin className="w-3.5 h-3.5 text-purple-600" />
                    <span>{exp.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-[var(--pop-border)]">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>{exp.period}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-base text-muted-foreground font-medium leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
