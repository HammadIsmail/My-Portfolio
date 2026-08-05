"use client";

import { useEffect, useRef, useState } from "react";
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
// import InitialPageSkeleton from "@/components/InitialPageSkeleton";

const PortfolioContent = () => {
  const [isMounted, setIsMounted] = useState(false);
  const {
    activeSection,
    selectedProjectId,
    selectedHackathonId,
    selectedBlogId,
    isMobile,
  } = usePortfolio();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [activeSection, selectedProjectId, selectedHackathonId, selectedBlogId]);

  // if (!isMounted) {
  //   return <InitialPageSkeleton />;
  // }

  if (isMobile) {
    return (
      <>
        <Hero />
        <Projects />
        <Hackathons />
        <Blogs />
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
          <Projects />
        ))}
      {activeSection === "hackathons" &&
        (selectedHackathonId ? (
          <HackathonDetail hackathonId={selectedHackathonId} />
        ) : (
          <Hackathons />
        ))}
      {activeSection === "blogs" &&
        (selectedBlogId ? (
          <BlogDetail blogId={selectedBlogId} />
        ) : (
          <Blogs />
        ))}
      {activeSection === "experience" && <Experience />}
      {activeSection === "skills" && <Skills />}
      {activeSection === "services" && <Services />}
      {activeSection === "contact" && <Contact />}
    </div>
  );
};

export default PortfolioContent;
