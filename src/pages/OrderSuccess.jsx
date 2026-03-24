import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import logo from "@/assets/7 1.png";
import SuccessHero from "@/components/success/SuccessHero";
import NextSteps from "@/components/success/NextSteps";
import BookingSummary from "@/components/success/BookingSummary";
import { IncludedBenefits, SuccessSupport, SuccessFAQ } from "@/components/success/SuccessSupport";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);

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
            price: 1099,
            hasSurcharge: false
          }
        ],
        subtotalRent: 1099,
        totalDeposit: 1500,
        totalSurcharge: 0,
        grandTotal: 2599
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
              <Link to="/catalog" className="hidden sm:block text-muted-foreground hover:text-primary transition-colors">
                Browse More
              </Link>
              <Link to="/account/orders" className="text-primary font-bold hover:underline transition-all">
                My Orders
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="section-container pb-20">
        <SuccessHero orderData={orderData} />
        
        <div className="max-w-4xl mx-auto mt-8">
          <NextSteps />
          
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
