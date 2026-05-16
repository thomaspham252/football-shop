import { useState } from 'react';
import { Truck, CheckCircle, X, Package } from 'lucide-react';
import { ORDERS } from '../data/profileData';

const TABS = [
  { key: 'all',       label: 'Tất cả' },
  { key: 'pending',   label: 'Đang xử lý' },
  { key: 'transit',   label: 'Đang giao' },
  { key: 'delivered', label: 'Đã giao' },
  { key: 'cancelled', label: 'Đã hủy' },
];

export default function OrderHistory() {
  const [tab,    setTab]    = useState('all');
  const [search, setSearch] = useState('');

  const filtered = ORDERS.filter(o => {
    const matchTab    = tab === 'all' || o.status === tab;
    const matchSearch = !search
      || o.id.toLowerCase().includes(search.toLowerCase())
      || o.product.name.toLowerCase().includes(search.toLowerCase());
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
            placeholder="Tìm theo mã đơn hàng..."
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
        ) : filtered.map(o => (
          <div key={o.id} className="oh-card">
            <div className="oh-card__head">
              <div className="oh-card__head-left">
                <span className="oh-card__id">#{o.id}</span>
                <span className="oh-card__dot">•</span>
                <span className="oh-card__date">{o.date}</span>
              </div>
              <span className={`oh-card__status oh-card__status--${o.status}`}>
                {o.status === 'transit'   && <Truck size={13} />}
                {o.status === 'delivered' && <CheckCircle size={13} />}
                {o.status === 'cancelled' && <X size={13} />}
                {o.status === 'pending'   && <Package size={13} />}
                {o.statusLabel}
              </span>
            </div>

            <div className="oh-card__body">
              <div className="oh-card__product">
                <img src={o.product.image} alt={o.product.name} className="oh-card__img" />
                <div className="oh-card__product-info">
                  <p className="oh-card__product-name">{o.product.name}</p>
                  <p className="oh-card__product-qty">
                    Số lượng: {o.product.qty} sản phẩm
                    {o.product.extra && ` (và ${o.product.extra})`}
                  </p>
                  {o.product.note && (
                    <p className={`oh-card__product-note ${o.status === 'transit' ? 'oh-card__product-note--transit' : ''}`}>
                      {o.product.note}
                    </p>
                  )}
                </div>
              </div>

              <div className="oh-card__right">
                <p className="oh-card__total-label">TỔNG CỘNG</p>
                <p className="oh-card__total">{o.total.toLocaleString('vi-VN')}đ</p>
                <div className="oh-card__actions">
                  {o.status === 'delivered' && (
                    <button className="oh-btn oh-btn--primary">Mua lại</button>
                  )}
                  {o.status === 'cancelled' && (
                    <button className="oh-btn oh-btn--outline">Xem lý do hủy</button>
                  )}
                  {o.status !== 'cancelled' && (
                    <a href={`/don-hang/${o.id}`} className="oh-btn oh-btn--outline">
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
        ))}
      </div>
    </div>
  );
}
