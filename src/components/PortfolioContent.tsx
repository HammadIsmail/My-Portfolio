"use client";

import { useEffect, useRef } from "react";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Hackathons from "@/components/Hackathons";
import HackathonDetail from "@/components/HackathonDetail";
import Blogs from "@/components/Blogs";
import BlogDetail from "@/components/BlogDetail";
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
  githubUrl?: string;
};

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

type BlogType = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  createdAt?: string;
};

const PortfolioContent = ({
  projects,
  hackathons,
  blogs,
}: {
  projects: ProjectType[];
  hackathons: HackathonType[];
  blogs: BlogType[];
}) => {
  const {
    activeSection,
    selectedProjectId,
    selectedHackathonId,
    selectedBlogId,
    isMobile,
  } = usePortfolio();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [activeSection, selectedProjectId, selectedHackathonId, selectedBlogId]);

  if (isMobile) {
    return (
      <>
        <Hero />
        <Projects projects={projects} />
        <Hackathons hackathons={hackathons} />
        <Blogs blogs={blogs} />
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
      {activeSection === "hackathons" &&
        (selectedHackathonId ? (
          <HackathonDetail hackathonId={selectedHackathonId} />
        ) : (
          <Hackathons hackathons={hackathons} />
        ))}
      {activeSection === "blogs" &&
        (selectedBlogId ? (
          <BlogDetail blogId={selectedBlogId} />
        ) : (
          <Blogs blogs={blogs} />
        ))}
      {activeSection === "experience" && <Experience />}
      {activeSection === "skills" && <Skills />}
      {activeSection === "services" && <Services />}
      {activeSection === "contact" && <Contact />}
    </div>
  );
};

export default PortfolioContent;
