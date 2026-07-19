"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useRouter } from "next/navigation";
import { usePortfolio } from "@/context/PortfolioContext";
import { Calendar, Tag } from "lucide-react";

type BlogType = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  createdAt?: string;
};

const Blogs = ({ blogs }: { blogs: BlogType[] }) => {
  const { ref, isVisible } = useScrollAnimation();
  const router = useRouter();
  const { openBlog, isMobile } = usePortfolio();

  return (
    <section id="blogs" className={isMobile ? "py-12 sm:py-16 lg:py-20" : "py-6"}>
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 font-serif">
          Blogs & Learnings
        </h2>

        {blogs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No articles posted yet. Stay tuned for learnings!
          </div>
        ) : (
          <div
            ref={ref}
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {blogs.map((blog, index) => (
              <Card
                key={blog.id}
                className="overflow-hidden border border-border bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] hover:scale-[1.02] transition-all duration-300 flex flex-col h-full cursor-pointer"
                onClick={() =>
                  isMobile
                    ? router.push(`/blog/${blog.id}`)
                    : openBlog(blog.id)
                }
              >
                {/* Cover Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {blog.createdAt
                          ? new Date(blog.createdAt).toLocaleDateString()
                          : "Recently"}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold line-clamp-2 hover:text-primary transition-colors">
                    {blog.title}
                  </h3>
                </CardHeader>

                <CardContent className="px-5 py-0 flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {blog.description}
                  </p>
                </CardContent>

                <CardFooter className="p-5 pt-4 flex flex-col items-start gap-3">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className="text-[10px] text-muted-foreground px-1.5">
                        +{blog.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  <Button
                    variant="link"
                    className="p-0 text-primary font-medium hover:underline text-sm mt-2 flex items-center gap-1 self-start"
                  >
                    Read Article →
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blogs;
