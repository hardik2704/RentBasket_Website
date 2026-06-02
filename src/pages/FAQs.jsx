import { useState } from "react";
import { ChevronDown, HelpCircle, Phone, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const faqs = [
  {
    q: "How does the rental booking process work?",
    a: "Booking with RentBasket is simple. Browse our catalogue, select your desired products and rental duration, and add them to your basket. When you click checkout, fill in your address and delivery details. Since this is V1, you will be redirected to WhatsApp with your itemized quote to confirm the details. You pay 50% upfront to confirm the booking, and the remaining 50% upon delivery."
  },
  {
    q: "What KYC verification is required before delivery?",
    a: "To ensure safety and secure transactions, we require: (1) A valid Government Photo ID (Aadhaar Card, PAN Card, or Passport) and (2) Address proof of your new residence (registered Rent Agreement, Utility Bill, or Company Joining/Relocation Letter). Our verification team will review these before dispatching your products."
  },
  {
    q: "How is the security deposit calculated and refunded?",
    a: "The refundable security deposit is calculated as a multiple of the product's monthly list rent (typically 2x). It is 100% interest-free and refundable. Once your rental duration ends and the items are picked up, our QA team will inspect the assets. The refund is processed directly to your bank account within 7–10 working days of return."
  },
  {
    q: "Are delivery, installation, and setup free?",
    a: "Yes! Delivery, professional installation, and demo are entirely free for all monthly rentals in our serviceable zones across Gurgaon and Noida (Delhi NCR). Our expert technicians handle the entire heavy lifting and setup."
  },
  {
    q: "What is your policy on damages and normal wear-and-tear?",
    a: "We expect normal wear-and-tear from daily use, such as minor scuffs on wood or slight fabric wear, which incur absolutely zero charges. However, major structural damages, deep burns, severe water damage from negligence, or missing parts are charged. Repair costs will be deducted from your security deposit."
  },
  {
    q: "Is maintenance and repair service free?",
    a: "Yes, all manufacturing defects and functional issues (such as an AC not cooling or a washing machine error code) are fully covered. Simply contact our support, and we will send a technician to repair or replace the item at no cost."
  },
  {
    q: "Can I relocate my rented items if I move?",
    a: "Yes! If you are relocating within our serviceable areas in Gurgaon or Noida, RentBasket offers a one-time free relocation service. Our team will safely uninstall, transport, and reinstall your rented items at your new address."
  },
  {
    q: "What is the minimum lock-in period, and can I cancel early?",
    a: "Our minimum rental lock-in period is 3 months. If you wish to cancel and return your items before the end of your selected tenure or before the 3-month mark, a foreclosure fee will be charged based on the standard non-discounted rates or the remaining lock-in period."
  }
];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="section-container py-12 md:py-20 max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-4">
            <HelpCircle className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-display font-semibold text-3xl md:text-4xl text-foreground">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground mt-2 font-sans max-w-lg mx-auto">
            Got questions about deposits, delivery, or damages? We've got you covered.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="border border-border rounded-2xl overflow-hidden bg-card transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none"
                >
                  <span className="text-base font-semibold text-foreground pr-4 font-sans leading-snug">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1">
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-sans">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Contact CTA card */}
        <div className="mt-16 bg-secondary/50 border border-border rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-semibold text-lg sm:text-xl text-foreground">
              Still have questions?
            </h3>
            <p className="text-sm text-muted-foreground font-sans mt-1">
              Our team is ready to assist you with custom requirements or support queries.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <a
              href="tel:+919958858473"
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 h-11 px-5 rounded-full border border-border text-foreground font-sans font-bold text-sm bg-white hover:bg-secondary transition-colors"
            >
              <Phone className="w-4 h-4 text-muted-foreground" />
              Call Gurgaon
            </a>
            <a
              href="https://wa.me/919958858473"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 h-11 px-5 rounded-full text-white font-sans font-bold text-sm bg-[#2E7D32] hover:bg-[#2E7D32]/90 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQs;
