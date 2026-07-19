"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import RichTextEditor from "@/components/RichTextEditor";
import { ArrowLeft, Loader2, UploadCloud } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import axios from "axios";

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const blogId = resolvedParams.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [featured, setFeatured] = useState(false);
  const [content, setContent] = useState("");
  
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${blogId}`);
        if (!res.ok) throw new Error("Failed to fetch blog");
        const data = await res.json();
        const b = data.blog;

        setTitle(b.title);
        setDescription(b.description);
        setTags(b.tags ? b.tags.join(", ") : "");
        setFeatured(b.featured || false);
        setContent(b.content || "");
        setThumbnailUrl(b.image);
      } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogId, toast]);

  const uploadToCloudinary = async (file: File, folder: string, resourceType: 'image' | 'video') => {
    const signRes = await axios.post('/api/cloudinary-sign', { folder });
    const { timestamp, signature, cloudName, apiKey } = signRes.data;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', folder);

    const uploadRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      formData
    );
    return uploadRes.data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setUploadProgress(20);

    try {
      let finalImageUrl = thumbnailUrl;
      if (thumbnail) {
        finalImageUrl = await uploadToCloudinary(thumbnail, 'portfolio/blogs', 'image');
        setUploadProgress(70);
      }

      const payload = {
        title,
        description,
        tags,
        featured,
        content,
        image: finalImageUrl,
      };

      const res = await axios.put(`/api/blogs/${blogId}`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setUploadProgress(100);
      toast({ title: "Blog post updated successfully!" });
      router.push("/admin");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast({ title: "Error updating blog", description: error.response?.data?.error || error.message, variant: "destructive" });
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold font-serif">Edit Blog Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Blog Title *</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Summary *</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="React, Next.js, Tailwind" />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="featured" checked={featured} onCheckedChange={(c) => setFeatured(c as boolean)} />
              <Label htmlFor="featured" className="cursor-pointer">Featured Post</Label>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors bg-card">
                <input type="file" accept="image/*" onChange={(e) => e.target.files && setThumbnail(e.target.files[0])} className="hidden" id="thumbnail-upload" />
                <Label htmlFor="thumbnail-upload" className="cursor-pointer flex flex-col items-center w-full h-full">
                  <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium">{thumbnail ? thumbnail.name : "Click to change cover image"}</span>
                </Label>
              </div>
              {thumbnailUrl && !thumbnail && (
                <div className="mt-2 relative w-32 h-20 rounded overflow-hidden">
                  <Image src={thumbnailUrl} alt="Cover image" fill className="object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Blog Post Content / Learnings *</Label>
          <RichTextEditor content={content} onChange={setContent} />
        </div>

        <div className="space-y-4">
          <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {uploadProgress > 0 && uploadProgress < 100 
                  ? `Uploading ${uploadProgress}%...` 
                  : "Saving Changes..."}
              </>
            ) : (
              "Save Changes"
            )}
          </Button>

          {saving && uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full max-w-md space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Uploading cover image...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
