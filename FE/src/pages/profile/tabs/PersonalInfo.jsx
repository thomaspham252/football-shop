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
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const set = field => e => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const res = await authApi.updateProfile({
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
      });
      toast.success('Cập nhật thông tin thành công!');
      if (onUpdate) {
        onUpdate(res.data);
      }
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
