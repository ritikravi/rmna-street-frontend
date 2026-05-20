import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import ScrollToTop from './components/common/ScrollToTop';
import WhatsAppButton from './components/common/WhatsAppButton';
import ComparisonBar from './components/product/ComparisonBar';
import ComparisonView from './components/product/ComparisonView';

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900"></div>
  </div>
);

// ── Lazy load pages for code splitting ──────────────────────
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const WomenAccessoriesPage = lazy(() => import('./pages/WomenAccessoriesPage'));
const GirlsJeansPage = lazy(() => import('./pages/GirlsJeansPage'));
const GirlsKurtiPage = lazy(() => import('./pages/GirlsKurtiPage'));
const MensShirtsPage = lazy(() => import('./pages/MensShirtsPage'));
const FeedbackPage = lazy(() => import('./pages/FeedbackPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));

// ── Admin pages ──────────────────────────────────────────────
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminWomenProducts = lazy(() => import('./pages/admin/AdminWomenProducts'));
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons'));
const AdminFeedback = lazy(() => import('./pages/admin/AdminFeedback'));

export default function App() {
  return (
    <>
      <ScrollToTop />
      <WhatsAppButton />
      <ComparisonBar />
      <ComparisonView />
      <Suspense fallback={<PageLoader />}>
        <Routes>
      {/* ── Admin world (completely separate) ── */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="women-products" element={<AdminWomenProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="feedback" element={<AdminFeedback />} />
        </Route>
      </Route>

      {/* ── Customer world ── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="women-accessories" element={<WomenAccessoriesPage />} />
        <Route path="girls-jeans" element={<GirlsJeansPage />} />
        <Route path="girls-kurti" element={<GirlsKurtiPage />} />
        <Route path="mens-shirts" element={<MensShirtsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="feedback" element={<FeedbackPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-success/:id" element={<OrderSuccessPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
      </Suspense>
    </>
  );
}
