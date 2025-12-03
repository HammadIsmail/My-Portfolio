import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialShare from "@/components/SocialShare";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
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
  slug: string;
}

const defaultPosts: BlogPost[] = [
  {
    id: "1",
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
    id: "2",
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
    id: "3",
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
];

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    setIsLoading(true);
    
    // Try to load from database first
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        categories (name)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    
    if (!error && data) {
      const dbPost: BlogPost = {
        id: data.id,
        title: data.title,
        excerpt: data.excerpt || '',
        content: data.content,
        date: data.created_at.split('T')[0],
        readTime: '5 min read',
        category: data.categories?.name || 'Uncategorized',
        tags: [],
        image: data.cover_image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800',
        metaTitle: data.meta_title || '',
        metaDescription: data.meta_description || '',
        slug: data.slug
      };
      setPost(dbPost);
      loadRelatedPosts(data.category_id, data.id);
    } else {
      // Fallback to default posts
      const foundPost = defaultPosts.find(p => p.slug === slug);
      if (foundPost) {
        setPost(foundPost);
        const related = defaultPosts
          .filter(p => p.slug !== slug && p.category === foundPost.category)
          .slice(0, 3);
        setRelatedPosts(related);
      } else {
        navigate("/blog");
      }
    }
    setIsLoading(false);
  };

  const loadRelatedPosts = async (categoryId: string | null, currentPostId: string) => {
    if (!categoryId) {
      setRelatedPosts([]);
      return;
    }

    const { data } = await supabase
      .from('blog_posts')
      .select(`
        *,
        categories (name)
      `)
      .eq('category_id', categoryId)
      .eq('status', 'published')
      .neq('id', currentPostId)
      .limit(3);

    if (data) {
      const related: BlogPost[] = data.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || '',
        content: post.content,
        date: post.created_at.split('T')[0],
        readTime: '5 min read',
        category: post.categories?.name || 'Uncategorized',
        tags: [],
        image: post.cover_image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800',
        slug: post.slug
      }));
      setRelatedPosts(related);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20 sm:pt-24 pb-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

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
                  <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`}>
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
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetail;