"use client";

import { motion, useReducedMotion } from "framer-motion";
import ServiceCard from "@/components/services/ServiceCard";
import { services } from "@/data/services";
import { usePortfolio } from "@/context/PortfolioContext";

const Services = () => {
  const { isMobile } = usePortfolio();
  const prefersReducedMotion = useReducedMotion();

  const sectionVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      id="services"
      className={isMobile ? "py-12 sm:py-16 lg:py-20 bg-background" : "py-6 bg-background"}
      aria-labelledby={isMobile ? "services-heading" : undefined}
    >
      <div className="container mx-auto px-4 sm:px-6">
        {isMobile && (
          <motion.header
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mb-8 text-center sm:mb-12 lg:mb-16"
          >
            <h2
              id="services-heading"
              className="text-3xl font-bold sm:text-4xl lg:text-5xl"
            >
              Services
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base lg:text-lg">
              Building scalable web applications, AI-powered solutions, and cross-platform
              mobile experiences.
            </p>
          </motion.header>
        )}

        <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
