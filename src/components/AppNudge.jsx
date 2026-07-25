import { useState } from "react";
import { X, Smartphone } from "lucide-react";
import StoreButtons from "@/components/StoreButtons";

/**
 * A small, dismissible "get the app" nudge shown at high-intent moments where
 * the app is genuinely a better experience (KYC camera capture, live order /
 * renewal tracking). Deliberately contextual — pass a `reason` that names the
 * concrete benefit for the page it sits on. Do NOT scatter these onto pages
 * with no honest app advantage.
 *
 * Mobile-only by design: the payoff is "install the app on this phone", which
 * is meaningless on a desktop browser — so the component renders nothing at
 * md+ (matches AppDownloadCard). Desktop surfaces are left untouched.
 *
 * "Don't annoy" contract:
 *   - dismissible; once dismissed, suppressed for the rest of the SESSION
 *     (sessionStorage), then it returns on the next visit.
 *   - never blocks an action, never a full-screen interstitial.
 *
 * Props:
 *   id        unique key for session suppression (e.g. "nudge-kyc")
 *   title     short headline (default: "Get the RentBasket app")
 *   reason    the concrete, page-specific benefit line (required)
 *   className optional extra classes (e.g. margins)
 */

const STORAGE_PREFIX = "appNudgeDismissed:";

const AppNudge = ({ id, title = "Get the RentBasket app", reason, className = "" }) => {
  const [visible, setVisible] = useState(() => {
    if (!id) return true;
    try {
      return sessionStorage.getItem(STORAGE_PREFIX + id) !== "1";
    } catch {
      return true; // storage unavailable (private mode etc.) — just show it
    }
  });

  const dismiss = () => {
    if (!id) { setVisible(false); return; }
    try {
      sessionStorage.setItem(STORAGE_PREFIX + id, "1");
    } catch {
      /* non-fatal — suppression just won't persist this session */
    }
    setVisible(false);
  };

  // Rendered as a plain element (no entry animation, no Framer height-auto
  // measurement) so it occupies its space from the FIRST paint and never pushes
  // surrounding content down. Dismissal just unmounts it — collapsing instead
  // would re-introduce a shift, and the user is already looking away from it.
  if (!visible) return null;

  return (
    <div className={`md:hidden ${className}`}>
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 md:p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{reason}</p>
          </div>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="shrink-0 p-1 -mt-1 -mr-1 rounded-full text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <StoreButtons
          className="flex gap-2 mt-3"
          btnClass="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-primary text-white text-sm font-semibold active:scale-[0.97] transition-transform hover:opacity-95"
        />
      </div>
    </div>
  );
};

export default AppNudge;
