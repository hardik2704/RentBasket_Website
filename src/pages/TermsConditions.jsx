import Footer from "@/components/Footer";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="section-container py-12 md:py-20 max-w-4xl">
        <h1 className="font-display font-semibold text-3xl md:text-4xl text-foreground mb-4">
          Terms &amp; Conditions
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Last updated: June 19, 2026
        </p>

        <div className="space-y-8 text-foreground/90 font-sans leading-relaxed text-[15px] sm:text-base">
          <section className="space-y-3">
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-foreground">
              1. Terms and Termination
            </h2>
            <p>
              The agreement binds both parties throughout the lease period. Clients face a lock-in duration specified in Annexure I and cannot terminate during this window. Early termination within the lock-in period invokes Annexure I penalties.
            </p>
            <p>
              The agreement may extend by mutual consent for minimum one-month periods. Mid-cycle terminations calculate rent proportionally. The contractor may terminate if rent remains unpaid by month-end and may reclaim goods while deciding the security deposit refund independently. Clients may exit anytime with one month's written notice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-foreground">
              2. Payment Modalities
            </h2>
            <p>
              The Client shall be liable to deposit an amount as detailed in the Annexure as a security deposit upon order placement. The contractor covers shipping and delivery charges, though clients pay additional costs such as labour.
            </p>
            <p>
              First-month billing operates on a pro-rata basis from the delivery date; subsequent months follow standard calendar cycles. Rent payment is due by the 7th of each month unless pre-paid annually. Late fees escalate: ₹100 until the 15th, 5% through the 25th, then 10% thereafter, applying only to pending dues.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-foreground">
              3. Security Deposit
            </h2>
            <p>
              The Security Deposit shall be refunded after the Company has taken possession of all the products delivered. Within seven working days from pickup issuance, refunds are processed after deducting damages, unpaid fees, and applicable charges. The deposit excludes monthly subscription fees and covers only potential damage.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-foreground">
              4. Delivery Process
            </h2>
            <p>
              Clients must facilitate vehicle entry and elevator access, informing contractors beforehand about stair-only scenarios; stair-carrying incurs labour fees. Contractors photograph clients with delivered items for documentation purposes.
            </p>
            <p>
              Despite pre-delivery quality checks, clients must inspect items immediately and report any damage to representatives with photographic evidence.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-foreground">
              5. Pick-Up Process
            </h2>
            <p>
              The date of pick-up of goods upon termination of this Agreement shall be mutually agreed upon by both Parties. Client presence at scheduled pickup times is mandatory; absence triggers additional logistic charges.
            </p>
            <p>
              Quality control reports and pickup photographs become agreement components, compared against delivery photos to assess the extent of any damage.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-foreground">
              6. Damage Policy
            </h2>
            <p>
              Clients pay for damage, loss, or theft; irreparable goods cost market price as determined by the contractor. Damage assessment compares delivery photos against pickup inspections using signed quality documents. The Contractor's assessment of damage shall be final.
            </p>
            <p>
              Damage includes scratches or dents affecting wooden furniture structure, tears requiring upholstery replacement, and permanent stains necessitating replacement. Manufacturing defects do not incur charges.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-foreground">
              7. Refund Policy
            </h2>
            <p>
              A list of damages will be provided to the Client by the Contractor's representative following pickup quality checks. Repair costs are deducted from the security deposit, with any remaining balance transferred within seven working days. Early termination requires one month's advance notice and a payment difference based on actual tenure versus contracted terms.
            </p>
            <p>
              Early closure rates: up to 3 months charge full 3-month rent; 3–6 months charge the 3-month rate; 6–9 months charge the 6-month rate; 9–12 months charge the 9-month rate; 12–18 months charge the 12-month rate; 18–24 months charge the 18-month rate. Clients bear early termination pickup and labour expenses.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-foreground">
              8. Maintenance Policy
            </h2>
            <p>
              Contractors maintain electronic appliances throughout the agreement except for damage from mishandling, which clients fund. Complaints receive responses within seven working days. Basic product maintenance occurs throughout the tenure; furniture cleaning (annually) requires a minimum 12-month tenure completion.
            </p>
            <p>
              Maintenance occurs within 3–5 working days; unresolved issues trigger replacement. Clients pay additional costs arising from maintenance or cleaning damage.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-foreground">
              9. Unauthorized Movement of Rented Furniture and Appliances
            </h2>
            <p>
              Movement of any or all products from the delivery address listed in Annexure-I, without the written consent of the Contractor, shall be considered unauthorized and/or illegal. Contractors may immediately terminate agreements, report incidents to law enforcement, levy financial penalties, or pursue damages.
            </p>
            <p>
              Legal disputes fall under local court jurisdiction: Gurugram courts for Haryana, and Noida courts for Uttar Pradesh.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsConditions;
