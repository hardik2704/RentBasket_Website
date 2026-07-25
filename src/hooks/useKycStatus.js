import { useState, useEffect } from "react";
import { getAuth } from "@/lib/auth";
import { getKycStatus, getKycDocList } from "@/api/kyc";

/**
 * Returns { kycStatus, loading } for the currently logged-in user.
 *
 * Verification is per-document: each doc carries `is_done` (uploaded) and
 * `is_verified` (admin-approved). There is no "rejected" state — a doc is
 * either not-uploaded, uploaded-and-pending, or verified. KYC is complete only
 * when every mandatory doc is verified.
 *
 * kycStatus:
 *   null        — unknown (first ever load, no cached value yet)
 *   "none"      — no mandatory docs uploaded yet
 *   "submitted" — some/all mandatory docs uploaded, none/not-all verified yet
 *   "verified"  — every mandatory doc is verified
 *
 * The status is CACHED in localStorage (per phone) and used to seed the hook so
 * consumers render the banner INSTANTLY with the last-known value, rather than
 * waiting out the JWT-mint + two KYC API calls (which can stack to several
 * seconds on a slow/flaky connection). The live fetch then silently corrects
 * the cached value. `loading` is therefore only true on the very first visit,
 * before any value is known.
 */

const CACHE_PREFIX = "kycStatus:";

const readCache = (mobile) => {
  try {
    const v = localStorage.getItem(CACHE_PREFIX + mobile);
    return v === "none" || v === "submitted" || v === "verified" ? v : null;
  } catch {
    return null;
  }
};

const writeCache = (mobile, status) => {
  try {
    localStorage.setItem(CACHE_PREFIX + mobile, status);
  } catch {
    /* non-fatal — caching is an optimisation, not required */
  }
};

export function useKycStatus() {
  const mobile = getAuth()?.phone;
  // Seed from cache so the banner paints immediately with the last-known status.
  const [kycStatus, setKycStatus] = useState(() => (mobile ? readCache(mobile) : "none"));

  useEffect(() => {
    if (!mobile) { setKycStatus("none"); return; }
    // getKycStatus is kept in the fetch so a failure of either call is caught,
    // but completion is derived from the per-doc is_verified flags (not the
    // overall status string), per the confirmed "all verified = complete" model.
    Promise.all([getKycStatus(mobile), getKycDocList(mobile)])
      .then(([, docList]) => {
        const mandatoryDocs = (docList ?? []).filter((d) => d.mandatory === 1);
        const anyUploaded = mandatoryDocs.some((d) => !!d.is_done);
        const allVerified = mandatoryDocs.length > 0 && mandatoryDocs.every((d) => !!d.is_verified);
        const next = allVerified ? "verified" : anyUploaded ? "submitted" : "none";
        setKycStatus(next);
        writeCache(mobile, next);
      })
      // On failure, fall back to a cached value if we have one, else "none".
      .catch(() => setKycStatus((prev) => prev ?? "none"));
  }, [mobile]);

  return { kycStatus, loading: kycStatus === null };
}
