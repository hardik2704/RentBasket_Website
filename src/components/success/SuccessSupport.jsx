import { CheckCircle2, Phone, MessageCircle, HelpCircle, Download, FileText, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export const IncludedBenefits = () => (
  <div className="bg-green-600 rounded-2xl p-6 text-white shadow-xl shadow-green-600/20 mb-8 relative overflow-hidden">
    <div className="relative z-10">
      <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-green-100">
        Included with your rental
      </h4>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {[
          "Free Delivery",
          "Free Installation",
          "Free Maintenance",
          "Flexible Duration",
          "Return Anytime",
        ].map((benefit) => (
          <div key={benefit} className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-300" />
            <span className="text-sm font-bold text-white">{benefit}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
  </div>
);

export const SuccessSupport = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    {/* Help / Support Block */}
    <div className="bg-card border border-border rounded-2xl p-6 shadow-soft hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-base font-bold text-foreground">Need Help?</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">We're here to assist with your order.</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
        Our support team can help coordinate delivery timings, answer rental queries, or assist with installation.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <a href="tel:+919958858473" className="flex-1 py-2.5 px-4 rounded-xl text-primary font-bold text-xs bg-primary/5 hover:bg-primary/10 transition-colors flex items-center justify-center gap-2 border border-primary/10">
          <Phone className="w-3.5 h-3.5" /> Call Us
        </a>
        <a href="https://wa.me/919958858473" target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 px-4 rounded-xl text-green-700 font-bold text-xs bg-green-50 hover:bg-green-100 transition-colors flex items-center justify-center gap-2 border border-green-200">
          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
        </a>
      </div>
    </div>

    {/* App CTA / Manage Order */}
    <div className="bg-card border border-border rounded-2xl p-6 shadow-soft hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center text-foreground border border-border">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-base font-bold text-foreground">Manage Order</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">Track and maintain your rentals.</p>
        </div>
      </div>
      <ul className="space-y-2 mb-5">
        {["View detailed invoice", "Track service requests", "Extend rental duration"].map((item, i) => (
          <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary" /> {item}
          </li>
        ))}
      </ul>
      <div className="flex gap-3">
        <button className="flex-1 py-2.5 px-4 rounded-xl text-foreground font-bold text-xs bg-secondary/30 hover:bg-secondary/60 transition-colors border border-border flex items-center justify-center gap-2">
          <Download className="w-3.5 h-3.5" /> Get App
        </button>
      </div>
    </div>
  </div>
);

export const SuccessFAQ = () => (
  <div className="bg-background rounded-2xl py-8 mb-12 border-t border-border/50">
    <h3 className="text-lg font-bold text-foreground text-center mb-6">Frequently Asked Questions</h3>
    <div className="max-w-2xl mx-auto space-y-4">
      {[
        { q: "When will I receive delivery confirmation?", a: "Our team will contact you within 24 hours to confirm the exact delivery slot for your requested date." },
        { q: "Is the security deposit entirely refundable?", a: "Yes, 100% of your security deposit is refunded when the items are successfully returned at the end of your tenure." },
        { q: "How do I raise a service request?", a: "You can raise a free maintenance request directly via the RentBasket app or by calling our support line." }
      ].map((faq, i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-4">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-primary" /> {faq.q}
          </h4>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed ml-6">{faq.a}</p>
        </div>
      ))}
    </div>
  </div>
);
