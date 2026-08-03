import { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Mail, Phone, Lock, ArrowRight, Gift } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import authApi from '../../api/authApi';
import './LoginPage.css';
import './RegisterPage.css';

// Thay đổi Client ID này bằng Google Client ID thực tế của bạn để đăng ký bằng Google
const GOOGLE_CLIENT_ID = "your-google-client-id.apps.googleusercontent.com";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree,       setAgree]       = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [errors,      setErrors]      = useState({});

  // Dynamic Google Client script mounting
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleLoginSuccess
        });
        window.google.accounts.id.renderButton(
          document.getElementById("google-register-button"),
          { theme: "outline", size: "large", width: "100%" }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleLoginSuccess = (response) => {
    setLoading(true);
    setErrors({});
    authApi.googleLogin(response.credential)
      .then(res => {
        setLoading(false);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        alert("Đăng nhập bằng Google thành công!");
        window.location.href = '/';
      })
      .catch(err => {
        setLoading(false);
        const errMsg = err.response?.data?.message || "Đăng nhập Google thất bại hoặc email đã đăng ký bằng phom thường!";
        setErrors({ google: errMsg });
      });
  };

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

    authApi.register({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      password: form.password
    })
      .then(res => {
        setLoading(false);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        alert("Đăng ký tài khoản thành công!");
        window.location.href = '/';
      })
      .catch(err => {
        setLoading(false);
        const errMsg = err.response?.data?.message || "Đăng ký tài khoản thất bại, vui lòng thử lại!";
        setErrors({ api: errMsg });
      });
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

            {errors.api && (
              <div className="login-field__error" style={{ background: 'rgba(211,47,47,0.1)', padding: '10px', borderRadius: '6px', textAlign: 'center', marginBottom: '1.5rem', border: '1px solid #d32f2f' }}>
                {errors.api}
              </div>
            )}

            {errors.google && (
              <div className="login-field__error" style={{ background: 'rgba(211,47,47,0.1)', padding: '10px', borderRadius: '6px', textAlign: 'center', marginBottom: '1.5rem', border: '1px solid #d32f2f' }}>
                {errors.google}
              </div>
            )}

            {/* Social - Deleted Apple, keeping only Google */}
            <div className="login-social reg-social" style={{ display: 'flex', justifyContent: 'center' }}>
              <div id="google-register-button" style={{ width: '100%' }}></div>
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
