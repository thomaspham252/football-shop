import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Boxes, 
  Layers, 
  ShoppingCart, 
  Users, 
  Settings, 
  Search, 
  Bell, 
  Mail, 
  Menu, 
  LogOut,
  Bot
} from 'lucide-react';
import './AdminLayout.css';

import AdminDashboard from './components/AdminDashboard';
import AdminInventory from './components/AdminInventory';
import AdminProducts from './components/AdminProducts';
import AdminOrders from './components/AdminOrders';
import AdminUsers from './components/AdminUsers';
import AdminBotDashboard from './components/AdminBotDashboard';
import AdminBotChatHistory from './components/AdminBotChatHistory';
import ChatManagement from './ChatManagement';

import CreateOrderModal from './modals/CreateOrderModal';
import AddUserModal from './modals/AddUserModal';
import AdjustStockModal from './modals/AdjustStockModal';
import OrderDetailsModal from './modals/OrderDetailsModal';

export default function AdminLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Modals state
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAdjustStockOpen, setIsAdjustStockOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const userRole = String(currentUser?.role || '').toUpperCase();
  const isAdmin = userRole.includes('ADMIN');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/dang-nhap';
  };

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
      case 'chatbot':
        return <ChatManagement />;
      case 'bot-dashboard':
        return <AdminBotDashboard />;
      case 'bot-chat-history':
        return <AdminBotChatHistory />;
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
                <input type="text" defaultValue="ULTRASPORT Football Shop" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--admin-border)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Email thông báo đơn hàng</label>
                <input type="email" defaultValue="admin@ultrasport.vn" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--admin-border)' }} />
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

          {isAdmin && (
            <button
              className={`admin-sidebar__nav-item ${activeTab === 'nguoi-dung' ? 'active' : ''}`}
              onClick={() => setActiveTab('nguoi-dung')}
            >
              <span className="admin-sidebar__nav-icon"><Users size={19} /></span>
              <span>Quản lý người dùng</span>
            </button>
          )}

          <div className="admin-sidebar__section-label" style={{ marginTop: '16px' }}>BOTADMIN AI</div>

          <button
            className={`admin-sidebar__nav-item ${activeTab === 'chatbot' ? 'active' : ''}`}
            onClick={() => setActiveTab('chatbot')}
          >
            <span className="admin-sidebar__nav-icon"><Bot size={19} /></span>
            <span>Quản lý Chatbot</span>
          </button>

          {isAdmin && (
            <>
              <div className="admin-sidebar__section-label" style={{ marginTop: '16px' }}>HỆ THỐNG</div>

              <button
                className={`admin-sidebar__nav-item ${activeTab === 'cai-dat' ? 'active' : ''}`}
                onClick={() => setActiveTab('cai-dat')}
              >
                <span className="admin-sidebar__nav-icon"><Settings size={19} /></span>
                <span>Cài đặt</span>
              </button>
            </>
          )}

          <button
            className="admin-sidebar__nav-item"
            onClick={handleLogout}
            style={{ color: '#ef4444' }}
          >
            <span className="admin-sidebar__nav-icon"><LogOut size={19} /></span>
            <span>Đăng xuất</span>
          </button>
        </nav>

        {/* User profile bottom item */}
        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__user-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isAdmin ? 'var(--admin-accent)' : '#3b82f6', color: '#fff', fontWeight: 700, borderRadius: '50%', width: '36px', height: '36px' }}>
              {(currentUser?.fullName || currentUser?.email || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="admin-sidebar__user-info">
              <span className="admin-sidebar__user-name">{currentUser?.fullName || currentUser?.email || 'Admin'}</span>
              <span className="admin-sidebar__user-role">
                {isAdmin ? 'Quản trị viên (ADMIN)' : 'Nhân viên (STAFF)'}
              </span>
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

            <div className="admin-header__search">
              <Search className="admin-header__search-icon" size={18} />
              <input
                type="text"
                className="admin-header__search-input"
                placeholder="Tìm kiếm đơn hàng, sản phẩm, phiên chat..."
              />
            </div>
          </div>

          <div className="admin-header__actions">
            <button className="admin-header__icon-btn" title="Thông báo">
              <Bell size={18} />
            </button>

            <button className="admin-header__icon-btn" title="Tin nhắn">
              <Mail size={18} />
            </button>

            <div className="admin-header__profile" onClick={handleLogout} style={{ cursor: 'pointer' }} title="Bấm để Đăng xuất">
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--admin-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
                {(currentUser?.fullName || currentUser?.email || 'A').charAt(0).toUpperCase()}
              </div>
              <span className="admin-header__profile-name">{currentUser?.fullName || currentUser?.email || 'Admin'}</span>
              <LogOut size={16} style={{ color: '#ef4444', marginLeft: '4px' }} />
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
        onOrderUpdated={() => setSelectedOrder(null)}
      />
    </div>
  );
}
