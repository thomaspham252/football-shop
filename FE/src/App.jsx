import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/san-pham/:id" element={<ProductDetail />} />
        <Route path="/san-pham" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
