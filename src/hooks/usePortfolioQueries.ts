"use client";

import { useQuery } from "@tanstack/react-query";

// Types
export type ProjectType = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  imagePosition: string;
  githubUrl?: string;
  demoUrl?: string;
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

export type ProfileData = {
  name: string;
  title: string;
  bio: string[];
  coverImage: string;
  profileImage: string;
  linkedinUrl: string;
  githubUrl: string;
};

export type ExperienceItem = {
  _id?: string;
  id?: string;
  role: string;
  company: string;
  location: string;
  workType: string;
  period: string;
  description: string;
  visible: boolean;
  order?: number;
};

const DEFAULT_PROFILE: ProfileData = {
  name: "Hammad",
  title: "FullStack & AI Developer",
  coverImage: "/cover.webp",
  profileImage: "/profile.webp",
  linkedinUrl: "https://www.linkedin.com/in/muhammad-hammad-uet/",
  githubUrl: "https://github.com/HammadIsmail",
  bio: [
    "I'm a Full-Stack Developer passionate about building scalable, high-performance web and mobile applications. I specialize in React, Next.js, React Native, Node.js (Express), FastAPI, and NestJS, with experience designing backend systems using MongoDB, PostgreSQL, MySQL, and Neo4j.",
    "I also build AI-powered applications, integrating large language models and intelligent workflows into production-ready software. My experience includes developing REST and GraphQL APIs, real-time applications with Socket.IO, cloud deployment, and modern software architecture."
  ]
};

// 1. Projects Query
export function useProjectsQuery() {
  return useQuery<ProjectType[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) return [];
        const data = await res.json();
        return (data.projects || []).map((p: any) => ({
          id: p._id ? p._id.toString() : p.id,
          title: p.title,
          description: p.description,
          image: p.image,
          tags: p.tags || [],
          imagePosition: p.imagePosition || "left",
          githubUrl: p.githubUrl || null,
          demoUrl: p.demoUrl || null,
        }));
      } catch (err) {
        console.warn("Could not fetch projects API:", err);
        return [];
      }
    },
  });
}

// 2. Hackathons Query
export function useHackathonsQuery() {
  return useQuery<HackathonType[]>({
    queryKey: ["hackathons"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/hackathons");
        if (!res.ok) return [];
        const data = await res.json();
        return (data.hackathons || []).map((h: any) => ({
          id: h._id ? h._id.toString() : h.id,
          title: h.title,
          description: h.description,
          image: h.image,
          tags: h.tags || [],
          imagePosition: h.imagePosition || "left",
          demoUrl: h.demoUrl || null,
          githubUrl: h.githubUrl || null,
        }));
      } catch (err) {
        console.warn("Could not fetch hackathons API:", err);
        return [];
      }
    },
  });
}

// 3. Blogs Query
export function useBlogsQuery() {
  return useQuery<BlogType[]>({
    queryKey: ["blogs"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/blogs");
        if (!res.ok) return [];
        const data = await res.json();
        return (data.blogs || []).map((b: any) => ({
          id: b._id ? b._id.toString() : b.id,
          title: b.title,
          description: b.description,
          image: b.image,
          tags: b.tags || [],
          createdAt: b.createdAt ? new Date(b.createdAt).toISOString() : undefined,
        }));
      } catch (err) {
        console.warn("Could not fetch blogs API:", err);
        return [];
      }
    },
  });
}

// 4. Profile Query
export function useProfileQuery() {
  return useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) return DEFAULT_PROFILE;
        const data = await res.json();
        const p = data.profile || {};
        return {
          name: p.name || DEFAULT_PROFILE.name,
          title: p.title || DEFAULT_PROFILE.title,
          coverImage: p.coverImage || DEFAULT_PROFILE.coverImage,
          profileImage: p.profileImage || DEFAULT_PROFILE.profileImage,
          linkedinUrl: p.linkedinUrl || DEFAULT_PROFILE.linkedinUrl,
          githubUrl: p.githubUrl || DEFAULT_PROFILE.githubUrl,
          bio: Array.isArray(p.bio) && p.bio.length > 0 ? p.bio : DEFAULT_PROFILE.bio,
        };
      } catch (err) {
        console.warn("Could not fetch profile API, using default profile:", err);
        return DEFAULT_PROFILE;
      }
    },
  });
}

// 5. Experiences Query
export function useExperiencesQuery(all = false) {
  return useQuery<ExperienceItem[]>({
    queryKey: ["experiences", { all }],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/experiences${all ? "?all=true" : ""}`);
        if (!res.ok) return [];
        const data = await res.json();
        return (data.experiences || []).map((exp: any) => ({
          _id: exp._id ? exp._id.toString() : exp.id,
          id: exp._id ? exp._id.toString() : exp.id,
          role: exp.role,
          company: exp.company,
          location: exp.location,
          workType: exp.workType,
          period: exp.period,
          description: exp.description,
          visible: exp.visible,
          order: exp.order || 0,
        }));
      } catch (err) {
        console.warn("Could not fetch experiences API:", err);
        return [];
      }
    },
  });
}
