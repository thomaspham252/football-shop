import React, { useState } from 'react';
import { X, Printer, User, MapPin, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { adminApi } from '../../../api/adminApi';

const formatVND = (amount) => {
  if (amount === undefined || amount === null) return '0 ₫';
  if (typeof amount === 'string' && amount.includes('₫')) return amount;
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function OrderDetailsModal({ isOpen, order, onClose, onOrderUpdated }) {
  const [updating, setUpdating] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  if (!isOpen || !order) return null;

  const handleUpdateStatus = async (newOrderStatus) => {
    try {
      setUpdating(true);
      setStatusMsg(null);
      await adminApi.updateOrderStatus(order.orderId, newOrderStatus);
      setStatusMsg({ type: 'success', text: `Đã cập nhật trạng thái đơn hàng thành: ${newOrderStatus}` });
      if (onOrderUpdated) onOrderUpdated();
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Cập nhật trạng thái thất bại!' });
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePayment = async (newPaymentStatus) => {
    try {
      setUpdating(true);
      setStatusMsg(null);
      await adminApi.updatePaymentStatus(order.orderId, newPaymentStatus);
      setStatusMsg({ type: 'success', text: `Đã cập nhật trạng thái thanh toán thành: ${newPaymentStatus}` });
      if (onOrderUpdated) onOrderUpdated();
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Cập nhật thanh toán thất bại!' });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <div>
            <h3 className="admin-modal__title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Chi tiết đơn hàng {order.orderCode}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
              Phương thức: {order.paymentMethod}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="admin-btn admin-btn--outline" style={{ padding: '6px 10px', fontSize: '12.5px' }} onClick={() => window.print()}>
              <Printer size={15} /> In hóa đơn
            </button>
            <button className="admin-modal__close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="admin-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {statusMsg && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: statusMsg.type === 'success' ? '#dcfce7' : '#fee2e2',
              color: statusMsg.type === 'success' ? '#15803d' : '#991b1b',
              border: `1px solid ${statusMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}`
            }}>
              {statusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {statusMsg.text}
            </div>
          )}

          {/* Quick Actions Bar */}
          <div style={{ backgroundColor: '#f1f5f9', padding: '12px 16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-dark)', textTransform: 'uppercase' }}>
              ⚡ Cập nhật nhanh trạng thái (Dành cho Admin / Staff):
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button 
                disabled={updating || order.orderStatus === 'PROCESSING'} 
                onClick={() => handleUpdateStatus('PROCESSING')}
                className="admin-btn admin-btn--outline"
                style={{ fontSize: '12px', padding: '4px 10px', backgroundColor: order.orderStatus === 'PROCESSING' ? '#e0f2fe' : '#fff' }}
              >
                Đang xử lý
              </button>

              <button 
                disabled={updating || order.orderStatus === 'SHIPPED'} 
                onClick={() => handleUpdateStatus('SHIPPED')}
                className="admin-btn admin-btn--outline"
                style={{ fontSize: '12px', padding: '4px 10px', backgroundColor: order.orderStatus === 'SHIPPED' ? '#e0f2fe' : '#fff' }}
              >
                Đang giao hàng
              </button>

              <button 
                disabled={updating || order.orderStatus === 'DELIVERED'} 
                onClick={() => handleUpdateStatus('DELIVERED')}
                className="admin-btn admin-btn--outline"
                style={{ fontSize: '12px', padding: '4px 10px', backgroundColor: order.orderStatus === 'DELIVERED' ? '#dcfce7' : '#fff', color: order.orderStatus === 'DELIVERED' ? '#15803d' : 'inherit' }}
              >
                Đã giao thành công
              </button>

              <button 
                disabled={updating || order.paymentStatus === 'PAID'} 
                onClick={() => handleUpdatePayment('PAID')}
                className="admin-btn admin-btn--outline"
                style={{ fontSize: '12px', padding: '4px 10px', backgroundColor: order.paymentStatus === 'PAID' ? '#dcfce7' : '#fff', color: order.paymentStatus === 'PAID' ? '#15803d' : 'inherit' }}
              >
                Đã thanh toán
              </button>

              <button 
                disabled={updating || order.orderStatus === 'CANCELLED'} 
                onClick={() => handleUpdateStatus('CANCELLED')}
                className="admin-btn admin-btn--outline"
                style={{ fontSize: '12px', padding: '4px 10px', color: '#b91c1c' }}
              >
                Hủy đơn
              </button>
            </div>
          </div>

          {/* Customer & Address Details */}
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

          {/* Itemized OrderItem List */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--admin-text-dark)', marginBottom: '10px' }}>
              Danh sách sản phẩm trong đơn (OrderItem)
            </h4>
            <div style={{ border: '1px solid var(--admin-border)', borderRadius: '8px', overflow: 'hidden' }}>
              <table className="admin-table" style={{ margin: 0 }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th>Sản phẩm</th>
                    <th>Phân loại</th>
                    <th style={{ textAlign: 'center' }}>Số lượng</th>
                    <th style={{ textAlign: 'right' }}>Đơn giá</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.items || []).map((itm, idx) => (
                    <tr key={itm.orderItemId || idx}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--admin-text-dark)' }}>
                          {itm.product?.productName || itm.productName || 'Sản phẩm'}
                        </div>
                      </td>
                      <td style={{ fontSize: '12.5px' }}>Màu: {itm.color} | Cỡ: {itm.size}</td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>{itm.quantity}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatVND(itm.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Summary */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--admin-border)', paddingTop: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '240px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--admin-text-muted)' }}>
                <span>Tiền hàng:</span>
                <span style={{ fontWeight: 600, color: 'var(--admin-text-dark)' }}>{formatVND(order.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--admin-text-muted)' }}>
                <span>Phí vận chuyển:</span>
                <span style={{ fontWeight: 600, color: 'var(--admin-text-dark)' }}>{formatVND(order.shippingFee)}</span>
              </div>
              {order.discountAmount && Number(order.discountAmount) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--admin-danger)' }}>
                  <span>Giảm giá:</span>
                  <span style={{ fontWeight: 600 }}>-{formatVND(order.discountAmount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--admin-border)', paddingTop: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--admin-text-dark)' }}>Tổng thanh toán:</span>
                <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--admin-accent)' }}>{formatVND(order.totalAmount)}</span>
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
