import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import mascotVideo from "@/assets/ku_looping.webm";
import mascotVideoPacked from "@/assets/ku_looping_packed.mp4?url";
import AlphaVideo from "@/components/AlphaVideo";

// SP-01: Mobile-first hero.
// On mobile (375 px): content stacks vertically, CTA is always above the fold.
// On desktop (lg+): original two-column layout with mascot video alongside.
const HeroSection = () => {
  const catalogLink = "/catalog";

  return (
    <>
      {/* ── Mobile/Tablet View (Dual Layout) ─────────────────────── */}
      <section className="lg:hidden relative px-5 pt-8 sm:px-8 flex flex-col items-center text-center gap-4 overflow-hidden">
        <div className="bg-background -mx-5 sm:-mx-8 px-5 sm:px-8 w-[calc(100%+2.5rem)] sm:w-[calc(100%+4rem)] flex flex-col items-center text-center gap-4 pb-4">

          {/* Editorial Header */}
          <motion.div
            className="flex flex-col gap-2 z-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="font-display font-semibold text-foreground text-[25px] sm:text-[28px] leading-[1.2] max-w-md sm:max-w-lg mx-auto tracking-tight">
              Furnish your home, <br />on your own terms
            </h1>
            <p className="font-sans text-sm text-muted-foreground max-w-xs sm:max-w-sm mx-auto leading-relaxed">
              Rent premium furniture &amp; appliances in Delhi NCR &mdash; with free delivery and maintenance.
            </p>
          </motion.div>

          {/* Mascot video container - full scene, shown uncropped */}
          <div className="relative flex items-center justify-center w-full max-w-[320px] sm:max-w-[360px] mx-auto -mt-1.5 z-0">
            <AlphaVideo
              webmSrc={mascotVideo}
              packedSrc={mascotVideoPacked}
              className="w-full h-auto object-contain"
              ariaLabel="RentBasket mascot Ku animation"
            />
          </div>

          {/* Stats below video */}
          <div className="flex flex-col gap-6 w-full max-w-md mx-auto z-10 relative">
            {/* Stats - divider row */}
            <motion.div
              className="flex items-center justify-center gap-6 border-t border-border/40 pt-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
              <div className="text-left">
                <div className="font-display font-semibold text-foreground leading-none text-[22px] sm:text-[24px] tracking-tight">
                  2000+
                </div>
                <div className="font-sans text-[10px] font-semibold tracking-widest uppercase text-muted-foreground/70 mt-1">
                  Happy Customers
                </div>
              </div>
              <div className="w-[1px] h-7 bg-border/40 shrink-0" />
              <a
                href="https://rentbasket.short.gy/reviews"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-left rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-none"
                aria-label="Read our 4.9 Google reviews"
              >
                <span className="text-gold text-[22px] leading-none">★</span>
                <div>
                  <div className="font-display font-semibold text-foreground leading-none text-[22px] sm:text-[24px] tracking-tight">
                    4.9
                  </div>
                  <div className="font-sans text-[10px] font-semibold tracking-widest uppercase text-muted-foreground/70 mt-1">
                    Google Rating
                  </div>
                </div>
              </a>
            </motion.div>
          </div>

          {/* TODO: Once the backend supports category-based collection routing, restore the category tabs.
            For now, since collection filtering is handled directly within the catalog, they are removed from the hero view. */}
        </div>

      </section>

      {/* ── Desktop View (Dual Layout) ───────────────────────────── */}
      {/* Inner row capped to max-w-7xl and centered so the hero doesn't sprawl
          edge-to-edge (and de-align from the rest of the site) on wide / zoomed-
          out screens. The section stays full-bleed for the background. */}
      <section className="hidden lg:flex relative flex-row justify-center bg-background overflow-hidden lg:min-h-[440px] w-full">
        <div className="flex flex-row w-full max-w-6xl mx-auto px-8 xl:px-12">
          {/* Content column */}
          <div className="flex flex-col justify-center z-10 w-[48%] shrink-0 gap-8">
            {/* Editorial Header Tagline */}
            <motion.div
              className="flex flex-col gap-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h1 className="font-display font-semibold text-foreground text-3xl xl:text-4xl 2xl:text-[40px] leading-[1.2] tracking-tight text-balance">
                Furnish your home, <br />
                on your own terms.
              </h1>
              <p className="font-sans text-sm xl:text-base text-muted-foreground max-w-sm leading-relaxed">
                Rent premium furniture &amp; appliances in Delhi NCR &mdash; with free delivery and maintenance.
              </p>
            </motion.div>

            {/* TODO: Restore desktop category tabs once backend collections are built. */}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <Link
                to={catalogLink}
                data-testid="hero-cta"
                className="flex items-center justify-center h-[52px] w-full max-w-[240px] rounded-full border-[2px] border-primary text-primary font-sans font-bold text-[15px] xl:text-[16px] tracking-tight bg-white hover:bg-primary/5 transition-all shadow-soft active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Browse Catalogue
              </Link>
            </motion.div>

            {/* Refined Stats (Subtle divider row below CTA) */}
            <motion.div
              className="flex items-center gap-8 border-t border-border/60 pt-6 mt-2 max-w-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
            >
              <div>
                <span className="font-display font-semibold text-foreground leading-none block lg:text-[40px] xl:text-[48px] tracking-tight">
                  2000+
                </span>
                <span className="font-sans text-[11px] font-semibold tracking-wider uppercase text-muted-foreground/80 block mt-1.5">
                  Happy Customers
                </span>
              </div>
              <div className="w-[1px] h-10 bg-border/60 shrink-0" />
              <a
                href="https://rentbasket.short.gy/reviews"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Read our 4.9 Google reviews (opens in new tab)"
              >
                <Star className="w-7 h-7 xl:w-8 xl:h-8 fill-gold text-gold shrink-0" />
                <div>
                  <span className="font-display font-semibold text-foreground leading-none block lg:text-[40px] xl:text-[48px] tracking-tight">
                    4.9
                  </span>
                  <span className="font-sans text-[11px] font-semibold tracking-wider uppercase text-muted-foreground/80 block mt-1.5">
                    Google Rating
                  </span>
                </div>
              </a>
            </motion.div>
          </div>

          {/* Mascot video */}
          <div className="relative flex items-center justify-end lg:flex-1">
            <AlphaVideo
              webmSrc={mascotVideo}
              packedSrc={mascotVideoPacked}
              className="w-full max-w-[420px] xl:max-w-[460px] h-auto object-contain"
              ariaLabel="RentBasket mascot Ku animation"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
