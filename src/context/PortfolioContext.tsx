"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export type SectionId = "profile" | "projects" | "experience" | "skills" | "services" | "contact" | "hackathons" | "blogs";

type PortfolioContextValue = {
  activeSection: SectionId;
  navigateToSection: (section: SectionId) => void;
  selectedProjectId: string | null;
  openCaseStudy: (projectId: string) => void;
  closeCaseStudy: () => void;
  selectedHackathonId: string | null;
  openHackathon: (hackathonId: string) => void;
  closeHackathon: () => void;
  selectedBlogId: string | null;
  openBlog: (blogId: string) => void;
  closeBlog: () => void;
  isMobile: boolean;
};

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState<SectionId>("profile");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedHackathonId, setSelectedHackathonId] = useState<string | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  const navigateToSection = useCallback((section: SectionId) => {
    setActiveSection(section);
    setSelectedProjectId(null);
    setSelectedHackathonId(null);
    setSelectedBlogId(null);
  }, []);

  const openCaseStudy = useCallback((projectId: string) => {
    setActiveSection("projects");
    setSelectedProjectId(projectId);
  }, []);

  const closeCaseStudy = useCallback(() => {
    setSelectedProjectId(null);
  }, []);

  const openHackathon = useCallback((hackathonId: string) => {
    setActiveSection("hackathons");
    setSelectedHackathonId(hackathonId);
  }, []);

  const closeHackathon = useCallback(() => {
    setSelectedHackathonId(null);
  }, []);

  const openBlog = useCallback((blogId: string) => {
    setActiveSection("blogs");
    setSelectedBlogId(blogId);
  }, []);

  const closeBlog = useCallback(() => {
    setSelectedBlogId(null);
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        activeSection,
        navigateToSection,
        selectedProjectId,
        openCaseStudy,
        closeCaseStudy,
        selectedHackathonId,
        openHackathon,
        closeHackathon,
        selectedBlogId,
        openBlog,
        closeBlog,
        isMobile,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within PortfolioProvider");
  }
  return context;
}
