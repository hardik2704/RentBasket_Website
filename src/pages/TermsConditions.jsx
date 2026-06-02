import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="section-container py-12 md:py-20 max-w-4xl">
        <h1 className="font-display font-semibold text-3xl md:text-4xl text-foreground mb-4">
          Terms &amp; Conditions
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Last updated: June 2, 2026
        </p>

        <div className="space-y-8 text-foreground/90 font-sans leading-relaxed text-[15px] sm:text-base">
          <section className="space-y-3">
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-foreground">
              1. Lease Agreement &amp; Rental Tenure
            </h2>
            <p>
              By renting furniture and appliances from RentBasket, you agree to the terms of this lease agreement. All items are leased for the specific duration selected at checkout (3, 6, 9, or 12 months). 
            </p>
            <p>
              The minimum lock-in period is 3 months. Early termination of the lease before the selected duration or the minimum lock-in period will result in a foreclosure charge equivalent to the rent of the remaining lock-in period or adjustment to the non-discounted monthly rental rate.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-foreground">
              2. Mandatory KYC Verification
            </h2>
            <p>
              To ensure safety and security, every customer must undergo mandatory KYC (Know Your Customer) verification prior to delivery. 
            </p>
            <p>
              You will be requested to submit:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
              <li>A valid Government-issued Photo ID (Aadhaar Card / PAN Card / Passport)</li>
              <li>Proof of current or upcoming local address (Lease Agreement / Utility Bill / Company Joining Letter)</li>
            </ul>
            <p>
              RentBasket reserves the absolute right to cancel any order if the KYC documents are found to be incomplete, falsified, or if the verification check fails.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-foreground">
              3. Refundable Security Deposit
            </h2>
            <p>
              A security deposit is charged for each item added to the cart, calculated as a multiple of the item's standard monthly list rent. 
            </p>
            <p>
              This security deposit is completely interest-free and refundable. It is held as security against any major damage or default in payments and will be refunded within 7–10 working days after the products have been safely returned and inspected at the end of your lease.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-foreground">
              4. Payment Terms &amp; Split Structure
            </h2>
            <p>
              To confirm your order, a 50% split payment of the net first month's total (Net Rent + GST + Security Deposit) is required upfront. The remaining 50% must be paid upon delivery.
            </p>
            <p>
              Subsequent monthly rental invoices are generated on the 1st of every calendar month and must be cleared within 7 days of invoice generation to avoid late payment charges of 18% per annum or service suspension.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-foreground">
              5. Ownership &amp; Usage Rights
            </h2>
            <p>
              All products delivered remain the sole property of RentBasket. The customer is granted a non-transferable right to use the items. Subletting, selling, modifying, or moving the rented assets to a different address without prior written consent from RentBasket is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-foreground">
              6. Serviceability &amp; Delivery Location
            </h2>
            <p>
              We currently service designated areas within Gurgaon and Noida (Delhi NCR). RentBasket reserves the right to refuse service or cancel orders for locations outside our delivery zones.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsConditions;
