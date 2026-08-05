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
import wishlistApi from '../../api/wishlistApi';
import './ProfilePage.css';

export default function ProfilePage() {
  const [active, setActive] = useState('overview');
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/dang-nhap';
      return;
    }

    const updateWishlist = () => {
      const token = localStorage.getItem('token');
      if (token) {
        wishlistApi.getWishlist()
          .then(res => {
            if (Array.isArray(res.data)) {
              const formattedList = res.data.map(p => ({
                id: p.productId,
                name: p.productName,
                price: p.salePrice || p.basePrice,
                image: p.imageUrl
              }));
              setWishlist(formattedList);
              localStorage.setItem('wishlist', JSON.stringify(formattedList));
            }
          })
          .catch(() => {
            const stored = localStorage.getItem('wishlist');
            if (stored) setWishlist(JSON.parse(stored));
          });
      } else {
        const stored = localStorage.getItem('wishlist');
        if (stored) setWishlist(JSON.parse(stored));
      }
    };

    updateWishlist();
    window.addEventListener('wishlist-updated', updateWishlist);

    // Fetch user and orders
    Promise.all([
      authApi.getProfile()
        .then(res => {
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
          return res.data;
        })
        .catch(err => {
          console.error("Lỗi khi tải profile từ server:", err);
          return null;
        }),
      orderApi.getMyOrders()
        .then(res => res.data)
        .catch(err => {
          console.error("Lỗi khi tải đơn hàng từ server:", err);
          return [];
        })
    ])
      .then(([userData, ordersData]) => {
        if (userData) setUser(userData);
        if (ordersData) setOrders(ordersData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi tải thông tin tài khoản:", err);
        setLoading(false);
      });

    return () => {
      window.removeEventListener('wishlist-updated', updateWishlist);
    };
  }, []);

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    window.dispatchEvent(new Event('user-updated'));
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

  const refreshOrders = () => {
    orderApi.getMyOrders()
      .then(res => {
        if (res.data) setOrders(res.data);
      })
      .catch(err => console.error("Lỗi khi tải lại đơn hàng:", err));
  };

  const TABS = {
    overview: <Overview user={user} orders={orders} wishlist={wishlist} onNavigate={setActive} />,
    orders:   <OrderHistory orders={orders} onRefresh={refreshOrders} />,
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
