import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, ArrowRight } from "lucide-react";

const locations = [
  { city: "Gurgaon", number: "9959858473" },
  { city: "Noida", number: "9958004438" },
];

/**
 * Homepage contact popup — minimal: a heading and the two consultant call rows
 * (Gurgaon / Noida). Tapping a row dials the number.
 */
const ContactModal = ({ open, onClose }) => {
  // Only portal once mounted — guards against createPortal receiving a null
  // document.body on the first render pass (early render / fast HMR re-render),
  // which throws "Target container is not a DOM element".
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
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
            className="relative bg-card w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-elevated overflow-hidden border-2 border-primary"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Mobile drag handle */}
            <div className="w-10 h-1 bg-border rounded-full mx-auto mt-3 sm:hidden" />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-7 pt-8 pb-7">
              {/* Heading */}
              <h3 className="font-display text-2xl font-bold text-foreground leading-tight pr-8">
                Talk to a consultant
              </h3>
              <p className="text-base text-muted-foreground mt-2 mb-7">
                We're happy to help — give us a call.
              </p>

              {/* Call rows */}
              <div className="flex flex-col gap-3">
                {locations.map(({ city, number }) => (
                  <a
                    key={city}
                    href={`tel:+91${number}`}
                    className="group flex items-center gap-4 px-5 py-4 rounded-2xl border border-border hover:border-primary/40 hover:bg-primary/[0.03] transition-all no-underline"
                  >
                    <span className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-base font-semibold text-foreground">{city}</span>
                      <span className="block text-base text-muted-foreground tabular-nums">+91 {number}</span>
                    </span>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </a>
                ))}
              </div>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Currently serving Gurgaon &amp; Noida
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ContactModal;
