import { Truck, Wrench, Home, Package } from "lucide-react";
import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const features = [
  {
    icon: Truck,
    title: "Free Delivery & Installation",
    description: "Move in faster. We deliver and install at no extra cost.",
    bgColor: "bg-primary",
  },
  {
    icon: Wrench,
    title: "Free Maintenance & Repair",
    description:
      "If something stops working, we fix it - quickly and responsibly.",
    bgColor: "bg-primary",
  },
  {
    icon: Home,
    title: "Complete Home Setup under ₹6,000/month ",
    description:
      "Set up your home under ₹6,000/month with smart combos and essentials.",
    bgColor: "bg-primary",
  },
  {
    icon: Package,
    title: "Free Relocation",
    description:
      "Life changes. Your furniture plan should too. Relocate without the headache.",
    bgColor: "bg-primary",
  },
];

const WhatMakesDifferent = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const [containerHeight, setContainerHeight] = useState("auto");

  useEffect(() => {
    const calculateHeight = () => {
      if (cardsRef.current.length === 0) return;

      const cardHeights = cardsRef.current.map(
        (card) => card?.offsetHeight || 0,
      );

      let totalHeight = cardHeights[0] || 0;

      for (let i = 1; i < cardHeights.length; i++) {
        const overlapFactor = 0.6;
        totalHeight += cardHeights[i] * overlapFactor;
      }

      totalHeight += 100;

      setContainerHeight(`${totalHeight}px`);
    };

    setTimeout(calculateHeight, 100);

    window.addEventListener("resize", calculateHeight);

    return () => window.removeEventListener("resize", calculateHeight);
  }, []);

  const handleStackScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerBottom = container.getBoundingClientRect().bottom;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const cardTop = card.getBoundingClientRect().top;
      const cardHeight = card.offsetHeight;

      if (cardTop <= 0 && index > 0) {
        const overlapAmount = Math.min(Math.abs(cardTop), cardHeight);

        const previousCardsHeight = cardsRef.current
          .slice(0, index)
          .reduce((acc, c) => acc + (c?.offsetHeight || 0), 0);

        const translateY = -Math.min(overlapAmount, previousCardsHeight);

        card.style.transform = `translateY(${translateY}px)`;
        card.style.zIndex = `${index + 1}`;

        if (Math.abs(translateY) > 0) {
          card.style.boxShadow = "0 -5px 15px rgba(0, 0, 0, 0.1)";
        } else {
          card.style.boxShadow = "";
        }
      } else if (cardTop > 0) {
        card.style.transform = "translateY(0px)";
        card.style.zIndex = `${index + 1}`;
        card.style.boxShadow = "";
      }

      if (cardTop <= 0 && containerBottom > cardHeight) {
        card.style.position = "sticky";
        card.style.top = "0";
      } else {
        card.style.position = "relative";
      }
    });
  }, []);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", handleStackScroll);

  useEffect(() => {
    handleStackScroll();
  }, [handleStackScroll]);

  return (
    <>
      <section className="section-container pt-10 md:pt-14 pb-6 md:pb-8 bg-cream/50">
        <motion.h2
          className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          What makes RentBasket Different
        </motion.h2>

        <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto p-5">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-md p-6 shadow-soft hover:shadow-card transition-shadow"
            >
              <div className="flex items-start gap-3 mb-4">
                <div
                  className={`w-8 h-8 rounded-lg ${feature.bgColor} flex items-center justify-center flex-shrink-0 shadow-md`}
                >
                  <feature.icon className="w-4 h-4 text-white stroke-[2.5]" />
                </div>
                <h6 className="text-md leading-tight font-semibold font-sans">
                  {feature.title}
                </h6>
              </div>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div
          ref={containerRef}
          className="md:hidden relative max-w-5xl mx-auto p-5"
          style={{
            minHeight: containerHeight,
            transition: "min-height 0.3s ease-out",
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="bg-card border border-border rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300 mb-4"
              style={{
                position: "sticky",
                top: 0,
                zIndex: index + 1,
                transform: "translateY(0px)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                willChange: "transform",
              }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div
                  className={`w-8 h-8 rounded-lg ${feature.bgColor} flex items-center justify-center flex-shrink-0 shadow-md`}
                >
                  <feature.icon className="w-4 h-4 text-white stroke-[2.5]" />
                </div>
                <h6 className="font-semibold text-md leading-tight font-sans">
                  {feature.title}
                </h6>
              </div>
              <p className="text-md text-muted-foreground text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:hidden text-center mt-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 font-sans">
            Get Started Today!
          </h3>
          <div className="flex flex-col gap-4 justify-center">
            <a
              href="https://www.rentbasket.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                className="btn-outline"
                style={{
                  width: "70%",
                  margin: "auto",
                }}
              >
                Browse Catalogue
              </button>
            </a>
          </div>
        </div>

        <div className="hidden lg:flex flex-col text-center mt-8">
          <h3 className="text-2xl md:text-3xl font-sans font-bold mb-6">
            Get Started Today!
          </h3>
          <div className="flex flex-col gap-4 justify-center">
            <a
              href="https://www.rentbasket.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                className="btn-outline"
                style={{
                  width: "20%",
                  margin: "auto",
                }}
              >
                Browse Catalogue
              </button>
            </a>
          </div>
        </div>
      </section>

      <div className="flex justify-center w-full pt-4 bg-gradient-to-t from-cream to-secondary/40 dark:from-secondary dark:to-transparent" />
    </>
  );
};

export default WhatMakesDifferent;
