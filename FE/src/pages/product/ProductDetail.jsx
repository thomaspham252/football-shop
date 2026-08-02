import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProductCard from '../../components/common/ProductCard';
import productApi from '../../api/productApi';
import homeApi from '../../api/homeApi';
import {
  ChevronRight, Heart, ShoppingCart, Zap,
  Star, StarHalf, ChevronLeft,
  RotateCcw, Truck, Shield, Share2, Minus, Plus
} from 'lucide-react';
import './ProductDetail.css';

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

const defaultSizeChart = [
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
];

const mockReviews = [
  { id: 1, name: 'Nguyễn Văn A', rating: 5, date: '12/05/2025', comment: 'Giày rất tốt, đi êm chân, đúng size. Giao hàng nhanh, đóng gói cẩn thận. Sẽ ủng hộ shop lần sau!', verified: true },
  { id: 2, name: 'Trần Thị B', rating: 4, date: '08/05/2025', comment: 'Chất lượng ổn, màu sắc đẹp như hình. Chỉ hơi tiếc là không có size 39.5 màu đen.', verified: true },
  { id: 3, name: 'Lê Minh C', rating: 5, date: '01/05/2025', comment: 'Mua lần thứ 3 rồi, lần nào cũng hài lòng. Giày chính hãng, giá tốt hơn các nơi khác.', verified: true },
];

const colorMap = {
  'Trắng': '#ffffff',
  'Đen': '#1a1a1a',
  'Đỏ': '#d32f2f',
  'Xanh': '#1976d2',
  'Xanh Navy': '#0d47a1',
  'Xám': '#9e9e9e',
  'Vàng': '#ffeb3b',
  'Cam': '#ff9800',
  'Hồng': '#e91e63',
  'Xanh Lá': '#4caf50',
  'Trắng/Đỏ': '#ffffff',
  'Đen/Trắng': '#1a1a1a'
};

function getColorHex(name) {
  if (!name) return '#9e9e9e';
  const clean = name.toLowerCase().trim();
  if (clean.includes('trắng') || clean.includes('white')) return '#ffffff';
  if (clean.includes('đen') || clean.includes('black')) return '#1a1a1a';
  if (clean.includes('navy')) return '#0d47a1';
  if (clean.includes('xanh dương') || clean.includes('blue') || clean.includes('xanh biển')) return '#1976d2';
  if (clean.includes('xanh lá') || clean.includes('green')) return '#4caf50';
  if (clean.includes('đỏ') || clean.includes('red')) return '#d32f2f';
  if (clean.includes('vàng') || clean.includes('yellow')) return '#ffeb3b';
  if (clean.includes('cam') || clean.includes('orange')) return '#ff9800';
  if (clean.includes('hồng') || clean.includes('pink')) return '#e91e63';
  if (clean.includes('xám') || clean.includes('grey') || clean.includes('gray')) return '#9e9e9e';
  return '#9e9e9e';
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');
  const [wishlisted, setWishlisted] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch product detail
  useEffect(() => {
    setLoading(true);
    setError(null);
    productApi.getProductDetail(id)
      .then(res => {
        const prodData = res.data;
        setProduct(prodData);
        setLoading(false);
        setActiveImg(0);
        setSelectedColor(0);

        // Auto-select size and image of the first variant if available
        const firstVariant = prodData.variants?.[0];
        if (firstVariant) {
          setSelectedSize(firstVariant.size);
        } else {
          setSelectedSize(null);
        }
        setQty(1);
      })
      .catch(err => {
        console.error("Lỗi lấy chi tiết sản phẩm:", err);
        setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
        setLoading(false);
      });
  }, [id]);

  // Fetch related products
  useEffect(() => {
    homeApi.getNewProducts(8)
      .then(res => {
        const list = res.data.filter(p => p.productId !== Number(id)).slice(0, 5);
        setRelatedProducts(list);
      })
      .catch(err => {
        console.error("Lỗi lấy sản phẩm liên quan:", err);
      });
  }, [id]);

  // Derive images (null-safe, runs on every render above early returns)
  const images = [];
  if (product) {
    if (product.imageUrl) images.push(product.imageUrl);
    if (product.galleryImages && Array.isArray(product.galleryImages)) {
      product.galleryImages.forEach(img => {
        if (img && img !== product.imageUrl) {
          images.push(img);
        }
      });
    }
    if (product.variants) {
      product.variants.forEach(v => {
        if (v.imageUrl && !images.includes(v.imageUrl)) {
          images.push(v.imageUrl);
        }
      });
    }
  }
  if (images.length === 0) {
    images.push('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80');
  }

  // Extract unique colors from variants (null-safe)
  const colors = [];
  const seenColors = new Set();
  if (product && product.variants && product.variants.length > 0) {
    product.variants.forEach(v => {
      if (v.color && !seenColors.has(v.color)) {
        seenColors.add(v.color);
        const hex = colorMap[v.color] || getColorHex(v.color);
        colors.push({
          name: v.color,
          hex: hex,
          border: hex === '#ffffff' ? '#ddd' : hex
        });
      }
    });
  }
  if (colors.length === 0) {
    colors.push({ name: 'Mặc định', hex: '#1a1a1a', border: '#1a1a1a' });
  }

  // Sync image when color selection changes (above early returns)
  useEffect(() => {
    if (product && colors[selectedColor]) {
      const colName = colors[selectedColor].name;
      const vWithImg = product.variants?.find(v => v.color === colName && v.imageUrl);
      if (vWithImg) {
        const idx = images.indexOf(vWithImg.imageUrl);
        if (idx !== -1) {
          setActiveImg(idx);
        }
      }
    }
  }, [selectedColor, product, colors, images]);

  // Loading and Error handlers (early returns)
  if (loading) {
    return (
      <div className="pd-page">
        <Navbar />
        <main className="pd-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div className="loading-spinner" style={{ fontSize: '1.2rem', color: '#1a1a1a', fontWeight: '500' }}>
            Đang tải thông tin sản phẩm...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pd-page">
        <Navbar />
        <main className="pd-main" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: '1.5rem' }}>
          <div className="error-message" style={{ color: '#d32f2f', fontSize: '1.3rem', fontWeight: 'bold' }}>
            {error || "Sản phẩm không tồn tại!"}
          </div>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', color: '#0d47a1', fontWeight: '500', textDecoration: 'underline' }}>
            Quay lại trang chủ
          </a>
        </main>
        <Footer />
      </div>
    );
  }

  // Extract unique sizes from variants
  const allSizes = [];
  const seenSizes = new Set();
  if (product.variants) {
    product.variants.forEach(v => {
      if (v.size && !seenSizes.has(v.size)) {
        seenSizes.add(v.size);
        allSizes.push(v.size);
      }
    });
  }
  allSizes.sort((a, b) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.localeCompare(b);
  });

  const selectedColorName = colors[selectedColor]?.name;
  
  // Format sizes availability for selected color (only keeping available/in-stock sizes)
  const sizes = allSizes.map(sz => {
    const match = product.variants?.find(v => v.color === selectedColorName && v.size === sz);
    return {
      label: sz,
      available: match ? (match.variantStock > 0) : false,
      variantId: match?.variantId,
      variantStock: match?.variantStock ?? 0,
      price: match?.variantPrice
    };
  }).filter(s => s.available);

  // Get selected variant
  const currentVariant = product.variants?.find(
    v => v.color === selectedColorName && v.size === selectedSize
  );

  // Price calculations
  const displayPrice = currentVariant?.variantPrice || product.salePrice || product.basePrice || 0;
  const displayOriginalPrice = product.basePrice || 0;
  const discount = displayOriginalPrice > displayPrice
    ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)
    : 0;

  // Determine stock
  const currentStock = currentVariant
    ? currentVariant.variantStock
    : (product.variants?.filter(v => v.color === selectedColorName).reduce((sum, v) => sum + v.variantStock, 0) || product.stockQuantity || 0);

  const inStock = currentStock > 0;

  // Handler for changing colors (automatically select first size available for that color)
  const handleColorChange = (index) => {
    setSelectedColor(index);
    const targetColorName = colors[index]?.name;
    const variantsOfColor = product.variants?.filter(v => v.color === targetColorName) || [];
    const firstAvailableVar = variantsOfColor.find(v => v.variantStock > 0) || variantsOfColor[0];
    if (firstAvailableVar) {
      setSelectedSize(firstAvailableVar.size);
    } else {
      setSelectedSize(null);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    alert(`Đã thêm vào giỏ: ${product.productName} - Màu ${selectedColorName} - Size ${selectedSize} - Số lượng ${qty}`);
  };

  const handleBuyNow = () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    alert(`Mua ngay: ${product.productName} - Màu ${selectedColorName} - Size ${selectedSize} - Số lượng ${qty}`);
  };

  const prevImg = () => setActiveImg((p) => (p - 1 + images.length) % images.length);
  const nextImg = () => setActiveImg((p) => (p + 1) % images.length);

  return (
    <div className="pd-page">
      <Navbar />

      <main className="pd-main">
        {/* Breadcrumb */}
        <div className="pd-breadcrumb">
          <div className="pd-container">
            <a href="/">Trang chủ</a>
            <ChevronRight size={13} />
            <a href="/san-pham">Sản phẩm</a>
            <ChevronRight size={13} />
            <span>{product.productName}</span>
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
                  src={images[activeImg]}
                  alt={product.productName}
                  className="pd-gallery__img"
                />
                <button className="pd-gallery__arrow pd-gallery__arrow--right" onClick={nextImg} aria-label="Ảnh sau">
                  <ChevronRight size={20} />
                </button>
                <span className="pd-gallery__counter">{activeImg + 1} / {images.length}</span>
              </div>
              <div className="pd-gallery__thumbs">
                {images.map((img, i) => (
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
              <p className="pd-info__brand">{product.brandName || 'Football Store'}</p>
              <h1 className="pd-info__name">{product.productName}</h1>

              <div className="pd-info__meta">
                <StarRating rating={product.rating || 5.0} />
                <span className="pd-info__rating-num">{product.rating || 5.0}</span>
                <span className="pd-info__divider">|</span>
                <span className="pd-info__reviews">{product.totalReviews || 0} đánh giá</span>
                <span className="pd-info__divider">|</span>
                <span className="pd-info__sold">Đã bán {product.soldCount || 0}</span>
              </div>

              <div className="pd-info__price-row">
                <span className="pd-info__price">{displayPrice.toLocaleString('vi-VN')}đ</span>
                {displayOriginalPrice > displayPrice && (
                  <>
                    <span className="pd-info__original">{displayOriginalPrice.toLocaleString('vi-VN')}đ</span>
                    <span className="pd-info__discount">-{discount}%</span>
                  </>
                )}
              </div>

              {/* Color */}
              {colors.length > 0 && colors[0].name !== 'Mặc định' && (
                <div className="pd-info__option">
                  <p className="pd-info__option-label">
                    Màu sắc: <strong>{colors[selectedColor]?.name}</strong>
                  </p>
                  <div className="pd-info__colors">
                    {colors.map((c, i) => (
                      <button
                        key={i}
                        className={`pd-info__color-btn ${i === selectedColor ? 'pd-info__color-btn--active' : ''}`}
                        style={{ background: c.hex, borderColor: c.border }}
                        onClick={() => handleColorChange(i)}
                        aria-label={c.name}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size */}
              {sizes.length > 0 && (
                <div className="pd-info__option">
                  <div className="pd-info__size-header">
                    <p className="pd-info__option-label">
                      Size: {selectedSize && <strong>{selectedSize}</strong>}
                    </p>
                    <a href="/huong-dan-chon-size" target="_blank" rel="noopener noreferrer" className="pd-info__size-guide">
                      Hướng dẫn chọn size
                    </a>
                  </div>
                  <div className="pd-info__sizes">
                    {sizes.map((s) => (
                      <button
                        key={s.label}
                        className={`pd-info__size-btn ${selectedSize === s.label ? 'pd-info__size-btn--active' : ''}`}
                        onClick={() => { setSelectedSize(s.label); setSizeError(false); }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  {sizeError && <p className="pd-info__size-error">Vui lòng chọn size trước khi mua</p>}
                </div>
              )}

              {/* Quantity */}
              <div className="pd-info__option">
                <p className="pd-info__option-label">Số lượng:</p>
                <div className="pd-info__qty">
                  <button
                    className="pd-info__qty-btn"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Giảm"
                    disabled={!inStock}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="pd-info__qty-val">{inStock ? qty : 0}</span>
                  <button
                    className="pd-info__qty-btn"
                    onClick={() => setQty((q) => Math.min(currentStock, q + 1))}
                    aria-label="Tăng"
                    disabled={!inStock || qty >= currentStock}
                  >
                    <Plus size={14} />
                  </button>
                  <span className={`pd-info__stock ${!inStock ? 'pd-info__stock--out' : ''}`}>
                    {inStock ? `Còn hàng (${currentStock} sản phẩm)` : 'Hết hàng'}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="pd-info__cta">
                <button 
                  className="pd-info__btn pd-info__btn--cart" 
                  onClick={handleAddToCart}
                  disabled={!inStock}
                >
                  <ShoppingCart size={18} />
                  THÊM VÀO GIỎ HÀNG
                </button>
                <button 
                  className="pd-info__btn pd-info__btn--buy" 
                  onClick={handleBuyNow}
                  disabled={!inStock}
                >
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
                { key: 'desc', label: 'MÔ TẢ' },
                { key: 'policy', label: 'CHÍNH SÁCH ĐỔI TRẢ' },
                { key: 'reviews', label: `ĐÁNH GIÁ (${product.totalReviews || 0})` },
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

              {/* Description */}
              {activeTab === 'desc' && (
                <div className="pd-desc">
                  <p style={{ whiteSpace: 'pre-line' }}>{product.description}</p>
                  {product.detailedDescription && (
                    <div className="pd-desc__detailed" style={{ marginTop: '1.5rem', whiteSpace: 'pre-line' }}>
                      <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Đặc điểm chi tiết</h4>
                      <p>{product.detailedDescription}</p>
                    </div>
                  )}
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
                      <span className="pd-reviews__score-num">{product.rating || 5.0}</span>
                      <StarRating rating={product.rating || 5.0} size={20} />
                      <span className="pd-reviews__score-total">{product.totalReviews || 0} đánh giá</span>
                    </div>
                  </div>
                  <div className="pd-reviews__list">
                    {mockReviews.map((r) => (
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
        {relatedProducts.length > 0 && (
          <section className="pd-related">
            <div className="pd-container">
              <h2 className="pd-related__title">
                <span>—</span> BẠN CŨNG CÓ THỂ QUAN TÂM <span>—</span>
              </h2>
              <div className="pd-related__grid">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.productId} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Reviews CTA ── */}
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
