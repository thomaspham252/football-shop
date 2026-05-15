import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import PromoBar from '../components/PromoBar';
import NewProducts from '../components/NewProducts';
import SportCategories from '../components/SportCategories';
import BrandLogos from '../components/BrandLogos';
import BestSellers from '../components/BestSellers';
import Footer from '../components/Footer';
import '../App.css';

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
