"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export type SectionId = "profile" | "projects" | "experience" | "skills" | "contact";

type PortfolioContextValue = {
  activeSection: SectionId;
  navigateToSection: (section: SectionId) => void;
  selectedProjectId: string | null;
  openCaseStudy: (projectId: string) => void;
  closeCaseStudy: () => void;
  isMobile: boolean;
};

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState<SectionId>("profile");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const navigateToSection = useCallback((section: SectionId) => {
    setActiveSection(section);
    setSelectedProjectId(null);
  }, []);

  const openCaseStudy = useCallback((projectId: string) => {
    setActiveSection("projects");
    setSelectedProjectId(projectId);
  }, []);

  const closeCaseStudy = useCallback(() => {
    setSelectedProjectId(null);
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        activeSection,
        navigateToSection,
        selectedProjectId,
        openCaseStudy,
        closeCaseStudy,
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
