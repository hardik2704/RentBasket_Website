import { Truck, Wrench, Home, Package } from "lucide-react";
import { Link } from "react-router-dom";

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
  return (
    <>
      <section className="section-container pt-10 md:pt-14 pb-6 md:pb-8 bg-cream/50">
        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8">
          What makes RentBasket Different
        </h2>

        {/* Desktop Grid */}
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

        {/* Mobile/Tablet Stack (normal scrolling) */}
        <div className="md:hidden flex flex-col gap-4 max-w-5xl mx-auto p-5">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300"
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
            <Link
              to="/catalog"
              className="w-full flex justify-center"
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
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex flex-col text-center mt-8">
          <h3 className="text-2xl md:text-3xl font-sans font-bold mb-6">
            Get Started Today!
          </h3>
          <div className="flex flex-col gap-4 justify-center">
            <Link
              to="/catalog"
              className="w-full flex justify-center"
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
            </Link>
          </div>
        </div>
      </section>

      <div className="flex justify-center w-full pt-4 bg-gradient-to-t from-cream to-secondary/40 dark:from-secondary dark:to-transparent" />
    </>
  );
};

export default WhatMakesDifferent;
