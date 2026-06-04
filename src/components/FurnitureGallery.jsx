import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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

import best1 from "@/assets/Bestsellers/1.png";
import best2 from "@/assets/Bestsellers/3.png";
import best3 from "@/assets/Bestsellers/5.png";
import best4 from "@/assets/Bestsellers/8.png";
import best5 from "@/assets/Bestsellers/9.png";
import best6 from "@/assets/Bestsellers/10.png";
import best7 from "@/assets/Bestsellers/11.png";
import best8 from "@/assets/Bestsellers/12.png";

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
  Combos: [
    { id: 1, src: img2, name: "Living Room Combo" },
    { id: 2, src: app1, name: "Kitchen Starter" },
    { id: 3, src: img4, name: "Bedroom Combo" },
    { id: 4, src: app2, name: "Studio Setup" },
    { id: 5, src: img7, name: "Work-from-Home Combo" },
  ],
  Bestsellers: [
    { id: 1, src: best1, name: "Best Seller Chair" },
    { id: 2, src: best2, name: "Popular Sofa" },
    { id: 3, src: best3, name: "Coffee Maker Pro" },
    { id: 4, src: best4, name: "Premium Mirror" },
    { id: 5, src: best5, name: "Luxury Accent Chair" },
    { id: 6, src: best6, name: "Top-rated Sofa" },
    { id: 7, src: best7, name: "Hero Bedframe" },
    { id: 8, src: best8, name: "Customer Favourite" },
  ],
};

/** Maps home hero tabs to catalog CategoryTabs values */
const HOME_TO_CATALOG_CATEGORY = {
  Furniture: "Furniture",
  Appliances: "Appliances",
  Combos: "Complete Home Setup",
  Bestsellers: "Bestsellers",
};

const catalogHref = (homeCategory) => {
  const catalogCategory =
    HOME_TO_CATALOG_CATEGORY[homeCategory] ?? "Furniture";
  return `/catalog?category=${encodeURIComponent(catalogCategory)}`;
};

const FurnitureGallery = ({ activeCategory = "Furniture" }) => {
  const [autoScroll, setAutoScroll] = useState(true);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  const items = categoryData[activeCategory] || categoryData.Furniture;

  // Auto-scroll horizontally; loops back to start when reaching the end.
  useEffect(() => {
    if (!autoScroll) return;
    intervalRef.current = setInterval(() => {
      const c = containerRef.current;
      if (!c) return;
      const max = c.scrollWidth - c.clientWidth;
      const next = c.scrollLeft + 320;
      c.scrollTo({ left: next >= max - 4 ? 0 : next, behavior: "smooth" });
    }, 3500);
    return () => clearInterval(intervalRef.current);
  }, [autoScroll, activeCategory]);

  // Reset scroll position when switching categories.
  useEffect(() => {
    containerRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [activeCategory]);

  const nudge = (dir) => {
    setAutoScroll(false);
    const c = containerRef.current;
    if (!c) return;
    c.scrollBy({ left: dir * 360, behavior: "smooth" });
    setTimeout(() => setAutoScroll(true), 8000);
  };

  return (
    <motion.section
      className="bg-cream/40 pt-0 pb-8 md:pb-10 -mt-1"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="section-container">
        {/* Catalog scroll */}
        <div className="relative">
          <div
            ref={containerRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {items.map((item) => (
              <Link
                to={catalogHref(activeCategory)}
                key={`${activeCategory}-${item.id}`}
                className="group shrink-0 snap-start h-[360px] md:h-[440px] rounded-2xl overflow-hidden shadow-card bg-white hover:shadow-elevated transition-shadow"
              >
                <img
                  src={item.src}
                  alt={item.name}
                  className="h-full w-auto block max-w-none group-hover:scale-[1.02] transition-transform duration-500"
                />
              </Link>
            ))}
          </div>

          {/* Scroll nudge buttons (desktop) */}
          <button
            onClick={() => nudge(-1)}
            className="hidden md:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 bg-white hover:bg-cream w-11 h-11 rounded-full shadow-elevated items-center justify-center transition-all hover:scale-105 z-10"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={() => nudge(1)}
            className="hidden md:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 bg-white hover:bg-cream w-11 h-11 rounded-full shadow-elevated items-center justify-center transition-all hover:scale-105 z-10"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default FurnitureGallery;
