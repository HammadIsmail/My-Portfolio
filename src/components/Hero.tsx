"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { usePortfolio } from "@/context/PortfolioContext";
import { useProfileQuery } from "@/hooks/usePortfolioQueries";
import { Rocket, MessageCircle, Code, BookOpen, Laptop, Terminal } from "lucide-react";

const DEFAULT_PROFILE = {
  name: "Hammad",
  fullName: "Hammad Ismail",
  title: "FullStack & AI Developer",
  profileImage: "/profile.webp",
  bioQuote: "I turn ideas into playful, interactive digital experiences with clean code, creative motion, and joyful details.",
  bio: [
    "Specializing in React, Next.js, React Native, Node.js, FastAPI, and NestJS with experience designing backend systems using MongoDB, PostgreSQL, and Neo4j.",
    "Building AI-powered platforms, integrating LLMs and intelligent workflows into production-ready software."
  ]
};

const Hero = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { navigateToSection } = usePortfolio();
  const { data: profile } = useProfileQuery();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const activeProfile = profile
    ? { ...DEFAULT_PROFILE, ...profile, name: profile.name.includes("Hammad") ? "Hammad" : (profile.name.split(" ")[0] || "Hammad") }
    : DEFAULT_PROFILE;

  const scrollToSection = (id: string) => {
    navigateToSection(id as any);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="profile" className="py-6 sm:py-14 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl space-y-12 sm:space-y-16">
        {/* PART 1: Hero Intro Grid (Matching Reference Screenshot 3) */}
        <div
          ref={ref}
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Right Column (Polaroid Photo) - Shown FIRST on Mobile */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative group cursor-pointer" onClick={() => setPreviewImage(activeProfile.profileImage)}>
              {/* Green Tape Sticker */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 px-6 py-1 bg-emerald-400 text-slate-900 font-black text-xs border-2 border-[var(--pop-border)] shadow-[2px_2px_0px_#1e1b2e] -rotate-2 rounded-sm">
                /// HAMMAD ///
              </div>

              {/* Outer Polaroid Frame */}
              <div className="bg-card p-3.5 sm:p-5 rounded-3xl border-3 border-emerald-400 dark:border-emerald-500 shadow-[6px_6px_0px_#1e1b2e] dark:shadow-[6px_6px_0px_#ffffff] max-w-[280px] sm:max-w-[380px] w-full transition-transform duration-300 group-hover:rotate-1 group-hover:scale-[1.02]">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border-2.5 border-[var(--pop-border)] bg-slate-100 dark:bg-slate-900">
                  <img
                    src={activeProfile.profileImage}
                    alt="Hammad Ismail"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-500 border-2 border-white shadow-md flex items-center justify-center animate-bounce-subtle">
                    <span className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column (Typography & CTAs) - Shown SECOND on Mobile */}
          <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col items-start text-left">
            <span className="text-lg sm:text-2xl font-extrabold text-orange-500 tracking-wide font-sans mb-1">
              Hi there, I'm
            </span>

            <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-emerald-500 to-amber-500 leading-[1.05] mb-2">
              Hammad
            </h1>

            <h2 className="text-xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 mb-2">
              {activeProfile.title}
            </h2>

            {/* Pill Badge: Positioned Under Title */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-2.5 border-[var(--pop-border)] font-extrabold text-[11px] sm:text-xs mb-5 shadow-[2px_2px_0px_#1e1b2e] dark:shadow-[2px_2px_0px_#ffffff]">
              <Code className="w-3.5 h-3.5 text-purple-600" />
              <span>Available for Creative FullStack & AI Roles</span>
            </div>

            {/* Bio Quote Block */}
            <div className="relative pl-3.5 border-l-4 border-purple-500 mb-6">
              <p className="text-sm sm:text-xl font-bold text-foreground italic leading-relaxed">
                "{activeProfile.bioQuote}"
              </p>
              {activeProfile.bio.map((paragraph, index) => (
                <p key={index} className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed mt-2">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Action Buttons - Rendered in SAME LINE on Mobile */}
            <div className="flex flex-row items-center gap-2.5 w-full">
              <button
                onClick={() => scrollToSection("projects")}
                className="flex-1 sm:flex-initial px-3.5 sm:px-7 py-3 sm:py-4 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-black text-xs sm:text-base border-2.5 border-[var(--pop-border)] shadow-[3.5px_3.5px_0px_#1e1b2e] dark:shadow-[3.5px_3.5px_0px_#ffffff] hover:translate-y-[-2px] active:translate-y-[1px] transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <span>Explore My Work</span>
                <Rocket className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                onClick={() => scrollToSection("contact")}
                className="flex-1 sm:flex-initial px-3.5 sm:px-7 py-3 sm:py-4 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs sm:text-base border-2.5 border-[var(--pop-border)] shadow-[3.5px_3.5px_0px_#1e1b2e] dark:shadow-[3.5px_3.5px_0px_#ffffff] hover:translate-y-[-2px] active:translate-y-[1px] transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <span>Let's Talk</span>
                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* PART 2: Notebook Entry #01 Card (Matching Reference Screenshot 2 with Notebook Grid) */}
        <div className="notebook-lined-bg p-6 sm:p-10 rounded-3xl border-3 border-[var(--pop-border)] shadow-[6px_6px_0px_#1e1b2e] dark:shadow-[6px_6px_0px_#ffffff] relative overflow-hidden">
          {/* Top Pill Badge */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-2.5 border-[var(--pop-border)] font-extrabold text-xs shadow-[2.5px_2.5px_0px_#1e1b2e] dark:shadow-[2.5px_2.5px_0px_#ffffff]">
              <BookOpen className="w-4 h-4 text-rose-500" />
              <span>Notebook Entry #01</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Graphic Setup Box */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[340px] aspect-[4/3] rounded-2xl bg-card border-3 border-[var(--pop-border)] shadow-[5px_5px_0px_#1e1b2e] dark:shadow-[5px_5px_0px_#ffffff] p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b-2 border-[var(--pop-border)] pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <Terminal className="w-4 h-4 text-purple-600" />
                </div>

                {/* Code Canvas Mock */}
                <div className="space-y-2 py-4 font-mono text-xs text-foreground">
                  <div className="text-purple-600 font-bold">const developer = {"{"}</div>
                  <div className="pl-4 text-muted-foreground">name: <span className="text-emerald-500">"Hammad"</span>,</div>
                  <div className="pl-4 text-muted-foreground">passions: [<span className="text-amber-500">"Web"</span>, <span className="text-sky-500">"AI"</span>, <span className="text-purple-500">"UI"</span>],</div>
                  <div className="pl-4 text-muted-foreground">status: <span className="text-emerald-500">"Building Magic"</span></div>
                  <div className="text-purple-600 font-bold">{"};"}</div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-extrabold text-muted-foreground pt-2 border-t border-[var(--pop-border)]">
                  <span>/// CRAFTING CODE ///</span>
                  <Laptop className="w-3.5 h-3.5 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Right Story Text & Sticky Note Badges */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-4">
              <h3 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight leading-tight">
                Curious Coder & Systems Architect
              </h3>

              <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                Hi, I'm <strong className="text-foreground">Hammad</strong> — a full-stack developer who enjoys turning ideas into colorful, interactive digital experiences. I love experimenting with interfaces, motion, creative layouts, and intelligent software while keeping experiences useful and intuitive.
              </p>

              {/* Colorful Sticky Note Cards (Matching Reference Screenshot 2) */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="px-4 py-2 rounded-2xl bg-amber-200 text-slate-900 font-black text-xs border-2 border-[var(--pop-border)] shadow-[3px_3px_0px_#1e1b2e] -rotate-1">
                  "make it interactive! 🚀"
                </div>

                <div className="px-4 py-2 rounded-2xl bg-sky-200 text-slate-900 font-black text-xs border-2 border-[var(--pop-border)] shadow-[3px_3px_0px_#1e1b2e] rotate-1">
                  "coffee ➔ code ➔ repeat ☕"
                </div>

                <div className="px-4 py-2 rounded-2xl bg-emerald-200 text-slate-900 font-black text-xs border-2 border-[var(--pop-border)] shadow-[3px_3px_0px_#1e1b2e] -rotate-1">
                  "love good UI ✦"
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-2xl bg-card border-3 border-[var(--pop-border)] shadow-[6px_6px_0px_#1e1b2e] p-4">
          <DialogTitle className="sr-only">Profile Preview</DialogTitle>
          {previewImage && (
            <img
              src={previewImage}
              alt="Profile avatar preview"
              className="w-full h-auto max-h-[75vh] object-cover rounded-2xl"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Hero;
