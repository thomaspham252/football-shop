import { useState } from 'react';
import { Eye, EyeOff, User, Mail, Phone, Lock, ArrowRight, Gift } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import './LoginPage.css';
import './RegisterPage.css';

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree,       setAgree]       = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [errors,      setErrors]      = useState({});

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())                    e.fullName        = 'Vui lòng nhập họ tên';
    if (!form.email)                              e.email           = 'Vui lòng nhập email';
    else if (!/\S+@\S+\.\S+/.test(form.email))   e.email           = 'Email không hợp lệ';
    if (!form.phone)                              e.phone           = 'Vui lòng nhập số điện thoại';
    else if (!/^[0-9]{9,11}$/.test(form.phone.replace(/\s/g,''))) e.phone = 'Số điện thoại không hợp lệ';
    if (!form.password)                           e.password        = 'Vui lòng nhập mật khẩu';
    else if (form.password.length < 6)            e.password        = 'Mật khẩu tối thiểu 6 ký tự';
    if (!form.confirmPassword)                    e.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    else if (form.confirmPassword !== form.password) e.confirmPassword = 'Mật khẩu không khớp';
    if (!agree)                                   e.agree           = 'Bạn cần đồng ý với điều khoản';
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
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h2 className="login-card__left-title">
              Tham gia cộng đồng Football Shop ngay hôm nay.
            </h2>
            <p className="login-card__left-desc">
              Đăng ký để nhận ưu đãi độc quyền, theo dõi đơn hàng dễ dàng và trải nghiệm mua sắm thể thao chuyên nghiệp.
            </p>

            <div className="login-card__perks">
              {[
                { icon: <Gift size={15} />, text: 'Voucher 50.000đ cho đơn hàng đầu tiên' },
                { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>, text: 'Giao hàng miễn phí cho thành viên' },
                { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>, text: 'Ưu đãi sớm nhất khi có sản phẩm mới' },
              ].map((p, i) => (
                <div key={i} className="login-card__perk">
                  <span className="login-card__perk-icon">{p.icon}</span>
                  <span>{p.text}</span>
                </div>
              ))}
            </div>

            <div className="login-card__badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <div>
                <p className="login-card__badge-title">Bảo Mật Thông Tin Tuyệt Đối</p>
                <p className="login-card__badge-sub">Dữ liệu của bạn được mã hóa và bảo vệ an toàn.</p>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="login-card__right">
            <h1 className="login-form__title">Tạo Tài Khoản</h1>
            <p className="login-form__sub">
              Hoàn tất thông tin để bắt đầu mua sắm thể thao chuyên nghiệp.
            </p>

            {/* Social */}
            <div className="login-social reg-social">
              <button type="button" className="login-social__btn">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button type="button" className="login-social__btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple
              </button>
            </div>

            <div className="login-divider"><span>HOẶC ĐĂNG KÝ BẰNG EMAIL</span></div>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              {/* Họ tên */}
              <div className="login-field">
                <label className="login-field__label">Họ và Tên</label>
                <div className="reg-input-wrap">
                  <User size={15} className="reg-input-icon" />
                  <input type="text"
                    className={`login-field__input reg-input-with-icon ${errors.fullName ? 'login-field__input--error' : ''}`}
                    placeholder="Nguyễn Văn A"
                    value={form.fullName} onChange={set('fullName')}
                    autoComplete="name" />
                </div>
                {errors.fullName && <p className="login-field__error">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div className="login-field">
                <label className="login-field__label">Địa chỉ Email</label>
                <div className="reg-input-wrap">
                  <Mail size={15} className="reg-input-icon" />
                  <input type="email"
                    className={`login-field__input reg-input-with-icon ${errors.email ? 'login-field__input--error' : ''}`}
                    placeholder="ten@example.com"
                    value={form.email} onChange={set('email')}
                    autoComplete="email" />
                </div>
                {errors.email && <p className="login-field__error">{errors.email}</p>}
              </div>

              {/* Số điện thoại */}
              <div className="login-field">
                <label className="login-field__label">Số Điện Thoại</label>
                <div className="reg-input-wrap">
                  <Phone size={15} className="reg-input-icon" />
                  <input type="tel"
                    className={`login-field__input reg-input-with-icon ${errors.phone ? 'login-field__input--error' : ''}`}
                    placeholder="0901 234 567"
                    value={form.phone} onChange={set('phone')}
                    autoComplete="tel" />
                </div>
                {errors.phone && <p className="login-field__error">{errors.phone}</p>}
              </div>

              {/* Mật khẩu */}
              <div className="login-field">
                <label className="login-field__label">Mật Khẩu</label>
                <div className="login-field__pass-wrap reg-input-wrap">
                  <Lock size={15} className="reg-input-icon" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    className={`login-field__input reg-input-with-icon ${errors.password ? 'login-field__input--error' : ''}`}
                    placeholder="••••••••"
                    value={form.password} onChange={set('password')}
                    autoComplete="new-password" />
                  <button type="button" className="login-field__eye"
                    onClick={() => setShowPass(!showPass)}
                    aria-label={showPass ? 'Ẩn' : 'Hiện'}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="login-field__error">{errors.password}</p>}
              </div>

              {/* Xác nhận mật khẩu */}
              <div className="login-field">
                <label className="login-field__label">Xác Nhận Mật Khẩu</label>
                <div className="login-field__pass-wrap reg-input-wrap">
                  <Lock size={15} className="reg-input-icon" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    className={`login-field__input reg-input-with-icon ${errors.confirmPassword ? 'login-field__input--error' : ''}`}
                    placeholder="••••••••"
                    value={form.confirmPassword} onChange={set('confirmPassword')}
                    autoComplete="new-password" />
                  <button type="button" className="login-field__eye"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? 'Ẩn' : 'Hiện'}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="login-field__error">{errors.confirmPassword}</p>}
              </div>

              {/* Checkbox */}
              <div className="reg-agree">
                <label className="reg-agree__label">
                  <input type="checkbox" checked={agree}
                    onChange={e => setAgree(e.target.checked)} />
                  <span>
                    Tôi đồng ý với{' '}
                    <a href="/dieu-khoan">Điều khoản dịch vụ</a>
                    {' '}và{' '}
                    <a href="/chinh-sach/bao-mat">Chính sách bảo mật</a>.
                  </span>
                </label>
                {errors.agree && <p className="login-field__error">{errors.agree}</p>}
              </div>

              <button type="submit" className="login-submit" disabled={loading}>
                {loading
                  ? <span className="login-submit__spinner" />
                  : <><span>Tạo Tài Khoản</span><ArrowRight size={17} /></>
                }
              </button>
            </form>

            <p className="login-register" style={{ marginTop: 16 }}>
              Đã có tài khoản?{' '}
              <a href="/dang-nhap">Đăng nhập ngay</a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
