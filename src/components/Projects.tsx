"use client";
import React, { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useRouter } from "next/navigation";
import { usePortfolio } from "@/context/PortfolioContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjectsQuery } from "@/hooks/usePortfolioQueries";
import OrbitingProjects3D from "@/components/OrbitingProjects3D";
import { FolderGit2, LayoutGrid, Orbit } from "lucide-react";

const Projects = () => {
  const { ref, isVisible } = useScrollAnimation();
  const router = useRouter();
  const { openCaseStudy, isMobile } = usePortfolio();
  const { data: projects, isLoading } = useProjectsQuery();
  const [viewMode, setViewMode] = useState<"3d" | "grid">("3d");

  const projectList = (projects || []).map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    image: p.image,
    tags: p.tags || [],
    githubUrl: p.githubUrl,
    liveUrl: p.demoUrl,
  }));

  if (isLoading && !projects) {
    return (
      <section id="projects" className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 space-y-6 max-w-5xl">
          <Skeleton className="h-64 sm:h-80 w-full rounded-3xl" />
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="projects" className="py-8 sm:py-12 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Header Title & Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 border-2 border-[var(--pop-border)] font-extrabold text-xs mb-2 shadow-[2px_2px_0px_#1e1b2e]">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>FEATURED WORK</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight whitespace-nowrap">
              Featured Projects
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
              Scroll or drag cards to revolve projects in 3D orbit around the centerpiece!
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-card border-2 border-[var(--pop-border)] shadow-[3px_3px_0px_#1e1b2e] dark:shadow-[3px_3px_0px_#ffffff]">
            <button
              onClick={() => setViewMode("3d")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black transition-all ${
                viewMode === "3d"
                  ? "bg-purple-600 text-white border-1.5 border-[var(--pop-border)] shadow-[2px_2px_0px_#1e1b2e]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Orbit className="w-3.5 h-3.5" />
              <span>3D Orbit</span>
            </button>

            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black transition-all ${
                viewMode === "grid"
                  ? "bg-purple-600 text-white border-1.5 border-[var(--pop-border)] shadow-[2px_2px_0px_#1e1b2e]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
          </div>
        </div>

        {projectList.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground font-bold">
            No projects posted yet.
          </div>
        ) : (
          <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {viewMode === "3d" ? (
              <OrbitingProjects3D projects={projectList} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {projectList.map((project) => (
                  <div
                    key={project.id}
                    className="pop-card-lg p-6 flex flex-col justify-between hover:translate-y-[-4px] transition-all"
                  >
                    <div>
                      <div className="w-full aspect-video rounded-2xl overflow-hidden border-2 border-[var(--pop-border)] shadow-[3px_3px_0px_#1e1b2e] mb-4 bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-2">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-contain rounded-xl"
                        />
                      </div>
                      <h3 className="text-2xl font-black text-foreground mb-2">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 dark:bg-slate-800 text-foreground border border-[var(--pop-border)] shadow-[1px_1px_0px_#1e1b2e]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          isMobile
                            ? router.push(`/project/${project.id}`)
                            : openCaseStudy(String(project.id))
                        }
                        className="flex-1 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm border-2 border-[var(--pop-border)] shadow-[3px_3px_0px_#1e1b2e]"
                      >
                        Details ✦
                      </button>
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-3 rounded-full bg-card hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground font-extrabold text-sm border-2 border-[var(--pop-border)] shadow-[3px_3px_0px_#1e1b2e]"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
