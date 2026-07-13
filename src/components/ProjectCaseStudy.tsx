"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { usePortfolio } from "@/context/PortfolioContext";

type ProjectDetail = {
  title: string;
  description: string;
  content: string;
  tags: string[];
  demoUrl?: string;
  images: string[];
  videoUrl?: string;
};

const ProjectCaseStudy = ({ projectId }: { projectId: string }) => {
  const { closeCaseStudy } = usePortfolio();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    fetch(`/api/projects/${projectId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setProject(data.project);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl">
        <button
          onClick={closeCaseStudy}
          className="inline-flex items-center text-sm font-medium hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </button>
        <p className="text-muted-foreground">Project not found.</p>
      </div>
    );
  }

  const isHtml = /<[a-z][\s\S]*>/i.test(project.content);

  return (
    <div className="py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <button
          onClick={closeCaseStudy}
          className="inline-flex items-center text-sm font-medium hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </button>

        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">{project.title}</h1>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          {project.demoUrl && (
            <Button asChild>
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                View Live Demo
              </a>
            </Button>
          )}
        </div>

        <div className="mb-16">
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {project.images.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-[16/9] relative rounded-xl overflow-hidden shadow-lg border border-border bg-muted flex items-center justify-center">
                    <img
                      src={img}
                      alt={`${project.title} screenshot ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {project.images.length > 1 && (
              <>
                <CarouselPrevious className="left-2 sm:-left-12" />
                <CarouselNext className="right-2 sm:-right-12" />
              </>
            )}
          </Carousel>

          {project.videoUrl && (
            <div className="mt-8 aspect-[16/9] rounded-xl overflow-hidden shadow-lg border border-border bg-muted">
              <iframe
                src={project.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>

        <article className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none text-foreground/90">
          {isHtml ? (
            <div dangerouslySetInnerHTML={{ __html: project.content }} />
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.content}</ReactMarkdown>
          )}
        </article>
      </div>
    </div>
  );
};

export default ProjectCaseStudy;
