import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

// Mascot temporarily removed — the old src pointed at a Figma MCP asset URL
// that has since 404'd. Restore with a local /src/assets import once a
// permanent file is provided.

const reviews = [
  {
    name: "Pranjal A.",
    location: "Gurgaon",
    segments: [
      { text: "I rented all my appliances from RentBasket and overall had a really good experience. The items were in great shape, clean, and handled professionally. The delivery and installation were done on time and staff was very polite and helpful, which I really appreciated. Pricing felt fair for the convenience and quality. " },
      { text: "It really elevates my Home for a great House Party! 😉", highlight: true },
      { text: " Would definitely recommend if anyone looking for a hassle-free rental option." },
    ],
  },
  {
    name: "Shikhar B.",
    location: "Gurgaon",
    segments: [
      { text: "I've " },
      { text: "used RentBasket in three different flats across Gurgaon,", highlight: true },
      { text: " and I can honestly say they're the best rental service I've come across. Their rates are affordable, the quality of the products is consistently great, and their service is always on time. What really stands out is how smoothly everything goes — every time I've needed to rent something, the process has been seamless, with no surprises or hassles. If you're looking for furniture or appliance rentals in Gurgaon, I'd definitely recommend giving RentBasket a try!" },
    ],
  },
  {
    name: "Urbi K.",
    location: "Gurgaon",
    segments: [
      { text: "RentBasket has been a savior in terms of furnishing our house and also maintaining the aesthetics of the house.", highlight: true },
      { text: " We rented out multiple products like beds with storage, household appliances and sofa sets and have been highly satisfied with their service as well as their commitment towards any issues ever faced. Thanks to the team at RentBasket for always being around to solve our issues quickly :)" },
    ],
  },
  {
    name: "Divya P.",
    location: "Gurgaon",
    segments: [
      { text: "A reliable place to rent quality furniture and appliances within your budget. We rented a " },
      { text: "5-seater sofa with a center table", highlight: true },
      { text: " and received the best deal here. The " },
      { text: "same-day delivery", highlight: true },
      { text: " was a great bonus — thank you for the prompt service!" },
    ],
  },
  {
    name: "Sneha R.",
    location: "Noida",
    segments: [
      { text: "Overall it was a good experience to rent furniture & appliances from RentBasket. " },
      { text: "Quality of everything is very good.", highlight: true },
      { text: " Provided new TV, washing machine & microwave. Team of RentBasket is " },
      { text: "very cooperative, supportive & nice.", highlight: true },
      { text: " I wish them all the very best!" },
    ],
  },
];

const StarRating = ({ size = 16 }) => (
  <div className="flex gap-1 mb-3">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={size} fill="currentColor" className="text-gold" />
    ))}
  </div>
);

const HIGHLIGHT_CLASS = "text-primary font-semibold underline decoration-primary/20 decoration-2 underline-offset-4";

// Trim the last N words of a string, keeping a leading ellipsis if trimmed.
const tailWords = (text, n) => {
  const words = text.trim().split(/\s+/);
  if (words.length <= n) return text;
  return "… " + words.slice(-n).join(" ");
};

// Keep the first N words of a string, adding a trailing ellipsis if trimmed.
const headWords = (text, n) => {
  const words = text.trim().split(/\s+/);
  if (words.length <= n) return text;
  return words.slice(0, n).join(" ") + " …";
};

// Build a short preview centered on the highlighted segment: a few words of
// lead-in context, the full highlight, then a few words of trailing context.
const previewSegments = (segments, { lead = 4, trail = 8 } = {}) => {
  const hi = segments.findIndex((s) => s.highlight);
  if (hi === -1) {
    // No highlight: just show the opening.
    return [{ text: headWords(segments.map((s) => s.text).join(""), 14) }];
  }
  const out = [];
  const before = segments.slice(0, hi).map((s) => s.text).join("");
  if (before.trim()) out.push({ text: tailWords(before, lead) + " " });
  out.push({ ...segments[hi] });
  const after = segments.slice(hi + 1).map((s) => s.text).join("");
  if (after.trim()) out.push({ text: " " + headWords(after, trail) });
  return out;
};

const ReviewText = ({ segments }) => (
  <p className="text-sm text-muted-foreground leading-relaxed font-sans">
    {segments.map((seg, i) =>
      seg.highlight ? (
        <span key={i} className={HIGHLIGHT_CLASS}>{seg.text}</span>
      ) : (
        <span key={i}>{seg.text}</span>
      )
    )}
  </p>
);

const Avatar = ({ name }) => {
  const initial = name ? name.charAt(0).toUpperCase() : "U";
  return (
    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
      <span className="text-xs font-bold text-primary">{initial}</span>
    </div>
  );
};

const ReviewCard = ({ review, className = "" }) => (
  <div
    className={`bg-card border border-border/50 rounded-2xl p-5 w-[280px] md:w-[320px] h-full flex flex-col justify-between ${className}`}
    style={{ boxShadow: "var(--shadow-card)" }}
  >
    <div>
      <StarRating />
      <ReviewText segments={review.segments} />
    </div>
    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border/30">
      <Avatar name={review.name} />
      <div>
        <p className="text-sm font-bold text-foreground leading-tight">{review.name}</p>
        <p className="text-xs text-muted-foreground">{review.location}</p>
      </div>
    </div>
  </div>
);


const CollapsibleMobileCard = ({ review, expanded, onToggle, offsetX, rotate, zIndex, marginTop }) => (
  <motion.div
    layout
    onClick={onToggle}
    className="cursor-pointer"
    animate={{
      marginTop,
      x: expanded ? 0 : offsetX,
      rotate: expanded ? 0 : rotate,
    }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    style={{
      zIndex: expanded ? 50 : zIndex,
    }}
  >
    <div
      className="bg-card border border-border/50 rounded-2xl p-5 w-[280px] flex flex-col shadow-xl"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <StarRating />
      <ReviewText segments={expanded ? review.segments : previewSegments(review.segments)} />
      <button
        type="button"
        className="self-start mt-2 text-xs font-semibold text-primary hover:underline underline-offset-2"
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
      >
        {expanded ? "Show less ↑" : "Read more →"}
      </button>
      <div className="flex items-center gap-3 mt-5 pt-3 border-t border-border/30">
        <Avatar name={review.name} />
        <div>
          <p className="text-sm font-bold text-foreground leading-tight">{review.name}</p>
          <p className="text-xs text-muted-foreground">{review.location}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

const LovedByCustomers = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [expandedMobile, setExpandedMobile] = useState(null);

  return (
    <section className="pt-10 md:pt-14 bg-white">
      <div className="section-container text-center mb-[-8px] relative z-0">
        <h2 className="font-display font-bold text-4xl md:text-6xl text-foreground leading-tight">
          Loved by Customers
        </h2>
      </div>

      {/* Mobile layout: static staggered vertical card stack */}
      <div className="md:hidden relative px-4 pt-2 pb-10 overflow-hidden">
        {/* TODO: mascot image restored once a permanent local asset is provided —
            the previous src pointed at a temporary Figma MCP asset URL that 404s. */}

        {/* Staggered review cards (collapsible) */}
        <div className="relative z-20 flex flex-col items-center">
          {reviews.slice(0, 3).map((review, idx) => {
            const offsetX = [-24, 32, -16];
            const rotates = [-2, 2, -2];
            // Cards overlap by -24px in the collapsed stack. Remove the overlap
            // when the card directly above is expanded, so this card drops down
            // clear of it instead of tucking underneath.
            const overlap = idx === 0 || expandedMobile === idx - 1 ? 0 : -24;
            return (
              <CollapsibleMobileCard
                key={idx}
                review={review}
                expanded={expandedMobile === idx}
                onToggle={() => setExpandedMobile((cur) => (cur === idx ? null : idx))}
                offsetX={offsetX[idx]}
                rotate={rotates[idx]}
                zIndex={20 + idx}
                marginTop={overlap}
              />
            );
          })}
        </div>
      </div>

      {/* Desktop layout: fanned overlapping card cluster.
          Built responsive-by-construction: the foreground (3 cards) is a normal
          centered flex column that reflows at any width. */}
      {/* TODO: mascot image restored once a permanent local asset is provided —
          the previous src pointed at a temporary Figma MCP asset URL that 404s. */}
      <div className="hidden md:flex relative w-full max-w-7xl mx-auto items-end justify-center min-h-[440px] md:min-h-[520px] pb-8 overflow-x-clip">
        <motion.div
          className="relative flex flex-col items-center z-10 self-end"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative flex items-start justify-center mt-2 px-4">
            {reviews.slice(0, 3).map((review, idx) => {
              const isHovered = hoveredIndex === idx;
              const isAnyHovered = hoveredIndex !== null;
              
              const initialRotates = [-3, 1, 3];
              
              return (
                <motion.div
                  key={idx}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative shrink-0 cursor-pointer"
                  style={{
                    zIndex: isHovered ? 40 : (idx === 1 ? 30 : 20),
                  }}
                  animate={{
                    scale: isHovered ? 1.04 : 1,
                    rotate: isHovered ? 0 : initialRotates[idx],
                    y: isHovered ? -15 : 0,
                    x: isHovered ? (idx === 0 ? -30 : idx === 2 ? 30 : 0) : 0,
                    opacity: isAnyHovered && !isHovered ? 0.5 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                >
                  <ReviewCard 
                    review={review} 
                    className={idx === 1 ? "shadow-2xl" : "shadow-xl"}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};


export default LovedByCustomers;
