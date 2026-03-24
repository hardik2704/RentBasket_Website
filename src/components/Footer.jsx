import { MapPin, Phone } from "lucide-react";
import logo from "@/assets/7 1.png";

const Footer = () => {
  return (
    <footer className="bg-background border-none">
      {/* Wave decoration */}
      <div className="h-24 bg-gradient-to-b from-secondary to-transparent"></div>

      <div className="section-container py-12">
        {/* Brand */}
        <div className="gap-2 pl-12 lg:pl-28 mb-6">
          <h3 className="font-bold text-lg mb-2 font-sans">RentBasket</h3>
          <p className="text-sm text-muted-foreground pb-2 font-sans">
            Comfort for your home
          </p>
          <p className="text-sm text-muted-foreground pb-2 font-sans">
            without the hassle of ownership.
          </p>
        </div>
        <div
          className="grid grid-cols-2 gap-3"
          style={{
            width: "90%",
            margin: "auto",
            paddingLeft: "5%",
          }}
        >
          <div className="space-y-6">
            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-sm mb-4 font-sans">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors font-sans"
                  >
                    Browse Products
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors font-sans"
                  >
                    Combo Deals
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors font-sans"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors font-sans"
                  >
                    About Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Office Locations */}
          <div className="space-y-6">
            {/* Gurgaon */}
            <div>
              <h4 className="font-bold text-sm mb-2 font-sans">
                Gurgaon Office
              </h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 font-sans" />
                  Sector 52, Ardee City
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 font-sans" />
                  +91 9958858473
                </p>
              </div>
            </div>

            {/* Noida */}
            <div>
              <h4 className="font-bold text-sm mb-2 font-sans">Noida Office</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 font-sans" />
                  Sector 116
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 font-sans" />
                  +91 9958004438
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Icons & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-12 pt-8 border-t border-border">
          <div className="flex items-center gap-4 w-full">
            <p className="flex justify-center text-sm text-muted-foreground w-full m-auto font-sans">
              © 2025 RentBasket. All rights reserved.
            </p>
            <div
              className="w-8 h-8"
              style={{ position: "fixed", right: 5, bottom: 5 }}
            >
              <img
                src={logo}
                alt="RentBasket mascot"
                className="w-24 md:w-32 hidden md:block"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
