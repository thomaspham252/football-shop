import { Pencil, Truck, CheckCircle, X, Package, Heart } from 'lucide-react';
import wishlistApi from '../../../api/wishlistApi';

const STATUS_ICON = {
  delivered: <CheckCircle size={14} />,
  transit:   <Truck size={14} />,
  cancelled: <X size={14} />,
  pending:   <Package size={14} />,
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

const formatJoinDate = (dateStr) => {
  if (!dateStr) return 'Tháng 8, 2023';
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `Tháng ${month}, ${year}`;
};

export default function Overview({ user, orders = [], wishlist = [], onNavigate }) {
  const handleRemoveWish = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await wishlistApi.toggleWishlist(id);
        window.dispatchEvent(new Event('wishlist-updated'));
        return;
      } catch (err) {
        console.error("Lỗi khi xóa khỏi wishlist DB:", err);
      }
    }
    const stored = localStorage.getItem('wishlist');
    let list = stored ? JSON.parse(stored) : [];
    list = list.filter(item => String(item.id) !== String(id));
    localStorage.setItem('wishlist', JSON.stringify(list));
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  return (
    <div className="profile-overview">
      {/* Hero card */}
      <div className="profile-hero">
        <div className="profile-hero__avatar">
          {user?.avatar
            ? <img src={user.avatar} alt={user.fullName} />
            : <span>{(user?.fullName || '?').charAt(0)}</span>
          }
          <span className="profile-hero__avatar-badge">✓</span>
        </div>
        <div className="profile-hero__info">
          <h1 className="profile-hero__name">{user?.fullName || 'Người dùng'}</h1>
          <p className="profile-hero__email">{user?.email}</p>
          <div className="profile-hero__tags">
            <span className="profile-hero__tag profile-hero__tag--member">⭐ {user?.role === 'ADMIN' ? 'Quản Trị Viên' : 'Thành Viên'}</span>
            <span className="profile-hero__tag">Tham gia {formatJoinDate(user?.createdAt)}</span>
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
            {orders.length === 0 ? (
              <p style={{ color: '#888', padding: '15px 0' }}>Chưa có đơn hàng nào.</p>
            ) : (
              orders.slice(0, 2).map(o => {
                const statusKey = mapStatus(o.orderStatus);
                return (
                  <div key={o.orderId} className="profile-order-row">
                    <div className={`profile-order-row__icon profile-order-row__icon--${statusKey}`}>
                      {STATUS_ICON[statusKey]}
                    </div>
                    <div className="profile-order-row__info">
                      <p className="profile-order-row__id">#{o.orderCode}</p>
                      <p className="profile-order-row__date">{formatDate(o.createdAt)}</p>
                    </div>
                    <div className="profile-order-row__right">
                      <p className="profile-order-row__price">{(o.totalAmount || 0).toLocaleString('vi-VN')}đ</p>
                      <span className={`profile-order-row__status profile-order-row__status--${statusKey}`}>
                        {mapStatusLabel(o.orderStatus)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
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
                <p className="profile-details__value">{user?.phone || 'Chưa cung cấp'}</p>
              </div>
              <div>
                <p className="profile-details__label">LOẠI TÀI KHOẢN</p>
                <p className="profile-details__value">{user?.role === 'ADMIN' ? 'Quản trị viên' : 'Thành viên'}</p>
              </div>
            </div>
            <div>
              <p className="profile-details__label">ĐỊA CHỈ</p>
              <p className="profile-details__value">{user?.address || 'Chưa cung cấp'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Saved items */}
      <div className="profile-card" style={{ marginTop: 20 }}>
        <div className="profile-card__head">
          <h2 className="profile-card__title">Sản Phẩm Yêu Thích</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="profile-card__badge">{wishlist.length} sản phẩm</span>
            <button className="profile-card__link" onClick={() => onNavigate('wishlist')}>
              Xem tất cả
            </button>
          </div>
        </div>
        <div className="profile-wishlist-grid">
          {wishlist.length === 0 ? (
            <p style={{ color: '#888', padding: '15px 0', gridColumn: '1 / -1' }}>Chưa có sản phẩm yêu thích nào.</p>
          ) : (
            wishlist.slice(0, 4).map(item => (
              <a key={item.id} href={`/san-pham/${item.slug || item.id}`} className="profile-wishlist-item">
                <div className="profile-wishlist-item__img-wrap">
                  <img src={item.image} alt={item.name} />
                  <button className="profile-wishlist-item__heart" aria-label="Bỏ yêu thích"
                    onClick={e => handleRemoveWish(e, item.id)}>
                    <Heart size={14} fill="#e53935" color="#e53935" />
                  </button>
                </div>
                <p className="profile-wishlist-item__name">{item.name}</p>
                <p className="profile-wishlist-item__price">{(item.price || 0).toLocaleString('vi-VN')}đ</p>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
