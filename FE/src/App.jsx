import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/home/HomePage';
import ProductsPage from './pages/products/ProductsPage';
import ProductDetail from './pages/product/ProductDetail';
import CartPage from './pages/cart/CartPage';
import PaymentPage from './pages/payment/PaymentPage';
import OrderSuccess from './pages/payment/OrderSuccess';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/san-pham" element={<ProductsPage />} />
        <Route path="/san-pham/:id" element={<ProductDetail />} />
        <Route path="/gio-hang" element={<CartPage />} />
        <Route path="/thanh-toan" element={<PaymentPage />} />
        <Route path="/dat-hang-thanh-cong" element={<OrderSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
