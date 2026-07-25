import { MapPin } from "lucide-react";
import kuMascot from "@/assets/Ku_standing_proud.png";

/** Compact Ku — native square aspect, keeps catalog above the fold */
const KuMascotImage = ({ className = "" }) => (
  <img
    src={kuMascot}
    alt="RentBasket mascot Ku"
    className={`block h-auto object-contain ${className}`}
    loading="eager"
    decoding="async"
  />
);

const CatalogHero = () => {
  return (
    <section className="bg-background border-b border-border/50">
      <div className="section-container py-2 md:py-3">
        <div className="flex flex-row items-center justify-between gap-4 lg:gap-10">
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 bg-secondary text-muted-foreground text-xs font-medium px-3 py-1 rounded-full mb-3 lg:mb-4">
              <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
              Delhi NCR
            </span>

            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight text-foreground">
              Rent furniture and appliances for{" "}
              <span className="text-primary italic">every duration</span>
            </h1>

            {/* Trust points — kept, but quiet: a light inline line with dot
                separators instead of bordered capsules so they don't compete
                with the category/filter pills below. Dots are flowed as separators
                BETWEEN items (not prefixed to each) so wrapped rows stay flush to
                the left margin. */}
            <p className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              {["3–12 month rentals", "Transparent pricing", "Free maintenance", "Free delivery & installation"].map((label, i) => (
                <span key={label} className="contents">
                  {i > 0 && <span className="text-border" aria-hidden="true">•</span>}
                  <span>{label}</span>
                </span>
              ))}
            </p>
          </div>

          <div className="shrink-0 w-[110px] sm:w-[160px] lg:w-[252px]">
            <KuMascotImage className="w-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CatalogHero;
