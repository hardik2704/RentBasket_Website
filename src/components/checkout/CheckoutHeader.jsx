import logo from "@/assets/7 1.png";
import { PhoneCall, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const CheckoutHeader = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border py-4">
      <div className="section-container relative">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src={logo}
                alt="RentBasket mascot"
                className="w-24 md:w-28"
              />
            </div>
          </Link>

          {/* Secure Trust Badge (Center-rightish on desktop) */}
          <div className="hidden md:flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Secure Checkout</span>
          </div>

          {/* Support */}
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none mb-1">Need Help?</span>
              <a href="tel:+919958858473" className="text-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5" />
                +91 99588 58473
              </a>
            </div>
            
            {/* Back to Cart link */}
            <Link 
              to="/cart" 
              className="px-4 py-2 rounded-xl text-primary font-bold hover:bg-primary/5 transition-colors border border-primary/20"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CheckoutHeader;
