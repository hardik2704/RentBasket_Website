import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cartBreakdown } from "@/lib/pricing";

/**
 * Checkout handoff modal.
 *
 * Current flow: there is no self-serve checkout page. Clicking "Checkout" on the
 * cart opens this prompt asking the user to finish the order with our team on
 * WhatsApp. The cart contents are pre-filled into the message so the salesperson
 * sees what the customer wants.
 *
 * ⚠️ TEMPLATE NUMBER — replace WHATSAPP_NUMBER with the real one when provided.
 */
const WHATSAPP_NUMBER = "9999999999"; // 10-digit number, no country code

const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const CheckoutContactModal = ({ open, onClose }) => {
  const { cartItems, coupon } = useCart();

  // Close on Escape
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const whatsappLink = () => {
    const lines = cartItems.map(
      (i) => `• ${i.name} — ${i.durationLabel || i.duration} × ${i.quantity}`
    );
    const b = cartBreakdown(cartItems, coupon);
    const pricingSummary =
      `Monthly Rent: ₹${b.netMonthlyRent.toLocaleString("en-IN")}/mo (incl. GST)\n` +
      `Refundable Security: ₹${b.security.toLocaleString("en-IN")}\n` +
      (b.coupon > 0 ? `Coupon Discount: -₹${b.coupon.toLocaleString("en-IN")}/mo\n` : "") +
      `Total First Month: ₹${b.netFirstMonth.toLocaleString("en-IN")}\n` +
      `Upfront Payment (50%): ₹${b.upfront.toLocaleString("en-IN")}`;

    const message =
      "Hi RentBasket! I'd like to confirm my rental order:\n\n" +
      (lines.length ? lines.join("\n") + "\n\n" : "") +
      pricingSummary + "\n\n" +
      "Please help me complete the booking.";
    return `https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.18 }}
            className="relative bg-card w-full max-w-md rounded-2xl shadow-elevated p-6 md:p-8 text-center"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mx-auto mb-4">
              <WhatsAppIcon className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold mb-2">Finish your order on WhatsApp</h3>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              To confirm your rental and arrange delivery, message us on WhatsApp —
              our team will help you complete the booking.
            </p>

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1faa52] text-white font-semibold py-3.5 transition-colors active:scale-[0.98]"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Chat on WhatsApp
            </a>

            <p className="text-xs text-muted-foreground mt-4">
              Or save our number:{" "}
              <a
                href={`tel:+91${WHATSAPP_NUMBER}`}
                className="font-semibold text-foreground hover:text-primary"
              >
                +91 {WHATSAPP_NUMBER}
              </a>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutContactModal;
