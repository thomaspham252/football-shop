import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import {
  ChevronRight, Heart, ShoppingCart, Zap,
  Star, StarHalf, ChevronLeft, ChevronDown, ChevronUp,
  RotateCcw, Truck, Shield, Share2, Minus, Plus
} from 'lucide-react';
import './ProductDetail.css';

/* ── Mock data ── */
const product = {
  id: 1,
  name: 'Giày Thể Thao Quần Vợt Pickleball Hummer M 700M Vapor Pro 3 HC',
  brand: 'Nike',
  sku: 'NK-VP3-HC-001',
  price: 3200000,
  originalPrice: 4500000,
  rating: 4.5,
  reviewCount: 128,
  sold: 342,
  inStock: true,
  description: `Giày Nike Zoom Vapor Pro 3 HC được thiết kế dành riêng cho các sân cứng (Hard Court), mang lại sự ổn định và độ bền vượt trội. Đế ngoài XDR chịu mài mòn cao, đệm Zoom Air phản hồi nhanh giúp bạn di chuyển linh hoạt trong từng pha bóng.`,
  images: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80',
    'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=600&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80',
  ],
  colors: [
    { name: 'Trắng/Đỏ', hex: '#fff', border: '#ddd' },
    { name: 'Đen/Trắng', hex: '#1a1a1a', border: '#1a1a1a' },
    { name: 'Xanh Navy', hex: '#1565c0', border: '#1565c0' },
    { name: 'Xám', hex: '#9e9e9e', border: '#9e9e9e' },
  ],
  sizes: [
    { label: '38', available: true },
    { label: '38.5', available: true },
    { label: '39', available: true },
    { label: '39.5', available: false },
    { label: '40', available: true },
    { label: '40.5', available: true },
    { label: '41', available: true },
    { label: '41.5', available: true },
    { label: '42', available: true },
    { label: '42.5', available: false },
    { label: '43', available: true },
    { label: '44', available: true },
  ],
  features: [
    'Đế ngoài XDR chịu mài mòn cao',
    'Đệm Zoom Air phản hồi nhanh',
    'Phần trên lưới thoáng khí',
    'Hệ thống dây buộc Dynamic Fit',
    'Phù hợp sân cứng (Hard Court)',
  ],
  sizeChart: [
    { us: '6.5', cm: '24.5', eu: '38', uk: '6' },
    { us: '7', cm: '25', eu: '40', uk: '6' },
    { us: '7.5', cm: '25.5', eu: '40.5', uk: '6.5' },
    { us: '8', cm: '26', eu: '41', uk: '7' },
    { us: '8.5', cm: '26.5', eu: '42', uk: '7.5' },
    { us: '9', cm: '27', eu: '42.5', uk: '8' },
    { us: '9.5', cm: '27.5', eu: '43', uk: '8.5' },
    { us: '10', cm: '28', eu: '44', uk: '9' },
    { us: '10.5', cm: '28.5', eu: '44.5', uk: '9.5' },
    { us: '11', cm: '29', eu: '45', uk: '10' },
    { us: '11.5', cm: '30', eu: '45.5', uk: '10.5' },
  ],
};

const relatedProducts = [
  { id: 2, name: 'Giày Quần Vợt Ultrashot 4', brand: 'K-Swiss', price: 2800000, originalPrice: 3600000, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80', colors: ['#f5a623', '#fff'] },
  { id: 3, name: 'Giày Tennis Court Zoom NXT', brand: 'Nike', price: 3200000, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', colors: ['#fff', '#000'] },
  { id: 4, name: 'Giày Thể Thao Cloud 5', brand: 'On', price: 4200000, originalPrice: 5500000, image: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=400&q=80', colors: ['#fff', '#e8d5b7'] },
  { id: 5, name: 'Giày Chạy Bộ Ultraboost 22', brand: 'Adidas', price: 4100000, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', colors: ['#000', '#fff'] },
  { id: 6, name: 'Giày Trail Running Wildhorse 8', brand: 'Nike', price: 2900000, originalPrice: 3800000, image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&q=80', colors: ['#795548', '#000'] },
];

const reviews = [
  { id: 1, name: 'Nguyễn Văn A', rating: 5, date: '12/05/2025', comment: 'Giày rất tốt, đi êm chân, đúng size. Giao hàng nhanh, đóng gói cẩn thận. Sẽ ủng hộ shop lần sau!', verified: true },
  { id: 2, name: 'Trần Thị B', rating: 4, date: '08/05/2025', comment: 'Chất lượng ổn, màu sắc đẹp như hình. Chỉ hơi tiếc là không có size 39.5 màu đen.', verified: true },
  { id: 3, name: 'Lê Minh C', rating: 5, date: '01/05/2025', comment: 'Mua lần thứ 3 rồi, lần nào cũng hài lòng. Giày chính hãng, giá tốt hơn các nơi khác.', verified: true },
];

/* ── Star rating component ── */
function StarRating({ rating, size = 16 }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="star-rating">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={i} size={size} className="star star--full" />
      ))}
      {half && <StarHalf size={size} className="star star--half" />}
      {Array.from({ length: 5 - full - (half ? 1 : 0) }).map((_, i) => (
        <Star key={`e${i}`} size={size} className="star star--empty" />
      ))}
    </span>
  );
}

/* ── Main component ── */
export default function ProductDetail() {
  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('size');
  const [wishlisted, setWishlisted] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    alert(`Đã thêm vào giỏ: ${product.name} - Size ${selectedSize}`);
  };

  const handleBuyNow = () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    alert(`Mua ngay: ${product.name} - Size ${selectedSize}`);
  };

  const prevImg = () => setActiveImg((p) => (p - 1 + product.images.length) % product.images.length);
  const nextImg = () => setActiveImg((p) => (p + 1) % product.images.length);

  return (
    <div className="pd-page">
      <Navbar />

      <main className="pd-main">
        {/* Breadcrumb */}
        <div className="pd-breadcrumb">
          <div className="pd-container">
            <a href="/">Trang chủ</a>
            <ChevronRight size={13} />
            <a href="/giay-the-thao">Giày thể thao</a>
            <ChevronRight size={13} />
            <a href="/giay-the-thao/tennis">Tennis</a>
            <ChevronRight size={13} />
            <span>{product.name}</span>
          </div>
        </div>

        {/* Product section */}
        <section className="pd-section">
          <div className="pd-container pd-product-grid">

            {/* ── Gallery ── */}
            <div className="pd-gallery">
              <div className="pd-gallery__main">
                <button className="pd-gallery__arrow pd-gallery__arrow--left" onClick={prevImg} aria-label="Ảnh trước">
                  <ChevronLeft size={20} />
                </button>
                <img
                  src={product.images[activeImg]}
                  alt={product.name}
                  className="pd-gallery__img"
                />
                <button className="pd-gallery__arrow pd-gallery__arrow--right" onClick={nextImg} aria-label="Ảnh sau">
                  <ChevronRight size={20} />
                </button>
                <span className="pd-gallery__counter">{activeImg + 1} / {product.images.length}</span>
              </div>
              <div className="pd-gallery__thumbs">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`pd-gallery__thumb ${i === activeImg ? 'pd-gallery__thumb--active' : ''}`}
                    onClick={() => setActiveImg(i)}
                    aria-label={`Ảnh ${i + 1}`}
                  >
                    <img src={img} alt={`Thumb ${i + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* ── Info ── */}
            <div className="pd-info">
              <p className="pd-info__brand">{product.brand}</p>
              <h1 className="pd-info__name">{product.name}</h1>

              <div className="pd-info__meta">
                <StarRating rating={product.rating} />
                <span className="pd-info__rating-num">{product.rating}</span>
                <span className="pd-info__divider">|</span>
                <span className="pd-info__reviews">{product.reviewCount} đánh giá</span>
                <span className="pd-info__divider">|</span>
                <span className="pd-info__sold">Đã bán {product.sold}</span>
              </div>

              <div className="pd-info__price-row">
                <span className="pd-info__price">{product.price.toLocaleString('vi-VN')}đ</span>
                <span className="pd-info__original">{product.originalPrice.toLocaleString('vi-VN')}đ</span>
                <span className="pd-info__discount">-{discount}%</span>
              </div>

              {/* Color */}
              <div className="pd-info__option">
                <p className="pd-info__option-label">
                  Màu sắc: <strong>{product.colors[selectedColor].name}</strong>
                </p>
                <div className="pd-info__colors">
                  {product.colors.map((c, i) => (
                    <button
                      key={i}
                      className={`pd-info__color-btn ${i === selectedColor ? 'pd-info__color-btn--active' : ''}`}
                      style={{ background: c.hex, borderColor: c.border }}
                      onClick={() => setSelectedColor(i)}
                      aria-label={c.name}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="pd-info__option">
                <div className="pd-info__size-header">
                  <p className="pd-info__option-label">
                    Size: {selectedSize && <strong>{selectedSize}</strong>}
                  </p>
                  <button className="pd-info__size-guide" onClick={() => setActiveTab('size')}>
                    Hướng dẫn chọn size
                  </button>
                </div>
                <div className="pd-info__sizes">
                  {product.sizes.map((s) => (
                    <button
                      key={s.label}
                      className={`pd-info__size-btn
                        ${!s.available ? 'pd-info__size-btn--disabled' : ''}
                        ${selectedSize === s.label ? 'pd-info__size-btn--active' : ''}
                      `}
                      disabled={!s.available}
                      onClick={() => { setSelectedSize(s.label); setSizeError(false); }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                {sizeError && <p className="pd-info__size-error">Vui lòng chọn size trước khi mua</p>}
              </div>

              {/* Quantity */}
              <div className="pd-info__option">
                <p className="pd-info__option-label">Số lượng:</p>
                <div className="pd-info__qty">
                  <button
                    className="pd-info__qty-btn"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Giảm"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="pd-info__qty-val">{qty}</span>
                  <button
                    className="pd-info__qty-btn"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Tăng"
                  >
                    <Plus size={14} />
                  </button>
                  <span className="pd-info__stock">Còn hàng</span>
                </div>
              </div>

              {/* CTA */}
              <div className="pd-info__cta">
                <button className="pd-info__btn pd-info__btn--cart" onClick={handleAddToCart}>
                  <ShoppingCart size={18} />
                  THÊM VÀO GIỎ HÀNG
                </button>
                <button className="pd-info__btn pd-info__btn--buy" onClick={handleBuyNow}>
                  <Zap size={18} />
                  MUA NGAY
                </button>
              </div>

              <div className="pd-info__secondary-actions">
                <button
                  className={`pd-info__wishlist ${wishlisted ? 'pd-info__wishlist--active' : ''}`}
                  onClick={() => setWishlisted(!wishlisted)}
                >
                  <Heart size={16} />
                  {wishlisted ? 'Đã yêu thích' : 'Yêu thích'}
                </button>
                <button className="pd-info__share">
                  <Share2 size={16} />
                  Chia sẻ
                </button>
              </div>

              {/* Policies */}
              <div className="pd-info__policies">
                <div className="pd-info__policy">
                  <Truck size={16} />
                  <span>Miễn phí vận chuyển đơn từ 500.000đ</span>
                </div>
                <div className="pd-info__policy">
                  <RotateCcw size={16} />
                  <span>Đổi trả miễn phí trong 30 ngày</span>
                </div>
                <div className="pd-info__policy">
                  <Shield size={16} />
                  <span>Hàng chính hãng 100% — Bảo hành 12 tháng</span>
                </div>
              </div>

              <p className="pd-info__sku">SKU: {product.sku}</p>
            </div>
          </div>
        </section>

        {/* ── Tabs ── */}
        <section className="pd-tabs-section">
          <div className="pd-container">
            <div className="pd-tabs">
              {[
                { key: 'size', label: 'BẢNG SỐ ĐO' },
                { key: 'desc', label: 'MÔ TẢ' },
                { key: 'policy', label: 'CHÍNH SÁCH ĐỔI TRẢ' },
                { key: 'reviews', label: `ĐÁNH GIÁ (${product.reviewCount})` },
              ].map((t) => (
                <button
                  key={t.key}
                  className={`pd-tab ${activeTab === t.key ? 'pd-tab--active' : ''}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="pd-tab-content">
              {/* Size chart */}
              {activeTab === 'size' && (
                <div className="pd-size-chart">
                  <h3>Size Giày Nike Nam</h3>
                  <div className="pd-size-chart__table-wrap">
                    <table className="pd-size-chart__table">
                      <thead>
                        <tr>
                          <th>US</th>
                          <th>CM/JP</th>
                          <th>EU</th>
                          <th>UK</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.sizeChart.map((row, i) => (
                          <tr key={i}>
                            <td>{row.us}</td>
                            <td>{row.cm}</td>
                            <td>{row.eu}</td>
                            <td>{row.uk}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Description */}
              {activeTab === 'desc' && (
                <div className="pd-desc">
                  <p>{product.description}</p>
                  <h4>Đặc điểm nổi bật</h4>
                  <ul>
                    {product.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Policy */}
              {activeTab === 'policy' && (
                <div className="pd-policy">
                  <div className="pd-policy__item">
                    <RotateCcw size={20} />
                    <div>
                      <h4>Đổi trả trong 30 ngày</h4>
                      <p>Sản phẩm còn nguyên tem, chưa qua sử dụng, còn đầy đủ hộp và phụ kiện đi kèm.</p>
                    </div>
                  </div>
                  <div className="pd-policy__item">
                    <Truck size={20} />
                    <div>
                      <h4>Miễn phí vận chuyển chiều về</h4>
                      <p>Chúng tôi chịu phí vận chuyển khi bạn đổi/trả hàng lỗi do nhà sản xuất.</p>
                    </div>
                  </div>
                  <div className="pd-policy__item">
                    <Shield size={20} />
                    <div>
                      <h4>Bảo hành chính hãng 12 tháng</h4>
                      <p>Bảo hành lỗi kỹ thuật từ nhà sản xuất trong vòng 12 tháng kể từ ngày mua.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews */}
              {activeTab === 'reviews' && (
                <div className="pd-reviews">
                  <div className="pd-reviews__summary">
                    <div className="pd-reviews__score">
                      <span className="pd-reviews__score-num">{product.rating}</span>
                      <StarRating rating={product.rating} size={20} />
                      <span className="pd-reviews__score-total">{product.reviewCount} đánh giá</span>
                    </div>
                  </div>
                  <div className="pd-reviews__list">
                    {reviews.map((r) => (
                      <div key={r.id} className="pd-review-item">
                        <div className="pd-review-item__header">
                          <div className="pd-review-item__avatar">
                            {r.name.charAt(0)}
                          </div>
                          <div>
                            <p className="pd-review-item__name">
                              {r.name}
                              {r.verified && <span className="pd-review-item__verified">✓ Đã mua hàng</span>}
                            </p>
                            <div className="pd-review-item__meta">
                              <StarRating rating={r.rating} size={13} />
                              <span className="pd-review-item__date">{r.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="pd-review-item__comment">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                  <div className="pd-reviews__empty-cta">
                    <button className="pd-reviews__write-btn">Viết đánh giá</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Related products ── */}
        <section className="pd-related">
          <div className="pd-container">
            <h2 className="pd-related__title">
              <span>—</span> BẠN CŨNG CÓ THỂ QUAN TÂM <span>—</span>
            </h2>
            <div className="pd-related__grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Reviews CTA (empty state) ── */}
        <section className="pd-review-cta">
          <div className="pd-container">
            <h2 className="pd-related__title">
              <span>—</span> NHẬN XÉT CỦA KHÁCH HÀNG <span>—</span>
            </h2>
            <div className="pd-review-cta__box">
              <div className="pd-review-cta__icon">✍️</div>
              <p>Hãy là người đầu tiên đánh giá sản phẩm này</p>
              <button className="pd-review-cta__btn">VIẾT ĐÁNH GIÁ NGAY</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
