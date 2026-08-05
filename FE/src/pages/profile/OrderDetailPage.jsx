import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import orderApi from '../../api/orderApi';
import { ChevronRight, Truck, ShoppingBag, Headphones, CheckCircle, Package, Clock, CreditCard, BadgeCheck, X } from 'lucide-react';
import './OrderDetailPage.css';

const STEP_ICON = {
  placed:     <CheckCircle size={18} />,
  processing: <Clock size={18} />,
  transit:    <Truck size={18} />,
  done:       <Package size={18} />,
  cancelled:  <X size={18} />,
};

const mapStatus = (backendStatus) => {
  const status = (backendStatus || '').toUpperCase();
  if (status === 'PENDING') return 'pending';
  if (status === 'PROCESSING' || status === 'SHIPPING' || status === 'TRANSIT') return 'transit';
  if (status === 'DELIVERED') return 'delivered';
  if (status === 'CANCELLED') return 'cancelled';
  return 'pending';
};

const mapStatusLabel = (backendStatus) => {
  const status = (backendStatus || '').toUpperCase();
  if (status === 'PENDING') return 'Chờ xử lý';
  if (status === 'PROCESSING') return 'Đang xử lý';
  if (status === 'SHIPPING' || status === 'TRANSIT') return 'Đang giao hàng';
  if (status === 'DELIVERED') return 'Đã giao hàng';
  if (status === 'CANCELLED') return 'Đã hủy';
  return backendStatus;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day} Tháng ${month}, ${year}`;
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    orderApi.getOrder(id)
      .then(res => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi tải chi tiết đơn hàng:", err);
        setError("Không tìm thấy đơn hàng hoặc bạn không có quyền truy cập đơn hàng này.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="od-page">
        <Navbar />
        <main className="od-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div style={{ fontSize: '18px', fontWeight: '500', color: '#666' }}>Đang tải chi tiết đơn hàng...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="od-page">
        <Navbar />
        <main className="od-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#d32f2f', fontSize: '18px', fontWeight: '500', marginBottom: '15px' }}>{error || 'Đã có lỗi xảy ra.'}</p>
            <a href="/tai-khoan" style={{ color: '#0d47a1', textDecoration: 'underline' }}>Quay lại tài khoản của tôi</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const statusKey = mapStatus(order.orderStatus);
  const statusLabel = mapStatusLabel(order.orderStatus);
  
  // Create steps dynamically
  let steps = [];
  if (order.orderStatus === 'CANCELLED') {
    steps = [
      { key: 'placed',     label: 'Đã đặt hàng',  done: true  },
      { key: 'cancelled',  label: 'Đã hủy đơn hàng', done: true, active: true }
    ];
  } else {
    steps = [
      { key: 'placed',     label: 'Đã đặt hàng',  done: true, active: order.orderStatus === 'PENDING' },
      { key: 'processing', label: 'Đang xử lý',   done: order.orderStatus !== 'PENDING', active: order.orderStatus === 'PROCESSING' },
      { key: 'transit',    label: 'Đang giao',     done: (order.orderStatus === 'SHIPPING' || order.orderStatus === 'TRANSIT' || order.orderStatus === 'DELIVERED'), active: (order.orderStatus === 'SHIPPING' || order.orderStatus === 'TRANSIT') },
      { key: 'done',       label: 'Hoàn thành',   done: order.orderStatus === 'DELIVERED', active: order.orderStatus === 'DELIVERED' },
    ];
  }

  const shippingName = `${order.firstName || ''} ${order.lastName || ''}`.trim() || 'Người nhận';
  const shippingAddress = [order.street, order.ward, order.district, order.province].filter(Boolean).join(', ');

  const paymentMethodLabel = order.paymentMethod === 'MOMO' ? 'Momo'
                           : order.paymentMethod === 'TRANSFER' ? 'Chuyển khoản ngân hàng'
                           : 'Thanh toán khi nhận hàng (COD)';
                           
  const paymentStatusLabel = order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán';

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
            <span>Chi tiết đơn hàng #{order.orderCode}</span>
          </div>

          {/* Header card */}
          <div className="od-header-card">
            <div className="od-header-card__left">
              <h1 className="od-header-card__title">Chi tiết đơn hàng</h1>
              <p className="od-header-card__meta">
                Mã đơn hàng: <strong>#{order.orderCode}</strong>
                <span className="od-header-card__dot">•</span>
                Ngày đặt: {formatDate(order.createdAt)}
              </p>
            </div>
            <span className={`od-status od-status--${statusKey}`}>
              {statusKey === 'transit'   && <Truck size={14} />}
              {statusKey === 'delivered' && <CheckCircle size={14} />}
              {statusKey === 'cancelled' && <X size={14} />}
              {statusKey === 'pending'   && <Package size={14} />}
              {statusLabel}
            </span>
          </div>

          {/* Progress tracker */}
          <div className="od-progress-card">
            <div className="od-progress">
              {steps.map((step, i) => (
                <div key={step.key} className="od-progress__step">
                  {/* Connector line before */}
                  {i > 0 && (
                    <div className={`od-progress__line ${steps[i - 1].done ? 'od-progress__line--done' : ''}`} />
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
                  {order.items?.map(item => {
                    const img = item.productVariant?.imageUrl || item.product?.imageUrl;
                    const name = item.product?.productName || 'Sản phẩm';
                    return (
                      <div key={item.orderItemId} className="od-product-row">
                        {img && <img src={img} alt={name} className="od-product-row__img" />}
                        <div className="od-product-row__info">
                          <p className="od-product-row__name">{name}</p>
                          <p className="od-product-row__meta">Size: {item.size || 'N/A'}{item.color && `, Màu: ${item.color}`}</p>
                          <p className="od-product-row__meta">Số lượng: {item.quantity}</p>
                        </div>
                        <p className="od-product-row__price">
                          {((item.price || 0) * item.quantity).toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="od-actions">
                  {statusKey === 'delivered' && (
                    <button className="od-btn od-btn--primary">
                      <ShoppingBag size={15} /> Mua lại
                    </button>
                  )}
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
                <p className="od-info-card__name">{shippingName}</p>
                <p className="od-info-card__line">{order.phone}</p>
                <p className="od-info-card__line">{shippingAddress}</p>
              </div>

              {/* Payment */}
              <div className="od-info-card">
                <div className="od-info-card__head">
                  <CreditCard size={16} className="od-info-card__icon" />
                  <h3>THANH TOÁN</h3>
                </div>
                <div className="od-info-card__payment-row">
                  <CreditCard size={14} />
                  <span>{paymentMethodLabel}</span>
                </div>
                <div className={`od-info-card__payment-row ${order.paymentStatus === 'PAID' ? 'od-info-card__payment-row--success' : ''}`}>
                  <BadgeCheck size={14} />
                  <span>{paymentStatusLabel}</span>
                </div>
              </div>

              {/* Totals */}
              <div className="od-totals-card">
                <h3 className="od-totals-card__title">Tổng cộng</h3>
                <div className="od-totals">
                  <div className="od-totals__row">
                    <span>Tạm tính</span>
                    <span>{(order.subtotal || 0).toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="od-totals__row">
                    <span>Phí vận chuyển</span>
                    <span className="od-totals__free">
                      {(order.shippingFee === 0 || !order.shippingFee) ? 'Miễn phí' : `${order.shippingFee.toLocaleString('vi-VN')}đ`}
                    </span>
                  </div>
                  <div className="od-totals__row">
                    <span>Giảm giá</span>
                    <span className="od-totals__discount">-{((order.discountAmount || 0)).toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="od-totals__row od-totals__row--total">
                    <span>Thành tiền</span>
                    <span>{(order.totalAmount || 0).toLocaleString('vi-VN')}đ</span>
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
