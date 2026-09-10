import { useState, useEffect } from 'react';
import { Check, Truck, MapPin, BarChart2, ShoppingCart, CreditCard, X } from 'lucide-react';
import orderApi from '../../api/orderApi';
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
  const query = new URLSearchParams(window.location.search);
  const orderId = query.get('orderId');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let activeId = orderId;
    if (!activeId) {
      activeId = localStorage.getItem('latestOrderId');
    }

    if (!activeId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    orderApi.getOrder(activeId)
      .then(res => {
        setOrder(res.data);
      })
      .catch(err => {
        console.error("Lỗi khi lấy thông tin đơn hàng:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderId]);

  useEffect(() => {
    if (!order || order.paymentStatus === 'PAID' || order.paymentMethod !== 'TRANSFER') return;

    const interval = setInterval(() => {
      orderApi.getOrder(order.orderId)
        .then(res => {
          if (res.data.paymentStatus === 'PAID') {
            setOrder(res.data);
            clearInterval(interval);
          }
        })
        .catch(err => console.error("Lỗi khi cập nhật trạng thái đơn hàng:", err));
    }, 3000);

    return () => clearInterval(interval);
  }, [order]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'var(--sans)' }}>
        <p>Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  const activeOrder = order ? {
    code: order.orderCode,
    date: new Date(order.createdAt).toLocaleDateString('vi-VN'),
    deliveryFrom: new Date(new Date(order.createdAt).getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
    deliveryTo: new Date(new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
    shippingMethod: 'Vận chuyển tận nơi (Giao hàng từ 2–5 ngày làm việc)',
    address: {
      name: (order.firstName + " " + order.lastName).trim() || 'Khách hàng',
      street: order.street,
      ward: order.ward,
      district: order.district,
      province: order.province,
      country: 'Việt Nam',
    },
    items: order.items ? order.items.map(item => ({
      id: item.orderItemId,
      name: item.product.productName,
      variant: `Màu ${item.color} | Size ${item.size}`,
      quantity: item.quantity,
      price: Number(item.price),
      image: item.productVariant.imageUrl || item.product.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&q=80'
    })) : [],
    shipping: Number(order.shippingFee),
    tax: Math.round(Number(order.totalAmount) * 0.1),
    paymentMethod: order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng',
    rawPaymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    totalAmount: Number(order.totalAmount)
  } : ORDER;

  const subtotal = activeOrder.items.reduce((s, i) => s + i.price * (i.quantity ?? i.qty ?? 1), 0);
  const total    = activeOrder.totalAmount ? activeOrder.totalAmount : subtotal + activeOrder.shipping + (activeOrder.tax || 0);

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
          <h1 className="os-hero__title">
            {activeOrder.paymentStatus === 'PAID' ? 'Thanh toán thành công!' : 'Cảm ơn bạn đã mua hàng!'}
          </h1>
          <p className="os-hero__sub">
            Đơn hàng <strong>#{activeOrder.code}</strong> đang được xử lý và sẽ sớm đến tay bạn.
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
                {activeOrder.deliveryFrom} – {activeOrder.deliveryTo}
              </p>
              <p className="os-delivery__method">{activeOrder.shippingMethod}</p>
            </div>

            {/* Address */}
            <div className="os-card">
              <div className="os-card__head">
                <MapPin size={18} className="os-card__icon" />
                <span>Địa Chỉ Giao Hàng</span>
              </div>
              <p className="os-address__name">{activeOrder.address.name}</p>
              <p className="os-address__line">{activeOrder.address.street}</p>
              <p className="os-address__line">{activeOrder.address.ward}, {activeOrder.address.district}</p>
              <p className="os-address__line">{activeOrder.address.province}</p>
              <p className="os-address__line">{activeOrder.address.country}</p>
            </div>

            {/* Chuyển khoản ngân hàng - Hộp thông tin hướng dẫn khách chuyển tiền */}
            {activeOrder.rawPaymentMethod === 'TRANSFER' && (
              <div className="os-card" style={{ border: '1.5px solid var(--accent)', background: '#fdfaf2' }}>
                <div className="os-card__head" style={{ color: '#b8860b' }}>
                  <CreditCard size={18} className="os-card__icon" />
                  <span style={{ fontWeight: '700' }}>Thông Tin Chuyển Khoản</span>
                </div>
                {activeOrder.paymentStatus === 'PAID' ? (
                  <div style={{ marginTop: '16px', padding: '12px', background: '#d4edda', color: '#155724', borderRadius: '6px', border: '1px solid #c3e6cb', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={20} />
                    <strong>Hệ thống đã ghi nhận thanh toán thành công. Đơn hàng của bạn đang được chuẩn bị!</strong>
                  </div>
                ) : (
                  <div style={{ marginTop: '12px', fontSize: '13px', lineHeight: '1.6', color: '#333' }}>
                    <p>Ngân hàng: <strong>BIDV</strong></p>
                  <p>Số tài khoản: <strong>0000000001</strong></p>
                  <p>Chủ tài khoản: <strong>PHAM VAN LINH</strong></p>
                  <p>Số tiền: <strong>{total.toLocaleString('vi-VN')}đ</strong></p>
                  <p>Nội dung chuyển khoản: <strong>{activeOrder.code}</strong></p>
                  
                  {/* VietQR Code Section */}
                  <div style={{ 
                    marginTop: '16px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    background: '#ffffff',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <img 
                      src={`https://img.vietqr.io/image/BIDV-0000000001-compact2.png?amount=${Math.round(total)}&addInfo=${activeOrder.code}&accountName=PHAM%20VAN%20LINH`} 
                      alt="Mã QR Chuyển Khoản VietQR" 
                      style={{ maxWidth: '220px', display: 'block', borderRadius: '4px' }}
                    />
                    <p style={{ fontSize: '11px', color: '#666', marginTop: '8px', textAlign: 'center', fontStyle: 'italic' }}>
                      Quét mã QR bằng ứng dụng ngân hàng để tự động điền Số tài khoản, Số tiền và Nội dung.
                    </p>
                  </div>
                  <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#856404', fontSize: '13px' }}>
                    <span className="spinner-pulse" style={{ width: 10, height: 10, background: '#856404', borderRadius: '50%', display: 'inline-block' }}></span>
                    <em>Hệ thống đang tự động chờ nhận thanh toán... Không cần tải lại trang.</em>
                  </div>
                </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="os-actions">
              <a href={`/don-hang/${order?.orderId || orderId || localStorage.getItem('latestOrderId')}`} className="os-btn os-btn--primary">
                <BarChart2 size={16} />
                Xem Chi Tiết Đơn Hàng
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
                {activeOrder.items.map(item => (
                  <div key={item.id} className="os-summary__item">
                    <img src={item.image} alt={item.name} className="os-summary__img" />
                    <div className="os-summary__item-info">
                      <p className="os-summary__item-name">{item.name}</p>
                      <p className="os-summary__item-variant">{item.variant}</p>
                      <p className="os-summary__item-qty">Số lượng: {item.quantity ?? item.qty ?? 1}</p>
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
                  <span className={activeOrder.shipping === 0 ? "os-summary__free" : ""}>
                    {activeOrder.shipping === 0 ? "MIỄN PHÍ" : `${activeOrder.shipping.toLocaleString('vi-VN')}đ`}
                  </span>
                </div>
                <div className="os-summary__row">
                  <span>Thuế VAT (10%)</span>
                  <span>{activeOrder.tax.toLocaleString('vi-VN')}đ</span>
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
                <span>Phương thức thanh toán: {activeOrder.paymentMethod}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
