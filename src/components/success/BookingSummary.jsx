import { ShieldCheck, Truck, Wrench, Bookmark, MapPin, CreditCard, User } from "lucide-react";

const BookingSummary = ({ orderData }) => {
  if (!orderData || !orderData.items) return null;

  const { items, subtotalRent, totalDeposit, totalSurcharge, grandTotal, customerDetails, deliveryAddress, paymentDetails } = orderData;

  return (
    <div className="w-full bg-card border border-border rounded-2xl shadow-xl overflow-hidden mb-8">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border/50 bg-secondary/10 flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground">Order Summary</h3>
        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
          {items.length} {items.length === 1 ? "Item" : "Items"}
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* Items List */}
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-4 pb-4 border-b border-border/30 last:border-0 last:pb-0">
              <div className="w-16 h-16 bg-gray-50 rounded-xl border border-border/50 flex-shrink-0 p-1.5">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground line-clamp-1">{item.name}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-muted-foreground font-medium">
                  <span>Duration: {item.durationLabel}</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span>Qty: {item.quantity}</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span>Starts: {orderData.deliveryDate}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-black text-primary">₹{item.price.toLocaleString("en-IN")}/mo</span>
                  {item.hasSurcharge && (
                    <span className="text-[9px] text-primary/70 bg-primary/5 px-2 py-0.5 rounded-full font-bold border border-primary/10 uppercase tracking-widest">
                      Combo Deal
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Breakdown */}
        <div className="bg-secondary/20 rounded-2xl p-5 space-y-3 border border-border/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">Subtotal Rent</span>
            <span className="font-bold">₹{subtotalRent.toLocaleString("en-IN")}/mo</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium flex items-center gap-1.5">
              Security Deposit
              <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
            </span>
            <span className="font-bold">₹{totalDeposit.toLocaleString("en-IN")}</span>
          </div>

          {totalSurcharge > 0 && (
            <div className="flex items-center justify-between text-sm text-primary/80 italic font-medium">
              <span className="flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" />
                Bundle Setup Fees
              </span>
              <span>+₹{totalSurcharge.toLocaleString("en-IN")}/mo</span>
            </div>
          )}

          <div className="pt-3 space-y-2 border-t border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-2 font-medium">
                <Truck className="w-3.5 h-3.5" /> Delivery & Installation
              </span>
              <span className="text-[11px] font-bold text-green-600 uppercase tracking-widest">Free</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-2 font-medium">
                <Wrench className="w-3.5 h-3.5" /> Maintenance & Support
              </span>
              <span className="text-[11px] font-bold text-green-600 uppercase tracking-widest">Included</span>
            </div>
          </div>

          <div className="border-t-2 border-primary/10 pt-4 mt-2">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-base font-bold text-foreground">Total Paid Today</span>
              <span className="text-xl font-black text-primary tracking-tight">
                ₹{grandTotal.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground text-right font-medium">
              *Security deposit is 100% refundable upon return.
            </p>
          </div>
        </div>

        {/* Operational Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Delivery Details */}
          <div className="p-4 rounded-xl border border-border/50 bg-background">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-3 uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-primary" /> Delivery Details
            </h4>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">{customerDetails.name}</p>
              <p className="text-muted-foreground flex items-center gap-1.5 text-xs"><User className="w-3 h-3"/> {customerDetails.phone}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">{deliveryAddress}</p>
              <div className="mt-2 text-[10px] bg-secondary/40 px-2 py-1.5 rounded text-muted-foreground font-medium inline-block">
                Slot: {orderData.deliverySlot}
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-4 rounded-xl border border-border/50 bg-background">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-3 uppercase tracking-wider">
              <CreditCard className="w-3.5 h-3.5 text-primary" /> Payment Info
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium uppercase">{paymentDetails.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-medium text-xs font-mono">{paymentDetails.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invoice</span>
                <span className="font-medium text-green-600 text-xs">Sent to email</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
