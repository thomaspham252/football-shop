import { Pencil, Truck, CheckCircle, X, Package, Heart } from 'lucide-react';
import { USER, ORDERS, WISHLIST } from '../data/profileData';

const STATUS_ICON = {
  delivered: <CheckCircle size={14} />,
  transit:   <Truck size={14} />,
  cancelled: <X size={14} />,
  pending:   <Package size={14} />,
};

export default function Overview({ onNavigate }) {
  return (
    <div className="profile-overview">
      {/* Hero card */}
      <div className="profile-hero">
        <div className="profile-hero__avatar">
          {USER.avatar
            ? <img src={USER.avatar} alt={USER.name} />
            : <span>{USER.name.charAt(0)}</span>
          }
          <span className="profile-hero__avatar-badge">✓</span>
        </div>
        <div className="profile-hero__info">
          <h1 className="profile-hero__name">{USER.name}</h1>
          <p className="profile-hero__email">{USER.email}</p>
          <div className="profile-hero__tags">
            <span className="profile-hero__tag profile-hero__tag--member">⭐ Thành Viên</span>
            <span className="profile-hero__tag">Tham gia {USER.joinDate}</span>
          </div>
        </div>
        <div className="profile-hero__ball">⚽</div>
      </div>

      <div className="profile-overview__grid">
        {/* Recent orders */}
        <div className="profile-card">
          <div className="profile-card__head">
            <h2 className="profile-card__title">Đơn Hàng Gần Đây</h2>
            <button className="profile-card__link" onClick={() => onNavigate('orders')}>
              Xem tất cả
            </button>
          </div>
          <div className="profile-orders-list">
            {ORDERS.slice(0, 2).map(o => (
              <div key={o.id} className="profile-order-row">
                <div className={`profile-order-row__icon profile-order-row__icon--${o.status}`}>
                  {STATUS_ICON[o.status]}
                </div>
                <div className="profile-order-row__info">
                  <p className="profile-order-row__id">#{o.id}</p>
                  <p className="profile-order-row__date">{o.date}</p>
                </div>
                <div className="profile-order-row__right">
                  <p className="profile-order-row__price">{o.total.toLocaleString('vi-VN')}đ</p>
                  <span className={`profile-order-row__status profile-order-row__status--${o.status}`}>
                    {o.statusLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal details */}
        <div className="profile-card">
          <div className="profile-card__head">
            <h2 className="profile-card__title">Thông Tin Cá Nhân</h2>
            <button className="profile-card__link" onClick={() => onNavigate('info')}>
              <Pencil size={13} /> Chỉnh sửa
            </button>
          </div>
          <div className="profile-details">
            <div className="profile-details__row">
              <div>
                <p className="profile-details__label">SỐ ĐIỆN THOẠI</p>
                <p className="profile-details__value">{USER.phone}</p>
              </div>
              <div>
                <p className="profile-details__label">LOẠI TÀI KHOẢN</p>
                <p className="profile-details__value">{USER.accountType}</p>
              </div>
            </div>
            <div>
              <p className="profile-details__label">ĐỊA CHỈ GIAO HÀNG</p>
              <p className="profile-details__value">{USER.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Saved items */}
      <div className="profile-card" style={{ marginTop: 20 }}>
        <div className="profile-card__head">
          <h2 className="profile-card__title">Sản Phẩm Yêu Thích</h2>
          <span className="profile-card__badge">{WISHLIST.length} sản phẩm</span>
        </div>
        <div className="profile-wishlist-grid">
          {WISHLIST.map(item => (
            <a key={item.id} href={`/san-pham/${item.id}`} className="profile-wishlist-item">
              <div className="profile-wishlist-item__img-wrap">
                <img src={item.image} alt={item.name} />
                <button className="profile-wishlist-item__heart" aria-label="Bỏ yêu thích"
                  onClick={e => e.preventDefault()}>
                  <Heart size={14} fill="#e53935" color="#e53935" />
                </button>
              </div>
              <p className="profile-wishlist-item__name">{item.name}</p>
              <p className="profile-wishlist-item__price">{item.price.toLocaleString('vi-VN')}đ</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
