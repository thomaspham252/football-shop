import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Zap } from 'lucide-react';
import './ProductCard.css';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import productApi from '../../api/productApi';
import wishlistApi from '../../api/wishlistApi';

const colorMap = {
  'Trắng': '#ffffff',
  'Đen': '#1a1a1a',
  'Đỏ': '#d32f2f',
  'Xanh': '#1976d2',
  'Xanh Navy': '#0d47a1',
  'Xám': '#9e9e9e',
  'Vàng': '#ffeb3b',
  'Cam': '#ff9800',
  'Hồng': '#e91e63',
  'Xanh Lá': '#4caf50',
  'Trắng/Đỏ': '#ffffff',
  'Đen/Trắng': '#1a1a1a'
};

function getColorHex(name) {
  if (!name) return '#9e9e9e';
  const clean = name.toLowerCase().trim();
  if (clean.includes('trắng') || clean.includes('white')) return '#ffffff';
  if (clean.includes('đen') || clean.includes('black')) return '#1a1a1a';
  if (clean.includes('navy')) return '#0d47a1';
  if (clean.includes('xanh dương') || clean.includes('blue') || clean.includes('xanh biển')) return '#1976d2';
  if (clean.includes('xanh lá') || clean.includes('green')) return '#4caf50';
  if (clean.includes('đỏ') || clean.includes('red')) return '#d32f2f';
  if (clean.includes('vàng') || clean.includes('yellow')) return '#ffeb3b';
  if (clean.includes('cam') || clean.includes('orange')) return '#ff9800';
  if (clean.includes('hồng') || clean.includes('pink')) return '#e91e63';
  if (clean.includes('xám') || clean.includes('grey') || clean.includes('gray')) return '#9e9e9e';
  return '#9e9e9e';
}

export default function ProductCard({ product }) {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const productId = product.productId ?? product.id;
  const slug = product.slug;
  const productName = product.productName ?? product.name;
  const brandName = product.brandName ?? product.brand;
  const salePrice = product.salePrice ?? product.price ?? 0;
  const basePrice = product.basePrice ?? product.originalPrice ?? 0;
  const firstVariantImage = product.variants && product.variants.length > 0 ? product.variants[0]?.imageUrl : null;
  const imageUrl = firstVariantImage || product.imageUrl || product.image;

  const [activeImageUrl, setActiveImageUrl] = useState(imageUrl);
  const [detailedProduct, setDetailedProduct] = useState(null);
  const [isWish, setIsWish] = useState(false);

  useEffect(() => {
    const firstVarImg = product.variants && product.variants.length > 0 ? product.variants[0]?.imageUrl : null;
    setActiveImageUrl(firstVarImg || product.imageUrl || product.image);
    setDetailedProduct(null);
  }, [product]);

  useEffect(() => {
    const checkWish = () => {
      const storedIds = localStorage.getItem('wishlist_ids');
      if (storedIds) {
        const ids = JSON.parse(storedIds);
        if (Array.isArray(ids) && ids.length > 0) {
          setIsWish(ids.some(id => String(id) === String(productId)));
          return;
        }
      }
      setIsWish(false);
    };
    checkWish();
    window.addEventListener('wishlist-ids-updated', checkWish);
    return () => window.removeEventListener('wishlist-ids-updated', checkWish);
  }, [productId]);

  const handleToggleWish = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm vào sản phẩm yêu thích");
      return;
    }

    try {
      const res = await wishlistApi.toggleWishlist(productId);
      const added = res.data.added;
      setIsWish(added);
      if (added) {
        toast.success("Đã thêm vào sản phẩm yêu thích");
      } else {
        toast.info("Đã xóa khỏi sản phẩm yêu thích");
      }
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch (err) {
      console.error("Lỗi khi toggle wishlist:", err);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  const handleColorInteraction = async (colorName) => {
    let prodData = detailedProduct;
    if (!prodData) {
      try {
        const res = await productApi.getProductDetail(productId);
        prodData = res.data;
        setDetailedProduct(prodData);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết sản phẩm để đổi màu:", error);
        return;
      }
    }

    const matchingVariant = prodData?.variants?.find(
      v => v.color === colorName && v.imageUrl
    );
    if (matchingVariant) {
      setActiveImageUrl(matchingVariant.imageUrl);
    }
  };
  const discountPercentage = product.discountPercentage ??
      (product.originalPrice && product.price
          ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
          : 0);
  const colors = product.colors;
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (adding) return;
    setAdding(true);
    try {
      const res = await productApi.getProductDetail(productId);
      const prodData = res.data;
      const firstVariant = prodData?.variants?.[0];
      if (firstVariant) {
        addToCart(prodData, firstVariant, 1);
      } else {
        toast.warning("Sản phẩm hiện tại không có phiên bản (variant) nào khả dụng.");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.");
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (adding) return;
    setAdding(true);
    try {
      const res = await productApi.getProductDetail(productId);
      const prodData = res.data;
      const firstVariant = prodData?.variants?.[0];
      if (firstVariant) {
        addToCart(prodData, firstVariant, 1);
        window.location.href = '/gio-hang';
      } else {
        toast.warning("Sản phẩm hiện tại không có phiên bản (variant) nào khả dụng.");
      }
    } catch (error) {
      console.error("Lỗi khi mua ngay:", error);
      toast.error("Không thể xử lý yêu cầu. Vui lòng thử lại sau.");
    } finally {
      setAdding(false);
    }
  };

  return (
      <div className="product-card">
        <a href={`/san-pham/${slug || productId}`} className="product-card__image-wrap">

          {discountPercentage > 0 && (
              <span className="product-card__badge product-card__badge--sale">
            -{discountPercentage}%
          </span>
          )}

          <button className="product-card__wishlist" onClick={handleToggleWish}>
            <Heart size={16} fill={isWish ? "#e53935" : "none"} color={isWish ? "#e53935" : "currentColor"} />
          </button>

          <img
              src={activeImageUrl}
              alt={productName}
              className="product-card__image"
          />

          <div className="product-card__overlay">
            <button className="product-card__add-cart" onClick={handleAddToCart} disabled={adding}>
              <ShoppingCart size={16} />
              {adding ? 'Đang thêm...' : 'Thêm vào giỏ'}
            </button>
          </div>
        </a>

        <div className="product-card__info">

          <p className="product-card__brand">{brandName}</p>

          <h3 className="product-card__name">
            {productName}
          </h3>

          <div className="product-card__price-row">
          <span className="product-card__price">
            {salePrice.toLocaleString("vi-VN")}đ
          </span>

            {basePrice > salePrice && (
                <span className="product-card__original-price">
              {basePrice.toLocaleString("vi-VN")}đ
            </span>
            )}
          </div>

          {colors?.length > 0 && (
              <div className="product-card__colors">
                {colors.map((c, i) => (
                    <span
                        key={i}
                        className="product-card__color-dot"
                        style={{ background: colorMap[c] || getColorHex(c) }}
                        title={c}
                        onMouseEnter={() => handleColorInteraction(c)}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleColorInteraction(c);
                        }}
                    />
                ))}
              </div>
          )}

          <button className="product-card__btn" onClick={handleBuyNow} disabled={adding} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', border: 'none', cursor: 'pointer', width: '100%' }}>
            <Zap size={14} />
            MUA NGAY
          </button>
        </div>
      </div>
  );
}