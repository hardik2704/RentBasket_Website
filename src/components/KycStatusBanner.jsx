import { useNavigate } from "react-router-dom";
import { FileCheck2, Clock, ShieldCheck, ChevronRight } from "lucide-react";

/**
 * The single KYC status banner used across the app (Profile, Account Details,
 * Order Success). Renders one of three states from `kycStatus`:
 *
 *   "none"      → coral  "Complete your KYC" / Pending  → /kyc
 *   "submitted" → amber  "KYC Under Review" / Processing → /kyc?view
 *   "verified"  → green  "KYC Verified"                  → /kyc?view
 *
 * The whole card is the tap target. The status badge sits in the top-right
 * corner; a chevron sits on the right. Keep every page rendering THIS component
 * so the banners can't drift apart again.
 *
 * Props:
 *   kycStatus  "none" | "submitted" | "verified" — anything else renders nothing
 *   size       "compact" (default) | "prominent" — prominent is larger (used as
 *              the post-checkout hero CTA on Order Success)
 *   orderData  optional — threaded into navigation state so /kyc and the return
 *              trip keep the order context
 *   returnTo   optional — path /kyc's back link should return to. Defaults to
 *              /order-success when omitted (the post-checkout flow); profile
 *              pages pass their own path so back doesn't dump the user on an
 *              empty order page.
 *   className  optional extra classes (e.g. margin overrides)
 */

const VARIANTS = {
  none: {
    Icon: FileCheck2,
    title: "Complete your KYC",
    subtitle: "Required to process your order — tap to verify your identity",
    badge: "Required",
    to: "/kyc",
    view: false,
    card: "border border-red-200 bg-red-50 hover:bg-red-100/70",
    iconBg: "bg-red-500 text-white",
    badgeCls: "bg-red-100 text-red-700",
    chevron: "text-red-700/70",
    titleCls: "text-red-900",
    subtitleCls: "text-red-800/80",
  },
  submitted: {
    Icon: Clock,
    title: "KYC Under Review",
    subtitle: "Tap to view your documents",
    badge: "Processing",
    to: "/kyc",
    view: true,
    card: "border border-amber-200 bg-amber-50 hover:bg-amber-100/70",
    iconBg: "bg-amber-400 text-white",
    badgeCls: "bg-amber-100 text-amber-700",
    chevron: "text-amber-700/70",
    titleCls: "text-amber-900",
    subtitleCls: "text-amber-800/80",
  },
  verified: {
    Icon: ShieldCheck,
    title: "KYC Verified",
    subtitle: "Tap to view your documents",
    badge: null,
    to: "/kyc",
    view: true,
    card: "border border-success-border bg-success-muted hover:bg-success-muted/70",
    iconBg: "bg-success text-white",
    badgeCls: "",
    chevron: "text-success-muted-foreground/70",
    titleCls: "text-success-muted-foreground",
    subtitleCls: "text-success-muted-foreground/80",
  },
};

const KycStatusBanner = ({ kycStatus, size = "compact", orderData, returnTo, className = "" }) => {
  const navigate = useNavigate();
  const v = VARIANTS[kycStatus];
  if (!v) return null;

  const prominent = size === "prominent";
  const { Icon } = v;

  const handleClick = () => {
    const state = {};
    if (orderData) state.orderData = orderData;
    if (v.view) state.view = true;
    // Tell /kyc where its back link should go. Without this, KYC defaults to
    // /order-success — wrong when the user opened it from a profile page with
    // no order in flight.
    if (returnTo) state.returnTo = returnTo;
    navigate(v.to, Object.keys(state).length ? { state } : undefined);
  };

  return (
    <button
      onClick={handleClick}
      className={`relative w-full text-left rounded-2xl transition-colors active:scale-[0.99] ${v.card} ${
        prominent ? "p-5 md:p-6 shadow-soft" : "p-4 md:p-5"
      } ${className}`}
    >
      {v.badge && (
        <span className={`absolute top-2.5 right-3 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold ${v.badgeCls}`}>
          {v.badge}
        </span>
      )}
      <div className="flex items-center gap-4">
        <div
          className={`rounded-xl ${v.iconBg} flex items-center justify-center flex-shrink-0 ${
            prominent ? "w-12 h-12 md:rounded-2xl" : "w-10 h-10"
          }`}
        >
          <Icon className={prominent ? "w-6 h-6" : "w-5 h-5"} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-bold ${v.titleCls} ${prominent ? "text-base md:text-lg" : "text-sm"}`}>
            {v.title}
          </p>
          <p className={`mt-0.5 ${v.subtitleCls} ${prominent ? "text-xs md:text-sm" : "text-xs"}`}>
            {v.subtitle}
          </p>
        </div>
        <ChevronRight className={`shrink-0 ${v.chevron} ${prominent ? "w-5 h-5" : "w-4 h-4"}`} />
      </div>
    </button>
  );
};

export default KycStatusBanner;
