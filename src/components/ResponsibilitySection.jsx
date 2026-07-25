import { useRef, useState, useCallback, useEffect } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

const paragraphs = [
  "At RentBasket we make relocation feel effortless 🧳 from day one.",
  "Choose furniture & appliances on rent, get delivery + installation and stay worry-free with support 🛠️ across Gurgaon & Noida 📍",
  "So your house becomes a home 🏠✨ without the heavy spending.",
];

const allWords = [];
paragraphs.forEach((para, pIdx) => {
  para.split(/\s+/).forEach((word) => {
    allWords.push({ word, paraIdx: pIdx });
  });
});

const ScrollRevealText = () => {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const sectionTop = rect.top;

    const revealStart = windowHeight;
    const revealEnd = windowHeight * 0.15;

    const rawProgress = (revealStart - sectionTop) / (revealStart - revealEnd);
    const clampedProgress = Math.max(0, Math.min(1, rawProgress));

    setProgress(clampedProgress);
  }, []);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", handleScroll);

  useEffect(() => {
    handleScroll();
  }, [handleScroll]);

  const renderParagraphs = () => {
    let globalWordIndex = 0;
    return paragraphs.map((para, pIdx) => {
      const words = para.split(/\s+/);
      const wordSpans = words.map((word, wIdx) => {
        const wordProgress = globalWordIndex / allWords.length;
        globalWordIndex++;

        const wordRevealStart = wordProgress;
        const wordRevealEnd = wordProgress + 1 / allWords.length;

        let wordOpacity;
        if (progress >= wordRevealEnd) {
          wordOpacity = 1;
        } else if (progress <= wordRevealStart) {
          wordOpacity = 0;
        } else {
          wordOpacity =
            (progress - wordRevealStart) / (wordRevealEnd - wordRevealStart);
        }

        const r = Math.round(209 + (31 - 209) * wordOpacity);
        const g = Math.round(213 + (41 - 213) * wordOpacity);
        const b = Math.round(219 + (55 - 219) * wordOpacity);

        return (
          <span
            key={`${pIdx}-${wIdx}`}
            style={{
              color: `rgb(${r}, ${g}, ${b})`,
              transition: "color 0.15s ease-out",
            }}
          >
            {word}{" "}
          </span>
        );
      });

      return <p key={pIdx}>{wordSpans}</p>;
    });
  };

  return <div ref={containerRef}>{renderParagraphs()}</div>;
};

const ResponsibilitySection = () => {
  return (
    <section className="section-container pt-2 md:pt-4 pb-4 md:pb-6 bg-cream/50">
      <div className="flex flex-col lg:hidden max-w-3xl mx-auto text-left lg:text-center">
        <h2
          className="flex justify-center text-3xl md:text-4xl lg:text-5xl font-display font-semibold mb-8 text-center"
          style={{
            marginBottom: "5%",
          }}
        >
          We don't just rent out, We take responsibility.
        </h2>

        <div
          className="space-y-6 text-lg md:text-xl text-left"
          style={{
            width: "75%",
            margin: "auto",
          }}
        >
          <ScrollRevealText />
        </div>
      </div>

      <div className="hidden lg:flex flex-col max-w-3xl mx-auto text-center lg:text-center">
        <h2
          className="flex justify-center text-3xl md:text-4xl lg:text-5xl font-display font-semibold mb-8"
          style={{
            marginBottom: "5%",
          }}
        >
          We don't just rent out, We take responsibility.
        </h2>

        <div
          className="space-y-6 text-left"
          style={{
            width: "70%",
            margin: "auto",
            fontSize: "180%",
            marginTop: "5%",
          }}
        >
          <ScrollRevealText />
        </div>
      </div>
    </section>
  );
};

export default ResponsibilitySection;
