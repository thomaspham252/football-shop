import { useState, useEffect } from 'react';
import authApi from '../../../api/authApi';
import { useToast } from '../../../context/ToastContext';

export default function PersonalInfo({ user, onUpdate }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const set = field => e => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (form.password || form.confirmPassword) {
      if (form.password.length < 6) {
        toast.error('Mật khẩu mới phải chứa ít nhất 6 ký tự!');
        return;
      }
      if (form.password !== form.confirmPassword) {
        toast.error('Xác nhận mật khẩu mới không trùng khớp!');
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
      };
      if (form.password && form.password.trim().length >= 6) {
        payload.password = form.password;
      }
      const res = await authApi.updateProfile(payload);
      toast.success('Cập nhật thông tin cá nhân và mật khẩu thành công!');
      setForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
      if (onUpdate) {
        onUpdate(res.data);
      }
      window.dispatchEvent(new Event('user-updated'));
    } catch (err) {
      console.error("Lỗi khi cập nhật profile:", err);
      toast.error(err.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        password: '',
        confirmPassword: '',
      });
    }
  };

  return (
    <div className="profile-card">
      <div className="profile-card__head">
        <h2 className="profile-card__title">Thông Tin Cá Nhân</h2>
      </div>
      <form className="profile-info-form" onSubmit={handleSubmit}>
        <div className="profile-info-form__row">
          <div className="profile-info-form__field">
            <label>Họ và Tên</label>
            <input type="text" value={form.fullName} onChange={set('fullName')} required />
          </div>
          <div className="profile-info-form__field">
            <label>Email (Không thể thay đổi)</label>
            <input type="email" value={form.email} disabled style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }} />
          </div>
        </div>
        <div className="profile-info-form__row">
          <div className="profile-info-form__field">
            <label>Số Điện Thoại</label>
            <input type="tel" value={form.phone} onChange={set('phone')} />
          </div>
          <div className="profile-info-form__field">
            <label>Loại Tài Khoản</label>
            <input type="text" value={user?.role === 'ADMIN' ? 'Quản trị viên' : 'Thành viên'} disabled style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }} />
          </div>
        </div>
        <div className="profile-info-form__field">
          <label>Địa Chỉ </label>
          <input type="text" value={form.address} onChange={set('address')} />
        </div>
        
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #e2e8f0' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px' }}>
            Đặt / Cập Nhật Mật Khẩu (Dùng để đăng nhập bằng Email + Mật khẩu)
          </h3>
          <div className="profile-info-form__row">
            <div className="profile-info-form__field">
              <label>Mật Khẩu Mới</label>
              <input 
                type="password" 
                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)" 
                value={form.password} 
                onChange={set('password')} 
              />
            </div>
            <div className="profile-info-form__field">
              <label>Xác Nhận Mật Khẩu Mới</label>
              <input 
                type="password" 
                placeholder="Nhập lại mật khẩu mới" 
                value={form.confirmPassword} 
                onChange={set('confirmPassword')} 
              />
            </div>
          </div>
        </div>
        <div className="profile-info-form__actions">
          <button type="submit" className="profile-info-form__save" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </button>
          <button
            type="button"
            className="profile-info-form__cancel"
            onClick={handleCancel}
            disabled={saving}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
