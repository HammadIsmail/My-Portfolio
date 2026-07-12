export interface Project {
  id: number;
  title: string;
  description: string;
  image: string; // The thumbnail image
  images: string[]; // Images for the slider
  content: string; // Markdown content for case study
  videoUrl?: string; // Optional video URL
  tags: string[];
  demoUrl: string;
  imagePosition: "left" | "right";
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: 3,
    title: "Tech StartUp Product Website",
    description: "A sleek and modern website for Snapfit, a tech solutions provider.",
    image: "https://res.cloudinary.com/dbbk9wg2i/image/upload/v1759207689/Capture_a2ytbu.png",
    images: [
      "https://res.cloudinary.com/dbbk9wg2i/image/upload/v1759207689/Capture_a2ytbu.png",
      "https://res.cloudinary.com/dbbk9wg2i/image/upload/v1759208100/Capture_wzsxtf.png"
    ],
    content: `
# Tech StartUp Product Website

A sleek and modern website for Snapfit, a tech solutions provider. It includes interactive service showcases, a tools listing, pricing page, dynamic inspiration page, and contact page — all designed for a seamless user experience.

## Features
- Interactive service showcases
- Tools listing
- Pricing page
- Dynamic inspiration page

## Technology Stack
- React
- Tailwind CSS
- TypeScript
- Framer Motion
    `,
    tags: ["React", "Tailwind", "TypeScript", "Framer Motion"],
    demoUrl: "https://snapfit-hc66.vercel.app/",
    imagePosition: "right",
    featured: true
  },
  {
    id: 4,
    title: "Social Media Platform",
    description: "Spill the Tea is a personal project — a social media platform where users can share thoughts, ideas, and experiences in a fun, engaging way.",
    image: "https://res.cloudinary.com/dbbk9wg2i/image/upload/v1759208100/Capture_wzsxtf.png",
    images: [
      "https://res.cloudinary.com/dbbk9wg2i/image/upload/v1759208100/Capture_wzsxtf.png",
      "https://res.cloudinary.com/dbbk9wg2i/image/upload/v1759216128/Capture_cyu1gp.png"
    ],
    content: `
# Social Media Platform

Spill the Tea is a personal project — a social media platform where users can share thoughts, ideas, and experiences in a fun, engaging way. It includes real-time chat, post creation, a dynamic feed, and the ability to create communities.

## Features
- Real-time chat
- Post creation
- Dynamic feed
- Communities

## Technology Stack
- React
- Tailwind CSS
- PostgreSQL
- NodeJS
- Socket.io
- ExpressJS
- Prisma
- Redis
    `,
    tags: ["React", "Tailwind", "PostgreSQL", "NodeJS", "Socket.io", "ExpressJS", "Prisma", "Redis"],
    demoUrl: "https://www.spill-the-tea.online/",
    imagePosition: "left",
    featured: true
  },
  {
    id: 5,
    title: "Ride Sharing Platform",
    description: "ShareRide is a personal project — a Ride Sharing platform where users can share rides engaging way.",
    image: "https://res.cloudinary.com/dbbk9wg2i/image/upload/v1759216128/Capture_cyu1gp.png",
    images: [
      "https://res.cloudinary.com/dbbk9wg2i/image/upload/v1759216128/Capture_cyu1gp.png"
    ],
    content: `
# Ride Sharing Platform

ShareRide is a personal project — a Ride Sharing platform where users can share rides engaging way. It includes real-time chat, post creation, a dynamic feed.

## Features
- Real-time chat
- Post creation
- Dynamic feed
    `,
    tags: ["React", "Tailwind", "PostgreSQL", "NodeJS", "Socket.io", "ExpressJS", "Prisma"],
    demoUrl: "https://www.shareride.site/",
    imagePosition: "right",
    featured: true
  },
  {
    id: 6,
    title: "Canva Like Clone",
    description: "Canva Clone is a personal project — a Canva like online editor where users can create stunning graphics, presentations, and social media posts with ease.",
    image: "https://res.cloudinary.com/dbbk9wg2i/image/upload/v1759252076/Capture_ncfxgy.png",
    images: [
      "https://res.cloudinary.com/dbbk9wg2i/image/upload/v1759252076/Capture_ncfxgy.png"
    ],
    content: `
# Canva Like Clone

Canva Clone is a personal project — a Canva like online editor where users can create stunning graphics, presentations, and social media posts with ease.

## Features
- Image manipulation
- Text editing
- Export functionalities
    `,
    tags: ["Nextjs", "Tailwind", "TypeScript", "FiberJs", "Mongodb"],
    demoUrl: "https://my-canvas-editor.vercel.app/",
    imagePosition: "left",
    featured: true
  },
  {
    id: 7,
    title: "Ecommerce Platform",
    description: "EasyShop is a professional project — a full-featured e-commerce platform that offers a seamless shopping experience.",
    image: "https://res.cloudinary.com/dbbk9wg2i/image/upload/v1759256114/Capture_htgjkq.png",
    images: [
      "https://res.cloudinary.com/dbbk9wg2i/image/upload/v1759256114/Capture_htgjkq.png"
    ],
    content: `
# Ecommerce Platform

EasyShop is a professional project — a full-featured e-commerce platform that offers a seamless shopping experience with advanced product management, secure payment integration, and real-time order tracking.

## Features
- Product management
- Secure payment integration
- Real-time order tracking
    `,
    tags: ["Nextjs", "Tailwind", "TypeScript", "Supabase"],
    demoUrl: "https://easyshop-three.vercel.app/",
    imagePosition: "right",
    featured: true
  }
];
