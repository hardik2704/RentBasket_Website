import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CartProvider } from "@/context/CartContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import TermsConditions from "./pages/TermsConditions";
import ShippingReturns from "./pages/ShippingReturns";
import FAQs from "./pages/FAQs";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
          {routePair("/cart", <Cart />)}
          {routePair("/checkout", <Checkout />)}
          {routePair("/order-success", <OrderSuccess />)}
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

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
