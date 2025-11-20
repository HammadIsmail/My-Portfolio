import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const scrollToSection = (id: string) => {
    setOpen(false);
    if (!isHomePage) {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <nav className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold">Hammad</h1>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {isHomePage ? (
              <>
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
                  onClick={() => scrollToSection("experience")}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Experience
                </button>
                <button 
                  onClick={() => scrollToSection("skills")}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Skills
                </button>
                <button 
                  onClick={() => scrollToSection("contact")}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Contact
                </button>
              </>
            ) : (
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
            )}
            <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">
              Blog
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger className="p-2 hover:bg-accent rounded-lg transition-colors touch-manipulation">
                <Menu className="w-6 h-6" />
                <span className="sr-only">Open menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col gap-6 mt-8">
                  {isHomePage ? (
                    <>
                      <button
                        onClick={() => scrollToSection("about")}
                        className="text-left text-lg font-medium hover:text-primary transition-colors touch-manipulation py-2"
                      >
                        About
                      </button>
                      <button
                        onClick={() => scrollToSection("projects")}
                        className="text-left text-lg font-medium hover:text-primary transition-colors touch-manipulation py-2"
                      >
                        Projects
                      </button>
                      <button
                        onClick={() => scrollToSection("experience")}
                        className="text-left text-lg font-medium hover:text-primary transition-colors touch-manipulation py-2"
                      >
                        Experience
                      </button>
                      <button
                        onClick={() => scrollToSection("skills")}
                        className="text-left text-lg font-medium hover:text-primary transition-colors touch-manipulation py-2"
                      >
                        Skills
                      </button>
                      <button
                        onClick={() => scrollToSection("contact")}
                        className="text-left text-lg font-medium hover:text-primary transition-colors touch-manipulation py-2"
                      >
                        Contact
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/"
                      onClick={() => setOpen(false)}
                      className="text-left text-lg font-medium hover:text-primary transition-colors touch-manipulation py-2"
                    >
                      Home
                    </Link>
                  )}
                  <Link
                    to="/blog"
                    onClick={() => setOpen(false)}
                    className="text-left text-lg font-medium hover:text-primary transition-colors touch-manipulation py-2"
                  >
                    Blog
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
