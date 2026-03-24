import logo from "@/assets/7 1.png";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";

const Header = () => {
  const { getCartItemCount } = useCart();
  const cartCount = getCartItemCount();

  return (
    <header className="sticky top-0 z-50 bg:transparent  md:bg-background/95 md:backdrop-blur-sm md:border-b border-border">
      <div className="section-container" style={{ width: "100%" }}>
        <div
          className="flex items-center justify-between h-16 md:h-20"
          style={{
            width: "100%",
          }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src={logo}
                alt="RentBasket mascot"
                className="w-24 md:w-32 md:block"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/catalog"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Browse Catalog
            </Link>
            <div className="relative">
              <input
                type="text"
                placeholder="Search furniture, appliances..."
                className="w-80 px-4 py-2 border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </nav>

          {/* Cart + CTA */}
          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="relative p-2 rounded-xl hover:bg-secondary transition-colors"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-muted-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
            <a
              href="#download"
              className="hidden sm:inline-flex btn-outline text-sm py-2 px-4"
            >
              Download App
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
