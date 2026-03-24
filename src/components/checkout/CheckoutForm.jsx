import { User, Phone, Mail, MapPin, Calendar, Clock, Info, CheckCircle2 } from "lucide-react";

/**
 * Reusable Card for Checkout Sections
 */
const CheckoutCard = ({ title, icon: Icon, children, subtitle }) => (
  <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft mb-6">
    <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between bg-secondary/10">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
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

/**
 * Standard Input Field
 */
const InputField = ({ label, icon: Icon, placeholder, type = "text", ...props }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
        <Icon className="w-4 h-4" />
      </div>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3 bg-secondary/30 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background transition-all"
        {...props}
      />
    </div>
  </div>
);

const CheckoutForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full">
      {/* 1. Contact Information */}
      <CheckoutCard 
        title="Contact Information" 
        icon={User}
        subtitle="We'll use these details to share delivery updates and your invoice."
      >
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
            label="Mobile Number" 
            icon={Phone} 
            name="phone"
            placeholder="e.g. 99588 58473" 
            value={formData.phone}
            onChange={handleChange}
          />
          <div className="md:col-span-2">
            <InputField 
              label="Email Address" 
              icon={Mail} 
              name="email"
              type="email"
              placeholder="e.g. rahul@example.com" 
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>
      </CheckoutCard>

      {/* 2. Delivery Address */}
      <CheckoutCard 
        title="Delivery Address" 
        icon={MapPin}
        subtitle="Currently serving Gurgaon, Noida, and select areas across Delhi NCR."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <InputField 
              label="House / Flat / Building No." 
              icon={MapPin} 
              name="addressLine1"
              placeholder="e.g. Flat 402, Block B, Silver Oaks" 
              value={formData.addressLine1}
              onChange={handleChange}
            />
          </div>
          <div className="md:col-span-2">
            <InputField 
              label="Street / Area / Sector" 
              icon={MapPin} 
              name="addressLine2"
              placeholder="e.g. Sector 45, Near Huda City Center" 
              value={formData.addressLine2}
              onChange={handleChange}
            />
          </div>
          <InputField 
            label="Landmark (Optional)" 
            icon={MapPin} 
            name="landmark"
            placeholder="e.g. Opp. Central Park" 
            value={formData.landmark}
            onChange={handleChange}
          />
          <InputField 
            label="Pincode" 
            icon={MapPin} 
            name="pincode"
            placeholder="e.g. 122001" 
            value={formData.pincode}
            onChange={handleChange}
          />
          <InputField 
            label="City" 
            icon={MapPin} 
            name="city"
            placeholder="e.g. Gurgaon" 
            value={formData.city}
            onChange={handleChange}
          />
          <InputField 
            label="State" 
            icon={MapPin} 
            name="state"
            placeholder="e.g. Haryana" 
            value={formData.state}
            onChange={handleChange}
          />
        </div>
        
        <div className="mt-4 p-3 bg-primary/5 border border-primary/10 rounded-xl flex gap-3">
          <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <span className="font-bold text-primary">Serviceability Note:</span> If your pincode is outside our primary zone, our team will coordinate for a custom delivery quote.
          </p>
        </div>
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
            min={new Date().toISOString().split("T")[0]}
          />
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Time Slot
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Morning", "Afternoon", "Evening"].map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, timeSlot: slot }))}
                  className={`py-2.5 px-1 rounded-xl border text-[10px] md:text-xs font-bold transition-all ${
                    formData.timeSlot === slot
                      ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                      : "bg-secondary/30 border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Special Instructions (Optional)
            </label>
            <textarea
              name="instructions"
              rows={3}
              placeholder="e.g. Entry via Gate 2, Lift access available, call after arriving at gate."
              className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background transition-all resize-none"
              value={formData.instructions}
              onChange={handleChange}
            />
          </div>
        </div>
      </CheckoutCard>

      {/* 4. Included Benefits Trust Card */}
      <div className="bg-green-600 rounded-2xl p-5 md:p-6 text-white shadow-lg shadow-green-600/20 mb-8 relative overflow-hidden">
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
                <CheckCircle2 className="w-3.5 h-3.5 text-green-200" />
                <span className="text-xs font-medium text-green-50 uppercase tracking-wide">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Abstract background element */}
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      </div>
    </div>
  );
};

export default CheckoutForm;
