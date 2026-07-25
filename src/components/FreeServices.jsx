import { Truck, Wrench, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const SERVICES = [
  {
    icon: Truck,
    title: "Free Delivery",
    desc: "Delivered straight to your doorstep in Delhi NCR at zero cost, scheduled at your convenience.",
  },
  {
    icon: Wrench,
    title: "Free Installation",
    desc: "Our professional assembly team sets up and configures everything so you don't lift a finger.",
  },
  {
    icon: ShieldCheck,
    title: "Free Maintenance",
    desc: "Rent stress-free with complimentary repairs, regular servicing, and replacement coverage.",
  },
];

const FreeServices = () => {
  return (
    <section className="bg-background py-16 md:py-20 border-b border-border/20">
      <div className="section-container">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-14 md:mb-16">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
            The RentBasket Care Promise
          </h2>
          <p className="font-sans text-sm text-muted-foreground mt-2.5">
            Everything you need for a comfortable home setup is fully covered, with zero hidden charges.
          </p>
        </div>

        {/* 3-Column Service Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                className="flex flex-col items-center md:items-start text-center md:text-left gap-4"
                variants={cardVariants}
              >
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/10">
                  <Icon className="w-6 h-6 stroke-[1.75]" />
                </div>

                {/* Text Content */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-display font-semibold text-foreground text-lg sm:text-xl">
                    {service.title}
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-xs md:max-w-none">
                    {service.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FreeServices;
