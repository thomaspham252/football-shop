import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { ChevronRight, Truck, ShoppingBag, Headphones, CheckCircle, Package, Clock, CreditCard, BadgeCheck } from 'lucide-react';
import './OrderDetailPage.css';

/* ── Mock order ── */
const ORDER = {
  id: 'DH-99281',
  date: '14 Tháng 10, 2024',
  status: 'transit',
  statusLabel: 'Đang giao',
  steps: [
    { key: 'placed',     label: 'Đã đặt hàng',  done: true  },
    { key: 'processing', label: 'Đang xử lý',   done: true  },
    { key: 'transit',    label: 'Đang giao',     done: true, active: true },
    { key: 'done',       label: 'Hoàn thành',   done: false },
  ],
  items: [
    {
      id: 1,
      name: 'Giày Đá Bóng Nike Mercurial Vapor 16 Elite FG',
      size: '42',
      color: 'Vàng/Đen',
      qty: 1,
      price: 5800000,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&q=80',
    },
    {
      id: 2,
      name: 'Áo Đấu Nike Dri-FIT Academy 23',
      size: 'L',
      color: 'Đỏ/Trắng',
      qty: 2,
      price: 650000,
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=120&q=80',
    },
  ],
  shipping: {
    name: 'Nguyễn Văn A',
    phone: '0901 234 567',
    address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
  },
  payment: {
    method: 'Visa **** 4242',
    status: 'Đã thanh toán',
  },
  subtotal: 7100000,
  shippingFee: 0,
  discount: 0,
};

const STEP_ICON = {
  placed:     <CheckCircle size={18} />,
  processing: <Clock size={18} />,
  transit:    <Truck size={18} />,
  done:       <Package size={18} />,
};

export default function OrderDetailPage() {
  const total = ORDER.subtotal - ORDER.discount + ORDER.shippingFee;
  const activeIdx = ORDER.steps.findIndex(s => s.active);

  return (
    <div className="od-page">
      <Navbar />

      <main className="od-main">
        <div className="od-container">

          {/* Breadcrumb */}
          <div className="od-breadcrumb">
            <a href="/">Trang chủ</a>
            <ChevronRight size={13} />
            <a href="/tai-khoan">Lịch sử đơn hàng</a>
            <ChevronRight size={13} />
            <span>Chi tiết đơn hàng #{ORDER.id}</span>
          </div>

          {/* Header card */}
          <div className="od-header-card">
            <div className="od-header-card__left">
              <h1 className="od-header-card__title">Chi tiết đơn hàng</h1>
              <p className="od-header-card__meta">
                Mã đơn hàng: <strong>#{ORDER.id}</strong>
                <span className="od-header-card__dot">•</span>
                Ngày đặt: {ORDER.date}
              </p>
            </div>
            <span className={`od-status od-status--${ORDER.status}`}>
              <Truck size={14} />
              {ORDER.statusLabel}
            </span>
          </div>

          {/* Progress tracker */}
          <div className="od-progress-card">
            <div className="od-progress">
              {ORDER.steps.map((step, i) => (
                <div key={step.key} className="od-progress__step">
                  {/* Connector line before */}
                  {i > 0 && (
                    <div className={`od-progress__line ${ORDER.steps[i - 1].done ? 'od-progress__line--done' : ''}`} />
                  )}
                  <div className={`od-progress__circle
                    ${step.done ? 'od-progress__circle--done' : ''}
                    ${step.active ? 'od-progress__circle--active' : ''}
                  `}>
                    {STEP_ICON[step.key]}
                  </div>
                  <p className={`od-progress__label ${step.active ? 'od-progress__label--active' : ''} ${step.done ? 'od-progress__label--done' : ''}`}>
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Body: 2 columns */}
          <div className="od-body">
            {/* Left: products + actions */}
            <div className="od-left">
              <div className="od-products-card">
                <h2 className="od-section-title">Danh sách sản phẩm</h2>
                <div className="od-products">
                  {ORDER.items.map(item => (
                    <div key={item.id} className="od-product-row">
                      <img src={item.image} alt={item.name} className="od-product-row__img" />
                      <div className="od-product-row__info">
                        <p className="od-product-row__name">{item.name}</p>
                        <p className="od-product-row__meta">Size: {item.size}</p>
                        <p className="od-product-row__meta">Số lượng: {item.qty}</p>
                      </div>
                      <p className="od-product-row__price">
                        {(item.price * item.qty).toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="od-actions">
                  <button className="od-btn od-btn--primary">
                    <ShoppingBag size={15} /> Mua lại
                  </button>
                  <button className="od-btn od-btn--outline">
                    <Truck size={15} /> Theo dõi đơn hàng
                  </button>
                  <button className="od-btn od-btn--outline">
                    <Headphones size={15} /> Liên hệ hỗ trợ
                  </button>
                </div>
              </div>
            </div>

            {/* Right: shipping + payment + totals */}
            <div className="od-right">
              {/* Shipping */}
              <div className="od-info-card">
                <div className="od-info-card__head">
                  <Truck size={16} className="od-info-card__icon" />
                  <h3>THÔNG TIN GIAO HÀNG</h3>
                </div>
                <p className="od-info-card__name">{ORDER.shipping.name}</p>
                <p className="od-info-card__line">{ORDER.shipping.phone}</p>
                <p className="od-info-card__line">{ORDER.shipping.address}</p>
              </div>

              {/* Payment */}
              <div className="od-info-card">
                <div className="od-info-card__head">
                  <CreditCard size={16} className="od-info-card__icon" />
                  <h3>THANH TOÁN</h3>
                </div>
                <div className="od-info-card__payment-row">
                  <CreditCard size={14} />
                  <span>{ORDER.payment.method}</span>
                </div>
                <div className="od-info-card__payment-row od-info-card__payment-row--success">
                  <BadgeCheck size={14} />
                  <span>{ORDER.payment.status}</span>
                </div>
              </div>

              {/* Totals */}
              <div className="od-totals-card">
                <h3 className="od-totals-card__title">Tổng cộng</h3>
                <div className="od-totals">
                  <div className="od-totals__row">
                    <span>Tạm tính</span>
                    <span>{ORDER.subtotal.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="od-totals__row">
                    <span>Phí vận chuyển</span>
                    <span className="od-totals__free">
                      {ORDER.shippingFee === 0 ? 'Miễn phí' : `${ORDER.shippingFee.toLocaleString('vi-VN')}đ`}
                    </span>
                  </div>
                  <div className="od-totals__row">
                    <span>Giảm giá</span>
                    <span className="od-totals__discount">-{ORDER.discount.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="od-totals__row od-totals__row--total">
                    <span>Thành tiền</span>
                    <span>{total.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
