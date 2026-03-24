import { Star } from "lucide-react";
import mascotVideo from "@/assets/kling_20260104_Image_to_Video_Just_Make__1408_0.mp4";

const HeroSection = () => {
  return (
    <section className="section-container py-6 md:py-12 lg:py-16">
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col items-center text-center">
        {/* Mascot */}
        <div className="flex-1 flex justify-center">
          <div className="overflow-hidden h-[200px] xl:h-[400px] 2xl:h-[420px]">
            <video
              src={mascotVideo}
              className="w-full xl:w-96 2xl:w-[700px]"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-0 flex flex-col justify-center">
          <h1
            className="text-center text-4xl xl:text-5xl 2xl:text-6xl font-normal bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(86.65deg, #DF252F 15.65%, #EE1140 53.1%, #FAD694 90.55%)",
              lineHeight: "1.2",
            }}
          >
            <div>
              <span
                className="headline-accent"
                style={{ font: "Playwrite US Trad" }}
              >
                Comfort
              </span>{" "}
              for your home
            </div>
            <div>without the hassle of</div>
            <div>ownership</div>
          </h1>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 mb-4 mt-12">
          <div className="text-center">
            <div className="text-6xl font-bold text-primary">2000+</div>
            <div className="text-xl sm:text-sm text-muted-foreground">
              Happy Customers
            </div>
          </div>
          <div className="text-center flex items-center gap-1 sm:gap-2">
            <div>
              <div className="flex text-6xl font-bold text-gold">
                <Star className="fill-gold text-gold mt-1" />
                <span
                  style={{
                    color: "#D72F26",
                  }}
                >
                  4.9
                </span>
              </div>
              <div className="text-xl sm:text-sm text-muted-foreground">
                Google Rating!
              </div>
            </div>
          </div>
        </div>

        <p className="text-2xl text-muted-foreground mt-12">
          Rent furniture and
        </p>
        <p className="text-2xl text-muted-foreground">
          appliances in{" "}
          <span className="text-primary font-medium">Delhi NCR</span>
        </p>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center gap-12">
        {/* Content - Left */}
        <div className="flex-1 text-center">
          <h1
            className="flex justify-center text-4xl xl:text-5xl 2xl:text-6xl leading-tight mb-8 font-normal
             bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(86.65deg, #DF252F 15.65%, #EE1140 53.1%, #FAD694 90.55%)",
            }}
          >
            <span
              className="headline-accent mr-2"
              style={{
                font: "Playwrite US Trad",
              }}
            >
              Comfort
            </span>
            for your home
          </h1>
          <h1
            className="flex justify-center text-4xl xl:text-5xl 2xl:text-6xl leading-tight mb-8 font-normal
             bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(86.65deg, #DF252F 15.65%, #EE1140 53.1%, #FAD694 90.55%)",
            }}
          >
            without the hassle of ownership
          </h1>

          {/* Mascot - Right */}
          {/* Mascot - Right */}
          <div className="flex-1 flex justify-center">
            <div className="overflow-hidden h-[350px] xl:h-[400px] 2xl:h-[420px]">
              <video
                src={mascotVideo}
                className="w-80 xl:w-96 2xl:w-[700px]"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mb-8 z-5000">
            <div>
              <div
                className="text-4xl font-bold text-primary"
                style={{
                  color: "#D72F26",
                }}
              >
                2000+
              </div>
              <div className="text-sm text-muted-foreground">
                Happy Customers
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div>
                <div className="flex text-4xl font-bold text-gold">
                  <Star className="w-6 h-6 fill-gold text-gold mt-2" />
                  <span
                    style={{
                      color: "#D72F26",
                    }}
                  >
                    4.9
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Google Rating!
                </div>
              </div>
            </div>
          </div>

          <p className="flex justify-center text-2xl text-muted-foreground font-semibold">
            Rent furniture and
          </p>
          <p className="flex justify-center text-2xl text-muted-foreground font-semibold">
            appliances in{" "}
            <span
              className="ml-2 text-primary font-semibold"
              style={{
                color: "#D72F26",
              }}
            >
              Delhi NCR
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
