import React, { useState, useEffect } from 'react';
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
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { adminApi } from '../../../api/adminApi';
import { useToast } from '../../../context/ToastContext';

export default function AddEditProductForm({ editingProduct, onBack, onSuccess }) {
  const { toast } = useToast();

  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [productCode, setProductCode] = useState('');
  const [description, setDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [basePrice, setBasePrice] = useState('');
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
      setSku(prod.sku || '');
      setProductCode(prod.productCode || '');
      setDescription(prod.description || '');
      setDetailedDescription(prod.detailedDescription || '');
      setImageUrl(prod.imageUrl || prod.image || '');
      setBasePrice(prod.basePrice || prod.price || '');
      setDiscountPercentage(prod.discountPercentage || prod.discount || 0);
      setIsActive(prod.isActive !== false);

      if (prod.category?.categoryId) setCategoryId(prod.category.categoryId);
      if (prod.brand?.brandId) setBrandId(prod.brand.brandId);

      // Nếu có ID -> Gọi API lấy chi tiết biến thể màu sắc & size
      if (prod.productId || prod.id) {
        const pId = prod.productId || prod.id;
        const res = await adminApi.getProductById(pId);
        if (res && res.variants && res.variants.length > 0) {
          setVariants(res.variants.map((v, i) => ({
            id: v.variantId || i,
            variantId: v.variantId,
            color: v.color || '',
            size: v.size || '',
            skuVariant: v.skuVariant || '',
            variantPrice: v.variantPrice || '',
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

  // Thêm dòng chi tiết mới (Màu và Size)
  const handleAddVariant = () => {
    const newVariant = {
      id: Date.now(),
      color: 'Xanh Dương',
      size: '42',
      skuVariant: '',
      variantPrice: basePrice || '',
      variantStock: 10,
      imageUrl: imageUrl || ''
    };
    setVariants([...variants, newVariant]);
    toast.success("Đã thêm 1 dòng thuộc tính chi tiết mới (Màu & Size)");
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
    setVariants(variants.filter((_, i) => i !== index));
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName.trim()) {
      toast.warning("Vui lòng nhập Tên sản phẩm!");
      return;
    }
    if (!basePrice || parseFloat(basePrice) <= 0) {
      toast.warning("Vui lòng nhập Giá gốc hợp lệ!");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        productName: productName.trim(),
        sku: sku.trim(),
        productCode: productCode.trim(),
        description,
        detailedDescription,
        categoryId: parseInt(categoryId),
        brandId: brandId ? parseInt(brandId) : null,
        basePrice: parseFloat(basePrice),
        discountPercentage: parseInt(discountPercentage) || 0,
        isActive,
        imageUrl: imageUrl.trim(),
        variants: variants.map(v => ({
          variantId: v.variantId,
          color: v.color,
          size: v.size,
          skuVariant: v.skuVariant,
          variantPrice: v.variantPrice ? parseFloat(v.variantPrice) : calculatedSalePrice(),
          variantStock: parseInt(v.variantStock) || 0,
          imageUrl: v.imageUrl || imageUrl.trim()
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
            onClick={onBack}
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
          {/* LEFT MAIN AREA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Card 1: Thông tin cơ bản */}
            <div className="admin-table-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 18px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                Thông tin cơ bản
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
                    onChange={(e) => setProductName(e.target.value)}
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

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#475569', marginBottom: '6px' }}>
                    MÔ TẢ CHI TIẾT SẢN PHẨM
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
                      rows="5"
                      placeholder="Mô tả chi tiết sản phẩm, công nghệ, chất liệu..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
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

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#475569', marginBottom: '6px' }}>
                    ĐƯỜNG DẪN ẢNH ĐẠI DIỆN (URL)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <ImageIcon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-...jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 36px',
                        borderRadius: '8px',
                        border: '1px solid var(--admin-border)',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  {imageUrl && (
                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={imageUrl} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--admin-border)' }} />
                      <span style={{ fontSize: '11.5px', color: '#16a34a', fontWeight: 600 }}>✓ Đường dẫn ảnh hợp lệ</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card 2: Chi tiết sản phẩm (Chỉ bao gồm Màu sắc và Size) */}
            <div className="admin-table-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Chi tiết sản phẩm
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Thuộc tính chi tiết chỉ bao gồm Màu sắc và Size</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="admin-btn admin-btn--outline"
                  style={{ fontSize: '12.5px', padding: '6px 12px' }}
                >
                  <Plus size={15} /> THÊM CHI TIẾT
                </button>
              </div>

              <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '12px' }}>
                Danh sách chi tiết ({variants.length})
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table" style={{ border: '1px solid #f1f5f9', borderRadius: '8px' }}>
                  <thead>
                    <tr>
                      <th style={{ fontSize: '11.5px' }}>MÀU SẮC</th>
                      <th style={{ fontSize: '11.5px' }}>SIZE</th>
                      <th style={{ fontSize: '11.5px' }}>MÃ SKU CHI TIẾT</th>
                      <th style={{ fontSize: '11.5px' }}>TỒN KHO</th>
                      <th style={{ fontSize: '11.5px' }}>THAO TÁC</th>
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
                            style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', width: '140px' }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="39, 40, 41..."
                            value={v.size}
                            onChange={(e) => handleUpdateVariant(idx, 'size', e.target.value)}
                            style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', width: '90px' }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="SKU-VAR"
                            value={v.skuVariant}
                            onChange={(e) => handleUpdateVariant(idx, 'skuVariant', e.target.value)}
                            style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', width: '140px' }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            placeholder="10"
                            value={v.variantStock}
                            onChange={(e) => handleUpdateVariant(idx, 'variantStock', parseInt(e.target.value) || 0)}
                            style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', width: '90px', fontWeight: 700 }}
                          />
                        </td>
                        <td>
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

          {/* RIGHT SIDEBAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Card 1: Phân loại & Giá cả */}
            <div className="admin-table-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                Phân loại & Giá bán
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#475569', marginBottom: '4px' }}>
                    DANH MỤC *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
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
                      padding: '9px 12px',
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

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginTop: '4px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#475569', marginBottom: '4px' }}>
                    GIÁ GỐC (VNĐ) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="2800000"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--admin-border)',
                      fontSize: '14px',
                      fontWeight: 700,
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#475569', marginBottom: '4px' }}>
                      GIẢM GIÁ (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={discountPercentage}
                      onChange={(e) => setDiscountPercentage(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid var(--admin-border)',
                        fontSize: '13.5px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#475569', marginBottom: '4px' }}>
                      GIÁ BÁN
                    </label>
                    <div style={{ padding: '8px 10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 800, color: '#16a34a' }}>
                      {formatVND(calculatedSalePrice())}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Trạng thái hiển thị (Published / Draft) */}
            <div className="admin-table-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                Trạng thái hiển thị
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label 
                  onClick={() => setIsActive(true)}
                  style={{
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
                      Đang hoạt động (Published)
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px', display: 'block' }}>
                      Sản phẩm sẽ hiển thị trên cửa hàng
                    </span>
                  </div>
                </label>

                <label 
                  onClick={() => setIsActive(false)}
                  style={{
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
            onClick={onBack}
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
    </div>
  );
}
