import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Boxes, 
  Layers, 
  ShoppingCart, 
  Users, 
  Plus, 
  Settings, 
  HelpCircle, 
  Search, 
  Bell, 
  Mail, 
  ShieldCheck,
  Trophy,
  ChevronDown,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import './AdminLayout.css';

import AdminDashboard from './components/AdminDashboard';
import AdminInventory from './components/AdminInventory';
import AdminProducts from './components/AdminProducts';
import AdminOrders from './components/AdminOrders';
import AdminUsers from './components/AdminUsers';

import CreateOrderModal from './modals/CreateOrderModal';
import AddUserModal from './modals/AddUserModal';
import AdjustStockModal from './modals/AdjustStockModal';
import OrderDetailsModal from './modals/OrderDetailsModal';

export default function AdminLayout() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'kho-hang' | 'san-pham' | 'don-hang' | 'nguoi-dung' | 'cai-dat'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modals state
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAdjustStockOpen, setIsAdjustStockOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpenOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <AdminDashboard 
            onNavigateTab={setActiveTab} 
            onViewOrderDetails={handleOpenOrderDetails} 
          />
        );
      case 'kho-hang':
        return (
          <AdminInventory 
            onOpenAdjustStockModal={() => setIsAdjustStockOpen(true)}
            onOpenCreateOrderModal={() => setIsCreateOrderOpen(true)}
          />
        );
      case 'san-pham':
        return <AdminProducts />;
      case 'don-hang':
        return (
          <AdminOrders 
            onOpenCreateOrderModal={() => setIsCreateOrderOpen(true)}
            onViewOrderDetails={handleOpenOrderDetails}
          />
        );
      case 'nguoi-dung':
        return (
          <AdminUsers 
            onOpenAddUserModal={() => setIsAddUserOpen(true)}
          />
        );
      case 'cai-dat':
        return (
          <div className="admin-table-card" style={{ padding: '32px' }}>
            <h2 className="admin-page-title" style={{ fontSize: '22px' }}>Cài đặt hệ thống Admin</h2>
            <p className="admin-page-sub" style={{ marginTop: '8px' }}>
              Tùy chỉnh thông tin cửa hàng, thông báo email, tích hợp cổng thanh toán và phân quyền.
            </p>
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Tên cửa hàng</label>
                <input type="text" defaultValue="The Pitch Football Shop" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--admin-border)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Email thông báo đơn hàng</label>
                <input type="email" defaultValue="admin@footballshop.vn" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--admin-border)' }} />
              </div>
              <button className="admin-btn admin-btn--primary" style={{ width: 'fit-content', marginTop: '10px' }}>
                Lưu cấu hình
              </button>
            </div>
          </div>
        );
      default:
        return <AdminDashboard onNavigateTab={setActiveTab} onViewOrderDetails={handleOpenOrderDetails} />;
    }
  };

  return (
    <div className="admin-wrapper">
      {/* ── LEFT SIDEBAR ── */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {/* Brand logo header matching ULTRA SPORT website */}
        <a href="/" className="admin-sidebar__brand" style={{ textDecoration: 'none', padding: '24px 20px' }}>
          <div className="admin-sidebar__brand-info">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '24px', fontWeight: 900, fontStyle: 'italic', fontFamily: "Georgia, 'Times New Roman', serif", color: '#ffffff', letterSpacing: '-0.5px' }}>ULTRA</span>
              <span style={{ fontSize: '24px', fontWeight: 900, fontStyle: 'italic', fontFamily: "Georgia, 'Times New Roman', serif", color: 'var(--admin-accent)', letterSpacing: '-0.5px' }}>SPORT</span>
            </div>
            <span className="admin-sidebar__brand-sub" style={{ marginTop: '2px' }}>QUẢN TRỊ CỬA HÀNG</span>
          </div>
        </a>

        {/* Nav Items */}
        <nav className="admin-sidebar__nav">
          <div className="admin-sidebar__section-label">MENU CHÍNH</div>

          <button
            className={`admin-sidebar__nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="admin-sidebar__nav-icon"><LayoutDashboard size={19} /></span>
            <span>Bảng điều khiển</span>
          </button>

          <button
            className={`admin-sidebar__nav-item ${activeTab === 'kho-hang' ? 'active' : ''}`}
            onClick={() => setActiveTab('kho-hang')}
          >
            <span className="admin-sidebar__nav-icon"><Boxes size={19} /></span>
            <span>Kho hàng</span>
            <span className="admin-sidebar__badge">24</span>
          </button>

          <button
            className={`admin-sidebar__nav-item ${activeTab === 'san-pham' ? 'active' : ''}`}
            onClick={() => setActiveTab('san-pham')}
          >
            <span className="admin-sidebar__nav-icon"><Layers size={19} /></span>
            <span>Quản lý sản phẩm</span>
          </button>

          <button
            className={`admin-sidebar__nav-item ${activeTab === 'don-hang' ? 'active' : ''}`}
            onClick={() => setActiveTab('don-hang')}
          >
            <span className="admin-sidebar__nav-icon"><ShoppingCart size={19} /></span>
            <span>Quản lý đơn hàng</span>
          </button>

          <button
            className={`admin-sidebar__nav-item ${activeTab === 'nguoi-dung' ? 'active' : ''}`}
            onClick={() => setActiveTab('nguoi-dung')}
          >
            <span className="admin-sidebar__nav-icon"><Users size={19} /></span>
            <span>Quản lý người dùng</span>
          </button>

          <div className="admin-sidebar__section-label" style={{ marginTop: '16px' }}>HỆ THỐNG</div>

          <button
            className={`admin-sidebar__nav-item ${activeTab === 'cai-dat' ? 'active' : ''}`}
            onClick={() => setActiveTab('cai-dat')}
          >
            <span className="admin-sidebar__nav-icon"><Settings size={19} /></span>
            <span>Cài đặt</span>
          </button>

          <button
            className="admin-sidebar__nav-item"
            onClick={() => alert('Tổng đài hỗ trợ kỹ thuật: 1900 6789')}
          >
            <span className="admin-sidebar__nav-icon"><HelpCircle size={19} /></span>
            <span>Hỗ trợ</span>
          </button>
        </nav>

        {/* User profile bottom item */}
        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Avatar Admin"
              className="admin-sidebar__user-avatar"
            />
            <div className="admin-sidebar__user-info">
              <span className="admin-sidebar__user-name">Nguyễn Văn A</span>
              <span className="admin-sidebar__user-role">Quản lý kho</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              className="admin-header__icon-btn" 
              style={{ display: 'none' }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={20} />
            </button>

            {/* Global Search Bar */}
            <div className="admin-header__search">
              <Search className="admin-header__search-icon" size={18} />
              <input
                type="text"
                className="admin-header__search-input"
                placeholder="Tìm kiếm đơn hàng, sản phẩm, khách hàng..."
              />
            </div>
          </div>

          {/* Header Action Tools */}
          <div className="admin-header__actions">
            <button className="admin-header__icon-btn" title="Thông báo">
              <Bell size={18} />
              <span className="admin-header__badge-dot">3</span>
            </button>

            <button className="admin-header__icon-btn" title="Tin nhắn">
              <Mail size={18} />
            </button>

            <div className="admin-header__profile">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Profile Avatar"
                className="admin-header__profile-avatar"
              />
              <span className="admin-header__profile-name">Nguyễn Văn A</span>
              <ChevronDown size={14} style={{ color: 'var(--admin-text-muted)' }} />
            </div>
          </div>
        </header>

        {/* Active View Container */}
        <div className="admin-content">
          {renderActiveView()}
        </div>
      </main>

      {/* ── INTERACTIVE MODALS ── */}
      <CreateOrderModal 
        isOpen={isCreateOrderOpen} 
        onClose={() => setIsCreateOrderOpen(false)} 
      />

      <AddUserModal 
        isOpen={isAddUserOpen} 
        onClose={() => setIsAddUserOpen(false)} 
      />

      <AdjustStockModal 
        isOpen={isAdjustStockOpen} 
        onClose={() => setIsAdjustStockOpen(false)} 
      />

      <OrderDetailsModal 
        isOpen={!!selectedOrder} 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />
    </div>
  );
}
