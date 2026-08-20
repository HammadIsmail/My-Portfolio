import connectDB from "@/lib/db";
import Project from "@/models/Project";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const project = await Project.findById(id).lean();
    if (!project) return {};

    return {
      title: `${project.title} | Portfolio`,
      description: project.description,
      openGraph: {
        images: [project.image],
      },
    };
  } catch (error) {
    return {};
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  
  let project;
  try {
    await connectDB();
    project = await Project.findById(id).lean();
  } catch (error) {
    return notFound();
  }

  if (!project) {
    notFound();
  }

  const isHtml = /<[a-z][\s\S]*>/i.test(project.content);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Sidebar />
      <div className="flex-grow flex flex-col pt-24">
        <main className="flex-grow pb-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <Link
              href="/"
              className="inline-flex items-center text-xs font-black bg-card border-2 border-[var(--pop-border)] shadow-[2.5px_2.5px_0px_#1e1b2e] px-4 py-2 rounded-full hover:translate-y-[-1px] transition-all mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Link>

            <div className="mb-8 pop-card-lg p-6 sm:p-8">
              <h1 className="text-3xl sm:text-5xl font-black mb-4 text-foreground">{project.title}</h1>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-foreground border border-[var(--pop-border)] font-extrabold shadow-[1px_1px_0px_#1e1b2e]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-black border-2 border-[var(--pop-border)] shadow-[3px_3px_0px_#1e1b2e]"
                  >
                    View Live Demo ✦
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full bg-card text-foreground text-xs font-black border-2 border-[var(--pop-border)] shadow-[3px_3px_0px_#1e1b2e]"
                  >
                    GitHub Repo
                  </a>
                )}
              </div>
            </div>

            <div className="mb-12">
              <Carousel className="w-full max-w-4xl mx-auto">
                <CarouselContent>
                  {project.images.map((img: string, index: number) => (
                    <CarouselItem key={index}>
                      <div className="aspect-[16/9] relative rounded-2xl overflow-hidden border-2.5 border-[var(--pop-border)] shadow-[4px_4px_0px_#1e1b2e] p-3 flex items-center justify-center bg-slate-100 dark:bg-slate-900">
                        <img
                          src={img}
                          alt={`${project.title} screenshot ${index + 1}`}
                          className="w-full h-full object-contain rounded-xl"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {project.images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-2 sm:-left-12 bg-card border-2 border-[var(--pop-border)] shadow-[2px_2px_0px_#1e1b2e]" />
                    <CarouselNext className="right-2 sm:-right-12 bg-card border-2 border-[var(--pop-border)] shadow-[2px_2px_0px_#1e1b2e]" />
                  </>
                )}
              </Carousel>
              
              {project.videoUrl && (
                <div className="mt-8 aspect-[16/9] rounded-2xl overflow-hidden border-2.5 border-[var(--pop-border)] shadow-[4px_4px_0px_#1e1b2e] p-2 bg-slate-100 dark:bg-slate-900">
                  <iframe
                    src={project.videoUrl}
                    className="w-full h-full rounded-xl"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>

            <article className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none pop-card-lg p-6 sm:p-10 text-foreground/90 leading-relaxed font-medium">
              {isHtml ? (
                <div dangerouslySetInnerHTML={{ __html: project.content }} />
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {project.content}
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
