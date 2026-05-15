import { useState } from 'react';
import SectionTitle from '../common/SectionTitle';
import ProductCard from '../common/ProductCard';
import './SportCategories.css';

const categories = [
  { id: 'pickleball', label: 'PICKLEBALL' },
  { id: 'chay-bo', label: 'CHẠY BỘ' },
  { id: 'bong-da', label: 'BÓNG ĐÁ' },
  { id: 'tennis', label: 'TENNIS' },
  { id: 'boi-loi', label: 'BƠI LỘI' },
];

const productsByCategory = {
  pickleball: [
    {
      id: 1,
      name: 'Giày Pickleball Pro X1 Chuyên Nghiệp',
      brand: 'Nike',
      price: 2900000,
      originalPrice: 3800000,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
      colors: ['#fff', '#000'],
    },
    {
      id: 2,
      name: 'Vợt Pickleball Carbon Fiber Elite',
      brand: 'Wilson',
      price: 1500000,
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80',
      colors: ['#1565c0', '#e53935'],
    },
    {
      id: 3,
      name: 'Áo Thể Thao Pickleball Thoáng Khí',
      brand: 'Adidas',
      price: 650000,
      originalPrice: 890000,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
      colors: ['#1565c0', '#fff', '#000'],
    },
    {
      id: 4,
      name: 'Váy Thể Thao Nữ Pickleball',
      brand: 'Nike',
      price: 780000,
      image: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=400&q=80',
      colors: ['#e8d5b7', '#fff', '#333'],
    },
  ],
  'chay-bo': [
    {
      id: 5,
      name: 'Giày Chạy Bộ Air Zoom Pegasus 41',
      brand: 'Nike',
      price: 3500000,
      originalPrice: 4200000,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
      colors: ['#e53935', '#fff', '#000'],
    },
    {
      id: 6,
      name: 'Giày Chạy Bộ Ultraboost 22',
      brand: 'Adidas',
      price: 4100000,
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80',
      colors: ['#000', '#fff'],
    },
    {
      id: 7,
      name: 'Áo Chạy Bộ Dri-FIT UV',
      brand: 'Nike',
      price: 590000,
      originalPrice: 750000,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
      colors: ['#1565c0', '#000', '#e53935'],
    },
    {
      id: 8,
      name: 'Quần Short Chạy Bộ Flex Stride',
      brand: 'Nike',
      price: 480000,
      image: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=400&q=80',
      colors: ['#000', '#333', '#1565c0'],
    },
  ],
  'bong-da': [
    {
      id: 9,
      name: 'Giày Đá Bóng Mercurial Vapor 16',
      brand: 'Nike',
      price: 3800000,
      originalPrice: 5200000,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
      badge: { type: 'hot', label: 'HOT' },
      colors: ['#f5a623', '#000'],
    },
    {
      id: 10,
      name: 'Giày Đá Bóng Predator Elite',
      brand: 'Adidas',
      price: 4500000,
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80',
      colors: ['#000', '#e53935'],
    },
    {
      id: 11,
      name: 'Áo Đấu CLB Barcelona 2025',
      brand: 'Nike',
      price: 1200000,
      originalPrice: 1600000,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
      colors: ['#1565c0', '#e53935'],
    },
    {
      id: 12,
      name: 'Bóng Đá FIFA Quality Pro',
      brand: 'Adidas',
      price: 890000,
      image: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=400&q=80',
      colors: ['#fff', '#000'],
    },
  ],
  tennis: [
    {
      id: 13,
      name: 'Giày Tennis Court Zoom NXT',
      brand: 'Nike',
      price: 3200000,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
      colors: ['#fff', '#000', '#e53935'],
    },
    {
      id: 14,
      name: 'Vợt Tennis Blade 98 V9',
      brand: 'Wilson',
      price: 5800000,
      originalPrice: 7200000,
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80',
      colors: ['#1b5e20', '#000'],
    },
    {
      id: 15,
      name: 'Áo Tennis Polo Dri-FIT',
      brand: 'Nike',
      price: 720000,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
      colors: ['#fff', '#1565c0', '#000'],
    },
    {
      id: 16,
      name: 'Váy Tennis Advantage',
      brand: 'Nike',
      price: 850000,
      originalPrice: 1100000,
      image: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=400&q=80',
      colors: ['#fff', '#000'],
    },
  ],
  'boi-loi': [
    {
      id: 17,
      name: 'Kính Bơi Thi Đấu Vanquisher 2.0',
      brand: 'Speedo',
      price: 450000,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
      colors: ['#1565c0', '#000', '#e53935'],
    },
    {
      id: 18,
      name: 'Quần Bơi Fastskin LZR Pure',
      brand: 'Speedo',
      price: 1200000,
      originalPrice: 1600000,
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80',
      colors: ['#000', '#1565c0'],
    },
    {
      id: 19,
      name: 'Mũ Bơi Silicone Pro',
      brand: 'Arena',
      price: 180000,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
      colors: ['#e53935', '#000', '#fff'],
    },
    {
      id: 20,
      name: 'Phao Bơi Tập Luyện',
      brand: 'Speedo',
      price: 220000,
      image: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=400&q=80',
      colors: ['#f5a623', '#1565c0'],
    },
  ],
};

export default function SportCategories() {
  const [active, setActive] = useState('pickleball');

  return (
    <section className="sport-categories">
      <div className="sport-categories__container">
        <SectionTitle title="CÁC BỘ MÔN THỂ THAO" />

        <div className="sport-categories__tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`sport-categories__tab ${active === cat.id ? 'sport-categories__tab--active' : ''}`}
              onClick={() => setActive(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="sport-categories__grid">
          {(productsByCategory[active] || []).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="sport-categories__more">
          <a href="/san-pham" className="sport-categories__more-btn">
            XEM TẤT CẢ SẢN PHẨM
          </a>
        </div>
      </div>
    </section>
  );
}
