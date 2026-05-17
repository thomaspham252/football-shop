import { useState, useMemo, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProductCard from '../../components/common/ProductCard';
import { Search, X } from 'lucide-react';
import './SearchPage.css';

/* Mock product pool */
const ALL_PRODUCTS = [
  { id: 1,  name: 'Giày Đá Bóng Nike Mercurial Vapor 16 Elite FG', brand: 'Nike',   price: 5800000, originalPrice: 7200000, image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR1Qvo0hVSZ1GLKN-AgXnmvqmHi2tIxyEUpZU2tP4kKIM0ya7str5jiG81sJ9oZ5iTXLTTI8OHUx6-gxXNn53WeF8ZxhsfG9-WLqB7Ez-E&usqp=CAc',  badge: { type: 'sale', label: 'SALE' }, colors: ['#f5a623','#000'] },
  { id: 2,  name: 'Giày Đá Bóng Adidas Predator Elite FG',          brand: 'Adidas', price: 5200000, originalPrice: 6500000, image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQKcANnmJ0ZYfVIm8G79Ej-ZcovfK6_DvLxu7GZuRhC5CUuBzLn3Mtf7KAZNyPyhBXrZFBtU7COsZsYzWqjrasIRzoh00TnyHtfeQrk9WSVdilJYfbJpzI6&usqp=CAc', badge: { type: 'hot', label: 'HOT' },  colors: ['#000','#e53935'] },
  { id: 3,  name: 'Giày Đá Bóng Puma Future 7 Ultimate FG/AG',      brand: 'Puma',   price: 4900000, originalPrice: 6000000, image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRv_UHlQXzsCDPFPkRY5x4nkZpgHL0Vsdd8j4T2yCo9NcGtUMkBLsw-JBTyQE3xr5vUNSg2O6vOAz1JeWbMC-JMWiHxYWbgmBHSMwN-MwT55Fh2IvF-kkFIeevNrio0UQSNKk-pxqUoDA&usqp=CAc',  badge: { type: 'new', label: 'MỚI' },  colors: ['#9c27b0','#fff'] },
  { id: 4,  name: 'Giày Đá Bóng Nike Phantom GX 2 Elite FG',        brand: 'Nike',   price: 5500000, originalPrice: 6800000, image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRiMxjgIOkGzvZxSTZWjk3rNVyPIN-JgxjgKqDmf_HBS0A6t0KH7NkQyZlGZrEnsvGMqD8VshyirFL4LC18msQGGesnlov2Epzep9AyfklWL-6R33SHpaacG5VCaauFKc7_7SZnYg&usqp=CAc', badge: { type: 'sale', label: 'SALE' }, colors: ['#1565c0','#fff'] },
  { id: 5,  name: 'Áo Đấu Nike Dri-FIT Academy 23',                  brand: 'Nike',   price: 650000,  originalPrice: 850000,  image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR1Qvo0hVSZ1GLKN-AgXnmvqmHi2tIxyEUpZU2tP4kKIM0ya7str5jiG81sJ9oZ5iTXLTTI8OHUx6-gxXNn53WeF8ZxhsfG9-WLqB7Ez-E&usqp=CAc', badge: null, colors: ['#e53935','#fff'] },
  { id: 6,  name: 'Áo Đấu Adidas Tiro 23 League',                    brand: 'Adidas', price: 580000,  originalPrice: 720000,  image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQKcANnmJ0ZYfVIm8G79Ej-ZcovfK6_DvLxu7GZuRhC5CUuBzLn3Mtf7KAZNyPyhBXrZFBtU7COsZsYzWqjrasIRzoh00TnyHtfeQrk9WSVdilJYfbJpzI6&usqp=CAc',  badge: null, colors: ['#1565c0','#fff'] },
  { id: 7,  name: 'Giày Đá Bóng Nike Phantom GX 2 Pro TF',           brand: 'Nike',   price: 3200000, originalPrice: 4000000, image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR1Qvo0hVSZ1GLKN-AgXnmvqmHi2tIxyEUpZU2tP4kKIM0ya7str5jiG81sJ9oZ5iTXLTTI8OHUx6-gxXNn53WeF8ZxhsfG9-WLqB7Ez-E&usqp=CAc', badge: { type: 'new', label: 'MỚI' },  colors: ['#1565c0','#fff','#000'] },
  { id: 8,  name: 'Giày Đá Bóng Adidas Predator League TF',          brand: 'Adidas', price: 2800000, originalPrice: 3500000, image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQKcANnmJ0ZYfVIm8G79Ej-ZcovfK6_DvLxu7GZuRhC5CUuBzLn3Mtf7KAZNyPyhBXrZFBtU7COsZsYzWqjrasIRzoh00TnyHtfeQrk9WSVdilJYfbJpzI6&usqp=CAc',  badge: { type: 'sale', label: 'SALE' }, colors: ['#000','#e53935'] },
  { id: 9,  name: 'Bóng Đá FIFA Quality Pro Adidas',                  brand: 'Adidas', price: 890000,  originalPrice: 1100000, image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRv_UHlQXzsCDPFPkRY5x4nkZpgHL0Vsdd8j4T2yCo9NcGtUMkBLsw-JBTyQE3xr5vUNSg2O6vOAz1JeWbMC-JMWiHxYWbgmBHSMwN-MwT55Fh2IvF-kkFIeevNrio0UQSNKk-pxqUoDA&usqp=CAc', badge: null, colors: ['#fff','#000'] },
  { id: 10, name: 'Tất Đá Bóng Nike Dri-FIT',                        brand: 'Nike',   price: 120000,  originalPrice: 150000,  image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRiMxjgIOkGzvZxSTZWjk3rNVyPIN-JgxjgKqDmf_HBS0A6t0KH7NkQyZlGZrEnsvGMqD8VshyirFL4LC18msQGGesnlov2Epzep9AyfklWL-6R33SHpaacG5VCaauFKc7_7SZnYg&usqp=CAc', badge: null, colors: ['#fff','#000','#e53935'] },
];

export default function SearchPage() {
  const params  = new URLSearchParams(window.location.search);
  const initial = params.get('q') || '';

  const [query,  setQuery]  = useState(initial);
  const [input,  setInput]  = useState(initial);

  useEffect(() => {
    document.title = query ? `Tìm kiếm: "${query}" — Football Shop` : 'Tìm kiếm — Football Shop';
  }, [query]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return ALL_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(input.trim());
    window.history.replaceState(null, '', `/tim-kiem?q=${encodeURIComponent(input.trim())}`);
  };

  return (
    <div className="sp-page">
      <Navbar />
      <main className="sp-main">
        <div className="sp-container">
          {/* Search bar */}
          <form className="sp-searchbar" onSubmit={handleSearch}>
            <Search size={18} className="sp-searchbar__icon" />
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Tìm kiếm sản phẩm, thương hiệu..."
              className="sp-searchbar__input"
              autoFocus
            />
            {input && (
              <button type="button" className="sp-searchbar__clear"
                onClick={() => { setInput(''); setQuery(''); }}>
                <X size={16} />
              </button>
            )}
            <button type="submit" className="sp-searchbar__btn">Tìm kiếm</button>
          </form>

          {/* Results */}
          {!query.trim() ? (
            <div className="sp-empty">
              <Search size={48} strokeWidth={1} />
              <p>Nhập từ khóa để tìm kiếm sản phẩm</p>
            </div>
          ) : results.length === 0 ? (
            <div className="sp-empty">
              <Search size={48} strokeWidth={1} />
              <p>Không tìm thấy kết quả cho <strong>"{query}"</strong></p>
              <span>Thử tìm với từ khóa khác hoặc xem tất cả sản phẩm</span>
              <a href="/san-pham" className="sp-browse-btn">Xem tất cả sản phẩm</a>
            </div>
          ) : (
            <>
              <div className="sp-results-header">
                <p className="sp-results-count">
                  Tìm thấy <strong>{results.length}</strong> kết quả cho <strong>"{query}"</strong>
                </p>
              </div>
              <div className="sp-grid">
                {results.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
