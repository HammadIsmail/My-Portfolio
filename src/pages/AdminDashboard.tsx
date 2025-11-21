import { useState, useEffect } from "react";
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
import { Pencil, Trash2, Plus } from "lucide-react";

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
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editorMode, setEditorMode] = useState<"rich" | "markdown">("rich");
  
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");
  const [readTime, setReadTime] = useState("");

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem("adminAuth");
    if (!isAuth) {
      navigate("/admin/login");
    }
    
    // Load posts
    loadPosts();
  }, [navigate]);

  const loadPosts = () => {
    const existingPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
    setPosts(existingPosts);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    toast.success("Logged out successfully");
    navigate("/admin/login");
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
    setShowForm(true);
  };

  const handleDelete = (postId: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      const updatedPosts = posts.filter((p) => p.id !== postId);
      localStorage.setItem("blogPosts", JSON.stringify(updatedPosts));
      setPosts(updatedPosts);
      toast.success("Blog post deleted successfully!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPost) {
      // Update existing post
      const updatedPost: BlogPost = {
        ...editingPost,
        title,
        excerpt,
        content,
        category,
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        image: image || editingPost.image,
        readTime: readTime || editingPost.readTime,
      };

      const updatedPosts = posts.map((p) => (p.id === editingPost.id ? updatedPost : p));
      localStorage.setItem("blogPosts", JSON.stringify(updatedPosts));
      setPosts(updatedPosts);
      toast.success("Blog post updated successfully!");
    } else {
      // Create new post
      const newPost: BlogPost = {
        id: Date.now().toString(),
        title,
        excerpt,
        content,
        date: new Date().toISOString().split('T')[0],
        readTime: readTime || "5 min read",
        category,
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        image: image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800",
      };

      const updatedPosts = [newPost, ...posts];
      localStorage.setItem("blogPosts", JSON.stringify(updatedPosts));
      setPosts(updatedPosts);
      toast.success("Blog post created successfully!");
    }
    
    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setExcerpt("");
    setContent("");
    setCategory("");
    setTags("");
    setImage("");
    setReadTime("");
    setEditingPost(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8 mt-20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">⚠️ Using insecure localStorage - not for production!</p>
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

        {/* Posts List */}
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
                          <Badge variant="outline">{post.category}</Badge>
                          {post.tags.slice(0, 2).map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">{post.date} • {post.readTime}</p>
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
              </div>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
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

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  required
                  placeholder="Write a short description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="content">Full Content *</Label>
                  <Tabs value={editorMode} onValueChange={(v) => setEditorMode(v as "rich" | "markdown")}>
                    <TabsList className="h-8">
                      <TabsTrigger value="rich" className="text-xs">Rich Text</TabsTrigger>
                      <TabsTrigger value="markdown" className="text-xs">Markdown</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                {editorMode === "rich" ? (
                  <RichTextEditor content={content} onChange={setContent} />
                ) : (
                  <MarkdownEditor content={content} onChange={setContent} />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    placeholder="e.g., Technology, Design"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="readTime">Read Time</Label>
                  <Input
                    id="readTime"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="e.g., 5 min read"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated) *</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  required
                  placeholder="e.g., React, TypeScript, Web Development"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/image.jpg (optional)"
                />
              </div>

              <Button type="submit" className="w-full">
                {editingPost ? "Update" : "Create"} Blog Post
              </Button>
            </form>
          </CardContent>
        </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
