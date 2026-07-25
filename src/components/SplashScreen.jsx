import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import mascotsCouch from "@/assets/ChatGPT Image Jan 17, 2026, 02_58_19 AM 1.png";

const SplashScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fill the progress bar smoothly over the 4000ms duration
    const intervalTime = 40; // 25 frames per second
    const totalSteps = 4000 / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progressPercent = Math.min((currentStep / totalSteps) * 100, 100);
      setProgress(progressPercent);

      if (currentStep >= totalSteps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Sophisticated loading subtexts that cycle during load
  const [loadingText, setLoadingText] = useState("Assembling your basket");
  useEffect(() => {
    const messages = [
      "Polishing the furniture",
      "Finding the perfect sofa",
      "Securing zero-deposit benefits",
      "Almost ready"
    ];
    let msgIndex = 0;
    const textTimer = setInterval(() => {
      if (msgIndex < messages.length) {
        setLoadingText(messages[msgIndex]);
        msgIndex++;
      }
    }, 900);
    return () => clearInterval(textTimer);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
    >
      {/* Soft ambient background radial glow for premium feel */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,87,0.035)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative flex flex-col items-center max-w-sm px-6 text-center z-10">
        {/* Mascot Image - beautifully scaled and animated */}
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-1"
        >
          <img
            src={mascotsCouch}
            alt="RentBasket mascots carrying a couch"
            className="w-48 sm:w-56 md:w-64 h-auto object-contain mix-blend-multiply"
          />
        </motion.div>

        {/* Brand Logo Text - matching official header font */}
        <motion.h1
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2 whitespace-nowrap"
        >
          RentBasket
        </motion.h1>

        {/* Brand Headline/Tagline */}
        <motion.p
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-[11px] sm:text-xs text-muted-foreground/75 tracking-wider mb-6 max-w-xs sm:max-w-sm leading-relaxed"
        >
          Rent quality furniture &amp; appliances in Delhi NCR
        </motion.p>

        {/* Minimalist thin loading line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-32 h-[1.5px] bg-neutral-200/80 rounded-full overflow-hidden mb-4"
        >
          <div
            className="h-full bg-primary transition-all duration-75"
            style={{ width: `${progress}%`, transitionTimingFunction: "linear" }}
          />
        </motion.div>

        {/* Sophisticated status message with AnimatePresence for smooth transitions */}
        <div className="h-4 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingText}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 0.5, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="font-sans text-[10px] sm:text-[11px] text-muted-foreground tracking-[0.1em] uppercase font-semibold"
            >
              {loadingText}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;

