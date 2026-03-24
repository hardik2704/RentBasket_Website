import { CreditCard, Smartphone, Landmark, Wallet, ShieldCheck, Check } from "lucide-react";

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI (Google Pay, PhonePe)", icon: Smartphone, description: "Instant payment using any UPI app" },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard, description: "All major cards supported" },
  { id: "netbanking", label: "Net Banking", icon: Landmark, description: "Over 50+ banks available" },
  { id: "wallet", label: "Digital Wallets", icon: Wallet, description: "Paytm, Mobikwik, and more" },
];

const CheckoutPayment = ({ selectedMethod, onSelect }) => {
  return (
    <div className="w-full mb-8">
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
        <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between bg-primary/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-foreground">Payment Method</h3>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">Secure and encrypted transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Safe</span>
          </div>
        </div>

        <div className="p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;

              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => onSelect(method.id)}
                  className={`relative flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                    isSelected
                      ? "border-primary bg-primary/[0.03] ring-1 ring-primary/20"
                      : "border-border bg-background hover:border-primary/30 hover:bg-secondary/20"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                    isSelected ? "bg-primary text-white border-primary" : "bg-secondary/50 text-muted-foreground border-border"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>
                      {method.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                      {method.description}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white shadow-sm">
                      <Check className="w-3 h-3 stroke-[3px]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col items-center justify-center border-t border-border/50 pt-5 text-center">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">PCI-DSS Secure Payment Gateway</p>
            </div>
            <p className="text-[10px] text-muted-foreground max-w-sm">
              By placing this order, you agree to our <a href="#" className="underline hover:text-primary">Rental Terms</a> and <a href="#" className="underline hover:text-primary">Refund Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPayment;
