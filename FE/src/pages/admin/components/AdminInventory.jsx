import React, { useState } from 'react';
import { 
  Boxes, 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  RefreshCw, 
  Edit3, 
  Search,
  Plus,
  History,
  Barcode,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  SlidersHorizontal
} from 'lucide-react';

const initialInventoryItems = [
  {
    inventoryId: 1,
    variantId: 101,
    productName: "Nike Mercurial Superfly 9 Academy",
    skuVariant: "NK-MS9-GRN-42",
    color: "Xanh lục / Đen",
    size: "42",
    surfaceType: "FG (Sân cỏ tự nhiên)",
    barcode: "885920194821",
    quantityInStock: 15,
    quantityReserved: 5,
    quantityAvailable: 10,
    reorderLevel: 20,
    reorderQuantity: 50,
    lastRestocked: "05/10/2023 14:20",
    lastSold: "10/10/2023 09:15",
    lastCounted: "01/10/2023",
    status: "warning",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80"
  },
  {
    inventoryId: 2,
    variantId: 102,
    productName: "Adidas Predator Elite FT FG",
    skuVariant: "AD-PRED-BLK-41",
    color: "Đen / Đỏ",
    size: "41",
    surfaceType: "FG (Sân cỏ tự nhiên)",
    barcode: "406674920194",
    quantityInStock: 120,
    quantityReserved: 15,
    quantityAvailable: 105,
    reorderLevel: 30,
    reorderQuantity: 60,
    lastRestocked: "08/10/2023 10:00",
    lastSold: "11/10/2023 16:45",
    lastCounted: "01/10/2023",
    status: "normal",
    imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=100&auto=format&fit=crop&q=80"
  },
  {
    inventoryId: 3,
    variantId: 103,
    productName: "Bóng Thi Đấu Nike Flight FIFA Quality Pro",
    skuVariant: "NK-FLT-WHT-5",
    color: "Trắng / Cam",
    size: "Size 5",
    surfaceType: "Tiêu chuẩn",
    barcode: "885920993812",
    quantityInStock: 0,
    quantityReserved: 0,
    quantityAvailable: 0,
    reorderLevel: 10,
    reorderQuantity: 30,
    lastRestocked: "20/09/2023 08:30",
    lastSold: "09/10/2023 18:20",
    lastCounted: "01/10/2023",
    status: "danger",
    imageUrl: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=100&auto=format&fit=crop&q=80"
  },
  {
    inventoryId: 4,
    variantId: 104,
    productName: "Áo Thi Đấu Real Madrid Home 2024/25",
    skuVariant: "TS-RM-H24-L",
    color: "Trắng",
    size: "L",
    surfaceType: "Áo thi đấu",
    barcode: "406674998214",
    quantityInStock: 45,
    quantityReserved: 8,
    quantityAvailable: 37,
    reorderLevel: 15,
    reorderQuantity: 40,
    lastRestocked: "09/10/2023 11:15",
    lastSold: "11/10/2023 14:00",
    lastCounted: "01/10/2023",
    status: "normal",
    imageUrl: "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=100&auto=format&fit=crop&q=80"
  }
];

const initialHistoryItems = [
  {
    historyId: 1,
    variantSku: "NK-MS9-GRN-42",
    productName: "Nike Mercurial Superfly 9 Academy (Size 42)",
    transactionType: "import",
    transactionLabel: "Nhập kho",
    quantityChange: 50,
    previousQuantity: 10,
    newQuantity: 60,
    referenceCode: "#IMP-2023-10",
    referenceType: "Đơn nhập hàng",
    notes: "Nhập lô hàng chính hãng đợt 2 từ Nike Việt Nam",
    createdAt: "08/10/2023 10:30",
    recordedBy: "Nguyễn Văn A (Quản lý kho)"
  },
  {
    historyId: 2,
    variantSku: "AD-PRED-BLK-41",
    productName: "Adidas Predator Elite FT FG (Size 41)",
    transactionType: "sale",
    transactionLabel: "Xuất bán",
    quantityChange: -1,
    previousQuantity: 106,
    newQuantity: 105,
    referenceCode: "#ORD-9021",
    referenceType: "Đơn bán hàng",
    notes: "Xuất kho tự động khi tạo đơn hàng thành công",
    createdAt: "10/10/2023 14:30",
    recordedBy: "Hệ thống"
  },
  {
    historyId: 3,
    variantSku: "NK-FLT-WHT-5",
    productName: "Bóng Thi Đấu Nike Flight FIFA Quality Pro",
    transactionType: "adjustment",
    transactionLabel: "Điều chỉnh kiểm kê",
    quantityChange: -2,
    previousQuantity: 2,
    newQuantity: 0,
    referenceCode: "#ADJ-2023-01",
    referenceType: "Kiểm kê",
    notes: "Điều chỉnh số lượng thực tế sau đợt đếm kho tháng 10",
    createdAt: "01/10/2023 17:00",
    recordedBy: "Trần Văn Hùng (Nhân viên Kho)"
  }
];

export default function AdminInventory({ onOpenAdjustStockModal, onOpenCreateOrderModal }) {
  const [activeTab, setActiveTab] = useState('stock_list');
  const [inventoryList] = useState(initialInventoryItems);
  const [historyList] = useState(initialHistoryItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredItems = inventoryList.filter((item) => {
    const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.skuVariant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredHistory = historyList.filter((h) =>
    h.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.variantSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.referenceCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-inventory-view">
      {/* Top Header */}
      <div className="admin-page-header">
        <div className="admin-page-header__left">
          <h1 className="admin-page-title">Quản lý kho hàng</h1>
          <p className="admin-page-sub">Giám sát chi tiết số lượng tồn kho và lịch sử biến động sản phẩm.</p>
        </div>
      </div>

      {/* 3 Metric Summary Cards */}
      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '24px' }}>
        <div className="admin-stat-card">
          <div className="admin-stat-card__header">
            <span className="admin-stat-card__title">Tổng Tồn Thực Tế</span>
            <span className="admin-stat-card__trend admin-stat-card__trend--up">Ổn định</span>
          </div>
          <div className="admin-stat-card__val">180 <span style={{ fontSize: '13px', fontWeight: 500 }}>sản phẩm</span></div>
          <Boxes className="admin-stat-card__icon-bg" />
        </div>

        <div 
          className="admin-stat-card"
          style={{ backgroundColor: '#fef2f2', borderColor: '#fca5a5' }}
        >
          <div className="admin-stat-card__header">
            <span className="admin-stat-card__title" style={{ color: '#991b1b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
              Cảnh Báo Chạm Ngưỡng Nhập
            </span>
          </div>
          <div className="admin-stat-card__val" style={{ color: '#991b1b', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            2 <span style={{ fontSize: '13px', fontWeight: 500 }}>mặt hàng cần nhập thêm</span>
          </div>
          <AlertTriangle className="admin-stat-card__icon-bg" style={{ opacity: 0.15, color: '#ef4444' }} />
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__header">
            <span className="admin-stat-card__title">Khả Dụng Xuất Bán</span>
            <span className="admin-stat-card__trend admin-stat-card__trend--up" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>
              <CheckCircle2 size={12} /> Đã trừ đặt giữ
            </span>
          </div>
          <div className="admin-stat-card__val">152 <span style={{ fontSize: '13px', fontWeight: 500 }}>sản phẩm sẵn sàng</span></div>
          <CheckCircle2 className="admin-stat-card__icon-bg" />
        </div>
      </div>

      {/* Navigation Sub-tabs: Tồn kho hiện tại | Lịch sử biến động */}
      <div style={{ display: 'flex', gap: '28px', borderBottom: '2px solid var(--admin-border)', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('stock_list')}
          style={{
            padding: '12px 4px',
            fontSize: '15px',
            fontWeight: 700,
            color: activeTab === 'stock_list' ? 'var(--admin-primary)' : 'var(--admin-text-muted)',
            borderBottom: activeTab === 'stock_list' ? '3px solid var(--admin-primary)' : '3px solid transparent',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: '-2px'
          }}
        >
          Tồn kho hiện tại
        </button>

        <button
          onClick={() => setActiveTab('history')}
          style={{
            padding: '12px 4px',
            fontSize: '15px',
            fontWeight: 700,
            color: activeTab === 'history' ? 'var(--admin-primary)' : 'var(--admin-text-muted)',
            borderBottom: activeTab === 'history' ? '3px solid var(--admin-primary)' : '3px solid transparent',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: '-2px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <History size={17} /> Lịch sử biến động
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="admin-table-card" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '340px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
          <input
            type="text"
            placeholder="Tìm mã biến thể, tên sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13.5px', outline: 'none' }}
          />
        </div>

        {activeTab === 'stock_list' && (
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13.5px', outline: 'none', background: '#ffffff', cursor: 'pointer' }}
          >
            <option value="all">Trạng thái tồn: Tất cả</option>
            <option value="normal">Đủ hàng khả dụng</option>
            <option value="warning">Sắp chạm ngưỡng nhập</option>
            <option value="danger">Hết hàng (Tồn = 0)</option>
          </select>
        )}
      </div>

      {/* TAB 1: Inventory Table */}
      {activeTab === 'stock_list' && (
        <div className="admin-table-card">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Biến Thể Sản Phẩm</th>
                  <th>Phân Loại</th>
                  <th>Tồn Kho</th>
                  <th>Đã Đặt</th>
                  <th>Khả Dụng</th>
                  <th>Ngưỡng Nhập</th>
                  <th>Đề Xuất Nhập</th>
                  <th>Nhập Cuối</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.inventoryId}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={item.imageUrl} alt={item.productName} style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--admin-border)' }} />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--admin-text-dark)', fontSize: '13.5px' }}>{item.productName}</div>
                          <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', color: 'var(--admin-primary)', fontWeight: 700 }}>
                            {item.skuVariant}
                          </code>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px', color: 'var(--admin-text-body)' }}>Màu: {item.color} | Cỡ: {item.size}</div>
                    </td>
                    <td style={{ fontWeight: 700, fontSize: '14px' }}>{item.quantityInStock}</td>
                    <td style={{ color: 'var(--admin-text-muted)' }}>{item.quantityReserved}</td>
                    <td style={{ fontWeight: 700, color: item.quantityAvailable > 0 ? 'var(--admin-success-text)' : 'var(--admin-danger-text)' }}>
                      {item.quantityAvailable}
                    </td>
                    <td>
                      <span className={`admin-badge admin-badge--${item.status === 'warning' ? 'warning' : item.status === 'danger' ? 'danger' : 'neutral'}`} style={{ fontSize: '11px' }}>
                        {item.reorderLevel}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--admin-info-text)' }}>
                      +{item.reorderQuantity}
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                      {item.lastRestocked}
                    </td>
                    <td>
                      <button
                        className="admin-btn admin-btn--outline"
                        style={{ padding: '6px 10px' }}
                        onClick={onOpenAdjustStockModal}
                        title="Nhập / Điều chỉnh tồn kho"
                      >
                        <Edit3 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: InventoryHistory Table */}
      {activeTab === 'history' && (
        <div className="admin-table-card">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã Tham Chiếu</th>
                  <th>Biến Thể Sản Phẩm</th>
                  <th>Loại Giao Dịch</th>
                  <th>Số Lượng Thay Đổi</th>
                  <th>Tồn Trước → Sau</th>
                  <th>Ghi Chú</th>
                  <th>Thời Gian & Người Thực Hiện</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((h) => (
                  <tr key={h.historyId}>
                    <td>
                      <code style={{ background: '#eff6ff', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, color: '#1d4ed8' }}>
                        {h.referenceCode}
                      </code>
                      <div style={{ fontSize: '10.5px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>{h.referenceType}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--admin-text-dark)', fontSize: '13px' }}>{h.productName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>{h.variantSku}</div>
                    </td>
                    <td>
                      <span className={`admin-badge admin-badge--${h.transactionType === 'import' ? 'success' : h.transactionType === 'sale' ? 'info' : 'warning'}`} style={{ fontSize: '11px' }}>
                        {h.transactionLabel}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, fontSize: '14px', color: h.quantityChange > 0 ? 'var(--admin-success-text)' : 'var(--admin-danger-text)' }}>
                      {h.quantityChange > 0 ? `+${h.quantityChange}` : h.quantityChange}
                    </td>
                    <td style={{ fontSize: '13px', fontWeight: 600 }}>
                      {h.previousQuantity} → <span style={{ color: 'var(--admin-primary)' }}>{h.newQuantity}</span>
                    </td>
                    <td style={{ fontSize: '12.5px', color: 'var(--admin-text-body)', maxWidth: '240px' }}>
                      {h.notes}
                    </td>
                    <td>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--admin-text-dark)' }}>{h.createdAt}</div>
                      <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>{h.recordedBy}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
