"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, CheckCircle, AlertCircle } from "lucide-react";

import { useProfileQuery } from "@/hooks/usePortfolioQueries";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AdminProfileForm() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useProfileQuery();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    coverImage: "",
    profileImage: "",
    linkedinUrl: "",
    githubUrl: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        title: profile.title || "",
        bio: Array.isArray(profile.bio) ? profile.bio.join("\n\n") : profile.bio || "",
        coverImage: profile.coverImage || "",
        profileImage: profile.profileImage || "",
        linkedinUrl: profile.linkedinUrl || "",
        githubUrl: profile.githubUrl || "",
      });
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: async (updatedData: typeof formData) => {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updatedData,
          bio: updatedData.bio.split("\n\n").filter((p) => p.trim() !== ""),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");
      return data.profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setMessage({ type: "success", text: "Profile updated successfully!" });
    },
    onError: (err: any) => {
      setMessage({ type: "error", text: err.message || "Something went wrong" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    mutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="bg-card border border-border">
      <CardHeader>
        <CardTitle className="text-xl font-serif">Manage Profile Page</CardTitle>
        <CardDescription>
          Update your headline, biography, avatar, cover image, and social profile links.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
          {message && (
            <div
              className={`p-4 rounded-lg flex items-center gap-3 text-sm font-medium ${
                message.type === "success"
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Muhammad Hammad"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Headline / Job Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="FullStack & AI Developer"
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profileImage">Profile Image URL</Label>
              <Input
                id="profileImage"
                value={formData.profileImage}
                onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                placeholder="/profile.webp or https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input
                id="coverImage"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="/cover.webp or https://..."
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
              <Input
                id="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://www.linkedin.com/in/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub Profile URL</Label>
              <Input
                id="githubUrl"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio Paragraphs (Separate paragraphs with double newlines)</Label>
            <Textarea
              id="bio"
              rows={6}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="First paragraph...\n\nSecond paragraph..."
            />
          </div>

          <Button type="submit" disabled={mutation.isPending} className="min-w-[140px]">
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
