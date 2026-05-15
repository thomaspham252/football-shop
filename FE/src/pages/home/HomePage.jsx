import Navbar from '../../components/layout/Navbar';
import HeroBanner from '../../components/home/HeroBanner';
import PromoBar from '../../components/home/PromoBar';
import NewProducts from '../../components/home/NewProducts';
import SportCategories from '../../components/home/SportCategories';
import BrandLogos from '../../components/home/BrandLogos';
import BestSellers from '../../components/home/BestSellers';
import Footer from '../../components/layout/Footer';
import '../../App.css';

export default function HomePage() {
  return (
    <div className="app">
      <Navbar />
      <main className="app__content">
        <HeroBanner />
        <PromoBar />
        <NewProducts />
        <SportCategories />
        <BrandLogos />
        <BestSellers />
      </main>
      <Footer />
    </div>
  );
}
