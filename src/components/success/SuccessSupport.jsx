import { CheckCircle2, Phone, MessageCircle, HelpCircle, Download, FileText, ChevronRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

export const IncludedBenefits = () => (
  <div className="bg-[#2EB361] rounded-[24px] p-7 text-white shadow-xl shadow-green-600/10 mb-8 relative overflow-hidden">
    <div className="relative z-10">
      <h4 className="text-[15px] font-bold mb-5 uppercase tracking-[0.1em] text-white/90">
        INCLUDED WITH YOUR RENTAL
      </h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        {[
          "Free Delivery",
          "Free Installation",
          "Free Maintenance",
          "Flexible Duration",
          "Return Anytime",
        ].map((benefit) => (
          <div key={benefit} className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center flex-shrink-0">
               <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
            <span className="text-[14px] font-bold text-white">{benefit}</span>
          </div>
        ))}
      </div>
    </div>
    {/* Subtle design element */}
    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
  </div>
);

export const SuccessSupport = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
    {/* Help / Support Block */}
    <div className="bg-white border border-[#F0F0F0] rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#E53935] mb-4">
        <HelpCircle className="w-6 h-6" strokeWidth={2.5} />
      </div>
      
      <h4 className="text-[18px] font-bold text-[#202020]">Need Help?</h4>
      <p className="text-[12px] text-[#808080] mt-1 mb-5">We're here to assist with your order.</p>
      
      <p className="text-[13px] text-[#505050] mb-8 leading-relaxed px-2">
        Our support team can help coordinate delivery timings, answer rental queries, or assist with installation.
      </p>
      
      <div className="flex flex-col w-full gap-3 mt-auto">
        <a href="tel:+919958858473" className="w-full py-3.5 px-4 rounded-2xl text-[#E53935] font-extrabold text-[13px] bg-[#FCECEB] transition-all hover:brightness-95 flex items-center justify-center gap-2">
          <Phone className="w-4 h-4" /> Call Us
        </a>
        <a href="https://wa.me/919958858473" target="_blank" rel="noopener noreferrer" className="w-full py-3.5 px-4 rounded-2xl text-[#2E7D32] font-extrabold text-[13px] bg-[#E8F5E9] transition-all hover:brightness-95 flex items-center justify-center gap-2">
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </a>
      </div>
    </div>

    {/* App CTA / Manage Order */}
    <div className="bg-white border border-[#F0F0F0] rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#202020] mb-4">
        <FileText className="w-6 h-6" />
      </div>

      <h4 className="text-[18px] font-bold text-[#202020]">Manage Order</h4>
      <p className="text-[12px] text-[#808080] mt-1 mb-5">Track and maintain your rentals.</p>
      
      <ul className="w-full space-y-3 mb-8 px-4 text-left">
        {["View detailed invoice", "Track service requests", "Extend rental duration"].map((item, i) => (
          <li key={i} className="text-[13px] text-[#505050] font-medium flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E53935]" /> {item}
          </li>
        ))}
      </ul>
      
      <div className="w-full mt-auto">
        <button className="w-full py-3.5 px-4 rounded-2xl text-[#202020] font-extrabold text-[13px] bg-[#F8F8F8] border border-[#E0E0E0] shadow-sm transition-all hover:bg-white flex items-center justify-center gap-2">
          <Download className="w-4 h-4" /> Get App
        </button>
      </div>
    </div>
  </div>
);

export const SuccessFAQ = () => (
  <div className="bg-[#F8F9FA]/50 rounded-[32px] p-8 md:p-12 mb-12 border border-[#F0F0F0]">
    <div className="max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold text-[#202020] text-center mb-10">Frequently Asked Questions</h3>
      <div className="space-y-4">
        {[
          { q: "When will I receive delivery confirmation?", a: "Our team will contact you within 24 hours to confirm the exact delivery slot for your requested date." },
          { q: "Is the security deposit entirely refundable?", a: "Yes, 100% of your security deposit is refunded when the items are successfully returned at the end of your tenure." },
          { q: "How do I raise a service request?", a: "You can raise a free maintenance request directly via the RentBasket app or by calling our support line." }
        ].map((faq, i) => (
          <div key={i} className="bg-white border border-[#F0F0F0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <h4 className="text-base font-bold text-[#202020] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E53935]/5 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-4 h-4 text-[#E53935]" />
              </div>
              {faq.q}
            </h4>
            <p className="text-[13px] text-[#606060] mt-4 leading-relaxed ml-11">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
