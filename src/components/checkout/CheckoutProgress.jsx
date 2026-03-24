import { Check, ShoppingCart, MapPin, CreditCard, CheckCircle2 } from "lucide-react";

const STEPS = [
  { id: "cart", label: "Cart", icon: ShoppingCart },
  { id: "checkout", label: "Details", icon: MapPin },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "confirmation", label: "Done", icon: CheckCircle2 },
];

const CheckoutProgress = ({ currentStep = "checkout" }) => {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4 md:py-8">
      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2" />
        
        {/* Progress Line */}
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 transition-all duration-500" 
          style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
        />

        <div className="relative flex justify-between">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isActive = idx === currentIndex;
            const StepIcon = step.icon;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 ${
                    isCompleted 
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                      : isActive 
                        ? "bg-background border-primary text-primary shadow-lg shadow-primary/10" 
                        : "bg-background border-border text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 md:w-5 md:h-5 stroke-[3px]" />
                  ) : (
                    <StepIcon className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? "animate-pulse" : ""}`} />
                  )}
                </div>
                
                <span className={`mt-2 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CheckoutProgress;
