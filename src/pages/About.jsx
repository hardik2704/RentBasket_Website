import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Header />
        <main className="w-full bg-white py-12 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="text-center mb-16">
              <h1 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 animate-fade-in">
                About RentBasket
              </h1>
              <p className="text-muted-foreground font-sans text-sm sm:text-base max-w-md mx-auto">
                Redefining home setups for urban professionals and families.
              </p>
            </div>

            {/* Founders Section (Out-of-Bounds overlapping portraits) */}
            <div className="flex flex-col items-center gap-6 sm:gap-4 mb-20 relative max-w-md mx-auto sm:max-w-none">
              {/* Vijay Mahendru's Card */}
              <div className="relative bg-white border border-border shadow-soft rounded-[28px] w-full max-w-[420px] h-[120px] flex items-center pl-36 pr-6 sm:-translate-x-12 z-20">
                {/* Portrait image overlapping out-of-bounds */}
                <div className="absolute bottom-0 left-4 w-28 h-40 overflow-visible flex items-end">
                  <img 
                    src={`${import.meta.env.BASE_URL}vijay.png`} 
                    alt="Vijay Mahendru"
                    className="w-full h-auto max-h-[160px] object-contain object-bottom pointer-events-none transform translate-y-[2px]"
                  />
                </div>
                <div className="flex flex-col justify-center select-none">
                  <h3 className="font-sans font-bold text-xl text-[#040404] leading-tight">Vijay Mahendru</h3>
                  <p className="font-sans font-medium text-sm text-[#6E7B8F] mt-1">Founder</p>
                </div>
              </div>

              {/* Hardik Mahendru's Card */}
              <div className="relative bg-white border border-border shadow-soft rounded-[28px] w-full max-w-[420px] h-[120px] flex items-center pr-36 pl-8 sm:translate-x-12 -mt-4 sm:-mt-6 z-10 self-end sm:self-auto">
                <div className="flex flex-col justify-center select-none">
                  <h3 className="font-sans font-bold text-xl text-[#040404] leading-tight">Hardik Mahendru</h3>
                  <p className="font-sans font-medium text-sm text-[#6E7B8F] mt-1">Co- Founder</p>
                </div>
                {/* Portrait image overlapping out-of-bounds */}
                <div className="absolute bottom-0 right-4 w-[110px] h-[145px] overflow-visible flex items-end">
                  <img 
                    src={`${import.meta.env.BASE_URL}hardik.png`} 
                    alt="Hardik Mahendru"
                    className="w-full h-auto max-h-[150px] object-contain object-bottom pointer-events-none transform translate-y-[2px]"
                  />
                </div>
              </div>
            </div>

            {/* Editorial Story Card */}
            <div className="bg-white border border-border shadow-card rounded-[32px] p-8 sm:p-12 md:p-16 max-w-3xl mx-auto">
              <h2 className="font-sans font-bold text-2xl sm:text-3xl text-[#040404] mb-8 tracking-tight">
                Founding Team behind Rentbasket
              </h2>
              
              <div className="font-sans text-sm sm:text-base text-gray-700 leading-relaxed space-y-6">
                <p className="font-medium text-[#040404] text-base sm:text-lg">
                  Hi! We're the Father-son Duo behind RentBasket.
                </p>
                
                <p>
                  Some of us have been building technology platforms for over 26 years. 
                  Others are bringing the energy of IIT Delhi and the Agentic AI Ecosystem.
                </p>
                
                <p>
                  We've always believed that comfort shouldn't be complicated — especially when life is moving fast.
                </p>
                
                <p>
                  RentBasket is a father-son venture led by Vijay and Hardik Mahendru, built around one mission: to make renting furniture and appliances as easy as ordering online.
                </p>
                
                <p>
                  Over the years, Vijay has founded and scaled multiple ventures — including TalentGum, a live learning platform that now serves students across 50+ countries.
                </p>
                
                <p>
                  Hardik has worked with early-stage startups and built communities like Agentix at IIT Delhi, bringing modern product thinking and a fresh perspective to the company.
                </p>
                
                <p>
                  Now, we're building the platform we always wished existed — a faster, smarter way for young professionals and families to feel at home, without buying everything upfront.
                </p>
                
                <p className="font-medium text-[#040404] border-t border-gray-100 pt-6 mt-6">
                  RentBasket is everything we've learned — turned into India's most trusted rental ecosystem for comfort living.
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default About;
