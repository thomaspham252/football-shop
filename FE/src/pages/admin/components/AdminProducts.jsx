import { useState, useEffect } from 'react';
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
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [couponForm, setCouponForm] = useState({
    couponId: null,
    code: '',
    discountPercentage: 0,
    maxDiscountAmount: 0,
    expiryDate: '',
    usageLimit: 0,
    isActive: true
  });

  // Custom Confirm Dialog
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const showConfirm = (title, message, onConfirm) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm
    });
  };

  const closeConfirm = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  const [brandForm, setBrandForm] = useState({
    brandId: null,
    brandCode: '',
    brandName: '',
    description: '',
    logoUrl: '',
    website: '',
    country: '',
    status: 'Hoạt động',
    isPopular: false,
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
    isActive: true,
    parentCategoryId: ''
  });

  useEffect(() => {
    fetchVariants();
    fetchMetadata();
  }, [searchQuery, categoryFilter, brandFilter, currentPage]);

  const fetchMetadata = async () => {
    try {
      const [catsData, brandsData, couponsData] = await Promise.all([
        adminApi.getCategories(),
        adminApi.getBrands(),
        adminApi.getCoupons()
      ]);
      setCategories(catsData || []);
      setBrands(brandsData || []);
      setCoupons(couponsData || []);
    } catch (err) {
      console.warn("Lỗi nạp metadata từ API:", err);
      setCategories([]);
      setBrands([]);
      setCoupons([]);
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
    showConfirm(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn XÓA dòng chi tiết "${v.product?.productName} - Màu: ${v.color} (Size ${v.size})"?`,
      async () => {
        try {
          await adminApi.deleteVariant(vId);
          toast.success("Đã xóa chi tiết sản phẩm thành công!");
          fetchVariants();
        } catch {
          toast.error("Không thể xóa chi tiết sản phẩm này!");
        }
      }
    );
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

  const handleEditBrand = (brand) => {
    setBrandForm({
      brandId: brand.brandId,
      brandCode: brand.brandCode || '',
      brandName: brand.brandName || '',
      description: brand.description || '',
      logoUrl: brand.logoUrl || '',
      website: brand.website || '',
      country: brand.country || '',
      status: brand.status || 'Hoạt động',
      isPopular: brand.isPopular || false,
      displayOrder: brand.displayOrder || 1
    });
    setIsAddBrandOpen(true);
  };

  const handleAddBrandSubmit = async (e) => {
    e.preventDefault();
    showConfirm("Xác nhận lưu", "Bạn có chắc chắn muốn lưu thương hiệu này không?", async () => {
      try {
        await adminApi.saveBrand(brandForm);
        if (brandForm.brandId) {
          toast.success(`Đã cập nhật thương hiệu "${brandForm.brandName}" thành công!`);
        } else {
          toast.success(`Đã thêm thương hiệu "${brandForm.brandName}" thành công!`);
        }
        setIsAddBrandOpen(false);
        fetchMetadata();
      } catch {
        toast.error("Lưu thương hiệu thất bại!");
      }
    });
  };

  const handleAddCategorySubmit = async (e) => {
    e.preventDefault();
    showConfirm("Xác nhận lưu", "Bạn có chắc chắn muốn lưu danh mục này không?", async () => {
      try {
        const dataToSend = { ...catForm };
        if (dataToSend.parentCategoryId) {
          dataToSend.parentCategory = { categoryId: parseInt(dataToSend.parentCategoryId) };
        } else {
          dataToSend.parentCategory = null;
        }
        delete dataToSend.parentCategoryId;

        await adminApi.saveCategory(dataToSend);
        toast.success(`Đã thêm danh mục "${catForm.categoryName}" thành công!`);
        setIsAddCategoryOpen(false);
        fetchMetadata();
      } catch {
        toast.error("Tạo danh mục thất bại!");
      }
    });
  };

  const handleEditCoupon = (coupon) => {
    setCouponForm({
      couponId: coupon.couponId,
      code: coupon.code || '',
      discountPercentage: coupon.discountPercentage || 0,
      maxDiscountAmount: coupon.maxDiscountAmount || 0,
      expiryDate: coupon.expiryDate ? coupon.expiryDate.substring(0, 16) : '',
      usageLimit: coupon.usageLimit || 0,
      isActive: coupon.isActive !== false
    });
    setIsAddCouponOpen(true);
  };

  const handleAddCouponSubmit = async (e) => {
    e.preventDefault();
    if (!couponForm.code) {
      toast.warning("Vui lòng nhập mã giảm giá!");
      return;
    }
    showConfirm("Xác nhận lưu", "Bạn có chắc chắn muốn lưu mã giảm giá này không?", async () => {
      try {
        await adminApi.saveCoupon({
          ...couponForm,
          expiryDate: couponForm.expiryDate ? new Date(couponForm.expiryDate).toISOString() : null
        });
        toast.success(`Đã lưu mã giảm giá "${couponForm.code}" thành công!`);
        setIsAddCouponOpen(false);
        fetchMetadata();
      } catch (err) {
        toast.error(err.response?.data?.message || "Lưu mã giảm giá thất bại!");
      }
    });
  };

  const handleDisableCoupon = (c) => {
    showConfirm("Vô hiệu hóa", `Bạn muốn vô hiệu hóa mã "${c.code}"?`, async () => {
      try {
        await adminApi.disableCoupon(c.couponId);
        toast.success("Đã vô hiệu hóa thành công!");
        fetchMetadata();
      } catch {
        toast.error("Vô hiệu hóa thất bại!");
      }
    });
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
          <button className="admin-btn admin-btn--primary" onClick={() => {
              setBrandForm({
                brandId: null,
                brandCode: '',
                brandName: '',
                description: '',
                logoUrl: '',
                website: '',
                country: '',
                status: 'Hoạt động',
                isPopular: false,
                displayOrder: 1
              });
              setIsAddBrandOpen(true);
            }}>
            <Plus size={18} /> Thêm thương hiệu
          </button>
        )}

        {activeTab === 'categories' && (
          <button className="admin-btn admin-btn--primary" onClick={() => {
              setCatForm({
                categoryCode: '',
                categoryName: '',
                description: '',
                categoryType: 'Giày đá bóng',
                slug: '',
                imageUrl: '',
                displayOrder: 1,
                isActive: true,
                parentCategoryId: ''
              });
              setIsAddCategoryOpen(true);
            }}>
            <Plus size={18} /> Thêm danh mục
          </button>
        )}

        {activeTab === 'coupons' && (
          <button className="admin-btn admin-btn--primary" onClick={() => {
              setCouponForm({
                couponId: null,
                code: '',
                discountPercentage: 0,
                maxDiscountAmount: 0,
                expiryDate: '',
                usageLimit: 0,
                isActive: true
              });
              setIsAddCouponOpen(true);
            }}>
            <Plus size={18} /> Thêm mã giảm giá
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

        <button
          onClick={() => setActiveTab('coupons')}
          style={{
            padding: '12px 4px',
            fontSize: '15px',
            fontWeight: 700,
            color: activeTab === 'coupons' ? 'var(--admin-primary)' : 'var(--admin-text-muted)',
            borderBottom: activeTab === 'coupons' ? '3px solid var(--admin-primary)' : '3px solid transparent',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: '-2px'
          }}
        >
          Mã giảm giá ({coupons.length})
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
                        const pImg = v.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80';
                        const pCategory = p.category?.categoryName || 'Chưa phân loại';
                        const pBrand = p.brand?.brandName || 'Chưa cập nhật';
                        const vSku = v.skuVariant || p.sku || `SKU-VAR-${v.variantId || idx + 1}`;
                        let vPrice = v.price || v.variantPrice || p.price || p.salePrice || p.basePrice || 0;
                        if (p.discountPercentage > 0) {
                          vPrice = vPrice * (100 - p.discountPercentage) / 100;
                        }
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
                            <div style={{ fontSize: '11px', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '250px' }}>{b.description}</div>
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
                        <button onClick={() => handleEditBrand(b)} style={{ background: 'none', border: '1px solid var(--admin-border)', borderRadius: '6px', padding: '6px', cursor: 'pointer' }}><Edit3 size={15} /></button>
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

      {/* TAB 4: MÃ GIẢM GIÁ */}
      {activeTab === 'coupons' && (
        <div className="admin-table-card">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã Code</th>
                  <th>Giảm giá</th>
                  <th>Giảm tối đa (VNĐ)</th>
                  <th>Hạn sử dụng</th>
                  <th>Đã dùng / Giới hạn</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                      Chưa có mã giảm giá nào trong database.
                    </td>
                  </tr>
                ) : (
                  coupons.map((c, idx) => (
                    <tr key={c.couponId || idx}>
                      <td style={{ fontWeight: 700, color: '#1e293b' }}>{c.code}</td>
                      <td style={{ color: '#d97706', fontWeight: 600 }}>{c.discountPercentage}%</td>
                      <td>{formatVND(c.maxDiscountAmount)}</td>
                      <td style={{ fontSize: '13px', color: '#64748b' }}>
                        {c.expiryDate ? new Date(c.expiryDate).toLocaleString('vi-VN') : 'Không thời hạn'}
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: c.usedCount >= c.usageLimit && c.usageLimit > 0 ? '#ef4444' : '#10b981' }}>
                          {c.usedCount}
                        </span> / {c.usageLimit > 0 ? c.usageLimit : '∞'}
                      </td>
                      <td>
                        <span className={`admin-badge ${c.isActive !== false ? 'admin-badge--success' : 'admin-badge--danger'}`} style={{ fontSize: '11px' }}>
                          {c.isActive !== false ? 'Kích hoạt' : 'Vô hiệu hóa'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button style={{ background: 'none', border: '1px solid var(--admin-border)', borderRadius: '6px', padding: '6px', cursor: 'pointer' }} onClick={() => handleEditCoupon(c)}>
                            <Edit3 size={15} />
                          </button>
                          {c.isActive !== false && (
                            <button style={{ background: 'none', border: '1px solid var(--admin-border)', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: '#ef4444' }} onClick={() => handleDisableCoupon(c)}>
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL ADD BRAND */}
      {isAddBrandOpen && (
        <div className="admin-modal-overlay" onClick={() => showConfirm("Hủy bỏ", "Bạn có chắc chắn muốn hủy không?", () => setIsAddBrandOpen(false))}>
          <div className="admin-modal" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} style={{ color: 'var(--admin-accent)' }} /> {brandForm.brandId ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
              </h3>
              <button type="button" className="admin-modal__close" onClick={() => showConfirm("Hủy bỏ", "Bạn có chắc chắn muốn hủy không?", () => setIsAddBrandOpen(false))}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddBrandSubmit}>
              <div className="admin-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '60vh', overflowY: 'auto' }}>
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
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Logo URL</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={brandForm.logoUrl}
                      onChange={(e) => setBrandForm({ ...brandForm, logoUrl: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Website</label>
                    <input
                      type="text"
                      placeholder="https://nike.com"
                      value={brandForm.website}
                      onChange={(e) => setBrandForm({ ...brandForm, website: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Quốc gia</label>
                    <input
                      type="text"
                      placeholder="Mỹ, Đức..."
                      value={brandForm.country}
                      onChange={(e) => setBrandForm({ ...brandForm, country: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Trạng thái</label>
                    <select
                      value={brandForm.status}
                      onChange={(e) => setBrandForm({ ...brandForm, status: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none', backgroundColor: '#fff' }}
                    >
                      <option value="Hoạt động">Hoạt động</option>
                      <option value="Không hoạt động">Không hoạt động</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Thứ tự hiển thị</label>
                    <input
                      type="number"
                      min="1"
                      value={brandForm.displayOrder}
                      onChange={(e) => setBrandForm({ ...brandForm, displayOrder: parseInt(e.target.value) || 1 })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '22px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={brandForm.isPopular}
                        onChange={(e) => setBrandForm({ ...brandForm, isPopular: e.target.checked })}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      Thương hiệu phổ biến
                    </label>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Mô tả</label>
                  <textarea
                    rows="3"
                    placeholder="Mô tả thương hiệu..."
                    value={brandForm.description}
                    onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none', resize: 'vertical' }}
                  ></textarea>
                </div>
              </div>
              <div className="admin-modal__footer">
                <button type="button" className="admin-btn admin-btn--outline" onClick={() => showConfirm("Hủy bỏ", "Bạn có chắc chắn muốn hủy không?", () => setIsAddBrandOpen(false))}>Hủy</button>
                <button type="submit" className="admin-btn admin-btn--primary">Lưu thương hiệu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ADD CATEGORY */}
      {isAddCategoryOpen && (
        <div className="admin-modal-overlay" onClick={() => showConfirm("Hủy bỏ", "Bạn có chắc chắn muốn hủy không?", () => setIsAddCategoryOpen(false))}>
          <div className="admin-modal" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} style={{ color: 'var(--admin-accent)' }} /> Thêm danh mục mới
              </h3>
              <button type="button" className="admin-modal__close" onClick={() => showConfirm("Hủy bỏ", "Bạn có chắc chắn muốn hủy không?", () => setIsAddCategoryOpen(false))}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddCategorySubmit}>
              <div className="admin-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '60vh', overflowY: 'auto' }}>
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
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Đường dẫn (Slug)</label>
                    <input
                      type="text"
                      placeholder="giay-da-bong"
                      value={catForm.slug}
                      onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Loại danh mục</label>
                    <select
                      value={catForm.categoryType}
                      onChange={(e) => setCatForm({ ...catForm, categoryType: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none', backgroundColor: '#fff' }}
                    >
                      <option value="Giày đá bóng">Giày đá bóng</option>
                      <option value="Quần áo">Quần áo</option>
                      <option value="Phụ kiện">Phụ kiện</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Danh mục cha</label>
                    <select
                      value={catForm.parentCategoryId || ''}
                      onChange={(e) => setCatForm({ ...catForm, parentCategoryId: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none', backgroundColor: '#fff' }}
                    >
                      <option value="">-- Không có (Danh mục gốc) --</option>
                      {categories.filter(c => !c.parentCategory).map(c => (
                        <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Hình ảnh URL</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={catForm.imageUrl}
                      onChange={(e) => setCatForm({ ...catForm, imageUrl: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Thứ tự hiển thị</label>
                    <input
                      type="number"
                      min="1"
                      value={catForm.displayOrder}
                      onChange={(e) => setCatForm({ ...catForm, displayOrder: parseInt(e.target.value) || 1 })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '22px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={catForm.isActive}
                        onChange={(e) => setCatForm({ ...catForm, isActive: e.target.checked })}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      Đang hoạt động
                    </label>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Mô tả</label>
                  <textarea
                    rows="3"
                    placeholder="Mô tả danh mục..."
                    value={catForm.description}
                    onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none', resize: 'vertical' }}
                  ></textarea>
                </div>
              </div>
              <div className="admin-modal__footer">
                <button type="button" className="admin-btn admin-btn--outline" onClick={() => showConfirm("Hủy bỏ", "Bạn có chắc chắn muốn hủy không?", () => setIsAddCategoryOpen(false))}>Hủy</button>
                <button type="submit" className="admin-btn admin-btn--primary">Lưu danh mục</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirmDialog.isOpen && (
        <div className="admin-modal-overlay" onClick={closeConfirm} style={{ zIndex: 9999 }}>
          <div className="admin-modal" style={{ maxWidth: '400px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <h3 className="admin-modal__title" style={{ width: '100%', textAlign: 'center', fontSize: '18px' }}>
                {confirmDialog.title}
              </h3>
            </div>
            <div className="admin-modal__body" style={{ padding: '16px 20px 24px' }}>
              <p style={{ color: '#475569', fontSize: '14px', margin: 0 }}>{confirmDialog.message}</p>
            </div>
            <div className="admin-modal__footer" style={{ justifyContent: 'center', borderTop: 'none', paddingTop: 0, gap: '12px' }}>
              <button type="button" className="admin-btn admin-btn--outline" onClick={closeConfirm}>
                Hủy
              </button>
              <button type="button" className="admin-btn admin-btn--primary" onClick={() => {
                if (confirmDialog.onConfirm) confirmDialog.onConfirm();
                closeConfirm();
              }}>
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ADD/EDIT COUPON */}
      {isAddCouponOpen && (
        <div className="admin-modal-overlay" onClick={() => showConfirm("Hủy bỏ", "Bạn có chắc chắn muốn hủy không?", () => setIsAddCouponOpen(false))}>
          <div className="admin-modal" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} style={{ color: 'var(--admin-accent)' }} /> {couponForm.couponId ? 'Chỉnh sửa mã giảm giá' : 'Thêm mã giảm giá mới'}
              </h3>
              <button type="button" className="admin-modal__close" onClick={() => showConfirm("Hủy bỏ", "Bạn có chắc chắn muốn hủy không?", () => setIsAddCouponOpen(false))}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddCouponSubmit}>
              <div className="admin-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Mã giảm giá (Code) *</label>
                    <input type="text" required placeholder="VD: SUMMER50" value={couponForm.code} onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13.5px', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Phần trăm giảm (%) *</label>
                    <input type="number" required min="1" max="100" placeholder="VD: 10" value={couponForm.discountPercentage} onChange={(e) => setCouponForm({ ...couponForm, discountPercentage: parseInt(e.target.value) || 0 })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13.5px', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Mức giảm tối đa (VNĐ)</label>
                    <input type="number" min="0" placeholder="VD: 50000" value={couponForm.maxDiscountAmount} onChange={(e) => setCouponForm({ ...couponForm, maxDiscountAmount: parseFloat(e.target.value) || 0 })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13.5px', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Giới hạn số lần dùng (0 = vô hạn)</label>
                    <input type="number" min="0" placeholder="VD: 100" value={couponForm.usageLimit} onChange={(e) => setCouponForm({ ...couponForm, usageLimit: parseInt(e.target.value) || 0 })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13.5px', outline: 'none' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Hạn sử dụng</label>
                  <input type="datetime-local" value={couponForm.expiryDate} onChange={(e) => setCouponForm({ ...couponForm, expiryDate: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13.5px', outline: 'none' }} />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <input type="checkbox" id="couponStatus" checked={couponForm.isActive} onChange={(e) => setCouponForm({ ...couponForm, isActive: e.target.checked })} />
                  <label htmlFor="couponStatus" style={{ fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Mã đang kích hoạt</label>
                </div>
              </div>
              <div className="admin-modal__footer">
                <button type="button" className="admin-btn admin-btn--outline" onClick={() => showConfirm("Hủy bỏ", "Bạn có chắc chắn muốn hủy không?", () => setIsAddCouponOpen(false))}>Hủy</button>
                <button type="submit" className="admin-btn admin-btn--primary">Lưu mã giảm giá</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
