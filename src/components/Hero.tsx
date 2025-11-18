import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-portrait.jpg";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="about" className="min-h-screen flex items-center pt-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold tracking-wider text-primary uppercase">
              UI/UX Designer
            </p>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Hello, my name is Madelyn Torff
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Short text with details about you, what you do or your professional career. You can add more information on the about page.
            </p>
            <div className="flex gap-4 pt-4">
              <Button onClick={() => scrollToSection("projects")} size="lg">
                Projects
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-primary rounded-full"></div>
              <img 
                src={heroImage} 
                alt="Madelyn Torff - UI/UX Designer"
                className="absolute bottom-0 right-0 w-full h-full object-cover object-top rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
