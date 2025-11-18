import { Button } from "@/components/ui/button";

const Header = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Madelyn Torff</h1>
          <div className="flex gap-8">
            <button 
              onClick={() => scrollToSection("about")}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection("projects")}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Projects
            </button>
            <button 
              onClick={() => scrollToSection("contact")}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Contacts
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
