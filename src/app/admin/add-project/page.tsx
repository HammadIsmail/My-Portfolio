"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RichTextEditor from "@/components/RichTextEditor";
import { ArrowLeft, Loader2, UploadCloud } from "lucide-react";
import Link from "next/link";
import { DraggableImageList, ImageItemData } from "@/components/admin/DraggableImageList";
import { Progress } from "@/components/ui/progress";
import axios from "axios";

export default function AddProjectPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [tags, setTags] = useState("");
  const [imagePosition, setImagePosition] = useState("left");
  const [featured, setFeatured] = useState(false);
  const [content, setContent] = useState("");
  
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [sliderImages, setSliderImages] = useState<ImageItemData[]>([]);
  const [video, setVideo] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

  const handleSliderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newItems = Array.from(e.target.files).map((file) => ({
        id: `new:${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: URL.createObjectURL(file),
        file,
        isExisting: false,
      }));
      setSliderImages((prev) => [...prev, ...newItems]);
    }
  };

  const handleRemoveSliderImage = (id: string) => {
    setSliderImages((prev) => prev.filter((item) => item.id !== id));
  };

  const uploadToCloudinary = async (file: File, folder: string, resourceType: 'image' | 'video') => {
    // Get signature
    const signRes = await axios.post('/api/cloudinary-sign', { folder });
    const { timestamp, signature, cloudName, apiKey } = signRes.data;

    // Upload
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
      toast({ title: "Thumbnail is required", variant: "destructive" });
      return;
    }

    setLoading(true);
    setUploadProgress(10); // Start progress

    try {
      // 1. Upload Thumbnail
      const imageUrl = await uploadToCloudinary(thumbnail, 'portfolio/projects', 'image');
      setUploadProgress(30);

      // 2. Upload Slider Images
      const imageUrls: string[] = [];
      let i = 0;
      for (const img of sliderImages) {
        if (img.file) {
          const url = await uploadToCloudinary(img.file, 'portfolio/projects/slider', 'image');
          imageUrls.push(url);
        }
        i++;
        setUploadProgress(30 + Math.floor((i / Math.max(sliderImages.length, 1)) * 40));
      }

      // 3. Upload Video
      let videoUrl = '';
      if (video) {
        videoUrl = await uploadToCloudinary(video, 'portfolio/projects/video', 'video');
      }
      setUploadProgress(90);

      // 4. Save Project to DB
      const payload = {
        title,
        description,
        demoUrl,
        tags,
        imagePosition,
        featured,
        content,
        image: imageUrl,
        images: imageUrls,
        videoUrl,
      };

      const res = await axios.post("/api/projects", payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setUploadProgress(100);
      toast({ title: "Project created successfully!" });
      router.push("/admin");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast({ title: "Error creating project", description: error.response?.data?.error || error.message, variant: "destructive" });
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
        <h1 className="text-3xl font-bold">Add New Project</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description *</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="demoUrl">Live Demo URL</Label>
              <Input id="demoUrl" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} placeholder="https://..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="React, Next.js, Tailwind" />
            </div>

            <div className="space-y-2">
              <Label>Image Position</Label>
              <Select value={imagePosition} onValueChange={setImagePosition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="featured" checked={featured} onCheckedChange={(c) => setFeatured(c as boolean)} />
              <Label htmlFor="featured" className="cursor-pointer">Featured Project</Label>
            </div>
          </div>

          {/* Right Column (Media) */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Thumbnail Image *</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors bg-card">
                <input type="file" accept="image/*" onChange={(e) => e.target.files && setThumbnail(e.target.files[0])} className="hidden" id="thumbnail-upload" required />
                <Label htmlFor="thumbnail-upload" className="cursor-pointer flex flex-col items-center">
                  <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium">{thumbnail ? thumbnail.name : "Click to upload thumbnail"}</span>
                  <span className="text-xs text-muted-foreground mt-1">Any format, automatically converted to WebP</span>
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Slider Images (Multiple)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors bg-card">
                <input type="file" accept="image/*" multiple onChange={handleSliderUpload} className="hidden" id="slider-upload" />
                <Label htmlFor="slider-upload" className="cursor-pointer flex flex-col items-center w-full h-full">
                  <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium">Click to upload slider images</span>
                </Label>
              </div>
              <DraggableImageList items={sliderImages} setItems={setSliderImages} onRemove={handleRemoveSliderImage} />
            </div>

            <div className="space-y-2">
              <Label>Video File (Optional)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors bg-card">
                <input type="file" accept="video/*" onChange={(e) => e.target.files && setVideo(e.target.files[0])} className="hidden" id="video-upload" />
                <Label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center">
                  <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium">{video ? video.name : "Click to upload video"}</span>
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Editor */}
        <div className="space-y-2">
          <Label>Case Study Content (Markdown / Rich Text) *</Label>
          <RichTextEditor content={content} onChange={setContent} />
        </div>

        <div className="space-y-4">
          <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {uploadProgress > 0 && uploadProgress < 100 
                  ? `Uploading ${uploadProgress}%...` 
                  : "Saving Project..."}
              </>
            ) : (
              "Save Project"
            )}
          </Button>

          {loading && uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full max-w-md space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Uploading media...</span>
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
