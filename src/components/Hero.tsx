import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-portrait.jpg";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="about" className="min-h-screen flex items-center pt-20 sm:pt-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-primary uppercase">
              UI/UX Designer
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              Hello, my name is Madelyn Torff
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto lg:mx-0">
              Short text with details about you, what you do or your professional career. You can add more information on the about page.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 justify-center lg:justify-start">
              <Button onClick={() => scrollToSection("projects")} size="lg" className="w-full sm:w-auto min-h-[48px]">
                Projects
              </Button>
              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto min-h-[48px]">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </Button>
            </div>
          </div>
          <div className="relative order-first lg:order-last">
            <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[400px] lg:max-w-lg mx-auto">
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
