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
  // Map progress: 4 steps means they light up sequentially across the 0..1 interval
  // e.g. approx points: 0, 0.33, 0.66, 1
  const interval = 1 / (totalSteps - 1);
  const target = index * interval;

  // Define the reveal window for this step
  const start = Math.max(0, target - 0.2);
  const end = Math.min(1, target + 0.1);

  // Directly map the scroll progress to style values smoothly
  const opacity = useTransform(scrollYProgress, [start, end], [0.35, 1]);
  const scale = useTransform(scrollYProgress, [start, end], [0.85, 1.1]);
  const xOffset = useTransform(scrollYProgress, [start, end], [-15, 0]);

  return (
    <motion.div
      className="relative flex gap-5 z-10"
      style={{ opacity, x: xOffset }}
    >
      <div className="flex flex-col items-center">
        {/* We use bg-white on the outer div so it visibly blocks the background line */}
        <div className="bg-white rounded-lg p-1">
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
        <p className="text-muted-foreground">{step.description}</p>
      </div>
    </motion.div>
  );
};

const HowItWorks = () => {
  const containerRef = useRef(null);

  // Track the raw scroll position within the container bounds
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Start tracking when container top hits center of viewport
    // End tracking when container bottom hits center of viewport
    offset: ["start center", "end center"],
  });

  return (
    <section className="section-container py-12 md:py-20 overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex flex-col justify-center align-middle m-auto w-full max-w-2xl">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold">
              How it works in
              <br />
              4 simple steps.
            </h2>
            <img
              src={mascotPeek}
              alt="RentBasket mascot"
              className="w-24 md:w-32 md:block"
            />
          </div>

          {/* Steps Container tracked by Framer Motion */}
          <div ref={containerRef} className="relative mt-4 pl-2 lg:pl-6">
            
            {/* Base Background Line (Faded) */}
            <div className="absolute left-[33px] lg:left-[49px] top-6 bottom-16 w-[3px] bg-primary/20 rounded-full" />

            {/* Dynamic Active Line connected to exactly how far user has scrolled */}
            <motion.div
              className="absolute left-[33px] lg:left-[49px] top-6 bottom-16 w-[3px] bg-primary rounded-full origin-top"
              style={{ scaleY: scrollYProgress }}
            />

            {/* Individual Steps */}
            <div className="flex flex-col gap-2">
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
      </div>
    </section>
  );
};

export default HowItWorks;
