import React, { useState, useEffect } from 'react';
import { 
  Boxes, 
  AlertTriangle, 
  CheckCircle2, 
  Search,
  Plus,
  History,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Edit3,
  PackagePlus
} from 'lucide-react';
import { adminApi } from '../../../api/adminApi';
import { useToast } from '../../../context/ToastContext';

export default function AdminInventory() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'history'

  const [inventoryItems, setInventoryItems] = useState([]);
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Phân trang
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Modals
  const [editingItem, setEditingItem] = useState(null);
  const [editStockQty, setEditStockQty] = useState('');
  const [editReorderLevel, setEditReorderLevel] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Modal Nhập kho (Import)
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importVariantId, setImportVariantId] = useState('');
  const [importQty, setImportQty] = useState(20);
  const [importRefCode, setImportRefCode] = useState('');
  const [importNotes, setImportNotes] = useState('');

  useEffect(() => {
    if (activeTab === 'inventory') {
      fetchInventory();
    } else {
      fetchHistory();
    }
  }, [activeTab, searchQuery, statusFilter, currentPage]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getInventory({
        keyword: searchQuery.trim(),
        status: statusFilter,
        page: currentPage,
        size: 10
      });

      if (data && data.content) {
        setInventoryItems(data.content);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      } else if (Array.isArray(data)) {
        setInventoryItems(data);
        setTotalPages(1);
        setTotalElements(data.length);
      } else {
        setInventoryItems([]);
        setTotalPages(1);
        setTotalElements(0);
      }
    } catch (err) {
      console.error("Lỗi nạp tồn kho từ API:", err);
      setInventoryItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getInventoryHistory({
        page: currentPage,
        size: 10
      });

      if (data && data.content) {
        setHistoryItems(data.content);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      } else if (Array.isArray(data)) {
        setHistoryItems(data);
        setTotalPages(1);
        setTotalElements(data.length);
      } else {
        setHistoryItems([]);
        setTotalPages(1);
        setTotalElements(0);
      }
    } catch (err) {
      console.error("Lỗi nạp lịch sử tồn kho từ API:", err);
      setHistoryItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setEditStockQty(item.quantityInStock !== undefined ? item.quantityInStock : 0);
    setEditReorderLevel(item.reorderLevel !== undefined ? item.reorderLevel : 10);
    setEditNotes('');
  };

  const handleSaveStock = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setSubmitting(true);
      await adminApi.updateInventoryStock(editingItem.inventoryId, {
        quantityInStock: parseInt(editStockQty) || 0,
        reorderLevel: parseInt(editReorderLevel) || 10,
        notes: editNotes
      });
      toast.success("Đã cập nhật tồn kho & định mức cảnh báo thành công!");
      setEditingItem(null);
      fetchInventory();
    } catch (err) {
      toast.error("Cập nhật tồn kho thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!importVariantId) {
      toast.warning("Vui lòng chọn hoặc nhập biến thể sản phẩm cần nhập!");
      return;
    }

    try {
      setSubmitting(true);
      await adminApi.importInventoryStock({
        variantId: parseInt(importVariantId),
        addQuantity: parseInt(importQty) || 1,
        referenceCode: importRefCode,
        notes: importNotes
      });
      toast.success(`Đã nhập hàng thành công (+${importQty})!`);
      setIsImportOpen(false);
      setImportVariantId('');
      setImportRefCode('');
      setImportNotes('');
      fetchInventory();
    } catch (err) {
      toast.error("Không thể hoàn tất đơn nhập kho!");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (str) => {
    if (!str) return 'Chưa cập nhật';
    try {
      const d = new Date(str);
      return d.toLocaleString('vi-VN');
    } catch (e) {
      return str;
    }
  };

  return (
    <div className="admin-inventory-view">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-header__left">
          <h1 className="admin-page-title">Quản lý kho hàng & Kiểm kê tồn kho</h1>
          <p className="admin-page-sub">Theo dõi tồn kho khả dụng, cảnh báo hết hàng và lịch sử biến động nhập/xuất tự động từ Database.</p>
        </div>

        <button 
          className="admin-btn admin-btn--primary"
          onClick={() => setIsImportOpen(true)}
        >
          <PackagePlus size={18} /> Tạo đơn nhập kho
        </button>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: '28px', borderBottom: '2px solid var(--admin-border)', marginBottom: '24px' }}>
        <button
          onClick={() => {
            setActiveTab('inventory');
            setCurrentPage(0);
          }}
          style={{
            padding: '12px 4px',
            fontSize: '15px',
            fontWeight: 700,
            color: activeTab === 'inventory' ? 'var(--admin-primary)' : 'var(--admin-text-muted)',
            borderBottom: activeTab === 'inventory' ? '3px solid var(--admin-primary)' : '3px solid transparent',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: '-2px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Boxes size={18} /> Danh sách tồn kho
        </button>

        <button
          onClick={() => {
            setActiveTab('history');
            setCurrentPage(0);
          }}
          style={{
            padding: '12px 4px',
            fontSize: '15px',
            fontWeight: 700,
            color: activeTab === 'history' ? 'var(--admin-primary)' : 'var(--admin-text-muted)',
            borderBottom: activeTab === 'history' ? '3px solid var(--admin-primary)' : '3px solid transparent',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: '-2px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <History size={18} /> Nhật ký nhập/xuất kho
        </button>
      </div>

      {/* TAB 1: DANH SÁCH TỒN KHO */}
      {activeTab === 'inventory' && (
        <>
          <div className="admin-table-card" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ position: 'relative', width: '340px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Tìm tên sản phẩm, mã SKU, màu sắc..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(0);
                }}
                style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13.5px', outline: 'none' }}
              />
            </div>
          </div>

          <div className="admin-table-card">
            <div className="admin-table-wrapper">
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', gap: '10px' }}>
                  <Loader2 className="animate-spin" size={24} color="var(--admin-primary)" />
                  <span style={{ color: '#64748b' }}>Đang nạp thông tin tồn kho từ API...</span>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm & phân loại</th>
                      <th>Mã SKU</th>
                      <th>Tổng tồn kho</th>
                      <th>Sẵn sàng bán</th>
                      <th>Đang giữ</th>
                      <th>Đang nhập kho</th>
                      <th>Ngưỡng tối thiểu</th>
                      <th>Trạng thái kho</th>
                      <th>Cập nhật lần cuối</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryItems.length === 0 ? (
                      <tr>
                        <td colSpan="10" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                          Chưa có thông tin kho hàng trong database.
                        </td>
                      </tr>
                    ) : (
                      inventoryItems.map((inv) => {
                        const v = inv.variant || {};
                        const p = v.product || {};
                        const pName = p.productName || 'Chưa cập nhật tên';
                        const pImg = v.imageUrl || p.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80';
                        const skuVar = v.skuVariant || `SKU-INV-${inv.inventoryId}`;
                        const inStock = inv.quantityInStock !== undefined ? inv.quantityInStock : 0;
                        const reserved = inv.quantityReserved !== undefined ? inv.quantityReserved : 0;
                        const avail = inv.quantityAvailable !== undefined ? inv.quantityAvailable : (inStock - reserved);
                        const reorderQty = inv.reorderQuantity !== undefined ? inv.reorderQuantity : 0;
                        const reorderLevel = inv.reorderLevel !== undefined ? inv.reorderLevel : 10;

                        const isLow = inStock <= reorderLevel && inStock > 0;
                        const isOut = inStock <= 0;

                        return (
                          <tr key={inv.inventoryId}>
                            {/* 1. Sản phẩm & phân loại */}
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <img src={pImg} alt={pName} style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--admin-border)', flexShrink: 0 }} />
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#1e293b' }}>{pName}</div>
                                  <div style={{ fontSize: '11.5px', color: '#0284c7', fontWeight: 600 }}>
                                    Màu: {v.color || 'Mặc định'} - Size {v.size || 'Freesize'}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* 2. Mã SKU */}
                            <td>
                              <code style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontSize: '11.5px', fontWeight: 700 }}>
                                {skuVar}
                              </code>
                            </td>

                            {/* 3. Tổng tồn kho */}
                            <td style={{ fontWeight: 800, fontSize: '14px', color: isOut ? '#dc2626' : (isLow ? '#d97706' : '#1e293b') }}>
                              {inStock}
                            </td>

                            {/* 4. Sẵn sàng bán */}
                            <td style={{ fontWeight: 700, color: '#16a34a', fontSize: '13.5px' }}>
                              {avail}
                            </td>

                            {/* 5. Đang giữ */}
                            <td style={{ fontSize: '13px', color: '#64748b' }}>
                              {reserved}
                            </td>

                            {/* 6. Đang nhập kho */}
                            <td style={{ fontSize: '13px', color: '#0284c7', fontWeight: 600 }}>
                              {reorderQty}
                            </td>

                            {/* 7. Ngưỡng tối thiểu */}
                            <td style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>
                              {reorderLevel}
                            </td>

                            {/* 8. Trạng thái kho */}
                            <td>
                              <span 
                                className="admin-badge"
                                style={{
                                  backgroundColor: isOut ? '#fee2e2' : (isLow ? '#fef3c7' : '#dcfce7'),
                                  color: isOut ? '#991b1b' : (isLow ? '#b45309' : '#15803d'),
                                  fontSize: '11px',
                                  fontWeight: 700
                                }}
                              >
                                {isOut ? 'Hết hàng' : (isLow ? 'Sắp hết' : 'An toàn')}
                              </span>
                            </td>

                            {/* 9. Cập nhật lần cuối */}
                            <td style={{ fontSize: '12px', color: '#64748b' }}>
                              {formatDate(inv.lastRestocked || inv.lastCounted)}
                            </td>

                            {/* 10. Hành động */}
                            <td>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  onClick={() => handleOpenEditModal(inv)}
                                  style={{ background: 'none', border: '1px solid var(--admin-border)', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#2563eb', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                                  title="Cập nhật kiểm kê tồn kho"
                                >
                                  <Edit3 size={14} /> Kiểm kê
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>
                  Trang {currentPage + 1} / {totalPages} (Tổng {totalElements} sản phẩm tồn kho)
                </span>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <button
                    className="admin-btn admin-btn--outline"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    style={{ padding: '6px 12px', opacity: currentPage === 0 ? 0.5 : 1 }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i).map((pageIdx) => (
                    <button
                      key={pageIdx}
                      onClick={() => setCurrentPage(pageIdx)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 700,
                        border: '1px solid var(--admin-border)',
                        cursor: 'pointer',
                        backgroundColor: currentPage === pageIdx ? 'var(--admin-primary)' : '#ffffff',
                        color: currentPage === pageIdx ? '#ffffff' : 'var(--admin-text-dark)'
                      }}
                    >
                      {pageIdx + 1}
                    </button>
                  ))}
                  <button
                    className="admin-btn admin-btn--outline"
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    style={{ padding: '6px 12px', opacity: currentPage >= totalPages - 1 ? 0.5 : 1 }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* TAB 2: LỊCH SỬ BIẾN ĐỘNG KHO */}
      {activeTab === 'history' && (
        <div className="admin-table-card">
          <div className="admin-table-wrapper">
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', gap: '10px' }}>
                <Loader2 className="animate-spin" size={24} color="var(--admin-primary)" />
                <span style={{ color: '#64748b' }}>Đang nạp nhật ký kiểm kê...</span>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Loại giao dịch</th>
                    <th>Sản phẩm / SKU</th>
                    <th>Thay đổi</th>
                    <th>Tồn trước $\rightarrow$ Sau</th>
                    <th>Mã chứng từ</th>
                    <th>Ghi chú</th>
                    <th>Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {historyItems.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                        Chưa có nhật ký biến động kho nào.
                      </td>
                    </tr>
                  ) : (
                    historyItems.map((h) => {
                      const isImport = h.transactionType === 'import';
                      const isSale = h.transactionType === 'sale';

                      return (
                        <tr key={h.historyId}>
                          <td>
                            <span 
                              className="admin-badge"
                              style={{
                                backgroundColor: isImport ? '#dcfce7' : (isSale ? '#e0f2fe' : '#fef3c7'),
                                color: isImport ? '#15803d' : (isSale ? '#0369a1' : '#b45309'),
                                fontSize: '11px',
                                fontWeight: 700
                              }}
                            >
                              {isImport ? 'NHẬP KHO' : (isSale ? 'XUẤT BÁN' : 'KIỂM KÊ')}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, fontSize: '13px', color: '#1e293b' }}>
                              {h.variant?.product?.productName || h.productName || 'Sản phẩm'}
                            </div>
                            <code style={{ fontSize: '11px', color: '#64748b' }}>
                              {h.variant?.skuVariant || h.variantSku || 'SKU'}
                            </code>
                          </td>
                          <td style={{ fontWeight: 800, fontSize: '14px', color: h.quantityChange > 0 ? '#16a34a' : '#dc2626' }}>
                            {h.quantityChange > 0 ? `+${h.quantityChange}` : h.quantityChange}
                          </td>
                          <td style={{ fontSize: '12.5px', color: '#334155' }}>
                            {h.previousQuantity} $\rightarrow$ <strong>{h.newQuantity}</strong>
                          </td>
                          <td>
                            <code style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontSize: '11.5px', fontWeight: 700 }}>
                              {h.referenceCode || '#REF-100'}
                            </code>
                          </td>
                          <td style={{ fontSize: '12px', color: '#64748b' }}>
                            {h.notes || 'Không có ghi chú'}
                          </td>
                          <td style={{ fontSize: '12px', color: '#64748b' }}>
                            {formatDate(h.createdAt)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* MODAL CẬP NHẬT TỒN KHO */}
      {editingItem && (
        <div className="admin-modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="admin-modal" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">Cập nhật kiểm kê kho hàng</h3>
              <button className="admin-modal__close" onClick={() => setEditingItem(null)}>×</button>
            </div>
            <form onSubmit={handleSaveStock}>
              <div className="admin-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Sản phẩm:</label>
                  <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#1e293b' }}>
                    {editingItem.variant?.product?.productName} ({editingItem.variant?.color} - Size {editingItem.variant?.size})
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Số lượng trong kho thực tế *</label>
                  <input
                    type="number"
                    required
                    value={editStockQty}
                    onChange={(e) => setEditStockQty(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '14px', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Mức cảnh báo sắp hết hàng (Reorder Level)</label>
                  <input
                    type="number"
                    value={editReorderLevel}
                    onChange={(e) => setEditReorderLevel(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Ghi chú kiểm kê</label>
                  <textarea
                    rows="2"
                    placeholder="Lý do điều chỉnh số lượng tồn..."
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px' }}
                  ></textarea>
                </div>
              </div>
              <div className="admin-modal__footer">
                <button type="button" className="admin-btn admin-btn--outline" onClick={() => setEditingItem(null)} disabled={submitting}>Hủy</button>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={submitting}>
                  {submitting ? <Loader2 className="animate-spin" size={16} /> : null} Lưu tồn kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TẠO ĐƠN NHẬP KHO */}
      {isImportOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsImportOpen(false)}>
          <div className="admin-modal" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">Tạo đơn nhập kho sản phẩm</h3>
              <button className="admin-modal__close" onClick={() => setIsImportOpen(false)}>×</button>
            </div>
            <form onSubmit={handleImportSubmit}>
              <div className="admin-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Chọn biến thể sản phẩm *</label>
                  <select
                    value={importVariantId}
                    onChange={(e) => setImportVariantId(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', background: '#fff' }}
                  >
                    <option value="">-- Chọn biến thể từ kho --</option>
                    {inventoryItems.map(inv => (
                      <option key={inv.inventoryId} value={inv.variant?.variantId}>
                        {inv.variant?.product?.productName} ({inv.variant?.color} - Size {inv.variant?.size})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Số lượng nhập thêm *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={importQty}
                    onChange={(e) => setImportQty(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '14px', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Mã hóa đơn / Mã nhập kho</label>
                  <input
                    type="text"
                    placeholder="#IMP-2024-001"
                    value={importRefCode}
                    onChange={(e) => setImportRefCode(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Ghi chú nhập hàng</label>
                  <textarea
                    rows="2"
                    placeholder="Đợt hàng mới từ nhà cung cấp..."
                    value={importNotes}
                    onChange={(e) => setImportNotes(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px' }}
                  ></textarea>
                </div>
              </div>
              <div className="admin-modal__footer">
                <button type="button" className="admin-btn admin-btn--outline" onClick={() => setIsImportOpen(false)} disabled={submitting}>Hủy</button>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={submitting}>
                  {submitting ? <Loader2 className="animate-spin" size={16} /> : null} Hoàn tất nhập kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
