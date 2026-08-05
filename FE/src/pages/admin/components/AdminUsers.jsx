import React, { useState } from 'react';
import { 
  UserPlus, 
  Download, 
  Edit3, 
  Ban, 
  ShieldCheck, 
  Store, 
  Boxes, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Search,
  CheckCircle2
} from 'lucide-react';
import { initialUsersList, initialCustomersList } from '../mockData';

export default function AdminUsers({ onOpenAddUserModal }) {
  const [activeTab, setActiveTab] = useState('staff'); // 'staff' | 'customers'
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(initialUsersList);
  const [customers] = useState(initialCustomersList);

  const displayList = activeTab === 'staff' ? users : customers;

  const filteredList = displayList.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.phone.includes(searchQuery);
    const matchesRole = roleFilter === 'all' || u.roleType === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="admin-users-view">
      {/* Header Section */}
      <div className="admin-page-header">
        <div className="admin-page-header__left">
          <h1 className="admin-page-title">Quản lý người dùng</h1>
          <p className="admin-page-sub">Quản lý tài khoản nhân viên và khách hàng hệ thống.</p>
        </div>
        <button 
          className="admin-btn admin-btn--primary"
          onClick={onOpenAddUserModal}
        >
          <UserPlus size={18} /> Thêm người dùng
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--admin-border)', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('staff')}
          style={{
            padding: '12px 16px',
            fontSize: '15px',
            fontWeight: 700,
            color: activeTab === 'staff' ? 'var(--admin-primary)' : 'var(--admin-text-muted)',
            borderBottom: activeTab === 'staff' ? '3px solid var(--admin-accent)' : '3px solid transparent',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Nhân viên ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          style={{
            padding: '12px 16px',
            fontSize: '15px',
            fontWeight: 700,
            color: activeTab === 'customers' ? 'var(--admin-primary)' : 'var(--admin-text-muted)',
            borderBottom: activeTab === 'customers' ? '3px solid var(--admin-accent)' : '3px solid transparent',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Khách hàng ({customers.length})
        </button>
      </div>

      {/* Metric Summary Cards */}
      {activeTab === 'staff' && (
        <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '24px' }}>
          <div className="admin-stat-card">
            <div className="admin-stat-card__header">
              <span className="admin-stat-card__title">Quản trị viên</span>
              <span className="admin-stat-card__trend admin-stat-card__trend--up">
                <TrendingUp size={12} /> 0%
              </span>
            </div>
            <div className="admin-stat-card__val">3</div>
            <ShieldCheck className="admin-stat-card__icon-bg" />
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-card__header">
              <span className="admin-stat-card__title">Quản lý Cửa hàng</span>
              <span className="admin-stat-card__trend admin-stat-card__trend--up">
                <TrendingUp size={12} /> +2
              </span>
            </div>
            <div className="admin-stat-card__val">5</div>
            <Store className="admin-stat-card__icon-bg" />
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-card__header">
              <span className="admin-stat-card__title">Nhân viên Kho</span>
              <span className="admin-stat-card__trend admin-stat-card__trend--up">
                <CheckCircle2 size={12} /> Ổn định
              </span>
            </div>
            <div className="admin-stat-card__val">4</div>
            <Boxes className="admin-stat-card__icon-bg" />
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div 
        className="admin-table-card" 
        style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {activeTab === 'staff' && (
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid var(--admin-border)',
                fontSize: '13.5px',
                outline: 'none',
                background: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="manager">Quản lý cửa hàng</option>
              <option value="inventory">Nhân viên Kho</option>
              <option value="staff">Nhân viên Bán hàng</option>
            </select>
          )}

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
            <input
              type="text"
              placeholder="Tìm theo tên, email, sđt..."
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
        </div>

        <button className="admin-btn admin-btn--outline">
          <Download size={16} /> Xuất CSV
        </button>
      </div>

      {/* User / Customer Table */}
      <div className="admin-table-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tên & Email</th>
                <th>Số điện thoại</th>
                <th>{activeTab === 'staff' ? 'Vai trò' : 'Loại khách hàng'}</th>
                <th>{activeTab === 'staff' ? 'Đăng nhập lần cuối' : 'Tổng chi tiêu'}</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((usr) => (
                <tr key={usr.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: usr.color || 'var(--admin-primary)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '14px',
                          flexShrink: 0
                        }}
                      >
                        {usr.initials}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--admin-text-dark)' }}>{usr.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{usr.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{usr.phone}</td>
                  <td>
                    <span 
                      className="admin-badge"
                      style={{
                        backgroundColor: usr.roleType === 'admin' ? '#1e293b' : usr.roleType === 'manager' ? '#fff8ec' : '#f0f9ff',
                        color: usr.roleType === 'admin' ? '#ffffff' : usr.roleType === 'manager' ? '#b45309' : '#0369a1',
                        border: '1px solid var(--admin-border)'
                      }}
                    >
                      {usr.role}
                    </span>
                  </td>
                  <td>{activeTab === 'staff' ? usr.lastLogin : usr.totalSpent}</td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                      <button
                        title="Chỉnh sửa tài khoản"
                        style={{
                          background: 'none',
                          border: '1px solid var(--admin-border)',
                          borderRadius: '6px',
                          padding: '6px',
                          cursor: 'pointer',
                          color: 'var(--admin-text-body)'
                        }}
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        title="Vô hiệu hóa tài khoản"
                        style={{
                          background: 'none',
                          border: '1px solid var(--admin-border)',
                          borderRadius: '6px',
                          padding: '6px',
                          cursor: 'pointer',
                          color: 'var(--admin-danger)'
                        }}
                      >
                        <Ban size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>
            Hiển thị 1-{filteredList.length} của {filteredList.length} tài khoản
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button className="admin-btn admin-btn--outline" style={{ padding: '6px 10px' }}><ChevronLeft size={16} /></button>
            <button className="admin-btn admin-btn--primary" style={{ padding: '6px 12px' }}>1</button>
            <button className="admin-btn admin-btn--outline" style={{ padding: '6px 12px' }}>2</button>
            <button className="admin-btn admin-btn--outline" style={{ padding: '6px 10px' }}><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
