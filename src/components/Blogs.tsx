"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useRouter } from "next/navigation";
import { usePortfolio } from "@/context/PortfolioContext";
import { Calendar, BookOpen } from "lucide-react";
import { useBlogsQuery } from "@/hooks/usePortfolioQueries";
import { AnimatedCardShowcase } from "@/components/AnimatedCardShowcase";

const Blogs = () => {
  const { ref, isVisible } = useScrollAnimation();
  const router = useRouter();
  const { openBlog, isMobile } = usePortfolio();
  const { data: blogs, isLoading } = useBlogsQuery();
  const blogList = blogs || [];

  if (isLoading || blogList.length === 0) {
    return null;
  }

  return (
    <section ref={ref} id="blogs" className="py-8 sm:py-12 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="text-center sm:text-left mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 border-2 border-[var(--pop-border)] font-extrabold text-xs mb-2 shadow-[2px_2px_0px_#1e1b2e]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>BLOGS & ARTICLES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            Latest Writings
          </h2>
        </div>

        <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <AnimatedCardShowcase
            items={blogList}
            getItemKey={(blog) => blog.id}
            renderItem={(blog) => (
              <div className="pop-card-lg p-6 sm:p-8 flex flex-col space-y-6 w-full">
                <div className="w-full aspect-[16/10] sm:aspect-video rounded-2xl overflow-hidden border-2.5 border-[var(--pop-border)] shadow-[3.5px_3.5px_0px_#1e1b2e] flex items-center justify-center p-3 bg-slate-100 dark:bg-slate-900">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-muted-foreground border border-[var(--pop-border)] mb-3">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString(undefined, { dateStyle: "long" })
                        : "Recently"}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-foreground leading-tight">
                    {blog.title}
                  </h3>
                </div>

                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base font-medium">
                  {blog.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 dark:bg-slate-800 text-foreground border border-[var(--pop-border)] shadow-[1.5px_1.5px_0px_#1e1b2e]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-2 w-full">
                  <button
                    className="w-full py-3.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm border-2.5 border-[var(--pop-border)] shadow-[3.5px_3.5px_0px_#1e1b2e] hover:translate-y-[-2px] transition-all"
                    onClick={() =>
                      isMobile
                        ? router.push(`/blog/${blog.id}`)
                        : openBlog(blog.id)
                    }
                  >
                    Read Article ✦
                  </button>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </section>
  );
};

export default Blogs;
