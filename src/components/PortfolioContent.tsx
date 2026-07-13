"use client";

import { useEffect, useRef } from "react";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Services from "@/components/services/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ProjectCaseStudy from "@/components/ProjectCaseStudy";
import { usePortfolio } from "@/context/PortfolioContext";

type ProjectType = {
  id: string | number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  imagePosition: string;
};

const PortfolioContent = ({ projects }: { projects: ProjectType[] }) => {
  const { activeSection, selectedProjectId, isMobile } = usePortfolio();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [activeSection, selectedProjectId]);

  if (isMobile) {
    return (
      <>
        <Hero />
        <Projects projects={projects} />
        <Experience />
        <Skills />
        <Services />
        <Contact />
        <Footer />
      </>
    );
  }

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto">
      {activeSection === "profile" && <Hero />}
      {activeSection === "projects" &&
        (selectedProjectId ? (
          <ProjectCaseStudy projectId={selectedProjectId} />
        ) : (
          <Projects projects={projects} />
        ))}
      {activeSection === "experience" && <Experience />}
      {activeSection === "skills" && <Skills />}
      {activeSection === "services" && <Services />}
      {activeSection === "contact" && <Contact />}
    </div>
  );
};

export default PortfolioContent;
