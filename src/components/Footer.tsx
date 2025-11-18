import { Instagram, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-background border-t border-border overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 relative z-10">
        <div className="flex justify-center gap-4 sm:gap-6 md:gap-8 mb-6">
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all duration-300 touch-manipulation"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all duration-300 touch-manipulation"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
          <a 
            href="mailto:hello@madelyn.com"
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all duration-300 touch-manipulation"
            aria-label="Email"
          >
            <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Madelyn Torff 2021
        </p>
      </div>
      
      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 -mb-1">
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path 
            d="M0 0C240 40 480 80 720 80C960 80 1200 40 1440 0V120H0V0Z" 
            fill="hsl(var(--primary))"
          />
        </svg>
      </div>
    </footer>
  );
};

export default Footer;
