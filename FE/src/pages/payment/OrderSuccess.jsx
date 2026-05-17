import { Check, Truck, MapPin, BarChart2, ShoppingCart, CreditCard, X } from 'lucide-react';
import './OrderSuccess.css';

const ORDER = {
  code: '92837465',
  date: '16/05/2025',
  deliveryFrom: '19/05/2025',
  deliveryTo: '21/05/2025',
  shippingMethod: 'Giao Hàng Tiêu Chuẩn (3–5 ngày làm việc)',
  address: {
    name: 'Nguyễn Văn A',
    street: '123 Nguyễn Huệ',
    ward: 'Phường Bến Nghé',
    district: 'Quận 1',
    province: 'TP. Hồ Chí Minh',
    country: 'Việt Nam',
  },
  items: [
    {
      id: 1,
      name: 'Giày Thể Thao Chạy Bộ Nam Nike Pegasus Plus',
      variant: 'Size 42 | Đen/Trắng',
      qty: 1,
      price: 3989300,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&q=80',
    },
    {
      id: 2,
      name: 'Áo Ba Lỗ Thể Thao Chạy Bộ Nam On Running Pace Tank',
      variant: 'Xám Nhạt | L',
      qty: 1,
      price: 2355400,
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=120&q=80',
    },
  ],
  shipping: 0,
  tax: 469978,
  paymentMethod: 'Visa kết thúc bằng 4421',
};

export default function OrderSuccess() {
  const subtotal = ORDER.items.reduce((s, i) => s + i.price * i.qty, 0);
  const total    = subtotal + ORDER.shipping + ORDER.tax;

  return (
    <div className="os-page">
      {/* Header */}
      <header className="os-header">
        <div className="os-header__left">
          <a href="/" className="os-header__home" aria-label="Trang chủ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </a>
          <span className="os-header__title">Đơn Hàng Đã Xác Nhận</span>
        </div>
        <a href="/" className="os-header__close" aria-label="Đóng">
          <X size={20} />
        </a>
      </header>

      <main className="os-main">
        {/* Hero */}
        <div className="os-hero">
          <div className="os-hero__icon">
            <Check size={32} strokeWidth={3} />
          </div>
          <h1 className="os-hero__title">Cảm ơn bạn đã mua hàng!</h1>
          <p className="os-hero__sub">
            Đơn hàng <strong>#{ORDER.code}</strong> đang được xử lý và sẽ sớm đến tay bạn.
          </p>
        </div>

        {/* Body */}
        <div className="os-body">
          {/* Left */}
          <div className="os-left">
            {/* Delivery */}
            <div className="os-card">
              <div className="os-card__head">
                <Truck size={18} className="os-card__icon" />
                <span>Thời Gian Giao Hàng Dự Kiến</span>
              </div>
              <p className="os-delivery__dates">
                {ORDER.deliveryFrom} – {ORDER.deliveryTo}
              </p>
              <p className="os-delivery__method">{ORDER.shippingMethod}</p>
            </div>

            {/* Address */}
            <div className="os-card">
              <div className="os-card__head">
                <MapPin size={18} className="os-card__icon" />
                <span>Địa Chỉ Giao Hàng</span>
              </div>
              <p className="os-address__name">{ORDER.address.name}</p>
              <p className="os-address__line">{ORDER.address.street}</p>
              <p className="os-address__line">{ORDER.address.ward}, {ORDER.address.district}</p>
              <p className="os-address__line">{ORDER.address.province}</p>
              <p className="os-address__line">{ORDER.address.country}</p>
            </div>

            {/* Actions */}
            <div className="os-actions">
              <a href="/theo-doi-don-hang" className="os-btn os-btn--primary">
                <BarChart2 size={16} />
                Theo Dõi Đơn Hàng
              </a>
              <a href="/san-pham" className="os-btn os-btn--outline">
                <ShoppingCart size={16} />
                Tiếp Tục Mua Sắm
              </a>
            </div>
          </div>

          {/* Right: order summary */}
          <div className="os-right">
            <div className="os-summary">
              <h2 className="os-summary__title">Tóm Tắt Đơn Hàng</h2>

              <div className="os-summary__items">
                {ORDER.items.map(item => (
                  <div key={item.id} className="os-summary__item">
                    <img src={item.image} alt={item.name} className="os-summary__img" />
                    <div className="os-summary__item-info">
                      <p className="os-summary__item-name">{item.name}</p>
                      <p className="os-summary__item-variant">{item.variant}</p>
                      <p className="os-summary__item-qty">Số lượng: {item.qty}</p>
                    </div>
                    <span className="os-summary__item-price">
                      {item.price.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                ))}
              </div>

              <div className="os-summary__totals">
                <div className="os-summary__row">
                  <span>Tạm tính</span>
                  <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="os-summary__row">
                  <span>Vận chuyển</span>
                  <span className="os-summary__free">MIỄN PHÍ</span>
                </div>
                <div className="os-summary__row">
                  <span>Thuế VAT</span>
                  <span>{ORDER.tax.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="os-summary__row os-summary__row--total">
                  <span>Tổng Cộng</span>
                  <span className="os-summary__total-price">
                    {total.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              <div className="os-summary__payment">
                <CreditCard size={15} />
                <span>Phương thức thanh toán: {ORDER.paymentMethod}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
