import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import logo from "@/assets/7 1.png";
import { toast } from "sonner";

const RESEND_COOLDOWN = 30; // seconds

const CustomerValidation = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [isLoading, setIsLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0); // seconds until resend is allowed

  // Track pending timers so they can be cancelled if the component unmounts
  // (prevents state updates / navigation firing after unmount).
  const timers = useRef([]);
  const schedule = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

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
    // Simulate OTP generation
    schedule(() => {
      setIsLoading(false);
      setStep("otp");
      setResendIn(RESEND_COOLDOWN);
      toast.success("OTP sent to your mobile number");
    }, 1500);
  };

  const handleResend = () => {
    if (resendIn > 0 || isLoading) return;
    setOtp("");
    setResendIn(RESEND_COOLDOWN);
    toast.success("OTP resent to your mobile number");
  };

  const handleOtpSubmit = async () => {
    if (!otp.trim() || otp.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }

    setIsLoading(true);
    // Simulate OTP verification
    schedule(() => {
      setIsLoading(false);
      toast.success("Mobile verified!", {
        description: "Let's complete your order details.",
      });
      // Proceed to checkout, carrying the verified mobile number forward
      schedule(() => {
        navigate("/checkout", { state: { verifiedPhone: phoneNumber } });
      }, 800);
    }, 1500);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 py-4 sticky top-0 z-50">
        <div className="section-container">
          <img src={logo} alt="RentBasket" className="w-24 md:w-28" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-16">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10 border border-border/30">

            {/* Heading */}
            <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground text-center mb-2">
              {step === "phone" ? "Customer Validation" : "Verify OTP"}
            </h1>

            <p className="text-center text-muted-foreground text-base md:text-lg mb-8">
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
                      placeholder="Enter 10-digit number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                      maxLength="10"
                      className="w-full px-4 py-3.5 border-2 border-primary/30 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed bg-background placeholder-muted-foreground/50 font-semibold tracking-wider"
                    />
                  </div>

                  {/* Generate OTP Button */}
                  <button
                    onClick={handlePhoneSubmit}
                    disabled={isLoading || !phoneNumber}
                    className="w-full py-3.5 bg-gradient-to-r from-primary to-primary/90 text-white text-base font-bold rounded-2xl hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                      placeholder="Enter 4-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                      maxLength="4"
                      className="w-full px-4 py-3.5 border-2 border-primary/30 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed bg-background placeholder-muted-foreground/50 font-semibold tracking-widest text-center"
                    />
                  </div>

                  {/* Verify OTP Button */}
                  <button
                    onClick={handleOtpSubmit}
                    disabled={isLoading || !otp}
                    className="w-full py-3.5 bg-gradient-to-r from-primary to-primary/90 text-white text-base font-bold rounded-2xl hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? "Verifying..." : "Verify & Continue"}
                    {!isLoading && <ArrowRight className="w-5 h-5" />}
                  </button>

                  {/* Resend OTP */}
                  <div className="text-center text-sm">
                    {resendIn > 0 ? (
                      <span className="text-muted-foreground">
                        Didn't get it? Resend in{" "}
                        <span className="font-bold text-foreground tabular-nums">0:{String(resendIn).padStart(2, "0")}</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        Didn't get the code?{" "}
                        <button
                          onClick={handleResend}
                          disabled={isLoading}
                          className="font-bold text-primary hover:underline disabled:opacity-60"
                        >
                          Resend OTP
                        </button>
                      </span>
                    )}
                  </div>

                  {/* Change Number Link */}
                  <button
                    onClick={() => {
                      setStep("phone");
                      setOtp("");
                      setPhoneNumber("");
                      setResendIn(0);
                    }}
                    disabled={isLoading}
                    className="w-full py-2 text-sm text-muted-foreground hover:text-primary transition-colors underline disabled:opacity-60"
                  >
                    Change mobile number
                  </button>
                </>
              )}
            </div>

            {/* Verification Message */}
            <div className="text-center text-xs md:text-sm text-muted-foreground pb-6 border-b border-border/30">
              By continuing, you verify that you are a registered customer of RentBasket.
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
        <p>Need help? <a href="tel:+919958858473" className="text-primary font-semibold hover:underline">Call +91 9958858473</a></p>
      </footer>
    </div>
  );
};

export default CustomerValidation;
