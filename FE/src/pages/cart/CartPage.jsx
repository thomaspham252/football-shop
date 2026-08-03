import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProductCard from '../../components/common/ProductCard';
import { Trash2, Minus, Plus, ShoppingBag, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import homeApi from '../../api/homeApi';
import './CartPage.css';

/* ── Mock cart items ── */
const INIT_CART = [
  {
    id: 1,
    name: 'Giày Thể Thao Bóng Đá Sân Cỏ Tự Nhiên Nam Nike Zoom Vapor 16 Academy AG',
    brand: 'Nike',
    sku: 'NK-ZV16-AG-001',
    size: '42',
    color: 'Xanh/Đen',
    price: 2769000,
    originalPrice: 3200000,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80',
    qty: 1,
  },
  {
    id: 2,
    name: 'Giày Đá Bóng Adidas Predator Elite FG',
    brand: 'Adidas',
    sku: 'AD-PE-FG-002',
    size: '41',
    color: 'Đen/Đỏ',
    price: 5200000,
    originalPrice: 6500000,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&q=80',
    qty: 1,
  },
];

export default function CartPage() {
  const { cart, updateQty, removeItem, clearCart } = useCart();
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState(() => cart.map(item => item.id));
  const [confirmAction, setConfirmAction] = useState(null);

  const handleExecuteConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'remove_item') {
      removeItem(confirmAction.itemId);
    } else if (confirmAction.type === 'clear_all') {
      clearCart();
    }
    setConfirmAction(null);
  };

  useEffect(() => {
    setSelectedIds(prev => prev.filter(id => cart.some(item => item.id === id)));
  }, [cart]);

  useEffect(() => {
    setSelectedIds(prev => {
      const newIds = cart.map(item => item.id);
      const addedIds = newIds.filter(id => !prev.includes(id));
      return [...prev, ...addedIds].filter(id => newIds.includes(id));
    });
  }, [cart.length]);

  useEffect(() => {
    homeApi.getPromotionProducts(5)
      .then(res => {
        setSuggestedProducts(res.data);
      })
      .catch(err => {
        console.error("Lỗi khi tải sản phẩm khuyến mãi ở giỏ hàng:", err);
      });
  }, []);

  const isAllSelected = cart.length > 0 && selectedIds.length === cart.length;

  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cart.map(item => item.id));
    }
  };

  const handleToggleItem = (itemId) => {
    setSelectedIds(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectedCartItems = cart.filter(item => selectedIds.includes(item.id));
  const subtotal  = selectedCartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping  = subtotal === 0 ? 0 : (subtotal >= 500000 ? 0 : 30000);
  const total     = subtotal + shipping;

  const handleCheckout = () => {
    localStorage.setItem('checkoutItems', JSON.stringify(selectedCartItems));
    window.location.href = '/thanh-toan';
  };

  /* ── Empty cart ── */
  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <Navbar />
        <main className="cart-main">
          <div className="cart-container">
            <h1 className="cart-heading">GIỎ HÀNG</h1>
            <div className="cart-empty">
              <ShoppingBag size={64} strokeWidth={1} />
              <p>Giỏ hàng của bạn đang trống</p>
              <a href="/san-pham" className="cart-empty__btn">TIẾP TỤC MUA SẮM</a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Navbar />

      <main className="cart-main">
        <div className="cart-container">
          {/* Breadcrumb */}
          <div className="cart-breadcrumb">
            <a href="/">Trang chủ</a>
            <ChevronRight size={13} />
            <span>Giỏ hàng</span>
          </div>

          <h1 className="cart-heading">GIỎ HÀNG</h1>

          <div className="cart-layout">
            {/* ── Left: product table ── */}
            <div className="cart-left">
              {/* Table header */}
              <div className="cart-table-head">
                <span className="cart-table-head__product" style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id="selectAll"
                    checked={isAllSelected}
                    onChange={handleToggleAll}
                    style={{ marginRight: '8px', cursor: 'pointer', scale: '1.2' }}
                  />
                  <label htmlFor="selectAll" style={{ cursor: 'pointer', fontWeight: 'bold' }}>Tất cả</label>
                  {isAllSelected && (
                    <button
                      onClick={() => setConfirmAction({
                        type: 'clear_all',
                        message: "Bạn có chắc chắn muốn xóa toàn bộ sản phẩm khỏi giỏ hàng?"
                      })}
                      style={{
                        marginLeft: '15px',
                        color: '#e53935',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      Xóa tất cả
                    </button>
                  )}
                </span>
                <span className="cart-table-head__qty">SỐ LƯỢNG</span>
                <span className="cart-table-head__total">TỔNG CỘNG</span>
              </div>

              {/* Items */}
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item__product">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleToggleItem(item.id)}
                        style={{
                          marginRight: '12px',
                          alignSelf: 'center',
                          cursor: 'pointer',
                          scale: '1.2'
                        }}
                      />
                      <a href={`/san-pham/${item.productId}`} className="cart-item__img-wrap">
                        <img src={item.image} alt={item.name} className="cart-item__img" />
                      </a>
                      <div className="cart-item__info">
                        <p className="cart-item__brand">{item.brand}</p>
                        <a href={`/san-pham/${item.productId}`} className="cart-item__name">{item.name}</a>
                        <div className="cart-item__meta">
                          <span>{item.color} / {item.size}</span>
                        </div>
                        <div className="cart-item__prices">
                          <span className="cart-item__price">{item.price.toLocaleString('vi-VN')}đ</span>
                          {item.originalPrice && (
                            <span className="cart-item__original">{item.originalPrice.toLocaleString('vi-VN')}đ</span>
                          )}
                        </div>
                        <button className="cart-item__remove" onClick={() => setConfirmAction({
                          type: 'remove_item',
                          itemId: item.id,
                          message: "Bạn có muốn xóa sản phẩm ?"
                        })}>
                          <Trash2 size={13} /> Xóa
                        </button>
                      </div>
                    </div>
                    <div className="cart-item__qty-wrap">
                      <div className="cart-item__qty">
                        <button onClick={() => updateQty(item.id, -1)} aria-label="Giảm"><Minus size={13} /></button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, +1)} aria-label="Tăng"><Plus size={13} /></button>
                      </div>
                    </div>

                    <div className="cart-item__total-wrap">
                      <span className="cart-item__total">
                        {(item.price * item.qty).toLocaleString('vi-VN')}đ
                      </span>
                      {item.originalPrice && (
                        <span className="cart-item__total-original">
                          {(item.originalPrice * item.qty).toLocaleString('vi-VN')}đ
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              {/* Trust badges */}
              <div className="cart-trust">
                <div className="cart-trust__item">
                  <span className="cart-trust__check">✔</span>
                  <span>Hàng chính hãng</span>
                </div>
                <div className="cart-trust__item">
                  <span className="cart-trust__check">✔</span>
                  <span>Đổi trả 7 ngày</span>
                </div>
                <div className="cart-trust__item">
                  <span className="cart-trust__check">✔</span>
                  <span>Giao nhanh toàn quốc</span>
                </div>
                <div className="cart-trust__item">
                  <span className="cart-trust__check">✔</span>
                  <span>Thanh toán an toàn</span>
                </div>
              </div>

              <div className="cart-actions">
                <a href="/san-pham" className="cart-actions__continue">← Tiếp tục mua sắm</a>
              </div>
            </div>

            {/* ── Right: summary ── */}
            <div className="cart-right">
              <div className="cart-summary">
                <h3 className="cart-summary__title">TỔNG CỘNG</h3>

                <div className="cart-summary__rows">
                  <div className="cart-summary__row">
                    <span>Tạm tính</span>
                    <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="cart-summary__row">
                    <span>Phí vận chuyển</span>
                    <span>{shipping === 0 ? <span className="cart-summary__free">Miễn phí</span> : `${shipping.toLocaleString('vi-VN')}đ`}</span>
                  </div>
                  <div className="cart-summary__row cart-summary__row--total">
                    <span>Tổng cộng</span>
                    <span>{total.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>

                <p className="cart-summary__note">
                  Vận chuyển và các khoản thuế sẽ được tính khi thanh toán
                </p>

                <button
                  className={`cart-summary__checkout ${selectedIds.length === 0 ? 'cart-summary__checkout--disabled' : ''}`}
                  onClick={handleCheckout}
                  disabled={selectedIds.length === 0}
                >
                  🔒 THANH TOÁN
                </button>
              </div>
            </div>
          </div>

          {/* ── Suggested products ── */}
          {suggestedProducts.length > 0 && (
            <section className="cart-suggested">
              <h2 className="cart-suggested__title">BẠN CÓ THỂ THÍCH</h2>
              <div className="cart-suggested__grid">
                {suggestedProducts.map(p => (
                  <ProductCard key={p.productId || p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
      {confirmAction && (
        <div className="cart-confirm-overlay">
          <div className="cart-confirm-toast">
            <p className="cart-confirm-toast__msg">{confirmAction.message}</p>
            <div className="cart-confirm-toast__actions">
              <button className="cart-confirm-toast__btn cart-confirm-toast__btn--cancel" onClick={() => setConfirmAction(null)}>
                Hủy
              </button>
              <button className="cart-confirm-toast__btn cart-confirm-toast__btn--confirm" onClick={handleExecuteConfirm}>
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
