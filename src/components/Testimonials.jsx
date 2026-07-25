import { Star } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import VideoTestimonial from "@/components/VideoTestimonial";
import lakshayWebm from "@/assets/testimonial-lakshay.webm";
import lakshayMp4 from "@/assets/testimonial-lakshay.mp4";
import lakshayPoster from "@/assets/testimonial-lakshay-poster.jpg";
import manasviWebm from "@/assets/testimonial-manasvi.webm";
import manasviMp4 from "@/assets/testimonial-manasvi.mp4";
import manasviPoster from "@/assets/testimonial-manasvi-poster.jpg";
import reel01Webm from "@/assets/testimonial-reel01.webm";
import reel01Mp4 from "@/assets/testimonial-reel01.mp4";
import reel01Poster from "@/assets/testimonial-reel01-poster.jpg";

// City is pending from the user — renders name-only until filled.
const videoTestimonials = [
  {
    name: "Lakshay",
    city: "",
    webmSrc: lakshayWebm,
    mp4Src: lakshayMp4,
    poster: lakshayPoster,
  },
  {
    name: "Manasvi",
    city: "",
    webmSrc: manasviWebm,
    mp4Src: manasviMp4,
    poster: manasviPoster,
  },
  {
    name: "Pranjal & Sejal",
    city: "",
    webmSrc: reel01Webm,
    mp4Src: reel01Mp4,
    poster: reel01Poster,
  },
];

const reviews = [
  {
    text: "I rented all my appliances from RentBasket and overall had a really good experience. The items were in great shape, clean, and handled professionally. Pricing felt fair for the convenience and quality. Would definitely recommend it to anyone looking for a hassle-free rental option.",
    name: "Pranjal A.",
    location: "Gurgaon",
  },
  {
    text: "I've used RentBasket in three different flats across Gurgaon, and I can honestly say they're the best rental service I've come across. Every time I've needed to rent something, the process has been seamless, with no surprises or hassles.",
    name: "Shikhar B.",
    location: "Gurgaon",
  },
  {
    text: "RentBasket has been a savior in terms of furnishing our house and also maintaining the aesthetics. We rented beds with storage, household appliances and sofa sets and have been highly satisfied with their service.",
    name: "Urbi K.",
    location: "Gurgaon",
  },
  {
    text: "Bought a double bed on rent as well as appliances (Fridge & Washing Machine). All the products are in excellent condition. The owner & the staff are very courteous. They provided the stuff within four hours of my request.",
    name: "Sneha R.",
    location: "Gurgaon",
  },
  {
    text: "Exceptional value for money. The quality of their furniture is very good, especially considering how competitively priced their products are.",
    name: "Vikram T.",
    location: "Noida",
  },
  {
    text: "I needed a queen size bed urgently so I preferred RentBasket and they delivered on time. The quality of the bed is very good and the staff is very polite and supportive. Awesome service!",
    name: "Neha K.",
    location: "Noida",
  },
  {
    text: "I have rented washing machine and fridge through them. I had a really easy experience. I got the appliance delivered on the same day. Their rental is also very reasonable. Rentbasket team thank you for your great support.",
    name: "Amit D.",
    location: "Noida",
  },
  {
    text: "Incredible furniture at unbeatable prices! The quality is top-notch, and they offer customization options to match your preferred color scheme. The team was super cooperative and made the whole process seamless!",
    name: "Pooja G.",
    location: "Noida",
  },
  {
    text: "The items were in fantastic condition — clean, well-maintained, and handled professionally. The delivery and installation were spot on time. The staff were extremely polite, helpful, and courteous.",
    name: "Rohan B.",
    location: "Gurgaon",
  },
  {
    text: "A reliable place to rent quality furniture and appliances within your budget. We rented a 5-seater sofa with a center table and received the best deal here. The same-day delivery was a great bonus!",
    name: "Divya P.",
    location: "Gurgaon",
  },
  {
    text: "Highly satisfied with the service. I wanted the TV in 4–5 hrs and it was on my doorstep. Will 100% recommend.",
    name: "Karan S.",
    location: "Noida",
  },
  {
    text: "They provided the best service. Hassle-free, fast service and quick refund of security deposit. Had a wonderful experience with them.",
    name: "Meera J.",
    location: "Noida",
  },
];

const row1 = reviews.slice(0, 6);
const row2 = reviews.slice(6, 12);

const StarRating = () => (
  <div className="flex gap-1 mb-3">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={14} fill="currentColor" className="text-gold" />
    ))}
  </div>
);

const Avatar = ({ name }) => {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
      <span className="text-sm font-bold text-primary">{initial}</span>
    </div>
  );
};

const TestimonialCard = ({ text, name, location }) => (
  <div className="w-[280px] md:w-[320px] shrink-0 bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 mx-3">
    <StarRating />
    <p className="text-sm text-muted-foreground leading-relaxed flex-1">"{text}"</p>
    <div className="flex items-center gap-3 mt-1">
      <Avatar name={name} />
      <div>
        <p className="text-sm font-bold text-foreground leading-tight">{name}</p>
        <p className="text-xs text-muted-foreground">{location}</p>
      </div>
    </div>
  </div>
);

// Mobile (< 768px): a native horizontal scroll container that ALSO auto-scrolls.
// A CSS transform animation can't be touch-dragged, so on mobile we drive
// scrollLeft with rAF instead. The user can swipe freely; auto-scroll pauses
// while they touch and resumes after. Looping is seamless via doubled items:
// once we pass the halfway point (one full set of cards) we subtract that width.
const MobileScrollRow = ({ items, speed = 0.4, reverse = false }) => {
  const scrollRef = useRef(null);
  const pausedRef = useRef(false);
  // The browser rounds/quantizes scrollLeft to integer pixels, so sub-pixel
  // steps (0.4px) written then immediately read back from el.scrollLeft get
  // rounded away every frame and the row never visibly moves. Keeping the
  // true position in a float ref (only ever written to the DOM, never read
  // back except to re-sync after a manual swipe) avoids that.
  const posRef = useRef(0);
  const doubled = [...items, ...items];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Reverse rows start at the halfway point and drift left; forward rows
    // start at 0 and drift right. Both wrap seamlessly across one card set.
    const half = el.scrollWidth / 2;
    posRef.current = reverse ? half : 0;
    el.scrollLeft = posRef.current;

    let frame;
    const step = () => {
      if (!pausedRef.current) {
        let next = posRef.current + (reverse ? -speed : speed);
        if (next >= half) next -= half; // forward: loop back to first set
        if (next < 0) next += half;      // reverse: loop back to second set
        posRef.current = next;
        el.scrollLeft = next;
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [speed, reverse]);

  // Re-sync the float position from the real scroll offset after a manual
  // swipe, so auto-scroll resumes from where the user actually left it.
  const resync = () => {
    pausedRef.current = false;
    if (scrollRef.current) posRef.current = scrollRef.current.scrollLeft;
  };

  return (
    <div
      ref={scrollRef}
      className="flex overflow-x-auto no-scrollbar"
      onTouchStart={() => { pausedRef.current = true; }}
      onTouchEnd={resync}
      onTouchCancel={resync}
    >
      {doubled.map((r, i) => (
        <TestimonialCard key={i} {...r} />
      ))}
    </div>
  );
};

const MarqueeRow = ({ items, duration, reverse = false }) => {
  const isMobile = useIsMobile();
  const [paused, setPaused] = useState(false);

  // Mobile: JS-driven native scroller (auto-scroll + swipeable).
  if (isMobile) {
    return <MobileScrollRow items={items} reverse={reverse} />;
  }

  // Tablet / desktop: the auto-scrolling CSS marquee (pauses on hover).
  const doubled = [...items, ...items];
  return (
    <div
      className="relative flex overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex"
        style={{
          animation: `marquee-scroll ${duration}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {doubled.map((r, i) => (
          <TestimonialCard key={i} {...r} />
        ))}
      </div>
    </div>
  );
};

// Staggered vertical offsets so the row reads as rhythm, not a card grid.
// Indexed by position so it holds for both 2 and 3 videos: with 2 the pair
// centers with a light offset; with 3 the middle one sits lower.
const staggerClass = (index, total) => {
  if (total === 2) return index === 0 ? "md:mt-6" : "md:-mt-2";
  return index === 1 ? "md:mt-6" : "md:-mt-2";
};

const VideoTestimonialRow = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  // One "tap for sound" hint for the whole row, not per-card: retires on the
  // first tap anywhere, or after 4s, whichever comes first.
  const [showTapHint, setShowTapHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowTapHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Stable across renders (empty deps + functional updater) so the child's
  // playback effect — which depends on onDeactivate's identity — doesn't
  // spuriously re-fire (and re-call play()) on every click in the row, e.g.
  // when a sibling's tap changes showTapHint/activeIndex and re-renders here.
  const deactivate = useCallback(() => setActiveIndex(null), []);

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Mobile: horizontal scroll-snap, next card peeking to signal swipeability.
          Desktop: centered flex row with per-item vertical stagger. */}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible md:justify-center md:gap-10">
        {items.map((item, index) => (
          <div
            key={item.name}
            className={`w-[58vw] sm:w-[52vw] shrink-0 snap-center md:w-[300px] lg:w-[340px] ${staggerClass(index, items.length)}`}
          >
            <VideoTestimonial
              {...item}
              active={activeIndex === index}
              dimmed={activeIndex !== null && activeIndex !== index}
              showTapHint={showTapHint}
              onToggle={() => {
                setShowTapHint(false);
                setActiveIndex((current) => (current === index ? null : index));
              }}
              onDeactivate={deactivate}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const Testimonials = () => (
  <section className="pt-4 pb-14 md:pt-6 md:pb-20 overflow-hidden bg-white">
    {/* Section heading (moved here from the removed LovedByCustomers fan) */}
    <div className="text-center mb-6 md:mb-8 px-4">
      <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-foreground tracking-tight leading-tight">
        Loved by Customers
      </h2>
      <p className="text-sm text-muted-foreground mt-2">
        Real customers across Gurgaon &amp; Noida
      </p>
    </div>

    <VideoTestimonialRow items={videoTestimonials} />

    {/* CTA bridge: answers "where does a persuaded viewer go" without
        competing with the marquee below for attention. Owns all the spacing
        between the video row and the marquee (tightened per D12). */}
    <div className="text-center mt-4 mb-8 md:mt-8 md:mb-16">
      <Link to="/catalog/" className="btn-outline inline-block">
        Browse the catalogue
      </Link>
    </div>

    {/* Cap + center the marquee within the same max width the rest of the site
        uses (max-w-7xl). The overflow clip + edge-fade mask apply only on
        desktop (md+), where the rows auto-scroll. On mobile each row is a
        native touch-scroll container, so we drop the clip/mask there to let
        the user swipe freely without cards fading at the edges. */}
    <div className="max-w-7xl mx-auto flex flex-col gap-4 md:overflow-hidden md:[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] md:[-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <MarqueeRow items={row1} duration={35} />
      <MarqueeRow items={row2} duration={45} reverse={true} />
    </div>

    <style>{`
      @keyframes marquee-scroll {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
    `}</style>
  </section>
);

export default Testimonials;
