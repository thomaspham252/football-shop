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

const BRANDS    = ['Nike', 'Adidas', 'Puma'];
const CATEGORIES = ['Giày FG', 'Giày TF', 'Giày MG', 'Áo đấu', 'Quần đấu', 'Phụ kiện'];
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

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBrands,     setSelectedBrands]     = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrices,     setSelectedPrices]     = useState([]);
  const [selectedSizes,      setSelectedSizes]      = useState([]);
  const [selectedColors,     setSelectedColors]     = useState([]);
  const [sort,               setSort]               = useState('default');
  const [page,               setPage]               = useState(1);
  const [mobileSidebarOpen,  setMobileSidebarOpen]  = useState(false);

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

  /* toggle helpers */
  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);

  /* filter + sort */
  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedBrands.length) {
      list = list.filter(p => selectedBrands.includes(p.brandName || p.brand));
    }
    if (selectedCategories.length) {
      list = list.filter(p => selectedCategories.includes(p.categoryName || p.category));
    }
    if (selectedPrices.length) {
      list = list.filter(p => {
        const price = p.salePrice ?? p.price ?? 0;
        return selectedPrices.some(label => {
          const r = PRICE_RANGES.find(pr => pr.label === label);
          return r && price >= r.min && price < r.max;
        });
      });
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
      case 'price-asc':  list.sort((a, b) => (a.salePrice ?? a.price ?? 0) - (b.salePrice ?? b.price ?? 0)); break;
      case 'price-desc': list.sort((a, b) => (b.salePrice ?? b.price ?? 0) - (a.salePrice ?? a.price ?? 0)); break;
      case 'name-asc':   list.sort((a, b) => (a.productName ?? a.name).localeCompare(b.productName ?? b.name)); break;
      default: break;
    }
    return list;
  }, [products, selectedBrands, selectedCategories, selectedPrices, selectedSizes, sort]);

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
            {loading ? (
              <div className="products-loading" style={{ textAlign: 'center', padding: '40px 0', fontSize: '18px', color: '#666' }}>
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
