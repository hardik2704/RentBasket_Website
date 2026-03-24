import { ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center">
      <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6 relative">
        <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-lg">🛒</span>
        </div>
      </div>
      <h2 className="text-xl md:text-2xl font-display font-bold mb-2">
        Your cart is empty
      </h2>
      <p className="text-sm md:text-base text-muted-foreground max-w-md mb-8 leading-relaxed">
        Explore furniture and appliances for flexible rental durations — from 1
        day to 12 months. Free delivery, installation, and maintenance included.
      </p>
      <Link
        to="/catalog"
        className="btn-primary py-3 px-8 text-sm md:text-base inline-flex items-center gap-2"
        style={{
          background:
            "linear-gradient(89.03deg, #D72F26 -14.8%, #EF1040 50.11%, #FECC87 129.44%)",
        }}
      >
        Browse Catalogue
        <ArrowRight className="w-4 h-4" />
      </Link>
      <p className="text-xs text-muted-foreground mt-4">
        Have a question?{" "}
        <a href="tel:+919958858473" className="text-primary hover:underline">
          Call us at +91 9958858473
        </a>
      </p>
    </div>
  );
};

export default EmptyCart;
