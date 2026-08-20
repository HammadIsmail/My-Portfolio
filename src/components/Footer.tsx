"use client";

import { Icon } from "@iconify/react";

const Footer = () => {
  const socialLinks = [
    { icon: "lucide:github", link: "https://github.com/HammadIsmail", label: "GitHub" },
    { icon: "lucide:linkedin", link: "https://www.linkedin.com/in/muhammad-hammad-uet/", label: "LinkedIn" },
    { icon: "lucide:instagram", link: "https://www.instagram.com/itx_hammad_ismail/", label: "Instagram" }
  ];

  return (
    <footer className="py-12 border-t-2 border-[var(--pop-border)] mt-8">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-6xl">
        <div className="flex items-center gap-2 font-black text-lg text-foreground">
          <span>Hammad</span>
          <span className="text-purple-600 font-black">✦</span>
          <span className="text-xs font-semibold text-muted-foreground ml-2">
            © {new Date().getFullYear()} All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-3">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-card border-2 border-[var(--pop-border)] shadow-[3px_3px_0px_#1e1b2e] dark:shadow-[3px_3px_0px_#ffffff] text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 hover:translate-y-[-2px] transition-all"
              aria-label={social.label}
            >
              <Icon icon={social.icon} className="w-5 h-5 text-purple-600" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
