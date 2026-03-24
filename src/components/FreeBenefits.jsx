import { Link } from "react-router-dom";
import mascotSofa from "@/assets/ChatGPT Image Jan 17, 2026, 02_58_19 AM 1.png";

const FreeBenefits = () => {
  const benefits = ["Delivery", "Installation", "Maintainance"];

  return (
    <section className="section-container py-6 md:py-12 lg:py-16">
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col items-center text-center w-full mt-12">
        <div style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
        }}>
          <h2 className="text-6xl sm:text-4xl font-bold mb-3">
            <span className="text-primary">Free</span>
          </h2>
          <ul className="space-y-1 mb-6 ml-4">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start text-left gap-2 text-md font-semibold sm:text-base"
                style={{ color: "#868585" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-1.5 flex-shrink-0"></span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>


        <div className="flex flex-col gap-2 w-75% max-w-xs mt-10">
          <a
            href="https://www.rentbasket.com/"
            target="_blank"
            rel="noopener noreferrer">
            <button className="btn-primary py-2.5 px-6 text-sm"
              style={{
                background: "linear-gradient(89.03deg, #D72F26 -14.8%, #EF1040 50.11%, #FECC87 129.44%)"
              }}>
              Get home setup quote
            </button>
          </a>
          <Link to="/catalog">
            <button className="btn-outline py-2.5 px-6 text-sm w-full">
              Browse Catalogue
            </button>
          </Link>
        </div>

        <div className="mb-4 flex justify-center mt-12">
          <img
            src={mascotSofa}
            alt="RentBasket mascots carrying sofa"
            className="w-full max-w-2xl sm:w-4/5 md:w-3/4"
          />
        </div>

      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-col items-center gap-16">
        <div className="flex-1 flex justify-center">
          <img
            src={mascotSofa}
            alt="RentBasket mascots carrying sofa"
            className="w-90 xl:w-100"
          />
        </div>

        <div className="flex-1 flex flex-row items-start gap-12">
          <div>
            <h2 className="text-5xl font-bold mb-4">
              <span className="text-primary">Free</span>
            </h2>
            <ul className="space-y-2">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 text-lg">
                  <span className="w-2 h-2 rounded-full bg-foreground"></span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Link to="/catalog" className="w-full">
              <button className="btn-outline py-3 px-8 text-center w-full">
                Browse Catalogue
              </button>
            </Link>
            <a
              href="https://www.rentbasket.com/"
              target="_blank"
              rel="noopener noreferrer">
              <button className="btn-primary py-3 px-8 text-center w-full">
                Get home setup quote
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeBenefits;
