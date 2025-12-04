import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RichTextEditor from "@/components/RichTextEditor";
import MarkdownEditor from "@/components/MarkdownEditor";
import CategoryManager from "@/components/CategoryManager";
import ImageUpload from "@/components/ImageUpload";
import MediaLibraryTab from "@/components/MediaLibraryTab";
import { Pencil, Trash2, Plus, BarChart3, Eye, TrendingUp, Save, Tag, CalendarClock, Image as ImageIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Calendar, Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  status?: string;
  scheduledAt?: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editorMode, setEditorMode] = useState<"rich" | "markdown">("rich");
  const [activeTab, setActiveTab] = useState("posts");
  const [previewMode, setPreviewMode] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");
  const [readTime, setReadTime] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [postStatus, setPostStatus] = useState<"draft" | "published" | "scheduled">("draft");
  const [scheduledAt, setScheduledAt] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadPosts();
      loadCategories();
    }
  }, [user]);

  // Auto-save functionality
  useEffect(() => {
    if (!showForm || (!title && !content && !excerpt)) {
      return;
    }

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      saveDraft();
    }, 3000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [title, excerpt, content, category, tags, image, readTime, metaTitle, metaDescription, slug, showForm]);

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !editingPost && !slug) {
      const generatedSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 60);
      setSlug(generatedSlug);
    }
  }, [title, editingPost, slug]);

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (!error && data) {
      setCategories(data);
    }
  };

  const loadPosts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        categories (name)
      `)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      const formattedPosts = data.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || '',
        content: post.content,
        date: post.created_at.split('T')[0],
        readTime: '5 min read',
        category: post.categories?.name || '',
        tags: [],
        image: post.cover_image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800',
        metaTitle: post.meta_title || '',
        metaDescription: post.meta_description || '',
        slug: post.slug,
        status: post.status,
        scheduledAt: (post as any).scheduled_at
      }));
      setPosts(formattedPosts);
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setExcerpt(post.excerpt);
    setContent(post.content || "");
    setCategory(post.category);
    setTags(post.tags.join(", "));
    setImage(post.image);
    setReadTime(post.readTime);
    setMetaTitle(post.metaTitle || "");
    setMetaDescription(post.metaDescription || "");
    setSlug(post.slug || "");
    setPostStatus((post.status as "draft" | "published" | "scheduled") || "draft");
    setScheduledAt(post.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : "");
    setShowForm(true);
  };

  const handleDelete = async (postId: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);
      
      if (error) {
        toast.error("Failed to delete post");
      } else {
        setPosts(posts.filter(p => p.id !== postId));
        toast.success("Blog post deleted successfully!");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!slug || !slug.trim()) {
      toast.error("URL slug is required");
      return;
    }

    if (postStatus === "scheduled" && !scheduledAt) {
      toast.error("Please select a scheduled date and time");
      return;
    }

    // Find category id
    const selectedCategory = categories.find(c => c.name === category);
    
    const finalStatus = postStatus === "scheduled" ? "scheduled" : postStatus;
    const finalScheduledAt = postStatus === "scheduled" ? new Date(scheduledAt).toISOString() : null;
    const finalPublishedAt = postStatus === "published" ? new Date().toISOString() : null;

    if (editingPost) {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          title,
          slug: slug.trim(),
          content,
          excerpt,
          cover_image: image || null,
          category_id: selectedCategory?.id || null,
          meta_title: metaTitle || title,
          meta_description: metaDescription || excerpt,
          status: finalStatus,
          scheduled_at: finalScheduledAt,
          published_at: finalPublishedAt,
        } as any)
        .eq('id', editingPost.id);

      if (error) {
        toast.error("Failed to update post: " + error.message);
      } else {
        toast.success("Blog post updated successfully!");
        loadPosts();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('blog_posts')
        .insert({
          title,
          slug: slug.trim(),
          content,
          excerpt,
          cover_image: image || null,
          category_id: selectedCategory?.id || null,
          author_id: user!.id,
          meta_title: metaTitle || title,
          meta_description: metaDescription || excerpt,
          status: finalStatus,
          scheduled_at: finalScheduledAt,
          published_at: finalPublishedAt,
        } as any);

      if (error) {
        if (error.message.includes('duplicate')) {
          toast.error("A post with this URL slug already exists");
        } else {
          toast.error("Failed to create post: " + error.message);
        }
      } else {
        toast.success("Blog post created successfully!");
        loadPosts();
        resetForm();
      }
    }
  };

  const saveDraft = () => {
    const draft = {
      title,
      excerpt,
      content,
      category,
      tags,
      image,
      readTime,
      metaTitle,
      metaDescription,
      slug,
      editingPostId: editingPost?.id,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('blogPostDraft', JSON.stringify(draft));
    setLastSaved(new Date());
  };

  const clearDraft = () => {
    localStorage.removeItem('blogPostDraft');
    setLastSaved(null);
  };

  const resetForm = () => {
    setTitle("");
    setExcerpt("");
    setContent("");
    setCategory("");
    setTags("");
    setImage("");
    setReadTime("");
    setMetaTitle("");
    setMetaDescription("");
    setSlug("");
    setPostStatus("draft");
    setScheduledAt("");
    setEditingPost(null);
    setShowForm(false);
    setPreviewMode(false);
    clearDraft();
  };

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalViews = 0;
    const popularPosts: { title: string; views: number }[] = [];

    const categoryData = posts.reduce((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({
      name,
      value
    }));

    return {
      totalViews,
      totalPosts: posts.length,
      totalComments: 0,
      popularPosts,
      categoryChartData
    };
  }, [posts]);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', 'hsl(var(--destructive))'];

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8 mt-20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              {isAdmin ? "Admin access" : "Author access"} • {user.email}
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate("/blog")}>
              View Blog
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="posts">Blog Posts</TabsTrigger>
            <TabsTrigger value="media">
              <ImageIcon className="w-4 h-4 mr-2" />
              Media
            </TabsTrigger>
            <TabsTrigger value="categories">
              <Tag className="w-4 h-4 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-6">
            {!showForm && (
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Blog Posts</CardTitle>
                      <CardDescription>Manage your blog posts</CardDescription>
                    </div>
                    <Button onClick={() => setShowForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      New Post
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {posts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No posts yet. Create your first post!</p>
                  ) : (
                    <div className="space-y-4">
                      {posts.map((post) => (
                        <div key={post.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <img src={post.image} alt={post.title} className="w-24 h-24 object-cover rounded" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg mb-1 truncate">{post.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{post.excerpt}</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {post.category && <Badge variant="outline">{post.category}</Badge>}
                              <Badge variant={
                                post.status === 'published' ? 'default' : 
                                post.status === 'scheduled' ? 'secondary' : 'outline'
                              }>
                                {post.status === 'scheduled' && post.scheduledAt 
                                  ? `Scheduled: ${new Date(post.scheduledAt).toLocaleDateString()} ${new Date(post.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                  : post.status || 'draft'}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{post.date}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(post.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Post Form */}
            {showForm && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{editingPost ? "Edit" : "Create New"} Blog Post</CardTitle>
                      <CardDescription>
                        Fill in the details below to {editingPost ? "update" : "create"} a blog post
                      </CardDescription>
                      {lastSaved && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                          <Save className="w-3 h-3" />
                          <span>Auto-saved {new Date(lastSaved).toLocaleTimeString()}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setPreviewMode(!previewMode)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {previewMode ? "Edit" : "Preview"}
                      </Button>
                      <Button variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {previewMode ? (
                    <div className="space-y-6">
                      <div className="relative h-64 sm:h-96 rounded-xl overflow-hidden">
                        <img 
                          src={image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800"} 
                          alt={title || "Preview"}
                          className="w-full h-full object-cover"
                        />
                        {category && (
                          <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                            {category}
                          </Badge>
                        )}
                      </div>

                      <header className="space-y-4">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                          {title || "Untitled Post"}
                        </h1>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{readTime || "5 min read"}</span>
                          </div>
                        </div>

                        {tags && (
                          <div className="flex flex-wrap gap-2">
                            {tags.split(",").map((tag, index) => (
                              <Badge key={index} variant="secondary">
                                {tag.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </header>

                      <div className="prose prose-lg max-w-none">
                        <p className="text-xl text-muted-foreground">{excerpt || "No excerpt provided"}</p>
                        <div dangerouslySetInnerHTML={{ __html: content || "<p>No content yet</p>" }} />
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          placeholder="Enter blog post title"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="slug">URL Slug *</Label>
                          <Input
                            id="slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'))}
                            required
                            placeholder="url-friendly-slug"
                          />
                          <p className="text-xs text-muted-foreground">
                            URL: /blog/{slug || 'your-slug'}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.name}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="excerpt">Excerpt *</Label>
                        <Textarea
                          id="excerpt"
                          value={excerpt}
                          onChange={(e) => setExcerpt(e.target.value)}
                          required
                          placeholder="Brief summary of the blog post"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Content *</Label>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant={editorMode === "rich" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setEditorMode("rich")}
                            >
                              Rich Text
                            </Button>
                            <Button
                              type="button"
                              variant={editorMode === "markdown" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setEditorMode("markdown")}
                            >
                              Markdown
                            </Button>
                          </div>
                        </div>
                        {editorMode === "rich" ? (
                          <RichTextEditor content={content} onChange={setContent} />
                        ) : (
                          <MarkdownEditor content={content} onChange={setContent} />
                        )}
                      </div>

                      <ImageUpload value={image} onChange={setImage} />

                      <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma separated)</Label>
                        <Input
                          id="tags"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          placeholder="react, typescript, web dev"
                        />
                      </div>

                      {/* Publishing Options */}
                      <Card className="border-dashed">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <CalendarClock className="h-5 w-5" />
                            Publishing Options
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Post Status</Label>
                              <p className="text-xs text-muted-foreground">
                                Choose when to publish this post
                              </p>
                            </div>
                            <Select 
                              value={postStatus} 
                              onValueChange={(v) => setPostStatus(v as "draft" | "published" | "scheduled")}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Publish Now</SelectItem>
                                <SelectItem value="scheduled">Schedule</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {postStatus === "scheduled" && (
                            <div className="space-y-2">
                              <Label htmlFor="scheduledAt">Schedule Date & Time</Label>
                              <Input
                                id="scheduledAt"
                                type="datetime-local"
                                value={scheduledAt}
                                onChange={(e) => setScheduledAt(e.target.value)}
                                min={new Date().toISOString().slice(0, 16)}
                              />
                              <p className="text-xs text-muted-foreground">
                                Post will be automatically published at the scheduled time
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="border-dashed">
                        <CardHeader>
                          <CardTitle className="text-lg">SEO Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="metaTitle">Meta Title</Label>
                            <Input
                              id="metaTitle"
                              value={metaTitle}
                              onChange={(e) => setMetaTitle(e.target.value)}
                              placeholder={title || "Leave empty to use post title"}
                              maxLength={60}
                            />
                            <p className="text-xs text-muted-foreground">{metaTitle.length}/60 characters</p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="metaDescription">Meta Description</Label>
                            <Textarea
                              id="metaDescription"
                              value={metaDescription}
                              onChange={(e) => setMetaDescription(e.target.value)}
                              placeholder={excerpt || "Leave empty to use excerpt"}
                              maxLength={160}
                              rows={2}
                            />
                            <p className="text-xs text-muted-foreground">{metaDescription.length}/160 characters</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Button type="submit" className="w-full">
                        {postStatus === "scheduled" 
                          ? "Schedule Post" 
                          : postStatus === "draft" 
                            ? "Save as Draft" 
                            : editingPost 
                              ? "Update Post" 
                              : "Publish Post"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media">
            <MediaLibraryTab />
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <CategoryManager onCategoriesChange={loadCategories} />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalPosts}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalViews}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{categories.length}</div>
                </CardContent>
              </Card>
            </div>

            {analytics.categoryChartData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Posts by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.categoryChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {analytics.categoryChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;