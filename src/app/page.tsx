import Sidebar from "@/components/Sidebar";
import PortfolioContent from "@/components/PortfolioContent";
import WhatsAppButton from "@/components/WhatsAppButton";
import connectDB from "@/lib/db";
import Project from "@/models/Project";

export const dynamic = 'force-dynamic';

export default async function Home() {
  await connectDB();
  const projectsData = await Project.find({}).sort({ createdAt: -1 }).lean();
  
  const projects = projectsData.map(p => ({
    id: p._id.toString(),
    title: p.title,
    description: p.description,
    image: p.image,
    tags: p.tags,
    imagePosition: p.imagePosition,
  }));

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden">
      <Sidebar />
      <main className="pt-16 md:pt-0 md:fixed md:top-0 md:right-0 md:bottom-0 md:left-64 md:overflow-hidden">
        <PortfolioContent projects={projects} />
        <WhatsAppButton />
      </main>
    </div>
  );
}
