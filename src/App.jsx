import { useEffect, useState } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { useProducts } from "@/hooks/useProducts";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/ProtectedRoute";
import BottomTabBar from "@/components/BottomTabBar";
import SplashScreen from "@/components/SplashScreen";
import FloatingSupport from "@/components/FloatingSupport";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import ProductDetails from "./pages/ProductDetails";
import Basket from "./pages/Basket";
import Checkout from "./pages/Checkout";
import CustomerValidation from "./pages/CustomerValidation";
import OrderSummary from "./pages/OrderSummary";
import OrderSuccess from "./pages/OrderSuccess";
import Kyc from "./pages/Kyc";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import AccountDetails from "./pages/AccountDetails";
import Wishlist from "./pages/Wishlist";
import TermsConditions from "./pages/TermsConditions";
import ShippingReturns from "./pages/ShippingReturns";
import FAQs from "./pages/FAQs";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// The splash stays up at least this long (so it never just flashes on a warm
// cache) and at most this long (so a hung/slow backend can't strand the user
// on the splash forever — the app falls through and shows its own skeletons).
const SPLASH_MIN_MS = 1800;
const SPLASH_MAX_MS = 6000;

/**
 * Kicks off the homepage's product fetch *while the splash is still showing*
 * (it lives inside QueryClientProvider, alongside the real router, not after
 * it) and reports back once that fetch has settled — success or error, so a
 * dead backend can't hang the splash past SPLASH_MAX_MS. FurnitureGallery's
 * useProducts() call below hits the same React Query cache key, so this is
 * the same request, not a duplicate — the page then renders with data
 * already in cache instead of showing its own skeleton after the splash.
 */
const ProductsPrefetchGate = ({ onSettled }) => {
  const { isLoading, isError, isSuccess } = useProducts();
  useEffect(() => {
    if (!isLoading && (isSuccess || isError)) onSettled();
  }, [isLoading, isSuccess, isError, onSettled]);
  return null;
};

/** GitHub Pages serves route folders as /path/ — match both forms. */
const routePair = (path, element) => [
  <Route key={path} path={path} element={element} />,
  <Route key={`${path}/`} path={`${path}/`} element={element} />,
];

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15, ease: "easeOut" } },
  exit:    { opacity: 0, transition: { duration: 0.1, ease: "easeIn" } },
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

/** useLocation must live inside BrowserRouter — extracted here. */
const RouterApp = () => {
  const location = useLocation();
  return (
    <>
      <ScrollToTop />
      <BottomTabBar />
      <FloatingSupport />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Routes location={location}>
            <Route path="/" element={<Index />} />
          {routePair("/catalog", <Catalog />)}
          <Route path="/catalogue" element={<Navigate to="/catalog/" replace />} />
          <Route path="/catalogue/" element={<Navigate to="/catalog/" replace />} />
          {routePair("/product/:id", <ProductDetails />)}
          {routePair("/basket", <Basket />)}
          {/* /cart kept as a redirect so old links / bookmarks still resolve. */}
          <Route path="/cart" element={<Navigate to="/basket/" replace />} />
          <Route path="/cart/" element={<Navigate to="/basket/" replace />} />
          {routePair("/checkout", <Checkout />)}
          {routePair("/customer-validation", <CustomerValidation />)}
          {routePair("/order-summary", <OrderSummary />)}
          {routePair("/order-success", <OrderSuccess />)}
          {routePair("/kyc", <ProtectedRoute><Kyc /></ProtectedRoute>)}
          {routePair("/profile", <Profile />)}
          {routePair("/account/details", <ProtectedRoute><AccountDetails /></ProtectedRoute>)}
          {routePair("/account/orders", <ProtectedRoute><MyOrders /></ProtectedRoute>)}
          {routePair("/wishlist", <Wishlist />)}
          {routePair("/terms-n-conditions", <TermsConditions />)}
          {routePair("/shipping-returns", <ShippingReturns />)}
          {routePair("/faqs", <FAQs />)}
          {routePair("/about", <About />)}
          {routePair("/contact", <Contact />)}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
    </>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [dataSettled, setDataSettled] = useState(false);

  useEffect(() => {
    const minTimer = setTimeout(() => setMinTimeElapsed(true), SPLASH_MIN_MS);
    // Safety net: if the backend hangs (see the CORS-looking timeout we
    // diagnosed earlier), don't stall the splash forever — drop through to
    // the app's own skeletons/error states after SPLASH_MAX_MS regardless.
    const maxTimer = setTimeout(() => setDataSettled(true), SPLASH_MAX_MS);
    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, []);

  useEffect(() => {
    if (minTimeElapsed && dataSettled) setShowSplash(false);
  }, [minTimeElapsed, dataSettled]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {/* Mounted immediately (not after the splash) so the product fetch
            starts while the splash is still up — "internet used first" means
            the request fires first, not that we wait for the splash to
            finish before fetching. */}
        <ProductsPrefetchGate onSettled={() => setDataSettled(true)} />
        <AnimatePresence>
          {showSplash && <SplashScreen key="splash" />}
        </AnimatePresence>
        <WishlistProvider>
        <CartProvider>
          <TooltipProvider>
            <Sonner />
            <BrowserRouter
              basename={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}
            >
              <RouterApp />
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
        </WishlistProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
