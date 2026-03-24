import { Phone } from "lucide-react";

const FloatingCallButton = () => {
  return (
    <a
      href="tel:+91XXXXXXXXXX"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-elevated hover:scale-110 transition-transform md:hidden"
      aria-label="Call us"
    >
      <Phone className="w-6 h-6" />
    </a>
  );
};

export default FloatingCallButton;
