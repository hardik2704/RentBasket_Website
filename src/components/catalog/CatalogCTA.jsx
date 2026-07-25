const CatalogCTA = () => {
  return (
    <section className="bg-cream/50">
      <div className="section-container py-12 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-display font-bold mb-4">
            Need help choosing the right setup?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
            Our team can help you find the perfect furniture and appliances for
            your home, budget, and timeline.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+919959858473"
              className="btn-outline py-3 px-7 text-sm md:text-base"
            >
              Talk to Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CatalogCTA;
