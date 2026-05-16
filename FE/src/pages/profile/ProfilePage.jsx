import { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProfileSidebar from '../../components/common/ProfileSidebar';
import Overview from './tabs/Overview';
import OrderHistory from './tabs/OrderHistory';
import Wishlist from './tabs/Wishlist';
import PersonalInfo from './tabs/PersonalInfo';
import './ProfilePage.css';

export default function ProfilePage() {
  const [active, setActive] = useState('overview');

  const TABS = {
    overview: <Overview onNavigate={setActive} />,
    orders:   <OrderHistory />,
    wishlist: <Wishlist />,
    info:     <PersonalInfo />,
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
