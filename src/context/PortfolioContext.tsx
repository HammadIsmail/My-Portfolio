"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export type SectionId = "profile" | "projects" | "experience" | "skills" | "services" | "contact" | "hackathons" | "blogs";

const VALID_SECTIONS: SectionId[] = ["profile", "projects", "hackathons", "blogs", "experience", "skills", "services", "contact"];

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

const parseHashState = (): { section: SectionId | null; detailId: string | null } => {
  if (typeof window === "undefined") return { section: null, detailId: null };
  const rawHash = window.location.hash.replace("#", "").trim();
  if (!rawHash) return { section: null, detailId: null };

  const [sectionPart, queryPart] = rawHash.split("?");
  const section = VALID_SECTIONS.includes(sectionPart as SectionId) ? (sectionPart as SectionId) : null;
  let detailId: string | null = null;
  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    detailId = params.get("id");
  }
  return { section, detailId };
};

const updateUrlHash = (section: SectionId, detailType?: "project" | "hackathon" | "blog", detailId?: string | null) => {
  if (typeof window === "undefined") return;

  let hashStr = `#${section}`;
  if (detailType && detailId) {
    hashStr += `?id=${encodeURIComponent(detailId)}`;
  }

  if (window.location.hash !== hashStr) {
    window.history.replaceState(null, "", hashStr);
  }

  localStorage.setItem("portfolio_active_section", section);
  if (detailId && detailType) {
    localStorage.setItem(`portfolio_${detailType}_id`, detailId);
  } else {
    localStorage.removeItem("portfolio_project_id");
    localStorage.removeItem("portfolio_hackathon_id");
    localStorage.removeItem("portfolio_blog_id");
  }
};

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState<SectionId>("profile");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedHackathonId, setSelectedHackathonId] = useState<string | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  const [projects, setProjects] = useState<ProjectType[] | null>(null);
  const [projectsLoading, setProjectsLoading] = useState(false);

  const [hackathons, setHackathons] = useState<HackathonType[] | null>(null);
  const [hackathonsLoading, setHackathonsLoading] = useState(false);

  const [blogs, setBlogs] = useState<BlogType[] | null>(null);
  const [blogsLoading, setBlogsLoading] = useState(false);

  useEffect(() => {
    const { section: hashSection, detailId } = parseHashState();
    let targetSection: SectionId = "profile";
    let projId: string | null = null;
    let hackId: string | null = null;
    let blogId: string | null = null;

    if (hashSection) {
      targetSection = hashSection;
      if (hashSection === "projects" && detailId) projId = detailId;
      if (hashSection === "hackathons" && detailId) hackId = detailId;
      if (hashSection === "blogs" && detailId) blogId = detailId;
    } else {
      const savedSection = localStorage.getItem("portfolio_active_section") as SectionId | null;
      if (savedSection && VALID_SECTIONS.includes(savedSection)) {
        targetSection = savedSection;
        if (savedSection === "projects") projId = localStorage.getItem("portfolio_project_id");
        if (savedSection === "hackathons") hackId = localStorage.getItem("portfolio_hackathon_id");
        if (savedSection === "blogs") blogId = localStorage.getItem("portfolio_blog_id");
      }
    }

    setActiveSection(targetSection);
    if (projId) setSelectedProjectId(projId);
    if (hackId) setSelectedHackathonId(hackId);
    if (blogId) setSelectedBlogId(blogId);

    updateUrlHash(
      targetSection,
      projId ? "project" : hackId ? "hackathon" : blogId ? "blog" : undefined,
      projId || hackId || blogId || undefined
    );

    if (isMobile && targetSection !== "profile") {
      setTimeout(() => {
        const el = document.getElementById(targetSection);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 350);
    }
  }, [isMobile]);

  useEffect(() => {
    const handleHashChange = () => {
      const { section: hashSection, detailId } = parseHashState();
      if (hashSection) {
        setActiveSection(hashSection);
        if (hashSection === "projects") {
          setSelectedProjectId(detailId);
          setSelectedHackathonId(null);
          setSelectedBlogId(null);
        } else if (hashSection === "hackathons") {
          setSelectedHackathonId(detailId);
          setSelectedProjectId(null);
          setSelectedBlogId(null);
        } else if (hashSection === "blogs") {
          setSelectedBlogId(detailId);
          setSelectedProjectId(null);
          setSelectedHackathonId(null);
        } else {
          setSelectedProjectId(null);
          setSelectedHackathonId(null);
          setSelectedBlogId(null);
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  const navigateToSection = useCallback((section: SectionId) => {
    setActiveSection(section);
    setSelectedProjectId(null);
    setSelectedHackathonId(null);
    setSelectedBlogId(null);
    updateUrlHash(section);
  }, []);

  const fetchProjectsIfNeeded = useCallback(async () => {
    setProjects((prev) => {
      if (prev !== null) return prev;
      setProjectsLoading(true);
      fetch("/api/projects")
        .then(async (res) => {
          if (!res.ok) return { projects: [] };
          return res.json();
        })
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
        .catch(() => {
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
        .then(async (res) => {
          if (!res.ok) return { hackathons: [] };
          return res.json();
        })
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
        .catch(() => {
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
        .then(async (res) => {
          if (!res.ok) return { blogs: [] };
          return res.json();
        })
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
        .catch(() => {
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
    updateUrlHash("projects", "project", projectId);
  }, []);

  const closeCaseStudy = useCallback(() => {
    setSelectedProjectId(null);
    updateUrlHash("projects");
  }, []);

  const openHackathon = useCallback((hackathonId: string) => {
    setActiveSection("hackathons");
    setSelectedHackathonId(hackathonId);
    updateUrlHash("hackathons", "hackathon", hackathonId);
  }, []);

  const closeHackathon = useCallback(() => {
    setSelectedHackathonId(null);
    updateUrlHash("hackathons");
  }, []);

  const openBlog = useCallback((blogId: string) => {
    setActiveSection("blogs");
    setSelectedBlogId(blogId);
    updateUrlHash("blogs", "blog", blogId);
  }, []);

  const closeBlog = useCallback(() => {
    setSelectedBlogId(null);
    updateUrlHash("blogs");
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
