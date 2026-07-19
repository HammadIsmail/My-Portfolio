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

type HackathonDetailProps = {
  title: string;
  description: string;
  content: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  images: string[];
  videoUrl?: string;
};

const HackathonDetail = ({ hackathonId }: { hackathonId: string }) => {
  const { closeHackathon } = usePortfolio();
  const [hackathon, setHackathon] = useState<HackathonDetailProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    fetch(`/api/hackathons/${hackathonId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch hackathon");
        return res.json();
      })
      .then((data) => {
        setHackathon(data.hackathon);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [hackathonId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !hackathon) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl">
        <button
          onClick={closeHackathon}
          className="inline-flex items-center text-sm font-medium hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Hackathons
        </button>
        <p className="text-muted-foreground">Hackathon not found.</p>
      </div>
    );
  }

  const isHtml = /<[a-z][\s\S]*>/i.test(hackathon.content);

  return (
    <div className="py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <button
          onClick={closeHackathon}
          className="inline-flex items-center text-sm font-medium hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Hackathons
        </button>

        <div className="mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 block">Hackathon Experience</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">{hackathon.title}</h1>
          <p className="text-muted-foreground text-lg mb-6 leading-relaxed">{hackathon.description}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {hackathon.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            {hackathon.demoUrl && (
              <Button asChild>
                <a href={hackathon.demoUrl} target="_blank" rel="noopener noreferrer">
                  View Live Demo
                </a>
              </Button>
            )}
            {hackathon.githubUrl && (
              <Button variant="outline" className="hover:bg-primary/10 hover:text-primary transition-colors" asChild>
                <a href={hackathon.githubUrl} target="_blank" rel="noopener noreferrer">
                  Github Repo
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="mb-16">
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {hackathon.images.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-[16/9] relative rounded-xl overflow-hidden shadow-lg border border-border bg-muted flex items-center justify-center">
                    <img
                      src={img}
                      alt={`${hackathon.title} screenshot ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {hackathon.images.length > 1 && (
              <>
                <CarouselPrevious className="left-2 sm:-left-12" />
                <CarouselNext className="right-2 sm:-right-12" />
              </>
            )}
          </Carousel>

          {hackathon.videoUrl && (
            <div className="mt-8 aspect-[16/9] rounded-xl overflow-hidden shadow-lg border border-border bg-muted">
              <iframe
                src={hackathon.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>

        <article className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none text-foreground/90">
          {isHtml ? (
            <div dangerouslySetInnerHTML={{ __html: hackathon.content }} />
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{hackathon.content}</ReactMarkdown>
          )}
        </article>
      </div>
    </div>
  );
};

export default HackathonDetail;
