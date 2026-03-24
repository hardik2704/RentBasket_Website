import { CheckCircle2, ChevronRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const SuccessHero = ({ orderData }) => {
  return (
    <div className="w-full flex flex-col items-center text-center py-8">
      {/* Checkmark Illustration */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-green-500 blur-[32px] rounded-full opacity-20" />
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl shadow-green-500/20 relative z-10">
          <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-white" />
        </div>
      </div>

      {/* Hero Text */}
      <h1 className="text-2xl md:text-4xl font-black text-foreground tracking-tight mb-3">
        Your order has been confirmed
      </h1>
      <p className="text-sm md:text-base text-muted-foreground font-medium max-w-lg mx-auto leading-relaxed">
        Thank you for choosing RentBasket. Your rental booking has been successfully placed, and our team will coordinate the delivery and setup with you shortly.
      </p>

      {/* Order Reference Block */}
      <div className="mt-8 bg-card border border-border rounded-2xl p-5 md:p-6 w-full max-w-md shadow-soft">
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-left">
          <div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Booking ID</p>
            <p className="text-sm font-black text-foreground">{orderData.orderId}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Date</p>
            <p className="text-sm font-bold text-foreground">{orderData.bookingDate}</p>
          </div>
          <div className="col-span-2 pt-4 border-t border-border/50 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Payment Status</p>
              <div className="flex items-center gap-1.5 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-bold">Successful</span>
              </div>
            </div>
            <button className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
              <FileText className="w-3.5 h-3.5" />
              Invoice
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Banner */}
      <div className="mt-6 flex items-center gap-3 bg-[#E8F8F5] text-[#1D8348] px-4 py-3 rounded-xl border border-[#D5F5E3] text-xs font-medium max-w-md w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-5 h-5 fill-current">
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 413.2c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 334.6l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
        </svg>
        <span className="flex-1 text-left">You will receive booking updates on WhatsApp.</span>
      </div>

      {/* Primary CTAs */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link 
          to="/account/orders" 
          className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm shadow-md shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-95 flex items-center justify-center gap-2 bg-primary"
        >
          Track Order
        </Link>
        <Link 
          to="/catalog" 
          className="flex-1 py-3.5 rounded-xl text-foreground font-bold text-sm shadow-sm transition-all hover:bg-secondary active:scale-95 flex items-center justify-center gap-2 border border-border bg-card"
        >
          Continue Browsing
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default SuccessHero;
