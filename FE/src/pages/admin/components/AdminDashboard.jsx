import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp, 
  ChevronRight,
  Eye,
  Calendar,
  Loader2
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
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
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

export default function AdminDashboard({ onNavigateTab, onViewOrderDetails }) {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getDashboardStats();
      if (data) {
        setDashboardData(data);
      }
    } catch (err) {
      console.error("Lỗi nạp dữ liệu Dashboard từ API Backend:", err);
    } finally {
      setLoading(false);
    }
  };

  const stats = dashboardData || {};
  const displayOrders = stats.recentOrders || [];
  const monthlyRevenue = stats.monthlyRevenue || [];

  // SVG curved spline calculation
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingLeft = 45;
  const paddingBottom = 30;
  const paddingTop = 20;
  const paddingRight = 20;

  const chartW = svgWidth - paddingLeft - paddingRight;
  const chartH = svgHeight - paddingTop - paddingBottom;
  
  const chartPointsData = monthlyRevenue.length > 0
    ? monthlyRevenue.map(m => ({ label: m.month, val: Number(m.revenue) / 1000000 }))
    : [
        { label: 'Tháng 1', val: 0 },
        { label: 'Tháng 2', val: 0 },
        { label: 'Tháng 3', val: 0 },
        { label: 'Tháng 4', val: 0 }
      ];

  const maxVal = Math.max(...chartPointsData.map(d => d.val), 10);

  const points = chartPointsData.map((d, index) => {
    const x = paddingLeft + (index / Math.max(chartPointsData.length - 1, 1)) * chartW;
    const y = paddingTop + chartH - (d.val / maxVal) * chartH;
    return { x, y, data: d };
  });

  const pathD = points.reduce((acc, point, i, a) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const prev = a[i - 1];
    const cp1x = prev.x + (point.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (point.x - prev.x) / 2;
    const cp2y = point.y;
    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${point.x},${point.y}`;
  }, '');

  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x},${svgHeight - paddingBottom} L ${points[0].x},${svgHeight - paddingBottom} Z`
    : '';

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', flexDirection: 'column', gap: '12px' }}>
        <Loader2 className="animate-spin" size={36} color="var(--admin-primary)" />
        <span style={{ color: '#64748b', fontSize: '14px' }}>Đang nạp dữ liệu thống kê từ máy chủ API...</span>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-view">
      {/* Top Title Banner */}
      <div className="admin-page-header">
        <div className="admin-page-header__left">
          <h1 className="admin-page-title">Tổng quan hoạt động</h1>
          <p className="admin-page-sub">Số liệu thời gian thực từ API Backend</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="admin-btn admin-btn--outline" onClick={fetchDashboardData}>
            <Calendar size={16} /> Hôm nay: {new Date().toLocaleDateString('vi-VN')}
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-card__header">
            <span className="admin-stat-card__title">Tổng Doanh Thu</span>
            <span className="admin-stat-card__trend admin-stat-card__trend--up">
              <TrendingUp size={13} /> Dữ liệu API
            </span>
          </div>
          <div className="admin-stat-card__val">{formatVND(stats.totalRevenue || 0)}</div>
          <Wallet className="admin-stat-card__icon-bg" />
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__header">
            <span className="admin-stat-card__title">Tổng Số Đơn Hàng</span>
            <span className="admin-stat-card__trend admin-stat-card__trend--up">
              <TrendingUp size={13} /> {stats.pendingOrders || 0} đơn chờ
            </span>
          </div>
          <div className="admin-stat-card__val">{stats.totalOrders || 0}</div>
          <ShoppingBag className="admin-stat-card__icon-bg" />
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__header">
            <span className="admin-stat-card__title">Tổng Số Sản Phẩm</span>
            <span className="admin-stat-card__trend admin-stat-card__trend--up">
              <TrendingUp size={13} /> Đang kinh doanh
            </span>
          </div>
          <div className="admin-stat-card__val">{stats.totalProducts || 0}</div>
          <Package className="admin-stat-card__icon-bg" />
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__header">
            <span className="admin-stat-card__title">Tổng Khách Hàng</span>
            <span className="admin-stat-card__trend admin-stat-card__trend--up">
              <Users size={13} /> Đã đăng ký
            </span>
          </div>
          <div className="admin-stat-card__val">{stats.totalUsers || 0}</div>
          <Users className="admin-stat-card__icon-bg" />
        </div>
      </div>

      {/* Middle Row: Revenue Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="admin-table-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                Xu Hướng Doanh Thu Theo Tháng
              </h3>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Đơn vị tính: Triệu VNĐ</span>
            </div>
          </div>

          <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1a1a2e" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {points.map((pt, idx) => (
                <g key={idx}>
                  <line x1={pt.x} y1={paddingTop} x2={pt.x} y2={svgHeight - paddingBottom} stroke="#e2e8f0" strokeDasharray="3 3" />
                  <circle cx={pt.x} cy={pt.y} r="5" fill="#ffffff" stroke="#1a1a2e" strokeWidth="3" />
                  <text x={pt.x} y={svgHeight - 8} fontSize="11" fontWeight="600" fill="#64748b" textAnchor="middle">
                    {pt.data.label}
                  </text>
                  <text x={pt.x} y={pt.y - 10} fontSize="11" fontWeight="700" fill="#1a1a2e" textAnchor="middle">
                    {pt.data.val.toFixed(1)}M
                  </text>
                </g>
              ))}

              {areaD && <path d={areaD} fill="url(#revenueGrad)" />}
              {pathD && <path d={pathD} fill="none" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />}
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Orders Table */}
      <div className="admin-table-card">
        <div className="admin-table-header">
          <div>
            <h3 className="admin-table-title">Đơn Hàng Gần Đây</h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Danh sách các đơn hàng vừa phát sinh trong hệ thống</span>
          </div>
          <button 
            className="admin-btn admin-btn--outline" 
            onClick={() => onNavigateTab('don-hang')}
            style={{ fontSize: '13px' }}
          >
            Xem tất cả <ChevronRight size={16} />
          </button>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã Đơn</th>
                <th>Khách Hàng</th>
                <th>Ngày Đặt</th>
                <th>Tổng Tiền</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {displayOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    Chưa có đơn hàng nào phát sinh trong hệ thống.
                  </td>
                </tr>
              ) : (
                displayOrders.map((ord, idx) => {
                  const code = ord.orderCode || `#ORD-${ord.orderId || idx + 1}`;
                  const customerName = (ord.lastName || ord.firstName) 
                    ? `${ord.lastName || ''} ${ord.firstName || ''}`.trim() 
                    : (ord.email?.split('@')[0] || 'Khách hàng');
                  const emailStr = ord.email || '';
                  const dateVal = formatDate(ord.createdAt);
                  const totalVal = formatVND(ord.totalAmount);
                  const badge = getStatusBadge(ord.orderStatus);

                  return (
                    <tr key={ord.orderId || idx}>
                      <td style={{ fontWeight: 700, color: '#2563eb' }}>{code}</td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '13.5px' }}>
                          {customerName}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{emailStr}</div>
                      </td>
                      <td style={{ fontSize: '13px', color: '#334155' }}>{dateVal}</td>
                      <td style={{ fontWeight: 700, color: '#0f172a', fontSize: '13.5px' }}>{totalVal}</td>
                      <td>
                        <span
                          className="admin-badge"
                          style={{
                            backgroundColor: badge.bg,
                            color: badge.color,
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            display: 'inline-block'
                          }}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td>
                        <button
                          className="admin-btn admin-btn--outline"
                          style={{ padding: '5px 10px', fontSize: '12px' }}
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
        </div>
      </div>
    </div>
  );
}
