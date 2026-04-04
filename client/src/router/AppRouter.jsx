import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Loader from '../components/common/Loader';
import { ProtectedRoute, AdminRoute } from '../components/common/ProtectedRoute';

// Lazy load pages
const HomePage = lazy(() => import('../pages/Home/HomePage'));
const ProductListPage = lazy(() => import('../pages/Products/ProductListPage'));
const ProductDetailPage = lazy(() => import('../pages/Products/ProductDetailPage'));
const CartPage = lazy(() => import('../pages/Cart/CartPage'));
const CheckoutPage = lazy(() => import('../pages/Checkout/CheckoutPage'));
const LoginPage = lazy(() => import('../pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/Auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/Auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/Auth/ResetPasswordPage'));
const DashboardPage = lazy(() => import('../pages/Account/DashboardPage'));
const ProfilePage = lazy(() => import('../pages/Account/ProfilePage'));
const OrdersPage = lazy(() => import('../pages/Account/OrdersPage'));
const OrderDetailPage = lazy(() => import('../pages/Account/OrderDetailPage'));
const AddressesPage = lazy(() => import('../pages/Account/AddressesPage'));
const WishlistPage = lazy(() => import('../pages/Account/WishlistPage'));
const SearchResultsPage = lazy(() => import('../pages/Search/SearchResultsPage'));
const BlogListPage = lazy(() => import('../pages/Blog/BlogListPage'));
const AboutPage = lazy(() => import('../pages/About/AboutPage'));
const HelpCenterPage = lazy(() => import('../pages/Help/HelpCenterPage'));
const AdminLayout = lazy(() => import('../pages/Admin/AdminLayout'));
const AdminDashboard = lazy(() => import('../pages/Admin/AdminDashboard'));
const AdminProducts = lazy(() => import('../pages/Admin/AdminProducts'));
const AdminOrders = lazy(() => import('../pages/Admin/AdminOrders'));
const AdminUsers = lazy(() => import('../pages/Admin/AdminUsers'));
const AdminCoupons = lazy(() => import('../pages/Admin/AdminCoupons'));
const AdminCategories = lazy(() => import('../pages/Admin/AdminCategories'));
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage'));

// Blog detail imported as named export
const BlogDetailPageModule = lazy(() =>
  import('../pages/Blog/BlogListPage').then((module) => ({ default: module.BlogDetailPage }))
);

const AppRouter = () => {
  return (
    <Suspense fallback={<div className="py-20"><Loader /></div>}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:id" element={<BlogDetailPageModule />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/help" element={<HelpCenterPage />} />

        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Protected account routes */}
        <Route path="/account" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}>
          <Route index element={<ProfilePage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="addresses" element={<AddressesPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="categories" element={<AdminCategories />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
