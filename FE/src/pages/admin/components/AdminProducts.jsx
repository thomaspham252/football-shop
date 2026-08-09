import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  X
} from 'lucide-react';
import { adminApi } from '../../../api/adminApi';
import { useToast } from '../../../context/ToastContext';
import AddEditProductForm from './AddEditProductForm';

export default function AdminProducts() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all_products'); // 'all_products' | 'brands' | 'categories'

  // State quản lý việc Thêm / Sửa sản phẩm
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // States danh sách & Bộ lọc
  const [variants, setVariants] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [brandFilter, setBrandFilter] = useState('ALL');

  // Phân trang 5 sản phẩm/chi tiết 1 trang
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Modal Thương hiệu & Danh mục
  const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  const [brandForm, setBrandForm] = useState({
    brandCode: '',
    brandName: '',
    description: '',
    logoUrl: '',
    country: '',
    status: 'Đang hoạt động',
    displayOrder: 1
  });

  const [catForm, setCatForm] = useState({
    categoryCode: '',
    categoryName: '',
    description: '',
    categoryType: 'Giày đá bóng',
    slug: '',
    imageUrl: '',
    displayOrder: 1,
    isActive: true
  });

  useEffect(() => {
    fetchVariants();
    fetchMetadata();
  }, [searchQuery, categoryFilter, brandFilter, currentPage]);

  const fetchMetadata = async () => {
    try {
      const [catsData, brandsData] = await Promise.all([
        adminApi.getCategories(),
        adminApi.getBrands()
      ]);
      setCategories(catsData || []);
      setBrands(brandsData || []);
    } catch (err) {
      console.warn("Lỗi nạp danh mục/thương hiệu từ API:", err);
      setCategories([]);
      setBrands([]);
    }
  };

  const fetchVariants = async () => {
    try {
      setLoading(true);
      const catId = categoryFilter !== 'ALL' ? parseInt(categoryFilter) : null;
      const bId = brandFilter !== 'ALL' ? parseInt(brandFilter) : null;

      // Nạp danh sách Chi tiết sản phẩm từ Backend Database phân trang 5/trang
      const data = await adminApi.getProductVariants({
        categoryId: catId,
        brandId: bId,
        keyword: searchQuery.trim(),
        page: currentPage,
        size: 5 // 5 sản phẩm 1 trang theo yêu cầu
      });

      if (data && data.content) {
        setVariants(data.content);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      } else if (Array.isArray(data)) {
        setVariants(data);
        setTotalPages(1);
        setTotalElements(data.length);
      } else {
        setVariants([]);
        setTotalPages(1);
        setTotalElements(0);
      }
    } catch (err) {
      console.error("Lỗi nạp danh sách chi tiết sản phẩm từ API:", err);
      setVariants([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVariant = async (v) => {
    const vId = v.variantId;
    if (!window.confirm(`⚠️ Bạn có chắc chắn muốn XÓA dòng chi tiết "${v.product?.productName} - Màu: ${v.color} (Size ${v.size})"?`)) {
      return;
    }
    try {
      await adminApi.deleteVariant(vId);
      toast.success("Đã xóa chi tiết sản phẩm thành công!");
      fetchVariants();
    } catch (err) {
      toast.error("Không thể xóa chi tiết sản phẩm này!");
    }
  };

  const handleEditProductFromVariant = (v) => {
    if (v.product) {
      setEditingProduct(v.product);
    } else {
      setEditingProduct(v);
    }
  };

  const handleProductSaved = () => {
    setIsAddingProduct(false);
    setEditingProduct(null);
    fetchVariants();
  };

  const handleAddBrandSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.saveBrand(brandForm);
      toast.success(`Đã thêm thương hiệu "${brandForm.brandName}" thành công!`);
      setIsAddBrandOpen(false);
      fetchMetadata();
    } catch (err) {
      toast.error("Tạo thương hiệu thất bại!");
    }
  };

  const handleAddCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.saveCategory(catForm);
      toast.success(`Đã thêm danh mục "${catForm.categoryName}" thành công!`);
      setIsAddCategoryOpen(false);
      fetchMetadata();
    } catch (err) {
      toast.error("Tạo danh mục thất bại!");
    }
  };

  const formatVND = (val) => {
    if (!val && val !== 0) return '0 ₫';
    if (typeof val === 'string' && (val.includes('₫') || val.includes('đ'))) return val;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  // NẾU ĐANG Ở MÀN HÌNH THÊM HOẶC SỬA SẢN PHẨM -> HIỂN THỊ ADD/EDIT FORM
  if (isAddingProduct || editingProduct) {
    return (
      <AddEditProductForm
        editingProduct={editingProduct}
        onBack={() => {
          setIsAddingProduct(false);
          setEditingProduct(null);
        }}
        onSuccess={handleProductSaved}
      />
    );
  }

  return (
    <div className="admin-products-view">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-header__left">
          <h1 className="admin-page-title">Quản lý kho hàng & Chi tiết sản phẩm</h1>
          <p className="admin-page-sub">Danh sách hiển thị từng dòng Chi tiết (Màu sắc & Size) từ máy chủ Backend Database - 5 mặt hàng / trang.</p>
        </div>

        {activeTab === 'all_products' && (
          <button 
            className="admin-btn admin-btn--primary"
            onClick={() => setIsAddingProduct(true)}
          >
            <Plus size={18} /> Thêm sản phẩm mới
          </button>
        )}

        {activeTab === 'brands' && (
          <button className="admin-btn admin-btn--primary" onClick={() => setIsAddBrandOpen(true)}>
            <Plus size={18} /> Thêm thương hiệu
          </button>
        )}

        {activeTab === 'categories' && (
          <button className="admin-btn admin-btn--primary" onClick={() => setIsAddCategoryOpen(true)}>
            <Plus size={18} /> Thêm danh mục
          </button>
        )}
      </div>

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: '28px', borderBottom: '2px solid var(--admin-border)', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('all_products')}
          style={{
            padding: '12px 4px',
            fontSize: '15px',
            fontWeight: 700,
            color: activeTab === 'all_products' ? 'var(--admin-primary)' : 'var(--admin-text-muted)',
            borderBottom: activeTab === 'all_products' ? '3px solid var(--admin-primary)' : '3px solid transparent',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: '-2px'
          }}
        >
          Chi tiết sản phẩm ({totalElements})
        </button>

        <button
          onClick={() => setActiveTab('brands')}
          style={{
            padding: '12px 4px',
            fontSize: '15px',
            fontWeight: 700,
            color: activeTab === 'brands' ? 'var(--admin-primary)' : 'var(--admin-text-muted)',
            borderBottom: activeTab === 'brands' ? '3px solid var(--admin-primary)' : '3px solid transparent',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: '-2px'
          }}
        >
          Thương hiệu ({brands.length})
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          style={{
            padding: '12px 4px',
            fontSize: '15px',
            fontWeight: 700,
            color: activeTab === 'categories' ? 'var(--admin-primary)' : 'var(--admin-text-muted)',
            borderBottom: activeTab === 'categories' ? '3px solid var(--admin-primary)' : '3px solid transparent',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: '-2px'
          }}
        >
          Danh mục ({categories.length})
        </button>
      </div>

      {/* TAB 1: CHI TIẾT SẢN PHẨM - 5 ITEMS / TRANG */}
      {activeTab === 'all_products' && (
        <>
          <div className="admin-table-card" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ position: 'relative', width: '340px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Tìm tên sản phẩm, màu sắc, size, SKU chi tiết..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(0);
                }}
                style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13.5px', outline: 'none' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(0);
                }}
                style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13.5px', outline: 'none', background: '#ffffff', cursor: 'pointer' }}
              >
                <option value="ALL">Tất cả danh mục</option>
                {categories.map(c => {
                  const isChild = c.parentCategory != null;
                  return (
                    <option key={c.categoryId} value={c.categoryId}>
                      {isChild ? `└── ${c.categoryName}` : c.categoryName}
                    </option>
                  );
                })}
              </select>

              <select
                value={brandFilter}
                onChange={(e) => {
                  setBrandFilter(e.target.value);
                  setCurrentPage(0);
                }}
                style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13.5px', outline: 'none', background: '#ffffff', cursor: 'pointer' }}
              >
                <option value="ALL">Tất cả thương hiệu</option>
                {brands.map(b => (
                  <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="admin-table-card">
            <div className="admin-table-wrapper">
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', gap: '10px' }}>
                  <Loader2 className="animate-spin" size={24} color="var(--admin-primary)" />
                  <span style={{ color: '#64748b' }}>Đang nạp chi tiết sản phẩm từ máy chủ Backend...</span>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Thuộc tính (Màu sắc & Size)</th>
                      <th>Mã SKU Chi tiết</th>
                      <th>Danh mục & Thương hiệu</th>
                      <th>Giá bán chi tiết</th>
                      <th>Tồn kho</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                          Chưa có dữ liệu sản phẩm trong máy chủ Backend. Vui lòng bấm "Thêm sản phẩm mới".
                        </td>
                      </tr>
                    ) : (
                      variants.map((v, idx) => {
                        const p = v.product || {};
                        const pName = p.productName || 'Chưa cập nhật tên';
                        const pImg = v.imageUrl || p.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80';
                        const pCategory = p.category?.categoryName || 'Chưa phân loại';
                        const pBrand = p.brand?.brandName || 'Chưa cập nhật';
                        const vSku = v.skuVariant || p.sku || `SKU-VAR-${v.variantId || idx + 1}`;
                        const vPrice = v.variantPrice || p.salePrice || p.basePrice || 0;
                        const vStock = v.variantStock !== undefined ? v.variantStock : (p.stockQuantity !== undefined ? p.stockQuantity : 0);
                        const active = v.isActive !== false && p.isActive !== false;

                        return (
                          <tr key={v.variantId || idx}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <img src={pImg} alt={pName} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--admin-border)', flexShrink: 0 }} />
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#1e293b' }}>{pName}</div>
                                  <div style={{ fontSize: '11.5px', color: '#0284c7', fontWeight: 600 }}>
                                    Chi tiết: {v.color || 'Mặc định'} - Size {v.size || 'Freesize'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>
                                  🎨 Màu: {v.color || 'Mặc định'}
                                </span>
                                <span style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>
                                  👟 Size: <strong>{v.size || 'Freesize'}</strong>
                                </span>
                              </div>
                            </td>
                            <td>
                              <code style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontSize: '11.5px', fontWeight: 700, color: '#0f172a' }}>
                                {vSku}
                              </code>
                            </td>
                            <td>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{pCategory}</div>
                              <div style={{ fontSize: '11.5px', color: '#64748b' }}>{pBrand}</div>
                            </td>
                            <td style={{ fontWeight: 700, color: '#16a34a', fontSize: '13.5px' }}>
                              {formatVND(vPrice)}
                            </td>
                            <td style={{ fontWeight: 700, color: vStock > 0 ? '#1e293b' : '#dc2626', fontSize: '14px' }}>
                              {vStock}
                            </td>
                            <td>
                              <span 
                                className="admin-badge" 
                                style={{
                                  backgroundColor: active ? '#dcfce7' : '#fef3c7',
                                  color: active ? '#15803d' : '#b45309',
                                  fontSize: '11px',
                                  fontWeight: 600
                                }}
                              >
                                {active ? 'Hoạt động' : 'Bản nháp'}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                                <button 
                                  onClick={() => handleEditProductFromVariant(v)}
                                  style={{ background: 'none', border: '1px solid var(--admin-border)', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: '#2563eb' }}
                                  title="Sửa sản phẩm"
                                >
                                  <Edit3 size={15} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteVariant(v)}
                                  style={{ background: 'none', border: '1px solid var(--admin-border)', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: '#dc2626' }}
                                  title="Xóa chi tiết này"
                                >
                                  <Trash2 size={15} />
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

            {/* Phân trang dạng số 1, 2, 3... - 5 sản phẩm/chi tiết 1 trang */}
            {totalPages > 1 && (
              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>
                  Trang {currentPage + 1} / {totalPages} (Tổng {totalElements} chi tiết - Hiển thị 5/trang)
                </span>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <button
                    className="admin-btn admin-btn--outline"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    style={{ padding: '6px 12px', opacity: currentPage === 0 ? 0.5 : 1 }}
                    title="Trang trước"
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
                        border: currentPage === pageIdx ? '1px solid var(--admin-primary)' : '1px solid var(--admin-border)',
                        cursor: 'pointer',
                        backgroundColor: currentPage === pageIdx ? 'var(--admin-primary)' : '#ffffff',
                        color: currentPage === pageIdx ? '#ffffff' : 'var(--admin-text-dark)',
                        transition: 'all 0.2s'
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
                    title="Trang sau"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* TAB 2: BRANDS */}
      {activeTab === 'brands' && (
        <div className="admin-table-card">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã Hãng</th>
                  <th>Thương Hiệu</th>
                  <th>Quốc Gia</th>
                  <th>Trạng Thái</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {brands.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                      Chưa có thương hiệu nào trong database.
                    </td>
                  </tr>
                ) : (
                  brands.map((b) => (
                    <tr key={b.brandId || b.id}>
                      <td>
                        <code style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
                          {b.brandCode || `BR-${b.brandName?.toUpperCase()}`}
                        </code>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={b.logoUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80'} alt={b.brandName} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'contain', border: '1px solid var(--admin-border)' }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>{b.brandName}</div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>{b.description}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '13px' }}>{b.country || 'Quốc tế'}</td>
                      <td>
                        <span className="admin-badge admin-badge--success" style={{ fontSize: '11px' }}>
                          {b.status || 'Đang hoạt động'}
                        </span>
                      </td>
                      <td>
                        <button style={{ background: 'none', border: '1px solid var(--admin-border)', borderRadius: '6px', padding: '6px', cursor: 'pointer' }}><Edit3 size={15} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="admin-table-card">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã Danh Mục</th>
                  <th>Tên Danh Mục</th>
                  <th>Phân Loại</th>
                  <th>Slug</th>
                  <th>Trạng Thái</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                      Chưa có danh mục nào trong database.
                    </td>
                  </tr>
                ) : (
                  categories.map((c) => {
                    const isChild = c.parentCategory != null;
                    return (
                      <tr key={c.categoryId || c.id}>
                        <td>
                          <code style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
                            {c.categoryCode || `CAT-${c.categoryId}`}
                          </code>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={c.imageUrl || 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=100&auto=format&fit=crop&q=80'} alt={c.categoryName} style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--admin-border)' }} />
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>
                                {isChild ? `└── ${c.categoryName}` : c.categoryName}
                              </div>
                              <div style={{ fontSize: '11px', color: '#64748b' }}>{c.description}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="admin-badge admin-badge--info" style={{ fontSize: '10.5px' }}>
                            {c.categoryType || (isChild ? 'Danh mục con' : 'Danh mục cha')}
                          </span>
                        </td>
                        <td>
                          <code style={{ background: '#eff6ff', padding: '2px 8px', borderRadius: '4px', fontSize: '11.5px', color: '#1d4ed8' }}>
                            /{c.slug}
                          </code>
                        </td>
                        <td>
                          <span className="admin-badge admin-badge--success" style={{ fontSize: '11px' }}>
                            {c.isActive !== false ? 'Kích hoạt' : 'Ẩn'}
                          </span>
                        </td>
                        <td>
                          <button style={{ background: 'none', border: '1px solid var(--admin-border)', borderRadius: '6px', padding: '6px', cursor: 'pointer' }}><Edit3 size={15} /></button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL ADD BRAND */}
      {isAddBrandOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsAddBrandOpen(false)}>
          <div className="admin-modal" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} style={{ color: 'var(--admin-accent)' }} /> Thêm thương hiệu mới
              </h3>
              <button className="admin-modal__close" onClick={() => setIsAddBrandOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddBrandSubmit}>
              <div className="admin-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Tên thương hiệu *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nike, Adidas, Puma..."
                      value={brandForm.brandName}
                      onChange={(e) => setBrandForm({ ...brandForm, brandName: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Mã thương hiệu</label>
                    <input
                      type="text"
                      placeholder="BR-NIKE"
                      value={brandForm.brandCode}
                      onChange={(e) => setBrandForm({ ...brandForm, brandCode: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>
              <div className="admin-modal__footer">
                <button type="button" className="admin-btn admin-btn--outline" onClick={() => setIsAddBrandOpen(false)}>Hủy</button>
                <button type="submit" className="admin-btn admin-btn--primary">Lưu thương hiệu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ADD CATEGORY */}
      {isAddCategoryOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsAddCategoryOpen(false)}>
          <div className="admin-modal" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} style={{ color: 'var(--admin-accent)' }} /> Thêm danh mục mới
              </h3>
              <button className="admin-modal__close" onClick={() => setIsAddCategoryOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddCategorySubmit}>
              <div className="admin-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Tên danh mục *</label>
                    <input
                      type="text"
                      required
                      placeholder="Giày đá bóng..."
                      value={catForm.categoryName}
                      onChange={(e) => setCatForm({ ...catForm, categoryName: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Mã danh mục</label>
                    <input
                      type="text"
                      placeholder="CAT-FOOTWEAR"
                      value={catForm.categoryCode}
                      onChange={(e) => setCatForm({ ...catForm, categoryCode: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>
              <div className="admin-modal__footer">
                <button type="button" className="admin-btn admin-btn--outline" onClick={() => setIsAddCategoryOpen(false)}>Hủy</button>
                <button type="submit" className="admin-btn admin-btn--primary">Lưu danh mục</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
