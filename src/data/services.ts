import type { Service } from "@/types/service";

export const services: Service[] = [
  {
    id: "web-development",
    image: "/services/fullstack.webp",
    imageAlt: "Full-stack web development illustration",
    title: "Full-Stack Web Development",
    description:
      "Build fast, scalable, and responsive web applications with modern frontend, backend, and database technologies. From business websites to complex web platforms, I deliver complete end-to-end solutions.",
    technologies: [
      "React",
      "Next.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "PostgreSQL",
    ],
  },
  {
    id: "ai-integration",
    image: "/services/ai_integration.webp",
    imageAlt: "AI integration, agents, and automation illustration",
    title: "AI Integration, Agents & Automation",
    description:
      "Integrate LLMs, AI Agents, MCP, RAG, and intelligent automation into your applications. I build production-ready AI solutions including chatbots, autonomous workflows, document intelligence, and custom AI-powered systems.",
    technologies: [
      "OpenAI",
      "Gemini",
      "Claude",
      "LangChain",
      "FastAPI",
      "Python",
      "MCP",
      "AI Agents",
      "RAG",
      "Vector DB",
      "Function Calling",
      "REST APIs",
    ],
  },
  {
    id: "mobile-development",
    image: "/services/mobile_app.webp",
    imageAlt: "Cross-platform mobile app development illustration",
    title: "Cross-Platform Mobile Apps",
    description:
      "Develop high-performance Android and iOS applications from a single codebase using React Native and Expo, delivering native-like experiences with faster development cycles.",
    technologies: [
      "React Native",
      "Expo",
      "Firebase",
      "REST APIs",
      "Push Notifications",
    ],
  },
  {
    id: "backend-api",
    image: "/services/backend.webp",
    imageAlt: "Backend and API development illustration",
    title: "Backend & API Development",
    description:
      "Design secure, scalable backend systems and REST APIs with authentication, database optimization, real-time communication, and cloud-ready architectures.",
    technologies: [
      "Express.js",
      "FastAPI",
      "NestJS",
      "JWT",
      "Socket.IO",
    ],
  },
  {
    id: "cloud-devops",
    image: "/services/cload.webp",
    imageAlt: "Cloud deployment and DevOps illustration",
    title: "Cloud Deployment & DevOps",
    description:
      "Deploy modern applications with cloud infrastructure, Docker containers, CI/CD pipelines, monitoring, and optimized production environments for reliability and performance.",
    technologies: [
      "AWS",
      "Docker",
      "Vercel",
      "GitHub Actions",
      "Nginx",
    ],
  },
  {
    id: "realtime",
    image: "/services/realtime.webp",
    imageAlt: "Real-time application development illustration",
    title: "Real-Time Applications",
    description:
      "Build interactive real-time experiences with live messaging, notifications, collaborative features, and instant data synchronization powered by WebSockets.",
    technologies: [
      "Socket.IO",
      "WebSockets",
      "Redis",
      "Notifications",
    ],
  },
];