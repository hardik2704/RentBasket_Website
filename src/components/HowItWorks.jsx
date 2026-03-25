import { CheckSquare, Calendar, Truck, Smile } from "lucide-react";
import mascotPeek from "@/assets/ec87d54077a7f60f6a6705c150a1eb36d7ebcd32.png";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const steps = [
  {
    icon: CheckSquare,
    title: "Pick products / combos",
    description: "Furniture, appliances, mattresses & more",
  },
  {
    icon: Calendar,
    title: "Choose plan & schedule delivery",
    description: "Select the plan that fits your timeline.",
  },
  {
    icon: Truck,
    title: "We deliver + Install",
    description: "Free delivery and professional installation",
  },
  {
    icon: Smile,
    title: "Enjoy worry-free living",
    description: "Service + Relocation support whenever needed.",
  },
];

const StepItem = ({ step, index, scrollYProgress, totalSteps }) => {
  const interval = 1 / (totalSteps - 1);
  const target = index * interval;

  const start = Math.max(0, target - 0.2);
  const end = Math.min(1, target + 0.1);

  const opacity = useTransform(scrollYProgress, [start, end], [0.35, 1]);
  const scale = useTransform(scrollYProgress, [start, end], [0.85, 1.1]);
  const xOffset = useTransform(scrollYProgress, [start, end], [-15, 0]);

  return (
    <motion.div
      className="relative flex gap-5 z-10 w-full"
      style={{ opacity, x: xOffset }}
    >
      <div className="flex flex-col items-center">
        {/* Strict w-12 enforces exact center alignment for the background line (16px pl-4 + 24px half-width = 40px absolute) */}
        <div className="bg-white rounded-lg p-1 w-12 flex justify-center">
          <motion.div
            className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-sm"
            style={{ scale }}
          >
            <step.icon className="w-5 h-5" />
          </motion.div>
        </div>
      </div>
      <div className="flex-1 pt-2 pb-6">
        <h3 className="font-bold text-lg md:text-xl mb-1 text-card-foreground">
          {step.title}
        </h3>
        <p className="text-muted-foreground text-sm md:text-base pr-4 md:pr-0">{step.description}</p>
      </div>
    </motion.div>
  );
};

const HowItWorks = () => {
  const containerRef = useRef(null);

  // Offset ensures the container fully triggers 1.0 progress well before disappearing off the top
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 60%"],
  });

  return (
    <section className="section-container py-12 md:py-20 overflow-hidden">
      <div className="flex flex-col w-full max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-10 mx-auto w-fit">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-center md:text-left">
            How it works in
            <br />
            4 simple steps.
          </h2>
          <img
            src={mascotPeek}
            alt="RentBasket mascot"
            className="w-20 sm:w-24 md:w-32 block"
          />
        </div>

        {/* Steps Container tracked by Framer Motion */}
        <div ref={containerRef} className="relative mt-4 w-full max-w-lg mx-auto">
          
          {/* Base Background Line (Faded) - perfectly centered behind the icons located at left: 40px (16px padding + 24px icon center) */}
          <div className="absolute left-[39px] top-6 bottom-16 w-[2px] bg-primary/20 rounded-full" />

          {/* Dynamic Active Line connected to exactly how far user has scrolled */}
          <motion.div
            className="absolute left-[39px] top-6 bottom-16 w-[2px] bg-primary rounded-full origin-top"
            style={{ scaleY: scrollYProgress }}
          />

          {/* Individual Steps */}
          <div className="flex flex-col gap-2 relative z-10 pl-4">
            {steps.map((step, index) => (
              <StepItem
                key={index}
                step={step}
                index={index}
                totalSteps={steps.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
          
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
