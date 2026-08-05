import React, { useState } from 'react';
import { X, RefreshCw, Boxes, CheckCircle2 } from 'lucide-react';

export default function AdjustStockModal({ isOpen, onClose }) {
  const [skuVariant, setSkuVariant] = useState('NK-MS9-GRN-42');
  const [transactionType, setTransactionType] = useState('import');
  const [quantityChange, setQuantityChange] = useState(10);
  const [referenceCode, setReferenceCode] = useState('IMP-2023-11');
  const [notes, setNotes] = useState('');
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
      <div className="admin-modal" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h3 className="admin-modal__title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={20} style={{ color: 'var(--admin-accent)' }} /> Điều chỉnh tồn kho
          </h3>
          <button className="admin-modal__close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="admin-modal__body" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <CheckCircle2 size={48} style={{ color: 'var(--admin-success)', margin: '0 auto 16px auto' }} />
            <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--admin-text-dark)' }}>
              Cập nhật giao dịch kho thành công!
            </h4>
            <p style={{ fontSize: '13.5px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
              Số lượng tồn kho thực tế đã được cập nhật thành công.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="admin-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--admin-text-dark)', marginBottom: '4px' }}>
                  Biến thể sản phẩm *
                </label>
                <select
                  value={skuVariant}
                  onChange={(e) => setSkuVariant(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--admin-border)',
                    fontSize: '13px',
                    outline: 'none',
                    background: '#ffffff'
                  }}
                >
                  <option value="NK-MS9-GRN-42">Nike Mercurial Superfly 9 (Mã: NK-MS9-GRN-42, Size 42)</option>
                  <option value="AD-PRED-BLK-41">Adidas Predator Elite FT FG (Mã: AD-PRED-BLK-41, Size 41)</option>
                  <option value="NK-FLT-WHT-5">Bóng Thi Đấu Nike Flight FIFA (Mã: NK-FLT-WHT-5)</option>
                  <option value="TS-RM-H24-L">Áo Real Madrid Home 24/25 (Mã: TS-RM-H24-L, Size L)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--admin-text-dark)', marginBottom: '4px' }}>
                    Loại giao dịch *
                  </label>
                  <select
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--admin-border)',
                      fontSize: '13px',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                  >
                    <option value="import">Nhập kho</option>
                    <option value="adjustment">Điều chỉnh kiểm kê</option>
                    <option value="return">Khách trả hàng</option>
                    <option value="damage">Báo hỏng / Hủy kho</option>
                    <option value="transfer">Chuyển kho</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--admin-text-dark)', marginBottom: '4px' }}>
                    Số lượng thay đổi *
                  </label>
                  <input
                    type="number"
                    required
                    value={quantityChange}
                    onChange={(e) => setQuantityChange(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--admin-border)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--admin-text-dark)', marginBottom: '4px' }}>
                  Mã chứng từ / Tham chiếu
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: #IMP-2023-11"
                  value={referenceCode}
                  onChange={(e) => setReferenceCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--admin-border)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--admin-text-dark)', marginBottom: '4px' }}>
                  Ghi chú lý do
                </label>
                <textarea
                  rows="2"
                  placeholder="Nhập đợt hàng mới từ hãng Nike / Điều chỉnh sau đợt đếm kho..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--admin-border)',
                    fontSize: '13px',
                    outline: 'none',
                    resize: 'none'
                  }}
                ></textarea>
              </div>
            </div>

            <div className="admin-modal__footer">
              <button type="button" className="admin-btn admin-btn--outline" onClick={onClose}>
                Hủy
              </button>
              <button type="submit" className="admin-btn admin-btn--primary">
                Cập nhật tồn kho
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
