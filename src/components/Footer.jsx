import { MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/7 1.png";

const Footer = () => {
  return (
    <footer className="bg-background">
      {/* Wave decoration */}
      <div className="h-6 bg-gradient-to-b from-secondary to-transparent" />

      <div className="section-container pt-2 pb-8">
        {/* Brand */}
        <div className="mb-10 text-center">
          <h3 className="font-bold text-lg mb-1 font-sans">RentBasket</h3>
          <p className="text-sm text-muted-foreground font-sans leading-relaxed">
            Comfort for your home,<br />without the hassle of ownership.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 w-full">
          {/* Quick Links & Policies */}
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-sm mb-4 font-sans">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/catalog"
                    className="hover:text-primary transition-colors font-sans"
                  >
                    Browse Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-primary transition-colors font-sans"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faqs"
                    className="hover:text-primary transition-colors font-sans"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms-n-conditions"
                    className="hover:text-primary transition-colors font-sans"
                  >
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shipping-returns"
                    className="hover:text-primary transition-colors font-sans"
                  >
                    Shipping &amp; Returns
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-primary transition-colors font-sans"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Office Locations */}
          <div className="space-y-6 ml-auto w-fit">
            {/* Gurgaon */}
            <div>
              <h4 className="font-bold text-sm mb-2 font-sans">
                Gurgaon Office
              </h4>
              <div className="text-sm text-muted-foreground space-y-2">
                <Link
                  to="/contact"
                  className="flex items-start gap-2 hover:text-primary transition-colors group"
                >
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 group-hover:text-primary" />
                  <span className="text-left leading-snug font-sans">
                    C9/2, Lower Ground Floor,<br />
                    Ardee City, Sector 52,<br />
                    Gurugram, Haryana 122003
                  </span>
                </Link>
                <a
                  href="tel:+919958858473"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="font-sans">+91 9958858473</span>
                </a>
              </div>
            </div>

            {/* Noida */}
            <div>
              <h4 className="font-bold text-sm mb-2 font-sans">Noida Office</h4>
              <div className="text-sm text-muted-foreground space-y-2">
                <Link
                  to="/contact"
                  className="flex items-start gap-2 hover:text-primary transition-colors group"
                >
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 group-hover:text-primary" />
                  <span className="text-left leading-snug font-sans">
                    Plot No B.L.K 15, Basement,<br />
                    Sector 116, Noida,<br />
                    UP 201301
                  </span>
                </Link>
                <a
                  href="tel:+919958004438"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="font-sans">+91 9958004438</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Social Icons & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center sm:text-left font-sans order-2 sm:order-1">
            © 2026 RentBasket. All rights reserved.
          </p>
          <div className="order-1 sm:order-2 shrink-0">
            <img
              src={logo}
              alt="RentBasket mascot"
              className="w-16 h-16 md:w-20 md:h-20 object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
