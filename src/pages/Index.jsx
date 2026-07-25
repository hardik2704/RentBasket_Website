import { useState, useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FurnitureGallery from "@/components/FurnitureGallery";
// import HowItWorks from "@/components/HowItWorks";
// import FoundersSection from "@/components/FoundersSection";
import MythOrFact from "@/components/MythOrFact";
import Testimonials from "@/components/Testimonials";
import WhatMakesDifferent from "@/components/WhatMakesDifferent";
// App branding removed from the homepage for now — DownloadSection hidden.
// import DownloadSection from "@/components/DownloadSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("Furniture");
  const galleryRef = useRef(null);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    galleryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
        <div ref={galleryRef} className="-mt-2">
          <FurnitureGallery />
        </div>
        <WhatMakesDifferent />
        {/* v1: How it works — hidden for this release */}
        {/* <HowItWorks /> */}
        {/* v1: Founders — hidden for this release */}
        {/* <FoundersSection /> */}
        <MythOrFact />
        <Testimonials />
        {/* App branding removed from homepage for now */}
        {/* <DownloadSection /> */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
