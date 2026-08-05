"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types
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

// 1. Projects Query
export function useProjectsQuery() {
  return useQuery<ProjectType[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      return (data.projects || []).map((p: any) => ({
        id: p._id ? p._id.toString() : p.id,
        title: p.title,
        description: p.description,
        image: p.image,
        tags: p.tags || [],
        imagePosition: p.imagePosition || "left",
        githubUrl: p.githubUrl || null,
      }));
    },
  });
}

// 2. Hackathons Query
export function useHackathonsQuery() {
  return useQuery<HackathonType[]>({
    queryKey: ["hackathons"],
    queryFn: async () => {
      const res = await fetch("/api/hackathons");
      if (!res.ok) throw new Error("Failed to fetch hackathons");
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
    },
  });
}

// 3. Blogs Query
export function useBlogsQuery() {
  return useQuery<BlogType[]>({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await fetch("/api/blogs");
      if (!res.ok) throw new Error("Failed to fetch blogs");
      const data = await res.json();
      return (data.blogs || []).map((b: any) => ({
        id: b._id ? b._id.toString() : b.id,
        title: b.title,
        description: b.description,
        image: b.image,
        tags: b.tags || [],
        createdAt: b.createdAt ? new Date(b.createdAt).toISOString() : undefined,
      }));
    },
  });
}

// 4. Profile Query
export function useProfileQuery() {
  return useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      const p = data.profile || {};
      return {
        name: p.name || "Muhammad Hammad",
        title: p.title || "FullStack & AI Developer",
        coverImage: p.coverImage || "/cover.webp",
        profileImage: p.profileImage || "/profile.webp",
        linkedinUrl: p.linkedinUrl || "https://www.linkedin.com/in/muhammad-hammad-uet/",
        githubUrl: p.githubUrl || "https://github.com/HammadIsmail",
        bio: Array.isArray(p.bio) && p.bio.length > 0 ? p.bio : [],
      };
    },
  });
}

// 5. Experiences Query
export function useExperiencesQuery(all = false) {
  return useQuery<ExperienceItem[]>({
    queryKey: ["experiences", { all }],
    queryFn: async () => {
      const res = await fetch(`/api/experiences${all ? "?all=true" : ""}`);
      if (!res.ok) throw new Error("Failed to fetch experiences");
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
    },
  });
}
