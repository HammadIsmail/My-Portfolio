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
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
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

  // Tiptap outputs HTML, so if the content is HTML we can render it dangerously. 
  // If it's markdown, we use ReactMarkdown. 
  // Since we used Tiptap getHTML() in the form, it will be HTML.
  const isHtml = /<[a-z][\s\S]*>/i.test(project.content);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow pt-24 pb-12 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <Link href="/" className="inline-flex items-center text-sm font-medium hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">{project.title}</h1>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            {project.demoUrl && (
              <Button asChild>
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">View Live Demo</a>
              </Button>
            )}
          </div>

          <div className="mb-16">
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {project.images.map((img: string, index: number) => (
                  <CarouselItem key={index}>
                    <div className="aspect-[16/9] relative rounded-xl overflow-hidden shadow-lg border border-border bg-muted flex items-center justify-center">
                      <img
                        src={img}
                        alt={`${project.title} screenshot ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {project.images.length > 1 && (
                <>
                  <CarouselPrevious className="left-2 sm:-left-12" />
                  <CarouselNext className="right-2 sm:-right-12" />
                </>
              )}
            </Carousel>
            
            {project.videoUrl && (
              <div className="mt-8 aspect-[16/9] rounded-xl overflow-hidden shadow-lg border border-border bg-muted">
                <iframe
                  src={project.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>

          <article className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none text-foreground/90">
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
  );
}
