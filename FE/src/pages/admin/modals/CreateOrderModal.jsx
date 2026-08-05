import React, { useState } from 'react';
import { X, Plus, ShoppingBag, User, Phone, MapPin, CheckCircle2, Mail } from 'lucide-react';

export default function CreateOrderModal({ isOpen, onClose }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [ward, setWard] = useState('');
  const [district, setDistrict] = useState('');
  const [province, setProvince] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [selectedProduct, setSelectedProduct] = useState('1');
  const [quantity, setQuantity] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h3 className="admin-modal__title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} style={{ color: 'var(--admin-accent)' }} /> Tạo đơn hàng mới
          </h3>
          <button className="admin-modal__close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="admin-modal__body" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <CheckCircle2 size={48} style={{ color: 'var(--admin-success)', margin: '0 auto 16px auto' }} />
            <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--admin-text-dark)' }}>
              Tạo đơn hàng thành công!
            </h4>
            <p style={{ fontSize: '13.5px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
              Mã đơn hàng mới đã được khởi tạo và lưu vào hệ thống.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="admin-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--admin-text-dark)', marginBottom: '4px' }}>
                    Họ và tên lót *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Trần Văn"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--admin-text-dark)', marginBottom: '4px' }}>
                    Tên *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Bình"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--admin-text-dark)', marginBottom: '4px' }}>
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0912 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--admin-text-dark)', marginBottom: '4px' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="binh.tv@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Address fields */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--admin-text-dark)', marginBottom: '4px' }}>
                  Địa chỉ chi tiết *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Số 123 Đường Nguyễn Thị Thập"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--admin-text-dark)', marginBottom: '4px' }}>
                    Phường/Xã
                  </label>
                  <input
                    type="text"
                    placeholder="Phường Tân Phong"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '12.5px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--admin-text-dark)', marginBottom: '4px' }}>
                    Quận/Huyện
                  </label>
                  <input
                    type="text"
                    placeholder="Quận 7"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '12.5px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--admin-text-dark)', marginBottom: '4px' }}>
                    Tỉnh/Thành
                  </label>
                  <input
                    type="text"
                    placeholder="TP. Hồ Chí Minh"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '12.5px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--admin-text-dark)', marginBottom: '4px' }}>
                    Phương thức thanh toán
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none', background: '#ffffff' }}
                  >
                    <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                    <option value="BANK_TRANSFER">Chuyển khoản Ngân hàng</option>
                    <option value="MOMO">Ví MoMo</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--admin-text-dark)', marginBottom: '4px' }}>
                    Số lượng
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>
            </div>

            <div className="admin-modal__footer">
              <button type="button" className="admin-btn admin-btn--outline" onClick={onClose}>
                Hủy bỏ
              </button>
              <button type="submit" className="admin-btn admin-btn--primary">
                Tạo đơn hàng
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
