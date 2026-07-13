"use client";

import { useState, useEffect, use } from "react";
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
import Image from "next/image";
import axios from "axios";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [tags, setTags] = useState("");
  const [imagePosition, setImagePosition] = useState("left");
  const [featured, setFeatured] = useState(false);
  const [content, setContent] = useState("");
  
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(""); // to display existing
  
  const [sliderImages, setSliderImages] = useState<ImageItemData[]>([]);
  
  const [video, setVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) throw new Error("Failed to fetch project");
        const data = await res.json();
        const p = data.project;

        setTitle(p.title);
        setDescription(p.description);
        setDemoUrl(p.demoUrl || "");
        setTags(p.tags ? p.tags.join(", ") : "");
        setImagePosition(p.imagePosition || "left");
        setFeatured(p.featured || false);
        setContent(p.content || "");
        setThumbnailUrl(p.image);
        setVideoUrl(p.videoUrl || "");

        if (p.images && p.images.length > 0) {
          const initialSlider: ImageItemData[] = p.images.map((img: string) => ({
            id: `existing:${img}`,
            url: img,
            isExisting: true,
          }));
          setSliderImages(initialSlider);
        }
      } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId, toast]);

  const handleSliderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newItems = Array.from(e.target.files).map((file) => ({
        id: `new:${file.name}`,
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
    setUploadProgress(10);

    try {
      let finalImageUrl = thumbnailUrl;
      if (thumbnail) {
        finalImageUrl = await uploadToCloudinary(thumbnail, 'portfolio/projects', 'image');
        setUploadProgress(30);
      }

      const finalImages: string[] = [];
      let i = 0;
      for (const img of sliderImages) {
        if (img.file) {
          const url = await uploadToCloudinary(img.file, 'portfolio/projects/slider', 'image');
          finalImages.push(url);
        } else if (img.isExisting) {
          finalImages.push(img.url);
        }
        i++;
        setUploadProgress(30 + Math.floor((i / Math.max(sliderImages.length, 1)) * 40));
      }

      let finalVideoUrl = videoUrl;
      if (video) {
        finalVideoUrl = await uploadToCloudinary(video, 'portfolio/projects/video', 'video');
      }
      setUploadProgress(90);

      const payload = {
        title,
        description,
        demoUrl,
        tags,
        imagePosition,
        featured,
        content,
        image: finalImageUrl,
        images: finalImages,
        videoUrl: finalVideoUrl || undefined,
      };

      const res = await axios.put(`/api/projects/${projectId}`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setUploadProgress(100);
      toast({ title: "Project updated successfully!" });
      router.push("/admin");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast({ title: "Error updating project", description: error.response?.data?.error || error.message, variant: "destructive" });
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
        <h1 className="text-3xl font-bold">Edit Project</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Thumbnail Image</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors bg-card">
                <input type="file" accept="image/*" onChange={(e) => e.target.files && setThumbnail(e.target.files[0])} className="hidden" id="thumbnail-upload" />
                <Label htmlFor="thumbnail-upload" className="cursor-pointer flex flex-col items-center w-full h-full">
                  <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium">{thumbnail ? thumbnail.name : "Click to change thumbnail"}</span>
                </Label>
              </div>
              {thumbnailUrl && !thumbnail && (
                <div className="mt-2 relative w-32 h-20 rounded overflow-hidden">
                  <Image src={thumbnailUrl} alt="Thumbnail" fill className="object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Slider Images (Multiple)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors bg-card">
                <input type="file" accept="image/*" multiple onChange={handleSliderUpload} className="hidden" id="slider-upload" />
                <Label htmlFor="slider-upload" className="cursor-pointer flex flex-col items-center w-full h-full">
                  <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium">Click to add slider images</span>
                </Label>
              </div>
              <DraggableImageList items={sliderImages} setItems={setSliderImages} onRemove={handleRemoveSliderImage} />
            </div>

            <div className="space-y-2">
              <Label>Video File</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors bg-card">
                <input type="file" accept="video/*" onChange={(e) => e.target.files && setVideo(e.target.files[0])} className="hidden" id="video-upload" />
                <Label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center w-full h-full">
                  <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium">{video ? video.name : "Click to change video"}</span>
                </Label>
              </div>
              {videoUrl && !video && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Current video attached. Uploading a new one will replace it.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Case Study Content (Markdown / Rich Text) *</Label>
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
