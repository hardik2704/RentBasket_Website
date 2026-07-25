import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Play, Star } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

// Controlled by the parent row: `active` says this card is the one playing
// with sound, `dimmed` says a sibling is active instead, `showTapHint` is
// row-level (one hint for the whole row, not per-card). Local state only
// covers what's intrinsic to this card (in-viewport, reduced-motion pref).
const VideoTestimonial = ({
  name,
  city,
  webmSrc,
  mp4Src,
  poster,
  active,
  dimmed,
  showTapHint,
  onToggle,
  onDeactivate,
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Tap for sound just unmutes wherever the video already is — no seek, no
  // restart. Sound turns off the same way: mute in place, keep playing.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (active) {
      if (!inView) {
        onDeactivate();
        return;
      }
      video.muted = false;
      video.loop = false;
      video.play().catch(() => {});
      return;
    }

    video.muted = true;
    video.loop = true;
    if (reducedMotion || dimmed || !inView) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  }, [active, dimmed, inView, reducedMotion, onDeactivate]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onEnded = () => {
      if (active) {
        trackEvent("testimonial_complete", { name });
        onDeactivate();
      }
    };
    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, [active, name, onDeactivate]);

  const handleClick = () => {
    if (!active) trackEvent("testimonial_play", { name });
    onToggle();
  };

  const caption = city ? `${name} · ${city}` : name;
  const ariaLabel = active
    ? `Mute testimonial from ${name}`
    : `Play testimonial from ${name}, with sound`;

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-2 shrink-0">
      <button
        type="button"
        onClick={handleClick}
        aria-label={ariaLabel}
        className="relative w-full aspect-[9/16] rounded-3xl overflow-hidden border border-border bg-card shadow-soft"
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={poster}
          preload="none"
          playsInline
          muted
          loop
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload nofullscreen noremoteplayback"
          aria-hidden="true"
        >
          {webmSrc && <source src={webmSrc} type="video/webm" />}
          {mp4Src && <source src={mp4Src} type="video/mp4" />}
        </video>

        {/* Dark scrim instead of opacity, so the video itself never looks
            half-rendered — only a translucent black layer fades in/out. */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ease-out pointer-events-none ${
            dimmed ? "opacity-100" : "opacity-0"
          }`}
        />

        {reducedMotion && !active && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="flex items-center justify-center w-14 h-14 rounded-full bg-white/90 text-foreground shadow-soft">
              <Play size={22} fill="currentColor" className="ml-0.5" />
            </span>
          </div>
        )}

        {showTapHint && !active && (
          <span className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 text-white text-xs font-bold transition-opacity duration-300">
            <VolumeX size={13} />
            Tap for sound
          </span>
        )}

        <span className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-black/50 text-white">
          {active ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </span>
      </button>

      <div className="text-center flex flex-col items-center">
        <div className="flex gap-0.5 mb-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} fill="currentColor" className="text-gold" />
          ))}
        </div>
        <p className="text-sm font-bold text-foreground leading-tight">{caption}</p>
      </div>
    </div>
  );
};

export default VideoTestimonial;
