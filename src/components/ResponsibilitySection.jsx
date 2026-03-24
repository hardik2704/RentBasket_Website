const ResponsibilitySection = () => {
  return (
    <section className="section-container py-12 md:py-20">
      <div className="flex flex-col lg:hidden max-w-3xl mx-auto text-left lg:text-center">
        <h2 className="flex justify-items-start text-3xl md:text-4xl lg:text-5xl font-display font-semibold mb-8"
          style={{
            width: "80%",
            margin: "auto",
            marginBottom: "5%"
          }}>
          We don't just rent, We
          take responsibility.
        </h2>

        <div className="space-y-6 text-lg md:text-xl text-muted-foreground text-left"
          style={{
            width: "75%",
            margin: "auto"
          }}>
          <p>
            At RentBasket we make relocation feel effortless 🧳 from day one.
          </p>
          <p>
            Choose furniture & appliances on rent, get delivery + installation and stay
            worry-free with support 🛠️ across Gurgaon & Noida 📍
          </p>
          <p>
            So your house becomes a home 🏠✨ without the heavy spending.
          </p>
        </div>
      </div>
      <div className="hidden lg:flex flex-col max-w-3xl mx-auto text-center lg:text-center">
        <h2 className="flex justify-center text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-8"
          style={{
            width: "77%",
            margin: "auto",
            marginBottom: "5%"
          }}>
          We don't just rent, We
          take responsibility.
        </h2>

        <div className="space-y-6 text-muted-foreground text-left"
          style={{
            width: "70%",
            margin: "auto",
            fontSize: "180%",
            marginTop: "5%"
          }}>
          <p>
            At RentBasket we make relocation feel effortless 🧳 from day one.
          </p>
          <p>
            Choose furniture & appliances on rent, get delivery + installation and stay
            worry-free with support 🛠️ across Gurgaon & Noida 📍
          </p>
          <p>
            So your house becomes a home 🏠✨ without the heavy spending.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResponsibilitySection;
