import { User, ClipboardList, Heart, Settings, LogOut } from 'lucide-react';
import './ProfileSidebar.css';

const NAV = [
  { key: 'overview',    icon: <User size={17} />,          label: 'Tổng Quan Tài Khoản' },
  { key: 'orders',      icon: <ClipboardList size={17} />, label: 'Lịch Sử Đơn Hàng' },
  { key: 'wishlist',    icon: <Heart size={17} />,         label: 'Sản Phẩm Yêu Thích' },
  { key: 'info',        icon: <Settings size={17} />,      label: 'Thông Tin Cá Nhân' },
];

export default function ProfileSidebar({ active, onChange }) {
  return (
    <aside className="profile-sidebar">
      <ul className="profile-sidebar__nav">
        {NAV.map(item => (
          <li key={item.key}>
            <button
              className={`profile-sidebar__item ${active === item.key ? 'profile-sidebar__item--active' : ''}`}
              onClick={() => onChange(item.key)}
            >
              <span className="profile-sidebar__icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          </li>
        ))}

        <li className="profile-sidebar__divider" />

        <li>
          <button
            className="profile-sidebar__item profile-sidebar__item--logout"
            onClick={() => { window.location.href = '/dang-nhap'; }}
          >
            <span className="profile-sidebar__icon"><LogOut size={17} /></span>
            <span>Đăng Xuất</span>
          </button>
        </li>
      </ul>
    </aside>
  );
}
