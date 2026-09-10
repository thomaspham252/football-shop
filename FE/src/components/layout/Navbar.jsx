import { useState, useEffect } from 'react';
import { Search, Heart, ShoppingCart, Menu, X, ChevronDown, Truck, Star, UserPlus, LogIn, User, ShieldCheck } from 'lucide-react';
import './Navbar.css';
import { useCart } from '../../context/CartContext';
import homeApi from '../../api/homeApi';
import wishlistApi from '../../api/wishlistApi';

const navLinks = [
  { label: 'TRANG CHỦ',        href: '/' },
  { label: 'SẢN PHẨM',       href: '/san-pham' },
  { label: 'THƯƠNG HIỆU',      href: '/san-pham',   hasDropdown: true, key: 'brand' },
  { label: 'GIÀY ĐÁ BÓNG',    href: '/san-pham?category=S%C3%A2n%20t%E1%BB%B1%20nhi%C3%AAn%20(FG)', hasDropdown: true, key: 'shoes' },
  { label: 'QUẦN ÁO',          href: '/san-pham',        hasDropdown: true, key: 'clothes' },
  { label: 'PHỤ KIỆN',         href: '/san-pham',       hasDropdown: true, key: 'accessories' },
  { label: 'SALE',              href: '/san-pham?type=promotion' },
  { label: 'TIN TỨC & ƯU ĐÃI', href: '/tin-tuc' },
];

const topBarItems = [
  { icon: <Truck size={14} />, text: 'GIAO HÀNG NHANH TOÀN QUỐC' },
  { icon: <Star size={14} />,  text: 'ƯU ĐÃI SỐC GIẢM ĐẾN 50%' },
];

export default function Navbar() {
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dbBrands, setDbBrands] = useState([]);
  const [dbCategoryMap, setDbCategoryMap] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity ?? item.qty ?? 0), 0);

  useEffect(() => {
    homeApi.getAllProducts()
      .then(res => {
        if (Array.isArray(res.data)) {
          setAllProducts(res.data);
          const brandMap = new Map();
          const catMap = {};
          res.data.forEach(p => {
            const bName = p.brandName || p.brand?.brandName;
            const bLogo = p.brandLogoUrl || p.brand?.logoUrl;
            if (bName && !brandMap.has(bName)) {
              brandMap.set(bName, bLogo || null);
            }

            const cName = p.categoryName || p.category?.categoryName;
            const cImg = p.categoryImageUrl || p.category?.imageUrl;
            if (cName && !catMap[cName]) {
              catMap[cName] = cImg || null;
            }
          });

          setDbCategoryMap(catMap);

          const list = Array.from(brandMap.entries()).map(([name, logo]) => ({
            label: name,
            href: `/san-pham?brand=${encodeURIComponent(name)}`,
            logo: logo || null
          }));
          setDbBrands(list);
        }
      })
      .catch(err => console.error("Lỗi khi nạp thương hiệu DB:", err));
  }, []);

  const shoeCats = Object.keys(dbCategoryMap).filter(cat => 
    cat.includes('Sân') || cat.includes('Giày') || cat.includes('FG') || cat.includes('AG') || cat.includes('TF') || cat.includes('MG') || cat.includes('IC')
  );
  const shoesCols = shoeCats.map(cat => ({
    heading: cat,
    image: dbCategoryMap[cat] || null,
    href: `/san-pham?category=${encodeURIComponent(cat)}`,
    items: []
  }));

  const clothesCats = Object.keys(dbCategoryMap).filter(cat =>
    cat.includes('Áo') || cat.includes('Quần')
  );
  const clothesCols = clothesCats.map(cat => ({
    heading: cat,
    image: dbCategoryMap[cat] || null,
    href: `/san-pham?category=${encodeURIComponent(cat)}`,
    items: []
  }));

  const accessoryCats = Object.keys(dbCategoryMap).filter(cat =>
    cat.includes('Băng') || cat.includes('Tất') || cat.includes('Găng') || cat.includes('Bóng') || cat.includes('Quả') || cat.includes('Phụ kiện')
  );
  const accessoriesCols = accessoryCats.map(cat => ({
    heading: cat,
    image: dbCategoryMap[cat] || null,
    href: `/san-pham?category=${encodeURIComponent(cat)}`,
    items: []
  }));

  const allDropdowns = {
    brand: {
      title: 'Thương Hiệu',
      cols: [
        {
          heading: 'Thương Hiệu Nổi Bật',
          items: dbBrands
        }
      ]
    },
    shoes: {
      title: 'Giày Đá Bóng',
      cols: shoesCols
    },
    clothes: {
      title: 'Quần Áo',
      cols: clothesCols
    },
    accessories: {
      title: 'Phụ Kiện',
      cols: accessoriesCols
    }
  };

  const searchResults = searchQuery.trim() === '' ? [] : allProducts.filter(p => 
    (p.productName || '').toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 3);

  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const updateWishlistCount = () => {
      const token = localStorage.getItem('token');
      if (token) {
        wishlistApi.getWishlistIds()
          .then(res => {
            if (Array.isArray(res.data)) {
              setWishlistCount(res.data.length);
              localStorage.setItem('wishlist_ids', JSON.stringify(res.data));
              window.dispatchEvent(new Event('wishlist-ids-updated'));
            }
          })
          .catch(() => {
            const stored = localStorage.getItem('wishlist');
            const list = stored ? JSON.parse(stored) : [];
            setWishlistCount(list.length);
          });
      } else {
        const stored = localStorage.getItem('wishlist');
        const list = stored ? JSON.parse(stored) : [];
        setWishlistCount(list.length);
      }
    };
    updateWishlistCount();
    window.addEventListener('wishlist-updated', updateWishlistCount);

    const updateUserInfo = () => {
      const uJson = localStorage.getItem('user');
      if (uJson) {
        try {
          setCurrentUser(JSON.parse(uJson));
        } catch {
          setCurrentUser({});
        }
      } else {
        setCurrentUser({});
      }
    };
    updateUserInfo();
    window.addEventListener('user-updated', updateUserInfo);

    return () => {
      window.removeEventListener('wishlist-updated', updateWishlistCount);
      window.removeEventListener('user-updated', updateUserInfo);
    };
  }, []);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const userJson = localStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : {};
    } catch {
      return {};
    }
  });

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  const userRole = String(currentUser?.role || '').toUpperCase();
  const isAdminOrStaff = userRole.includes('ADMIN') || userRole.includes('STAFF');

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <header className="navbar" onMouseLeave={() => setActiveDropdown(null)}>
      {/* Top bar */}
      <div className="navbar__top">
        <div className="navbar__top-container">
          <div className="navbar__top-info">
            {topBarItems.map((item, i) => (
              <span key={i} className="navbar__top-item">
                {item.icon}
                <span>{item.text}</span>
              </span>
            ))}
          </div>
          <div className="navbar__top-divider" />
          <div className="navbar__top-auth">
            {isLoggedIn ? (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span className="navbar__top-auth-link" style={{ textTransform: 'uppercase', cursor: 'default' }}>
                  Xin chào, {currentUser.fullName || 'Tài khoản'}
                </span>
                {isAdminOrStaff && (
                  <a href="/admin" className="navbar__top-auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#f59e0b', fontWeight: 700, textDecoration: 'none', backgroundColor: 'rgba(245, 158, 11, 0.15)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                    <ShieldCheck size={14} /> QUẢN TRỊ
                  </a>
                )}
                <button onClick={handleLogout} className="navbar__top-auth-link" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit', fontWeight: 'inherit', padding: 0 }}>
                  <LogIn size={13} style={{ transform: 'rotate(180deg)' }} /> ĐĂNG XUẤT
                </button>
              </div>
            ) : (
              <>
                <a href="/dang-ky" className="navbar__top-auth-link">
                  <UserPlus size={13} /> ĐĂNG KÝ
                </a>
                <a href="/dang-nhap" className="navbar__top-auth-link">
                  <LogIn size={13} /> ĐĂNG NHẬP
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="navbar__main">
        <div className="navbar__container">
          <button className="navbar__mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <a href="/" className="navbar__logo">
            <span className="navbar__logo-ultra">ULTRA</span>
            <span className="navbar__logo-sport">SPORT</span>
          </a>

          <form className="navbar__search" style={{ position: 'relative' }}
            onSubmit={e => {
              e.preventDefault();
              if (searchQuery.trim()) {
                window.location.href = `/san-pham?search=${encodeURIComponent(searchQuery.trim())}`;
              }
            }}>
            <input type="text" placeholder="Tìm kiếm sản phẩm..."
              className="navbar__search-input" aria-label="Tìm kiếm"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            <button type="submit" className="navbar__search-btn" aria-label="Tìm kiếm">
              <Search size={17} />
            </button>

            {/* Hiển thị 3 kết quả tìm kiếm gợi ý */}
            {showSuggestions && searchResults.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                backgroundColor: 'white', borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 100,
                marginTop: '4px', overflow: 'hidden'
              }}>
                {searchResults.map(p => (
                  <a key={p.productId} href={`/san-pham/${p.slug}`} style={{
                    display: 'flex', alignItems: 'center', padding: '10px',
                    textDecoration: 'none', color: 'inherit', borderBottom: '1px solid #f3f4f6',
                    cursor: 'pointer'
                  }} onMouseDown={(e) => e.preventDefault()}
                  >
                    <img src={p.imageUrl} alt={p.productName} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', marginRight: '10px' }} />
                    <div style={{ flex: 1, overflow: 'hidden', textAlign: 'left' }}>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.productName}</p>
                      <p style={{ margin: 0, fontSize: '13px', color: '#e11d48', fontWeight: 700 }}>{p.priceSell?.toLocaleString()}đ</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </form>

          <div className="navbar__actions">
            {isLoggedIn && (
              <a href="/tai-khoan" className="navbar__action-btn" aria-label="Tài khoản" title="Tài khoản của tôi">
                <User size={22} />
              </a>
            )}
            <a href="/tai-khoan" className="navbar__action-btn" aria-label="Yêu thích">
              <Heart size={22} />
              <span className="navbar__action-badge">{wishlistCount}</span>
            </a>
            <a href="/gio-hang" className="navbar__action-btn" aria-label="Giỏ hàng">
              <ShoppingCart size={22} />
              <span className="navbar__action-badge navbar__action-badge--cart">{cartCount}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className={`navbar__nav ${mobileOpen ? 'navbar__nav--open' : ''}`}>
        <ul className="navbar__nav-list">
          {navLinks.map((link) => (
            <li key={link.label} className="navbar__nav-item"
              onMouseEnter={() => setActiveDropdown(link.key || null)}>
              <a href={link.href} className="navbar__nav-link">
                {link.label}
                {link.hasDropdown && <ChevronDown size={12} />}
              </a>

              {/* Mega dropdown */}
              {link.key && allDropdowns[link.key] && activeDropdown === link.key && (
                <div className={`navbar__dropdown ${(link.key === 'shoes' || link.key === 'accessories') ? 'navbar__dropdown--grid-rows' : ''}`}>
                  <div className="navbar__dropdown-inner">
                    {allDropdowns[link.key].cols.map((col, ci) => (
                      <div key={ci} className="navbar__dropdown-col">
                        {col.href ? (
                          <a href={col.href} className="navbar__dropdown-heading navbar__dropdown-heading--link">
                            {col.heading}
                          </a>
                        ) : (
                          <p className="navbar__dropdown-heading">{col.heading}</p>
                        )}
                        {col.image && (
                          col.href ? (
                            <a href={col.href}>
                              <img src={col.image} alt={col.heading} className="navbar__dropdown-col-img" />
                            </a>
                          ) : (
                            <img src={col.image} alt={col.heading} className="navbar__dropdown-col-img" />
                          )
                        )}
                        <ul className={`navbar__dropdown-list ${link.key === 'brand' ? 'navbar__dropdown-list--4col' : ''}`}>
                          {col.items.map((item, ii) => (
                            <li key={ii}>
                              <a href={item.href} className={`navbar__dropdown-link ${link.key === 'brand' ? 'navbar__dropdown-link--brand' : ''}`}>
                                {item.logo ? (
                                  <img
                                    src={item.logo}
                                    alt={item.label}
                                    className="navbar__dropdown-item-logo"
                                    title={item.label}
                                    onError={e => { e.target.style.display='none'; if (e.target.nextSibling) e.target.nextSibling.style.display='inline'; }}
                                  />
                                ) : null}
                                <span className="navbar__dropdown-brand-name" style={{ display: item.logo ? 'none' : 'inline' }}>
                                  {item.label}
                                </span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
      {/* Logout Modal */}
      {showLogoutModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'white', padding: '24px', borderRadius: '8px',
            width: '320px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#111827' }}>Xác nhận đăng xuất</h3>
            <p style={{ margin: '0 0 24px 0', color: '#4b5563', fontSize: '14px' }}>Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowLogoutModal(false)}
                style={{ flex: 1, padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '4px', background: 'white', cursor: 'pointer', fontWeight: 500 }}
              >
                Hủy
              </button>
              <button 
                onClick={confirmLogout}
                style={{ flex: 1, padding: '8px 16px', border: 'none', borderRadius: '4px', background: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: 500 }}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
