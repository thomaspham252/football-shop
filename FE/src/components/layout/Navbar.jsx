import { useState } from 'react';
import { Search, Heart, ShoppingCart, Menu, X, ChevronDown, Truck, Star, Package, UserPlus, LogIn } from 'lucide-react';
import './Navbar.css';

const navLinks = [
  { label: 'TRANG CHỦ', href: '/' },
  { label: 'THƯƠNG HIỆU', href: '/thuong-hieu', hasDropdown: true },
  { label: 'GIÀY THỂ THAO', href: '/giay-the-thao', hasDropdown: true },
  { label: 'QUẦN ÁO', href: '/quan-ao', hasDropdown: true },
  { label: 'PHỤ KIỆN', href: '/phu-kien', hasDropdown: true },
  { label: 'MŨ', href: '/mu' },
  { label: 'TÚI', href: '/tui' },
  { label: 'SALE', href: '/sale' },
  { label: 'TIN TỨC & ƯU ĐÃI', href: '/tin-tuc' },
];

const topBarItems = [
  { icon: <Truck size={14} />, text: 'GIAO HÀNG NHANH TOÀN QUỐC' },
  { icon: <Star size={14} />, text: 'ƯU ĐÃI SỐC GIẢM ĐẾN 50%' },
  { icon: <Package size={14} />, text: 'THEO DÕI ĐƠN HÀNG' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wishlistCount] = useState(12);
  const [cartCount] = useState(2);

  return (
    <header className="navbar">
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
            <a href="/dang-ky" className="navbar__top-auth-link">
              <UserPlus size={13} />
              ĐĂNG KÝ
            </a>
            <a href="/dang-nhap" className="navbar__top-auth-link">
              <LogIn size={13} />
              ĐĂNG NHẬP
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="navbar__main">
        <div className="navbar__container">
          {/* Hamburger */}
          <button
            className="navbar__mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <a href="/" className="navbar__logo">
            <span className="navbar__logo-ultra">ULTRA</span><span className="navbar__logo-sport">SPORT</span>
          </a>

          {/* Search */}
          <div className="navbar__search">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="navbar__search-input"
              aria-label="Tìm kiếm"
            />
            <button className="navbar__search-btn" aria-label="Tìm kiếm">
              <Search size={17} />
            </button>
          </div>

          {/* Actions */}
          <div className="navbar__actions">
            <button className="navbar__action-btn" aria-label="Yêu thích">
              <Heart size={22} />
              <span className="navbar__action-badge">{wishlistCount}</span>
            </button>
            <button className="navbar__action-btn" aria-label="Giỏ hàng">
              <ShoppingCart size={22} />
              <span className="navbar__action-badge navbar__action-badge--cart">{cartCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className={`navbar__nav ${mobileOpen ? 'navbar__nav--open' : ''}`}>
        <ul className="navbar__nav-list">
          {navLinks.map((link) => (
            <li key={link.label} className="navbar__nav-item">
              <a href={link.href} className="navbar__nav-link">
                {link.label}
                {link.hasDropdown && <ChevronDown size={12} />}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
