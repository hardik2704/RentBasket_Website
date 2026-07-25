import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, MapPin, ArrowRight } from "lucide-react";

const GURGAON_NUMBER = "9959858473";
const NOIDA_NUMBER = "9958004438";

const locations = [
  { city: "Gurgaon", number: GURGAON_NUMBER },
  { city: "Noida",   number: NOIDA_NUMBER   },
];

const CheckoutContactModal = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-card w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-elevated overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* ── Gradient header ───────────────────────────── */}
            <div className="gradient-coral px-6 pt-5 pb-10 relative">
              {/* Mobile drag handle */}
              <div className="w-10 h-1 bg-white/40 rounded-full mx-auto mb-5 sm:hidden" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white transition-all active:scale-95"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Icon + label + heading */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-[10px] font-bold uppercase tracking-[0.15em] mb-0.5">
                    One last step
                  </p>
                  <h3 className="font-display text-[1.35rem] font-bold text-white leading-tight">
                    Talk to a consultant
                  </h3>
                </div>
              </div>
            </div>

            {/* ── White body — overlaps header with -mt ─────── */}
            <div className="bg-card -mt-5 rounded-t-3xl px-5 pt-5 pb-6">
              <p className="text-[13px] text-muted-foreground leading-relaxed mb-5">
                Call us to confirm your order. We'll sort delivery, KYC&nbsp;&amp; first payment in&nbsp;5&nbsp;minutes.
              </p>

              {/* Location cards */}
              <div className="flex flex-col gap-3">
                {locations.map(({ city, number }) => (
                  <a
                    key={city}
                    href={`tel:+91${number}`}
                    onClick={() => {
                      onClose();
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }, 320);
                    }}
                    className="group flex items-center gap-4 px-4 py-3.5 rounded-2xl border border-border bg-background hover:border-foreground/35 hover:bg-secondary/40 transition-all duration-200 no-underline"
                  >
                    {/* City icon */}
                    <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center flex-shrink-0 shadow-soft">
                      <MapPin className="w-4 h-4 text-background" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground">{city}</p>
                      <p className="text-xs text-muted-foreground tabular-nums tracking-wide">
                        +91 {number}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="w-8 h-8 rounded-full border border-border group-hover:border-primary/30 group-hover:bg-primary/5 flex items-center justify-center transition-all flex-shrink-0">
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </a>
                ))}
              </div>

              {/* Footer note */}
              <p className="mt-5 text-center text-[11px] text-muted-foreground">
                Currently serving Gurgaon &amp; Noida
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutContactModal;
