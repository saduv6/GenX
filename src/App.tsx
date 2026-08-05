// ============================================================
// GenX Laptop - Main App Component with Router
// ============================================================

import { useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SplashScreen } from '@/components/custom/SplashScreen';
import { Header } from '@/components/custom/Header';
import { Footer } from '@/components/custom/Footer';
import { ToastContainer } from '@/components/custom/ToastContainer';
import { SettingsProvider } from '@/hooks/useSettings';
import { CartProvider } from '@/hooks/useCart';
import { LanguageProvider } from '@/hooks/useLanguage';
import { StorePage } from '@/pages/StorePage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { ComparePage } from '@/pages/ComparePage';
import { FaqPage } from '@/pages/FaqPage';
import { TermsPage } from '@/pages/TermsPage';
import { WarrantyPage } from '@/pages/WarrantyPage';
import { AdminPage } from '@/pages/admin/AdminPage';

const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE || '/admin';

function App() {
  const handleSplashComplete = useCallback(() => {
    // Splash screen handled internally
  }, []);

  return (
    <LanguageProvider>
      <SettingsProvider>
        <CartProvider>
          <div className="min-h-screen bg-black text-white flex flex-col">
            <ToastContainer />
            <SplashScreen onComplete={handleSplashComplete} />

            <Routes>
              {/* Admin route - no header/footer */}
              <Route path={`${ADMIN_ROUTE}/*`} element={<AdminPage />} />

              {/* Customer routes - with header/footer */}
              <Route path="*" element={<CustomerLayout />} />
            </Routes>
          </div>
        </CartProvider>
      </SettingsProvider>
    </LanguageProvider>
  );
}

function CustomerLayout() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<StorePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/warranty" element={<WarrantyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
