import { CheckCircle2, PackageSearch, Truck, CalendarCheck, Wrench } from "lucide-react";

const STEPS = [
  {
    id: "received",
    title: "Order Received",
    description: "Your booking is captured securely.",
    icon: CheckCircle2,
    active: true,
  },
  {
    id: "confirmed",
    title: "Team Confirmation",
    description: "We'll review and schedule delivery.",
    icon: PackageSearch,
    active: false,
  },
  {
    id: "delivery",
    title: "Delivery & Setup",
    description: "Free delivery and installation at your door.",
    icon: Truck,
    active: false,
  },
  {
    id: "starts",
    title: "Rental Starts",
    description: "Your flexible tenure officially begins.",
    icon: CalendarCheck,
    active: false,
  },
  {
    id: "support",
    title: "Ongoing Support",
    description: "Free maintenance included.",
    icon: Wrench,
    active: false,
  },
];

const NextSteps = () => {
  return (
    <div className="w-full bg-card border border-border rounded-2xl p-6 md:p-8 shadow-soft my-8">
      <h3 className="text-lg font-bold text-foreground mb-6">What happens next?</h3>
      
      <div className="relative">
        {/* Vertical Line for Mobile, Horizontal for Desktop */}
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border md:left-4 md:right-4 md:top-[19px] md:bottom-auto md:h-0.5 md:w-auto" />
        
        <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-4 relative z-10">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex md:flex-col items-start md:items-center gap-4 md:gap-3 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                  step.active 
                    ? "bg-primary border-primary text-white shadow-md shadow-primary/20" 
                    : "bg-background border-border text-muted-foreground"
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="md:text-center mt-1 md:mt-0">
                  <h4 className={`text-sm font-bold ${step.active ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-1 max-w-[140px] mx-auto leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NextSteps;
