import { useState } from 'react';
import { Truck, CheckCircle, X, Package } from 'lucide-react';

const TABS = [
  { key: 'all',       label: 'Tất cả' },
  { key: 'pending',   label: 'Đang xử lý' },
  { key: 'transit',   label: 'Đang giao' },
  { key: 'delivered', label: 'Đã giao' },
  { key: 'cancelled', label: 'Đã hủy' },
];

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

export default function OrderHistory({ orders = [] }) {
  const [tab,    setTab]    = useState('all');
  const [search, setSearch] = useState('');

  const filtered = orders.filter(o => {
    const statusKey = mapStatus(o.orderStatus);
    const matchTab    = tab === 'all' || statusKey === tab;
    
    const mainItem = o.items?.[0];
    const productName = mainItem?.product?.productName || '';
    
    const matchSearch = !search
      || o.orderCode.toLowerCase().includes(search.toLowerCase())
      || productName.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="oh-wrap">
      {/* Header */}
      <div className="oh-header">
        <div>
          <h2 className="oh-header__title">Lịch sử đơn hàng</h2>
          <p className="oh-header__sub">Xem và quản lý tất cả các đơn hàng của bạn tại Football Shop.</p>
        </div>
        <div className="oh-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Tìm theo mã đơn hàng hoặc tên sản phẩm..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="oh-tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`oh-tab ${tab === t.key ? 'oh-tab--active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Order cards */}
      <div className="oh-list">
        {filtered.length === 0 ? (
          <div className="oh-empty">
            <Package size={40} strokeWidth={1} />
            <p>Không tìm thấy đơn hàng nào</p>
          </div>
        ) : filtered.map(o => {
          const statusKey = mapStatus(o.orderStatus);
          const statusLabel = mapStatusLabel(o.orderStatus);
          const mainItem = o.items?.[0];
          const image = mainItem?.productVariant?.imageUrl || mainItem?.product?.imageUrl;
          const name = mainItem?.product?.productName || 'Sản phẩm';
          const qty = mainItem?.quantity || 1;
          const extraCount = (o.items?.length || 0) - 1;
          
          let paymentNote = o.paymentMethod === 'MOMO' ? 'Thanh toán qua Momo'
                          : o.paymentMethod === 'TRANSFER' ? 'Thanh toán Chuyển khoản'
                          : 'Thanh toán COD (Nhận hàng thanh toán)';
          
          if (o.paymentStatus === 'PAID') {
            paymentNote += ' - Đã thanh toán';
          } else {
            paymentNote += ' - Chưa thanh toán';
          }

          return (
            <div key={o.orderId} className="oh-card">
              <div className="oh-card__head">
                <div className="oh-card__head-left">
                  <span className="oh-card__id">#{o.orderCode}</span>
                  <span className="oh-card__dot">•</span>
                  <span className="oh-card__date">{formatDate(o.createdAt)}</span>
                </div>
                <span className={`oh-card__status oh-card__status--${statusKey}`}>
                  {statusKey === 'transit'   && <Truck size={13} />}
                  {statusKey === 'delivered' && <CheckCircle size={13} />}
                  {statusKey === 'cancelled' && <X size={13} />}
                  {statusKey === 'pending'   && <Package size={13} />}
                  {statusLabel}
                </span>
              </div>

              <div className="oh-card__body">
                <div className="oh-card__product">
                  {image && <img src={image} alt={name} className="oh-card__img" />}
                  <div className="oh-card__product-info">
                    <p className="oh-card__product-name">{name}</p>
                    <p className="oh-card__product-qty">
                      Số lượng: {qty} sản phẩm
                      {extraCount > 0 && ` (và ${extraCount} sản phẩm khác)`}
                    </p>
                    {paymentNote && (
                      <p className={`oh-card__product-note ${statusKey === 'transit' ? 'oh-card__product-note--transit' : ''}`}>
                        {paymentNote}
                      </p>
                    )}
                  </div>
                </div>

                <div className="oh-card__right">
                  <p className="oh-card__total-label">TỔNG CỘNG</p>
                  <p className="oh-card__total">{(o.totalAmount || 0).toLocaleString('vi-VN')}đ</p>
                  <div className="oh-card__actions">
                    {statusKey === 'delivered' && (
                      <button className="oh-btn oh-btn--primary">Mua lại</button>
                    )}
                    {statusKey === 'cancelled' && (
                      <button className="oh-btn oh-btn--outline">Xem lý do hủy</button>
                    )}
                    {statusKey !== 'cancelled' && (
                      <a href={`/don-hang/${o.orderId}`} className="oh-btn oh-btn--outline">
                        Chi tiết
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
