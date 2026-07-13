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
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
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
      "w-full text-left px-4 py-3 rounded-lg text-sm font-medium hover:bg-muted hover:text-primary transition-colors touch-manipulation",
      !isMobile && isHomePage && activeSection === id && "bg-muted text-primary"
    );

  const mobileNavButtonClass = (id: SectionId) =>
    cn(
      "text-left px-4 py-3 rounded-lg text-lg font-medium hover:bg-muted hover:text-primary transition-colors touch-manipulation"
    );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 w-64 h-screen bg-card border-r border-border z-50">
        <div className="p-6 border-b border-border">
          <Link href="/" onClick={() => isHomePage && !isMobile && navigateToSection("profile")}>
            <h1 className="text-2xl font-bold tracking-tight text-primary">Hammad</h1>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
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
              className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium hover:bg-muted hover:text-primary transition-colors touch-manipulation"
            >
              Home
            </Link>
          )}
        </nav>
        <div className="p-6 border-t border-border flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border h-16">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/">
            <h1 className="text-xl font-bold tracking-tight text-primary">Hammad</h1>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger className="p-2 hover:bg-accent rounded-lg transition-colors touch-manipulation">
                <Menu className="w-6 h-6" />
                <span className="sr-only">Open menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col gap-2 mt-8">
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
                      className="text-left px-4 py-3 rounded-lg text-lg font-medium hover:bg-muted hover:text-primary transition-colors touch-manipulation"
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
