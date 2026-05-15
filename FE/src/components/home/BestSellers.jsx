import SectionTitle from '../common/SectionTitle';
import ProductCard from '../common/ProductCard';
import './BestSellers.css';

const bestSellers = [
  {
    id: 1,
    name: 'Dép Thể Thao Benassi JDI Slide',
    brand: 'Nike',
    price: 650000,
    originalPrice: 890000,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    badge: { type: 'sale', label: 'SALE' },
    colors: ['#9e9e9e', '#fff', '#000'],
  },
  {
    id: 2,
    name: 'Giày Nike Dunk Low Retro',
    brand: 'Nike',
    price: 2800000,
    originalPrice: 3500000,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80',
    badge: { type: 'hot', label: 'HOT' },
    colors: ['#fff', '#000', '#e53935'],
  },
  {
    id: 3,
    name: 'Giày Chạy Bộ React Infinity Run 4',
    brand: 'Nike',
    price: 3200000,
    originalPrice: 4100000,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
    badge: { type: 'hot', label: 'HOT' },
    colors: ['#1565c0', '#000', '#fff'],
  },
  {
    id: 4,
    name: 'Giày Trail Running Wildhorse 8',
    brand: 'Nike',
    price: 2900000,
    originalPrice: 3800000,
    image: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=400&q=80',
    colors: ['#795548', '#000', '#9e9e9e'],
  },
  {
    id: 5,
    name: 'Giày Bóng Đá Phantom GX Elite',
    brand: 'Nike',
    price: 4800000,
    originalPrice: 6200000,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    badge: { type: 'sale', label: 'SALE' },
    colors: ['#f5a623', '#000'],
  },
  {
    id: 6,
    name: 'Giày Tennis Air Zoom Vapor 11',
    brand: 'Nike',
    price: 3600000,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80',
    colors: ['#fff', '#1565c0', '#000'],
  },
  {
    id: 7,
    name: 'Giày Bóng Rổ LeBron NXXT Gen',
    brand: 'Nike',
    price: 5200000,
    originalPrice: 6800000,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
    badge: { type: 'hot', label: 'HOT' },
    colors: ['#e53935', '#000', '#fff'],
  },
  {
    id: 8,
    name: 'Giày Thể Thao Air Max 270',
    brand: 'Nike',
    price: 3100000,
    originalPrice: 4000000,
    image: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=400&q=80',
    colors: ['#000', '#fff', '#e53935'],
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
