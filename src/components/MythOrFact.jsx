import React, { useState } from "react";

const Card = ({ myth, reality }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Common Inner Border Style - Adjusted insets for mobile
  const InnerBorder = ({ variant = "white" }) => (
    <div
      className={`
        absolute 
        inset-2 sm:inset-3 md:inset-4 
        border-[3px] md:border-[2px] 
        pointer-events-none 
        z-0 
        rounded-sm
        ${variant === "white"
          ? "border-white/40"
          : "border-[#ff0000] shadow-[0_0_15px_rgba(255,0,0,0.8),inset_0_0_10px_rgba(255,0,0,0.5)]"
        }
      `}
    />
  );

  return (
    <div
      className="group h-[280px] sm:h-[320px] md:h-[350px] w-full [perspective:1000px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative h-full w-full rounded-2xl transition-all duration-700 [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
      >
        {/* FRONT SIDE */}
        <div
          className="absolute inset-0 h-full w-full rounded-2xl bg-gradient-to-br from-[#ff4d4d] to-[#d01111] p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-lg border border-white/20 overflow-hidden"
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
          className="absolute inset-0 h-full w-full rounded-2xl bg-gradient-to-b from-[#ba3737] to-[#610303] p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-2xl border border-red-900/50 overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)" // Standard back face rotation
          }}
        >
          <InnerBorder />
          {/* Responsive Heading */}
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-2 md:mb-4 tracking-tighter opacity-20 z-10">
            REALITY
          </h2>
          {/* Responsive reality Text */}
          <p className="text-red-100 text-[11px] sm:text-sm md:text-sm leading-snug md:leading-relaxed font-medium z-10 px-1 font-sans">
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
    <section className="bg-gray-50 py-12 md:py-20 px-4 md:px-6">
      <div className="text-center mb-8 md:mb-12">
        {/* Responsive Section Header */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">
          Belief or Reality?
        </h2>
        <p className="text-gray-500 text-sm md:text-lg">
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
