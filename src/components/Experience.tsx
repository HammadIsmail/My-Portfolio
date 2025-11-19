import { Briefcase, MapPin, Calendar } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Experience = () => {
  const { ref, isVisible } = useScrollAnimation();

  const experiences = [
    {
      role: "Junior Full Stack Developer",
      company: "Infoquestpro",
      location: "Poland",
      workType: "Remote",
      period: "2025 - Present",
      description: "Transitioned to advanced development role working with microservices architecture and distributed systems. Building and maintaining independent services using modern tech stack, implementing inter-service communication, and contributing to large-scale application ecosystems."
    },
    {
      role: "Junior Full Stack Developer",
      company: "Hive Technologies",
      location: "Pakistan",
      workType: "Hybrid",
      period: "2025 - 3 Months",
      description: "Promoted from intern to full-time developer, taking ownership of feature development and maintenance across multiple client projects. Built scalable web applications using React, Next.js, and Node.js/Express, while collaborating with cross-functional teams to deliver high-quality solutions on schedule."
    },
    {
      role: "Full-Stack Intern",
      company: "Hive Technologies",
      location: "Pakistan",
      workType: "Onsite",
      period: "2025 - 3 Months",
      description: "Contributed to live production applications serving real users, developing features using React, Next.js, and Node.js with Express. Gained hands-on experience in full-stack development within an enterprise environment, collaborating on client-facing projects and learning industry best practices."
    }
  ];

  return (
    <section
      ref={ref}
      id="experience"
      className="py-12 sm:py-16 lg:py-20 bg-background"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16">
          Experience
        </h2>

        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className={`bg-card rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-700 border border-border ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                    {exp.role}
                  </h3>
                  <p className="text-lg sm:text-xl font-semibold text-primary mb-2">
                    {exp.company}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {exp.workType}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 text-sm sm:text-base text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{exp.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{exp.period}</span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
