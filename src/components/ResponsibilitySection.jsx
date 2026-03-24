import { useRef, useEffect, useState, useCallback } from "react";

// The text content split into paragraphs
const paragraphs = [
  "At RentBasket we make relocation feel effortless 🧳 from day one.",
  "Choose furniture & appliances on rent, get delivery + installation and stay worry-free with support 🛠️ across Gurgaon & Noida 📍",
  "So your house becomes a home 🏠✨ without the heavy spending.",
];

// Flatten all words across paragraphs into a single array with paragraph indices
const allWords = [];
paragraphs.forEach((para, pIdx) => {
  para.split(/\s+/).forEach((word) => {
    allWords.push({ word, paraIdx: pIdx });
  });
});

const ScrollRevealText = ({ isMobile }) => {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Start revealing when the section enters the viewport
    // End revealing when the section is about to leave
    const sectionTop = rect.top;
    const sectionHeight = rect.height;

    // The reveal range: from when the section top hits the bottom of viewport
    // to when the section top hits 20% from the top of viewport
    const revealStart = windowHeight; // section top at bottom of screen
    const revealEnd = windowHeight * 0.15; // section top near top of screen

    // Map sectionTop from [revealStart, revealEnd] to [0, 1]
    const rawProgress = (revealStart - sectionTop) / (revealStart - revealEnd);
    const clampedProgress = Math.max(0, Math.min(1, rawProgress));

    setProgress(clampedProgress);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Group words back into paragraphs for rendering
  const renderParagraphs = () => {
    let globalWordIndex = 0;
    return paragraphs.map((para, pIdx) => {
      const words = para.split(/\s+/);
      const wordSpans = words.map((word, wIdx) => {
        const wordProgress = globalWordIndex / allWords.length;
        globalWordIndex++;

        // Each word transitions over a small window
        const wordRevealStart = wordProgress;
        const wordRevealEnd = wordProgress + 1 / allWords.length;

        // Calculate how "revealed" this word is (0 = light, 1 = dark)
        let wordOpacity;
        if (progress >= wordRevealEnd) {
          wordOpacity = 1;
        } else if (progress <= wordRevealStart) {
          wordOpacity = 0;
        } else {
          wordOpacity = (progress - wordRevealStart) / (wordRevealEnd - wordRevealStart);
        }

        // Interpolate from light gray (#d1d5db) to near-black (#1f2937)
        // R: 209 -> 31, G: 213 -> 41, B: 219 -> 55
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

      return (
        <p key={pIdx} className={isMobile ? "" : ""}>
          {wordSpans}
        </p>
      );
    });
  };

  return (
    <div ref={containerRef}>
      {renderParagraphs()}
    </div>
  );
};

const ResponsibilitySection = () => {
  return (
    <section className="section-container py-12 md:py-20">
      {/* Mobile Layout */}
      <div className="flex flex-col lg:hidden max-w-3xl mx-auto text-left lg:text-center">
        <h2
          className="flex justify-items-start text-3xl md:text-4xl lg:text-5xl font-display font-semibold mb-8"
          style={{
            width: "80%",
            margin: "auto",
            marginBottom: "5%",
          }}
        >
          We don't just rent, We take responsibility.
        </h2>

        <div
          className="space-y-6 text-lg md:text-xl text-left"
          style={{
            width: "75%",
            margin: "auto",
          }}
        >
          <ScrollRevealText isMobile={true} />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-col max-w-3xl mx-auto text-center lg:text-center">
        <h2
          className="flex justify-center text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-8"
          style={{
            width: "77%",
            margin: "auto",
            marginBottom: "5%",
          }}
        >
          We don't just rent, We take responsibility.
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
          <ScrollRevealText isMobile={false} />
        </div>
      </div>
    </section>
  );
};

export default ResponsibilitySection;
