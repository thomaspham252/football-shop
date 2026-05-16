import { useState } from 'react';
import { USER } from '../data/profileData';

export default function PersonalInfo() {
  const [form, setForm] = useState({ ...USER });
  const set = field => e => setForm(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="profile-card">
      <div className="profile-card__head">
        <h2 className="profile-card__title">Thông Tin Cá Nhân</h2>
      </div>
      <form className="profile-info-form" onSubmit={e => e.preventDefault()}>
        <div className="profile-info-form__row">
          <div className="profile-info-form__field">
            <label>Họ và Tên</label>
            <input type="text" value={form.name} onChange={set('name')} />
          </div>
          <div className="profile-info-form__field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={set('email')} />
          </div>
        </div>
        <div className="profile-info-form__row">
          <div className="profile-info-form__field">
            <label>Số Điện Thoại</label>
            <input type="tel" value={form.phone} onChange={set('phone')} />
          </div>
          <div className="profile-info-form__field">
            <label>Loại Tài Khoản</label>
            <input type="text" value={form.accountType} disabled />
          </div>
        </div>
        <div className="profile-info-form__field">
          <label>Địa Chỉ Giao Hàng</label>
          <input type="text" value={form.address} onChange={set('address')} />
        </div>
        <div className="profile-info-form__actions">
          <button type="submit" className="profile-info-form__save">Lưu Thay Đổi</button>
          <button
            type="button"
            className="profile-info-form__cancel"
            onClick={() => setForm({ ...USER })}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
