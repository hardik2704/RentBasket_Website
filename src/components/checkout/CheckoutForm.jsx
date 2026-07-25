import { useState, useEffect } from "react";
import { User, Phone, Mail, MapPin, Calendar, Info, CheckCircle2, Loader2 } from "lucide-react";
import { getDeliverySlots } from "@/api/otp";
import { dateNDaysFromToday } from "@/lib/delivery";
import { lookupPincode, SERVED_CITIES } from "@/lib/pincode";

const CheckoutCard = ({ title, icon: Icon, children, subtitle }) => (
  <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft mb-6">
    <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between bg-secondary/10">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-foreground">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm md:text-base font-bold text-foreground">{title}</h3>
          {subtitle && <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
    <div className="p-5 md:p-6">
      {children}
    </div>
  </div>
);

const InputField = ({ label, icon: Icon, placeholder, type = "text", hint, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors">
        <Icon className="w-4 h-4" />
      </div>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3 bg-secondary/30 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground focus:bg-background transition-all"
        {...props}
      />
    </div>
    {hint && <div className="ml-1 text-[10px] mt-0.5">{hint}</div>}
  </div>
);

const ServiceabilityNote = () => (
  <div className="p-3 bg-secondary/40 border border-border rounded-xl flex gap-3 mt-2">
    <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
    <p className="text-[11px] text-muted-foreground leading-relaxed">
      <span className="font-bold text-foreground">Serviceability Note:</span> If your pincode is outside our primary zone, our team will coordinate for a custom delivery quote.
    </p>
  </div>
);

const CheckoutForm = ({ formData, setFormData, phoneVerified = false }) => {
  const [geoState, setGeoState] = useState("idle"); // idle | loading | done | denied
  const [pincodeState, setPincodeState] = useState("idle"); // idle | loading | done | error
  const [slots, setSlots] = useState([]);
  // Start collapsed if address was pre-filled, open if blank
  const [addrEditing, setAddrEditing] = useState(!formData.addressLine1);

  useEffect(() => {
    getDeliverySlots()
      .then((s) => {
        // Sort by id ascending (earliest slot first)
        const sorted = [...s].sort((a, b) => a.id - b.id);
        setSlots(sorted);
        // Pre-select the first slot if nothing is selected yet
        setFormData((prev) => ({
          ...prev,
          timeSlot: prev.timeSlot || sorted[0]?.id,
        }));
      })
      .catch(() => {}); // fallback: existing hardcoded selection stays
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePincodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: value }));
    if (value.length !== 6) { setPincodeState("idle"); return; }
    const result = lookupPincode(value);
    if (result) {
      setFormData((prev) => ({
        ...prev,
        city: prev.city || result.city,
        state: prev.state || result.state,
      }));
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
          setFormData((prev) => ({
            ...prev,
            addressLine1: prev.addressLine1 || [a.house_number, a.road].filter(Boolean).join(", "),
            addressLine2: prev.addressLine2 || (a.suburb || a.neighbourhood || a.quarter || ""),
            city: prev.city || (a.city || a.town || a.village || a.county || ""),
            state: prev.state || (a.state || ""),
            pincode: prev.pincode || (a.postcode || ""),
          }));
        } catch { /* reverse-geocode failed — user fills the fields manually */ }
        setGeoState("done");
      },
      () => setGeoState("denied"),
      { timeout: 8000 }
    );
  };

  return (
    <div className="w-full">
      {/* 1. Your Details */}
      <CheckoutCard
        title="Your Details"
        icon={User}
        subtitle="We'll use these details to share delivery updates and your invoice."
      >
        {phoneVerified && (
          <div className="flex items-center justify-between gap-3 mb-5 p-3 bg-success-muted border border-success-border rounded-xl">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-success-muted-foreground uppercase tracking-wider">Mobile Verified</p>
                <p className="text-sm font-bold text-foreground">+91 {formData.phone}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-success uppercase tracking-wider">Verified</span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField
            label="Full Name"
            icon={User}
            name="fullName"
            placeholder="e.g. Rahul Sharma"
            value={formData.fullName}
            onChange={handleChange}
          />
          <InputField
            label="Email Address"
            icon={Mail}
            name="email"
            type="email"
            placeholder="e.g. rahul@example.com"
            value={formData.email}
            onChange={handleChange}
          />
          {!phoneVerified && (
            <div className="md:col-span-2">
              <InputField
                label="Mobile Number"
                icon={Phone}
                name="phone"
                placeholder="e.g. 99598 58473"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          )}
        </div>
      </CheckoutCard>

      {/* 2. Delivery Address */}
      <CheckoutCard
        title="Delivery Address"
        icon={MapPin}
        subtitle="Currently serving Gurgaon, Noida, and select areas across Delhi NCR."
      >
        {!addrEditing ? (
          /* Compact summary */
          <button
            type="button"
            onClick={() => setAddrEditing(true)}
            className="w-full text-left p-4 bg-secondary/30 border border-border rounded-xl hover:border-foreground/35 hover:bg-background transition-all group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{formData.fullName}</p>
                <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                  {[formData.addressLine1, formData.addressLine2, formData.landmark].filter(Boolean).join(", ")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {[formData.city, formData.state, formData.pincode].filter(Boolean).join(" · ")}
                </p>
              </div>
              <span className="text-xs font-semibold text-foreground group-hover:underline whitespace-nowrap mt-0.5 shrink-0">
                Edit
              </span>
            </div>
          </button>
        ) : (
          <div className="space-y-4">
            {/* Use my location */}
            <button
              type="button"
              onClick={handleUseLocation}
              disabled={geoState === "loading" || geoState === "done"}
              className={`w-full flex items-center justify-center gap-2 py-2.5 border rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
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

            <InputField
              label="Address Line 1"
              icon={MapPin}
              name="addressLine1"
              placeholder="House / Flat / Block No."
              value={formData.addressLine1}
              onChange={handleChange}
            />
            <InputField
              label="Address Line 2"
              icon={MapPin}
              name="addressLine2"
              placeholder="Street, Colony, Area"
              value={formData.addressLine2}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Landmark"
                icon={MapPin}
                name="landmark"
                placeholder="Near metro, school, etc."
                value={formData.landmark}
                onChange={handleChange}
              />
              <InputField
                label="Pincode"
                icon={MapPin}
                name="pincode"
                placeholder="6-digit pincode"
                value={formData.pincode}
                onChange={handlePincodeChange}
                maxLength={6}
                inputMode="numeric"
                hint={
                  pincodeState === "loading" ? (
                    <span className="text-muted-foreground flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Looking up…</span>
                  ) : pincodeState === "done" ? (
                    <span className="text-success flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> City &amp; state filled</span>
                  ) : pincodeState === "error" ? (
                    <span className="text-muted-foreground">Not found — enter manually</span>
                  ) : null
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                  City
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-secondary/30 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground focus:bg-background transition-all appearance-none"
                  >
                    <option value="">Select city</option>
                    {SERVED_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <InputField
                label="State"
                icon={MapPin}
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
              />
            </div>

            <ServiceabilityNote />

            {/* Confirm button — collapses the form */}
            {formData.addressLine1 && (
              <button
                type="button"
                onClick={() => setAddrEditing(false)}
                className="w-full py-2.5 bg-secondary border border-border text-foreground text-sm font-semibold rounded-xl hover:bg-secondary/80 transition-colors"
              >
                Confirm Address
              </button>
            )}
          </div>
        )}
      </CheckoutCard>

      {/* 3. Rental Start Details */}
      <CheckoutCard
        title="Rental Start Details"
        icon={Calendar}
        subtitle="When would you like your items delivered and set up?"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Preferred Start Date"
            icon={Calendar}
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            min={dateNDaysFromToday(2)}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Time Slot
            </label>
            <div className="grid grid-cols-2 gap-2">
              {slots.length > 0
                ? slots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, timeSlot: slot.id }))}
                      className={`py-2.5 px-2 rounded-xl border text-[10px] md:text-xs font-bold transition-all ${
                        formData.timeSlot === slot.id
                          ? "bg-foreground border-foreground text-background shadow-sm"
                          : "bg-secondary/30 border-border text-muted-foreground hover:border-foreground/35"
                      }`}
                    >
                      {slot.slot_name}
                    </button>
                  ))
                : ["8AM - 10AM", "10AM - 12PM", "12PM - 2PM", "2PM - 4PM"].map((label) => (
                    <button
                      key={label}
                      type="button"
                      disabled
                      className="py-2.5 px-2 rounded-xl border text-[10px] md:text-xs font-bold bg-secondary/30 border-border text-muted-foreground/40 animate-pulse"
                    >
                      {label}
                    </button>
                  ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">
              This is a preferred slot and does not confirm the actual time. Our delivery team will get in touch with you soon.
            </p>
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Special Instructions (Optional)
            </label>
            <textarea
              name="instructions"
              rows={3}
              placeholder="e.g. Entry via Gate 2, Lift access available, call after arriving at gate."
              className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground focus:bg-background transition-all resize-none"
              value={formData.instructions}
              onChange={handleChange}
            />
          </div>
        </div>
      </CheckoutCard>

      {/* 4. Included Benefits */}
      <div className="bg-success rounded-2xl p-5 md:p-6 text-white shadow-lg shadow-success/25 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h4 className="text-base font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Included with your RentBasket order
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
            {[
              "Free Delivery",
              "Free Installation",
              "Free Maintenance",
              "Flexible Duration",
              "Refundable Deposit",
              "Relocation Support",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-white/70" />
                <span className="text-xs font-medium text-white/90 uppercase tracking-wide">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      </div>
    </div>
  );
};

export default CheckoutForm;
