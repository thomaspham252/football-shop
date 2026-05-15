import { ShoppingCart, Heart } from 'lucide-react';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { name, brand, price, originalPrice, image, badge, colors } = product;
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  return (
    <div className="product-card">
      <div className="product-card__image-wrap">
        {badge && (
          <span className={`product-card__badge product-card__badge--${badge.type}`}>
            {badge.label}
          </span>
        )}
        {discount && (
          <span className="product-card__badge product-card__badge--sale">
            -{discount}%
          </span>
        )}
        <button className="product-card__wishlist" aria-label="Yêu thích">
          <Heart size={16} />
        </button>
        <img src={image} alt={name} className="product-card__image" loading="lazy" />
        <div className="product-card__overlay">
          <button className="product-card__add-cart">
            <ShoppingCart size={16} />
            Thêm vào giỏ
          </button>
        </div>
      </div>

      <div className="product-card__info">
        {brand && <p className="product-card__brand">{brand}</p>}
        <h3 className="product-card__name">{name}</h3>
        <div className="product-card__price-row">
          <span className="product-card__price">
            {price.toLocaleString('vi-VN')}đ
          </span>
          {originalPrice && (
            <span className="product-card__original-price">
              {originalPrice.toLocaleString('vi-VN')}đ
            </span>
          )}
        </div>
        {colors && colors.length > 0 && (
          <div className="product-card__colors">
            {colors.map((c, i) => (
              <span
                key={i}
                className="product-card__color-dot"
                style={{ background: c }}
                title={c}
              />
            ))}
          </div>
        )}
        <a href="/san-pham" className="product-card__btn">Mua Ngay</a>
      </div>
    </div>
  );
}
