import Navbar from '../../components/layout/Navbar';
import HeroBanner from '../../components/home/HeroBanner';
import PromoBar from '../../components/home/PromoBar';
import NewProducts from '../../components/home/NewProducts';
import PromotionProducts from '../../components/home/PromotionProducts';
import BrandLogos from '../../components/home/BrandLogos';
import BestSellers from '../../components/home/BestSellers';
import Footer from '../../components/layout/Footer';
import '../../App.css';
import { useEffect, useState } from 'react';
import homeApi from '../../api/homeApi';

export default function HomePage() {
  const [newProducts, setNewProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [promotionProducts, setPromotionProducts] = useState([]);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const response = await homeApi.getNewProducts(4);
        setNewProducts(response.data);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm mới:", error);
      }
    };

    const fetchBestSellingProducts = async () => {
      try {
        const response = await homeApi.getBestSellingProducts(4);
        setBestSellingProducts(response.data);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm bán chạy:", error);
      }
    };

    const fetchPromotionProducts = async () => {
      try {
        const response = await homeApi.getPromotionProducts(4);
        setPromotionProducts(response.data);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm khuyến mãi:", error);
      }
    };

    fetchNewProducts();
    fetchBestSellingProducts();
    fetchPromotionProducts();
  }, []);

  return (
    <div className="app">
      <Navbar />
      <main className="app__content">
        <HeroBanner />
        <PromoBar />
        <NewProducts newProducts={newProducts} />
        <PromotionProducts promotionProducts={promotionProducts} />
        <BrandLogos />
        <BestSellers bestSellersProduct={bestSellingProducts} />
      </main>
      <Footer />
    </div>
  );
}
