import { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import './ForgotPasswordPage.css';
import authApi from '../../api/authApi';
import { useToast } from '../../context/ToastContext';

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('');
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Vui lòng nhập email'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Email không hợp lệ'); return; }
    setError('');
    setLoading(true);
    
    try {
      await authApi.forgotPassword({ email });
      setSent(true);
      toast.success('Đã gửi link đặt lại mật khẩu thành công');
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-page">
      <Navbar />
      <main className="fp-main">
        <div className="fp-card">
          <a href="/dang-nhap" className="fp-back">
            <ArrowLeft size={15} /> Quay lại đăng nhập
          </a>

          {!sent ? (
            <>
              <div className="fp-icon"><Mail size={28} /></div>
              <h1 className="fp-title">Quên mật khẩu?</h1>
              <p className="fp-desc">
                Nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi link đặt lại mật khẩu cho bạn.
              </p>
              <form onSubmit={handleSubmit} className="fp-form" noValidate>
                <div className="fp-field">
                  <label>Địa chỉ Email</label>
                  <input
                    type="email"
                    placeholder="ten@example.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    className={error ? 'fp-input--error' : ''}
                    autoComplete="email"
                  />
                  {error && <p className="fp-error">{error}</p>}
                </div>
                <button type="submit" className="fp-submit" disabled={loading}>
                  {loading ? <span className="fp-spinner" /> : 'Gửi link đặt lại mật khẩu'}
                </button>
              </form>
            </>
          ) : (
            <div className="fp-success">
              <div className="fp-success__icon"><CheckCircle size={40} /></div>
              <h2 className="fp-success__title">Đã gửi email!</h2>
              <p className="fp-success__desc">
                Chúng tôi đã gửi link đặt lại mật khẩu đến <strong>{email}</strong>.
                Vui lòng kiểm tra hộp thư (kể cả thư mục spam).
              </p>
              <button className="fp-submit" onClick={() => { setSent(false); setEmail(''); }}>
                Gửi lại
              </button>
              <a href="/dang-nhap" className="fp-login-link">Quay lại đăng nhập</a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
