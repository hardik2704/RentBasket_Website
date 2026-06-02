import turtleMascot from "@/assets/Group 50.png";
import phoneAppScreen from "@/assets/iPhone 15 Pro.png";

const DownloadSection = () => {
  return (
    <section
      id="download"
      className="relative mt-0 pt-0 bg-background"
    >
      {/* White top area — just a sliver, mascot's right hand only overlaps red below and feet and tummy just touch the red below as a surface*/}
      <div className="relative bg-background pt-8 md:pt-10 h-[100px] md:h-[120px] lg:h-[198px]">
        <div className="absolute left-1/2 -translate-x-1/2 md:left-[8%] md:translate-x-0 lg:left-[12%] top-8 md:top-10 z-30">
          <img
            src={turtleMascot}
            alt="RentBasket Turtle Mascot"
            className="h-40 w-40 md:h-52 md:w-52 lg:h-60 lg:w-60 object-contain"
          />
        </div>
      </div>

      {/* Red gradient platform — extends up behind mascot's lower half */}
      <section className="relative w-full bg-gradient-download pt-20 md:pt-24 lg:pt-28 pb-12 md:pb-16">
        <div className="container mx-auto px-6 relative z-10">
          {/* DOWNLOAD TODAY heading — now sits on the red platform, guiding down */}
          <div className="lg:max-w-[50%] lg:ml-0 mx-auto lg:mx-0 text-center lg:text-left mb-6 lg:mb-10">
            <h1 className="font-display text-3xl md:text-5xl lg:text-5xl font-bold tracking-tight text-white">
              DOWNLOAD TODAY
            </h1>
          </div>

          <div className="flex flex-col items-center lg:items-start lg:max-w-md lg:ml-0 mx-auto lg:mx-0">
            {/* Feature Text */}
            <div className="mb-6 md:mb-8 space-y-1 w-full lg:text-left text-center">
              <p className="hidden lg:flex text-lg md:text-xl font-semibold text-white md:text-2xl">
                Never Miss an Offer
              </p>
              <p className="hidden lg:flex text-lg md:text-xl font-semibold text-white md:text-2xl">
                Get exclusive Deals
              </p>
              <p className="text-lg md:text-xl font-semibold text-white md:text-2xl">
                Track orders and renewals in one place.
              </p>
            </div>

            {/* Phone Mockup for Mobile/Tablet in-flow (centered, not overlapping) */}
            <div className="lg:hidden w-full flex justify-center mb-8">
              <img
                src={phoneAppScreen}
                alt="RentBasket App Interface"
                className="h-[240px] sm:h-[300px] md:h-[360px] object-contain drop-shadow-2xl"
              />
            </div>

            {/* Mobile/Tablet Buttons */}
            <div className="flex lg:hidden flex-row gap-3 w-full items-center justify-center">
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

        {/* Desktop Phone Mockup — extends above red boundary */}
        <div className="hidden lg:block absolute right-[6%] -top-24 z-20">
          <img
            src={phoneAppScreen}
            alt="RentBasket App Interface"
            className="h-[640px] lg:h-[700px] -rotate-10 transform object-contain drop-shadow-2xl transition-all duration-300"
          />
        </div>


      </section>
    </section>
  );
};

export default DownloadSection;
