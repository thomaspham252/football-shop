import React, { useState } from 'react';
import { X, UserPlus, Mail, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AddUserModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('manager');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
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
              Đã thêm tài khoản thành công!
            </h4>
            <p style={{ fontSize: '13.5px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
              Thông tin đăng nhập đã được gửi tới email của người dùng.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="admin-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--admin-text-dark)', marginBottom: '6px' }}>
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Lê Thị Mai"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--admin-text-dark)', marginBottom: '6px' }}>
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
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--admin-text-dark)', marginBottom: '6px' }}>
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  required
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
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--admin-text-dark)', marginBottom: '6px' }}>
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
                  <option value="admin">Quản trị viên (Admin)</option>
                  <option value="manager">Quản lý cửa hàng</option>
                  <option value="inventory">Nhân viên Kho</option>
                  <option value="staff">Nhân viên Bán hàng</option>
                </select>
              </div>
            </div>

            <div className="admin-modal__footer">
              <button type="button" className="admin-btn admin-btn--outline" onClick={onClose}>
                Hủy
              </button>
              <button type="submit" className="admin-btn admin-btn--primary">
                Tạo tài khoản
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
