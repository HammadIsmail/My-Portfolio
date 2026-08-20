"use client";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { usePortfolio, type SectionId } from "@/context/PortfolioContext";
import { useBlogsQuery } from "@/hooks/usePortfolioQueries";
import { cn } from "@/lib/utils";

const baseNavLinks: { id: SectionId; label: string }[] = [
  { id: "profile", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "hackathons", label: "Hackathons" },
  { id: "blogs", label: "Blogs" },
  { id: "services", label: "Expertise" },
  { id: "contact", label: "Contact" },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { activeSection, navigateToSection } = usePortfolio();
  const { data: blogsData } = useBlogsQuery();

  const hasBlogs = (blogsData || []).length > 0;

  const navLinks = baseNavLinks.filter((link) => link.id !== "blogs" || hasBlogs);

  const handleNavClick = (id: SectionId) => {
    setOpen(false);
    if (!isHomePage) {
      window.location.href = `/#${id}`;
      return;
    }
    navigateToSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      {/* Desktop & Tablet Floating Top Pill Navbar */}
      <nav className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-card border-2.5 border-[var(--pop-border)] shadow-[4px_4px_0px_#1e1b2e] dark:shadow-[4px_4px_0px_#ffffff] rounded-full backdrop-blur-md max-w-5xl w-auto transition-all duration-300">
        {/* Brand Logo Pill (Hammad✦) */}
        <Link
          href="/"
          onClick={() => isHomePage && navigateToSection("profile")}
          className="flex items-center gap-1 px-4 py-1.5 rounded-full font-black text-lg tracking-tight text-foreground hover:scale-105 transition-transform"
        >
          <span>Hammad</span>
          <span className="text-purple-600 font-extrabold">✦</span>
        </Link>

        <div className="h-6 w-[2px] bg-slate-300 dark:bg-slate-700 mx-1" />

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = isHomePage && activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200",
                  isActive
                    ? "bg-orange-500 text-white border-2 border-[var(--pop-border)] shadow-[2px_2px_0px_#1e1b2e] dark:shadow-[2px_2px_0px_#ffffff]"
                    : "text-foreground/80 hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        <div className="h-6 w-[2px] bg-slate-300 dark:bg-slate-700 mx-1" />

        {/* Actions (Theme Toggle & Let's Talk Pill) */}
        <div className="flex items-center gap-2 pl-1">
          <ThemeToggle />

          <button
            onClick={() => handleNavClick("contact")}
            className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm border-2 border-[var(--pop-border)] shadow-[3px_3px_0px_#1e1b2e] dark:shadow-[3px_3px_0px_#ffffff] hover:translate-y-[-2px] active:translate-y-[1px] transition-all"
          >
            Let's Talk
          </button>
        </div>
      </nav>

      {/* Mobile Floating Top Bar */}
      <div className="md:hidden w-full max-w-md flex items-center justify-between px-4 py-2 bg-card border-2.5 border-[var(--pop-border)] shadow-[4px_4px_0px_#1e1b2e] dark:shadow-[4px_4px_0px_#ffffff] rounded-full">
        <Link
          href="/"
          onClick={() => isHomePage && navigateToSection("profile")}
          className="flex items-center gap-1 font-black text-base tracking-tight text-foreground"
        >
          <span>Hammad</span>
          <span className="text-purple-600 font-extrabold">✦</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="p-2 rounded-full border-2 border-[var(--pop-border)] bg-purple-600 text-white shadow-[2px_2px_0px_#1e1b2e]">
              <Menu className="w-4 h-4" />
            </SheetTrigger>
            <SheetContent side="top" className="w-full bg-card border-b-4 border-[var(--pop-border)] p-6 pt-12">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={cn(
                      "w-full text-left px-5 py-3 rounded-2xl text-base font-extrabold border-2 border-[var(--pop-border)] transition-all",
                      activeSection === link.id
                        ? "bg-orange-500 text-white shadow-[3px_3px_0px_#1e1b2e]"
                        : "bg-card text-foreground shadow-[2px_2px_0px_#1e1b2e]"
                    )}
                  >
                    {link.label}
                  </button>
                ))}
                <button
                  onClick={() => handleNavClick("contact")}
                  className="w-full mt-2 py-3.5 rounded-2xl bg-purple-600 text-white text-center font-black text-lg border-2 border-[var(--pop-border)] shadow-[4px_4px_0px_#1e1b2e]"
                >
                  Let's Talk ✦
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Sidebar;
