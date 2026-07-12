import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import connectDB from "@/lib/db";
import Project from "@/models/Project";

export const dynamic = 'force-dynamic';

export default async function Home() {
  await connectDB();
  const projectsData = await Project.find({}).sort({ createdAt: -1 }).lean();
  
  // Transform _id to string so it can be passed to client component
  const projects = projectsData.map(p => ({
    id: p._id.toString(),
    title: p.title,
    description: p.description,
    image: p.image,
    tags: p.tags,
    imagePosition: p.imagePosition,
  }));

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Projects projects={projects} />
      <Experience />
      <Skills />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
