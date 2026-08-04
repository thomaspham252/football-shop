import { useState, useEffect } from 'react';
import { useVietnamAddress } from '../../hooks/useVietnamAddress';
import { ChevronDown, ChevronUp, Info, Tag, Lock, Pencil } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import orderApi from '../../api/orderApi';
import './PaymentPage.css';


/* ── Mock order (thực tế sẽ lấy từ cart state/context) ── */
// ORDER_ITEMS mock removed in favor of useCart()

const PAYMENT_METHODS = [
  {
    id: 'cod',
    label: 'Thanh toán khi nhận hàng (COD)',
  },
  {
    id: 'transfer',
    label: 'Chuyển khoản ngân hàng',
  },
  {
    id: 'momo',
    label: 'Ví MoMo',
  }
];

export default function PaymentPage() {
  const { toast } = useToast();
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

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const u = JSON.parse(userJson);
        if (u) {
          if (u.email) setEmail(u.email);
          if (u.fullName) {
            const parts = u.fullName.trim().split(/\s+/);
            if (parts.length > 1) {
              setLastName(parts[0]);
              setFirstName(parts.slice(1).join(' '));
            } else {
              setFirstName(u.fullName);
            }
          }
          if (u.phone) setPhone(u.phone);
          if (u.address) setStreet(u.address);
        }
      } catch (e) {
        console.error("Lỗi khi giải mã user từ localStorage:", e);
      }
    }
  }, []);

  const [email, setEmail]               = useState('');
  const [sendLink, setSendLink]         = useState(true);
  const [firstName, setFirstName]       = useState('');
  const [lastName, setLastName]         = useState('');
  const [phone, setPhone]               = useState('');
  const [agree, setAgree]               = useState(true);
  const [payment, setPayment]           = useState('cod');
  const [billingSame, setBillingSame]   = useState(true);
  const [coupon, setCoupon]             = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState('');
  const [discount, setDiscount]           = useState(0);
  const [submitting, setSubmitting]       = useState(false);
  const [showOrderMobile, setShowOrderMobile] = useState(false);

  const [street, setStreet] = useState('');

  const {
    provinces, districts, wards,
    province, district, ward,
    provinceName, districtName, wardName,
    setProvince, setDistrict, setWard,
    loadingProvinces, loadingDistricts, loadingWards,
  } = useVietnamAddress();

  const subtotal     = checkoutItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingFee  = subtotal >= 500000 ? 0 : 40000;
  const remainingForFreeShip = 500000 - subtotal;
  const total        = subtotal + shippingFee - discount;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (checkoutItems.length === 0) {
      toast.warning("Đơn hàng thanh toán của bạn đang trống!");
      return;
    }
    if (!email.trim() || !firstName.trim() || !lastName.trim() || !phone.trim() || !street.trim() || !provinceName || !districtName || !wardName) {
      toast.warning("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }
    if (payment === 'cod' && total > 5000000) {
      toast.warning("Đơn hàng trên 5 triệu không áp dụng hình thức COD. Vui lòng chọn phương thức thanh toán khác!");
      return;
    }
    
    setSubmitting(true);
    try {
      const userJson = localStorage.getItem('user');
      let userId = null;
      if (userJson) {
        try {
          userId = JSON.parse(userJson).id;
        } catch (e) {
          console.error(e);
        }
      }

      const orderData = {
        items: checkoutItems.map(i => ({ variantId: i.id, qty: i.qty })),
        userId: userId,
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        province: provinceName,
        district: districtName,
        ward: wardName,
        street: street,
        paymentMethod: payment.toUpperCase(),
        couponCode: couponApplied ? coupon : null
      };

      const orderRes = await orderApi.createOrder(orderData);
      const createdOrder = orderRes.data;

      const purchasedIds = checkoutItems.map(item => item.id);
      removeItems(purchasedIds);
      localStorage.removeItem('checkoutItems');
      localStorage.setItem('shippingAddress', JSON.stringify({
        province, provinceName,
        district, districtName,
        ward, wardName,
        street,
      }));
      localStorage.setItem('latestOrderId', createdOrder.orderId);

      const paymentRes = await orderApi.initiatePayment(createdOrder.orderId);
      
      if (payment === 'momo') {
        if (paymentRes.data && paymentRes.data.payUrl) {
          window.location.href = paymentRes.data.payUrl;
        } else {
          toast.warning("Không thể khởi tạo cổng thanh toán MoMo. Đang chuyển hướng về trang đơn hàng thành công.");
          window.location.href = `/dat-hang-thanh-cong?orderId=${createdOrder.orderId}`;
        }
      } else {
        window.location.href = `/dat-hang-thanh-cong?orderId=${createdOrder.orderId}`;
      }
    } catch (err) {
      console.error("Lỗi khi xử lý thanh toán:", err);
      const errMsg = err.response && err.response.data && err.response.data.error 
          ? err.response.data.error 
          : "Không thể xử lý đơn hàng. Vui lòng kiểm tra lại tồn kho hoặc thử lại sau.";
      toast.error("Lỗi: " + errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    try {
      const res = await orderApi.applyCoupon(coupon, subtotal);
      if (res.data.valid) {
        setCouponApplied(true);
        setDiscount(res.data.discountAmount);
        setCouponMessage("✓ Áp dụng mã giảm giá thành công!");
      } else {
        setCouponApplied(false);
        setDiscount(0);
        setCouponMessage("❌ " + res.data.message);
      }
    } catch (err) {
      setCouponApplied(false);
      setDiscount(0);
      if (err.response && err.response.status === 429) {
        setCouponMessage("❌ Quá nhiều yêu cầu thử mã. Vui lòng thử lại sau 1 phút.");
      } else {
        setCouponMessage("❌ Lỗi áp dụng mã giảm giá. Vui lòng thử lại sau.");
      }
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
        {couponMessage && (
          <p className="pay-summary__coupon-ok" style={{ color: couponApplied ? '#2e7d32' : 'var(--red)', marginTop: '8px', fontSize: '12.5px', fontWeight: '600' }}>
            {couponMessage}
          </p>
        )}
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
            </div>

            <div className="pay-field-row">
              <div className="pay-field">
                <input type="text" placeholder="Họ " value={firstName}
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
            </div>

            <div className="pay-field pay-field--icon">
              <input type="tel" placeholder="Điện thoại" value={phone}
                onChange={e => setPhone(e.target.value)} className="pay-input" />
              <Info size={16} className="pay-field__icon" />
            </div>



            <label className="pay-checkbox" style={{ marginTop: 12 }}>
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
              <span>Nhấn vào ô này đồng nghĩa với việc đồng ý với các thông tin và điều khoản thanh toán</span>
            </label>
          </section>

          {/* Phương thức vận chuyển */}
          <section className="pay-section">
            <h2 className="pay-section__title">Phương thức vận chuyển</h2>
            <div style={{
              background: '#ffffff',
              border: '1.5px solid var(--border)',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
              fontFamily: 'var(--sans)'
            }}>
              <div>
                <p style={{ fontWeight: '600', color: '#1a1a2e', margin: 0 }}>Vận chuyển tận nơi</p>
                <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>Giao hàng từ 2–5 ngày làm việc</p>
              </div>
              <div>
                {subtotal >= 500000 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '13px' }}>40.000đ</span>
                    <span style={{ color: '#2e7d32', fontWeight: '700' }}>MIỄN PHÍ</span>
                  </div>
                ) : (
                  <span style={{ fontWeight: '700', color: '#1a1a2e' }}>40.000đ</span>
                )}
              </div>
            </div>

            {subtotal < 500000 && (
              <p style={{
                fontSize: '12.5px',
                color: 'var(--accent-hover)',
                fontWeight: '600',
                marginTop: '10px',
                background: '#fdf7e7',
                border: '1px solid #fce8bd',
                padding: '10px 14px',
                borderRadius: '6px'
              }}>
                💡 Mua thêm <strong>{remainingForFreeShip.toLocaleString('vi-VN')}đ</strong> để được MIỄN PHÍ vận chuyển!
              </p>
            )}
          </section>

          {/* Thanh toán */}
          <section className="pay-section">
            <h2 className="pay-section__title">Thanh toán</h2>
            <p className="pay-section__desc">Toàn bộ các giao dịch được bảo mật và mã hóa.</p>
            <div className="pay-options">
              {PAYMENT_METHODS.map((m, i) => {
                const isCodBlocked = m.id === 'cod' && total > 5000000;
                return (
                  <label
                    key={m.id}
                    className={`pay-option ${payment === m.id ? 'pay-option--active' : ''} ${i === 0 ? 'pay-option--first' : ''} ${i === PAYMENT_METHODS.length - 1 ? 'pay-option--last' : ''} ${isCodBlocked ? 'pay-option--blocked' : ''}`}
                    style={isCodBlocked ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={payment === m.id}
                      disabled={isCodBlocked}
                      onChange={() => setPayment(m.id)}
                    />
                    <span className="pay-option__label" style={{ display: 'flex', alignItems: 'center' }}>
                      {m.label}
                      {m.id === 'momo' && (
                        <span style={{
                          background: '#a50064',
                          color: '#fff',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          marginLeft: '8px'
                        }}>
                          MoMo
                        </span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>

            {payment === 'cod' && total > 5000000 && (
              <p className="pay-payment-desc" style={{ color: 'var(--red)', fontWeight: '600', marginTop: '10px' }}>
                ⚠️ Đơn hàng trên 5.000.000đ không áp dụng hình thức COD. Vui lòng chọn phương thức thanh toán trả trước (Chuyển khoản hoặc MoMo).
              </p>
            )}

            {payment === 'transfer' && (
              <div className="pay-bank-details" style={{
                background: '#f8f9fa',
                border: '1.5px solid var(--border)',
                borderRadius: '6px',
                padding: '16px',
                marginTop: '12px',
                fontSize: '13.5px',
                lineHeight: '1.6'
              }}>
                <p style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '8px', fontSize: '14px' }}>
                  Thông tin chuyển khoản ngân hàng:
                </p>
                <p>Ngân hàng: <strong>MB Bank (Ngân hàng Quân Đội)</strong></p>
                <p>Số tài khoản: <strong>25022004042000</strong></p>
                <p>Chủ tài khoản: <strong>PHAM VAN LINH</strong></p>
                <p>Số tiền: <strong>{total.toLocaleString('vi-VN')}đ</strong></p>
                <p>Cú pháp chuyển khoản: <strong>[Mã đơn hàng của bạn]</strong></p>
                <p style={{ fontSize: '11px', color: '#666', marginTop: '8px', fontStyle: 'italic' }}>
                  * Mã đơn hàng chính thức và mã QR quét nhanh chuyển khoản sẽ được cung cấp ở trang tiếp theo sau khi đặt hàng thành công.
                </p>
              </div>
            )}

            {payment === 'momo' && (
              <p className="pay-payment-desc" style={{ color: '#a50064', fontWeight: '600', marginTop: '10px' }}>
                ✓ Bạn sẽ được chuyển hướng đến cổng thanh toán MoMo để quét mã QR hoàn tất đơn hàng.
              </p>
            )}
          </section>


          {/* Submit */}
          <button className="pay-submit" onClick={handleCheckout} disabled={submitting}>
            <Lock size={15} />
            {submitting ? 'Đang xử lý...' : 'Thanh toán ngay'}
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
