import turtleMascot from "@/assets/Group 50.png";
import phoneAppScreen from "@/assets/iPhone 15 Pro.png";

const DownloadSection = () => {
  return (
    <section
      id="download"
      className="relative overflow-hidden mt-6 pt-0"
      style={{
        background: "transparent",
      }}
    >
      <section
        className="relative w-full overflow-hidden p-0 lg:pt-44"
        style={{
          background: "transparent",
        }}
      >
        {/* Top Dark Section - Hidden on mobile, shown on md+ */}
        <div
          className="hidden md:block relative pb-32 pt-12"
          style={{ backgroundColor: "transparent" }}
        >
          <div
            className="container mx-auto px-6"
            style={{
              width: "50%",
              marginLeft: 0,
              marginBottom: "-50px",
            }}
          >
            {/* Mascot and Title */}
            <div className="flex flex-col items-center">
              <img
                src={turtleMascot}
                alt="RentBasket Turtle Mascot"
                className="h-40 w-40 object-contain md:h-52 md:w-52"
                style={{
                  marginBottom: "-30px",
                }}
              />
              <h1 className="text-4xl font-bold tracking-tight text-black md:text-5xl lg:text-5xl mt-0 font-sans">
                DOWNLOAD TODAY
              </h1>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden relative">
          {/* Phone Image positioned above the text */}
          <div className="flex justify-center relative z-10 pt-8 pb-4">
            <img
              src={turtleMascot}
              alt="RentBasket Turtle Mascot"
              className="h-40 w-40 object-contain md:h-52 md:w-52"
              style={{
                marginBottom: "-70px",
              }}
            />
          </div>

          <div className="relative z-20 pb-8 mb-32">
            <div className="container mx-auto px-6">
              <div className="flex flex-col items-center">
                <h1 className="font-sans text-3xl font-bold tracking-tight text-black text-center">
                  DOWNLOAD TODAY
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Red Section - Reduced height on mobile */}
        <div
          className="relative pb-16 pt-5 lg:pt-20 md:pb-20 md:pt-12"
          style={{
            background: "linear-gradient(to right, #D72F26, #B02020)",
          }}
        >
          <div className="container mx-auto px-6">
            {/* Mobile: Content below phone and text */}
            <div className="flex flex-col items-start md:max-w-md md:ml-0 mx-auto md:mx-0">
              {/* Feature Text - Show on all screens now */}
              <div className="mb-6 md:mb-8 space-y-1 w-full md:text-left text-center">
                <p className="hidden lg:flex text-lg md:text-xl font-semibold text-transparent  lg:text-white md:text-2xl">
                  Never Miss an Offer
                </p>
                <p className="hidden lg:flex text-lg md:text-xl font-semibold text-transparent  lg:text-white md:text-2xl">
                  Get exclusive Deals
                </p>
                <p className="text-lg md:text-xl font-semibold text-transparent  lg:text-white md:text-2xl">
                  Other features here.
                </p>
              </div>

              {/* Download Buttons - Centered on mobile */}
              <div className="flex lg:hidden flex-row gap-2 w-full items-center justify-center">
                {/* Android Button */}
                <a
                  href="https://play.google.com/store/apps/details?id=com.rentoktenant&pcampaignid=web_share&pli=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A51D16] w-full md:w-auto"
                >
                  <button className="flex items-center justify-center md:justify-start gap-1 rounded-full bg-white px-8 md:px-3 py-3 md:py-4 transition-transform hover:scale-105 w-full md:w-auto border border-gray-100 shadow-sm">
                    <svg
                      className="h-5 w-5 md:h-6 md:w-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.52 15.34c0 .45-.36.82-.81.82h-1.55v3.1c0 1.05-.86 1.91-1.91 1.91s-1.91-.86-1.91-1.91v-3.1h-1.18v3.1c0 1.05-.86 1.91-1.91 1.91s-1.91-.86-1.91-1.91v-3.1H4.79c-.45 0-.81-.37-.81-.82V8.58h13.54v6.76zm-2.59-11.08l1.27-2.21c.11-.19.05-.43-.14-.54a.403.403 0 00-.54.14l-1.3 2.26a8.21 8.21 0 00-3.46-.75c-1.24 0-2.41.27-3.46.75L6 1.65a.403.403 0 00-.54-.14.406.406 0 00-.14.54l1.27 2.21C4.33 5.29 2.8 7.5 2.75 10.11h16c-.05-2.61-1.58-4.82-3.82-5.85zM7.5 7.64c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75zm6.5 0c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75zm6.25.94c-.83 0-1.5.67-1.5 1.5v4.54c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V10.08c0-.83-.67-1.5-1.5-1.5zM1.25 8.58c-.83 0-1.5.67-1.5 1.5v4.54c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V10.08c0-.83-.67-1.5-1.5-1.5z" />
                    </svg>
                    <span className="font-semibold text-xs md:text-base">
                      Download
                    </span>
                  </button>
                </a>

                {/* Apple Button */}
                <a
                  href="https://apps.apple.com/app/id123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A51D16] w-full md:w-auto"
                >
                  <button className="flex items-center justify-center md:justify-start gap-1 rounded-full bg-white px-8 md:px-3 py-3 md:py-4 transition-transform hover:scale-105 w-full md:w-auto border border-gray-100 shadow-sm">
                    <svg
                      className="h-5 w-5 md:h-6 md:w-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    <span className="font-semibold text-xs md:text-base">
                      Download
                    </span>
                  </button>
                </a>
              </div>

              {/* Download Buttons - Centered on mobile */}
              <div className="hidden lg:flex flex-col gap-3 md:gap-4 w-full md:w-auto items-center md:items-start">
                {/* Android Button */}
                <a
                  href="https://play.google.com/store/apps/details?id=com.rentoktenant&pcampaignid=web_share&pli=1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="flex items-center justify-center md:justify-start gap-3 rounded-full bg-white px-6 md:px-8 py-3 md:py-4 text-[#A51D16] transition-transform hover:scale-105 w-full md:w-72 border border-gray-100 shadow-sm">
                    <svg
                      className="h-5 w-5 md:h-6 md:w-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.52 15.34c0 .45-.36.82-.81.82h-1.55v3.1c0 1.05-.86 1.91-1.91 1.91s-1.91-.86-1.91-1.91v-3.1h-1.18v3.1c0 1.05-.86 1.91-1.91 1.91s-1.91-.86-1.91-1.91v-3.1H4.79c-.45 0-.81-.37-.81-.82V8.58h13.54v6.76zm-2.59-11.08l1.27-2.21c.11-.19.05-.43-.14-.54a.403.403 0 00-.54.14l-1.3 2.26a8.21 8.21 0 00-3.46-.75c-1.24 0-2.41.27-3.46.75L6 1.65a.403.403 0 00-.54-.14.406.406 0 00-.14.54l1.27 2.21C4.33 5.29 2.8 7.5 2.75 10.11h16c-.05-2.61-1.58-4.82-3.82-5.85zM7.5 7.64c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75zm6.5 0c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75zm6.25.94c-.83 0-1.5.67-1.5 1.5v4.54c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V10.08c0-.83-.67-1.5-1.5-1.5zM1.25 8.58c-.83 0-1.5.67-1.5 1.5v4.54c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V10.08c0-.83-.67-1.5-1.5-1.5z" />
                    </svg>
                    <span className="font-semibold text-sm md:text-base">
                      Get the app on Android
                    </span>
                  </button>
                </a>

                {/* iOS Button */}
                <a
                  href="https://apps.apple.com/in/app/rentbasket/id6477462224"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="flex items-center justify-center md:justify-start gap-3 rounded-full bg-white px-6 md:px-8 py-3 md:py-4 text-[#A51D16] transition-transform hover:scale-105 w-full md:w-72 border border-gray-100 shadow-sm">
                    <svg
                      className="h-5 w-5 md:h-6 md:w-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    <span className="font-semibold text-sm md:text-base">
                      Get the app on iOS
                    </span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute left-1/2 top-12 -translate-x-1/2 md:top-1/3 md:-translate-y-1 md:-translate-x-10 lg:-translate-x-6">
          <div className="relative">
            <img
              src={phoneAppScreen}
              alt="RentBasket App Interface"
              className="h-[520px] -rotate-10 transform rounded-[3rem] object-contain drop-shadow-2xl 
                 md:h-[550px] lg:h-[650px] transition-all duration-300"
            />
          </div>
        </div>
        {/* Large Centered Phone Mockup */}
        <div className="flex lg:hidden absolute left-1/2 top-44 -translate-x-1/2 z-0 overflow-visible w-full justify-center">
          <div className="relative">
            <img
              src={phoneAppScreen}
              alt="RentBasket App Interface"
              className="
        /* Mobile Sizing: Large and Centered */
        h-[25vh] min-h-[180px] 
        -rotate-4 scale-110 transform 
        
        /* Desktop Sizing: Adjusts smoothly */
        md:h-[600px] lg:h-[750px] 
        md:-rotate-10 md:scale-100

        object-contain drop-shadow-2xl 
        transition-all duration-500
      "
            />
          </div>
        </div>
      </section>
    </section>
  );
};

export default DownloadSection;
