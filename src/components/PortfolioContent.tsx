"use client";

import { useEffect, useState } from "react";
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
import InitialPageSkeleton from "@/components/InitialPageSkeleton";

const PortfolioContent = () => {
  const [isMounted, setIsMounted] = useState(false);
  const {
    selectedProjectId,
    selectedHackathonId,
    selectedBlogId,
  } = usePortfolio();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <InitialPageSkeleton />;
  }

  // If a detail view is active, present that view
  if (selectedProjectId) {
    return <ProjectCaseStudy projectId={selectedProjectId} />;
  }
  if (selectedHackathonId) {
    return <HackathonDetail hackathonId={selectedHackathonId} />;
  }
  if (selectedBlogId) {
    return <BlogDetail blogId={selectedBlogId} />;
  }

  return (
    <div className="flex flex-col gap-12 sm:gap-16 max-w-7xl mx-auto px-4 sm:px-6">
      <Hero />
      <Skills />
      <Projects />
      <Hackathons />
      <Blogs />
      <Experience />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
};

export default PortfolioContent;
