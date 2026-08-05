import { useState, useEffect } from 'react';
import { Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import authApi from '../../api/authApi';
import { useToast } from '../../context/ToastContext';
import './LoginPage.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id.apps.googleusercontent.com";

export default function LoginPage() {
  const { toast } = useToast();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});

  // Dynamic Google Client script mounting
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID;

    const initGoogleBtn = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleLoginSuccess
        });
        const btnContainer = document.getElementById("google-login-button");
        if (btnContainer) {
          btnContainer.innerHTML = "";
          window.google.accounts.id.renderButton(
            btnContainer,
            { theme: "outline", size: "large", width: "100%" }
          );
        }
      }
    };

    if (window.google && window.google.accounts) {
      initGoogleBtn();
    } else {
      const script = document.createElement('script');
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogleBtn;
      document.body.appendChild(script);
    }
  }, []);

  const handleGoogleLoginSuccess = (response) => {
    setLoading(true);
    setErrors({});
    authApi.googleLogin(response.credential)
      .then(res => {
        setLoading(false);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        toast.success("Đăng nhập bằng Google thành công!");
        const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/';
        window.location.href = redirectUrl;
      })
      .catch(err => {
        setLoading(false);
        const errMsg = err.response?.data?.message || "Đăng nhập Google thất bại hoặc email đã đăng ký bằng phom thường!";
        setErrors({ google: errMsg });
        toast.error(errMsg);
      });
  };

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

    authApi.login({ email, password })
      .then(res => {
        setLoading(false);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        toast.success("Đăng nhập thành công!");
        const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/';
        window.location.href = redirectUrl;
      })
      .catch(err => {
        setLoading(false);
        const errMsg = err.response?.data?.message || "Email hoặc mật khẩu không chính xác!";
        setErrors({ api: errMsg });
        toast.error(errMsg);
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

            {/* Social Logins - Deleted Apple, keeping only Google */}
            <div className="login-social" style={{ display: 'flex', justifyContent: 'center' }}>
              <div id="google-login-button" style={{ width: '100%' }}></div>
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
