import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import images
import img1 from "@/assets/Furniture/1.png";
import img2 from "@/assets/Furniture/2.png";
import img3 from "@/assets/Furniture/3.png";
import img4 from "@/assets/Furniture/4.png";
import img5 from "@/assets/Furniture/5.png";
import img6 from "@/assets/Furniture/6.png";
import img7 from "@/assets/Furniture/7.png";
import img8 from "@/assets/Furniture/8.png";
import img9 from "@/assets/Furniture/9.png";
import img10 from "@/assets/Furniture/10.png";

import app1 from "@/assets/Appliances/10.png";
import app2 from "@/assets/Appliances/11.png";
import app3 from "@/assets/Appliances/12.png";
import app4 from "@/assets/Appliances/13.png";
import app5 from "@/assets/Appliances/14.png";
import app6 from "@/assets/Appliances/15.png";

import oth1 from "@/assets/Others/15.png";
import oth2 from "@/assets/Others/16.png";
import oth3 from "@/assets/Others/17.png";

import best1 from "@/assets/Bestsellers/1.png";
import best2 from "@/assets/Bestsellers/3.png";
import best3 from "@/assets/Bestsellers/5.png";
import best4 from "@/assets/Bestsellers/8.png";
import best5 from "@/assets/Bestsellers/9.png";
import best6 from "@/assets/Bestsellers/10.png";
import best7 from "@/assets/Bestsellers/11.png";
import best8 from "@/assets/Bestsellers/12.png";
import best9 from "@/assets/Bestsellers/13.png";
import best10 from "@/assets/Bestsellers/14.png";
import best11 from "@/assets/Bestsellers/15.png";
import best12 from "@/assets/Bestsellers/16.png";




// Category data
const categoryData = {
  Furniture: [
    { id: 1, src: img1, name: "Modern Chair" },
    { id: 2, src: img2, name: "Wooden Chair" },
    { id: 3, src: img3, name: "Office Chair" },
    { id: 4, src: img4, name: "Dining Chair" },
    { id: 5, src: img5, name: "Accent Chair" },
    { id: 6, src: img6, name: "Comfort Sofa" },
    { id: 7, src: img7, name: "Study Table" },
    { id: 8, src: img8, name: "Bookshelf" },
    { id: 9, src: img9, name: "Bed Frame" },
    { id: 10, src: img10, name: "Wardrobe" },
  ],
  Appliances: [
    { id: 1, src: app1, name: "Smart Blender" },
    { id: 2, src: app2, name: "Coffee Maker" },
    { id: 3, src: app3, name: "Air Purifier" },
    { id: 4, src: app4, name: "Microwave Oven" },
    { id: 5, src: app5, name: "4-Slice Toaster" },
    { id: 6, src: app6, name: "Electric Kettle" },
  ],
  Others: [
    { id: 1, src: oth1, name: "Wall Decor" },
    { id: 2, src: oth2, name: "Area Rug" },
    { id: 3, src: oth3, name: "Decorative Mirror" },
  ],
  Bestsellers: [
    { id: 1, src: best1, name: "Best Seller Chair" },
    { id: 2, src: best2, name: "Popular Sofa" },
    { id: 3, src: best3, name: "Coffee Maker Pro" },
    { id: 4, src: best4, name: "Premium Mirror" },
    { id: 5, src: best5, name: "Luxury Accent Chair" },
    { id: 6, src: best6, name: "Luxury Accent Chair" },
    { id: 7, src: best7, name: "Luxury Accent Chair" },
    { id: 8, src: best8, name: "Luxury Accent Chair" },
    { id: 9, src: best9, name: "Luxury Accent Chair" },
    { id: 10, src: best10, name: "Luxury Accent Chair" },
    { id: 11, src: best11, name: "Luxury Accent Chair" },
    { id: 12, src: best12, name: "Luxury Accent Chair" },
  ],
};

const categories = ["Furniture", "Appliances", "Others", "Bestsellers"];

const FurnitureGallery = () => {
  const [activeCategory, setActiveCategory] = useState("Furniture");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [visibleSlides, setVisibleSlides] = useState(1);
  const slideInterval = useRef(null);
  const containerRef = useRef(null);
  const isMobile = useRef(false);

  const items = categoryData[activeCategory] || categoryData.Furniture;

  // Scroll to specific slide (for mobile)
  const scrollToSlide = (index) => {
    if (containerRef.current && isMobile.current) {
      const container = containerRef.current;
      const slide = container.children[0];
      if (slide) {
        const slideWidth = slide.offsetWidth;
        const gap = 12;
        const newScrollLeft = index * (slideWidth + gap);

        container.scrollTo({
          left: newScrollLeft,
          behavior: 'smooth'
        });
        setCurrentSlide(index);
      }
    }
  };

  // Calculate visible slides based on screen size
  useEffect(() => {
    const updateVisibleSlides = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setVisibleSlides(3);
        isMobile.current = false;
      } else if (width >= 1024) {
        setVisibleSlides(3);
        isMobile.current = false;
      } else if (width >= 768) {
        setVisibleSlides(2.5);
        isMobile.current = true;
      } else {
        setVisibleSlides(1.5);
        isMobile.current = true;
      }

      // Reset auto-scroll when switching between mobile/desktop
      setAutoScroll(true);
    };

    updateVisibleSlides();
    window.addEventListener('resize', updateVisibleSlides);
    return () => window.removeEventListener('resize', updateVisibleSlides);
  }, []);

  // Auto scroll functionality for both desktop and mobile
  useEffect(() => {
    const startAutoScroll = () => {
      if (autoScroll && items.length > 0) {
        if (slideInterval.current) clearInterval(slideInterval.current);

        slideInterval.current = setInterval(() => {
          if (isMobile.current) {
            // Mobile auto-scroll logic
            if (containerRef.current) {
              const container = containerRef.current;
              const slide = container.children[0];
              if (slide) {
                const slideWidth = slide.offsetWidth;
                const gap = 12;
                const currentScrollLeft = container.scrollLeft;
                const newScrollLeft = currentScrollLeft + (slideWidth + gap) * 2.5;
                const maxScrollLeft = container.scrollWidth - container.clientWidth;

                if (newScrollLeft >= maxScrollLeft) {
                  // Reset to start
                  container.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                  });
                  setCurrentSlide(0);
                } else {
                  container.scrollTo({
                    left: newScrollLeft,
                    behavior: 'smooth'
                  });
                  // Update current slide based on new scroll position
                  const newIndex = Math.round(newScrollLeft / (slideWidth + gap));
                  setCurrentSlide(newIndex);
                }
              }
            }
          } else {
            // Desktop auto-scroll logic
            const maxSlide = Math.max(0, items.length - Math.floor(visibleSlides));
            setCurrentSlide(prev => prev >= maxSlide ? 0 : prev + 1);
          }
        }, 3000);
      }
    };

    startAutoScroll();

    // Cleanup interval when dependencies change
    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current);
    };
  }, [autoScroll, items.length, activeCategory, visibleSlides, isMobile.current]);

  // Reset slide when category changes
  useEffect(() => {
    setCurrentSlide(0);
    // Reset scroll position for mobile
    if (containerRef.current && isMobile.current) {
      containerRef.current.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    }
  }, [activeCategory]);

  // Navigation handlers
  const nextSlide = () => {
    setAutoScroll(false);

    if (!isMobile.current) {
      const maxSlide = Math.max(0, items.length - Math.floor(visibleSlides));
      setCurrentSlide(prev => prev >= maxSlide ? 0 : prev + 1);
    } else {
      // For mobile, scroll the container
      if (containerRef.current) {
        const container = containerRef.current;
        const slide = container.children[0];
        if (slide) {
          const slideWidth = slide.offsetWidth;
          const gap = 12;
          const currentScrollLeft = container.scrollLeft;
          const newScrollLeft = currentScrollLeft + (slideWidth + gap) * 2.5;
          const maxScrollLeft = container.scrollWidth - container.clientWidth;

          if (newScrollLeft >= maxScrollLeft) {
            container.scrollTo({
              left: 0,
              behavior: 'smooth'
            });
            setCurrentSlide(0);
          } else {
            container.scrollTo({
              left: newScrollLeft,
              behavior: 'smooth'
            });
            const newIndex = Math.round(newScrollLeft / (slideWidth + gap));
            setCurrentSlide(newIndex);
          }
        }
      }
    }

    // Restart auto-scroll after manual interaction
    setTimeout(() => setAutoScroll(true), 10000);
  };

  const prevSlide = () => {
    setAutoScroll(false);

    if (!isMobile.current) {
      const maxSlide = Math.max(0, items.length - Math.floor(visibleSlides));
      setCurrentSlide(prev => prev <= 0 ? maxSlide : prev - 1);
    } else {
      // For mobile, scroll the container
      if (containerRef.current) {
        const container = containerRef.current;
        const slide = container.children[0];
        if (slide) {
          const slideWidth = slide.offsetWidth;
          const gap = 12;
          const currentScrollLeft = container.scrollLeft;
          const newScrollLeft = currentScrollLeft - (slideWidth + gap) * 2.5;

          if (newScrollLeft <= 0) {
            const maxScrollLeft = container.scrollWidth - container.clientWidth;
            container.scrollTo({
              left: maxScrollLeft,
              behavior: 'smooth'
            });
            setCurrentSlide(Math.min(items.length - 1, 5));
          } else {
            container.scrollTo({
              left: newScrollLeft,
              behavior: 'smooth'
            });
            const newIndex = Math.round(newScrollLeft / (slideWidth + gap));
            setCurrentSlide(newIndex);
          }
        }
      }
    }

    // Restart auto-scroll after manual interaction
    setTimeout(() => setAutoScroll(true), 10000);
  };

  // Calculate transform for desktop carousel
  const getTransformValue = () => {
    if (typeof window === 'undefined' || isMobile.current) return 'translateX(0)';

    let slideWidth, gap;
    if (window.innerWidth >= 1280) {
      slideWidth = 320; // w-80 = 80*4 = 320px
      gap = 24;
    } else if (window.innerWidth >= 1024) {
      slideWidth = 288; // w-72 = 72*4 = 288px
      gap = 20;
    } else {
      slideWidth = 256; // w-64 = 64*4 = 256px
      gap = 16;
    }

    return `translateX(-${currentSlide * (slideWidth + gap)}px)`;
  };

  // Update current slide based on scroll position for mobile
  const handleScroll = () => {
    if (containerRef.current && isMobile.current) {
      const container = containerRef.current;
      const scrollLeft = container.scrollLeft;
      const slideWidth = container.children[0]?.offsetWidth || 0;
      const gap = 12;
      const newIndex = Math.round(scrollLeft / (slideWidth + gap));
      if (newIndex !== currentSlide) {
        setCurrentSlide(newIndex);
      }
    }
  };

  return (
    <section className="py-6 md:py-10">
      <div className={`mx-auto ${isMobile.current ? 'w-full px-4' : 'w-[80%] max-w-7xl'}`}>
        {/* Category Tabs - Moved to top */}
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="flex gap-4 md:gap-8 px-4 md:px-0 w-full max-w-4xl justify-center overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-2 py-1 md:px-4 md:py-2 text-sm md:text-base font-medium transition-colors whitespace-nowrap flex-shrink-0 ${activeCategory === category
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Mobile & Tablet - Scrollable Container */}
          {isMobile.current && (
            <div className="relative">
              <div
                ref={containerRef}
                className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-2 pl-4"
                onScroll={handleScroll}
                style={{
                  scrollBehavior: 'smooth',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {items.map((item, index) => (
                  <div
                    key={`${activeCategory}-${item.id}`}
                    className="flex-shrink-0 w-[calc(40vw-20px)] sm:w-[calc(33vw-20px)] md:w-64 aspect-[3/4] rounded-xl md:rounded-2xl overflow-hidden shadow-lg snap-start flex flex-col"
                  >
                    {/* Image Container - Fixed height to prevent cropping */}
                    <div className="flex-1 relative overflow-hidden bg-gray-50">
                      <img
                        src={item.src}
                        alt={item.name}
                        className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {/* <div className="bg-white/95 p-3 md:p-4 border-t">
                      <p className="text-gray-800 font-medium text-sm md:text-base text-center truncate">
                        {item.name}
                      </p>
                    </div> */}
                  </div>
                ))}
                {/* More items placeholder */}
                <div className="flex-shrink-0 w-[calc(40vw-20px)] sm:w-[calc(33vw-20px)] md:w-64 aspect-[3/4] rounded-xl md:rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex flex-col items-center justify-center snap-start mr-4">
                  <div className="text-gray-500 text-sm md:text-lg mb-2">+{items.length}</div>
                  <span className="text-gray-500 text-sm md:text-base">More items</span>
                </div>
              </div>

              {/* Mobile Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110 z-10"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110 z-10"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          )}

          {/* Desktop Carousel */}
          {!isMobile.current && (
            <div className="relative overflow-hidden">
              <div
                className="flex gap-6 transition-transform duration-500 ease-out"
                style={{ transform: getTransformValue() }}
              >
                {items.map((item) => (
                  <div
                    key={`${activeCategory}-${item.id}`}
                    className="flex-shrink-0 w-64 lg:w-72 xl:w-80 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg flex flex-col"
                  >
                    {/* Image Container - Fixed height to prevent cropping */}
                    <div className="flex-1 relative overflow-hidden bg-gray-50">
                      <img
                        src={item.src}
                        alt={item.name}
                        className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {/* <div className="bg-white/95 p-4 border-t">
                      <p className="text-gray-800 font-medium text-base lg:text-lg text-center">
                        {item.name}
                      </p>
                    </div> */}
                  </div>
                ))}
                {/* More items placeholder */}
                <div className="flex-shrink-0 w-64 lg:w-72 xl:w-80 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex flex-col items-center justify-center">
                  <div className="text-gray-500 text-lg xl:text-xl mb-2">+{items.length}</div>
                  <span className="text-gray-500 text-base">More items</span>
                </div>
              </div>

              {/* Desktop Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute -left-12 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-xl transition-all hover:scale-110 z-10"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-xl transition-all hover:scale-110 z-10"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mt-6 md:mt-8">
            {items.slice(0, Math.min(items.length, 6)).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isMobile.current) {
                    setCurrentSlide(index);
                    setAutoScroll(false);
                    setTimeout(() => setAutoScroll(true), 10000);
                  } else {
                    scrollToSlide(index);
                    setAutoScroll(false);
                    setTimeout(() => setAutoScroll(true), 10000);
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all ${currentSlide === index ? 'bg-primary w-6' : 'bg-gray-300'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FurnitureGallery;