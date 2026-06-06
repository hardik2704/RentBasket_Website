import { CheckCircle2, FileCheck2, PackageSearch, Truck, CalendarCheck, Wrench, Check } from "lucide-react";

// status: "done" | "current" | "upcoming"
const buildSteps = (kycComplete) => [
  {
    id: "received",
    title: "Order Received",
    description: "Your booking is captured securely.",
    icon: CheckCircle2,
    status: "done",
  },
  {
    id: "kyc",
    title: "Complete KYC",
    description: kycComplete
      ? "Documents verified — your identity is confirmed."
      : "Upload Aadhaar (front & back), a selfie, and your rent agreement to verify your identity.",
    icon: FileCheck2,
    status: kycComplete ? "done" : "current",
    currentBadge: "Action Needed",
  },
  {
    id: "confirmed",
    title: "Team Confirmation",
    description: "Our team reviews your booking and confirms your delivery slot within 24 hours.",
    icon: PackageSearch,
    status: kycComplete ? "current" : "upcoming",
  },
  {
    id: "delivery",
    title: "Delivery & Setup",
    description: "Free delivery and installation at your door.",
    icon: Truck,
    status: "upcoming",
  },
  {
    id: "starts",
    title: "Rental Starts",
    description: "Your flexible tenure officially begins.",
    icon: CalendarCheck,
    status: "upcoming",
  },
  {
    id: "support",
    title: "Ongoing Support",
    description: "Free maintenance included.",
    icon: Wrench,
    status: "upcoming",
  },
];

const NextSteps = ({ kycComplete = false }) => {
  const steps = buildSteps(kycComplete);

  return (
    <div className="w-full bg-card border border-border rounded-2xl p-6 md:p-8 shadow-soft my-8">
      <h3 className="text-lg font-bold text-foreground mb-6">What happens next?</h3>

      <div className="relative">
        {/* Connector line */}
        <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-border md:left-4 md:right-4 md:top-[27px] md:bottom-auto md:h-0.5 md:w-auto" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 md:gap-4 relative z-10">
          {steps.map((step) => {
            const Icon = step.icon;
            const isDone = step.status === "done";
            const isCurrent = step.status === "current";

            return (
              <div
                key={step.id}
                className={`flex md:flex-col items-start md:items-center gap-4 md:gap-3 ${
                  isCurrent ? "md:flex-[1.4]" : "flex-1"
                }`}
              >
                {/* Node */}
                <div
                  className={`rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                    isCurrent
                      ? "w-14 h-14 bg-primary border-primary text-white shadow-lg shadow-primary/30 ring-4 ring-primary/15 animate-pulse"
                      : isDone
                      ? "w-10 h-10 bg-success border-success text-white shadow-md shadow-success/20"
                      : "w-10 h-10 bg-background border-border text-muted-foreground"
                  }`}
                >
                  {isDone ? (
                    <Check className="w-5 h-5 stroke-[3px]" />
                  ) : (
                    <Icon className={isCurrent ? "w-7 h-7" : "w-5 h-5"} />
                  )}
                </div>

                {/* Text */}
                <div className={`md:text-center mt-1 md:mt-0 ${isCurrent ? "md:max-w-[220px]" : "md:max-w-[140px]"} md:mx-auto`}>
                  {isCurrent && (
                    <span className="inline-block mb-1.5 text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                      {step.currentBadge || "In Progress"}
                    </span>
                  )}
                  <h4
                    className={`font-bold ${
                      isCurrent
                        ? "text-base md:text-lg text-primary"
                        : isDone
                        ? "text-sm text-foreground"
                        : "text-sm text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p
                    className={`mt-1 leading-relaxed mx-auto ${
                      isCurrent ? "text-xs text-foreground/80 font-medium" : "text-[11px] text-muted-foreground"
                    }`}
                  >
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
