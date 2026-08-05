import { useState, useEffect } from 'react';
import { Search, Heart, ShoppingCart, Menu, X, ChevronDown, Truck, Star, Package, UserPlus, LogIn, User } from 'lucide-react';
import './Navbar.css';
import { useCart } from '../../context/CartContext';
import wishlistApi from '../../api/wishlistApi';

const navLinks = [
  { label: 'TRANG CHỦ',        href: '/' },
  {label: 'SẢN PHẨM',href: '/san-pham' },
  { label: 'THƯƠNG HIỆU',      href: '/thuong-hieu',   hasDropdown: true, key: 'brand' },
  { label: 'GIÀY ĐÁ BÓNG',    href: '/giay-the-thao', hasDropdown: true, key: 'shoes' },
  { label: 'QUẦN ÁO',          href: '/quan-ao',        hasDropdown: true, key: 'clothes' },
  { label: 'PHỤ KIỆN',         href: '/phu-kien',       hasDropdown: true, key: 'accessories' },
  { label: 'SALE',              href: '/sale' },
  { label: 'TIN TỨC & ƯU ĐÃI', href: '/tin-tuc' },
];

const DROPDOWNS = {
  brand: {
    title: 'Thương Hiệu',
    cols: [
      {
        heading: 'Thương Hiệu Nổi Bật',
        items: [
          { label: 'Nike',         href: '/thuong-hieu/nike',         logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
          { label: 'Adidas',       href: '/thuong-hieu/adidas',       logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
          { label: 'Puma',         href: '/thuong-hieu/puma',         logo: 'https://e7.pngegg.com/pngimages/865/75/png-clipart-puma-sneakers-logo-blue-adidas-blue-cat-like-mammal-thumbnail.png' },
          { label: 'Under Armour', href: '/thuong-hieu/under-armour', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Under_armour_logo.svg' },
          { label: 'New Balance',  href: '/thuong-hieu/new-balance',  logo: 'https://authentic-shoes.com/wp-content/uploads/2023/05/new-balance-logo_445e7ebbd48345278dadd7c0853fbd82_2048x2048.jpg' },
        ],
      },
      {
        heading: 'Thương Hiệu Khác',
        items: [
          { label: 'Asics',   href: '/thuong-hieu/asics',  logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Asics_Logo.svg' },
          { label: 'Reebok',  href: '/thuong-hieu/reebok',  logo: 'https://www.monks.com/data/2023-04/logo-Reebok.png?VersionId=6K8C5HMTeEij3thcsvOY6.zPpN4HG_wF' },
          { label: 'Mizuno',  href: '/thuong-hieu/mizuno',  logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs8Y_PIuTjuw1pjNU4XGL8lGMMx5jNYIWkfg&s' },
          { label: 'Umbro',   href: '/thuong-hieu/umbro' },
          { label: 'Joma',    href: '/thuong-hieu/joma' },
        ],
      },
    ],
  },
  shoes: {
    title: 'Giày Đá Bóng',
    cols: [
      {
        heading: 'FG',
        image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR1Qvo0hVSZ1GLKN-AgXnmvqmHi2tIxyEUpZU2tP4kKIM0ya7str5jiG81sJ9oZ5iTXLTTI8OHUx6-gxXNn53WeF8ZxhsfG9-WLqB7Ez-E&usqp=CAc',
        href: '/giay-the-thao/fg',
        items: [],
      },
      {
        heading: 'AG',
        image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQKcANnmJ0ZYfVIm8G79Ej-ZcovfK6_DvLxu7GZuRhC5CUuBzLn3Mtf7KAZNyPyhBXrZFBtU7COsZsYzWqjrasIRzoh00TnyHtfeQrk9WSVdilJYfbJpzI6&usqp=CAc',
        href: '/giay-the-thao/ag',
        items: [],
      },
      {
        heading: 'TF',
        image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRv_UHlQXzsCDPFPkRY5x4nkZpgHL0Vsdd8j4T2yCo9NcGtUMkBLsw-JBTyQE3xr5vUNSg2O6vOAz1JeWbMC-JMWiHxYWbgmBHSMwN-MwT55Fh2IvF-kkFIeevNrio0UQSNKk-pxqUoDA&usqp=CAc',
        href: '/giay-the-thao/tf',
        items: [],
      },
      {
        heading: 'SG',
        image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRiMxjgIOkGzvZxSTZWjk3rNVyPIN-JgxjgKqDmf_HBS0A6t0KH7NkQyZlGZrEnsvGMqD8VshyirFL4LC18msQGGesnlov2Epzep9AyfklWL-6R33SHpaacG5VCaauFKc7_7SZnYg&usqp=CAc',
        href: '/giay-the-thao/sg',
        items: [],
      },
      {
        heading: 'IC',
        image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR1Qvo0hVSZ1GLKN-AgXnmvqmHi2tIxyEUpZU2tP4kKIM0ya7str5jiG81sJ9oZ5iTXLTTI8OHUx6-gxXNn53WeF8ZxhsfG9-WLqB7Ez-E&usqp=CAc',
        href: '/giay-the-thao/ic',
        items: [],
      },
      {
        heading: 'Futsal',
        image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQKcANnmJ0ZYfVIm8G79Ej-ZcovfK6_DvLxu7GZuRhC5CUuBzLn3Mtf7KAZNyPyhBXrZFBtU7COsZsYzWqjrasIRzoh00TnyHtfeQrk9WSVdilJYfbJpzI6&usqp=CAc',
        href: '/giay-the-thao/futsal',
        items: [],
      },
    ],
  },
  clothes: {
    title: 'Quần Áo',
    cols: [
      {
        heading: 'Áo CLB',
        image: 'https://www.sporter.vn/wp-content/uploads/2017/06/Ao-bong-da-manchester-united-san-nha-2526-1.png',
        items: [
          { label: 'Barcelona',         href: '/quan-ao/barcelona',  logo: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg' },
          { label: 'Real Madrid',       href: '/quan-ao/real-madrid', logo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg' },
          { label: 'Manchester United', href: '/quan-ao/man-utd',     logo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg' },
          { label: 'Liverpool',         href: '/quan-ao/liverpool',   logo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg' },
          { label: 'Chelsea',           href: '/quan-ao/chelsea',     logo: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg' },
          { label: 'PSG',               href: '/quan-ao/psg',         logo: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg' },
        ],
      },
      {
        heading: 'Áo Đội Tuyển',
        image: 'https://www.sporter.vn/wp-content/uploads/2022/10/Ao-doi-tuyen-anh-san-nha-1.jpg',
        items: [
          { label: 'Việt Nam',  href: '/quan-ao/viet-nam',  logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg' },
          { label: 'Brazil',    href: '/quan-ao/brazil',    logo: 'https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg' },
          { label: 'Argentina', href: '/quan-ao/argentina', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Argentina.svg' },
          { label: 'Pháp',      href: '/quan-ao/phap',      logo: 'https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg' },
          { label: 'Đức',       href: '/quan-ao/duc',       logo: 'https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg' },
          { label: 'Anh',       href: '/quan-ao/anh',       logo: 'https://upload.wikimedia.org/wikipedia/en/b/be/Flag_of_England.svg' },
        ],
      },
      {
        heading: 'Áo Không Logo',
        image: 'https://www.sporter.vn/wp-content/uploads/2022/08/Ao-bong-da-khong-logo-apollo-trang-0.jpg',
        items: [],
      },
    ],
  },
  accessories: {
    title: 'Phụ Kiện',
    cols: [
      {
        heading: 'Bóng Đá',
        image: 'https://down-vn.img.susercontent.com/file/3f6ce333026cde1c0ea1c030a81ff586',
        href: '/phu-kien/bong-da',
        items: [],
      },
      {
        heading: 'Găng Tay Thủ Môn',
        image: 'https://pos.nvncdn.com/b0b717-26181/pc/cateCT/20180323_fKpd3WCZYnucIPyPC1Frlsis.jpg',
        href: '/phu-kien/gang-tay',
        items: [],
      },
      {
        heading: 'Bảo Vệ Ống Đồng',
        image: 'https://media.soccerstore.vn/soccerstore/2025/05/Fffff-1024x1024.png',
        href: '/phu-kien/bao-ve-ong-dong',
        items: [],
      },
      {
        heading: 'Túi Đựng Giày',
        image: 'https://yousport.vn/Media/Products/060417095601933/tui-dung-giay-mu.jpg',
        href: '/phu-kien/tui-dung-giay',
        items: [],
      },
      {
        heading: 'Tất Đá Bóng',
        image: 'https://cdn.gumic.vn/storage/gumicvn/39669/goyuf4u7.jpg',
        href: '/phu-kien/tat-da-bong',
        items: [],
      },
    ],
  },
};

const topBarItems = [
  { icon: <Truck size={14} />, text: 'GIAO HÀNG NHANH TOÀN QUỐC' },
  { icon: <Star size={14} />,  text: 'ƯU ĐÃI SỐC GIẢM ĐẾN 50%' },
];

export default function Navbar() {
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    const updateWishlistCount = () => {
      const token = localStorage.getItem('token');
      if (token) {
        wishlistApi.getWishlistIds()
          .then(res => {
            if (Array.isArray(res.data)) {
              setWishlistCount(res.data.length);
              localStorage.setItem('wishlist_ids', JSON.stringify(res.data));
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
  const user = currentUser;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/dang-nhap';
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
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <span className="navbar__top-auth-link" style={{ textTransform: 'uppercase', cursor: 'default' }}>
                  Xin chào, {user.fullName || 'Tài khoản'}
                </span>
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

          <form className="navbar__search"
            onSubmit={e => {
              e.preventDefault();
              const q = e.target.querySelector('input').value.trim();
              if (q) window.location.href = `/tim-kiem?q=${encodeURIComponent(q)}`;
            }}>
            <input type="text" placeholder="Tìm kiếm sản phẩm..."
              className="navbar__search-input" aria-label="Tìm kiếm" />
            <button type="submit" className="navbar__search-btn" aria-label="Tìm kiếm">
              <Search size={17} />
            </button>
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
              {link.key && DROPDOWNS[link.key] && activeDropdown === link.key && (
                <div className={`navbar__dropdown ${(link.key === 'shoes' || link.key === 'accessories') ? 'navbar__dropdown--grid-rows' : ''}`}>
                  <div className="navbar__dropdown-inner">
                    {DROPDOWNS[link.key].cols.map((col, ci) => (
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
                        <ul className="navbar__dropdown-list">
                          {col.items.map((item, ii) => (
                            <li key={ii}>
                              <a href={item.href} className={`navbar__dropdown-link ${item.logo && !item.icon ? 'navbar__dropdown-link--logo-only' : ''}`}>
                                {item.logo && !item.icon ? (
                                  <img
                                    src={item.logo}
                                    alt={item.label}
                                    className="navbar__dropdown-item-logo"
                                    title={item.label}
                                    onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='inline'; }}
                                  />
                                ) : item.logo ? (
                                  <img
                                    src={item.logo}
                                    alt={item.label}
                                    className="navbar__dropdown-brand-logo"
                                    onError={e => { e.target.style.display='none'; }}
                                  />
                                ) : item.icon ? (
                                  <span className="navbar__dropdown-icon">{item.icon}</span>
                                ) : null}
                                {(!item.logo || item.icon) && item.label}
                                {item.logo && !item.icon && <span style={{display:'none'}}>{item.label}</span>}
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
    </header>
  );
}
