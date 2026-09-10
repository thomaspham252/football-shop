import { useState, useEffect } from 'react';
import { Truck, CheckCircle, X, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import orderApi from '../../../api/orderApi';

const TABS = [
  { key: 'all',       label: 'Tất cả' },
  { key: 'pending',   label: 'Đang xử lý' },
  { key: 'transit',   label: 'Đang giao' },
  { key: 'delivered', label: 'Đã giao' },
  { key: 'cancelled', label: 'Đã hủy' },
];

const styles = {
  prevIcon: { display: 'inline', verticalAlign: 'middle', marginRight: 4 },
  nextIcon: { display: 'inline', verticalAlign: 'middle', marginLeft: 4 },
  confirmCancelBtn: { background: '#e53935', color: '#fff' }
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

const canCancelOrder = (o) => {
  const status = (o.orderStatus || '').toUpperCase();
  const payment = (o.paymentStatus || '').toUpperCase();
  const notShipped = status === 'PENDING' || status === 'PROCESSING';
  const notPaid = payment !== 'PAID';
  return notShipped && notPaid;
};

export default function OrderHistory({ orders = [], onRefresh }) {
  const { toast } = useToast();
  const [tab,         setTab]         = useState('all');
  const [search,      setSearch]      = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [tab, search]);

  const handleOpenCancelModal = (o) => {
    setCancelModalOrder(o);
    toast.warning(`Bạn muốn hủy đơn hàng #${o.orderCode}?`);
  };

  const handleConfirmCancel = async () => {
    if (!cancelModalOrder) return;
    setCancelling(true);
    try {
      await orderApi.cancelOrder(cancelModalOrder.orderId);
      toast.success(`Đã hủy thành công đơn hàng #${cancelModalOrder.orderCode}`);
      setCancelModalOrder(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Lỗi khi hủy đơn hàng:", err);
      toast.error(err.response?.data?.error || err.response?.data?.message || "Không thể hủy đơn hàng này");
    } finally {
      setCancelling(false);
    }
  };

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="oh-wrap">
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

      <div className="oh-list">
        {filtered.length === 0 ? (
          <div className="oh-empty">
            <Package size={40} strokeWidth={1} />
            <p>Không tìm thấy đơn hàng nào</p>
          </div>
        ) : paginatedOrders.map(o => {
          const statusKey = mapStatus(o.orderStatus);
          const statusLabel = mapStatusLabel(o.orderStatus);
          const mainItem = o.items?.[0];
          const image = mainItem?.productVariant?.imageUrl || mainItem?.product?.imageUrl;
          const name = mainItem?.product?.productName || 'Sản phẩm';
          const qty = mainItem?.quantity || 1;
          const extraCount = (o.items?.length || 0) - 1;
          
          let paymentNote = o.paymentMethod === 'TRANSFER' ? 'Thanh toán Chuyển khoản'
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
                    {canCancelOrder(o) && (
                      <button 
                        className="oh-btn oh-btn--danger"
                        onClick={() => handleOpenCancelModal(o)}
                      >
                        Hủy đơn
                      </button>
                    )}
                    {statusKey === 'delivered' && (
                      <button className="oh-btn oh-btn--primary">Mua lại</button>
                    )}
                    <a href={`/don-hang/${o.orderId}`} className="oh-btn oh-btn--outline">
                      Chi tiết
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="oh-pagination">
          <button
            className="oh-pagination__btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          >
            <ChevronLeft size={16} style={styles.prevIcon} />
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
            <ChevronRight size={16} style={styles.nextIcon} />
          </button>
        </div>
      )}

      {cancelModalOrder && (
        <div className="oh-modal-overlay">
          <div className="oh-modal">
            <h3 className="oh-modal__title">Xác nhận hủy đơn hàng</h3>
            <p className="oh-modal__text">
              Bạn có chắc chắn muốn hủy đơn hàng <strong>#{cancelModalOrder.orderCode}</strong> không? 
              Số lượng sản phẩm trong đơn sẽ được tự động hoàn lại tồn kho.
            </p>
            <div className="oh-modal__actions">
              <button 
                className="oh-btn oh-btn--outline" 
                onClick={() => setCancelModalOrder(null)}
                disabled={cancelling}
              >
                Bỏ qua
              </button>
              <button 
                className="oh-btn oh-btn--danger" 
                style={styles.confirmCancelBtn}
                onClick={handleConfirmCancel}
                disabled={cancelling}
              >
                {cancelling ? 'Đang hủy...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
