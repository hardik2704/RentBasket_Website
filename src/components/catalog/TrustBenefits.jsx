import { Truck, Wrench, RefreshCw, ArrowRightLeft, Home } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Free Delivery & Installation",
    description: "We deliver and set up everything at no extra cost.",
  },
  {
    icon: Wrench,
    title: "Free Maintenance",
    description: "Something breaks? We fix it — quickly and free.",
  },
  {
    icon: RefreshCw,
    title: "Flexible Lock-ins",
    description: "Rent from 1 day to 12 months. Extend or close anytime.",
  },
  {
    icon: ArrowRightLeft,
    title: "Free Relocation Support",
    description: "Moving cities or flats? We move your rentals too.",
  },
  {
    icon: Home,
    title: "Complete Home Setup",
    description: "Furnish your entire home under ₹6,000/month.",
  },
];

const TrustBenefits = () => {
  return (
    <section className="bg-secondary/40 py-12 md:py-16">
      <div className="section-container">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-8 md:mb-12">
          Why 2000+ customers trust{" "}
          <span className="text-primary">RentBasket</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-soft hover:shadow-card transition-all duration-300 text-center group"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm md:text-base mb-1.5 leading-snug">
                {benefit.title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBenefits;
