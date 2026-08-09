import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2, Loader2 } from 'lucide-react';
import { adminApi } from '../../../api/adminApi';
import { useToast } from '../../../context/ToastContext';

export default function AddUserModal({ isOpen, onClose, onUserCreated }) {
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('ROLE_STAFF');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast.warning("Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
      return;
    }

    try {
      setLoading(true);
      await adminApi.createUser({
        fullName,
        email,
        password,
        phone,
        role
      });

      setSubmitted(true);
      toast.success(`Tạo tài khoản ${email} thành công!`);

      setTimeout(() => {
        setSubmitted(false);
        setFullName('');
        setEmail('');
        setPassword('');
        setPhone('');
        setRole('ROLE_STAFF');
        onClose();
        if (onUserCreated) onUserCreated();
      }, 1200);
    } catch (err) {
      const msg = err.response?.data?.message || "Tạo tài khoản người dùng thất bại!";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h3 className="admin-modal__title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={20} style={{ color: 'var(--admin-accent)' }} /> Thêm người dùng mới
          </h3>
          <button className="admin-modal__close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="admin-modal__body" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <CheckCircle2 size={48} style={{ color: 'var(--admin-success)', margin: '0 auto 16px auto' }} />
            <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--admin-text-dark)' }}>
              Tạo tài khoản thành công!
            </h4>
            <p style={{ fontSize: '13.5px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
              Tài khoản {email} đã được thêm vào hệ thống.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="admin-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Lê Thị Mai"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--admin-border)',
                    fontSize: '13.5px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                  Địa chỉ Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="mai.lt@thepitch.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--admin-border)',
                    fontSize: '13.5px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                  Mật khẩu khởi tạo *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Mật khẩu tối thiểu 6 ký tự"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--admin-border)',
                    fontSize: '13.5px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  placeholder="0987 654 321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--admin-border)',
                    fontSize: '13.5px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                  Phân quyền vai trò *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
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
                  <option value="ROLE_STAFF">Nhân viên (ROLE_STAFF)</option>
                  <option value="ROLE_ADMIN">Quản trị viên (ROLE_ADMIN)</option>
                  <option value="ROLE_CUSTOMER">Khách hàng (ROLE_CUSTOMER)</option>
                </select>
              </div>
            </div>

            <div className="admin-modal__footer">
              <button type="button" className="admin-btn admin-btn--outline" onClick={onClose} disabled={loading}>
                Hủy
              </button>
              <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={16} /> : <UserPlus size={16} />} Tạo tài khoản
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
