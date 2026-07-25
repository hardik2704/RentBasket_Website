import { useState } from "react";
import { Sliders, Wrench, Phone, Sparkles, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const features = [
  {
    icon: Sliders,
    title: "Customizations",
    description: "Tailor your furniture to your space and style — make it truly yours.",
  },
  {
    icon: Wrench,
    title: "Free Maintenance and Repair",
    description: "If something stops working, we fix or replace it — quickly and responsibly, with no hidden cost.",
  },
  {
    icon: Phone,
    title: "Consultation on Call",
    description: "Not sure what you need? Talk to us and we'll help you plan the perfect setup.",
  },
  {
    icon: Sparkles,
    title: "Try First, Pay Later",
    description: "Try it before you commit and pay later — on selected products.",
  },
];

const WhatMakesDifferent = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-cream/35 py-8 md:py-12 border-t border-b border-border/20">
      <div className="section-container">

        {/* Editorial Title */}
        <div className="text-center max-w-xl mx-auto mb-6 md:mb-8 px-4">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.25] sm:leading-[1.5]">
            What makes RentBasket <span className="font-script normal-case font-normal text-[0.88em] tracking-normal inline-block ml-1 mt-0.5 mb-0.5 sm:mt-2 sm:mb-2">different</span>
          </h2>
          <p className="font-sans text-sm text-muted-foreground mt-2 sm:mt-4">
            Zero hassle, transparent pricing, <span className="whitespace-nowrap">built for relocation.</span>
          </p>
        </div>

        {/* ── Laptop/Desktop Layout (4-Column Grid) ── */}
        <motion.div
          className="hidden md:grid grid-cols-4 gap-5 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="h-full bg-background border border-border/40 rounded-2xl p-5 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3"
                variants={cardVariants}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/10">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-display font-semibold text-foreground text-lg leading-snug">
                    {feature.title}
                  </h3>
                  <p className="font-sans text-[15px] text-muted-foreground leading-snug">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Mobile Viewport Layout (Compact Vertical Accordion) ── */}
        <div className="md:hidden flex flex-col gap-3 w-full max-w-sm mx-auto px-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = activeIndex === index;
            return (
              <div
                key={index}
                className="bg-background border border-border/40 rounded-xl overflow-hidden transition-all duration-300 shadow-soft"
              >
                <button
                  onClick={() => setActiveIndex(isActive ? -1 : index)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0">
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <h3 className="font-display font-semibold text-foreground text-base sm:text-lg leading-none">
                      {feature.title}
                    </h3>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ease-out shrink-0 ml-2 ${isActive ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      key="content"
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: { height: "auto", opacity: 1 },
                        collapsed: { height: 0, opacity: 0 },
                      }}
                      transition={{
                        height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 0.25, ease: "easeInOut", delay: isActive ? 0.05 : 0 },
                      }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 font-sans text-sm text-muted-foreground leading-relaxed pl-[52px]">
                        {feature.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhatMakesDifferent;
