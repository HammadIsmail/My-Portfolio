import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEffect, useState, useRef } from "react";

const Projects = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const projects = [
    {
      id: 1,
      title: "Marketing Agency Website",
      description: "Modern marketing agency website with advanced animations, interactive elements, and seamless user experience. Features real-time analytics integration and dynamic content management.",
      image: "https://res.cloudinary.com/dbbk9wg2i/image/upload/v1742640507/Marketing_site_vzhgfu.png",
      tags: ["React", "Tailwind", "Framer Motion", "Analytics", "CMS"],
      demoUrl: "https://prfsd.netlify.app/",
      imagePosition: "right" as const,
      featured: true
    },
    {
      id: 2,
      title: "Tech Company Website",
      description: "Sleek and modern website for InfoQuestPro, a tech solutions provider. Features interactive service showcases.",
      image: "https://res.cloudinary.com/dbbk9wg2i/image/upload/v1759206929/Capture_gmbswi.png",
      tags: ["NextJs", "Tailwind", "TypeScript", "Framer Motion"],
      demoUrl: "https://info-quest-pro.vercel.app/",
      imagePosition: "left" as const,
      featured: false
    },
    {
      id: 3,
      title: "Tech StartUp Product Website",
      description: "A sleek and modern website for Snapfit, a tech solutions provider. It includes interactive service showcases, a tools listing, pricing page, dynamic inspiration page, and contact page — all designed for a seamless user experience.",
      image: "https://res.cloudinary.com/dbbk9wg2i/image/upload/v1759207689/Capture_a2ytbu.png",
      tags: ["React", "Tailwind", "TypeScript", "Framer Motion"],
      demoUrl: "https://snapfit-hc66.vercel.app/",
      imagePosition: "right" as const,
      featured: true
    },
    {
      id: 4,
      title: "Social Media Platform",
      description: "Spill the Tea is a personal project — a social media platform where users can share thoughts, ideas, and experiences in a fun, engaging way. It includes real-time chat, post creation, a dynamic feed, and the ability to create communities.",
      image: "https://res.cloudinary.com/dbbk9wg2i/image/upload/v1759208100/Capture_wzsxtf.png",
      tags: ["React", "Tailwind", "PostgreSQL", "NodeJS", "Socket.io", "ExpressJS", "Prisma", "Redis"],
      demoUrl: "https://www.spill-the-tea.online/",
      imagePosition: "left" as const,
      featured: true
    },
    {
      id: 5,
      title: "Ride Sharing Platform",
      description: "ShareRide is a personal project — a Ride Sharing platform where users can share rides engaging way. It includes real-time chat, post creation, a dynamic feed.",
      image: "https://res.cloudinary.com/dbbk9wg2i/image/upload/v1759216128/Capture_cyu1gp.png",
      tags: ["React", "Tailwind", "PostgreSQL", "NodeJS", "Socket.io", "ExpressJS", "Prisma"],
      demoUrl: "https://www.shareride.site/",
      imagePosition: "right" as const,
      featured: true
    },
    {
      id: 6,
      title: "Canva Like Clone",
      description: "Canva Clone is a personal project — a Canva like online editor where users can create stunning graphics, presentations, and social media posts with ease.",
      image: "https://res.cloudinary.com/dbbk9wg2i/image/upload/v1759252076/Capture_ncfxgy.png",
      tags: ["Nextjs", "Tailwind", "TypeScript", "FiberJs", "Mongodb"],
      demoUrl: "https://my-canvas-editor.vercel.app/",
      imagePosition: "left" as const,
      featured: true
    },
    {
      id: 7,
      title: "Ecommerce Platform",
      description: "EasyShop is a professional project — a full-featured e-commerce platform that offers a seamless shopping experience with advanced product management, secure payment integration, and real-time order tracking.",
      image: "https://res.cloudinary.com/dbbk9wg2i/image/upload/v1759256114/Capture_htgjkq.png",
      tags: ["Nextjs", "Tailwind", "TypeScript", "Supabase"],
      demoUrl: "https://easyshop-three.vercel.app/",
      imagePosition: "right" as const,
      featured: true
    }
  ];

  const getParallaxOffset = (index: number) => {
    if (!sectionRef.current) return 0;
    const sectionTop = sectionRef.current.offsetTop;
    const relativeScroll = scrollY - sectionTop;
    return relativeScroll * 0.15 * (index % 2 === 0 ? 1 : -1);
  };

  return (
    <section ref={sectionRef} id="projects" className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16">Projects</h2>
        <div ref={ref} className="relative">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="sticky top-20"
              style={{ 
                zIndex: index + 1,
                paddingBottom: index === projects.length - 1 ? '0' : '2rem'
              }}
            >
              <Card 
                className={`overflow-hidden border-none shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-700 bg-card ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  transform: isVisible ? `scale(${1 - index * 0.02})` : 'translateY(40px)',
                  transformOrigin: 'top center'
                }}
              >
                <div className={`grid lg:grid-cols-2 gap-0 ${project.imagePosition === 'left' ? 'lg:grid-flow-dense' : ''}`}>
                  <div className={`p-6 sm:p-8 lg:p-12 flex flex-col justify-center ${project.imagePosition === 'left' ? 'lg:col-start-2' : ''}`}>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{project.title}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div>
                      <Button 
                        variant="outline" 
                        className="w-full sm:w-auto min-h-[44px]"
                        onClick={() => window.open(project.demoUrl, '_blank')}
                      >
                        View Project
                      </Button>
                    </div>
                  </div>
                  <div className={`relative aspect-[4/3] lg:aspect-auto overflow-hidden ${project.imagePosition === 'left' ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-100 ease-out"
                      style={{
                        transform: `translateY(${getParallaxOffset(index)}px) scale(1.1)`
                      }}
                    />
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
