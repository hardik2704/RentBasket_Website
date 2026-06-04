import React, { useState } from "react";
import { motion } from "framer-motion";

// Subtle inset border — works for both BELIEF and REALITY faces.
const InnerBorder = () => (
  <div
    className="absolute inset-2 sm:inset-3 md:inset-4 border-[1.5px] border-white/25 pointer-events-none z-0 rounded-md"
  />
);

const Card = ({ belief, reality }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group h-[280px] sm:h-[320px] md:h-[350px] w-full [perspective:1000px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsFlipped(!isFlipped);
        }
      }}
    >
      <div
        className={`relative h-full w-full rounded-2xl transition-all duration-700 [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
      >
        {/* FRONT SIDE */}
        <div
          className="absolute inset-0 h-full w-full rounded-2xl bg-gradient-to-br from-myth-front-from to-myth-front-to p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-lg border border-white/20 overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg)" // Explicitly set front face rotation
          }}
        >
          <InnerBorder />
          {/* Responsive Label */}
          <p className="text-white/90 text-[10px] sm:text-xs md:text-sm font-medium mb-2 md:mb-6 italic z-10">
            BELIEF
          </p>
          {/* Responsive Question Text */}
          <h3 className="text-white text-sm sm:text-lg md:text-xl lg:text-lg font-bold leading-tight px-1 sm:px-2 z-10 font-sans">
            "{belief}"
          </h3>
        </div>

        {/* BACK SIDE */}
        <div
          className="absolute inset-0 h-full w-full rounded-2xl bg-gradient-to-b from-myth-back-from to-myth-back-to p-4 sm:p-6 md:p-7 flex flex-col items-center justify-start shadow-2xl border border-white/10 overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <InnerBorder />
          {/* Watermark REALITY heading — left-aligned, sized to fit, brand display font, gentle ghost */}
          <h2 className="text-white text-3xl sm:text-4xl md:text-[2.5rem] font-display font-bold mb-3 md:mb-4 tracking-tight opacity-50 z-10 leading-none self-start">
            REALITY
          </h2>
          {/* Reality copy — center-aligned body text on muted white for legibility */}
          <p className="text-white/90 text-xs sm:text-sm md:text-[15px] leading-snug md:leading-relaxed font-sans font-medium z-10 text-center">
            {reality}
          </p>
        </div>
      </div>
    </div>
  );
};

const MythOrFact = () => {
  const data = [
    {
      belief: "Buying is always cheaper than renting.",
      reality:
        "Renting is more economical for usage up to ~30 months compared to buying - plus you avoid resale hassles and depreciation.",
    },
    {
      belief: "Rental furniture is always old or broken.",
      reality:
        "RentBasket products are either new or in mint condition. Every item goes through sanitization and strict quality checks before delivery.",
    },
    {
      belief: "Rentals have boring designs and limited options.",
      reality:
        "RentBasket offers modern, stylish furniture with multiple designs and color options to match your home.",
    },
    {
      belief: "Rental plans are full of hidden costs and traps.",
      reality:
        "RentBasket believes in transparent pricing with no hidden costs - what you see is what you pay.",
    },
    {
      belief: "Repairs are slow when you rent.",
      reality:
        "RentBasket has a proven track record of fast service, and repairs are handled quickly and at no additional cost.",
    },
    {
      belief: "You must be locked in for long periods.",
      reality:
        "RentBasket offers flexible lock-in options ranging from just 3 months to 12 months, so you can rent for exactly as long as you need.",
    },
  ];

  return (
    <section className="bg-background pt-4 md:pt-6 pb-8 md:pb-10 px-4 md:px-6">
      <div className="text-center mb-6 md:mb-8">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Belief or Reality?
        </motion.h2>
        <p className="text-muted-foreground text-sm md:text-lg">
          Let's bust some Myths!
        </p>
      </div>
      <div className="w-full lg:w-1/2 m-auto">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-10">
          {data.map((item, index) => (
            <Card key={index} belief={item.belief} reality={item.reality} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MythOrFact;
