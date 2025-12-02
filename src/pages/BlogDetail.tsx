import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, ArrowLeft, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialShare from "@/components/SocialShare";
import { Helmet } from "react-helmet";
import { toast } from "sonner";

interface BlogPost {
  id: number | string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
}

interface Comment {
  id: string;
  postId: string;
  author: string;
  email: string;
  content: string;
  date: string;
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [prevPost, setPrevPost] = useState<BlogPost | null>(null);
  const [nextPost, setNextPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [commentContent, setCommentContent] = useState("");

  useEffect(() => {
    const customPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
    const defaultPosts = [
      {
        id: 1,
        title: "Building Scalable Web Applications with React and Node.js",
        excerpt: "Learn how to architect and build production-ready web applications using modern technologies like React, Node.js, and TypeScript.",
        content: "<h2>Introduction</h2><p>Building scalable web applications requires careful planning and the right technology stack. In this article, we'll explore how React and Node.js work together to create robust, production-ready applications.</p><h2>Key Concepts</h2><ul><li>Component-based architecture</li><li>Server-side rendering</li><li>API design patterns</li><li>Performance optimization</li></ul><p>These technologies provide the foundation for building applications that can handle growing user bases and complex business requirements.</p>",
        date: "2025-01-15",
        readTime: "8 min read",
        category: "Web Development",
        tags: ["React", "Node.js", "TypeScript"],
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop",
        slug: "building-scalable-web-applications-react-nodejs"
      },
      {
        id: 2,
        title: "Microservices Architecture: Best Practices and Patterns",
        excerpt: "Explore the world of microservices architecture, including communication patterns, deployment strategies, and common pitfalls to avoid.",
        content: "<h2>What are Microservices?</h2><p>Microservices architecture is an approach to developing applications as a collection of small, independent services that communicate over well-defined APIs.</p><h2>Benefits</h2><ul><li>Independent deployment</li><li>Technology flexibility</li><li>Scalability</li><li>Resilience</li></ul><p>This architectural style has become increasingly popular for building complex, scalable applications.</p>",
        date: "2025-01-10",
        readTime: "10 min read",
        category: "Architecture",
        tags: ["Microservices", "Docker", "AWS"],
        image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=500&fit=crop",
        slug: "microservices-architecture-best-practices"
      },
      {
        id: 3,
        title: "Modern Authentication Strategies for Web Applications",
        excerpt: "Deep dive into authentication and authorization patterns including JWT, OAuth 2.0, and session management best practices.",
        content: "<h2>Authentication vs Authorization</h2><p>Understanding the difference between authentication and authorization is crucial for building secure applications.</p><h2>Popular Methods</h2><ul><li>JWT (JSON Web Tokens)</li><li>OAuth 2.0</li><li>Session-based authentication</li><li>Multi-factor authentication</li></ul><p>Each method has its own use cases and security considerations.</p>",
        date: "2025-01-05",
        readTime: "7 min read",
        category: "Security",
        tags: ["Authentication", "Security", "OAuth"],
        image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=500&fit=crop",
        slug: "modern-authentication-strategies"
      },
      {
        id: 4,
        title: "Building Real-Time Applications with Socket.IO",
        excerpt: "Create engaging real-time features like chat, notifications, and live updates using Socket.IO and WebSockets.",
        content: "<h2>Real-Time Communication</h2><p>Socket.IO enables real-time, bidirectional communication between web clients and servers.</p><h2>Use Cases</h2><ul><li>Live chat applications</li><li>Real-time notifications</li><li>Collaborative editing</li><li>Live dashboards</li></ul><p>Building real-time features has never been easier with modern tools like Socket.IO.</p>",
        date: "2024-12-28",
        readTime: "6 min read",
        category: "Real-Time",
        tags: ["Socket.IO", "WebSockets", "Real-Time"],
        image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&h=500&fit=crop",
        slug: "building-realtime-applications-socketio"
      },
      {
        id: 5,
        title: "Database Design: SQL vs NoSQL - Making the Right Choice",
        excerpt: "Understanding when to use SQL databases like PostgreSQL versus NoSQL solutions like MongoDB for your application.",
        content: "<h2>SQL Databases</h2><p>SQL databases are ideal for structured data with complex relationships and ACID compliance requirements.</p><h2>NoSQL Databases</h2><p>NoSQL databases excel at handling unstructured data, horizontal scaling, and flexible schemas.</p><h2>Making the Choice</h2><ul><li>Data structure and relationships</li><li>Scalability requirements</li><li>Consistency needs</li><li>Query patterns</li></ul>",
        date: "2024-12-20",
        readTime: "9 min read",
        category: "Database",
        tags: ["PostgreSQL", "MongoDB", "Database"],
        image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=500&fit=crop",
        slug: "database-design-sql-vs-nosql"
      },
      {
        id: 6,
        title: "Optimizing React Performance: Tips and Tricks",
        excerpt: "Practical techniques to optimize React applications including code splitting, lazy loading, and memoization strategies.",
        content: "<h2>Performance Optimization</h2><p>React performance optimization is crucial for building fast, responsive applications.</p><h2>Key Techniques</h2><ul><li>Code splitting</li><li>Lazy loading components</li><li>Memoization with useMemo and useCallback</li><li>Virtual scrolling</li><li>Bundle size optimization</li></ul><p>These techniques can significantly improve your application's performance and user experience.</p>",
        date: "2024-12-15",
        readTime: "7 min read",
        category: "Performance",
        tags: ["React", "Performance", "Optimization"],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
        slug: "optimizing-react-performance"
      }
    ];

    const allPosts = [...customPosts, ...defaultPosts];
    
    // Try to find by slug first, fallback to id for backward compatibility
    const foundPost = allPosts.find(p => p.slug === slug || p.id.toString() === slug);
    
    if (foundPost) {
      setPost(foundPost);
      
      // Track view count using post id
      const viewsKey = `post_views_${foundPost.id}`;
      const currentViews = parseInt(localStorage.getItem(viewsKey) || "0");
      localStorage.setItem(viewsKey, (currentViews + 1).toString());
      
      // Find adjacent posts
      const currentIndex = allPosts.findIndex(p => p.slug === slug || p.id.toString() === slug);
      if (currentIndex > 0) {
        setNextPost(allPosts[currentIndex - 1]);
      }
      if (currentIndex < allPosts.length - 1) {
        setPrevPost(allPosts[currentIndex + 1]);
      }

      // Find related posts based on matching tags or category
      const related = allPosts
        .filter(p => (p.slug !== slug && p.id.toString() !== slug))
        .map(p => {
          let score = 0;
          if (p.category === foundPost.category) score += 3;
          const matchingTags = p.tags.filter(tag => foundPost.tags.includes(tag)).length;
          score += matchingTags * 2;
          return { post: p, score };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(({ post }) => post);
      
      setRelatedPosts(related);

      // Load comments using post id
      const allComments = JSON.parse(localStorage.getItem("blogComments") || "[]");
      const postComments = allComments.filter((c: Comment) => c.postId === foundPost.id.toString());
      setComments(postComments);
    } else {
      navigate("/blog");
    }
  }, [slug, navigate]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newComment: Comment = {
      id: Date.now().toString(),
      postId: post!.id.toString(),
      author: commentAuthor,
      email: commentEmail,
      content: commentContent,
      date: new Date().toISOString(),
    };

    const allComments = JSON.parse(localStorage.getItem("blogComments") || "[]");
    const updatedComments = [newComment, ...allComments];
    localStorage.setItem("blogComments", JSON.stringify(updatedComments));
    
    setComments([newComment, ...comments]);
    setCommentAuthor("");
    setCommentEmail("");
    setCommentContent("");
    toast.success("Comment posted successfully!");
  };

  if (!post) {
    return null;
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{post.metaTitle || post.title} | Blog</title>
        <meta name="description" content={post.metaDescription || post.excerpt} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={post.metaTitle || post.title} />
        <meta property="og:description" content={post.metaDescription || post.excerpt} />
        <meta property="og:image" content={post.image} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={currentUrl} />
        <meta name="twitter:title" content={post.metaTitle || post.title} />
        <meta name="twitter:description" content={post.metaDescription || post.excerpt} />
        <meta name="twitter:image" content={post.image} />
      </Helmet>
      
      <Header />
      
      <main className="flex-1 pt-20 sm:pt-24 pb-12 sm:pb-16 lg:pb-20">
        <article className="container mx-auto px-4 sm:px-6 max-w-4xl">
          {/* Back Button */}
          <Link to="/blog">
            <Button variant="ghost" className="mb-6 -ml-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          {/* Hero Image */}
          <div className="relative h-64 sm:h-96 rounded-xl overflow-hidden mb-8">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
              {post.category}
            </Badge>
          </div>

          {/* Post Header */}
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </header>

          {/* Post Content */}
          <div 
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content || post.excerpt }}
          />

          {/* Social Share */}
          <div className="py-8 border-t border-b mb-8">
            <SocialShare
              url={currentUrl}
              title={post.title}
              description={post.excerpt}
            />
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} to={`/blog/${relatedPost.slug || relatedPost.id}`}>
                    <Card className="group hover:shadow-lg transition-all duration-300 h-full">
                      <div className="relative h-32 overflow-hidden">
                        <img 
                          src={relatedPost.image} 
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="text-base group-hover:text-primary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(relatedPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              Comments ({comments.length})
            </h2>
            
            {/* Comment Form */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">Leave a Comment</CardTitle>
                <p className="text-sm text-muted-foreground">⚠️ Using localStorage - upgrade to Lovable Cloud for production</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="author">Name *</Label>
                      <Input
                        id="author"
                        value={commentAuthor}
                        onChange={(e) => setCommentAuthor(e.target.value)}
                        required
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={commentEmail}
                        onChange={(e) => setCommentEmail(e.target.value)}
                        required
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comment">Comment *</Label>
                    <Textarea
                      id="comment"
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      required
                      placeholder="Share your thoughts..."
                      rows={4}
                    />
                  </div>
                  <Button type="submit">Post Comment</Button>
                </form>
              </CardContent>
            </Card>

            {/* Comments List */}
            {comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{comment.author}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(comment.date).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{comment.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t">
            {prevPost ? (
              <Link to={`/blog/${prevPost.slug || prevPost.id}`}>
                <Button variant="outline">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous Post
                </Button>
              </Link>
            ) : (
              <div />
            )}
            {nextPost ? (
              <Link to={`/blog/${nextPost.slug || nextPost.id}`}>
                <Button variant="outline">
                  Next Post
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetail;
