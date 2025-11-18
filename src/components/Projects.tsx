import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import project1 from "@/assets/project1.jpg";
import project2 from "@/assets/project2.jpg";
import project3 from "@/assets/project3.jpg";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Projects = () => {
  const { ref, isVisible } = useScrollAnimation();
  
  const projects = [
    {
      id: 1,
      title: "Project Name",
      description: "I created this personal project in order to show how to create an interface in Figma using a portfolio as an example.",
      image: project1,
      imagePosition: "right" as const,
    },
    {
      id: 2,
      title: "Project Name",
      description: "What was your role, your deliverables, if the project was personal, freelancing.",
      image: project2,
      imagePosition: "left" as const,
    },
    {
      id: 3,
      title: "Project Name",
      description: "You can also add in this description the type of the project, if it was for web, mobile, electron.",
      image: project3,
      imagePosition: "right" as const,
    },
  ];

  return (
    <section id="projects" className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16">Projects</h2>
        <div ref={ref} className="space-y-12 sm:space-y-16 lg:space-y-20">
          {projects.map((project, index) => (
            <Card 
              key={project.id}
              className={`overflow-hidden border-none shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className={`grid lg:grid-cols-2 gap-0 ${project.imagePosition === 'left' ? 'lg:grid-flow-dense' : ''}`}>
                <div className={`p-6 sm:p-8 lg:p-12 flex flex-col justify-center ${project.imagePosition === 'left' ? 'lg:col-start-2' : ''}`}>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{project.title}</h3>
                  <p className="text-muted-foreground mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                    {project.description}
                  </p>
                  <div>
                    <Button variant="outline" className="w-full sm:w-auto min-h-[44px]">View Project</Button>
                  </div>
                </div>
                <div className={`relative aspect-[4/3] lg:aspect-auto ${project.imagePosition === 'left' ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
