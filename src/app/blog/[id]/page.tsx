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
      <div className="flex-grow flex flex-col pt-24">
        <main className="flex-grow pb-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <Link
              href="/"
              className="inline-flex items-center text-xs font-black bg-card border-2 border-[var(--pop-border)] shadow-[2.5px_2.5px_0px_#1e1b2e] px-4 py-2 rounded-full hover:translate-y-[-1px] transition-all mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Link>

            <div className="mb-8 pop-card-lg p-6 sm:p-8">
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-muted-foreground border border-[var(--pop-border)] mb-3">
                <Calendar className="w-3.5 h-3.5 text-purple-600" />
                <span>
                  {new Date(blog.createdAt).toLocaleDateString(undefined, {
                    dateStyle: "long",
                  })}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black mb-4 text-foreground leading-tight">
                {blog.title}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base font-medium mb-6 leading-relaxed">
                {blog.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-foreground border border-[var(--pop-border)] font-extrabold shadow-[1px_1px_0px_#1e1b2e]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-12 aspect-[21/9] w-full relative rounded-2xl overflow-hidden border-2.5 border-[var(--pop-border)] shadow-[4px_4px_0px_#1e1b2e] p-2 bg-slate-100 dark:bg-slate-900">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <article className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none pop-card-lg p-6 sm:p-10 text-foreground/90 leading-relaxed font-medium">
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
