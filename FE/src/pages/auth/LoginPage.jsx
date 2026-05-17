import { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import './LoginPage.css';

export default function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});

  const validate = () => {
    const e = {};
    if (!email)                           e.email    = 'Vui lòng nhập email';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email    = 'Email không hợp lệ';
    if (!password)                        e.password = 'Vui lòng nhập mật khẩu';
    else if (password.length < 6)         e.password = 'Mật khẩu tối thiểu 6 ký tự';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => { setLoading(false); window.location.href = '/'; }, 1500);
  };

  return (
    <div className="login-page">
      <Navbar />

      <main className="login-main">
        <div className="login-card">
          {/* Left panel */}
          <div className="login-card__left">
            <div className="login-card__left-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
              </svg>
            </div>
            <h2 className="login-card__left-title">
              Chào mừng trở lại với Football Shop.
            </h2>
            <p className="login-card__left-desc">
              Khám phá hàng ngàn sản phẩm thể thao chính hãng. Mua sắm dễ dàng, giao hàng nhanh chóng, đổi trả miễn phí.
            </p>
            <div className="login-card__badge">
              <ShieldCheck size={18} />
              <div>
                <p className="login-card__badge-title">Thanh Toán Bảo Mật 100%</p>
                <p className="login-card__badge-sub">Hơn 50.000+ khách hàng tin tưởng mua sắm mỗi ngày.</p>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="login-card__right">
            <h1 className="login-form__title">Đăng Nhập</h1>
            <p className="login-form__sub">
              Truy cập tài khoản Football Shop và theo dõi đơn hàng của bạn.
            </p>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="login-field">
                <label className="login-field__label">Địa chỉ Email</label>
                <input
                  type="email"
                  className={`login-field__input ${errors.email ? 'login-field__input--error' : ''}`}
                  placeholder="ten@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
                {errors.email && <p className="login-field__error">{errors.email}</p>}
              </div>

              <div className="login-field">
                <div className="login-field__label-row">
                  <label className="login-field__label">Mật khẩu</label>
                  <a href="/quen-mat-khau" className="login-field__forgot">Quên mật khẩu?</a>
                </div>
                <div className="login-field__pass-wrap">
                  <input
                    type={showPass ? 'text' : 'password'}
                    className={`login-field__input ${errors.password ? 'login-field__input--error' : ''}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button type="button" className="login-field__eye"
                    onClick={() => setShowPass(!showPass)}
                    aria-label={showPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && <p className="login-field__error">{errors.password}</p>}
              </div>

              <button type="submit" className="login-submit" disabled={loading}>
                {loading
                  ? <span className="login-submit__spinner" />
                  : <><span>Đăng Nhập</span><ArrowRight size={17} /></>
                }
              </button>
            </form>

            <div className="login-divider"><span>HOẶC TIẾP TỤC VỚI</span></div>

            <div className="login-social">
              <button className="login-social__btn">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="login-social__btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple
              </button>
            </div>

            <p className="login-register">
              Chưa có tài khoản?{' '}
              <a href="/dang-ky">Đăng ký miễn phí</a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
