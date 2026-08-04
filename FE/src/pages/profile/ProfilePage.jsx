import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProfileSidebar from '../../components/common/ProfileSidebar';
import Overview from './tabs/Overview';
import OrderHistory from './tabs/OrderHistory';
import Wishlist from './tabs/Wishlist';
import PersonalInfo from './tabs/PersonalInfo';
import authApi from '../../api/authApi';
import orderApi from '../../api/orderApi';
import './ProfilePage.css';

export default function ProfilePage() {
  const [active, setActive] = useState('overview');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/dang-nhap';
      return;
    }

    // Load wishlist
    const updateWishlist = () => {
      const stored = localStorage.getItem('wishlist');
      setWishlist(stored ? JSON.parse(stored) : []);
    };
    updateWishlist();
    window.addEventListener('wishlist-updated', updateWishlist);

    // Fetch user and orders
    Promise.all([
      authApi.getProfile(),
      orderApi.getMyOrders()
    ])
      .then(([profileRes, ordersRes]) => {
        setUser(profileRes.data);
        setOrders(ordersRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi tải thông tin tài khoản:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/dang-nhap';
        } else {
          setLoading(false);
        }
      });

    return () => {
      window.removeEventListener('wishlist-updated', updateWishlist);
    };
  }, []);

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />
        <main className="profile-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div style={{ fontSize: '18px', fontWeight: '500', color: '#666' }}>Đang tải thông tin tài khoản...</div>
        </main>
        <Footer />
      </div>
    );
  }

  const TABS = {
    overview: <Overview user={user} orders={orders} wishlist={wishlist} onNavigate={setActive} />,
    orders:   <OrderHistory orders={orders} />,
    wishlist: <Wishlist wishlist={wishlist} />,
    info:     <PersonalInfo user={user} onUpdate={handleUserUpdate} />,
  };

  return (
    <div className="profile-page">
      <Navbar />
      <main className="profile-main">
        <div className="profile-container">
          <ProfileSidebar active={active} onChange={setActive} />
          <div className="profile-content">
            {TABS[active]}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
