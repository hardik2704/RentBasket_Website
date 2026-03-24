import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FurnitureGallery from "@/components/FurnitureGallery";
import FreeBenefits from "@/components/FreeBenefits";
import ResponsibilitySection from "@/components/ResponsibilitySection";
import HowItWorks from "@/components/HowItWorks";
import FoundersSection from "@/components/FoundersSection";
import MythOrFact from "@/components/MythOrFact";
import Testimonials from "@/components/Testimonials";
import WhatMakesDifferent from "@/components/WhatMakesDifferent";
import DownloadSection from "@/components/DownloadSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FurnitureGallery />
        <FreeBenefits />
        <ResponsibilitySection />
        <HowItWorks />
        <FoundersSection />
        <MythOrFact />
        <Testimonials />
        <DownloadSection />
        <WhatMakesDifferent />
      </main>
      <Footer />
      {/* <FloatingCallButton /> */}
    </div>
  );
};

export default Index;
