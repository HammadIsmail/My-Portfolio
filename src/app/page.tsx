import Sidebar from "@/components/Sidebar";
import PortfolioContent from "@/components/PortfolioContent";
import WhatsAppButton from "@/components/WhatsAppButton";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import Hackathon from "@/models/Hackathon";
import Blog from "@/models/Blog";

export const dynamic = 'force-dynamic';

export default async function Home() {
  await connectDB();
  const [projectsData, hackathonsData, blogsData] = await Promise.all([
    Project.find({}).sort({ createdAt: -1 }).lean(),
    Hackathon.find({}).sort({ createdAt: -1 }).lean(),
    Blog.find({}).sort({ createdAt: -1 }).lean()
  ]);
  
  const projects = projectsData.map(p => ({
    id: p._id.toString(),
    title: p.title,
    description: p.description,
    image: p.image,
    tags: p.tags,
    imagePosition: p.imagePosition,
    githubUrl: p.githubUrl || null,
  }));

  const hackathons = hackathonsData.map(h => ({
    id: h._id.toString(),
    title: h.title,
    description: h.description,
    image: h.image,
    tags: h.tags,
    imagePosition: h.imagePosition,
    demoUrl: h.demoUrl || null,
    githubUrl: h.githubUrl || null,
  }));

  const blogs = blogsData.map(b => ({
    id: b._id.toString(),
    title: b.title,
    description: b.description,
    image: b.image,
    tags: b.tags,
    createdAt: (b.createdAt as Date).toISOString(),
  }));

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden">
      <Sidebar />
      <main className="pt-16 md:pt-0 md:fixed md:top-0 md:right-0 md:bottom-0 md:left-64 md:overflow-hidden">
        <PortfolioContent projects={projects} hackathons={hackathons} blogs={blogs} />
        <WhatsAppButton />
      </main>
    </div>
  );
}
