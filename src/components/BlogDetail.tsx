"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { usePortfolio } from "@/context/PortfolioContext";

type BlogDetailProps = {
  title: string;
  description: string;
  content: string;
  tags: string[];
  image: string;
  createdAt: string;
};

const BlogDetail = ({ blogId }: { blogId: string }) => {
  const { closeBlog } = usePortfolio();
  const [blog, setBlog] = useState<BlogDetailProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    fetch(`/api/blogs/${blogId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch blog");
        return res.json();
      })
      .then((data) => {
        setBlog(data.blog);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [blogId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-4xl">
        <button
          onClick={closeBlog}
          className="inline-flex items-center text-sm font-medium hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blogs
        </button>
        <p className="text-muted-foreground">Blog post not found.</p>
      </div>
    );
  }

  const isHtml = /<[a-z][\s\S]*>/i.test(blog.content);

  return (
    <div className="py-6 sm:py-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <button
          onClick={closeBlog}
          className="inline-flex items-center text-sm font-medium hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blogs
        </button>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { dateStyle: "long" })}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 font-serif leading-tight">
            {blog.title}
          </h1>
          <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
            {blog.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Cover Image */}
        <div className="mb-12 aspect-[21/9] w-full relative rounded-xl overflow-hidden shadow-lg border border-border bg-muted">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Body */}
        <article className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none text-foreground/90 leading-relaxed">
          {isHtml ? (
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.content}</ReactMarkdown>
          )}
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
