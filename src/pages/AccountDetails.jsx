import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, User, Phone, Mail, LogOut, CheckCircle2, Loader2, MapPin, Save } from "lucide-react";
import { useKycStatus } from "@/hooks/useKycStatus";
import Footer from "@/components/Footer";
import KycStatusBanner from "@/components/KycStatusBanner";
import { getAuth, setAuth, clearAuth } from "@/lib/auth";
import { updateUserProfile } from "@/api/profile";
import { sendEmailOtp, verifyEmailOtp } from "@/api/otp";
import { getUserAddress, saveUserAddress } from "@/api/address";
import { lookupPincode, SERVED_CITIES } from "@/lib/pincode";
import { toast } from "sonner";

const RESEND_COOLDOWN = 30;

const ADDR_EMPTY = {
  contact_name: "",
  contact_phone: "",
  address_line_1: "",
  address_line_2: "",
  landmark: "",
  pincode: "",
  city: "",
  state: "",
};

const AccountDetails = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const { kycStatus, loading: kycLoading } = useKycStatus();
  const [name, setName] = useState(auth?.name ?? "");
  const [email, setEmail] = useState(auth?.email ?? "");
  const [isSaving, setIsSaving] = useState(false);

  // Address section state
  const [addr, setAddr] = useState(ADDR_EMPTY);
  const [addrFetching, setAddrFetching] = useState(true);
  const [addrSaving, setAddrSaving] = useState(false);
  const [addrEditing, setAddrEditing] = useState(false);
  const [geoState, setGeoState] = useState("idle"); // idle | loading | done | denied
  const [pincodeState, setPincodeState] = useState("idle"); // idle | done | error

  useEffect(() => {
    const a = getAuth();
    if (!a?.phone) { setAddrFetching(false); setAddrEditing(true); return; }
    getUserAddress(a.phone)
      .then((data) => {
        if (data && data.address_line_1) {
          setAddr({ ...ADDR_EMPTY, ...data });
          setAddrEditing(false);
        } else {
          setAddrEditing(true);
        }
      })
      .catch(() => { setAddrEditing(true); })
      .finally(() => setAddrFetching(false));
  }, []);

  const setAddrField = (k) => (e) => setAddr((f) => ({ ...f, [k]: e.target.value }));

  const handlePincodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setAddr((f) => ({ ...f, pincode: value }));
    if (value.length !== 6) { setPincodeState("idle"); return; }
    const result = lookupPincode(value);
    if (result) {
      setAddr((f) => ({ ...f, city: f.city || result.city, state: f.state || result.state }));
      setPincodeState("done");
    } else {
      setPincodeState("error");
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) { setGeoState("denied"); return; }
    setGeoState("loading");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "User-Agent": "RentBasket/1.0 (rentbasket.com)" } }
          );
          if (!res.ok) throw new Error();
          const data = await res.json();
          const a = data.address || {};
          setAddr((f) => ({
            ...f,
            address_line_1: f.address_line_1 || [a.house_number, a.road].filter(Boolean).join(", "),
            address_line_2: f.address_line_2 || (a.suburb || a.neighbourhood || a.quarter || ""),
            city: f.city || (a.city || a.town || a.village || a.county || ""),
            state: f.state || (a.state || ""),
            pincode: f.pincode || (a.postcode || ""),
          }));
        } catch { /* reverse-geocode failed — user fills the fields manually */ }
        setGeoState("done");
      },
      () => setGeoState("denied"),
      { timeout: 8000 }
    );
  };

  const handleSaveAddress = async () => {
    if (!addr.contact_name || !addr.address_line_1 || !addr.pincode || !addr.city || !addr.state) {
      toast.error("Please fill all required address fields");
      return;
    }
    const a = getAuth();
    if (!a?.phone) { toast.error("Not logged in"); return; }
    setAddrSaving(true);
    await saveUserAddress(a.phone, addr).catch(() => {});
    setAddrSaving(false);
    setAddrEditing(false);
    toast.success("Address saved");
  };

  // Email verification state
  const [emailVerified, setEmailVerified] = useState(Boolean(auth?.emailVerified));
  const [emailStep, setEmailStep] = useState("idle"); // "idle" | "sending" | "otp" | "verifying"
  const [emailOtp, setEmailOtp] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const [pendingEmail, setPendingEmail] = useState(""); // email the OTP was sent to
  const otpInputRef = useRef(null);

  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setInterval(() => setResendIn((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(id);
  }, [resendIn]);

  // Reset verification state when user edits email to something different
  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (emailVerified && val !== (auth?.email ?? "")) setEmailVerified(false);
    if (emailStep === "otp") setEmailStep("idle");
  };

  const buildProfilePayload = (overrides) => {
    const current = getAuth();
    const fullName = overrides.name ?? current?.name ?? "";
    const parts = fullName.trim().split(" ");
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ");
    return {
      user_id: current?.userId ?? "",
      first_name: firstName,
      last_name: lastName,
      email: overrides.email ?? current?.email ?? "",
      address: "",
      org_name: "",
      about_me: "",
      social_media_links: "",
      reg_mobile_num: current?.phone ?? "",
    };
  };

  const handleNameBlur = async () => {
    const trimmed = name.trim();
    const current = getAuth();
    if (!current?.userId) {
      console.warn("AccountDetails: userId missing from auth — falling back to localStorage save");
      setAuth({ ...current, name: trimmed });
      if (trimmed) toast.success("Name saved");
      return;
    }
    setIsSaving(true);
    try {
      await updateUserProfile(buildProfilePayload({ name: trimmed }));
      setAuth({ ...getAuth(), name: trimmed });
      if (trimmed) toast.success("Name saved");
    } catch (err) {
      toast.error(err.message || "Failed to save name");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmailBlur = async () => {
    const trimmed = email.trim();
    const current = getAuth();
    if (!current?.userId) {
      console.warn("AccountDetails: userId missing from auth — falling back to localStorage save");
      setAuth({ ...current, email: trimmed });
      if (trimmed) toast.success("Email saved");
      return;
    }
    setIsSaving(true);
    try {
      await updateUserProfile(buildProfilePayload({ email: trimmed }));
      setAuth({ ...getAuth(), email: trimmed });
      if (trimmed) toast.success("Email saved");
    } catch (err) {
      toast.error(err.message || "Failed to save email");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendEmailOtp = async () => {
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Please enter a valid email address first");
      return;
    }
    setEmailStep("sending");
    try {
      // The backend only sends an OTP to an email that is already saved against
      // the user's profile (send-email-otp returns "Email not found" otherwise).
      // So persisting the email MUST succeed before we request the OTP — for a
      // new/changed email this is the step that makes it deliverable.
      const current = getAuth();
      if (!current?.userId) {
        // Without a userId we can't save the email to the profile, so the OTP
        // request would come back "Email not found". Fail loudly instead of
        // firing a request the backend will reject.
        setEmailStep("idle");
        toast.error("Couldn't verify your account. Please sign out and sign in again, then retry.");
        return;
      }
      await updateUserProfile(buildProfilePayload({ email: trimmed }));
      setAuth({ ...getAuth(), email: trimmed });

      await sendEmailOtp(trimmed);
      setPendingEmail(trimmed);
      setEmailStep("otp");
      setResendIn(RESEND_COOLDOWN);
      setEmailOtp("");
      toast.success("OTP sent to " + trimmed);
      setTimeout(() => otpInputRef.current?.focus(), 100);
    } catch (err) {
      setEmailStep("idle");
      // "Email not found" means the profile-save didn't take on the backend —
      // surface it as something the user can act on rather than a raw API string.
      const msg = /email not found/i.test(err.message || "")
        ? "We couldn't link that email to your account. Please try again in a moment."
        : err.message || "Failed to send OTP";
      toast.error(msg);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!emailOtp.trim() || emailOtp.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }
    setEmailStep("verifying");
    try {
      await verifyEmailOtp(pendingEmail, emailOtp);
      // Also persist the verified email to profile API
      const current = getAuth();
      if (current?.userId) {
        try {
          await updateUserProfile(buildProfilePayload({ email: pendingEmail }));
        } catch {
          // Profile save failure is non-fatal — email is still verified locally
        }
      }
      setAuth({ ...getAuth(), email: pendingEmail, emailVerified: true });
      setEmail(pendingEmail);
      setEmailVerified(true);
      setEmailStep("idle");
      toast.success("Email verified successfully!");
    } catch (err) {
      setEmailStep("otp");
      toast.error(err.message || "Invalid OTP. Please try again.");
    }
  };

  const handleResendEmailOtp = async () => {
    if (resendIn > 0) return;
    setEmailOtp("");
    try {
      await sendEmailOtp(pendingEmail);
      setResendIn(RESEND_COOLDOWN);
      toast.success("OTP resent to " + pendingEmail);
    } catch (err) {
      toast.error(err.message || "Failed to resend OTP");
    }
  };

  const handleSignOut = () => {
    clearAuth();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 section-container py-10 md:py-14 max-w-lg mx-auto w-full">
        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest mb-6"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Profile
        </Link>

        {!kycLoading && (
          <KycStatusBanner kycStatus={kycStatus} returnTo="/account/details" className="mb-6" />
        )}

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <User className="w-5 h-5 text-foreground" />
          </div>
          <h1 className="text-2xl font-bold font-display text-foreground">Personal Details</h1>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleNameBlur}
              disabled={isSaving}
              className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground bg-background placeholder-muted-foreground/40 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                disabled={isSaving || emailStep === "otp" || emailStep === "verifying"}
                className="w-full pl-9 pr-28 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground bg-background placeholder-muted-foreground/40 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                {emailVerified ? (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-success">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                ) : email.trim() && emailStep === "idle" ? (
                  <button
                    type="button"
                    onClick={handleSendEmailOtp}
                    className="text-[11px] font-semibold text-foreground hover:underline"
                  >
                    Verify Email
                  </button>
                ) : emailStep === "sending" ? (
                  <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin" />
                ) : null}
              </div>
            </div>

            {/* Inline OTP entry */}
            {emailStep === "otp" || emailStep === "verifying" ? (
              <div className="mt-3 space-y-2">
                <p className="text-[11px] text-muted-foreground">
                  OTP sent to <span className="font-semibold text-foreground">{pendingEmail}</span>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Can't find it? Check your <span className="font-semibold text-foreground">spam</span> or
                  <span className="font-semibold text-foreground"> junk</span> folder.
                </p>
                <div className="flex gap-2">
                  <input
                    ref={otpInputRef}
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter OTP"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyEmailOtp()}
                    disabled={emailStep === "verifying"}
                    className="flex-1 px-3 py-2 border border-border rounded-lg text-sm text-center tracking-widest font-medium focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground bg-background disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyEmailOtp}
                    disabled={emailStep === "verifying" || !emailOtp}
                    className="px-4 py-2 bg-foreground text-background text-sm font-semibold rounded-lg hover:bg-foreground/90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    {emailStep === "verifying" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    {emailStep === "verifying" ? "Verifying…" : "Confirm"}
                  </button>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  {resendIn > 0 ? (
                    <span className="text-muted-foreground">
                      Resend in <span className="font-semibold text-foreground tabular-nums">0:{String(resendIn).padStart(2, "0")}</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendEmailOtp}
                      className="text-foreground font-semibold hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => { setEmailStep("idle"); setEmailOtp(""); }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Phone — read-only */}
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="tel"
                value={auth?.phone ? `+91 ${auth.phone}` : "—"}
                readOnly
                className="w-full pl-9 pr-3.5 py-2.5 border border-border rounded-lg text-sm bg-secondary/40 text-muted-foreground cursor-not-allowed select-none"
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              Contact number cannot be changed. It is tied to your account.
            </p>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold font-display text-foreground">Delivery Address</h2>
          </div>

          {addrFetching ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : !addrEditing ? (
            /* Compact summary card */
            <button
              type="button"
              onClick={() => setAddrEditing(true)}
              className="w-full text-left bg-white rounded-2xl border border-border shadow-sm px-5 py-4 hover:border-foreground/35 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{addr.contact_name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                    {[addr.address_line_1, addr.address_line_2, addr.landmark].filter(Boolean).join(", ")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {[addr.city, addr.state, addr.pincode].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <span className="text-xs font-semibold text-foreground group-hover:underline whitespace-nowrap mt-0.5 shrink-0">
                  Edit
                </span>
              </div>
            </button>
          ) : (
            /* Edit form */
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-4">
              {/* Contact Name + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Contact Name <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={addr.contact_name}
                    onChange={setAddrField("contact_name")}
                    className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground bg-background placeholder-muted-foreground/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">Contact Phone <span className="text-primary">*</span></label>
                  <input
                    type="tel"
                    placeholder="10-digit number"
                    value={addr.contact_phone}
                    onChange={setAddrField("contact_phone")}
                    maxLength={10}
                    inputMode="numeric"
                    className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground bg-background placeholder-muted-foreground/40"
                  />
                </div>
              </div>

              {/* Use my location */}
              <button
                type="button"
                onClick={handleUseLocation}
                disabled={geoState === "loading" || geoState === "done"}
                className={`w-full flex items-center justify-center gap-2 py-2.5 border rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  geoState === "done"
                    ? "border-success/40 text-success bg-success/5"
                    : geoState === "denied"
                    ? "border-orange-300 text-orange-600 hover:border-orange-400 bg-orange-50/40"
                    : "border-border text-muted-foreground hover:border-foreground/35 hover:text-foreground"
                }`}
              >
                {geoState === "loading" ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Getting location…</>
                ) : geoState === "done" ? (
                  <><MapPin className="w-4 h-4" /> Location captured ✓</>
                ) : geoState === "denied" ? (
                  <><MapPin className="w-4 h-4" /> Retry location</>
                ) : (
                  <><MapPin className="w-4 h-4" /> Use my location</>
                )}
              </button>

              {/* Address lines */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Address Line 1 <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  placeholder="House / Flat / Block No."
                  value={addr.address_line_1}
                  onChange={setAddrField("address_line_1")}
                  className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground bg-background placeholder-muted-foreground/40"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Address Line 2</label>
                <input
                  type="text"
                  placeholder="Street, Colony, Area"
                  value={addr.address_line_2}
                  onChange={setAddrField("address_line_2")}
                  className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground bg-background placeholder-muted-foreground/40"
                />
              </div>

              {/* Landmark + Pincode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">Landmark</label>
                  <input
                    type="text"
                    placeholder="Near metro, school, etc."
                    value={addr.landmark}
                    onChange={setAddrField("landmark")}
                    className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground bg-background placeholder-muted-foreground/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Pincode <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="6-digit pincode"
                    value={addr.pincode}
                    onChange={handlePincodeChange}
                    maxLength={6}
                    inputMode="numeric"
                    className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground bg-background placeholder-muted-foreground/40"
                  />
                  {pincodeState === "done" && (
                    <p className="text-[10px] mt-1 text-success flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> City &amp; state filled
                    </p>
                  )}
                  {pincodeState === "error" && (
                    <p className="text-[10px] mt-1 text-muted-foreground">Not found — enter manually</p>
                  )}
                </div>
              </div>

              {/* City + State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    City <span className="text-primary">*</span>
                  </label>
                  <select
                    value={addr.city}
                    onChange={setAddrField("city")}
                    className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground bg-background appearance-none"
                  >
                    <option value="">Select city</option>
                    {SERVED_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    State <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="State"
                    value={addr.state}
                    onChange={setAddrField("state")}
                    className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground bg-background placeholder-muted-foreground/40"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-1">
                {addr.address_line_1 && (
                  <button
                    type="button"
                    onClick={() => setAddrEditing(false)}
                    className="flex-1 py-3 border border-border text-sm font-semibold rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSaveAddress}
                  disabled={addrSaving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 gradient-coral text-white text-sm font-semibold rounded-xl hover:opacity-95 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-60"
                >
                  {addrSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {addrSaving ? "Saving…" : "Save Address"}
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleSignOut}
          className="mt-8 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </main>

      <Footer />
    </div>
  );
};

export default AccountDetails;
