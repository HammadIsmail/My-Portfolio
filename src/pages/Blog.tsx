import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogFilters from "@/components/BlogFilters";
import { supabase } from "@/integrations/supabase/client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  slug: string;
}

const defaultPosts: BlogPost[] = [
  {
    id: "1",
    title: "Building Scalable Web Applications with React and Node.js",
    excerpt: "Learn how to architect and build production-ready web applications using modern technologies like React, Node.js, and TypeScript.",
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
    date: "2025-01-05",
    readTime: "7 min read",
    category: "Security",
    tags: ["Authentication", "Security", "OAuth"],
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=500&fit=crop",
    slug: "modern-authentication-strategies"
  },
];

const POSTS_PER_PAGE = 12;

const Blog = () => {
  const [allPosts, setAllPosts] = useState<BlogPost[]>(defaultPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    const now = new Date().toISOString();
    
    // Fetch published posts and scheduled posts that have passed their scheduled time
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        categories (name)
      `)
      .or(`status.eq.published,and(status.eq.scheduled,scheduled_at.lte.${now})`)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      const dbPosts: BlogPost[] = data.map(post => ({
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
      setAllPosts([...dbPosts, ...defaultPosts]);
    } else {
      setAllPosts(defaultPosts);
    }
    setIsLoading(false);
  };

  // Extract unique categories and tags
  const categories = useMemo(() => {
    const cats = new Set(allPosts.map((post) => post.category));
    return Array.from(cats).sort();
  }, [allPosts]);

  const tags = useMemo(() => {
    const tagSet = new Set<string>();
    allPosts.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [allPosts]);

  // Filter posts based on search and filters
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      const matchesTag = !selectedTag || post.tags.includes(selectedTag);

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [allPosts, searchQuery, selectedCategory, selectedTag]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedTag("");
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedTag]);

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

          {/* Filters */}
          <BlogFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            categories={categories}
            tags={tags}
            onClearFilters={handleClearFilters}
          />

          {/* Blog Grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts found matching your filters.</p>
              <Button variant="link" onClick={handleClearFilters} className="mt-2">
                Clear all filters
              </Button>
            </div>
          ) : (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {paginatedPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
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
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    const showPage = 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                    const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

                    if (showEllipsisBefore || showEllipsisAfter) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    if (!showPage) return null;

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
          </>
          )}

          {/* Showing Results Info */}
          {filteredPosts.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-muted-foreground text-sm">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredPosts.length)} of {filteredPosts.length} posts
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;