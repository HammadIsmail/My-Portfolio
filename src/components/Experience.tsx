"use client";
import { useEffect, useState } from "react";
import { MapPin, Calendar, Loader2 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { usePortfolio } from "@/context/PortfolioContext";

type ExperienceItem = {
  id?: string;
  role: string;
  company: string;
  location: string;
  workType: string;
  period: string;
  description: string;
  visible?: boolean;
};

import { Skeleton } from "@/components/ui/skeleton";
import { useExperiencesQuery } from "@/hooks/usePortfolioQueries";

const Experience = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { isMobile } = usePortfolio();
  const { data: experiences, isLoading } = useExperiencesQuery();
  const experienceList = experiences || [];

  return (
    <section
      ref={ref}
      id="experience"
      className={isMobile ? "py-12 sm:py-16" : "py-8"}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 font-serif">
          Experience
        </h2>

        {isLoading && !experiences ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-3xl p-6 sm:p-8 border border-border space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : experienceList.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No experiences available to display.
          </div>
        ) : (
          <div className="space-y-8 sm:space-y-12">
            {experienceList.map((exp, index) => (
              <div
                key={exp.id || index}
                className={`bg-card rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-border flex flex-col space-y-4 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-2">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                      {exp.role}
                    </h3>
                    <p className="text-lg sm:text-xl font-semibold text-primary">
                      {exp.company}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                    <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
                      {exp.workType}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 sm:gap-4 text-sm sm:text-base text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{exp.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{exp.period}</span>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pt-2">
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
