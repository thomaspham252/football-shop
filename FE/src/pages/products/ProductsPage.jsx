import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProductCard from '../../components/common/ProductCard';
import homeApi from '../../api/homeApi';
import {
  ChevronRight, ChevronDown, ChevronUp,
  SlidersHorizontal, X
} from 'lucide-react';
import './ProductsPage.css';

const PARENT_CATEGORIES = [
  'Giày bóng đá',
  'Phụ kiện',
  'Quần áo bóng đá',
  'SHOES',
  'ACCESSORIES',
  'CLOTHING'
];

const PRICE_RANGES = [
  { label: 'Dưới 1.000.000đ',   min: 0,       max: 1000000 },
  { label: '1.000.000 - 3.000.000đ', min: 1000000, max: 3000000 },
  { label: '3.000.000 - 5.000.000đ', min: 3000000, max: 5000000 },
  { label: 'Trên 5.000.000đ',   min: 5000000, max: Infinity },
];

const SORT_OPTIONS = [
  { value: 'default',    label: 'Mặc định' },
  { value: 'price-asc',  label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
  { value: 'name-asc',   label: 'Tên A → Z' },
  { value: 'newest',     label: 'Mới nhất' },
];

const PAGE_SIZE = 8;

const styles = {
  loadingState: { textAlign: 'center', padding: '40px 0', fontSize: '18px', color: '#666' }
};

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
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type') || '';
  const brandParam = searchParams.get('brand') || '';
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBrand,     setSelectedBrand]     = useState(brandParam);
  const [selectedCategory,  setSelectedCategory]  = useState(categoryParam);
  const [selectedPrice,     setSelectedPrice]     = useState('');
  const [selectedSizes,     setSelectedSizes]     = useState([]);
  const [selectedColors,    setSelectedColors]    = useState([]);
  const [sort,              setSort]              = useState('default');
  const [page,              setPage]              = useState(1);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let res;
        if (typeParam === 'new') {
          res = await homeApi.getNewProducts(100, 'asc');
        } else if (typeParam === 'promotion') {
          res = await homeApi.getPromotionProducts(100);
        } else if (typeParam === 'best-selling') {
          res = await homeApi.getBestSellingProducts(100);
        } else {
          res = await homeApi.getAllProducts();
        }
        setProducts(res.data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [typeParam]);



  const categoriesList = useMemo(() => {
    const activeCategories = new Set();
    products.forEach(p => {
      const cat = p.categoryName || p.category?.categoryName;
      if (cat && !PARENT_CATEGORIES.includes(cat)) {
        activeCategories.add(cat);
      }
    });
    return Array.from(activeCategories);
  }, [products]);

  const brandsList = useMemo(() => {
    const set = new Set();
    products.forEach(p => {
      const b = p.brandName || p.brand?.brandName;
      if (b) set.add(b);
    });
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (searchParam) {
      list = list.filter(p => (p.productName || p.name || '').toLowerCase().includes(searchParam.toLowerCase()));
    }
    if (selectedBrand) {
      list = list.filter(p => (p.brandName || p.brand?.brandName || p.brand) === selectedBrand);
    }
    if (selectedCategory) {
      list = list.filter(p => (p.categoryName || p.category?.categoryName || p.category) === selectedCategory);
    }
    if (selectedPrice) {
      const r = PRICE_RANGES.find(pr => pr.label === selectedPrice);
      if (r) {
        list = list.filter(p => {
          const price = p.salePrice ?? p.basePrice ?? p.price ?? 0;
          return price >= r.min && price < r.max;
        });
      }
    }
    if (selectedSizes.length) {
      list = list.filter(p => (p.sizes || ['39', '40', '41', '42']).some(s => selectedSizes.includes(s)));
    }
    if (selectedColors.length) {
      list = list.filter(p =>
        (p.colors || []).some(c => selectedColors.includes(c.toLowerCase()))
      );
    }
    switch (sort) {
      case 'price-asc':  list.sort((a, b) => (a.salePrice ?? a.basePrice ?? a.price ?? 0) - (b.salePrice ?? b.basePrice ?? b.price ?? 0)); break;
      case 'price-desc': list.sort((a, b) => (b.salePrice ?? b.basePrice ?? b.price ?? 0) - (a.salePrice ?? a.basePrice ?? a.price ?? 0)); break;
      case 'name-asc':   list.sort((a, b) => (a.productName ?? a.name).localeCompare(b.productName ?? b.name)); break;
      default: break;
    }
    return list;
  }, [products, searchParam, selectedBrand, selectedCategory, selectedPrice, selectedSizes, selectedColors, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilterCount =
    (selectedBrand ? 1 : 0) + (selectedCategory ? 1 : 0) +
    (selectedPrice ? 1 : 0) + selectedSizes.length + selectedColors.length;

  const clearAll = () => {
    setSelectedBrand('');
    setSelectedCategory('');
    setSelectedPrice('');
    setSelectedSizes([]);
    setSelectedColors([]);
    setPage(1);
  };

  const handleFilterChange = (fn) => { fn(); setPage(1); };



  return (
    <div className="products-page">
      <Navbar />

      <main className="products-main">
        <div className="products-breadcrumb">
          <div className="products-container">
            <a href="/">Trang chủ</a>
            <ChevronRight size={13} />
            <span>Giày bóng đá</span>
          </div>
        </div>

        <div className="products-container products-layout">
          {mobileSidebarOpen && (
            <div className="products-sidebar__overlay" onClick={() => setMobileSidebarOpen(false)} />
          )}

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

              {activeFilterCount > 0 && (
                <div className="filter-tags">
                  {[
                    ...(selectedBrand ? [selectedBrand] : []),
                    ...(selectedCategory ? [selectedCategory] : []),
                    ...(selectedPrice ? [selectedPrice] : []),
                    ...selectedSizes
                  ].map(tag => (
                    <span key={tag} className="filter-tag">
                      {tag}
                      <button onClick={() => {
                        if (tag === selectedBrand) handleFilterChange(() => setSelectedBrand(''));
                        else if (tag === selectedCategory) handleFilterChange(() => setSelectedCategory(''));
                        else if (tag === selectedPrice) handleFilterChange(() => setSelectedPrice(''));
                        else handleFilterChange(() => setSelectedSizes(selectedSizes.filter(v => v !== tag)));
                      }}>
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <FilterGroup title="DANH MỤC">
                <label className="filter-radio">
                  <input
                    type="radio"
                    name="category-range"
                    checked={selectedCategory === ''}
                    onChange={() => handleFilterChange(() => setSelectedCategory(''))}
                  />
                  <span>Tất cả danh mục</span>
                </label>
                {categoriesList.map(cat => (
                  <label key={cat} className="filter-radio">
                    <input
                      type="radio"
                      name="category-range"
                      checked={selectedCategory === cat}
                      onChange={() => handleFilterChange(() => setSelectedCategory(selectedCategory === cat ? '' : cat))}
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </FilterGroup>

              <FilterGroup title="THƯƠNG HIỆU">
                <label className="filter-radio">
                  <input
                    type="radio"
                    name="brand-range"
                    checked={selectedBrand === ''}
                    onChange={() => handleFilterChange(() => setSelectedBrand(''))}
                  />
                  <span>Tất cả thương hiệu</span>
                </label>
                {brandsList.map(b => (
                  <label key={b} className="filter-radio">
                    <input
                      type="radio"
                      name="brand-range"
                      checked={selectedBrand === b}
                      onChange={() => handleFilterChange(() => setSelectedBrand(selectedBrand === b ? '' : b))}
                    />
                    <span>{b}</span>
                  </label>
                ))}
              </FilterGroup>

              <FilterGroup title="GIÁ">
                <label className="filter-radio">
                  <input
                    type="radio"
                    name="price-range"
                    checked={selectedPrice === ''}
                    onChange={() => handleFilterChange(() => setSelectedPrice(''))}
                  />
                  <span>Tất cả mức giá</span>
                </label>
                {PRICE_RANGES.map(r => (
                  <label key={r.label} className="filter-radio">
                    <input
                      type="radio"
                      name="price-range"
                      checked={selectedPrice === r.label}
                      onChange={() => handleFilterChange(() => setSelectedPrice(selectedPrice === r.label ? '' : r.label))}
                    />
                    <span>{r.label}</span>
                  </label>
                ))}
              </FilterGroup>

            </div>
          </aside>

          <div className="products-content">
            <div className="products-toolbar">
              <div className="products-toolbar__left">
                <h1 className="products-toolbar__title">
                  {searchParam ? `KẾT QUẢ TÌM KIẾM: "${searchParam.toUpperCase()}"` : 'GIÀY BÓNG ĐÁ'}
                </h1>
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

            {loading ? (
              <div className="products-loading" style={styles.loadingState}>
                Đang tải sản phẩm...
              </div>
            ) : paginated.length === 0 ? (
              <div className="products-empty">
                <p>😕 Không tìm thấy sản phẩm phù hợp</p>
                <button onClick={clearAll}>Xóa bộ lọc</button>
              </div>
            ) : (
              <div className="products-grid">
                {paginated.map(p => (
                  <ProductCard key={p.productId ?? p.id} product={p} />
                ))}
              </div>
            )}

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
