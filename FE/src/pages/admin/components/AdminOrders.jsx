import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Eye, 
  TrendingUp,
  CreditCard,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { adminApi } from '../../../api/adminApi';

const formatVND = (amount) => {
  if (amount === undefined || amount === null || amount === '') return '0 ₫';
  if (typeof amount === 'string') {
    if (amount.includes('₫') || amount.includes('đ') || amount.includes('VNĐ')) {
      return amount;
    }
    const num = parseFloat(amount.replace(/[^0-9.-]+/g, ""));
    if (!isNaN(num)) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
    }
    return amount;
  }
  if (typeof amount === 'number') {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }
  return String(amount);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return String(dateStr);
  }
};

const getStatusBadge = (statusStr) => {
  const s = String(statusStr || '').toUpperCase();
  if (s === 'DELIVERED' || s.includes('ĐÃ GIAO')) {
    return { label: 'Đã giao', bg: '#dcfce7', color: '#15803d' };
  }
  if (s === 'CANCELLED' || s.includes('HỦY')) {
    return { label: 'Đã hủy', bg: '#fee2e2', color: '#b91c1c' };
  }
  if (s === 'SHIPPED' || s.includes('ĐANG GIAO')) {
    return { label: 'Đang giao', bg: '#e0f2fe', color: '#0369a1' };
  }
  if (s === 'PROCESSING' || s.includes('XỬ LÝ')) {
    return { label: 'Đang xử lý', bg: '#e0f2fe', color: '#0284c7' };
  }
  return { label: statusStr || 'Mới tạo', bg: '#fef3c7', color: '#b45309' };
};

export default function AdminOrders({ onViewOrderDetails }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [shippingFilter, setShippingFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, [searchQuery, paymentFilter, shippingFilter, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await adminApi.getOrders({
        status: shippingFilter,
        paymentStatus: paymentFilter,
        keyword: searchQuery.trim(),
        page: currentPage,
        size: 10
      });

      if (data && data.content) {
        setOrders(data.content);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      } else if (Array.isArray(data)) {
        setOrders(data);
        setTotalPages(1);
        setTotalElements(data.length);
      } else {
        setOrders([]);
        setTotalPages(1);
        setTotalElements(0);
      }
    } catch (err) {
      console.error("Lỗi nạp dữ liệu từ Backend API:", err);
      setError("Không thể nạp danh sách đơn hàng từ máy chủ Backend. Vui lòng kiểm tra lại kết nối.");
      setOrders([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-orders-view">
      {/* Top Header */}
      <div className="admin-page-header">
        <div className="admin-page-header__left">
          <h1 className="admin-page-title">Quản lý đơn hàng</h1>
          <p className="admin-page-sub">Giám sát danh sách và xử lý các đơn đặt hàng thực tế từ API Backend.</p>
        </div>
      </div>

      {/* Summary Card & Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="admin-stat-card">
          <div className="admin-stat-card__header">
            <span className="admin-stat-card__title">Tổng Đơn Hàng (DB)</span>
            <span className="admin-stat-card__trend admin-stat-card__trend--up">
              <TrendingUp size={12} /> API Real-time
            </span>
          </div>
          <div className="admin-stat-card__val">{totalElements}</div>
          <ShoppingBag className="admin-stat-card__icon-bg" />
        </div>

        <div className="admin-table-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Tìm mã đơn, tên khách, sđt, email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(0);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  borderRadius: '8px',
                  border: '1px solid var(--admin-border)',
                  fontSize: '13.5px',
                  outline: 'none'
                }}
              />
            </div>

            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setCurrentPage(0);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--admin-border)',
                fontSize: '13.5px',
                outline: 'none',
                background: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">Thanh toán: Tất cả</option>
              <option value="PAID">Đã thanh toán (PAID)</option>
              <option value="PENDING">Chờ thanh toán (PENDING)</option>
              <option value="FAILED">Thất bại (FAILED)</option>
            </select>

            <select
              value={shippingFilter}
              onChange={(e) => {
                setShippingFilter(e.target.value);
                setCurrentPage(0);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--admin-border)',
                fontSize: '13.5px',
                outline: 'none',
                background: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">Trạng thái đơn: Tất cả</option>
              <option value="PENDING">Mới tạo (PENDING)</option>
              <option value="PROCESSING">Đang xử lý (PROCESSING)</option>
              <option value="SHIPPED">Đang giao (SHIPPED)</option>
              <option value="DELIVERED">Đã giao (DELIVERED)</option>
              <option value="CANCELLED">Đã hủy (CANCELLED)</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      {/* Orders Table */}
      <div className="admin-table-card">
        <div className="admin-table-header">
          <h3 className="admin-table-title">Danh sách Đơn hàng ({totalElements})</h3>
        </div>

        <div className="admin-table-wrapper">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', gap: '10px' }}>
              <Loader2 className="animate-spin" size={24} color="var(--admin-primary)" />
              <span style={{ color: '#64748b' }}>Đang tải danh sách đơn hàng từ API...</span>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã Đơn Hàng</th>
                  <th>Khách Hàng</th>
                  <th>Ngày Đặt</th>
                  <th>Phương Thức TT</th>
                  <th>Tổng Tiền</th>
                  <th>Thanh Toán</th>
                  <th>Trạng Thái Đơn</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                      Chưa có đơn hàng nào trong cơ sở dữ liệu.
                    </td>
                  </tr>
                ) : (
                  orders.map((ord, idx) => {
                    const code = ord.orderCode || `#ORD-${ord.orderId || idx + 1}`;
                    const customerName = (ord.lastName || ord.firstName) 
                      ? `${ord.lastName || ''} ${ord.firstName || ''}`.trim() 
                      : (ord.email?.split('@')[0] || 'Khách hàng');
                    const emailStr = ord.email || '';
                    const phoneStr = ord.phone || '';
                    const dateVal = formatDate(ord.createdAt);
                    const totalVal = formatVND(ord.totalAmount);
                    const orderBadge = getStatusBadge(ord.orderStatus);
                    const payStatus = ord.paymentStatus || 'PENDING';

                    return (
                      <tr key={ord.orderId || idx}>
                        <td style={{ fontWeight: 700, color: '#2563eb', whiteSpace: 'nowrap' }}>{code}</td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap', fontSize: '13.5px' }}>
                            {customerName}
                          </div>
                          {phoneStr && <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px', whiteSpace: 'nowrap' }}>{phoneStr}</div>}
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '1px', whiteSpace: 'nowrap' }}>{emailStr}</div>
                        </td>
                        <td style={{ whiteSpace: 'nowrap', fontSize: '13px', color: '#334155' }}>{dateVal}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <span className="admin-badge admin-badge--neutral" style={{ fontSize: '11px', whiteSpace: 'nowrap', color: '#334155', backgroundColor: '#f1f5f9' }}>
                            <CreditCard size={12} /> {ord.paymentMethod || 'COD'}
                          </span>
                        </td>
                        <td style={{ fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', fontSize: '13.5px' }}>
                          {totalVal}
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <span
                            className="admin-badge"
                            style={{
                              backgroundColor: payStatus === 'PAID' ? '#dcfce7' : payStatus === 'FAILED' ? '#fee2e2' : '#fef3c7',
                              color: payStatus === 'PAID' ? '#15803d' : payStatus === 'FAILED' ? '#b91c1c' : '#b45309',
                              fontSize: '11px',
                              fontWeight: 600
                            }}
                          >
                            {payStatus}
                          </span>
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <span
                            className="admin-badge"
                            style={{
                              backgroundColor: orderBadge.bg,
                              color: orderBadge.color,
                              fontSize: '11px',
                              fontWeight: 600
                            }}
                          >
                            {orderBadge.label}
                          </span>
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <button
                            className="admin-btn admin-btn--outline"
                            style={{ padding: '6px 12px', fontSize: '12.5px', whiteSpace: 'nowrap' }}
                            onClick={() => onViewOrderDetails(ord)}
                          >
                            <Eye size={14} /> Chi tiết
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid var(--admin-border)' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Trang {currentPage + 1} / {totalPages}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="admin-btn admin-btn--outline"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                style={{ padding: '6px 12px', opacity: currentPage === 0 ? 0.5 : 1 }}
              >
                <ChevronLeft size={16} /> Trước
              </button>
              <button
                className="admin-btn admin-btn--outline"
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                style={{ padding: '6px 12px', opacity: currentPage >= totalPages - 1 ? 0.5 : 1 }}
              >
                Sau <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
