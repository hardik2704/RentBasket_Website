import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  CalendarCheck,
  MapPin,
  RotateCcw,
  Headset,
  ShoppingBag,
} from "lucide-react";
import logo from "@/assets/7 1.png";
import { toast } from "sonner";
import products, { DURATION_OPTIONS } from "@/data/products";
import { useCart } from "@/context/CartContext";

/** Pull a real product by id for realistic mock orders. */
const p = (id) => products.find((x) => x.id === id) || {};

const SUPPORT_WHATSAPP = "https://wa.me/919958858473";

/**
 * Mock order history. No backend exists yet — this is static sample data
 * so the page renders a realistic "My Orders" experience.
 */
const MOCK_ORDERS = [
  {
    orderId: "RB-48217",
    status: "active",
    bookingDate: "28 May 2026",
    deliveryDate: "30 May 2026",
    deliverySlot: "Morning (9 AM – 1 PM)",
    address: "Flat 402, Silver Oaks, Sector 45, Gurgaon, Haryana 122001",
    items: [
      { ref: "bed-double-01", durationLabel: "12 Months", quantity: 1, price: 1399 },
      { ref: "wm-top-load-01", durationLabel: "6 Months", quantity: 1, price: 1099 },
    ],
    monthlyRent: 2498,
    deposit: 5500,
    paidToday: 7998,
    renewsOn: "30 Jun 2026",
  },
  {
    orderId: "RB-39654",
    status: "upcoming",
    bookingDate: "02 Jun 2026",
    deliveryDate: "08 Jun 2026",
    deliverySlot: "Evening (4 PM – 8 PM)",
    address: "C-12, DLF Phase 3, Gurgaon, Haryana 122002",
    items: [
      { ref: "sofa-3seat-01", durationLabel: "11 Months", quantity: 1, price: 1199 },
      { ref: "dining-set-01", durationLabel: "11 Months", quantity: 1, price: 1499 },
    ],
    monthlyRent: 2698,
    deposit: 6500,
    paidToday: 9198,
    startsOn: "08 Jun 2026",
  },
  {
    orderId: "RB-21088",
    status: "completed",
    bookingDate: "02 Jan 2026",
    deliveryDate: "04 Jan 2026",
    deliverySlot: "Morning (9 AM – 1 PM)",
    address: "B-7, Sector 116, Noida, UP 201301",
    items: [
      { ref: "fridge-single-01", durationLabel: "3 Months", quantity: 1, price: 749 },
    ],
    monthlyRent: 749,
    deposit: 2000,
    paidToday: 2749,
    returnedOn: "05 Apr 2026",
  },
];

const STATUS_CONFIG = {
  active: {
    label: "Active Rental",
    icon: CalendarCheck,
    badgeClass: "bg-success-muted text-success-muted-foreground border-success-border",
    dot: "bg-success",
  },
  upcoming: {
    label: "Arriving Soon",
    icon: Truck,
    badgeClass: "bg-coral-surface text-primary border-coral-border",
    dot: "bg-primary",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    badgeClass: "bg-secondary/40 text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
};

const FILTERS = [
  { key: "all", label: "All Orders" },
  { key: "upcoming", label: "Upcoming" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

const OrderCard = ({ order }) => {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.completed;
  const StatusIcon = cfg.icon;
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleRentAgain = () => {
    order.items.forEach((item) => {
      const product = p(item.ref);
      const durationKey =
        DURATION_OPTIONS.find((d) => d.label === item.durationLabel)?.key || "1_month";
      addToCart({
        productId: item.ref,
        name: product.name || item.ref,
        duration: durationKey,
        durationLabel: item.durationLabel,
        price: item.price,
        quantity: item.quantity,
        startDate: new Date().toISOString().split("T")[0],
        deposit: product.deposit || 0,
        image: product.image,
        category: product.category,
      });
    });
    toast.success("Added to cart", { description: "Your previous items are ready to rent again." });
    navigate("/cart");
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-soft overflow-hidden">
      {/* Card Header */}
      <div className="px-5 py-4 md:px-6 border-b border-border/50 bg-secondary/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Package className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground leading-tight">
              Order #{order.orderId}
            </p>
            <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
              Booked {order.bookingDate}
            </p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${cfg.badgeClass}`}
        >
          <StatusIcon className="w-3.5 h-3.5" />
          {cfg.label}
        </span>
      </div>

      {/* Items */}
      <div className="p-5 md:p-6 space-y-4">
        {order.items.map((item, idx) => {
          const product = p(item.ref);
          return (
            <div
              key={idx}
              className="flex gap-4 pb-4 border-b border-border/30 last:border-0 last:pb-0"
            >
              <Link
                to={`/product/${item.ref}`}
                className="w-16 h-16 bg-gray-50 rounded-xl border border-border/50 flex-shrink-0 p-1.5 hover:border-primary/30 transition-colors group"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform group-hover:scale-105"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.ref}`}>
                  <p className="text-sm font-bold text-foreground line-clamp-1 hover:text-primary transition-colors">
                    {product.name}
                  </p>
                </Link>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-muted-foreground font-medium">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.durationLabel}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span>Qty: {item.quantity}</span>
                </div>
                <span className="text-sm font-black text-primary mt-1.5 inline-block">
                  ₹{item.price.toLocaleString("en-IN")}/mo
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Meta strip: delivery + pricing */}
      <div className="px-5 md:px-6 pb-5 md:pb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-border/50 bg-background p-3.5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {order.status === "completed"
                ? "Was Delivered To"
                : order.status === "upcoming"
                ? "Delivering To"
                : "Delivery"}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">{order.address}</p>
            <p className="text-[11px] font-medium text-foreground mt-1.5">
              {order.status === "upcoming" ? "Scheduled: " : ""}{order.deliveryDate} · {order.deliverySlot}
            </p>
          </div>
          <div className="rounded-xl border border-border/50 bg-background p-3.5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Billing
            </p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Rent</span>
                <span className="font-bold text-foreground">
                  ₹{order.monthlyRent.toLocaleString("en-IN")}/mo
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deposit (refundable)</span>
                <span className="font-medium text-foreground">
                  ₹{order.deposit.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between pt-1 mt-1 border-t border-border/50">
                <span className="text-muted-foreground font-medium">
                  {order.status === "completed"
                    ? "Returned On"
                    : order.status === "upcoming"
                    ? "Starts On"
                    : "Renews On"}
                </span>
                <span className="font-bold text-foreground">
                  {order.returnedOn || order.startsOn || order.renewsOn}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2.5 pt-1">
          {order.status === "completed" ? (
            <button
              onClick={handleRentAgain}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-primary/30 text-xs font-bold text-primary hover:bg-primary/5 transition-colors active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Rent Again
            </button>
          ) : order.status === "upcoming" ? (
            <a
              href={SUPPORT_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-primary/30 text-xs font-bold text-primary hover:bg-primary/5 transition-colors active:scale-95"
            >
              <Truck className="w-3.5 h-3.5" />
              Track Delivery
            </a>
          ) : (
            <a
              href="tel:+919958858473"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-primary/30 text-xs font-bold text-primary hover:bg-primary/5 transition-colors active:scale-95"
            >
              <Headset className="w-3.5 h-3.5" />
              Get Support
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const MyOrders = () => {
  const [filter, setFilter] = useState("all");

  const visibleOrders =
    filter === "all"
      ? MOCK_ORDERS
      : MOCK_ORDERS.filter((o) => o.status === filter);

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Navbar — matches OrderSuccess */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border py-4">
        <div className="section-container">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105">
                <img src={logo} alt="RentBasket logo" className="w-24 md:w-28" />
              </div>
            </Link>
            <Link
              to="/catalog"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Browse More
            </Link>
          </div>
        </div>
      </header>

      <main className="section-container py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest mb-5"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Home
          </Link>

          {/* Heading */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-black font-display text-foreground tracking-tight">
                My Orders
              </h1>
              <p className="text-[11px] md:text-sm text-muted-foreground font-medium">
                Track, manage, and renew your rentals
              </p>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-6 mb-6 -mx-1 px-1">
            {FILTERS.map((f) => {
              const isActive = filter === f.key;
              const count =
                f.key === "all"
                  ? MOCK_ORDERS.length
                  : MOCK_ORDERS.filter((o) => o.status === f.key).length;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                    isActive
                      ? "bg-primary text-white shadow-soft"
                      : "bg-secondary/40 text-muted-foreground hover:bg-secondary/70"
                  }`}
                >
                  {f.label}
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-white/20" : "bg-background"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Orders list / empty state */}
          {visibleOrders.length > 0 ? (
            <div className="space-y-5">
              {visibleOrders.map((order) => (
                <OrderCard key={order.orderId} order={order} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-6 bg-card border border-dashed border-border rounded-2xl">
              <div className="w-16 h-16 rounded-2xl bg-secondary/40 flex items-center justify-center mx-auto mb-4">
                <Package className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">No orders here yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                You don't have any {filter !== "all" ? filter : ""} orders. Browse our
                catalogue and set up your home in minutes.
              </p>
              <Link to="/catalog" className="btn-gradient-coral inline-flex px-6 py-3 text-sm font-semibold">
                Browse Catalogue
              </Link>
            </div>
          )}

          {/* Support footer */}
          <div className="mt-10 text-center text-xs md:text-sm text-muted-foreground py-6 border-t border-border/50">
            Need help with an order?{" "}
            <a href="tel:+919958858473" className="text-primary font-bold hover:underline">
              Call +91 9958858473
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyOrders;
