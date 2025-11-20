import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface BlogPost {
  id: number | string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Building Scalable Web Applications with React and Node.js",
    excerpt: "Learn how to architect and build production-ready web applications using modern technologies like React, Node.js, and TypeScript.",
    date: "2025-01-15",
    readTime: "8 min read",
    category: "Web Development",
    tags: ["React", "Node.js", "TypeScript"],
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop"
  },
  {
    id: 2,
    title: "Microservices Architecture: Best Practices and Patterns",
    excerpt: "Explore the world of microservices architecture, including communication patterns, deployment strategies, and common pitfalls to avoid.",
    date: "2025-01-10",
    readTime: "10 min read",
    category: "Architecture",
    tags: ["Microservices", "Docker", "AWS"],
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=500&fit=crop"
  },
  {
    id: 3,
    title: "Modern Authentication Strategies for Web Applications",
    excerpt: "Deep dive into authentication and authorization patterns including JWT, OAuth 2.0, and session management best practices.",
    date: "2025-01-05",
    readTime: "7 min read",
    category: "Security",
    tags: ["Authentication", "Security", "OAuth"],
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=500&fit=crop"
  },
  {
    id: 4,
    title: "Building Real-Time Applications with Socket.IO",
    excerpt: "Create engaging real-time features like chat, notifications, and live updates using Socket.IO and WebSockets.",
    date: "2024-12-28",
    readTime: "6 min read",
    category: "Real-Time",
    tags: ["Socket.IO", "WebSockets", "Real-Time"],
    image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&h=500&fit=crop"
  },
  {
    id: 5,
    title: "Database Design: SQL vs NoSQL - Making the Right Choice",
    excerpt: "Understanding when to use SQL databases like PostgreSQL versus NoSQL solutions like MongoDB for your application.",
    date: "2024-12-20",
    readTime: "9 min read",
    category: "Database",
    tags: ["PostgreSQL", "MongoDB", "Database"],
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=500&fit=crop"
  },
  {
    id: 6,
    title: "Optimizing React Performance: Tips and Tricks",
    excerpt: "Practical techniques to optimize React applications including code splitting, lazy loading, and memoization strategies.",
    date: "2024-12-15",
    readTime: "7 min read",
    category: "Performance",
    tags: ["React", "Performance", "Optimization"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop"
  }
];

const Blog = () => {
  const [allPosts, setAllPosts] = useState<BlogPost[]>(blogPosts);

  useEffect(() => {
    // Load custom posts from localStorage
    const customPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
    setAllPosts([...customPosts, ...blogPosts]);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 sm:pt-24 pb-12 sm:pb-16 lg:pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Header Section */}
          <div className="mb-8 sm:mb-12">
            <Link to="/">
              <Button variant="ghost" className="mb-4 sm:mb-6 -ml-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Blog</h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
              Thoughts, tutorials, and insights on web development, architecture, and modern technologies.
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {allPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                    {post.category}
                  </Badge>
                </div>
                
                <CardHeader>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="mb-4 line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Coming Soon Message */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground text-sm">
              More articles coming soon. Stay tuned for updates on web development, architecture, and tech trends.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
