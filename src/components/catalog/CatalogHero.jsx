import { MapPin } from "lucide-react";

const CatalogHero = () => {
  return (
    <section className="bg-cream/50">
      <div className="section-container py-12 md:py-16">
        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col items-start">
          <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <MapPin className="w-3 h-3" />
            Delhi NCR
          </span>

          <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight mb-4 text-foreground">
            Rent furniture and appliances for{" "}
            <span className="text-primary italic">every duration</span>
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-lg">
            From 1 day to 12 months — flexible rentals, transparent pricing,
            free maintenance, delivery and installation.
          </p>

          <div className="flex gap-3">
            <a
              href="#appliances"
              className="btn-outline text-sm py-2.5 px-5"
            >
              Browse Appliances
            </a>
            <a
              href="https://www.rentbasket.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm py-2.5 px-5"
              style={{
                background:
                  "linear-gradient(89.03deg, #D72F26 -14.8%, #EF1040 50.11%, #FECC87 129.44%)",
              }}
            >
              Complete Home Setup
            </a>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center gap-16">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3.5 py-1.5 rounded-full mb-5">
              <MapPin className="w-3.5 h-3.5" />
              Delhi NCR
            </span>

            <h1 className="font-display text-4xl xl:text-5xl font-bold leading-tight mb-5 text-foreground">
              Rent furniture and appliances
              <br />
              for{" "}
              <span className="text-primary italic">every duration</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
              From 1 day to 12 months — flexible rentals, transparent pricing,
              free maintenance, delivery and installation.
            </p>

            <div className="flex gap-4">
              <a
                href="#appliances"
                className="btn-outline py-3 px-7"
              >
                Browse Appliances
              </a>
              <a
                href="https://www.rentbasket.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary py-3 px-7"
                style={{
                  background:
                    "linear-gradient(89.03deg, #D72F26 -14.8%, #EF1040 50.11%, #FECC87 129.44%)",
                }}
              >
                Complete Home Setup
              </a>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="relative w-80 h-64 xl:w-96 xl:h-72 rounded-3xl overflow-hidden bg-secondary flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-6xl mb-3">🏠</div>
                <p className="text-muted-foreground font-medium text-sm">
                  Set up your home under
                </p>
                <p className="text-2xl font-bold text-primary mt-1">
                  ₹6,000/month
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CatalogHero;
