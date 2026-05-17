import { useState } from 'react';
import SectionTitle from '../common/SectionTitle';
import ProductCard from '../common/ProductCard';
import './SportCategories.css';

const categories = [
  { id: 'giay-fg',   label: 'GIÀY FG' },
  { id: 'giay-tf',   label: 'GIÀY TF' },
  { id: 'giay-ag',   label: 'GIÀY AG' },
  { id: 'ao-dau',    label: 'ÁO ĐẤU' },
  { id: 'phu-kien',  label: 'PHỤ KIỆN' },
];

const FG = [
  'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR1Qvo0hVSZ1GLKN-AgXnmvqmHi2tIxyEUpZU2tP4kKIM0ya7str5jiG81sJ9oZ5iTXLTTI8OHUx6-gxXNn53WeF8ZxhsfG9-WLqB7Ez-E&usqp=CAc',
  'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQKcANnmJ0ZYfVIm8G79Ej-ZcovfK6_DvLxu7GZuRhC5CUuBzLn3Mtf7KAZNyPyhBXrZFBtU7COsZsYzWqjrasIRzoh00TnyHtfeQrk9WSVdilJYfbJpzI6&usqp=CAc',
  'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRv_UHlQXzsCDPFPkRY5x4nkZpgHL0Vsdd8j4T2yCo9NcGtUMkBLsw-JBTyQE3xr5vUNSg2O6vOAz1JeWbMC-JMWiHxYWbgmBHSMwN-MwT55Fh2IvF-kkFIeevNrio0UQSNKk-pxqUoDA&usqp=CAc',
  'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRiMxjgIOkGzvZxSTZWjk3rNVyPIN-JgxjgKqDmf_HBS0A6t0KH7NkQyZlGZrEnsvGMqD8VshyirFL4LC18msQGGesnlov2Epzep9AyfklWL-6R33SHpaacG5VCaauFKc7_7SZnYg&usqp=CAc',
];

const TF = [
  'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR1Qvo0hVSZ1GLKN-AgXnmvqmHi2tIxyEUpZU2tP4kKIM0ya7str5jiG81sJ9oZ5iTXLTTI8OHUx6-gxXNn53WeF8ZxhsfG9-WLqB7Ez-E&usqp=CAc',
  'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQKcANnmJ0ZYfVIm8G79Ej-ZcovfK6_DvLxu7GZuRhC5CUuBzLn3Mtf7KAZNyPyhBXrZFBtU7COsZsYzWqjrasIRzoh00TnyHtfeQrk9WSVdilJYfbJpzI6&usqp=CAc',
  'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRv_UHlQXzsCDPFPkRY5x4nkZpgHL0Vsdd8j4T2yCo9NcGtUMkBLsw-JBTyQE3xr5vUNSg2O6vOAz1JeWbMC-JMWiHxYWbgmBHSMwN-MwT55Fh2IvF-kkFIeevNrio0UQSNKk-pxqUoDA&usqp=CAc',
  'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRiMxjgIOkGzvZxSTZWjk3rNVyPIN-JgxjgKqDmf_HBS0A6t0KH7NkQyZlGZrEnsvGMqD8VshyirFL4LC18msQGGesnlov2Epzep9AyfklWL-6R33SHpaacG5VCaauFKc7_7SZnYg&usqp=CAc',
];

const productsByCategory = {
  'giay-fg': [
    { id: 1,  name: 'Giày Đá Bóng Nike Mercurial Vapor 16 Elite FG', brand: 'Nike',   price: 5800000, originalPrice: 7200000, image: FG[0], badge: { type: 'hot', label: 'HOT' }, colors: ['#f5a623', '#000'] },
    { id: 2,  name: 'Giày Đá Bóng Adidas Predator Elite FG',          brand: 'Adidas', price: 5200000, originalPrice: 6500000, image: FG[1], badge: { type: 'new', label: 'MỚI' }, colors: ['#000', '#e53935'] },
    { id: 3,  name: 'Giày Đá Bóng Puma Future 7 Ultimate FG/AG',      brand: 'Puma',   price: 4900000, originalPrice: 6000000, image: FG[2], colors: ['#9c27b0', '#fff'] },
    { id: 4,  name: 'Giày Đá Bóng Nike Phantom GX 2 Elite FG',        brand: 'Nike',   price: 5500000, originalPrice: 6800000, image: FG[3], badge: { type: 'sale', label: 'SALE' }, colors: ['#1565c0', '#fff'] },
  ],
  'giay-tf': [
    { id: 5,  name: 'Giày Đá Bóng Nike Phantom GX 2 Pro TF',          brand: 'Nike',   price: 3200000, originalPrice: 4000000, image: TF[0], badge: { type: 'new', label: 'MỚI' }, colors: ['#1565c0', '#fff', '#000'] },
    { id: 6,  name: 'Giày Đá Bóng Adidas Predator League TF',         brand: 'Adidas', price: 2800000, originalPrice: 3500000, image: TF[1], badge: { type: 'sale', label: 'SALE' }, colors: ['#000', '#e53935'] },
    { id: 7,  name: 'Giày Đá Bóng Puma Future 7 Play TF',             brand: 'Puma',   price: 1900000, originalPrice: 2400000, image: TF[2], colors: ['#9c27b0', '#fff'] },
    { id: 8,  name: 'Giày Đá Bóng Nike Mercurial Vapor 16 Club TF',   brand: 'Nike',   price: 1600000, originalPrice: 2000000, image: TF[3], badge: { type: 'sale', label: 'SALE' }, colors: ['#f5a623', '#000'] },
  ],
  'giay-ag': [
    { id: 9,  name: 'Giày Đá Bóng Nike Mercurial Superfly 10 Elite AG', brand: 'Nike',   price: 6200000, originalPrice: 7800000, image: FG[0], badge: { type: 'hot', label: 'HOT' }, colors: ['#e53935', '#000'] },
    { id: 10, name: 'Giày Đá Bóng Adidas X Crazyfast Elite AG',         brand: 'Adidas', price: 5100000, originalPrice: null,    image: FG[1], badge: { type: 'new', label: 'MỚI' }, colors: ['#ffeb3b', '#000'] },
    { id: 11, name: 'Giày Đá Bóng Puma King Ultimate FG/AG',            brand: 'Puma',   price: 4500000, originalPrice: 5500000, image: FG[2], colors: ['#000', '#fff'] },
    { id: 12, name: 'Giày Đá Bóng Nike Tiempo Legend 10 Elite FG',      brand: 'Nike',   price: 4800000, originalPrice: 5800000, image: FG[3], badge: { type: 'sale', label: 'SALE' }, colors: ['#fff', '#c9a96e'] },
  ],
  'ao-dau': [
    { id: 13, name: 'Áo Đấu Nike Dri-FIT Academy 23',    brand: 'Nike',   price: 650000,  originalPrice: 850000,  image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR1Qvo0hVSZ1GLKN-AgXnmvqmHi2tIxyEUpZU2tP4kKIM0ya7str5jiG81sJ9oZ5iTXLTTI8OHUx6-gxXNn53WeF8ZxhsfG9-WLqB7Ez-E&usqp=CAc', badge: { type: 'sale', label: 'SALE' }, colors: ['#e53935', '#fff', '#000'] },
    { id: 14, name: 'Áo Đấu Adidas Tiro 23 League',      brand: 'Adidas', price: 580000,  originalPrice: 720000,  image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQKcANnmJ0ZYfVIm8G79Ej-ZcovfK6_DvLxu7GZuRhC5CUuBzLn3Mtf7KAZNyPyhBXrZFBtU7COsZsYzWqjrasIRzoh00TnyHtfeQrk9WSVdilJYfbJpzI6&usqp=CAc', colors: ['#1565c0', '#fff'] },
    { id: 15, name: 'Áo Đấu CLB Barcelona 2025',         brand: 'Nike',   price: 1200000, originalPrice: 1600000, image: FG[0], colors: ['#1565c0', '#e53935'] },
    { id: 16, name: 'Áo Đấu Đội Tuyển Việt Nam 2025',    brand: 'Grand Sport', price: 950000, originalPrice: 1200000, image: FG[1], badge: { type: 'new', label: 'MỚI' }, colors: ['#e53935', '#fff'] },
  ],
  'phu-kien': [
    { id: 17, name: 'Bóng Đá FIFA Quality Pro Adidas',   brand: 'Adidas', price: 890000,  originalPrice: 1100000, image: FG[2], colors: ['#fff', '#000'] },
    { id: 18, name: 'Tất Đá Bóng Nike Dri-FIT',          brand: 'Nike',   price: 120000,  originalPrice: 150000,  image: FG[3], colors: ['#fff', '#000', '#e53935'] },
    { id: 19, name: 'Bảo Vệ Ống Đồng Nike Mercurial',    brand: 'Nike',   price: 350000,  originalPrice: 450000,  image: FG[0], colors: ['#f5a623', '#000'] },
    { id: 20, name: 'Găng Tay Thủ Môn Adidas Predator',  brand: 'Adidas', price: 780000,  originalPrice: 980000,  image: FG[1], badge: { type: 'new', label: 'MỚI' }, colors: ['#000', '#e53935'] },
  ],
};

export default function SportCategories() {
  const [active, setActive] = useState('giay-fg');

  return (
    <section className="sport-categories">
      <div className="sport-categories__container">
        <SectionTitle title="DANH MỤC SẢN PHẨM" />

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
