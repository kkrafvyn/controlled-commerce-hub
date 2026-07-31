import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CompareProvider } from "@/contexts/CompareContext";
import { CompareBar } from "@/components/compare/CompareBar";
import { MobileNavBar } from "@/components/layout/MobileNavBar";
import { LiveChatWidget } from "@/components/support/LiveChatWidget";
import { AbandonedCartReminder } from "@/components/cart/AbandonedCartReminder";
import { CookieConsent } from "@/components/CookieConsent";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { WelcomeModal } from "@/components/onboarding/WelcomeModal";
import { MaintenanceMode } from "@/components/MaintenanceMode";
import { missingSupabaseEnvVars, supabaseConfigError } from "@/integrations/supabase/client";
import { useProductCatalogSync } from "@/hooks/useProductCatalogSync";
import { APP_BACKGROUND_REFRESH_MS } from "@/lib/backgroundRefresh";
import { NOTIFICATIONS_SCROLL_KEY } from "@/lib/notification-display";
import { ThemeProvider } from "next-themes";
import { Suspense, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { lazyWithRetry } from "@/lib/lazyWithRetry";

// Lazy load all pages for code splitting
const Index = lazyWithRetry(() => import("./pages/Index"));
const Products = lazyWithRetry(() => import("./pages/Products"));
const ProductDetail = lazyWithRetry(() => import("./pages/ProductDetail"));
const Cart = lazyWithRetry(() => import("./pages/Cart"));
const Checkout = lazyWithRetry(() => import("./pages/Checkout"));
const OrderConfirmation = lazyWithRetry(() => import("./pages/OrderConfirmation"));
const MyOrders = lazyWithRetry(() => import("./pages/MyOrders"));
const GroupBuys = lazyWithRetry(() => import("./pages/GroupBuys"));
const GroupBuyDetail = lazyWithRetry(() => import("./pages/GroupBuyDetail"));
const Categories = lazyWithRetry(() => import("./pages/Categories"));
const Auth = lazyWithRetry(() => import("./pages/Auth"));
const Admin = lazyWithRetry(() => import("./pages/Admin"));
const TrackOrder = lazyWithRetry(() => import("./pages/TrackOrder"));
const Profile = lazyWithRetry(() => import("./pages/Profile"));
const Wishlist = lazyWithRetry(() => import("./pages/Wishlist"));
const Compare = lazyWithRetry(() => import("./pages/Compare"));
const Help = lazyWithRetry(() => import("./pages/Help"));
const FlashDeals = lazyWithRetry(() => import("./pages/FlashDeals"));
const DeliveryZones = lazyWithRetry(() => import("./pages/DeliveryZones"));
const CustomsDutyEstimator = lazyWithRetry(() => import("./pages/CustomsDutyEstimator"));
const ReceiptVerify = lazyWithRetry(() => import("./pages/ReceiptVerify"));
const Notifications = lazyWithRetry(() => import("./pages/Notifications"));
const NotificationDetail = lazyWithRetry(() => import("./pages/NotificationDetail"));
const FooterInfo = lazyWithRetry(() => import("./pages/FooterInfo"));
const NotFound = lazyWithRetry(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: APP_BACKGROUND_REFRESH_MS,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function SupabaseConfigScreen() {
  return (
    <div className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto flex max-w-2xl flex-col gap-6 rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">Deployment Setup</p>
          <h1 className="text-3xl font-semibold">Supabase environment variables are missing</h1>
          <p className="text-muted-foreground">
            This deployment cannot start because the Vercel project was built without the required
            Supabase configuration.
          </p>
        </div>

        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          {supabaseConfigError}
        </div>

        <div className="space-y-3 text-sm text-muted-foreground">
          <p>Add these environment variables in Vercel, then redeploy the project:</p>
          <div className="rounded-2xl border border-border bg-muted/40 p-4 font-mono text-foreground">
            {missingSupabaseEnvVars.map((variable) => (
              <div key={variable}>{variable}</div>
            ))}
          </div>
          <p>
            After redeploying, hard refresh the site once so any old cached service worker assets are
            replaced.
          </p>
        </div>
      </div>
    </div>
  );
}

function AppRouterContent() {
  const location = useLocation();
  useProductCatalogSync();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isCheckoutRoute = location.pathname === "/checkout";
  const isFocusRoute =
    isCheckoutRoute ||
    location.pathname.startsWith("/product/") ||
    location.pathname.startsWith("/track-order") ||
    location.pathname.startsWith("/notifications") ||
    location.pathname.startsWith("/order-confirmation") ||
    location.pathname === "/auth";
  const [isCompareBarVisible, setIsCompareBarVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCartReminderVisible, setIsCartReminderVisible] = useState(false);

  const liveChatBottomOffset = isCompareBarVisible ? 96 : isCartReminderVisible ? 112 : 0;

  useEffect(() => {
    if (
      location.pathname === "/notifications" &&
      window.sessionStorage.getItem(NOTIFICATIONS_SCROLL_KEY)
    ) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname]);

  useEffect(() => {
    if (isFocusRoute) {
      setIsCompareBarVisible(false);
      setIsChatOpen(false);
      setIsCartReminderVisible(false);
    }
  }, [isFocusRoute]);

  return (
    <MaintenanceMode>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/group-buys" element={<GroupBuys />} />
          <Route path="/group-buy/:id" element={<GroupBuyDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/track-order/:orderId" element={<TrackOrder />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/help" element={<Help />} />
          <Route path="/receipt/:receiptNumber" element={<ReceiptVerify />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/notifications/:notificationId" element={<NotificationDetail />} />
          <Route path="/flash-deals" element={<FlashDeals />} />
          <Route path="/delivery-zones" element={<DeliveryZones />} />
          <Route path="/customs-estimator" element={<CustomsDutyEstimator />} />
          <Route path="/about" element={<FooterInfo />} />
          <Route path="/contact" element={<FooterInfo />} />
          <Route path="/careers" element={<FooterInfo />} />
          <Route path="/privacy-policy" element={<FooterInfo />} />
          <Route path="/terms-of-service" element={<FooterInfo />} />
          <Route path="/returns-policy" element={<FooterInfo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {!isAdminRoute && (
        <>
          {!isFocusRoute && (
            <CompareBar onVisibilityChange={setIsCompareBarVisible} />
          )}
          {!isFocusRoute && <MobileNavBar />}
          {!isFocusRoute && (
            <LiveChatWidget
              mobileBottomOffset={liveChatBottomOffset}
              onOpenChange={setIsChatOpen}
            />
          )}
          {!isFocusRoute && (
            <AbandonedCartReminder
              suppressed={isChatOpen || isCompareBarVisible}
              onVisibilityChange={setIsCartReminderVisible}
            />
          )}
          <WelcomeModal suppressed={isFocusRoute} />
          <CookieConsent suppressed={isFocusRoute} />
        </>
      )}
    </MaintenanceMode>
  );
}

const App = () => {
  if (supabaseConfigError) {
    return <SupabaseConfigScreen />;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <CartProvider>
              <CompareProvider>
                <ErrorBoundary>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter
                    future={{
                      v7_startTransition: true,
                      v7_relativeSplatPath: true,
                    }}
                  >
                    <AppRouterContent />
                  </BrowserRouter>
                </ErrorBoundary>
              </CompareProvider>
            </CartProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
