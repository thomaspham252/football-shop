import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Download, 
  Edit3, 
  CheckCircle2,
  ShieldCheck, 
  Store, 
  Boxes, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Search,
  Trash2,
  Loader2,
  Lock,
  Unlock
} from 'lucide-react';
import { adminApi } from '../../../api/adminApi';
import { useToast } from '../../../context/ToastContext';

export default function AdminUsers({ onOpenAddUserModal }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('staff'); // 'staff' | 'customers'
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ TOTAL: 0, ADMIN: 0, STAFF: 0, CUSTOMER: 0 });

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // State quản lý Modal sửa vai trò
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('ROLE_STAFF');

  useEffect(() => {
    fetchUsers();
    fetchCounts();
  }, [activeTab, roleFilter, searchQuery, currentPage]);

  const fetchCounts = async () => {
    try {
      const data = await adminApi.getUserCounts();
      if (data) setCounts(data);
    } catch (err) {
      console.warn("Lỗi nạp thống kê tài khoản:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let targetRole = roleFilter;
      if (activeTab === 'customers') {
        targetRole = 'ROLE_CUSTOMER';
      } else if (activeTab === 'staff' && roleFilter === 'ALL') {
        targetRole = 'ALL';
      }

      const data = await adminApi.getUsers({
        role: targetRole,
        keyword: searchQuery.trim(),
        page: currentPage,
        size: 10
      });

      if (data && data.content) {
        let contentList = data.content;
        if (activeTab === 'staff' && roleFilter === 'ALL') {
          contentList = contentList.filter(u => u.role === 'ROLE_ADMIN' || u.role === 'ROLE_STAFF' || u.role === 'ADMIN' || u.role === 'STAFF');
        }
        setUsers(contentList);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || contentList.length);
      } else if (Array.isArray(data)) {
        setUsers(data);
        setTotalPages(1);
        setTotalElements(data.length);
      } else {
        setUsers([]);
        setTotalPages(1);
        setTotalElements(0);
      }
    } catch (err) {
      console.error("Lỗi nạp danh sách tài khoản:", err);
      toast.error("Không thể nạp danh sách người dùng từ máy chủ!");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await adminApi.toggleUserStatus(user.id);
      toast.success(`Đã ${user.enabled === false ? 'mở khóa' : 'khóa'} tài khoản ${user.email}`);
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || "Thao tác trạng thái tài khoản thất bại!";
      toast.error(msg);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`⚠️ Bạn có chắc chắn muốn XÓA tài khoản ${user.email}? Hành động này không thể hoàn tác!`)) {
      return;
    }
    try {
      await adminApi.deleteUser(user.id);
      toast.success(`Đã xóa tài khoản ${user.email} thành công!`);
      fetchUsers();
      fetchCounts();
    } catch (err) {
      const msg = err.response?.data?.message || "Không thể xóa tài khoản người dùng này!";
      toast.error(msg);
    }
  };

  const handleOpenRoleModal = (user) => {
    setEditingUser(user);
    setSelectedRole(user.role || 'ROLE_STAFF');
  };

  const handleSaveRole = async () => {
    if (!editingUser) return;
    try {
      await adminApi.updateUserRole(editingUser.id, selectedRole);
      toast.success(`Đã cập nhật vai trò tài khoản thành ${selectedRole}`);
      setEditingUser(null);
      fetchUsers();
      fetchCounts();
    } catch (err) {
      const msg = err.response?.data?.message || "Cập nhật vai trò thất bại!";
      toast.error(msg);
    }
  };

  const formatRoleLabel = (r) => {
    const roleStr = String(r || '').toUpperCase();
    if (roleStr === 'ROLE_ADMIN' || roleStr === 'ADMIN') return { label: 'Quản trị viên (Admin)', bg: '#1e293b', color: '#ffffff' };
    if (roleStr === 'ROLE_STAFF' || roleStr === 'STAFF') return { label: 'Nhân viên (Staff)', bg: '#e0f2fe', color: '#0369a1' };
    return { label: 'Khách hàng', bg: '#f1f5f9', color: '#475569' };
  };

  const getInitials = (name, email) => {
    if (name) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      return name.substring(0, 2).toUpperCase();
    }
    return email ? email.substring(0, 2).toUpperCase() : 'US';
  };

  return (
    <div className="admin-users-view">
      {/* Header Section */}
      <div className="admin-page-header">
        <div className="admin-page-header__left">
          <h1 className="admin-page-title">Quản lý người dùng</h1>
          <p className="admin-page-sub">Quản lý và phân quyền tài khoản quản trị, nhân viên và khách hàng (Dành riêng cho ROLE_ADMIN).</p>
        </div>
        <button 
          className="admin-btn admin-btn--primary"
          onClick={onOpenAddUserModal}
        >
          <UserPlus size={18} /> Thêm người dùng mới
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--admin-border)', marginBottom: '24px' }}>
        <button
          onClick={() => {
            setActiveTab('staff');
            setCurrentPage(0);
          }}
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
          Nhân viên & Quản trị ({counts.ADMIN + counts.STAFF})
        </button>

        <button
          onClick={() => {
            setActiveTab('customers');
            setCurrentPage(0);
          }}
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
          Khách hàng ({counts.CUSTOMER})
        </button>
      </div>

      {/* Metric Summary Cards */}
      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '24px' }}>
        <div className="admin-stat-card">
          <div className="admin-stat-card__header">
            <span className="admin-stat-card__title">Quản trị viên (Admin)</span>
            <span className="admin-stat-card__trend admin-stat-card__trend--up">
              <TrendingUp size={12} /> Toàn quyền
            </span>
          </div>
          <div className="admin-stat-card__val">{counts.ADMIN}</div>
          <ShieldCheck className="admin-stat-card__icon-bg" />
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__header">
            <span className="admin-stat-card__title">Nhân viên (Staff)</span>
            <span className="admin-stat-card__trend admin-stat-card__trend--up">
              <TrendingUp size={12} /> Vận hành đơn
            </span>
          </div>
          <div className="admin-stat-card__val">{counts.STAFF}</div>
          <Store className="admin-stat-card__icon-bg" />
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__header">
            <span className="admin-stat-card__title">Khách Hàng (Customer)</span>
            <span className="admin-stat-card__trend admin-stat-card__trend--up">
              <CheckCircle2 size={12} /> Đã đăng ký
            </span>
          </div>
          <div className="admin-stat-card__val">{counts.CUSTOMER}</div>
          <Boxes className="admin-stat-card__icon-bg" />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div 
        className="admin-table-card" 
        style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {activeTab === 'staff' && (
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(0);
              }}
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
              <option value="ALL">Tất cả vai trò</option>
              <option value="ROLE_ADMIN">Quản trị viên (Admin)</option>
              <option value="ROLE_STAFF">Nhân viên (Staff)</option>
            </select>
          )}

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Tìm theo tên, email, sđt..."
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
        </div>
      </div>

      {/* User Table */}
      <div className="admin-table-card">
        <div className="admin-table-wrapper">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', gap: '10px' }}>
              <Loader2 className="animate-spin" size={24} color="var(--admin-primary)" />
              <span style={{ color: '#64748b' }}>Đang nạp danh sách tài khoản từ API...</span>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tên & Email</th>
                  <th>Số điện thoại</th>
                  <th>Vai trò</th>
                  <th>Phương thức đăng nhập</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                      Không tìm thấy tài khoản người dùng phù hợp.
                    </td>
                  </tr>
                ) : (
                  users.map((usr) => {
                    const roleBadge = formatRoleLabel(usr.role);
                    const initials = getInitials(usr.fullName, usr.email);

                    return (
                      <tr key={usr.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: '#1e293b',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '13.5px',
                                flexShrink: 0
                              }}
                            >
                              {initials}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '13.5px' }}>
                                {usr.fullName || 'Khách hàng chưa cập nhật tên'}
                              </div>
                              <div style={{ fontSize: '12px', color: '#64748b' }}>{usr.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize: '13px', color: '#334155' }}>{usr.phone || 'Chưa cập nhật'}</td>
                        <td>
                          <span 
                            className="admin-badge"
                            style={{
                              backgroundColor: roleBadge.bg,
                              color: roleBadge.color,
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '11.5px',
                              fontWeight: 600
                            }}
                          >
                            {roleBadge.label}
                          </span>
                        </td>
                        <td style={{ fontSize: '13px', color: '#334155' }}>
                          <span className="admin-badge admin-badge--neutral" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                            {usr.provider || 'LOCAL'}
                          </span>
                        </td>
                        <td>
                          <span 
                            className="admin-badge"
                            style={{
                              backgroundColor: usr.enabled !== false ? '#dcfce7' : '#fee2e2',
                              color: usr.enabled !== false ? '#15803d' : '#b91c1c',
                              fontSize: '11px',
                              fontWeight: 600
                            }}
                          >
                            {usr.enabled !== false ? 'Hoạt động' : 'Đã khóa'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                            <button
                              onClick={() => handleOpenRoleModal(usr)}
                              title="Thay đổi vai trò / Phân quyền"
                              style={{
                                background: 'none',
                                border: '1px solid var(--admin-border)',
                                borderRadius: '6px',
                                padding: '6px',
                                cursor: 'pointer',
                                color: '#2563eb'
                              }}
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(usr)}
                              title={usr.enabled !== false ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                              style={{
                                background: 'none',
                                border: '1px solid var(--admin-border)',
                                borderRadius: '6px',
                                padding: '6px',
                                cursor: 'pointer',
                                color: usr.enabled !== false ? '#d97706' : '#16a34a'
                              }}
                            >
                              {usr.enabled !== false ? <Lock size={15} /> : <Unlock size={15} />}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(usr)}
                              title="Xóa tài khoản"
                              style={{
                                background: 'none',
                                border: '1px solid var(--admin-border)',
                                borderRadius: '6px',
                                padding: '6px',
                                cursor: 'pointer',
                                color: '#dc2626'
                              }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Trang {currentPage + 1} / {totalPages} (Tổng {totalElements} tài khoản)
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

      {/* Modal chỉnh sửa Vai trò / Phân quyền */}
      {editingUser && (
        <div className="admin-modal-overlay" onClick={() => setEditingUser(null)}>
          <div className="admin-modal" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">Phân quyền vai trò người dùng</h3>
              <button className="admin-modal__close" onClick={() => setEditingUser(null)}>×</button>
            </div>
            <div className="admin-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>Tài khoản:</label>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '14px', marginTop: '2px' }}>
                  {editingUser.fullName} ({editingUser.email})
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12.5px', color: '#1e293b', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Chọn Vai trò mới:
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--admin-border)',
                    fontSize: '13.5px',
                    outline: 'none',
                    background: '#ffffff'
                  }}
                >
                  <option value="ROLE_CUSTOMER">Khách hàng (ROLE_CUSTOMER)</option>
                  <option value="ROLE_STAFF">Nhân viên (ROLE_STAFF)</option>
                  <option value="ROLE_ADMIN">Quản trị viên (ROLE_ADMIN)</option>
                </select>
              </div>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--outline" onClick={() => setEditingUser(null)}>
                Hủy
              </button>
              <button className="admin-btn admin-btn--primary" onClick={handleSaveRole}>
                Lưu vai trò
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
