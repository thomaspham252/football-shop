import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/home/HomePage';
import ProductsPage from './pages/products/ProductsPage';
import ProductDetail from './pages/product/ProductDetail';
import SizeGuidePage from './pages/size-guide/SizeGuidePage';
import CartPage from './pages/cart/CartPage';
import PaymentPage from './pages/payment/PaymentPage';
import OrderSuccess from './pages/payment/OrderSuccess';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ProfilePage from './pages/profile/ProfilePage';
import OrderDetailPage from './pages/profile/OrderDetailPage';
import SearchPage from './pages/search/SearchPage';
import PolicyPage from './pages/policy/PolicyPage';
import ContactPage from './pages/contact/ContactPage';
import FAQPage from './pages/faq/FAQPage';
import StoreSystemPage from './pages/store/StoreSystemPage';
import OrderTrackingPage from './pages/order/OrderTrackingPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminRoute from './components/auth/AdminRoute';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import ChatWidget from './components/chat/ChatWidget';

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <BrowserRouter>
          <ChatWidget />
          <Routes>
          <Route 
            path="/admin/*" 
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            } 
          />
          <Route path="/"                      element={<HomePage />} />
          <Route path="/san-pham"              element={<ProductsPage />} />
          <Route path="/san-pham/:slug"          element={<ProductDetail />} />
          <Route path="/huong-dan-chon-size"   element={<SizeGuidePage />} />
          <Route path="/gio-hang"              element={<CartPage />} />
          <Route path="/thanh-toan"            element={<PaymentPage />} />
          <Route path="/dat-hang-thanh-cong"   element={<OrderSuccess />} />
          <Route path="/dang-nhap"             element={<LoginPage />} />
          <Route path="/dang-ky"               element={<RegisterPage />} />
          <Route path="/quen-mat-khau"         element={<ForgotPasswordPage />} />
          <Route path="/xac-thuc-email"        element={<VerifyEmailPage />} />
          <Route path="/dat-lai-mat-khau"      element={<ResetPasswordPage />} />
          <Route path="/tai-khoan"             element={<ProfilePage />} />
          <Route path="/don-hang/:id"          element={<OrderDetailPage />} />
          <Route path="/tim-kiem"              element={<SearchPage />} />
          <Route path="/chinh-sach/:slug"      element={<PolicyPage />} />
          <Route path="/dieu-khoan"            element={<PolicyPage />} />
          <Route path="/lien-he"               element={<ContactPage />} />
          <Route path="/faq"                   element={<FAQPage />} />
          <Route path="/he-thong-cua-hang"     element={<StoreSystemPage />} />
          <Route path="/tra-cuu-don-hang"      element={<OrderTrackingPage />} />
          <Route path="*"                      element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
