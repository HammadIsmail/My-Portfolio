"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Eye, EyeOff, Edit, Trash2, Loader2, MapPin, Calendar } from "lucide-react";

import { useExperiencesQuery } from "@/hooks/usePortfolioQueries";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Experience = {
  _id: string;
  role: string;
  company: string;
  location: string;
  workType: string;
  period: string;
  description: string;
  visible: boolean;
  order: number;
};

export default function AdminExperienceManager() {
  const queryClient = useQueryClient();
  const { data: rawExperiences, isLoading } = useExperiencesQuery(true);
  const experiences = (rawExperiences || []) as Experience[];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    role: "",
    company: "",
    location: "Poland",
    workType: "Remote",
    period: "2025 - Present",
    description: "",
    visible: true,
    order: 0,
  });

  const toggleMutation = useMutation({
    mutationFn: async (exp: Experience) => {
      const updatedStatus = !exp.visible;
      const res = await fetch(`/api/experiences/${exp._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: updatedStatus }),
      });
      if (!res.ok) throw new Error("Failed to update visibility");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/experiences/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete experience");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const url = editingId ? `/api/experiences/${editingId}` : "/api/experiences";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save experience");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      setIsModalOpen(false);
    },
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      role: "",
      company: "",
      location: "Remote",
      workType: "Remote",
      period: "2025 - Present",
      description: "",
      visible: true,
      order: experiences.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: Experience) => {
    setEditingId(exp._id);
    setFormData({
      role: exp.role,
      company: exp.company,
      location: exp.location,
      workType: exp.workType,
      period: exp.period,
      description: exp.description,
      visible: exp.visible,
      order: exp.order || 0,
    });
    setIsModalOpen(true);
  };

  const handleToggleVisibility = (exp: Experience) => {
    toggleMutation.mutate(exp);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this experience card?")) return;
    deleteMutation.mutate(id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Experience Cards ({experiences.length})</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Add, edit, or toggle visibility to hide/show experience cards on your portfolio.
          </p>
        </div>
        <Button onClick={handleOpenAdd} size="sm">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {experiences.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
          No experience cards created yet. Add one to get started.
        </div>
      ) : (
        <div className="grid gap-4">
          {experiences.map((exp) => (
            <div
              key={exp._id}
              className={`bg-card border rounded-xl p-6 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                exp.visible ? "border-border" : "border-border/50 opacity-70 bg-muted/20"
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg">{exp.role}</h3>
                  <span className="text-primary font-semibold text-sm">@ {exp.company}</span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      exp.visible
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-amber-500/10 text-amber-500"
                    }`}
                  >
                    {exp.visible ? "Visible" : "Hidden"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-1">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {exp.location} ({exp.workType})
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {exp.period}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 pt-2">
                  {exp.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <Button
                  variant={exp.visible ? "outline" : "secondary"}
                  size="sm"
                  onClick={() => handleToggleVisibility(exp)}
                  title={exp.visible ? "Hide card from website" : "Show card on website"}
                >
                  {exp.visible ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-1.5 text-amber-500" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-1.5 text-emerald-500" />
                      Show
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleOpenEdit(exp)}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(exp._id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Experience Card" : "Add New Experience Card"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Job Role / Position</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Junior Full Stack Developer"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Infoquestpro"
                  required
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Poland"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workType">Work Type</Label>
                <Input
                  id="workType"
                  value={formData.workType}
                  onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                  placeholder="Remote / Hybrid / Onsite"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="period">Time Period</Label>
                <Input
                  id="period"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  placeholder="2025 - Present"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your achievements and key responsibilities..."
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="visible"
                checked={formData.visible}
                onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <Label htmlFor="visible" className="cursor-pointer text-sm font-medium">
                Show this experience card on portfolio (Visible)
              </Label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingId ? "Update Experience" : "Create Experience"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
