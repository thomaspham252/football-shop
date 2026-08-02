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
import ProfilePage from './pages/profile/ProfilePage';
import OrderDetailPage from './pages/profile/OrderDetailPage';
import SearchPage from './pages/search/SearchPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                      element={<HomePage />} />
        <Route path="/san-pham"              element={<ProductsPage />} />
        <Route path="/san-pham/:id"          element={<ProductDetail />} />
        <Route path="/huong-dan-chon-size"   element={<SizeGuidePage />} />
        <Route path="/gio-hang"              element={<CartPage />} />
        <Route path="/thanh-toan"            element={<PaymentPage />} />
        <Route path="/dat-hang-thanh-cong"   element={<OrderSuccess />} />
        <Route path="/dang-nhap"             element={<LoginPage />} />
        <Route path="/dang-ky"               element={<RegisterPage />} />
        <Route path="/quen-mat-khau"         element={<ForgotPasswordPage />} />
        <Route path="/tai-khoan"             element={<ProfilePage />} />
        <Route path="/don-hang/:id"          element={<OrderDetailPage />} />
        <Route path="/tim-kiem"              element={<SearchPage />} />
        <Route path="*"                      element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

