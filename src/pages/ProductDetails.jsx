import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle, RotateCw } from "lucide-react";
import { DURATION_OPTIONS } from "@/data/products";
import { discountedRent } from "@/lib/pricing";
import { useProduct } from "@/hooks/useProducts";
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

  const { data: product, isLoading, isError, refetch } = useProduct(id);

  const [selectedDuration, setSelectedDuration] = useState("12_months");
  const [quantity, setQuantity] = useState(1);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // Snap selectedDuration to the first available duration when product loads.
  // Needed because the default "1_month" may not exist for every product.
  useEffect(() => {
    if (!product) return;
    const p = product.pricing_by_duration ?? {};
    const hasPrice = (key) => (p[key] ?? 0) > 0;
    if (!hasPrice(selectedDuration)) {
      const fallback = DURATION_OPTIONS.find((d) => hasPrice(d.key));
      if (fallback) setSelectedDuration(fallback.key);
    }
  }, [product]); // eslint-disable-line react-hooks/exhaustive-deps

  // Loading placeholder — shown while the product is being fetched, so the page
  // doesn't flash "Not Found" before the data arrives.
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="section-container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="aspect-square bg-secondary rounded-2xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-secondary rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-secondary rounded animate-pulse" />
              <div className="h-24 bg-secondary rounded-xl animate-pulse" />
              <div className="h-12 bg-secondary rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="section-container py-20">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <AlertCircle className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Couldn't load this product</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-5">
              Something went wrong fetching the product. Please check your connection
              and try again.
            </p>
            <button
              onClick={() => refetch()}
              className="btn-outline inline-flex items-center gap-2 text-sm px-5 py-2.5"
            >
              <RotateCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
            Browse Catalogue
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const pricing = product.pricing_by_duration;
  const price = discountedRent(pricing[selectedDuration] || 0, product.percent_discount);
  const durationLabel = DURATION_OPTIONS.find((d) => d.key === selectedDuration)?.label || "";

  const handleMobileAddToCart = () => {
    if (product.stock_status === "out_of_stock") {
      toast.error(`${product.name} is out of stock`, {
        description: "This item isn't available to rent right now.",
      });
      return;
    }
    addToCart({
      productId: product.id,
      name: product.name,
      duration: selectedDuration,
      durationLabel,
      price,
      quantity,
      startDate: new Date().toISOString().split("T")[0],
      adv_security: product.adv_security,
      image: product.image,
      category: product.category,
      subcategory_id: product.subcategory_id,
      rent: product.pricing_by_duration[selectedDuration],
      percent_discount: product.percent_discount,
      security_multiple: product.security_multiple,
      stock_status: product.stock_status,
    });
    toast.success(`${product.name} added to basket`, {
      description: `${durationLabel} plan · ₹${price.toLocaleString("en-IN")}`,
    });
    navigate("/basket");
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <main>
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
