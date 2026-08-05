import React, { useState } from 'react';
import { 
  Wallet, 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  ChevronRight,
  Eye,
  Calendar,
  Sparkles
} from 'lucide-react';
import { initialDashboardStats, revenueChartData, topSellingProducts, initialRecentOrders } from '../mockData';

export default function AdminDashboard({ onNavigateTab, onViewOrderDetails }) {
  const [timeRange, setTimeRange] = useState('7_days');
  const [stats] = useState(initialDashboardStats);

  // Simple SVG curved spline calculation
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingLeft = 35;
  const paddingBottom = 30;
  const paddingTop = 20;
  const paddingRight = 20;

  const chartW = svgWidth - paddingLeft - paddingRight;
  const chartH = svgHeight - paddingTop - paddingBottom;
  const maxVal = 32;

  const points = revenueChartData.map((d, index) => {
    const x = paddingLeft + (index / (revenueChartData.length - 1)) * chartW;
    const y = paddingTop + chartH - (d.val / maxVal) * chartH;
    return { x, y, data: d };
  });

  // Generate smooth cubic bezier path
  const pathD = points.reduce((acc, point, i, a) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const prev = a[i - 1];
    const cp1x = prev.x + (point.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (point.x - prev.x) / 2;
    const cp2y = point.y;
    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${point.x},${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${svgHeight - paddingBottom} L ${points[0].x},${svgHeight - paddingBottom} Z`;

  return (
    <div className="admin-dashboard-view">
      {/* Top Title Banner */}
      <div className="admin-page-header">
        <div className="admin-page-header__left">
          <h1 className="admin-page-title">Tổng quan hoạt động</h1>
          <p className="admin-page-sub">Số liệu cập nhật ngày hôm nay</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="admin-btn admin-btn--outline">
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
              <TrendingUp size={13} /> {stats.revenueGrowth}
            </span>
          </div>
          <div className="admin-stat-card__val">{stats.totalRevenue}</div>
          <Wallet className="admin-stat-card__icon-bg" />
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__header">
            <span className="admin-stat-card__title">Đơn Hàng Mới</span>
            <span className="admin-stat-card__trend admin-stat-card__trend--up">
              <TrendingUp size={13} /> {stats.ordersGrowth}
            </span>
          </div>
          <div className="admin-stat-card__val">{stats.newOrders}</div>
          <ShoppingBag className="admin-stat-card__icon-bg" />
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__header">
            <span className="admin-stat-card__title">Sản Phẩm Đã Bán</span>
            <span className="admin-stat-card__trend admin-stat-card__trend--up">
              <TrendingUp size={13} /> {stats.productsGrowth}
            </span>
          </div>
          <div className="admin-stat-card__val">{stats.productsSold}</div>
          <Package className="admin-stat-card__icon-bg" />
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__header">
            <span className="admin-stat-card__title">Khách Hàng Mới</span>
            <span className="admin-stat-card__trend admin-stat-card__trend--down">
              <TrendingDown size={13} /> {stats.customersGrowth}
            </span>
          </div>
          <div className="admin-stat-card__val">{stats.newCustomers}</div>
          <Users className="admin-stat-card__icon-bg" />
        </div>
      </div>

      {/* Middle Row: Revenue Chart & Top Selling Products */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', marginBottom: '24px' }}>
        {/* Revenue Trend Chart Card */}
        <div className="admin-table-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--admin-text-dark)', margin: 0 }}>
                Xu Hướng Doanh Thu
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>Đơn vị tính: Triệu VNĐ</span>
            </div>

            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--admin-border)',
                fontSize: '13px',
                outline: 'none',
                background: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <option value="7_days">7 Ngày qua</option>
              <option value="30_days">30 Ngày qua</option>
              <option value="this_month">Tháng này</option>
            </select>
          </div>

          {/* Interactive Chart Container */}
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1a1a2e" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0, 5, 10, 15, 20, 25, 30].map((val) => {
                const y = paddingTop + chartH - (val / maxVal) * chartH;
                return (
                  <g key={val}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={svgWidth - paddingRight}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingLeft - 8}
                      y={y + 4}
                      fontSize="10"
                      fill="#94a3b8"
                      textAnchor="end"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Gradient Area */}
              <path d={areaD} fill="url(#revenueGrad)" />

              {/* Curve Line */}
              <path d={pathD} fill="none" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />

              {/* Points & Labels */}
              {points.map((pt, idx) => (
                <g key={idx} style={{ cursor: 'pointer' }}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="#ffffff"
                    stroke="#1a1a2e"
                    strokeWidth="3"
                  />
                  <text
                    x={pt.x}
                    y={svgHeight - 8}
                    fontSize="11"
                    fontWeight="600"
                    fill="#64748b"
                    textAnchor="middle"
                  >
                    {pt.data.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Top Selling Products List Card */}
        <div className="admin-table-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--admin-text-dark)', margin: 0 }}>
              Sản Phẩm Bán Chạy
            </h3>
            <button 
              onClick={() => onNavigateTab('san-pham')} 
              style={{ background: 'none', border: 'none', color: 'var(--admin-accent)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              Tất cả
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {topSellingProducts.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--admin-border)'
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text-dark)', margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </h4>
                  <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>{item.sku}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--admin-primary)' }}>{item.sold}</div>
                  <span style={{ fontSize: '10px', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>ĐÃ BÁN</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Orders Table */}
      <div className="admin-table-card">
        <div className="admin-table-header">
          <div>
            <h3 className="admin-table-title">Đơn Hàng Gần Đây</h3>
            <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>Danh sách các giao dịch vừa phát sinh</span>
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
              {initialRecentOrders.map((ord) => (
                <tr key={ord.id}>
                  <td style={{ fontWeight: 700, color: 'var(--admin-primary)' }}>{ord.id}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--admin-text-dark)' }}>{ord.customer}</div>
                    <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>{ord.email}</div>
                  </td>
                  <td>{ord.date}</td>
                  <td style={{ fontWeight: 700, color: 'var(--admin-text-dark)' }}>{ord.total}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${ord.badgeType}`}>
                      {ord.shippingStatus}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
