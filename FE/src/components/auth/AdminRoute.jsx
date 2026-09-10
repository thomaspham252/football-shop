import { Navigate, useLocation } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

export default function AdminRoute({ children }) {
  const { toast } = useToast();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  // 1. Kiểm tra nếu chưa đăng nhập hoặc token không hợp lệ
  if (!token || token === 'undefined' || token === 'null' || !userStr || userStr === 'undefined') {
    return <Navigate to={`/dang-nhap?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  try {
    const user = JSON.parse(userStr);
    const role = String(user?.role || '').toUpperCase();
    
    // 2. Chấp nhận các định dạng Role: ADMIN, ROLE_ADMIN, STAFF, ROLE_STAFF
    const isAllowed = role.includes('ADMIN') || role.includes('STAFF');

    if (!isAllowed) {
      toast.error("Bạn không có quyền truy cập");
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    console.error("Lỗi đọc thông tin người dùng từ localStorage:", e);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/dang-nhap" replace />;
  }

  return children;
}
