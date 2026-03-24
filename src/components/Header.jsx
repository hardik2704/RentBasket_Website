import logo from "@/assets/7 1.png";

const Header = () => {
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
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src={logo}
                alt="RentBasket mascot"
                className="w-24 md:w-32 md:block"
              />
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="/catalog"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Browse Catalog
            </a>
            <div className="relative">
              <input
                type="text"
                placeholder="Search furniture, appliances..."
                className="w-80 px-4 py-2 border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-3">
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
