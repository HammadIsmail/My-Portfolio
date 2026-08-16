"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Card } from "@/components/ui/card";
import type { Service } from "@/types/service";
import { cn } from "@/lib/utils";

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
        duration: prefersReducedMotion ? 0 : 0.5,
        delay: prefersReducedMotion ? 0 : index * 0.08,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const imageFloat = prefersReducedMotion
    ? {}
    : {
      y: [0, -4, 0],
      transition: {
        duration: 4 + index * 0.3,
        repeat: Infinity,
        ease: "easeInOut" as const,
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
      <div
        className={cn(
          "group flex h-full min-h-[440px] flex-col overflow-hidden rounded-3xl neo-raised neo-raised-hover transition-all duration-300"
        )}
      >
        <div className="relative flex min-h-[160px] flex-[0.45] items-center justify-center m-4 p-4 neo-inset rounded-2xl">
          <motion.div
            animate={imageFloat}
            className="relative flex h-full w-full items-center justify-center"
          >
            <motion.img
              src={service.image}
              alt={service.imageAlt}
              className="max-h-36 max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              draggable={false}
            />
          </motion.div>
        </div>

        <div className="flex flex-1 flex-col px-6 pb-6 pt-2 sm:px-8 sm:pb-8">
          <h3 className="text-xl font-bold font-serif text-foreground sm:text-2xl">
            {service.title}
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {service.description}
          </p>

          <ul
            className="mt-5 flex flex-wrap gap-2"
            aria-label={`${service.title} technologies`}
          >
            {service.technologies.map((tech) => (
              <li key={tech}>
                <span className="inline-block rounded-full neo-inset-sm px-3 py-1 text-xs font-semibold text-primary">
                  {tech}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;