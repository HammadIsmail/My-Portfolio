"use client";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { usePortfolio, type SectionId } from "@/context/PortfolioContext";
import { cn } from "@/lib/utils";

const navLinks: { id: SectionId; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "projects", label: "Projects" },
  { id: "hackathons", label: "Hackathons" },
  { id: "blogs", label: "Blogs" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { activeSection, navigateToSection, isMobile } = usePortfolio();

  const handleNavClick = (id: SectionId) => {
    setOpen(false);
    if (!isHomePage) {
      window.location.href = `/#${id}`;
      return;
    }
    if (isMobile) {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigateToSection(id);
    }
  };

  const navButtonClass = (id: SectionId) =>
    cn(
      "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 touch-manipulation neo-button hover:text-primary",
      !isMobile && isHomePage && activeSection === id && "neo-inset text-primary font-semibold shadow-inner"
    );

  const mobileNavButtonClass = (id: SectionId) =>
    cn(
      "text-left px-4 py-3 rounded-xl text-lg font-medium transition-all duration-200 touch-manipulation neo-button hover:text-primary",
      activeSection === id && "neo-inset text-primary font-semibold"
    );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 w-64 h-screen bg-card neo-raised border-r border-border/40 z-50">
        <div className="p-6 border-b border-border/40 flex items-center justify-between">
          <Link href="/" onClick={() => isHomePage && !isMobile && navigateToSection("profile")}>
            <div className="neo-raised-sm px-4 py-2 rounded-xl">
              <h1 className="text-xl font-bold tracking-tight text-primary font-serif">Hammad</h1>
            </div>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto scrollbar-none">
          {isHomePage ? (
            navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={navButtonClass(link.id)}
              >
                {link.label}
              </button>
            ))
          ) : (
            <Link
              href="/"
              className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium neo-button hover:text-primary transition-all touch-manipulation"
            >
              Home
            </Link>
          )}
        </nav>
        <div className="p-6 border-t border-border/40 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md neo-raised-sm border-b border-border/40 h-16">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/">
            <div className="neo-raised-sm px-3 py-1.5 rounded-xl">
              <h1 className="text-lg font-bold tracking-tight text-primary font-serif">Hammad</h1>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger className="p-2.5 neo-button rounded-xl transition-all touch-manipulation">
                <Menu className="w-5 h-5 text-foreground" />
                <span className="sr-only">Open menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="w-[260px] sm:w-[300px] bg-card neo-raised border-l border-border/40">
                <div className="flex flex-col gap-3 mt-8">
                  {isHomePage ? (
                    navLinks.map((link) => (
                      <button
                        key={link.id}
                        onClick={() => handleNavClick(link.id)}
                        className={mobileNavButtonClass(link.id)}
                      >
                        {link.label}
                      </button>
                    ))
                  ) : (
                    <Link
                      href="/"
                      onClick={() => setOpen(false)}
                      className="text-left px-4 py-3 rounded-xl text-lg font-medium neo-button hover:text-primary transition-all touch-manipulation"
                    >
                      Home
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
};

export default Sidebar;
