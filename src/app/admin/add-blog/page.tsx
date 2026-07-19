"use client";

import { useState } from "react";
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
import axios from "axios";

export default function AddBlogPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [featured, setFeatured] = useState(false);
  const [content, setContent] = useState("");
  
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

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
    if (!thumbnail) {
      toast({ title: "Cover image is required", variant: "destructive" });
      return;
    }

    setLoading(true);
    setUploadProgress(20);

    try {
      // 1. Upload Cover Image
      const imageUrl = await uploadToCloudinary(thumbnail, 'portfolio/blogs', 'image');
      setUploadProgress(70);

      // 2. Save Blog to DB
      const payload = {
        title,
        description,
        tags,
        featured,
        content,
        image: imageUrl,
      };

      const res = await axios.post("/api/blogs", payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setUploadProgress(100);
      toast({ title: "Blog post created successfully!" });
      router.push("/admin");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast({ title: "Error creating blog", description: error.response?.data?.error || error.message, variant: "destructive" });
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold font-serif">Add New Blog Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Blog Title *</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Master Mongoose in Next.js" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Summary *</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Brief introductory summary of the post" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Next.js, WebDev, Backend" />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="featured" checked={featured} onCheckedChange={(c) => setFeatured(c as boolean)} />
              <Label htmlFor="featured" className="cursor-pointer">Featured Post</Label>
            </div>
          </div>

          {/* Right Column (Cover Image) */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Blog Cover Image *</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors bg-card">
                <input type="file" accept="image/*" onChange={(e) => e.target.files && setThumbnail(e.target.files[0])} className="hidden" id="thumbnail-upload" required />
                <Label htmlFor="thumbnail-upload" className="cursor-pointer flex flex-col items-center">
                  <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium">{thumbnail ? thumbnail.name : "Click to upload cover image"}</span>
                  <span className="text-xs text-muted-foreground mt-1">Any format, automatically converted to WebP</span>
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="space-y-2">
          <Label>Blog Post Content / Learnings *</Label>
          <RichTextEditor content={content} onChange={setContent} />
        </div>

        <div className="space-y-4">
          <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {uploadProgress > 0 && uploadProgress < 100 
                  ? `Uploading ${uploadProgress}%...` 
                  : "Saving Post..."}
              </>
            ) : (
              "Save Blog Post"
            )}
          </Button>

          {loading && uploadProgress > 0 && uploadProgress < 100 && (
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
