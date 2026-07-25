import turtleMascot from "@/assets/Group 50.png";
import phoneAppScreen from "@/assets/iPhone 15 Pro.png";

const DownloadSection = () => {
  return (
    <section
      id="download"
      className="relative mt-0 pt-0 bg-background overflow-x-clip"
    >
      {/* Mascot — sits on top of all layers.
          Mobile/tablet (< lg): centered / left-[8%] of the full section, unchanged.
          Desktop (lg+): anchored to a centered max-w-7xl overlay (matching the
          capped content + phone) so it stays above the "DOWNLOAD TODAY" text
          instead of drifting to the far-left edge on wide / zoomed-out screens. */}
      <div className="lg:hidden absolute left-1/2 -translate-x-1/2 md:left-[8%] md:translate-x-0 -top-14 md:-top-22 z-30">
        <img
          src={turtleMascot}
          alt="RentBasket Turtle Mascot"
          className="h-60 w-60 md:h-80 md:w-80 object-contain"
        />
      </div>
      <div className="hidden lg:block absolute inset-x-0 top-10 z-30 pointer-events-none">
        <div className="relative max-w-7xl mx-auto">
          <img
            src={turtleMascot}
            alt="RentBasket Turtle Mascot"
            className="absolute left-4 xl:left-0 h-60 w-60 object-contain"
          />
        </div>
      </div>

      {/* White top area — just a sliver */}
      <div className="relative bg-background pt-8 md:pt-10 h-[100px] md:h-[120px] lg:h-[198px]">
      </div>

      {/* Red gradient platform — extends up behind mascot's lower half with top & bottom shadow */}
      <section className="relative w-full bg-gradient-download pt-14 md:pt-16 lg:pt-28 pb-12 md:pb-16 shadow-[0_0_35px_rgba(0,0,0,0.25)] z-10">
        <div className="section-container relative z-10">
          {/* DOWNLOAD TODAY heading — now sits on the red platform, guiding down */}
          <div className="lg:max-w-[50%] lg:ml-0 mx-auto lg:mx-0 text-center lg:text-left mb-6 lg:mb-10 relative z-10">
            <h1 className="font-display text-4xl md:text-6xl lg:text-5xl font-bold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              DOWNLOAD TODAY
            </h1>
          </div>

          <div className="flex flex-col items-center lg:items-start lg:max-w-md lg:ml-0 mx-auto lg:mx-0">
            {/* Feature Text */}
            <div className="mb-6 md:mb-8 space-y-1 w-full lg:text-left text-center relative z-10">
              <p className="hidden lg:flex text-lg md:text-xl font-semibold text-white md:text-2xl">
                Faster KYC with camera capture
              </p>
              <p className="hidden lg:flex text-lg md:text-xl font-semibold text-white md:text-2xl">
                Live delivery &amp; renewal updates
              </p>
              <p className="text-xl md:text-2xl font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                Track orders and renewals in one place.
              </p>
            </div>

            {/* Phone Mockup for Mobile/Tablet in-flow (centered, overlapping under the text) */}
            <div className="lg:hidden w-full flex justify-center -mt-8 sm:-mt-12 md:-mt-16 mb-8 relative z-0">
              <img
                src={phoneAppScreen}
                alt="RentBasket App Interface"
                className="h-[360px] sm:h-[450px] md:h-[540px] object-contain drop-shadow-2xl"
              />
            </div>

            {/* Mobile/Tablet Buttons */}
            <div className="flex lg:hidden flex-row gap-3 w-full items-center justify-center -mt-12 sm:-mt-16 md:-mt-20 relative z-20">
              <a
                href="https://play.google.com/store/apps/details?id=com.rentoktenant&pcampaignid=web_share&pli=1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <button className="flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[#A51D16] transition-transform hover:scale-105 w-full border border-gray-100 shadow-sm">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.52 15.34c0 .45-.36.82-.81.82h-1.55v3.1c0 1.05-.86 1.91-1.91 1.91s-1.91-.86-1.91-1.91v-3.1h-1.18v3.1c0 1.05-.86 1.91-1.91 1.91s-1.91-.86-1.91-1.91v-3.1H4.79c-.45 0-.81-.37-.81-.82V8.58h13.54v6.76zm-2.59-11.08l1.27-2.21c.11-.19.05-.43-.14-.54a.403.403 0 00-.54.14l-1.3 2.26a8.21 8.21 0 00-3.46-.75c-1.24 0-2.41.27-3.46.75L6 1.65a.403.403 0 00-.54-.14.406.406 0 00-.14.54l1.27 2.21C4.33 5.29 2.8 7.5 2.75 10.11h16c-.05-2.61-1.58-4.82-3.82-5.85zM7.5 7.64c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75zm6.5 0c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75zm6.25.94c-.83 0-1.5.67-1.5 1.5v4.54c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V10.08c0-.83-.67-1.5-1.5-1.5zM1.25 8.58c-.83 0-1.5.67-1.5 1.5v4.54c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V10.08c0-.83-.67-1.5-1.5-1.5z" />
                  </svg>
                  <span className="font-semibold text-sm">Android</span>
                </button>
              </a>

              <a
                href="https://apps.apple.com/in/app/rentbasket/id6477462224"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <button className="flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[#A51D16] transition-transform hover:scale-105 w-full border border-gray-100 shadow-sm">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <span className="font-semibold text-sm">iOS</span>
                </button>
              </a>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden lg:flex flex-col gap-3 md:gap-4 w-full md:w-auto items-start">
              <a
                href="https://play.google.com/store/apps/details?id=com.rentoktenant&pcampaignid=web_share&pli=1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="flex items-center justify-start gap-3 rounded-full bg-white px-8 py-4 text-[#A51D16] transition-transform hover:scale-105 w-72 border border-gray-100 shadow-md hover:shadow-lg">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.52 15.34c0 .45-.36.82-.81.82h-1.55v3.1c0 1.05-.86 1.91-1.91 1.91s-1.91-.86-1.91-1.91v-3.1h-1.18v3.1c0 1.05-.86 1.91-1.91 1.91s-1.91-.86-1.91-1.91v-3.1H4.79c-.45 0-.81-.37-.81-.82V8.58h13.54v6.76zm-2.59-11.08l1.27-2.21c.11-.19.05-.43-.14-.54a.403.403 0 00-.54.14l-1.3 2.26a8.21 8.21 0 00-3.46-.75c-1.24 0-2.41.27-3.46.75L6 1.65a.403.403 0 00-.54-.14.406.406 0 00-.14.54l1.27 2.21C4.33 5.29 2.8 7.5 2.75 10.11h16c-.05-2.61-1.58-4.82-3.82-5.85zM7.5 7.64c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75zm6.5 0c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75zm6.25.94c-.83 0-1.5.67-1.5 1.5v4.54c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V10.08c0-.83-.67-1.5-1.5-1.5zM1.25 8.58c-.83 0-1.5.67-1.5 1.5v4.54c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V10.08c0-.83-.67-1.5-1.5-1.5z" />
                  </svg>
                  <span className="font-semibold text-base">Get the app on Android</span>
                </button>
              </a>

              <a
                href="https://apps.apple.com/in/app/rentbasket/id6477462224"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="flex items-center justify-start gap-3 rounded-full bg-white px-8 py-4 text-[#A51D16] transition-transform hover:scale-105 w-72 border border-gray-100 shadow-md hover:shadow-lg">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <span className="font-semibold text-base">Get the app on iOS</span>
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* Desktop Phone Mockup — extends above red boundary.
            Anchored to a centered max-w-7xl overlay (matching the capped content
            column) so on wide / zoomed-out screens it stays beside the text
            instead of flying out to the section's far-right edge. Height scales
            with the breakpoint and is capped to the viewport so it never dwarfs
            the section; vertically centered on the platform to stay grounded. */}
        <div className="hidden lg:block absolute inset-0 z-20 pointer-events-none">
          <div className="relative w-full h-full max-w-7xl mx-auto">
            <img
              src={phoneAppScreen}
              alt="RentBasket App Interface"
              className="absolute right-0 xl:right-[2%] top-1/2 -translate-y-1/2 -mt-10 h-[clamp(440px,38vw,700px)] max-h-[78vh] -rotate-10 transform object-contain drop-shadow-2xl transition-all duration-300"
            />
          </div>
        </div>


      </section>
    </section>
  );
};

export default DownloadSection;
