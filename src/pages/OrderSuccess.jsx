import { useEffect } from "react";
import { useLocation, Navigate, Link } from "react-router-dom";
import logo from "@/assets/7 1.png";
import SuccessHero from "@/components/success/SuccessHero";
import NextSteps from "@/components/success/NextSteps";
import BookingSummary from "@/components/success/BookingSummary";
import { IncludedBenefits, SupportHelp, SupportManage, SuccessFAQ } from "@/components/success/SuccessSupport";
import KycStatusBanner from "@/components/KycStatusBanner";
import { useKycStatus } from "@/hooks/useKycStatus";

const OrderSuccess = () => {
  const location = useLocation();
  const orderData = location.state?.orderData ?? null;
  const hasMoreGroups = Boolean(location.state?.hasMoreGroups);

  // Optimistic seed from nav state — shows the right banner the instant you
  // arrive straight from KYC, before any fetch. kycComplete = all docs verified
  // (auto-redirect path); kycSubmitted = docs just uploaded, awaiting review.
  const navSeed = location.state?.kycComplete ? "verified"
    : location.state?.kycSubmitted ? "submitted"
    : null;

  // Single shared source of truth (cached + live), same as every other surface.
  // The live/cached value wins once known; until then we fall back to the nav
  // seed so a fresh post-checkout arrival isn't briefly blank.
  const { kycStatus: liveStatus } = useKycStatus();
  const kycStatus = liveStatus ?? navSeed ?? "none";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // No order in the navigation state — a direct/bookmarked visit (the route is
  // prerendered so SPA refreshes don't 404). Never fabricate an order: send a
  // KYC-return without order context to their orders, anyone else home.
  if (!orderData) return <Navigate to={kycStatus !== "none" ? "/account/orders" : "/"} replace />;

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Navbar */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border py-4">
        <div className="section-container relative">
          <div className="flex items-center justify-between">
            {/* The logo is the only (intentionally low-emphasis) way off this
                page — no explicit "Browse More" link — so the user is nudged
                toward completing KYC without being trapped. */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105">
                <img src={logo} alt="RentBasket logo" className="w-24 md:w-28" />
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="section-container pb-20 bg-[#FAF9F6]/70 min-h-screen">
        {/* The KYC banner renders inside the hero, between the WhatsApp notice and
            the "Continue Browsing" CTA. orderData is threaded so /kyc and the
            return trip keep order context. */}
        <SuccessHero
          orderData={orderData}
          hasMoreGroups={hasMoreGroups}
          kycStatus={kycStatus}
          kycBanner={<KycStatusBanner kycStatus={kycStatus} size="prominent" orderData={orderData} />}
        />

        <div className="max-w-4xl mx-auto mt-8">
          <NextSteps kycStatus={kycStatus} />
          
          <div className="my-12 space-y-8">
            <BookingSummary orderData={orderData} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <IncludedBenefits />
              <SupportHelp />
              <SupportManage />
            </div>
          </div>

          <SuccessFAQ />
          
        </div>
      </main>
    </div>
  );
};

export default OrderSuccess;
