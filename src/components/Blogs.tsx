"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useRouter } from "next/navigation";
import { usePortfolio } from "@/context/PortfolioContext";
import { Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { useBlogsQuery } from "@/hooks/usePortfolioQueries";

import { AnimatedCardShowcase } from "@/components/AnimatedCardShowcase";

const Blogs = () => {
  const { ref, isVisible } = useScrollAnimation();
  const router = useRouter();
  const { openBlog, isMobile } = usePortfolio();
  const { data: blogs, isLoading } = useBlogsQuery();
  const blogList = blogs || [];

  if (isLoading && !blogs) {
    return (
      <section id="blogs" className={isMobile ? "py-12 sm:py-16" : "py-6"}>
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 font-serif">
            Blogs & Learnings
          </h2>
          <div className="space-y-6">
            {[1].map((i) => (
              <div key={i} className="bg-card border border-border rounded-3xl p-6 sm:p-8 flex flex-col gap-4">
                <Skeleton className="aspect-video w-full rounded-2xl" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="blogs" className={isMobile ? "py-12 sm:py-16" : "py-8"}>
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <h2 className="block md:hidden text-3xl sm:text-4xl font-bold text-center mb-8 font-serif">
          Blogs & Learnings
        </h2>

        {blogList.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No articles posted yet. Stay tuned for learnings!
          </div>
        ) : (
          <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <AnimatedCardShowcase
              items={blogList}
              getItemKey={(blog) => blog.id}
              renderItem={(blog) => (
                <div
                  className="neo-raised neo-raised-hover rounded-3xl p-6 sm:p-8 flex flex-col space-y-6 w-full"
                >
                  {/* Cover Image at top */}
                  <div className="w-full relative aspect-[16/10] sm:aspect-video rounded-2xl overflow-hidden neo-inset flex items-center justify-center p-3 sm:p-6">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-contain max-h-[460px] rounded-xl"
                    />
                  </div>

                  {/* Date & Title */}
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm neo-inset-sm px-3 py-1 rounded-full text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>
                        {blog.createdAt
                          ? new Date(blog.createdAt).toLocaleDateString(undefined, { dateStyle: "long" })
                          : "Recently"}
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif leading-tight text-foreground">
                      {blog.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                    {blog.description}
                  </p>

                  {/* Golden Pill Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs sm:text-sm px-3.5 py-1.5 rounded-full neo-pill-accent font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stacked Full-Width Pill Button */}
                  <div className="pt-4 w-full">
                    <button
                      className="w-full rounded-2xl py-3.5 px-6 text-base font-semibold neo-button-primary touch-manipulation"
                      onClick={() =>
                        isMobile
                          ? router.push(`/blog/${blog.id}`)
                          : openBlog(blog.id)
                      }
                    >
                      Read Article →
                    </button>
                  </div>
                </div>
              )}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Blogs;
