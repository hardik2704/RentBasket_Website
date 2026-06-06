import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ShieldCheck, FileCheck2, ArrowRight, CheckCircle2 } from "lucide-react";
import logo from "@/assets/7 1.png";
import SuccessHero from "@/components/success/SuccessHero";
import NextSteps from "@/components/success/NextSteps";
import BookingSummary from "@/components/success/BookingSummary";
import { IncludedBenefits, SuccessSupport, SuccessFAQ } from "@/components/success/SuccessSupport";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const kycComplete = Boolean(location.state?.kycComplete);

  useEffect(() => {
    // If we have state from checkout, use it. Otherwise, use mock data for direct visits/testing.
    if (location.state && location.state.orderData) {
      setOrderData(location.state.orderData);
    } else {
      // Create comprehensive mock data if accessed directly
      setOrderData({
        orderId: `RB-${Math.floor(Math.random() * 90000) + 10000}`,
        bookingDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        deliveryDate: new Date(Date.now() + 86400000 * 2).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        deliverySlot: "Morning (9 AM - 1 PM)",
        customerDetails: {
          name: "Rahul Sharma",
          phone: "+91 99588 58473",
          email: "rahul@example.com"
        },
        deliveryAddress: "Flat 402, Block B, Silver Oaks, Sector 45, Near Huda City Center, Gurgaon, Haryana, 122001",
        paymentDetails: {
          method: "UPI",
          transactionId: "TXN849302847",
          status: "Successful"
        },
        items: [
          {
            name: "Fully Automatic Top Load Washing Machine",
            image: "https://rentbasket.in/wp-content/uploads/2022/10/washing-machine-6.5kg-750x750.png",
            durationLabel: "6 Months",
            quantity: 1,
            price: 1099
          }
        ],
        totalRent: 1499,
        itemSavings: 400,
        coupon: 0,
        baseRent: 1099,
        gst: 198,
        netMonthlyRent: 1297,
        security: 2000,
        netFirstMonth: 3297,
        upfront: 1649,
        payOnDelivery: 1648,
        grandTotal: 3297
      });
    }
    
    // Scroll to top on load
    window.scrollTo(0, 0);
  }, [location.state]);

  if (!orderData) return null; // Or a loading spinner

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Navbar */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border py-4">
        <div className="section-container relative">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105">
                <img src={logo} alt="RentBasket logo" className="w-24 md:w-28" />
              </div>
            </Link>
            <div className="flex items-center gap-4 text-sm font-medium">
              <Link to="/catalog" className="text-primary font-bold hover:text-primary/80 transition-colors">
                Browse More
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="section-container pb-20">
        <SuccessHero orderData={orderData} />

        <div className="max-w-4xl mx-auto mt-8">
          {/* KYC gate — required to confirm the order */}
          {!kycComplete ? (
            <div className="mb-8 rounded-2xl border-2 border-primary/30 bg-coral-surface p-5 md:p-6 shadow-soft">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center flex-shrink-0">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base md:text-lg font-bold text-foreground flex items-center gap-2">
                    Action required: Complete your KYC
                    <span className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold bg-destructive-muted text-destructive">
                      Pending
                    </span>
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">
                    Upload your Aadhaar (front & back), a selfie, and your property rent agreement.
                    Your order is confirmed as soon as KYC is verified.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/kyc", { state: { orderData } })}
                  className="gradient-coral px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-primary/25 transition-all hover:opacity-95 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Complete KYC
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-8 rounded-2xl border border-success-border bg-success-muted p-5 md:p-6 shadow-soft flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-success text-white flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-success-muted-foreground flex items-center gap-2">
                  KYC Verified — Order Confirmed
                  <ShieldCheck className="w-4 h-4" />
                </h3>
                <p className="text-xs md:text-sm text-success-muted-foreground/80 mt-1 leading-relaxed">
                  Thanks! Your documents are verified and our team will coordinate delivery shortly.
                </p>
              </div>
            </div>
          )}

          <NextSteps kycComplete={kycComplete} />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-12">
            {/* Left Column: Summary and Support */}
            <div className="lg:col-span-7 space-y-8">
              <BookingSummary orderData={orderData} />
            </div>
            
            {/* Right Column: Benefits and Cross-sell */}
            <div className="lg:col-span-5 h-full">
              <div className="sticky top-24">
                <IncludedBenefits />
                <SuccessSupport />
              </div>
            </div>
          </div>

          <SuccessFAQ />
          
        </div>
      </main>
    </div>
  );
};

export default OrderSuccess;
