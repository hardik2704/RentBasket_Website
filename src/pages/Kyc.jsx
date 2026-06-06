import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  ChevronLeft,
  CreditCard,
  Camera,
  FileText,
  Upload,
  Check,
  X,
  ShieldCheck,
  Lock,
} from "lucide-react";
import logo from "@/assets/7 1.png";
import { toast } from "sonner";

const DOCS = [
  { id: "aadhaarFront", label: "Aadhaar Front", hint: "Front side with photo & number", icon: CreditCard, accept: "image/*" },
  { id: "aadhaarBack", label: "Aadhaar Back", hint: "Back side with address", icon: CreditCard, accept: "image/*" },
  { id: "selfie", label: "Selfie", hint: "A clear photo of your face", icon: Camera, accept: "image/*" },
  { id: "rentAgreement", label: "Property Rent Agreement", hint: "Image or PDF of your agreement", icon: FileText, accept: "image/*,application/pdf" },
];

const Kyc = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData || null;

  // { [id]: { name, isImage, url } }
  const [files, setFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timers = useRef([]);

  // Revoke object URLs + clear timers on unmount
  useEffect(
    () => () => {
      Object.values(files).forEach((f) => f?.url && URL.revokeObjectURL(f.url));
      timers.current.forEach(clearTimeout);
    },
    [files]
  );

  const uploadedCount = DOCS.filter((d) => files[d.id]).length;
  const allUploaded = uploadedCount === DOCS.length;

  const handleSelect = (docId, fileList) => {
    const file = fileList?.[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    setFiles((prev) => {
      // revoke a previous preview for this slot
      if (prev[docId]?.url) URL.revokeObjectURL(prev[docId].url);
      return {
        ...prev,
        [docId]: { name: file.name, isImage, url: isImage ? URL.createObjectURL(file) : null },
      };
    });
  };

  const handleRemove = (docId) => {
    setFiles((prev) => {
      if (prev[docId]?.url) URL.revokeObjectURL(prev[docId].url);
      const next = { ...prev };
      delete next[docId];
      return next;
    });
  };

  const handleSubmit = () => {
    if (!allUploaded || isSubmitting) return;
    setIsSubmitting(true);
    // Simulate document verification
    timers.current.push(
      setTimeout(() => {
        toast.success("KYC verified — your order is confirmed!", {
          description: "Our team will reach out to schedule delivery.",
        });
        navigate("/order-success", { state: { orderData, kycComplete: true } });
      }, 2200)
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Minimal Navbar */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border py-4">
        <div className="section-container flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105">
              <img src={logo} alt="RentBasket logo" className="w-24 md:w-28" />
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-2 text-success bg-success-muted px-3 py-1.5 rounded-full border border-success-border">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Encrypted & Secure</span>
          </div>
        </div>
      </header>

      <main className="section-container mt-4 md:mt-6">
        <div className="max-w-2xl mx-auto">
          {/* Back */}
          <Link
            to="/order-success"
            state={{ orderData }}
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Order
          </Link>

          {/* Heading */}
          <div className="mt-4 mb-6">
            <h1 className="text-2xl md:text-4xl font-black font-display text-foreground tracking-tight">
              Complete your KYC
            </h1>
            <p className="text-[11px] md:text-sm text-muted-foreground font-medium mt-1">
              Upload these 4 documents to verify your identity. This confirms your rental order
              {orderData?.orderId ? ` (#${orderData.orderId})` : ""}.
            </p>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {uploadedCount} of {DOCS.length} uploaded
              </span>
              {allUploaded && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-success">
                  <Check className="w-3.5 h-3.5" /> All documents ready
                </span>
              )}
            </div>
            <div className="h-2 w-full rounded-full bg-secondary/60 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${(uploadedCount / DOCS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Upload tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DOCS.map((doc) => {
              const Icon = doc.icon;
              const uploaded = files[doc.id];
              return (
                <div
                  key={doc.id}
                  className={`relative rounded-2xl border-2 p-4 transition-all ${
                    uploaded ? "border-success/40 bg-success-muted/40" : "border-dashed border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${uploaded ? "bg-success text-white" : "bg-primary/10 text-primary"}`}>
                        {uploaded ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground leading-tight">{doc.label}</p>
                        <p className="text-[10px] text-muted-foreground">{doc.hint}</p>
                      </div>
                    </div>
                    {uploaded && (
                      <button
                        onClick={() => handleRemove(doc.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        aria-label={`Remove ${doc.label}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {uploaded ? (
                    <div className="flex items-center gap-3 rounded-xl bg-background border border-border/60 p-2">
                      {uploaded.isImage ? (
                        <img src={uploaded.url} alt={doc.label} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <span className="text-xs font-medium text-foreground truncate">{uploaded.name}</span>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-secondary/30 border border-border/50 py-5 cursor-pointer hover:bg-secondary/50 transition-colors">
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-xs font-bold text-primary">Upload</span>
                      <span className="text-[10px] text-muted-foreground">{doc.accept.includes("pdf") ? "Image or PDF" : "JPG / PNG"}</span>
                      <input
                        type="file"
                        accept={doc.accept}
                        className="hidden"
                        onChange={(e) => handleSelect(doc.id, e.target.files)}
                      />
                    </label>
                  )}
                </div>
              );
            })}
          </div>

          {/* Privacy note */}
          <div className="mt-5 flex items-start gap-2 text-[11px] text-muted-foreground bg-primary/5 border border-primary/10 rounded-xl p-3">
            <Lock className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
            <span>Your documents are encrypted and used only for identity verification as per RentBasket's rental terms.</span>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!allUploaded || isSubmitting}
            className="gradient-coral w-full py-4 mt-6 rounded-2xl font-black text-lg shadow-lg shadow-primary/30 transition-all hover:shadow-primary/40 hover:opacity-95 active:scale-[0.98] disabled:opacity-60 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isSubmitting ? "Verifying documents..." : allUploaded ? "Submit & Confirm Order" : `Upload all ${DOCS.length} documents to continue`}
            {!isSubmitting && allUploaded && <ShieldCheck className="w-5 h-5" />}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Kyc;
