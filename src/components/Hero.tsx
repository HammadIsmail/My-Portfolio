"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { usePortfolio } from "@/context/PortfolioContext";
import { Icon } from "@iconify/react";

const Hero = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { navigateToSection, isMobile } = usePortfolio();
  const [previewImage, setPreviewImage] = useState<{
    src: string;
    alt: string;
    rounded?: boolean;
  } | null>(null);

  const goToProjects = () => {
    if (isMobile) {
      const element = document.getElementById("projects");
      element?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigateToSection("projects");
    }
  };

  return (
    <section
      id="profile"
      className={isMobile ? "py-4 sm:py-6" : "py-6"}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div
          ref={ref}
          className={`bg-card border rounded-2xl shadow-sm overflow-hidden transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Cover Image */}
          <button
            type="button"
            onClick={() =>
              setPreviewImage({ src: "/cover.webp", alt: "Cover image" })
            }
            className="relative block h-48 sm:h-64 md:h-80 w-full bg-muted cursor-zoom-in group"
            aria-label="Preview cover image"
          >
            <img
              src="/cover.webp"
              alt="Cover"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </button>

          {/* Profile Container */}
          <div className="relative px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 sm:mb-4 mb-4">
              {/* Profile Image */}
              <button
                type="button"
                onClick={() =>
                  setPreviewImage({
                    src: "/profile.webp",
                    alt: "Muhammad Hammad profile photo",
                    rounded: true,
                  })
                }
                className="relative z-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-card bg-background overflow-hidden shrink-0 cursor-zoom-in group"
                aria-label="Preview profile image"
              >
                <img
                  src="/profile.webp"
                  alt="Muhammad Hammad"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>

              {/* Action Buttons */}
              <div className="flex flex-nowrap gap-2 sm:gap-3 mt-4 sm:mt-0 sm:ml-4 w-full sm:w-auto self-start sm:self-end">
                <Button onClick={goToProjects} className="flex-1 sm:flex-none min-w-0 px-3 sm:min-w-[100px] text-xs sm:text-sm">
                  Projects
                </Button>
                <Button variant="outline" asChild className="flex-1 sm:flex-none min-w-0 px-3 text-xs sm:text-sm">
                  <a
                    href="https://www.linkedin.com/in/muhammad-hammad-uet/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5"
                  >
                    <Icon icon="lucide:linkedin" className="w-4 h-4" />
                    LinkedIn
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex-1 sm:flex-none min-w-0 px-3 text-xs sm:text-sm">
                  <a
                    href="https://github.com/HammadIsmail"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5"
                  >
                    <Icon icon="lucide:github" className="w-4 h-4" />
                    Github
                  </a>
                </Button>
              </div>
            </div>

            {/* Profile Info */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Muhammad Hammad
              </h1>
              <p className="text-sm sm:text-base font-semibold text-primary mt-1">
                FullStack & AI Developer
              </p>
            </div>

            {/* Bio */}
            <div className="mt-6 text-base sm:text-lg text-muted-foreground space-y-4 max-w-4xl">
              <p>
                I'm a Full-Stack Developer passionate about building scalable, high-performance web and mobile applications. I specialize in React, Next.js, React Native, Node.js (Express), FastAPI, and NestJS, with experience designing backend systems using MongoDB, PostgreSQL, MySQL, and Neo4j.
              </p>
              <p>
                I also build AI-powered applications, integrating large language models and intelligent workflows into production-ready software. My experience includes developing REST and GraphQL APIs, real-time applications with Socket.IO, cloud deployment, and modern software architecture.
              </p>
              <p>
                Through hackathons, collaborative projects, and real-world development, I've built solutions ranging from AI platforms to enterprise applications. I enjoy solving challenging problems, writing clean and maintainable code, and creating software that delivers meaningful value to users and businesses.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={!!previewImage}
        onOpenChange={(open) => !open && setPreviewImage(null)}
      >
        <DialogContent className="max-w-5xl w-[95vw] p-2 sm:p-4 border-none bg-background/95 shadow-2xl">
          <DialogTitle className="sr-only">
            {previewImage?.alt ?? "Image preview"}
          </DialogTitle>
          {previewImage && (
            <img
              src={previewImage.src}
              alt={previewImage.alt}
              className={`w-full h-auto max-h-[85vh] object-contain mx-auto ${
                previewImage.rounded ? "max-w-md rounded-full aspect-square object-cover" : "rounded-lg"
              }`}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Hero;
