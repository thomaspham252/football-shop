import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="nf-page">
      <Navbar />
      <main className="nf-main">
        <div className="nf-content">
          <p className="nf-code">404</p>
          <div className="nf-ball">⚽</div>
          <h1 className="nf-title">Trang không tìm thấy</h1>
          <p className="nf-desc">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
          <div className="nf-actions">
            <a href="/" className="nf-btn nf-btn--primary">Về trang chủ</a>
            <a href="/san-pham" className="nf-btn nf-btn--outline">Xem sản phẩm</a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
