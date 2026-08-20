"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { Service } from "@/types/service";

type ServiceCardProps = {
  service: Service;
  index: number;
};

const ServiceCard = ({ service, index }: ServiceCardProps) => {
  const prefersReducedMotion = useReducedMotion();

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.4,
        delay: prefersReducedMotion ? 0 : index * 0.08,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="h-full"
    >
      <div className="pop-card-lg p-6 sm:p-8 flex flex-col justify-between h-full hover:translate-y-[-3px] transition-all">
        <div>
          <div className="w-full aspect-video rounded-2xl border-2 border-[var(--pop-border)] shadow-[3px_3px_0px_#1e1b2e] mb-4 bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-3">
            <img
              src={service.image}
              alt={service.imageAlt}
              className="max-h-36 max-w-full object-contain"
              draggable={false}
            />
          </div>

          <h3 className="text-2xl font-black text-foreground mb-2">
            {service.title}
          </h3>

          <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-4">
            {service.description}
          </p>
        </div>

        <ul className="flex flex-wrap gap-1.5 pt-2" aria-label={`${service.title} technologies`}>
          {service.technologies.map((tech) => (
            <li key={tech}>
              <span className="inline-block rounded-full bg-slate-100 dark:bg-slate-800 text-foreground border border-[var(--pop-border)] shadow-[1px_1px_0px_#1e1b2e] px-3 py-1 text-xs font-extrabold">
                {tech}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default ServiceCard;