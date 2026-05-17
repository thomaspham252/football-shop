import SectionTitle from '../common/SectionTitle';
import ProductCard from '../common/ProductCard';
import './BestSellers.css';

const FG = [
  'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR1Qvo0hVSZ1GLKN-AgXnmvqmHi2tIxyEUpZU2tP4kKIM0ya7str5jiG81sJ9oZ5iTXLTTI8OHUx6-gxXNn53WeF8ZxhsfG9-WLqB7Ez-E&usqp=CAc',
  'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQKcANnmJ0ZYfVIm8G79Ej-ZcovfK6_DvLxu7GZuRhC5CUuBzLn3Mtf7KAZNyPyhBXrZFBtU7COsZsYzWqjrasIRzoh00TnyHtfeQrk9WSVdilJYfbJpzI6&usqp=CAc',
  'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRv_UHlQXzsCDPFPkRY5x4nkZpgHL0Vsdd8j4T2yCo9NcGtUMkBLsw-JBTyQE3xr5vUNSg2O6vOAz1JeWbMC-JMWiHxYWbgmBHSMwN-MwT55Fh2IvF-kkFIeevNrio0UQSNKk-pxqUoDA&usqp=CAc',
  'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRiMxjgIOkGzvZxSTZWjk3rNVyPIN-JgxjgKqDmf_HBS0A6t0KH7NkQyZlGZrEnsvGMqD8VshyirFL4LC18msQGGesnlov2Epzep9AyfklWL-6R33SHpaacG5VCaauFKc7_7SZnYg&usqp=CAc',
  'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR1Qvo0hVSZ1GLKN-AgXnmvqmHi2tIxyEUpZU2tP4kKIM0ya7str5jiG81sJ9oZ5iTXLTTI8OHUx6-gxXNn53WeF8ZxhsfG9-WLqB7Ez-E&usqp=CAc',
];

const bestSellers = [
  {
    id: 1,
    name: 'Giày Đá Bóng Nike Mercurial Vapor 16 Elite FG',
    brand: 'Nike',
    price: 5800000,
    originalPrice: 7200000,
    image: FG[0],
    badge: { type: 'sale', label: 'SALE' },
    colors: ['#f5a623', '#000'],
  },
  {
    id: 2,
    name: 'Giày Đá Bóng Adidas Predator Elite FG',
    brand: 'Adidas',
    price: 5200000,
    originalPrice: 6500000,
    image: FG[1],
    badge: { type: 'hot', label: 'HOT' },
    colors: ['#000', '#e53935'],
  },
  {
    id: 3,
    name: 'Giày Đá Bóng Puma Future 7 Ultimate FG/AG',
    brand: 'Puma',
    price: 4900000,
    originalPrice: 6000000,
    image: FG[2],
    badge: { type: 'hot', label: 'HOT' },
    colors: ['#9c27b0', '#fff'],
  },
  {
    id: 4,
    name: 'Giày Đá Bóng Nike Phantom GX 2 Elite FG',
    brand: 'Nike',
    price: 5500000,
    originalPrice: 6800000,
    image: FG[3],
    colors: ['#1565c0', '#fff'],
  },
  {
    id: 5,
    name: 'Giày Đá Bóng Adidas X Crazyfast Elite FG',
    brand: 'Adidas',
    price: 5100000,
    originalPrice: null,
    image: FG[4],
    badge: { type: 'sale', label: 'SALE' },
    colors: ['#ffeb3b', '#000'],
  },
  {
    id: 6,
    name: 'Giày Đá Bóng Nike Tiempo Legend 10 Elite FG',
    brand: 'Nike',
    price: 4800000,
    originalPrice: 5800000,
    image: FG[0],
    colors: ['#fff', '#c9a96e'],
  },
  {
    id: 7,
    name: 'Giày Đá Bóng Puma King Ultimate FG/AG',
    brand: 'Puma',
    price: 4500000,
    originalPrice: 5500000,
    image: FG[1],
    badge: { type: 'hot', label: 'HOT' },
    colors: ['#000', '#fff'],
  },
  {
    id: 8,
    name: 'Giày Đá Bóng Adidas Copa Pure 2 Elite FG',
    brand: 'Adidas',
    price: 4700000,
    originalPrice: 5800000,
    image: FG[2],
    colors: ['#fff', '#c9a96e'],
  },
];

export default function BestSellers() {
  return (
    <section className="best-sellers">
      <div className="best-sellers__container">
        <SectionTitle title="SẢN PHẨM BÁN CHẠY" subtitle="Những sản phẩm được yêu thích nhất" />
        <div className="best-sellers__grid">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="best-sellers__more">
          <a href="/san-pham" className="best-sellers__more-btn">
            ĐỔI THÊM
          </a>
        </div>
      </div>
    </section>
  );
}
