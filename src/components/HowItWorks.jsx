import { CheckSquare, Calendar, Truck, Smile } from "lucide-react";
import mascotPeek from "@/assets/ec87d54077a7f60f6a6705c150a1eb36d7ebcd32.png";

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

const HowItWorks = () => {
  return (
    <section className="section-container py-12 md:py-20">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Content */}
        <div className="flex flex-col justify-center align-middle m-auto">
          <div className="flex items-center gap-4 mb-8">
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

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <step.icon className="w-5 h-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 h-16 bg-primary/20 mt-2"></div>
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
