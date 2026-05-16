import { useState, useMemo } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProductCard from '../../components/common/ProductCard';
import {
  ChevronRight, ChevronDown, ChevronUp,
  SlidersHorizontal, X
} from 'lucide-react';
import './ProductsPage.css';

/* ── Mock products ── */
const ALL_PRODUCTS = [
  { id: 1,  name: 'Giày Đá Bóng Nike Mercurial Vapor 16 Elite FG', brand: 'Nike',   price: 5800000, originalPrice: 7200000, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', badge: { type: 'sale', label: 'SALE' }, colors: ['#f5a623','#000'], category: 'Giày FG', sizes: ['39','40','41','42','43'] },
  { id: 2,  name: 'Giày Đá Bóng Adidas Predator Elite FG', brand: 'Adidas', price: 5200000, originalPrice: 6500000, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80', badge: { type: 'hot', label: 'HOT' },  colors: ['#000','#e53935'], category: 'Giày FG', sizes: ['38','39','40','41','42'] },
  { id: 3,  name: 'Giày Đá Bóng Puma Future 7 Ultimate FG/AG', brand: 'Puma',   price: 4900000, originalPrice: 6000000, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', badge: { type: 'new', label: 'MỚI' },  colors: ['#9c27b0','#fff'], category: 'Giày FG', sizes: ['39','40','41','42','43','44'] },
  { id: 4,  name: 'Giày Đá Bóng Nike Phantom GX 2 Elite FG', brand: 'Nike',   price: 5500000, originalPrice: 6800000, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', badge: { type: 'sale', label: 'SALE' }, colors: ['#1565c0','#fff'], category: 'Giày FG', sizes: ['40','41','42','43'] },
  { id: 5,  name: 'Giày Đá Bóng Adidas X Crazyfast Elite FG', brand: 'Adidas', price: 5100000, originalPrice: null,    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&q=80', badge: { type: 'new', label: 'MỚI' },  colors: ['#ffeb3b','#000'], category: 'Giày FG', sizes: ['38','39','40','41'] },
  { id: 6,  name: 'Giày Đá Bóng Nike Tiempo Legend 10 Elite FG', brand: 'Nike',   price: 4800000, originalPrice: 5800000, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', badge: { type: 'sale', label: 'SALE' }, colors: ['#fff','#c9a96e'], category: 'Giày FG', sizes: ['39','40','41','42','43','44'] },
  { id: 7,  name: 'Giày Đá Bóng Puma King Ultimate FG/AG', brand: 'Puma',   price: 4500000, originalPrice: 5500000, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80', badge: null, colors: ['#000','#fff'], category: 'Giày FG', sizes: ['40','41','42','43'] },
  { id: 8,  name: 'Giày Đá Bóng Nike Mercurial Superfly 10 Elite FG', brand: 'Nike',   price: 6200000, originalPrice: 7800000, image: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=400&q=80', badge: { type: 'hot', label: 'HOT' },  colors: ['#e53935','#000'], category: 'Giày FG', sizes: ['39','40','41','42'] },
  { id: 9,  name: 'Giày Đá Bóng Adidas Copa Pure 2 Elite FG', brand: 'Adidas', price: 4700000, originalPrice: 5800000, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', badge: { type: 'sale', label: 'SALE' }, colors: ['#fff','#c9a96e'], category: 'Giày FG', sizes: ['38','39','40','41','42','43'] },
  { id: 10, name: 'Giày Đá Bóng Nike Phantom GX 2 Pro TF', brand: 'Nike',   price: 3200000, originalPrice: 4000000, image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&q=80', badge: { type: 'new', label: 'MỚI' },  colors: ['#1565c0','#fff','#000'], category: 'Giày TF', sizes: ['39','40','41','42','43'] },
  { id: 11, name: 'Giày Đá Bóng Adidas Predator League TF', brand: 'Adidas', price: 2800000, originalPrice: 3500000, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', badge: { type: 'sale', label: 'SALE' }, colors: ['#000','#e53935'], category: 'Giày TF', sizes: ['38','39','40','41','42'] },
  { id: 12, name: 'Giày Đá Bóng Puma Future 7 Play TF', brand: 'Puma',   price: 1900000, originalPrice: 2400000, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80', badge: null, colors: ['#9c27b0','#fff'], category: 'Giày TF', sizes: ['39','40','41','42','43','44'] },
  { id: 13, name: 'Giày Đá Bóng Nike Mercurial Vapor 16 Club TF', brand: 'Nike',   price: 1600000, originalPrice: 2000000, image: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=400&q=80', badge: { type: 'sale', label: 'SALE' }, colors: ['#f5a623','#000'], category: 'Giày TF', sizes: ['38','39','40','41'] },
  { id: 14, name: 'Giày Đá Bóng Adidas X Crazyfast Club TF', brand: 'Adidas', price: 1500000, originalPrice: null,    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', badge: { type: 'new', label: 'MỚI' },  colors: ['#ffeb3b','#000'], category: 'Giày TF', sizes: ['39','40','41','42'] },
  { id: 15, name: 'Giày Đá Bóng Nike Tiempo Legend 10 Club FG/MG', brand: 'Nike',   price: 1800000, originalPrice: 2200000, image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&q=80', badge: null, colors: ['#fff','#c9a96e'], category: 'Giày MG', sizes: ['39','40','41','42','43'] },
  { id: 16, name: 'Giày Đá Bóng Puma Ultra 5 Play FG/AG', brand: 'Puma',   price: 1700000, originalPrice: 2100000, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', badge: { type: 'sale', label: 'SALE' }, colors: ['#00bcd4','#000'], category: 'Giày MG', sizes: ['38','39','40','41','42'] },
  { id: 17, name: 'Áo Đấu Nike Dri-FIT Academy 23', brand: 'Nike',   price: 650000,  originalPrice: 850000,  image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80', badge: { type: 'sale', label: 'SALE' }, colors: ['#e53935','#fff','#000'], category: 'Áo đấu', sizes: ['S','M','L','XL'] },
  { id: 18, name: 'Áo Đấu Adidas Tiro 23 League', brand: 'Adidas', price: 580000,  originalPrice: 720000,  image: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=400&q=80', badge: null, colors: ['#1565c0','#fff'], category: 'Áo đấu', sizes: ['S','M','L','XL','XXL'] },
  { id: 19, name: 'Quần Đá Bóng Nike Dri-FIT Strike', brand: 'Nike',   price: 480000,  originalPrice: 600000,  image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', badge: { type: 'sale', label: 'SALE' }, colors: ['#000','#1565c0'], category: 'Quần đấu', sizes: ['S','M','L','XL'] },
  { id: 20, name: 'Tất Đá Bóng Adidas Milano 23', brand: 'Adidas', price: 120000,  originalPrice: 150000,  image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&q=80', badge: null, colors: ['#fff','#000','#e53935'], category: 'Phụ kiện', sizes: ['S','M','L'] },
];

const BRANDS    = ['Nike', 'Adidas', 'Puma'];
const CATEGORIES = ['Giày FG', 'Giày TF', 'Giày MG', 'Áo đấu', 'Quần đấu', 'Phụ kiện'];
const PRICE_RANGES = [
  { label: 'Dưới 1.000.000đ',   min: 0,       max: 1000000 },
  { label: '1.000.000 - 3.000.000đ', min: 1000000, max: 3000000 },
  { label: '3.000.000 - 5.000.000đ', min: 3000000, max: 5000000 },
  { label: 'Trên 5.000.000đ',   min: 5000000, max: Infinity },
];
const ALL_SIZES = ['38','38.5','39','39.5','40','40.5','41','41.5','42','42.5','43','44','S','M','L','XL','XXL'];

const ALL_COLORS = [
  { name: 'Đen',    hex: '#1a1a1a' },
  { name: 'Trắng',  hex: '#ffffff' },
  { name: 'Đỏ',     hex: '#e53935' },
  { name: 'Xanh dương', hex: '#1565c0' },
  { name: 'Vàng',   hex: '#f5a623' },
  { name: 'Xanh lá', hex: '#2e7d32' },
  { name: 'Tím',    hex: '#9c27b0' },
  { name: 'Hồng',   hex: '#e91e63' },
  { name: 'Xanh ngọc', hex: '#00bcd4' },
  { name: 'Vàng chanh', hex: '#cddc39' },
];
const SORT_OPTIONS = [
  { value: 'default',    label: 'Mặc định' },
  { value: 'price-asc',  label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
  { value: 'name-asc',   label: 'Tên A → Z' },
  { value: 'newest',     label: 'Mới nhất' },
];

const PAGE_SIZE = 15;

/* ── Collapsible filter group ── */
function FilterGroup({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="filter-group">
      <button className="filter-group__header" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && <div className="filter-group__body">{children}</div>}
    </div>
  );
}

export default function ProductsPage() {
  const [selectedBrands,     setSelectedBrands]     = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrices,     setSelectedPrices]     = useState([]);
  const [selectedSizes,      setSelectedSizes]      = useState([]);
  const [selectedColors,     setSelectedColors]     = useState([]);
  const [sort,               setSort]               = useState('default');
  const [page,               setPage]               = useState(1);
  const [mobileSidebarOpen,  setMobileSidebarOpen]  = useState(false);

  /* toggle helpers */
  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);

  /* filter + sort */
  const filtered = useMemo(() => {
    let list = [...ALL_PRODUCTS];
    if (selectedBrands.length)     list = list.filter(p => selectedBrands.includes(p.brand));
    if (selectedCategories.length) list = list.filter(p => selectedCategories.includes(p.category));
    if (selectedPrices.length) {
      list = list.filter(p =>
        selectedPrices.some(label => {
          const r = PRICE_RANGES.find(pr => pr.label === label);
          return r && p.price >= r.min && p.price < r.max;
        })
      );
    }
    if (selectedSizes.length) {
      list = list.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
    }
    if (selectedColors.length) {
      list = list.filter(p =>
        p.colors.some(c => selectedColors.includes(c.toLowerCase()))
      );
    }
    switch (sort) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'name-asc':   list.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }
    return list;
  }, [selectedBrands, selectedCategories, selectedPrices, selectedSizes, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilterCount =
    selectedBrands.length + selectedCategories.length +
    selectedPrices.length + selectedSizes.length + selectedColors.length;

  const clearAll = () => {
    setSelectedBrands([]); setSelectedCategories([]);
    setSelectedPrices([]); setSelectedSizes([]);
    setSelectedColors([]);
    setPage(1);
  };

  const handleFilterChange = (fn) => { fn(); setPage(1); };

  /* ── Sidebar ── */
  const Sidebar = () => (
    <aside className={`products-sidebar ${mobileSidebarOpen ? 'products-sidebar--open' : ''}`}>
      <div className="products-sidebar__inner">
        <div className="products-sidebar__head">
          <span className="products-sidebar__title">
            <SlidersHorizontal size={15} /> BỘ LỌC
          </span>
          {activeFilterCount > 0 && (
            <button className="products-sidebar__clear" onClick={clearAll}>
              Xóa tất cả ({activeFilterCount})
            </button>
          )}
          <button className="products-sidebar__close" onClick={() => setMobileSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Active tags */}
        {activeFilterCount > 0 && (
          <div className="filter-tags">
            {[...selectedBrands, ...selectedCategories, ...selectedPrices, ...selectedSizes].map(tag => (
              <span key={tag} className="filter-tag">
                {tag}
                <button onClick={() => {
                  if (selectedBrands.includes(tag))     handleFilterChange(() => setSelectedBrands(selectedBrands.filter(v => v !== tag)));
                  else if (selectedCategories.includes(tag)) handleFilterChange(() => setSelectedCategories(selectedCategories.filter(v => v !== tag)));
                  else if (selectedPrices.includes(tag))     handleFilterChange(() => setSelectedPrices(selectedPrices.filter(v => v !== tag)));
                  else handleFilterChange(() => setSelectedSizes(selectedSizes.filter(v => v !== tag)));
                }}>
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}

        <FilterGroup title="DANH MỤC">
          {CATEGORIES.map(cat => (
            <label key={cat} className="filter-checkbox">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => handleFilterChange(() => toggle(selectedCategories, setSelectedCategories, cat))}
              />
              <span>{cat}</span>
            </label>
          ))}
        </FilterGroup>

        <FilterGroup title="THƯƠNG HIỆU">
          {BRANDS.map(b => (
            <label key={b} className="filter-checkbox">
              <input
                type="checkbox"
                checked={selectedBrands.includes(b)}
                onChange={() => handleFilterChange(() => toggle(selectedBrands, setSelectedBrands, b))}
              />
              <span>{b}</span>
            </label>
          ))}
        </FilterGroup>

        <FilterGroup title="GIÁ">
          {PRICE_RANGES.map(r => (
            <label key={r.label} className="filter-checkbox">
              <input
                type="checkbox"
                checked={selectedPrices.includes(r.label)}
                onChange={() => handleFilterChange(() => toggle(selectedPrices, setSelectedPrices, r.label))}
              />
              <span>{r.label}</span>
            </label>
          ))}
        </FilterGroup>

        <FilterGroup title="SIZE" defaultOpen={false}>
          <div className="filter-sizes">
            {ALL_SIZES.map(s => (
              <button
                key={s}
                className={`filter-size-btn ${selectedSizes.includes(s) ? 'filter-size-btn--active' : ''}`}
                onClick={() => handleFilterChange(() => toggle(selectedSizes, setSelectedSizes, s))}
              >
                {s}
              </button>
            ))}
          </div>
        </FilterGroup>
      </div>
    </aside>
  );

  return (
    <div className="products-page">
      <Navbar />

      <main className="products-main">
        {/* Breadcrumb */}
        <div className="products-breadcrumb">
          <div className="products-container">
            <a href="/">Trang chủ</a>
            <ChevronRight size={13} />
            <span>Giày bóng đá</span>
          </div>
        </div>

        <div className="products-container products-layout">
          {/* Sidebar overlay (mobile) */}
          {mobileSidebarOpen && (
            <div className="products-sidebar__overlay" onClick={() => setMobileSidebarOpen(false)} />
          )}

          <Sidebar />

          {/* Main content */}
          <div className="products-content">
            {/* Toolbar */}
            <div className="products-toolbar">
              <div className="products-toolbar__left">
                <h1 className="products-toolbar__title">GIÀY BÓNG ĐÁ</h1>
                <span className="products-toolbar__count">{filtered.length} sản phẩm</span>
              </div>
              <div className="products-toolbar__right">
                <button
                  className="products-toolbar__filter-btn"
                  onClick={() => setMobileSidebarOpen(true)}
                >
                  <SlidersHorizontal size={15} />
                  Bộ lọc {activeFilterCount > 0 && `(${activeFilterCount})`}
                </button>
                <select
                  className="products-toolbar__sort"
                  value={sort}
                  onChange={e => { setSort(e.target.value); setPage(1); }}
                  aria-label="Sắp xếp"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>

              </div>
            </div>

            {/* Grid / List */}
            {paginated.length === 0 ? (
              <div className="products-empty">
                <p>😕 Không tìm thấy sản phẩm phù hợp</p>
                <button onClick={clearAll}>Xóa bộ lọc</button>
              </div>
            ) : (
              <div className="products-grid">
                {paginated.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="products-pagination">
                <button
                  className="products-pagination__btn"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  aria-label="Trang trước"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    className={`products-pagination__btn ${n === page ? 'products-pagination__btn--active' : ''}`}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}
                <button
                  className="products-pagination__btn"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  aria-label="Trang sau"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
