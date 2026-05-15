import SectionTitle from './SectionTitle';
import ProductCard from './ProductCard';
import './NewProducts.css';

const newProducts = [
  {
    id: 1,
    name: 'Giày Quần Vợt Pickleball Zoom Vapor Pro 3 HC',
    brand: 'Nike',
    price: 3200000,
    originalPrice: 4500000,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    badge: { type: 'new', label: 'MỚI' },
    colors: ['#fff', '#000', '#e53935'],
  },
  {
    id: 2,
    name: 'Giày Quần Vợt Pickleball Ultrashot 4',
    brand: 'K-Swiss',
    price: 2800000,
    originalPrice: 3600000,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80',
    badge: { type: 'new', label: 'MỚI' },
    colors: ['#f5a623', '#fff', '#333'],
  },
  {
    id: 3,
    name: 'Kính Bơi Thể Thao Valiant Mirrored',
    brand: 'Swim',
    price: 890000,
    originalPrice: 1200000,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
    badge: { type: 'hot', label: 'HOT' },
    colors: ['#1565c0', '#000', '#e53935'],
  },
  {
    id: 4,
    name: 'Giày Thể Thao Thời Trang Cloud 5',
    brand: 'On',
    price: 4200000,
    originalPrice: 5500000,
    image: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=400&q=80',
    badge: { type: 'new', label: 'MỚI' },
    colors: ['#fff', '#e8d5b7', '#333'],
  },
];

export default function NewProducts() {
  return (
    <section className="new-products">
      <div className="new-products__container">
        <SectionTitle title={`SẢN PHẨM MỚI THÁNG ${new Date().getMonth() + 1}`} />
        <div className="new-products__grid">
          {newProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="new-products__more">
          <a href="/san-pham" className="new-products__more-btn">
            XEM TẤT CẢ SẢN PHẨM MỚI
          </a>
        </div>
      </div>
    </section>
  );
}
