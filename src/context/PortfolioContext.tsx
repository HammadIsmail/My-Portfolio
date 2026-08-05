"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export type SectionId = "profile" | "projects" | "experience" | "skills" | "services" | "contact" | "hackathons" | "blogs";

export type ProjectType = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  imagePosition: string;
  githubUrl?: string;
};

export type HackathonType = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  imagePosition: string;
  demoUrl?: string;
  githubUrl?: string;
};

export type BlogType = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  createdAt?: string;
};

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

  // Cached datasets & fetchers
  projects: ProjectType[] | null;
  projectsLoading: boolean;
  fetchProjectsIfNeeded: () => Promise<void>;

  hackathons: HackathonType[] | null;
  hackathonsLoading: boolean;
  fetchHackathonsIfNeeded: () => Promise<void>;

  blogs: BlogType[] | null;
  blogsLoading: boolean;
  fetchBlogsIfNeeded: () => Promise<void>;
};

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState<SectionId>("profile");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedHackathonId, setSelectedHackathonId] = useState<string | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  // Cached state
  const [projects, setProjects] = useState<ProjectType[] | null>(null);
  const [projectsLoading, setProjectsLoading] = useState(false);

  const [hackathons, setHackathons] = useState<HackathonType[] | null>(null);
  const [hackathonsLoading, setHackathonsLoading] = useState(false);

  const [blogs, setBlogs] = useState<BlogType[] | null>(null);
  const [blogsLoading, setBlogsLoading] = useState(false);

  const navigateToSection = useCallback((section: SectionId) => {
    setActiveSection(section);
    setSelectedProjectId(null);
    setSelectedHackathonId(null);
    setSelectedBlogId(null);
  }, []);

  const fetchProjectsIfNeeded = useCallback(async () => {
    setProjects((prev) => {
      if (prev !== null) return prev;
      setProjectsLoading(true);
      fetch("/api/projects")
        .then((res) => res.json())
        .then((data) => {
          const formatted = (data.projects || []).map((p: any) => ({
            id: p._id ? p._id.toString() : p.id,
            title: p.title,
            description: p.description,
            image: p.image,
            tags: p.tags || [],
            imagePosition: p.imagePosition || "left",
            githubUrl: p.githubUrl || null,
          }));
          setProjects(formatted);
        })
        .catch((err) => {
          console.error(err);
          setProjects([]);
        })
        .finally(() => setProjectsLoading(false));
      return prev;
    });
  }, []);

  const fetchHackathonsIfNeeded = useCallback(async () => {
    setHackathons((prev) => {
      if (prev !== null) return prev;
      setHackathonsLoading(true);
      fetch("/api/hackathons")
        .then((res) => res.json())
        .then((data) => {
          const formatted = (data.hackathons || []).map((h: any) => ({
            id: h._id ? h._id.toString() : h.id,
            title: h.title,
            description: h.description,
            image: h.image,
            tags: h.tags || [],
            imagePosition: h.imagePosition || "left",
            demoUrl: h.demoUrl || null,
            githubUrl: h.githubUrl || null,
          }));
          setHackathons(formatted);
        })
        .catch((err) => {
          console.error(err);
          setHackathons([]);
        })
        .finally(() => setHackathonsLoading(false));
      return prev;
    });
  }, []);

  const fetchBlogsIfNeeded = useCallback(async () => {
    setBlogs((prev) => {
      if (prev !== null) return prev;
      setBlogsLoading(true);
      fetch("/api/blogs")
        .then((res) => res.json())
        .then((data) => {
          const formatted = (data.blogs || []).map((b: any) => ({
            id: b._id ? b._id.toString() : b.id,
            title: b.title,
            description: b.description,
            image: b.image,
            tags: b.tags || [],
            createdAt: b.createdAt ? new Date(b.createdAt).toISOString() : undefined,
          }));
          setBlogs(formatted);
        })
        .catch((err) => {
          console.error(err);
          setBlogs([]);
        })
        .finally(() => setBlogsLoading(false));
      return prev;
    });
  }, []);

  useEffect(() => {
    if (activeSection === "projects") {
      fetchProjectsIfNeeded();
    } else if (activeSection === "hackathons") {
      fetchHackathonsIfNeeded();
    } else if (activeSection === "blogs") {
      fetchBlogsIfNeeded();
    }
  }, [activeSection, fetchProjectsIfNeeded, fetchHackathonsIfNeeded, fetchBlogsIfNeeded]);

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
        projects,
        projectsLoading,
        fetchProjectsIfNeeded,
        hackathons,
        hackathonsLoading,
        fetchHackathonsIfNeeded,
        blogs,
        blogsLoading,
        fetchBlogsIfNeeded,
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
