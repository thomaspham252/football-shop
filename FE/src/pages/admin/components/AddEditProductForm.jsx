import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  Globe, 
  FileText, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  Loader2
} from 'lucide-react';
import { adminApi } from '../../../api/adminApi';
import { useToast } from '../../../context/ToastContext';

export default function AddEditProductForm({ editingProduct, onBack, onSuccess }) {
  const { toast } = useToast();

  const [productName, setProductName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [productCode, setProductCode] = useState('');
  const [description, setDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [priceCost, setPriceCost] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  // Danh mục và Thương hiệu từ API Database
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Danh sách Chi tiết sản phẩm (Màu sắc và Size)
  const [variants, setVariants] = useState([
    {
      id: Date.now(),
      color: 'Đỏ / Đen',
      size: '41',
      skuVariant: '',
      variantPrice: '',
      variantStock: 10,
      imageUrl: ''
    }
  ]);

  // State quản lý việc sửa ảnh trực tiếp trên bảng
  const [editingImageIdx, setEditingImageIdx] = useState(null);

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

  useEffect(() => {
    fetchMetadata();
    if (editingProduct) {
      loadEditingData(editingProduct);
    }
  }, [editingProduct]);

  const fetchMetadata = async () => {
    try {
      const [catsData, brandsData] = await Promise.all([
        adminApi.getCategories(),
        adminApi.getBrands()
      ]);
      if (catsData) setCategories(catsData);
      if (brandsData) setBrands(brandsData);

      if (catsData && catsData.length > 0 && !categoryId) {
        setCategoryId(catsData[0].categoryId);
      }
      if (brandsData && brandsData.length > 0 && !brandId) {
        setBrandId(brandsData[0].brandId);
      }
    } catch (err) {
      console.warn("Lỗi nạp danh mục/thương hiệu:", err);
    }
  };

  const loadEditingData = async (prod) => {
    try {
      setProductName(prod.productName || prod.name || '');
      setSlug(prod.slug || '');
      setSku(prod.sku || '');
      setProductCode(prod.productCode || '');
      setDescription(prod.description || '');
      setDetailedDescription(prod.detailedDescription || '');
      
      const bPrice = prod.basePrice || prod.price || '';
      const cPrice = prod.priceCost || '';
      setBasePrice(bPrice);
      setPriceCost(cPrice);
      setDiscountPercentage(prod.discountPercentage || prod.discount || 0);
      setIsActive(prod.isActive !== false);

      // Handle category and brand from different possible API structures
      if (prod.categoryId) setCategoryId(prod.categoryId);
      else if (prod.category?.categoryId) setCategoryId(prod.category.categoryId);
      else if (prod.category?.id) setCategoryId(prod.category.id);

      if (prod.brandId) setBrandId(prod.brandId);
      else if (prod.brand?.brandId) setBrandId(prod.brand.brandId);
      else if (prod.brand?.id) setBrandId(prod.brand.id);

      // Fetch variants if we have an ID
      if (prod.productId || prod.id) {
        const pId = prod.productId || prod.id;
        const res = await adminApi.getProductById(pId);
        
        // Also update category and brand if the detail API returns them
        if (res.categoryId) setCategoryId(res.categoryId);
        if (res.brandId) setBrandId(res.brandId);
        // Fallback for basePrice if it wasn't in list but is in detail
        if (!bPrice && res.basePrice) setBasePrice(res.basePrice);
        if (!cPrice && res.priceCost) setPriceCost(res.priceCost);
        if (!prod.discountPercentage && res.discountPercentage) setDiscountPercentage(res.discountPercentage);

        if (res && res.variants && res.variants.length > 0) {
          setVariants(res.variants.map((v, i) => ({
            id: v.variantId || i,
            variantId: v.variantId,
            color: v.color || '',
            size: v.size || '',
            skuVariant: v.skuVariant || '',
            surfaceType: v.surfaceType || '',
            material: v.material || '',
            variantStock: v.variantStock !== undefined ? v.variantStock : 0,
            imageUrl: v.imageUrl || ''
          })));
        }
      }
    } catch (err) {
      console.warn("Lỗi nạp chi tiết sản phẩm chỉnh sửa:", err);
    }
  };

  // Tự động tính Giá bán sau giảm
  const calculatedSalePrice = () => {
    const p = parseFloat(basePrice) || 0;
    const d = parseInt(discountPercentage) || 0;
    if (d > 0 && d <= 100) {
      return p * (100 - d) / 100;
    }
    return p;
  };

  // Tạo slug tự động
  const generateSlug = (text) => {
    return text.toString().toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  // Thêm dòng chi tiết mới
  const handleAddVariant = () => {
    const newVariant = {
      id: Date.now(),
      color: 'Xanh Dương',
      size: '42',
      surfaceType: '',
      material: '',
      skuVariant: '',
      variantStock: 10,
      imageUrl: ''
    };
    setVariants([...variants, newVariant]);
    toast.success("Đã thêm 1 dòng biến thể mới");
  };

  // Cập nhật giá trị 1 thuộc tính chi tiết
  const handleUpdateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  // Xóa 1 dòng chi tiết
  const handleRemoveVariant = (index) => {
    if (variants.length <= 1) {
      toast.warning("Sản phẩm phải có ít nhất 1 dòng chi tiết thuộc tính!");
      return;
    }
    showConfirm("Xác nhận xóa", "Bạn có chắc chắn muốn xóa dòng chi tiết này không?", () => {
      setVariants(variants.filter((_, i) => i !== index));
    });
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName.trim()) {
      toast.warning("Vui lòng nhập Tên sản phẩm!");
      return;
    }

    showConfirm("Xác nhận lưu", "Bạn có chắc chắn muốn lưu sản phẩm này không?", async () => {
      try {
        setLoading(true);

        const payload = {
          productName: productName.trim(),
          slug: slug.trim(),
          sku: sku.trim(),
          productCode: productCode.trim(),
          description,
          detailedDescription,
          categoryId: parseInt(categoryId),
          brandId: brandId ? parseInt(brandId) : null,
          priceCost: priceCost ? parseFloat(priceCost) : null,
          price: basePrice ? parseFloat(basePrice) : null,
          discountPercentage: parseFloat(discountPercentage) || 0,
          isActive,
          variants: variants.map(v => ({
            variantId: v.variantId,
            color: v.color,
            size: v.size,
            skuVariant: v.skuVariant,
            surfaceType: v.surfaceType || null,
            material: v.material || null,
            variantStock: parseInt(v.variantStock) || 0,
            imageUrl: v.imageUrl || null
          }))
        };

        const editId = editingProduct?.productId || editingProduct?.id;
        if (editId) {
          await adminApi.updateProduct(editId, payload);
          toast.success(`Đã cập nhật sản phẩm "${productName}" thành công!`);
        } else {
          await adminApi.createProduct(payload);
          toast.success(`Đã tạo sản phẩm mới "${productName}" thành công!`);
        }

        if (onSuccess) onSuccess();
      } catch (err) {
        const msg = err.response?.data?.message || "Không thể lưu thông tin sản phẩm!";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    });
  };

  const formatVND = (val) => {
    if (!val) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="add-edit-product-view" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Top Banner Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button 
            type="button"
            onClick={() => showConfirm("Quay lại", "Bạn có chắc chắn muốn quay lại không? Mọi thay đổi sẽ không được lưu.", onBack)}
            style={{
              background: '#ffffff',
              border: '1px solid var(--admin-border)',
              borderRadius: '10px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#1e293b'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
            </h1>
            <span style={{ fontSize: '12.5px', color: '#64748b' }}>
              Điền đầy đủ thông tin cơ bản, phân loại danh mục và các chi tiết thuộc tính (Màu sắc & Size)
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          {/* LEFT MAIN AREA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Card 1: Thông tin chung */}
            <div className="admin-table-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 18px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                Thông tin chung
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#475569', marginBottom: '6px' }}>
                    TÊN SẢN PHẨM *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Giày Đá Bóng Nike Mercurial Vapor 15 Pro TF"
                    value={productName}
                    onChange={(e) => {
                      setProductName(e.target.value);
                      if (!editingProduct) {
                        setSlug(generateSlug(e.target.value));
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--admin-border)',
                      fontSize: '14px',
                      outline: 'none',
                      fontWeight: 600
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#475569', marginBottom: '6px' }}>
                      ĐƯỜNG DẪN (SLUG)
                    </label>
                    <input
                      type="text"
                      placeholder="giay-da-bong-nike-mercurial"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--admin-border)',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#475569', marginBottom: '6px' }}>
                      MÃ SKU SẢN PHẨM
                    </label>
                    <input
                      type="text"
                      placeholder="SKU-NIKE-V15"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--admin-border)',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#475569', marginBottom: '6px' }}>
                      MÃ PROD (NỘI BỘ)
                    </label>
                    <input
                      type="text"
                      placeholder="PROD-1029"
                      value={productCode}
                      onChange={(e) => setProductCode(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--admin-border)',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#475569', marginBottom: '4px' }}>
                      DANH MỤC *
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--admin-border)',
                        fontSize: '13.5px',
                        outline: 'none',
                        background: '#ffffff',
                        fontWeight: 600
                      }}
                    >
                      {categories.map(c => {
                        const isChild = c.parentCategory != null;
                        return (
                          <option key={c.categoryId} value={c.categoryId}>
                            {isChild ? `└── ${c.categoryName}` : c.categoryName}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#475569', marginBottom: '4px' }}>
                      THƯƠNG HIỆU
                    </label>
                    <select
                      value={brandId}
                      onChange={(e) => setBrandId(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--admin-border)',
                        fontSize: '13.5px',
                        outline: 'none',
                        background: '#ffffff'
                      }}
                    >
                      <option value="">-- Chọn thương hiệu --</option>
                      {brands.map(b => (
                        <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#475569', marginBottom: '6px' }}>
                    MÔ TẢ SẢN PHẨM
                  </label>
                  <div style={{ border: '1px solid var(--admin-border)', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', gap: '8px', padding: '8px 12px', background: '#f8fafc', borderBottom: '1px solid var(--admin-border)' }}>
                      <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#475569' }}><Bold size={15} /></button>
                      <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#475569' }}><Italic size={15} /></button>
                      <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#475569' }}><Underline size={15} /></button>
                      <div style={{ width: '1px', background: '#cbd5e1', margin: '0 4px' }} />
                      <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#475569' }}><List size={15} /></button>
                      <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#475569' }}><ListOrdered size={15} /></button>
                    </div>
                    <textarea
                      rows="3"
                      placeholder="Mô tả ngắn gọn sản phẩm..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: 'none',
                        borderBottom: '1px solid var(--admin-border)',
                        fontSize: '13.5px',
                        outline: 'none',
                        resize: 'vertical',
                        lineHeight: 1.6
                      }}
                    />
                    <textarea
                      rows="6"
                      placeholder="Mô tả chi tiết sản phẩm, công nghệ, chất liệu..."
                      value={detailedDescription}
                      onChange={(e) => setDetailedDescription(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: 'none',
                        fontSize: '13.5px',
                        outline: 'none',
                        resize: 'vertical',
                        lineHeight: 1.6
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card: Trạng thái hiển thị */}
            <div className="admin-table-card" style={{ padding: '24px', marginBottom: '24px' }}>
              <div style={{ marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Trạng thái hiển thị
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Cho phép sản phẩm hiển thị trên trang chủ hoặc ẩn đi dưới dạng bản nháp</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                <label 
                  onClick={() => setIsActive(true)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '10px',
                    border: isActive ? '2px solid #16a34a' : '1px solid var(--admin-border)',
                    backgroundColor: isActive ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Globe size={20} style={{ color: isActive ? '#16a34a' : '#64748b', marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: isActive ? '#15803d' : '#1e293b' }}>
                      Đang hoạt động
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px', display: 'block' }}>
                      Hiển thị trên cửa hàng
                    </span>
                  </div>
                </label>

                <label 
                  onClick={() => setIsActive(false)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '10px',
                    border: !isActive ? '2px solid #f59e0b' : '1px solid var(--admin-border)',
                    backgroundColor: !isActive ? '#fffbeb' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <FileText size={20} style={{ color: !isActive ? '#f59e0b' : '#64748b', marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: !isActive ? '#b45309' : '#1e293b' }}>
                      Bản nháp (Draft)
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px', display: 'block' }}>
                      Lưu lại để chỉnh sửa sau
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Card: Giá Chung */}
            <div className="admin-table-card" style={{ padding: '24px', marginBottom: '24px' }}>
              <div style={{ marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Giá Chung
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Thiết lập giá gốc, giá niêm yết và khuyến mãi áp dụng cho toàn bộ biến thể</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#475569', marginBottom: '4px' }}>
                    GIÁ GỐC NHẬP (VNĐ)
                  </label>
                  <input
                    type="number"
                    placeholder="VD: 1500000"
                    value={priceCost}
                    onChange={(e) => setPriceCost(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13.5px', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#475569', marginBottom: '4px' }}>
                    GIÁ NIÊM YẾT (VNĐ) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="VD: 2500000"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13.5px', fontWeight: 700 }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#475569', marginBottom: '4px' }}>
                    GIẢM GIÁ (%)
                  </label>
                  <input
                    type="number"
                    min="0" max="100"
                    placeholder="0"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13.5px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#475569', marginBottom: '4px' }}>
                    GIÁ BÁN THỰC TẾ
                  </label>
                  <div style={{ padding: '10px 12px', borderRadius: '8px', background: '#f8fafc', border: '1px dashed #cbd5e1', fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                    {formatVND(calculatedSalePrice())}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Thuộc tính chi tiết */}
            <div className="admin-table-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Giá & Biến thể (Màu sắc / Size)
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Thiết lập giá gốc chung và các thuộc tính chi tiết</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="admin-btn admin-btn--outline"
                  style={{ fontSize: '12.5px', padding: '6px 12px' }}
                >
                  <Plus size={15} /> THÊM BIẾN THỂ
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table" style={{ border: '1px solid #f1f5f9', borderRadius: '8px', minWidth: '1000px' }}>
                  <thead>
                    <tr>
                      <th style={{ fontSize: '11.5px', minWidth: '120px' }}>MÀU SẮC</th>
                      <th style={{ fontSize: '11.5px', minWidth: '70px' }}>SIZE</th>
                      <th style={{ fontSize: '11.5px', minWidth: '120px' }}>SKU (MÃ)</th>
                      <th style={{ fontSize: '11.5px', minWidth: '110px' }}>LOẠI SÂN</th>
                      <th style={{ fontSize: '11.5px', minWidth: '110px' }}>CHẤT LIỆU</th>
                      <th style={{ fontSize: '11.5px', minWidth: '150px' }}>ẢNH (URL)</th>
                      <th style={{ fontSize: '11.5px', minWidth: '70px' }}>TỒN</th>
                      <th style={{ fontSize: '11.5px' }}>XÓA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((v, idx) => (
                      <tr key={v.id || idx}>
                        <td>
                          <input
                            type="text"
                            placeholder="Đỏ / Đen"
                            value={v.color}
                            onChange={(e) => handleUpdateVariant(idx, 'color', e.target.value)}
                            style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', width: '100%' }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="40"
                            value={v.size}
                            onChange={(e) => handleUpdateVariant(idx, 'size', e.target.value)}
                            style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', width: '100%' }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="SKU..."
                            value={v.skuVariant}
                            onChange={(e) => handleUpdateVariant(idx, 'skuVariant', e.target.value)}
                            style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', width: '100%' }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="Cỏ nhân tạo"
                            value={v.surfaceType}
                            onChange={(e) => handleUpdateVariant(idx, 'surfaceType', e.target.value)}
                            style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', width: '100%' }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="Da tổng hợp"
                            value={v.material}
                            onChange={(e) => handleUpdateVariant(idx, 'material', e.target.value)}
                            style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', width: '100%' }}
                          />
                        </td>
                        <td onMouseLeave={() => setEditingImageIdx(null)}>
                          {editingImageIdx === idx ? (
                            <input
                              type="url"
                              placeholder="https://..."
                              value={v.imageUrl || ''}
                              onChange={(e) => handleUpdateVariant(idx, 'imageUrl', e.target.value)}
                              onBlur={() => setEditingImageIdx(null)}
                              autoFocus
                              style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', width: '100%' }}
                            />
                          ) : (
                            <div 
                              onClick={() => setEditingImageIdx(idx)}
                              style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                              title="Nhấn để sửa link ảnh"
                            >
                              {v.imageUrl ? (
                                <img src={v.imageUrl} alt="Ảnh SP" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--admin-border)' }} />
                              ) : (
                                <div style={{ width: '40px', height: '40px', background: '#f8fafc', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #cbd5e1', fontSize: '10px', color: '#64748b', textAlign: 'center', lineHeight: '1.2' }}>
                                  Nhấn để<br/>thêm
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td>
                          <input
                            type="number"
                            placeholder="10"
                            value={v.variantStock}
                            onChange={(e) => handleUpdateVariant(idx, 'variantStock', parseInt(e.target.value) || 0)}
                            style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', width: '100%', fontWeight: 700 }}
                          />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(idx)}
                            style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '4px' }}
                            title="Xóa dòng chi tiết"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div 
          style={{
            position: 'sticky',
            bottom: '0',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            padding: '16px 24px',
            borderRadius: '12px',
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            justify: 'flex-end',
            gap: '12px',
            marginTop: '24px',
            border: '1px solid var(--admin-border)',
            zIndex: 10
          }}
        >
          <button
            type="button"
            className="admin-btn admin-btn--outline"
            onClick={() => showConfirm("Hủy bỏ", "Bạn có chắc chắn muốn hủy bỏ không? Mọi thay đổi sẽ không được lưu.", onBack)}
            disabled={loading}
            style={{ padding: '10px 24px' }}
          >
            HỦY BỎ
          </button>

          <button
            type="submit"
            className="admin-btn admin-btn--primary"
            disabled={loading}
            style={{ padding: '10px 24px', backgroundColor: '#15803d' }}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} LƯU SẢN PHẨM
          </button>
        </div>
      </form>

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
    </div>
  );
}
