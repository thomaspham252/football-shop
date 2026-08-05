import React from 'react';
import { X, Printer, Package, User, MapPin, Phone, Calendar, CreditCard, Truck } from 'lucide-react';

export default function OrderDetailsModal({ isOpen, order, onClose }) {
  if (!isOpen || !order) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <div>
            <h3 className="admin-modal__title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Chi tiết đơn hàng {order.orderCode}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
              Ngày đặt: {order.createdAt} | Phương thức: {order.paymentMethod}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="admin-btn admin-btn--outline" style={{ padding: '6px 10px', fontSize: '12.5px' }} onClick={() => alert('Đang in hóa đơn...')}>
              <Printer size={15} /> In hóa đơn
            </button>
            <button className="admin-modal__close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="admin-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Customer & Address Details matching Order.java */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--admin-text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={13} /> THÔNG TIN KHÁCH HÀNG
              </div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--admin-text-dark)' }}>
                {order.lastName} {order.firstName}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--admin-text-body)', marginTop: '2px' }}>SĐT: {order.phone}</div>
              <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{order.email}</div>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--admin-text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Truck size={13} /> ĐỊA CHỈ GIAO HÀNG & TRẠNG THÁI
              </div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                <span className="admin-badge admin-badge--success" style={{ fontSize: '10.5px' }}>{order.paymentStatus}</span>
                <span className="admin-badge admin-badge--info" style={{ fontSize: '10.5px' }}>{order.orderStatus}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--admin-text-body)', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                <MapPin size={14} style={{ color: 'var(--admin-text-muted)', marginTop: '2px', flexShrink: 0 }} /> 
                <span>{order.street}, {order.ward}, {order.district}, {order.province}</span>
              </div>
            </div>
          </div>

          {/* Itemized OrderItem List matching OrderItem.java */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--admin-text-dark)', marginBottom: '10px' }}>
              Danh sách sản phẩm trong đơn (OrderItem)
            </h4>
            <div style={{ border: '1px solid var(--admin-border)', borderRadius: '8px', overflow: 'hidden' }}>
              <table className="admin-table" style={{ margin: 0 }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th>Sản phẩm & Mã biến thể</th>
                    <th>Phân loại</th>
                    <th style={{ textAlign: 'center' }}>Số lượng</th>
                    <th style={{ textAlign: 'right' }}>Đơn giá</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.items || []).map((itm) => (
                    <tr key={itm.orderItemId}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--admin-text-dark)' }}>{itm.productName}</div>
                        <code style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px', fontSize: '11px', color: 'var(--admin-primary)' }}>
                          {itm.skuVariant}
                        </code>
                      </td>
                      <td style={{ fontSize: '12.5px' }}>Màu: {itm.color} | Cỡ: {itm.size}</td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>{itm.quantity}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{itm.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Summary matching Order.java */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--admin-border)', paddingTop: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '240px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--admin-text-muted)' }}>
                <span>Tiền hàng:</span>
                <span style={{ fontWeight: 600, color: 'var(--admin-text-dark)' }}>{order.subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--admin-text-muted)' }}>
                <span>Phí vận chuyển:</span>
                <span style={{ fontWeight: 600, color: 'var(--admin-text-dark)' }}>{order.shippingFee}</span>
              </div>
              {order.discountAmount && order.discountAmount !== '0 ₫' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--admin-danger)' }}>
                  <span>Giảm giá:</span>
                  <span style={{ fontWeight: 600 }}>-{order.discountAmount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--admin-border)', paddingTop: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--admin-text-dark)' }}>Tổng thanh toán:</span>
                <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--admin-accent)' }}>{order.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-modal__footer">
          <button className="admin-btn admin-btn--outline" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
