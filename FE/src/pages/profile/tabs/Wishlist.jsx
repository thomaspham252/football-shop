import { useState, useEffect } from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import wishlistApi from '../../../api/wishlistApi';

export default function Wishlist({ wishlist = [] }) {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [wishlist.length]);

  const handleRemoveWish = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await wishlistApi.toggleWishlist(id);
        toast.info('Đã xóa khỏi danh sách yêu thích');
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
    toast.info('Đã xóa khỏi danh sách yêu thích');
  };

  const totalPages = Math.max(1, Math.ceil(wishlist.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedWishlist = wishlist.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
          paginatedWishlist.map(item => (
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="oh-pagination">
          <button
            className="oh-pagination__btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          >
            <ChevronLeft size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            Trang trước
          </button>
          <span className="oh-pagination__info">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            className="oh-pagination__btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          >
            Trang sau
            <ChevronRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
          </button>
        </div>
      )}
    </div>
  );
}
