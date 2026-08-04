import { Heart } from 'lucide-react';

export default function Wishlist({ wishlist = [] }) {
  const handleRemoveWish = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    const stored = localStorage.getItem('wishlist');
    let list = stored ? JSON.parse(stored) : [];
    list = list.filter(item => String(item.id) !== String(id));
    localStorage.setItem('wishlist', JSON.stringify(list));
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  return (
    <div className="profile-card">
      <div className="profile-card__head">
        <h2 className="profile-card__title">Sản Phẩm Yêu Thích</h2>
        <span className="profile-card__badge">{wishlist.length} sản phẩm</span>
      </div>
      <div className="profile-wishlist-grid">
        {wishlist.length === 0 ? (
          <p style={{ color: '#888', padding: '15px 0', gridColumn: '1 / -1' }}>Chưa có sản phẩm yêu thích nào.</p>
        ) : (
          wishlist.map(item => (
            <a key={item.id} href={`/san-pham/${item.id}`} className="profile-wishlist-item">
              <div className="profile-wishlist-item__img-wrap">
                <img src={item.image} alt={item.name} />
                <button
                  className="profile-wishlist-item__heart"
                  aria-label="Bỏ yêu thích"
                  onClick={e => handleRemoveWish(e, item.id)}
                >
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
  );
}
