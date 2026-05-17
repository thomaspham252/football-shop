import { Heart } from 'lucide-react';
import { WISHLIST } from '../data/profileData';

export default function Wishlist() {
  return (
    <div className="profile-card">
      <div className="profile-card__head">
        <h2 className="profile-card__title">Sản Phẩm Yêu Thích</h2>
        <span className="profile-card__badge">{WISHLIST.length} sản phẩm</span>
      </div>
      <div className="profile-wishlist-grid">
        {WISHLIST.map(item => (
          <a key={item.id} href={`/san-pham/${item.id}`} className="profile-wishlist-item">
            <div className="profile-wishlist-item__img-wrap">
              <img src={item.image} alt={item.name} />
              <button
                className="profile-wishlist-item__heart"
                aria-label="Bỏ yêu thích"
                onClick={e => e.preventDefault()}
              >
                <Heart size={14} fill="#e53935" color="#e53935" />
              </button>
            </div>
            <p className="profile-wishlist-item__name">{item.name}</p>
            <p className="profile-wishlist-item__price">{item.price.toLocaleString('vi-VN')}đ</p>
          </a>
        ))}
      </div>
    </div>
  );
}
