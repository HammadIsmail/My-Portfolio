import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-portrait.jpg";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Hero = () => {
  const { ref, isVisible } = useScrollAnimation();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="about"
      className="min-h-screen flex items-center pt-20 sm:pt-24"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center"
        >
          <div
            className={`space-y-4 sm:space-y-6 text-center lg:text-left transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-primary uppercase">
              FullStack Developer
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              Hello, my name is Hammad
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto lg:mx-0">
              Hi, I'm Hammad, a Full-Stack Developer specializing in the MERN
              stack. I build scalable web and mobile applications using React,
              Next.js, React Native, Express.js, and FastAPI, with real-time
              features via Socket.IO. I optimize databases (MongoDB, PostgreSQL,
              MySQL), deploy on AWS, and integrate AI using OpenAI APIs.
              Experienced with international teams, I deliver efficient,
              cloud-ready, AI-powered solutions that drive real business
              results.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 justify-center lg:justify-start">
              <Button
                onClick={() => scrollToSection("projects")}
                size="lg"
                className="w-full sm:w-auto min-h-[48px]"
              >
                Projects
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="w-full sm:w-auto min-h-[48px]"
              >
                <a
                  href="https://www.linkedin.com/in/muhammad-hammad-uet/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </Button>
            </div>
          </div>
          <div
            className={`relative order-first lg:order-last transition-all duration-700 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[400px] lg:max-w-lg mx-auto">
              <div className="absolute inset-0 bg-primary rounded-full"></div>
              <img
                src={"/hammad.png"}
                alt="Hammad -FullStack Developer"
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
