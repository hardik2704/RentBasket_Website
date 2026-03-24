import founderVijay from "@/assets/Group 64.png";
import founderHardik from "@/assets/Group 65.png";

const FoundersSection = () => {
  return (
    <section className="section-container py-12 md:py-20">
      <div
        className="flex lg:hidden text-center font-[500] text-[32px] leading-[100%] tracking-normal"
        style={{
          fontFamily: "Sans Atwic Modern Trial",
          width: "80%",
          margin: "auto",
          marginBottom: "5%",
        }}
      >
        Built by experience. Powered by a new generation mindset.
      </div>

      <div className="flex flex-col justify-center max-w-4xl mx-auto">
        {/* Founder Cards */}
        <div
          className="flex flex-col md:flex-col justify-center"
          style={{
            margin: "auto",
            marginBottom: "3%",
          }}
        >
          {/* Vijay Card */}
          <div
            className="flex items-center"
            style={{ width: "55%", margin: "auto" }}
          >
            <img
              src={founderVijay}
              alt="Vijay Mahendru"
              className="rounded-xl object-cover"
            />
          </div>

          {/* Hardik Card */}
          <div
            className="flex items-center"
            style={{ width: "55%", margin: "auto" }}
          >
            <img
              src={founderHardik}
              alt="Hardik Mahendru"
              className="rounded-xl object-cover"
            />
          </div>
        </div>

        {/* Story */}
        <div
          className="flex flex-col lg:hidden bg-card border border-border rounded-2xl p-6 md:p-8 shadow-soft"
          style={{
            width: "85%",
            margin: "auto",
          }}
        >
          <h4 className="font-bold text-lg mb-4">
            Founding Team behind Rentbasket
          </h4>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>Hi! We’re the Father-son Duo behind RentBasket.</p>
            <p>
              We’ve always believed that comfort shouldn’t be complicated,
              especially when life is moving fast.
            </p>
            <p>
              Over the years, Vijay has founded and scaled multiple ventures -
              including TalentGum, a live learning platform that now serves
              students across 50+ countries.
            </p>
            <p>
              Now, we’re building the platform we always wished existed - a
              faster, smarter way for young professionals and families to feel
              at home, without buying everything upfront.
            </p>
            <p>
              RentBasket is everything we’ve learned - turned into India’s most
              trusted rental ecosystem for comfort living.
            </p>
          </div>
        </div>

        {/* Story */}
        <div
          className="hidden lg:flex flex-col bg-card border border-border rounded-2xl p-6 md:p-8 shadow-soft"
          style={{
            width: "65%",
            margin: "auto",
          }}
        >
          <h4 className="font-bold text-lg mb-4">
            Founding Team behind Rentbasket
          </h4>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>Hi! We’re the Father-son Duo behind RentBasket.</p>
            <p>
              We’ve always believed that comfort shouldn’t be complicated,
              especially when life is moving fast.
            </p>
            <p>
              Over the years, Vijay has founded and scaled multiple ventures -
              including TalentGum, a live learning platform that now serves
              students across 50+ countries.
            </p>
            <p>
              Now, we’re building the platform we always wished existed - a
              faster, smarter way for young professionals and families to feel
              at home, without buying everything upfront.
            </p>
            <p>
              RentBasket is everything we’ve learned - turned into India’s most
              trusted rental ecosystem for comfort living.
            </p>
            {/* <p>
              Hardik has worked with early-stage startups and built communities
              like Agentix at IIT Delhi, bringing modern product thinking and a
              fresh perspective to the company.
            </p>
            <p>
              Now, we're building the platform we always wished existed — a
              faster, smarter way for young professionals and families to feel
              at home, without buying everything upfront.
            </p>
            <p>
              RentBasket is everything we've learned — turned into India's most
              trusted rental ecosystem for comfort living.
            </p> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundersSection;
