import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const blog = await Blog.findById(id).lean();
    if (!blog) return {};

    return {
      title: `${blog.title} | Blog`,
      description: blog.description,
      openGraph: {
        images: [blog.image],
      },
    };
  } catch (error) {
    return {};
  }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let blog;
  try {
    await connectDB();
    blog = await Blog.findById(id).lean();
  } catch (error) {
    return notFound();
  }

  if (!blog) {
    notFound();
  }

  const isHtml = /<[a-z][\s\S]*>/i.test(blog.content);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Sidebar />
      <div className="flex-grow flex flex-col md:pl-64">
        <main className="flex-grow pt-24 pb-12 sm:pt-24 sm:pb-16 md:pt-12 lg:pt-16 lg:pb-20">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {new Date(blog.createdAt).toLocaleDateString(undefined, {
                    dateStyle: "long",
                  })}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {blog.title}
              </h1>
              <p className="text-muted-foreground text-base mb-6 leading-relaxed">
                {blog.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag: string) => (
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

            {/* Article Content */}
            <article className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none text-foreground/90 leading-relaxed">
              {isHtml ? (
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {blog.content}
                </ReactMarkdown>
              )}
            </article>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
