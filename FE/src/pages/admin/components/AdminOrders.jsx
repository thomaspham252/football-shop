import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Calendar, 
  Eye, 
  TrendingUp,
  Download,
  PlusCircle,
  CreditCard,
  Truck
} from 'lucide-react';
import { initialRecentOrders } from '../mockData';

export default function AdminOrders({ onOpenCreateOrderModal, onViewOrderDetails }) {
  const [orders, setOrders] = useState(initialRecentOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [shippingFilter, setShippingFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('7_days');

  const filteredOrders = orders.filter((ord) => {
    const customerName = `${ord.lastName} ${ord.firstName}`;
    const matchesSearch = ord.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ord.phone.includes(searchQuery) ||
                          ord.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPayment = paymentFilter === 'all' || ord.paymentStatus === paymentFilter;
    const matchesShipping = shippingFilter === 'all' || ord.orderStatus === shippingFilter;
    return matchesSearch && matchesPayment && matchesShipping;
  });

  return (
    <div className="admin-orders-view">
      {/* Top Header */}
      <div className="admin-page-header">
        <div className="admin-page-header__left">
          <h1 className="admin-page-title">Quản lý đơn hàng</h1>
          <p className="admin-page-sub">Giám sát danh sách và trạng thái xử lý các đơn đặt hàng.</p>
        </div>
      </div>

      {/* Summary Card & Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="admin-stat-card">
          <div className="admin-stat-card__header">
            <span className="admin-stat-card__title">Tổng Đơn (Tháng)</span>
            <span className="admin-stat-card__trend admin-stat-card__trend--up">
              <TrendingUp size={12} /> +12% so với tháng trước
            </span>
          </div>
          <div className="admin-stat-card__val">1,248</div>
          <ShoppingBag className="admin-stat-card__icon-bg" />
        </div>

        <div className="admin-table-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
              <input
                type="text"
                placeholder="Tìm mã đơn, tên khách, sđt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
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
              <option value="7_days">7 Ngày qua</option>
              <option value="30_days">30 Ngày qua</option>
              <option value="this_month">Tháng này</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
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
              <option value="all">Trạng thái thanh toán: Tất cả</option>
              <option value="Đã thanh toán">Đã thanh toán</option>
              <option value="Chưa thanh toán">Chưa thanh toán</option>
              <option value="Chờ xác nhận">Chờ xác nhận</option>
            </select>

            <select
              value={shippingFilter}
              onChange={(e) => setShippingFilter(e.target.value)}
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
              <option value="all">Trạng thái đơn hàng: Tất cả</option>
              <option value="Đã giao">Đã giao</option>
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Đang giao hàng">Đang giao hàng</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-table-card">
        <div className="admin-table-header">
          <h3 className="admin-table-title">Danh sách Đơn hàng</h3>
          <button className="admin-btn admin-btn--outline" style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>
            <Download size={15} /> Xuất Báo Cáo
          </button>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã Đơn Hàng</th>
                <th>Khách Hàng</th>
                <th>Ngày Đặt</th>
                <th>Phương Thức TT</th>
                <th>Tổng Tiền</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((ord) => (
                <tr key={ord.orderId}>
                  <td style={{ fontWeight: 700, color: 'var(--admin-primary)', whiteSpace: 'nowrap' }}>{ord.orderCode}</td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--admin-text-dark)', whiteSpace: 'nowrap' }}>{ord.lastName} {ord.firstName}</div>
                    <div style={{ fontSize: '12px', color: 'var(--admin-text-body)', marginTop: '2px', whiteSpace: 'nowrap' }}>{ord.phone}</div>
                    <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '1px', whiteSpace: 'nowrap' }}>{ord.email}</div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{ord.createdAt}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span className="admin-badge admin-badge--neutral" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                      <CreditCard size={12} /> {ord.paymentMethod}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--admin-text-dark)', whiteSpace: 'nowrap' }}>{ord.totalAmount}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'nowrap' }}>
                      <span
                        className="admin-badge"
                        style={{
                          backgroundColor: ord.paymentStatus === 'Đã thanh toán' ? '#dcfce7' : ord.paymentStatus === 'Chưa thanh toán' ? '#fee2e2' : '#fef3c7',
                          color: ord.paymentStatus === 'Đã thanh toán' ? '#15803d' : ord.paymentStatus === 'Chưa thanh toán' ? '#b91c1c' : '#b45309',
                          fontSize: '10.5px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {ord.paymentStatus}
                      </span>
                      <span
                        className="admin-badge"
                        style={{
                          backgroundColor: ord.orderStatus === 'Đã giao' ? '#dcfce7' : ord.orderStatus === 'Đã hủy' ? '#fee2e2' : '#e0f2fe',
                          color: ord.orderStatus === 'Đã giao' ? '#15803d' : ord.orderStatus === 'Đã hủy' ? '#b91c1c' : '#0369a1',
                          fontSize: '10.5px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {ord.orderStatus}
                      </span>
                    </div>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
