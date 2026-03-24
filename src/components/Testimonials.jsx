import React from "react";
import { Star } from "lucide-react";
import turtleMascot from "@/assets/Untitled-22 1.png";

const TestimonialCard = ({ className, content, showHighlight = false }) => (
  <div
    className={`
    w-[290px] md:w-[350px] p-6 rounded-2xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.12)] 
    border border-gray-100 flex flex-col gap-3 transition-all duration-500 ${className}
  `}
  >
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} fill="#FBBF24" className="text-yellow-400" />
      ))}
    </div>
    <p
      className={`text-[13px] md:text-sm leading-relaxed text-gray-600 font-medium ${
        showHighlight
          ? "underline decoration-[#8B5CF6] decoration-2 underline-offset-4"
          : ""
      }`}
    >
      "{content}"
    </p>
  </div>
);

const Testimonials = () => {
  const text =
    "I rented all my appliances from RentBasket and the items were in great shape, clean, and handled professionally. It really elevates my Home for a great House Party!";
  const text1 =
    "I've used RentBasket in three different flats across Gurgaon, and I can honestly say they're the best rental service I've come across. What really stands out is how smoothly everything goes! I'd definitely recommend giving RentBasket a try!";
  const text2 =
    "RentBasket is a savior in terms of furnishing and maintaining the aesthetics of the house. Thanks to the team at RentBasket for always being around to solve our issues quickly, ever faced :) Definitely recommend!";

  return (
    <section className="relative pb-6 lg:pb-28 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-0 lg:mb-12 text-black tracking-tight">
          Loved by Customers
        </h2>

        {/* Parent container providing responsive boundary */}
        <div className="relative w-full flex flex-col items-center justify-top pt-28 md:pt-56 min-h-[720px] md:min-h-[500px]">
          <div className="relative w-full flex justify-center items-center mt-0">
            {/* 1. LEFT CARD: MINIMUM CORNER BEHIND */}
            <TestimonialCard
              content={text1}
              className="
                /* Mobile: Unchanged vertical stack */
                absolute top-[180px] left-0 z-10 rotate-6
                /* Desktop: Pushed out 340px so only 10px corner overlaps behind primary */
                md:absolute md:top-44 md:left-1/2 md:-translate-x-[340px] md:z-10 md:-rotate-3 md:opacity-90
              "
            />

            {/* 2. PRIMARY CENTER CARD & MASCOT */}
            <div className="relative z-30 md:scale-110">
              {/* Mascot anchored to this card */}
              <div
                className="absolute z-50 pointer-events-none
                -top-20 -right-4 
                md:-top-56 md:left-1/2 md:-translate-x-1/2
              "
              >
                <img
                  src={turtleMascot}
                  alt="Mascot"
                  className="h-44 w-44 md:h-72 md:w-72 object-contain"
                />
              </div>

              <TestimonialCard
                content={text}
                className="rotate-[-2deg] md:rotate-0"
              />
            </div>

            {/* 3. RIGHT CARD: MINIMUM CORNER ON TOP */}
            <TestimonialCard
              content={text2}
              className="
                /* Mobile: Unchanged vertical stack */
                absolute top-[350px] right-0 z-10 -rotate-3
                /* Desktop: Pushed out 340px so only 10px corner overlaps on top of primary */
                md:absolute md:top-40 md:right-1/2 md:translate-x-[340px] md:z-40 md:rotate-3
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
