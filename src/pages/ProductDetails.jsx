import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, DURATION_OPTIONS } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/product/Breadcrumb";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import DurationSelector from "@/components/product/DurationSelector";
import PricingSummary from "@/components/product/PricingSummary";
import AddToCartBlock from "@/components/product/AddToCartBlock";
import ProductFeatures from "@/components/product/ProductFeatures";
import ProductTabs from "@/components/product/ProductTabs";
import RelatedProducts from "@/components/product/RelatedProducts";
import ProductFAQ from "@/components/product/ProductFAQ";
import StickyMobileCTA from "@/components/product/StickyMobileCTA";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = getProductById(id);

  const [selectedDuration, setSelectedDuration] = useState("1_month");
  const [quantity, setQuantity] = useState(1);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="section-container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/catalog")}
            className="btn-primary px-6 py-3"
          >
            Browse Catalog
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const pricing = product.pricing_by_duration;
  const price = pricing[selectedDuration] || 0;
  const durationLabel = DURATION_OPTIONS.find((d) => d.key === selectedDuration)?.label || "";

  const handleMobileAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      duration: selectedDuration,
      durationLabel,
      price,
      quantity,
      startDate: new Date().toISOString().split("T")[0],
      deposit: product.deposit,
      image: product.image,
      category: product.category,
    });
    toast.success(`${product.name} added to cart`, {
      description: `${durationLabel} plan · ₹${price.toLocaleString("en-IN")}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-20 md:pb-0">
        {/* Breadcrumb */}
        <Breadcrumb product={product} />

        {/* Main Product Section — 2 Column Layout */}
        <section className="section-container pb-8 md:pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Media Column */}
            <div>
              <ProductGallery product={product} />
            </div>

            {/* Right: Purchase Column */}
            <div className="space-y-6">
              <ProductInfo product={product} />
              <DurationSelector
                product={product}
                selectedDuration={selectedDuration}
                onDurationChange={setSelectedDuration}
              />
              <PricingSummary
                product={product}
                selectedDuration={selectedDuration}
                quantity={quantity}
              />
              <AddToCartBlock
                product={product}
                selectedDuration={selectedDuration}
                quantity={quantity}
                onQuantityChange={setQuantity}
              />
            </div>
          </div>
        </section>

        {/* Below the fold */}
        <ProductFeatures product={product} />
        <ProductTabs product={product} />
        <RelatedProducts productId={product.id} />
        <ProductFAQ product={product} />
      </main>

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA
        product={product}
        selectedDuration={selectedDuration}
        onAddToCart={handleMobileAddToCart}
      />

      <Footer />
    </div>
  );
};

export default ProductDetails;
