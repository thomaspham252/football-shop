import { useState, useEffect } from 'react';
import { useVietnamAddress } from '../../hooks/useVietnamAddress';
import { ChevronDown, ChevronUp, Info, Tag, Lock, Pencil } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './PaymentPage.css';

/* ── Đọc địa chỉ đã lưu từ giỏ hàng ── */
function getSavedAddress() {
  try {
    return JSON.parse(localStorage.getItem('shippingAddress') || '{}');
  } catch {
    return {};
  }
}

/* ── Mock order (thực tế sẽ lấy từ cart state/context) ── */
// ORDER_ITEMS mock removed in favor of useCart()

const SHIPPING_OPTIONS = [
  {
    id: 'freeship',
    label: 'Freeship · Giao hàng từ 3–8 ngày làm việc cho đơn từ 3.399.000đ',
    badge: 'MIỄN PHÍ',
    price: 0,
  },
  {
    id: 'standard',
    label: 'Giao Hàng Tiêu Chuẩn 2–7 ngày làm việc (từ 2kg đến <5kg)',
    price: 40000,
  },
  {
    id: 'grab',
    label: 'Giao Hàng Grab Hỏa Tốc (Chỉ áp dụng nội thành HCM) trước 16h ngày trong tuần',
    price: 200000,
  },
];

const PAYMENT_METHODS = [
  {
    id: 'onepay',
    label: 'OnePAY – Credit/ATM card/QR',
    desc: 'Bạn sẽ được chuyển hướng đến OnePAY – Credit/ATM card để hoàn tất quá trình mua hàng.',
    logos: ['VISA', 'MC', 'JCB'],
  },
  {
    id: 'zalopay',
    label: 'Thanh toán online qua cổng thanh toán ZaloPay',
    logos: ['MC', 'JCB', 'VISA'],
  },
  {
    id: 'cod',
    label: 'Thanh toán khi nhận hàng (COD)',
  },
  {
    id: 'transfer',
    label: 'Chuyển khoản',
  },
];

export default function PaymentPage() {
  const { removeItems } = useCart();
  const [checkoutItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('checkoutItems') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (checkoutItems.length === 0) {
      window.location.href = '/gio-hang';
    }
  }, [checkoutItems]);

  const [email, setEmail]               = useState('');
  const [sendLink, setSendLink]         = useState(true);
  const [firstName, setFirstName]       = useState('');
  const [lastName, setLastName]         = useState('');
  const [phone, setPhone]               = useState('');
  const [agree, setAgree]               = useState(true);
  const [shipping, setShipping]         = useState('freeship');
  const [payment, setPayment]           = useState('onepay');
  const [billingSame, setBillingSame]   = useState(true);
  const [coupon, setCoupon]             = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [showOrderMobile, setShowOrderMobile] = useState(false);

  /* Địa chỉ từ giỏ hàng */
  const saved = getSavedAddress();
  const [editingAddress, setEditingAddress] = useState(!saved.provinceName);
  const [street, setStreet] = useState(saved.street || '');

  const {
    provinces, districts, wards,
    province, district, ward,
    provinceName, districtName, wardName,
    setProvince, setDistrict, setWard,
    loadingProvinces, loadingDistricts, loadingWards,
  } = useVietnamAddress();

  const subtotal     = checkoutItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingFee  = SHIPPING_OPTIONS.find(o => o.id === shipping)?.price ?? 0;
  const discount     = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total        = subtotal + shippingFee - discount;

  const handleCheckout = (e) => {
    e.preventDefault();
    if (checkoutItems.length === 0) {
      alert("Đơn hàng thanh toán của bạn đang trống!");
      return;
    }
    const purchasedIds = checkoutItems.map(item => item.id);
    removeItems(purchasedIds);
    localStorage.removeItem('checkoutItems');
    localStorage.setItem('shippingAddress', JSON.stringify({
      province, provinceName,
      district, districtName,
      ward, wardName,
      street,
    }));
    window.location.href = '/dat-hang-thanh-cong';
  };

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'SALE10' || coupon.toUpperCase() === 'FREESHIP') {
      setCouponApplied(true);
    }
  };

  /* ── Order summary panel ── */
  const OrderSummary = () => (
    <div className="pay-summary">
      <div className="pay-summary__items">
        {checkoutItems.map(item => (
          <div key={item.id} className="pay-summary__item">
            <div className="pay-summary__img-wrap">
              <img src={item.image} alt={item.name} />
              <span className="pay-summary__qty">{item.qty}</span>
            </div>
            <div className="pay-summary__item-info">
              <p className="pay-summary__item-name">{item.name}</p>
              <p className="pay-summary__item-variant">{item.variant}</p>
            </div>
            <span className="pay-summary__item-price">
              {item.price.toLocaleString('vi-VN')}đ
            </span>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="pay-summary__coupon">
        <div className="pay-summary__coupon-row">
          <Tag size={14} />
          <input
            type="text"
            placeholder="Mã giảm giá hoặc thẻ quà tặng"
            value={coupon}
            onChange={e => setCoupon(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && applyCoupon()}
          />
          <button onClick={applyCoupon}>Áp dụng</button>
        </div>
        {couponApplied && <p className="pay-summary__coupon-ok">✓ Đã áp dụng giảm 10%</p>}
      </div>

      {/* Totals */}
      <div className="pay-summary__totals">
        <div className="pay-summary__row">
          <span>Tổng phụ · {checkoutItems.length} mặt hàng</span>
          <span>{subtotal.toLocaleString('vi-VN')}đ</span>
        </div>
        {couponApplied && (
          <div className="pay-summary__row pay-summary__row--discount">
            <span>Giảm giá (10%)</span>
            <span>-{discount.toLocaleString('vi-VN')}đ</span>
          </div>
        )}
        <div className="pay-summary__row">
          <span className="pay-summary__ship-label">
            Vận chuyển <Info size={12} />
          </span>
          <span className={shippingFee === 0 ? 'pay-summary__free' : ''}>
            {shippingFee === 0 ? 'MIỄN PHÍ' : `${shippingFee.toLocaleString('vi-VN')}đ`}
          </span>
        </div>
        <div className="pay-summary__row pay-summary__row--total">
          <span>Tổng</span>
          <div className="pay-summary__total-right">
            <span className="pay-summary__vat">Đã gồm 469.978đ tiền thuế</span>
            <span className="pay-summary__total-price">{total.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>
      </div>

      <div className="pay-summary__links">
        <a href="/chinh-sach/hoan-tien">Chính sách hoàn tiền</a>
        <a href="/van-chuyen">Vận chuyển</a>
        <a href="/chinh-sach/quyen-rieng-tu">Chính sách quyền riêng tư</a>
        <a href="/dieu-khoan">Điều khoản dịch vụ</a>
        <a href="/lien-he">Liên hệ</a>
      </div>
    </div>
  );

  return (
    <div className="pay-page">
      {/* Minimal header */}
      <div className="pay-header-wrap">
        <header className="pay-header">
          <a href="/" className="pay-header__logo">
            <span className="pay-header__logo-ultra">ULTRA</span>
            <span className="pay-header__logo-sport">SPORT</span>
          </a>
          <a href="/gio-hang" className="pay-header__cart-icon" aria-label="Giỏ hàng">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </a>
        </header>
      </div>

      {/* Mobile order toggle */}
      <button
        className="pay-mobile-order-toggle"
        onClick={() => setShowOrderMobile(!showOrderMobile)}
      >
        <span className="pay-mobile-order-toggle__left">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
          </svg>
          {showOrderMobile ? 'Ẩn' : 'Xem'} tóm tắt đơn hàng
          {showOrderMobile ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
        <span className="pay-mobile-order-toggle__price">{total.toLocaleString('vi-VN')}đ</span>
      </button>

      {showOrderMobile && (
        <div className="pay-mobile-order">
          <OrderSummary />
        </div>
      )}

      <div className="pay-layout">
        {/* ── LEFT: form ── */}
        <div className="pay-form-col">

          {/* Liên hệ */}
          <section className="pay-section">
            <h2 className="pay-section__title">Liên hệ</h2>
            <div className="pay-field">
              <input
                type="email"
                placeholder="Nhập địa chỉ email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="pay-input"
              />
            </div>
            <label className="pay-checkbox">
              <input type="checkbox" checked={sendLink} onChange={e => setSendLink(e.target.checked)} />
              <span>ULTRASPORT sẽ gửi LINK THEO DÕI ĐƠN HÀNG qua email</span>
            </label>
          </section>

          {/* Thông tin giao hàng */}
          <section className="pay-section">
            <div className="pay-section__title-row">
              <h2 className="pay-section__title">Thông Tin Giao Hàng</h2>
              {!editingAddress && saved.provinceName && (
                <button className="pay-address-edit-btn" onClick={() => setEditingAddress(true)}>
                  <Pencil size={13} /> Thay đổi
                </button>
              )}
            </div>

            {/* Chế độ xem: địa chỉ từ giỏ hàng */}
            {!editingAddress && saved.provinceName ? (
              <div className="pay-address-summary">
                <div className="pay-address-summary__icon">📍</div>
                <div className="pay-address-summary__info">
                  <p className="pay-address-summary__name">
                    {firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Chưa nhập tên'}
                  </p>
                  <p className="pay-address-summary__line">
                    {[saved.street, saved.wardName, saved.districtName, saved.provinceName]
                      .filter(Boolean).join(', ')}
                  </p>
                  {phone && <p className="pay-address-summary__phone">{phone}</p>}
                </div>
              </div>
            ) : (
              /* Chế độ chỉnh sửa */
              <>
                <div className="pay-field">
                  <select className="pay-select" defaultValue="VN">
                    <option value="VN">Việt Nam</option>
                  </select>
                </div>

                <div className="pay-field-row">
                  <div className="pay-field">
                    <input type="text" placeholder="Họ (Không bắt buộc)" value={firstName}
                      onChange={e => setFirstName(e.target.value)} className="pay-input" />
                  </div>
                  <div className="pay-field">
                    <input type="text" placeholder="Tên" value={lastName}
                      onChange={e => setLastName(e.target.value)} className="pay-input" />
                  </div>
                </div>

                <div className="pay-field">
                  <input type="text" placeholder="Số Nhà · Tên Đường" value={street}
                    onChange={e => setStreet(e.target.value)} className="pay-input" />
                </div>

                <div className="pay-field-row">
                  <div className="pay-field">
                    <select className="pay-select" value={ward} onChange={e => setWard(e.target.value)}
                      disabled={!district || loadingWards}>
                      <option value="">{loadingWards ? 'Đang tải...' : 'Xã Phường'}</option>
                      {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                    </select>
                  </div>
                  <div className="pay-field">
                    <select className="pay-select" value={district} onChange={e => setDistrict(e.target.value)}
                      disabled={!province || loadingDistricts}>
                      <option value="">{loadingDistricts ? 'Đang tải...' : 'Quận Huyện'}</option>
                      {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="pay-field-row">
                  <div className="pay-field">
                    <select className="pay-select" value={province} onChange={e => setProvince(e.target.value)}
                      disabled={loadingProvinces}>
                      <option value="">{loadingProvinces ? 'Đang tải...' : 'TỈNH/THÀNH PHỐ'}</option>
                      {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="pay-field">
                    <input type="text" placeholder="Mã bưu chính (không bắt buộc)" className="pay-input" />
                  </div>
                </div>

                <div className="pay-field pay-field--icon">
                  <input type="tel" placeholder="Điện thoại" value={phone}
                    onChange={e => setPhone(e.target.value)} className="pay-input" />
                  <Info size={16} className="pay-field__icon" />
                </div>

                {editingAddress && saved.provinceName && (
                  <button className="pay-address-cancel-btn" onClick={() => setEditingAddress(false)}>
                    ← Dùng lại địa chỉ từ giỏ hàng
                  </button>
                )}
              </>
            )}

            <label className="pay-checkbox" style={{ marginTop: 12 }}>
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
              <span>Nhấn vào ô này đồng nghĩa với việc đồng ý với các thông tin và điều khoản thanh toán</span>
            </label>
          </section>

          {/* Phương thức vận chuyển */}
          <section className="pay-section">
            <h2 className="pay-section__title">Phương thức vận chuyển</h2>
            <div className="pay-options">
              {SHIPPING_OPTIONS.map((opt, i) => (
                <label
                  key={opt.id}
                  className={`pay-option ${shipping === opt.id ? 'pay-option--active' : ''} ${i === 0 ? 'pay-option--first' : ''} ${i === SHIPPING_OPTIONS.length - 1 ? 'pay-option--last' : ''}`}
                >
                  <input type="radio" name="shipping" value={opt.id}
                    checked={shipping === opt.id} onChange={() => setShipping(opt.id)} />
                  <span className="pay-option__label">{opt.label}</span>
                  {opt.badge
                    ? <span className="pay-option__badge">{opt.badge}</span>
                    : <span className="pay-option__price">{opt.price.toLocaleString('vi-VN')}đ</span>
                  }
                </label>
              ))}
            </div>
          </section>

          {/* Thanh toán */}
          <section className="pay-section">
            <h2 className="pay-section__title">Thanh toán</h2>
            <p className="pay-section__desc">Toàn bộ các giao dịch được bảo mật và mã hóa.</p>
            <div className="pay-options">
              {PAYMENT_METHODS.map((m, i) => (
                <label
                  key={m.id}
                  className={`pay-option ${payment === m.id ? 'pay-option--active' : ''} ${i === 0 ? 'pay-option--first' : ''} ${i === PAYMENT_METHODS.length - 1 ? 'pay-option--last' : ''}`}
                >
                  <input type="radio" name="payment" value={m.id}
                    checked={payment === m.id} onChange={() => setPayment(m.id)} />
                  <span className="pay-option__label">{m.label}</span>
                  {m.logos && (
                    <span className="pay-option__logos">
                      {m.logos.map(l => (
                        <span key={l} className="pay-option__logo-badge">{l}</span>
                      ))}
                    </span>
                  )}
                </label>
              ))}
            </div>
            {payment === 'onepay' && (
              <p className="pay-payment-desc">
                Bạn sẽ được chuyển hướng đến OnePAY – Credit/ATM card để hoàn tất quá trình mua hàng.
              </p>
            )}
          </section>


          {/* Submit */}
          <button className="pay-submit" onClick={handleCheckout}>
            <Lock size={15} />
            Thanh toán ngay
          </button>
        </div>

        {/* ── RIGHT: order summary ── */}
        <div className="pay-summary-col">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
