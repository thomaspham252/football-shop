import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

// Simple SVG social icons (brand icons removed from lucide-react v1+)
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon fill="#fff" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);


export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="footer__container">
          {/* About */}
          <div className="footer__col">
            <div className="footer__logo">
              <span className="footer__logo-icon">⚽</span>
              <span className="footer__logo-text">FOOTBALL SHOP</span>
            </div>
            <p className="footer__about">
              Chuyên cung cấp giày thể thao, quần áo và phụ kiện thể thao chính hãng từ các thương hiệu hàng đầu thế giới.
            </p>
            <div className="footer__contact-list">
              <div className="footer__contact-item">
                <MapPin size={14} />
                <span>47A Đường số 9, Linh Xuân, TP.HCM</span>
              </div>
              <div className="footer__contact-item">
                <Phone size={14} />
                <span>0393373094</span>
              </div>
              <div className="footer__contact-item">
                <Mail size={14} />
                <span>pvlinh25.2@gmail.com</span>
              </div>
              <div className="footer__contact-item">
                <Clock size={14} />
                <span>8:00 - 22:00 (Thứ 2 - CN)</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="footer__col">
            <h4 className="footer__heading">CHÍNH SÁCH</h4>
            <ul className="footer__links">
              <li><Link to="/chinh-sach/van-chuyen">Chính sách vận chuyển</Link></li>
              <li><Link to="/chinh-sach/doi-tra">Chính sách đổi trả</Link></li>
              <li><Link to="/chinh-sach/bao-mat">Chính sách bảo mật</Link></li>
              <li><Link to="/chinh-sach/thanh-toan">Phương thức thanh toán</Link></li>
              <li><Link to="/chinh-sach/bao-hanh">Chính sách bảo hành</Link></li>
              <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer__col">
            <h4 className="footer__heading">HỖ TRỢ KHÁCH HÀNG</h4>
            <ul className="footer__links">
              <li><Link to="/huong-dan-chon-size">Hướng dẫn chọn size</Link></li>
              <li><Link to="/tra-cuu-don-hang">Tra cứu đơn hàng</Link></li>
              <li><Link to="/faq">Câu hỏi thường gặp</Link></li>
              <li><Link to="/lien-he">Liên hệ chúng tôi</Link></li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div className="footer__col">
            <h4 className="footer__heading">KẾT NỐI VỚI CHÚNG TÔI</h4>
            <div className="footer__social">
              <a href="https://www.facebook.com/Thomas.Pham.25" target="_blank" rel="noopener noreferrer" className="footer__social-btn footer__social-btn--fb" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="https://www.instagram.com/thomas_pham.25/" target="_blank" rel="noopener noreferrer" className="footer__social-btn footer__social-btn--ig" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://www.youtube.com/@phamvanlinh2318" target="_blank" rel="noopener noreferrer" className="footer__social-btn footer__social-btn--yt" aria-label="YouTube">
                <YoutubeIcon />
              </a>
              <a href="https://zalo.me/0393373094" target="_blank" rel="noopener noreferrer" className="footer__social-btn footer__social-btn--tw" aria-label="Zalo">
                <span style={{ fontSize: '10px', fontWeight: 'bold' }}>Zalo</span>
              </a>
            </div>

            <h4 className="footer__heading" style={{ marginTop: '24px' }}>ĐĂNG KÝ NHẬN ƯU ĐÃI</h4>
            <p className="footer__newsletter-desc">
              Nhận thông tin khuyến mãi và sản phẩm mới nhất
            </p>
            <form className="footer__newsletter" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email của bạn..."
                className="footer__newsletter-input"
                aria-label="Email đăng ký nhận tin"
              />
              <button type="submit" className="footer__newsletter-btn">
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <div className="footer__bottom-container">
          <p className="footer__copyright">
            © 2025 Football Shop. Tất cả quyền được bảo lưu.
          </p>
          <div className="footer__payment">
            {['VISA', 'MC', 'JCB', 'MOMO', 'VNPAY', 'COD'].map((method) => (
              <span key={method} className="footer__payment-badge">{method}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
