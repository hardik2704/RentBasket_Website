import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import mascotVideo from "@/assets/kling_20260104_Image_to_Video_Just_Make__1408_0.mp4";

const categories = ["Furniture", "Appliances", "Combos", "Bestsellers"];

// SP-01: Mobile-first hero.
// On mobile (375 px): content stacks vertically, CTA is always above the fold.
// On desktop (lg+): original two-column layout with mascot video alongside.
const HeroSection = ({ activeCategory = "Furniture", onCategoryChange }) => {
  const catalogLink =
    activeCategory === "Combos"
      ? "/catalog?category=Complete%20Home%20Setup"
      : `/catalog?category=${encodeURIComponent(activeCategory)}`;

  return (
    <section className="relative flex flex-col lg:flex-row bg-background overflow-hidden lg:min-h-[440px]">

      {/* ── Content column ───────────────────────────────────────── */}
      <div className="flex flex-col justify-center px-5 py-8 sm:px-8 lg:px-16 xl:px-20 z-10 w-full lg:w-[44%] lg:shrink-0 gap-5 lg:gap-6 order-2 lg:order-1">

        {/* Headline */}
        <motion.h1
          className="font-display font-semibold leading-[1.1] tracking-tight text-foreground text-[26px] sm:text-[32px] lg:text-[40px] xl:text-[48px] 2xl:text-[54px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="font-script font-normal text-primary mr-1 text-[1.15em]">Rent</span>{" "}
          quality furniture &amp; appliances in{" "}
          <span className="text-primary">Delhi&nbsp;NCR</span>
        </motion.h1>

        {/* Stats */}
        <motion.div
          className="flex items-center gap-6 xl:gap-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          <div>
            <div className="font-sans font-extrabold italic text-primary leading-none text-[30px] sm:text-[36px] lg:text-[44px] xl:text-[52px] tracking-[-0.04em]">
              2000+
            </div>
            <div className="font-sans font-bold text-muted-foreground text-xs sm:text-sm xl:text-base mt-1 tracking-tight">
              Happy Customers
            </div>
          </div>
          <a
            href="https://rentbasket.short.gy/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Read our 4.9 Google reviews (opens in new tab)"
          >
            <div className="flex items-center gap-1.5 leading-none">
              <Star className="w-6 h-6 sm:w-8 sm:h-8 xl:w-10 xl:h-10 fill-gold text-gold shrink-0" />
              <span className="font-sans font-extrabold italic text-primary text-[30px] sm:text-[36px] lg:text-[44px] xl:text-[52px] tracking-[-0.04em]">
                4.9
              </span>
            </div>
            <div className="font-sans font-bold text-muted-foreground text-xs sm:text-sm xl:text-base mt-1 tracking-tight">
              Google Rating
            </div>
          </a>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          className="flex flex-wrap gap-x-4 gap-y-2 lg:flex-nowrap lg:gap-x-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {categories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange?.(cat)}
                className={`relative font-sans font-semibold text-[15px] sm:text-[17px] lg:text-[18px] xl:text-[20px] pb-1.5 tracking-tight transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* CTA — full-width on mobile so it's easy to tap */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Link
            to={catalogLink}
            data-testid="hero-cta"
            className="flex items-center justify-center h-[52px] w-full sm:w-auto sm:self-start sm:px-8 rounded-full border-[2.5px] border-primary text-primary font-sans font-bold text-[16px] xl:text-[18px] tracking-tight bg-white hover:bg-primary/5 transition-colors shadow-soft active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Browse Catalogue
          </Link>
        </motion.div>
      </div>

      {/* ── Mascot video ─────────────────────────────────────────── */}
      {/* Mobile: constrained height so it doesn't dominate below the CTA */}
      {/* Desktop: fills remaining width alongside content column */}
      <div className="relative flex items-center justify-center w-full h-[220px] sm:h-[280px] lg:h-auto lg:flex-1 order-1 lg:order-2">
        <video
          src={mascotVideo}
          className="h-full w-full lg:w-[90%] lg:h-[90%] object-contain"
          autoPlay
          loop
          muted
          playsInline
          aria-label="RentBasket mascot Ku waving hello"
        />
      </div>
    </section>
  );
};

export default HeroSection;
