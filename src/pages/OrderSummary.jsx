import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, MapPin, Calendar, User, Phone, Pencil } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { cartBreakdown } from "@/lib/pricing";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutProgress from "@/components/checkout/CheckoutProgress";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";

const OrderSummary = () => {
  const { cartItems, clearCart, coupon } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const verifiedPhone = location.state?.verifiedPhone || "";
  const formData = location.state?.formData || null;
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Guard: must have a cart, a verified mobile, and submitted details.
  useEffect(() => {
    if (orderPlaced) return;
    if (cartItems.length === 0) {
      navigate("/cart");
    } else if (!verifiedPhone) {
      navigate("/customer-validation");
    } else if (!formData) {
      navigate("/checkout", { state: { verifiedPhone } });
    }
  }, [cartItems, navigate, verifiedPhone, formData, orderPlaced]);

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    // Simulate payment + order creation
    setTimeout(() => {
      setIsProcessing(false);

      const b = cartBreakdown(cartItems, coupon);

      const orderPayload = {
        orderId: `RB-${Math.floor(Math.random() * 90000) + 10000}`,
        bookingDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
        deliveryDate: new Date(formData.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        deliverySlot: formData.timeSlot,
        customerDetails: {
          name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
        },
        deliveryAddress: `${formData.addressLine1}, ${formData.addressLine2}, ${formData.city}, ${formData.state}, ${formData.pincode}`,
        paymentDetails: {
          method: formData.paymentMethod.toUpperCase(),
          transactionId: `TXN${Math.floor(Math.random() * 900000) + 100000}`,
          status: "Successful",
        },
        items: cartItems,
        totalRent: b.totalRent,
        itemSavings: b.itemSavings,
        coupon: b.coupon,
        baseRent: b.netBaseRent,
        gst: b.gst,
        netMonthlyRent: b.netMonthlyRent,
        security: b.security,
        netFirstMonth: b.netFirstMonth,
        upfront: b.upfront,
        payOnDelivery: b.payOnDelivery,
        grandTotal: b.netFirstMonth, // legacy fallback
      };

      setOrderPlaced(true);
      toast.success("Order placed successfully!", {
        description: "Your rental order has been confirmed.",
      });
      // Navigate first, then clear — same tick, so the empty cart never renders.
      navigate("/order-success", { state: { orderData: orderPayload } });
      clearCart();
    }, 2500);
  };

  if (!orderPlaced && (cartItems.length === 0 || !verifiedPhone || !formData)) return null;

  const addressLine = formData
    ? [formData.addressLine1, formData.addressLine2, formData.landmark, formData.city, formData.state, formData.pincode]
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <div className="min-h-screen bg-background pb-20">
      <CheckoutHeader />

      <main className="section-container mt-4 md:mt-6">
        {/* Back to details */}
        <div className="mb-6 md:mb-8">
          <Link
            to="/checkout"
            state={{ verifiedPhone, formData }}
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Edit Details
          </Link>
          <div className="mt-4">
            <h1 className="text-2xl md:text-4xl font-black text-foreground tracking-tight">
              Order Summary
            </h1>
            <p className="text-[11px] md:text-sm text-muted-foreground font-medium mt-1">
              Review your rental, then confirm and pay.
            </p>
          </div>
        </div>

        <CheckoutProgress currentStep="payment" />

        <div className="max-w-xl mx-auto mt-4 md:mt-8 space-y-6">
          {/* Delivery recap */}
          {formData && (
            <div className="bg-card border border-border rounded-2xl shadow-soft overflow-hidden">
              <div className="px-5 py-4 border-b border-border/50 bg-secondary/10 flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Delivering To</h3>
                <Link
                  to="/checkout"
                  state={{ verifiedPhone, formData }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </Link>
              </div>
              <div className="p-5 space-y-3 text-sm">
                <div className="flex items-center gap-2.5 text-foreground">
                  <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="font-semibold">{formData.fullName}</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>+91 {formData.phone}</span>
                </div>
                <div className="flex items-start gap-2.5 text-muted-foreground">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{addressLine}</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Starts{" "}
                    {new Date(formData.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    {" · "}
                    {formData.timeSlot}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Order summary + Confirm & Pay */}
          <CheckoutSummary onPlaceOrder={handlePlaceOrder} isProcessing={isProcessing} />
        </div>
      </main>
    </div>
  );
};

export default OrderSummary;
