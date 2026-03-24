import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ShieldCheck, Truck, Clock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutProgress from "@/components/checkout/CheckoutProgress";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutPayment from "@/components/checkout/CheckoutPayment";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
      toast.error("Your cart is empty", {
        description: "Add some items before checking out.",
      });
    }
  }, [cartItems, navigate]);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
    startDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0], // Default to +2 days
    timeSlot: "Morning",
    instructions: "",
    paymentMethod: "upi",
  });

  const handlePlaceOrder = () => {
    // Basic validation
    if (!formData.fullName || !formData.phone || !formData.addressLine1 || !formData.pincode) {
      toast.error("Please fill required fields", {
        description: "Name, Mobile, and Address are mandatory.",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      // Build the order data payload
      const subtotalRent = cartItems.reduce((sum, item) => sum + (item.price - (item.isBrandNew ? 65 : 0)) * item.quantity, 0);
      const totalDeposit = cartItems.reduce((sum, item) => sum + item.deposit, 0);
      const totalSurcharge = cartItems.reduce((sum, item) => sum + (item.isBrandNew ? 65 * item.quantity : 0), 0);
      
      const orderPayload = {
        orderId: `RB-${Math.floor(Math.random() * 90000) + 10000}`,
        bookingDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        deliveryDate: new Date(formData.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        deliverySlot: formData.timeSlot,
        customerDetails: {
          name: formData.fullName,
          phone: formData.phone,
          email: formData.email
        },
        deliveryAddress: `${formData.addressLine1}, ${formData.addressLine2}, ${formData.city}, ${formData.state}, ${formData.pincode}`,
        paymentDetails: {
          method: formData.paymentMethod.toUpperCase(),
          transactionId: `TXN${Math.floor(Math.random() * 900000) + 100000}`,
          status: "Successful"
        },
        items: cartItems,
        subtotalRent,
        totalDeposit,
        totalSurcharge,
        grandTotal: subtotalRent + totalDeposit + totalSurcharge
      };

      clearCart();
      toast.success("Order placed successfully!", {
        description: "Your rental order has been confirmed. Redirecting...",
      });
      
      setTimeout(() => navigate("/order-success", { state: { orderData: orderPayload } }), 1000);
    }, 2500);
  };

  if (cartItems.length === 0) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <CheckoutHeader />
      
      <main className="section-container mt-4 md:mt-6">
        {/* Breadcrumb / Back Link */}
        <div className="mb-6 md:mb-8">
          <Link 
            to="/cart" 
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Review Cart
          </Link>
          <div className="mt-4">
            <h1 className="text-2xl md:text-4xl font-black text-foreground tracking-tight">
              Checkout
            </h1>
            <p className="text-[11px] md:text-sm text-muted-foreground font-medium mt-1">
              Finalize your rental details and confirm your delivery.
            </p>
          </div>
        </div>

        <CheckoutProgress currentStep="checkout" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mt-4 md:mt-8">
          {/* Main Form Area */}
          <div className="lg:col-span-12 xl:col-span-8 space-y-2">
            
            {/* Trust Banner - Top of Column */}
            <div className="flex flex-wrap items-center gap-4 bg-primary/5 border border-primary/10 rounded-2xl p-4 mb-8">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-wider">Secured Rental</span>
              </div>
              <div className="h-4 w-px bg-primary/20 hidden md:block" />
              <div className="flex items-center gap-2 text-muted-foreground">
                <Truck className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Free Delivery & Setup</span>
              </div>
              <div className="h-4 w-px bg-primary/20 hidden md:block" />
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">24/48 Hr Installation</span>
              </div>
            </div>

            <CheckoutForm formData={formData} setFormData={setFormData} />
            
            <CheckoutPayment 
              selectedMethod={formData.paymentMethod} 
              onSelect={(method) => setFormData(prev => ({ ...prev, paymentMethod: method }))} 
            />

            {/* Bottom Note */}
            <p className="text-xs text-muted-foreground text-center py-4 bg-secondary/20 rounded-2xl border border-dashed border-border/50 font-medium">
              Need help with your order? <a href="tel:+919958858473" className="text-primary font-bold hover:underline">Chat with us</a> for instant setup support.
            </p>
          </div>

          {/* Sticky Summary */}
          <div className="lg:col-span-12 xl:col-span-4">
            <CheckoutSummary onPlaceOrder={handlePlaceOrder} isProcessing={isProcessing} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
