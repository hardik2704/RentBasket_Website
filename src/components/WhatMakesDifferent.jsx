import { Truck, Wrench, Home, Package } from "lucide-react";
import footerSection from "@/assets/footer-video.mp4";
import { useRef, useEffect, useState } from "react";

const features = [
  {
    icon: Truck,
    title: "Free Delivery & Installation",
    description: "Move in faster. We deliver and install at no extra cost.",
    bgColor: "bg-red-500",
  },
  {
    icon: Wrench,
    title: "Free Maintenance & Repair",
    description:
      "If something stops working, we fix it - quickly and responsibly.",
    bgColor: "bg-red-500",
  },
  {
    icon: Home,
    title: "Complete Home Setup",
    description:
      "Set up your home under ₹6,000/month with smart combos and essentials.",
    bgColor: "bg-red-500",
  },
  {
    icon: Package,
    title: "Free Relocation",
    description:
      "Life changes. Your furniture plan should too. Relocate without the headache.",
    bgColor: "bg-red-500",
  },
];

const WhatMakesDifferent = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const [containerHeight, setContainerHeight] = useState("auto");

  // Calculate total height including stacking effect
  useEffect(() => {
    const calculateHeight = () => {
      if (cardsRef.current.length === 0) return;

      // Get all card heights
      const cardHeights = cardsRef.current.map(
        (card) => card?.offsetHeight || 0,
      );

      // Calculate total height: sum of all cards minus overlaps
      // The first card takes full height, each subsequent card adds its height minus some overlap
      let totalHeight = cardHeights[0] || 0; // First card full height

      for (let i = 1; i < cardHeights.length; i++) {
        // Add the height of each subsequent card, but with some overlap
        // You can adjust the overlap factor (0.7 means 70% height, 30% overlap)
        const overlapFactor = 0.6; // Adjust this value to control how much cards overlap
        totalHeight += cardHeights[i] * overlapFactor;
      }

      // Add some extra padding for smooth scrolling
      totalHeight += 100;

      setContainerHeight(`${totalHeight}px`);
    };

    // Calculate after initial render
    setTimeout(calculateHeight, 100);

    // Recalculate on window resize
    window.addEventListener("resize", calculateHeight);

    return () => window.removeEventListener("resize", calculateHeight);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerBottom = container.getBoundingClientRect().bottom;

      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        const cardTop = card.getBoundingClientRect().top;
        const cardHeight = card.offsetHeight;

        // Calculate how much the card should be offset
        // Each card after the first will start overlapping when it reaches the top
        if (cardTop <= 0 && index > 0) {
          // Card is at or above the top of viewport
          const overlapAmount = Math.min(Math.abs(cardTop), cardHeight);

          // Apply transform to create stacking effect
          // Each card will be pushed up by the previous card's height minus some overlap
          const previousCardsHeight = cardsRef.current
            .slice(0, index)
            .reduce((acc, c) => acc + (c?.offsetHeight || 0), 0);

          const translateY = -Math.min(overlapAmount, previousCardsHeight);

          card.style.transform = `translateY(${translateY}px)`;
          card.style.zIndex = `${index + 1}`;

          // Add a subtle shadow effect when stacked
          if (Math.abs(translateY) > 0) {
            card.style.boxShadow = "0 -5px 15px rgba(0, 0, 0, 0.1)";
          } else {
            card.style.boxShadow = "";
          }
        } else if (cardTop > 0) {
          // Reset card position when not stuck
          card.style.transform = "translateY(0px)";
          card.style.zIndex = `${index + 1}`;
          card.style.boxShadow = "";
        }

        // Make card sticky when it reaches the top
        if (cardTop <= 0 && containerBottom > cardHeight) {
          card.style.position = "sticky";
          card.style.top = "0";
        } else {
          card.style.position = "relative";
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <section className="section-container py-12 md:py-20">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-12 font-sans">
          What makes RentBasket Different
        </h2>

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

        {/* CTA Section - Mobile */}
        <div className="flex flex-col lg:hidden text-center mt-12">
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
                className="btn-primary"
                style={{
                  width: "70%",
                  margin: "auto",
                }}
              >
                Get home setup quote
              </button>
            </a>
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

        {/* CTA Section - Desktop */}
        <div className="hidden lg:flex flex-col text-center mt-12">
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
                className="btn-primary"
                style={{
                  width: "20%",
                  margin: "auto",
                }}
              >
                Get home setup quote
              </button>
            </a>
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

      {/* Gradient Divider */}
      <div className="flex justify-center w-full pt-12 bg-gradient-to-t from-blue-200 to-blue-10 dark:from-blue-950/40 dark:to-blue-900/20 shadow-lg"></div>

      {/* Video Section */}
      <div className="flex justify-center w-full border-none">
        <video className="w-full" autoPlay loop muted playsInline>
          <source src={footerSection} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </>
  );
};

export default WhatMakesDifferent;
