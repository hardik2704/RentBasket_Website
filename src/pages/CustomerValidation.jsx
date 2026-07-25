import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import logo from "@/assets/7 1.png";
import { toast } from "sonner";
import { setAuth } from "@/lib/auth";
import { generateOtp, loginWithOtp, signUpWithOtp, getCities } from "@/api/otp";

const RESEND_COOLDOWN = 30; // seconds

// Serviceable cities, mirrored from /get-ig-cities (confirmed 2026-06-07).
// Used only if the live cities call fails — signup still needs a real choice
// because the backend keys every new lead to a city.
const FALLBACK_CITIES = [
  { city_id: 1, city: "Gurugram" },
  { city_id: 2, city: "Sohna" },
  { city_id: 3, city: "Noida" },
  { city_id: 4, city: "Dwarka" },
  { city_id: 5, city: "Faridabad" },
  { city_id: 6, city: "Greater Noida" },
  { city_id: 7, city: "South Delhi" },
  { city_id: 999, city: "Rest Of NCR" },
];

// "Rest Of NCR" (999) reads as a catch-all — keep it last regardless of API order.
const sortCities = (cities) =>
  [...cities].sort((a, b) => (a.city_id === 999 ? 1 : b.city_id === 999 ? -1 : a.city_id - b.city_id));

/**
 * Backend validation messages (e.g. "Invalid OTP") are user-meaningful; the
 * plumbing failures ("Auth: token fetch failed (500)", "OTP API failed (502)",
 * "Failed to fetch") are not — swap those for friendly copy.
 */
const friendlyError = (err, fallback) => {
  const msg = err?.message || "";
  return !msg || /^auth:|failed \(\d+\)|failed to fetch|networkerror/i.test(msg)
    ? fallback
    : msg;
};

const CustomerValidation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || "/profile";
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => { document.title = "Sign Up or Login | RentBasket"; }, []);
  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [isLoading, setIsLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0); // seconds until resend is allowed
  const [isRegistered, setIsRegistered] = useState(null); // null | true | false
  // New users must pick their city — the backend keys the CRM lead to it.
  const [cities, setCities] = useState([]);
  const [cityId, setCityId] = useState("");

  // Countdown for the Resend OTP cooldown
  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setInterval(() => setResendIn((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(id);
  }, [resendIn]);

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    setIsLoading(true);
    try {
      const { IsRegistered } = await generateOtp(phoneNumber);
      setIsRegistered(IsRegistered);
      setStep("otp");
      setResendIn(RESEND_COOLDOWN);
      toast.success("OTP sent to your mobile number");
      // New user → the OTP step shows a city picker. Load the live list in the
      // background; fall back to the bundled list so signup is never blocked.
      if (!IsRegistered && cities.length === 0) {
        getCities()
          .then((list) => setCities(sortCities(list?.length ? list : FALLBACK_CITIES)))
          .catch(() => setCities(sortCities(FALLBACK_CITIES)));
      }
    } catch (err) {
      toast.error(friendlyError(err, "Couldn't send the OTP. Please check your connection and try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendIn > 0 || isLoading) return;
    setOtp("");
    setIsLoading(true);
    try {
      await generateOtp(phoneNumber);
      setResendIn(RESEND_COOLDOWN);
      toast.success("OTP resent to your mobile number");
    } catch (err) {
      toast.error(friendlyError(err, "Couldn't resend the OTP. Please try again in a moment."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp.trim() || otp.length !== 4) {
      toast.error("Please enter the 4-digit OTP");
      return;
    }
    if (isRegistered === false && !cityId) {
      toast.error("Please select your city", {
        description: "We need it to set up delivery for your area.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Both endpoints return the same user object. /otp-sign-up returns it too
      // (user_id, lead_id, mobile_no, ...) — its `token` is null, but that field
      // is unused: every API call is authorised by the app-level JWT, and the app
      // keys "logged in" off phone/user_id/lead_id. So a new user is logged in
      // straight from the signup response — no second OTP needed.
      const userData =
        isRegistered === false
          ? await signUpWithOtp(phoneNumber, otp, cityId)
          : await loginWithOtp(phoneNumber, otp);

      setAuth({
        phone: userData.mobile_no,
        token: userData.token, // null on signup; unused — JWT does the auth
        userId: userData.user_id,
        leadId: userData.lead_id,
        // Join only the name parts that exist — a null/absent last_name must not
        // become the literal string "null" in the displayed name (backend returns
        // last_name: null for single-name accounts).
        name: [userData.first_name, userData.last_name].filter(Boolean).join(" "),
        email: userData.email || "",
      });
      toast.success(isRegistered === false ? "Account created!" : "Mobile verified!", {
        description: "Let's complete your order details.",
      });
      navigate(returnTo, { state: { verifiedPhone: phoneNumber } });
    } catch (err) {
      toast.error(friendlyError(err, "Couldn't verify the OTP. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (step === "phone") handlePhoneSubmit();
      else handleOtpSubmit();
    }
  };

  const benefits = [
    "Track your rental bookings in real-time",
    "Exclusive member-only discounts and offers",
    "Priority customer support access",
    "Seamless future rentals with saved preferences",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/35 flex flex-col">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 py-2 sticky top-0 z-50">
        <div className="section-container">
          <Link to="/">
            <img src={logo} alt="RentBasket" className="w-10 md:w-28" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-16">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10 border border-border/30">

            {/* Heading */}
            <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground text-center mb-2">
              {step === "phone" ? "Sign Up or Login" : "Verify OTP"}
            </h1>

            <p className="text-center text-muted-foreground text-sm md:text-base mb-8">
              {step === "phone"
                ? "Enter your mobile number to get started"
                : `Enter the OTP sent to ${phoneNumber}`}
            </p>

            {/* Form */}
            <div className="space-y-5 mb-8">
              {step === "phone" ? (
                <>
                  {/* Phone Input */}
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Enter 10-digit number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                      maxLength="10"
                      className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground disabled:opacity-60 disabled:cursor-not-allowed bg-background placeholder-muted-foreground/40 font-medium tracking-normal"
                    />
                  </div>

                  {/* Generate OTP Button */}
                  <button
                    onClick={handlePhoneSubmit}
                    disabled={isLoading || !phoneNumber}
                    className="w-full py-2.5 gradient-coral text-white text-sm font-semibold rounded-xl hover:opacity-95 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? "Sending..." : "Generate OTP"}
                    {!isLoading && <ArrowRight className="w-5 h-5" />}
                  </button>
                </>
              ) : (
                <>
                  {/* OTP Input */}
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="one-time-code"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                      maxLength="4"
                      className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground disabled:opacity-60 disabled:cursor-not-allowed bg-background placeholder-muted-foreground/40 font-medium tracking-widest text-center"
                    />
                  </div>

                  {/* City picker — new accounts only; the backend keys the lead to a city */}
                  {isRegistered === false && (
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-2">
                        Your City
                      </label>
                      <select
                        value={cityId}
                        onChange={(e) => setCityId(e.target.value)}
                        disabled={isLoading}
                        className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground disabled:opacity-60 disabled:cursor-not-allowed bg-background font-medium"
                      >
                        <option value="" disabled>
                          {cities.length ? "Select your city" : "Loading cities…"}
                        </option>
                        {cities.map((c) => (
                          <option key={c.city_id} value={c.city_id}>
                            {c.city}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-muted-foreground mt-1.5">
                        We currently deliver across Delhi NCR.
                      </p>
                    </div>
                  )}

                  {/* Verify OTP Button */}
                  <button
                    onClick={handleOtpSubmit}
                    disabled={isLoading || !otp}
                    className="w-full py-2.5 gradient-coral text-white text-sm font-semibold rounded-xl hover:opacity-95 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? "Verifying..." : "Verify & Continue"}
                    {!isLoading && <ArrowRight className="w-5 h-5" />}
                  </button>

                  {/* Secondary actions */}
                  <div className="pt-3 border-t border-border/30 flex items-center justify-between text-sm">
                    <div className="text-muted-foreground">
                      {resendIn > 0 ? (
                        <span>Resend in <span className="font-semibold text-foreground tabular-nums">0:{String(resendIn).padStart(2, "0")}</span></span>
                      ) : (
                        <button
                          onClick={handleResend}
                          disabled={isLoading}
                          className="text-foreground font-semibold hover:underline disabled:opacity-60"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setStep("phone");
                        setOtp("");
                        setPhoneNumber("");
                        setResendIn(0);
                        setIsRegistered(null);
                        setCityId("");
                      }}
                      disabled={isLoading}
                      className="text-muted-foreground hover:text-foreground transition-colors underline disabled:opacity-60"
                    >
                      Change number
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Verification Message */}
            <div className="text-center text-xs md:text-sm text-muted-foreground pb-6 border-b border-border/30">
              By continuing, I agree to the{" "}
              <Link to="/terms-n-conditions" className="text-foreground font-semibold hover:underline">
                Terms & Conditions
              </Link>.
            </div>

            {/* Benefits Section */}
            {step === "phone" && (
              <div className="mt-6 space-y-3">
                <p className="text-sm font-semibold text-foreground mb-3">By signing up:</p>
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trust Badge */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-success-muted border border-success-border font-medium text-success">
              ✓ Secure & Encrypted
            </span>
          </div>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="text-center text-xs md:text-sm text-muted-foreground py-6 border-t border-border/30">
        <p>Need help? <a href="tel:+919959858473" className="text-foreground font-semibold hover:underline">Call +91 9959858473</a></p>
      </footer>
    </div>
  );
};

export default CustomerValidation;
