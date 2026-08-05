import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Globe,
  Star,
  FolderTree,
  Code,
  X
} from 'lucide-react';
import { initialProductsCatalog } from '../mockData';

const initialBrands = [
  { 
    brandId: 1, 
    brandCode: 'BR-NIKE', 
    brandName: 'Nike', 
    description: 'Thương hiệu thể thao & giày đá bóng hàng đầu thế giới từ Mỹ',
    logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80',
    country: 'Mỹ', 
    status: 'Đang hoạt động',
    displayOrder: 1,
    productsCount: 48 
  },
  { 
    brandId: 2, 
    brandCode: 'BR-ADIDAS', 
    brandName: 'Adidas', 
    description: 'Gã khổng lồ thể thao Đức với các dòng Predator, Copa, X',
    logoUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=100&auto=format&fit=crop&q=80',
    country: 'Đức', 
    status: 'Đang hoạt động',
    displayOrder: 2,
    productsCount: 36 
  },
  { 
    brandId: 3, 
    brandCode: 'BR-PUMA', 
    brandName: 'Puma', 
    description: 'Thương hiệu giày đá bóng tốc độ Future và Ultra',
    logoUrl: 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=100&auto=format&fit=crop&q=80',
    country: 'Đức', 
    status: 'Đang hoạt động',
    displayOrder: 3,
    productsCount: 22 
  },
  { 
    brandId: 4, 
    brandCode: 'BR-MIZUNO', 
    brandName: 'Mizuno', 
    description: 'Giày bóng đá da thật K-Leather cao cấp thủ công Nhật Bản',
    logoUrl: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=100&auto=format&fit=crop&q=80',
    country: 'Nhật Bản', 
    status: 'Đang hoạt động',
    displayOrder: 4,
    productsCount: 18 
  }
];

const initialCategories = [
  { 
    categoryId: 1, 
    categoryCode: 'CAT-FOOTWEAR', 
    categoryName: 'Giày đá bóng', 
    categoryType: 'Giày đá bóng',
    slug: 'giay-da-bong', 
    description: 'Giày đá bóng sân cỏ nhân tạo TF, sân cỏ tự nhiên FG, SG',
    parentCategory: null,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80',
    displayOrder: 1,
    isActive: true,
    productsCount: 64 
  },
  { 
    categoryId: 2, 
    categoryCode: 'CAT-APPAREL', 
    categoryName: 'Áo bóng đá', 
    categoryType: 'Quần áo thi đấu',
    slug: 'ao-bong-da', 
    description: 'Quần áo thi đấu câu lạc bộ, đội tuyển quốc gia chính hãng',
    parentCategory: null,
    imageUrl: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=100&auto=format&fit=crop&q=80',
    displayOrder: 2,
    isActive: true,
    productsCount: 42 
  },
  { 
    categoryId: 3, 
    categoryCode: 'CAT-EQUIPMENT', 
    categoryName: 'Quả bóng đá', 
    categoryType: 'Bóng & Dụng cụ',
    slug: 'qua-bong-da', 
    description: 'Bóng đá thi đấu FIFA Quality Pro, bóng tập luyện',
    parentCategory: null,
    imageUrl: 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=100&auto=format&fit=crop&q=80',
    displayOrder: 3,
    isActive: true,
    productsCount: 28 
  },
  { 
    categoryId: 4, 
    categoryCode: 'CAT-ACCESSORIES', 
    categoryName: 'Phụ kiện thể thao', 
    categoryType: 'Phụ kiện',
    slug: 'phu-kien-the-thao', 
    description: 'Găng tay thủ môn, bọc ống chân, tất chống trượt, túi đựng giày',
    parentCategory: null,
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=100&auto=format&fit=crop&q=80',
    displayOrder: 4,
    isActive: true,
    productsCount: 35 
  }
];

export default function AdminProducts() {
  const [activeTab, setActiveTab] = useState('all_products');
  const [products] = useState(initialProductsCatalog);
  const [brands, setBrands] = useState(initialBrands);
  const [categories, setCategories] = useState(initialCategories);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modals
  const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  // Form State
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
    parentCategoryId: '',
    imageUrl: '',
    displayOrder: 1,
    isActive: true
  });

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredBrands = brands.filter((b) =>
    b.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.brandCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.country && b.country.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCategories = categories.filter((c) =>
    c.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.categoryCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCatNameChange = (val) => {
    const generatedSlug = val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/([^0-9a-z-\s])/g, '')
      .replace(/(\s+)/g, '-')
      .replace(/^-+|-+$/g, '');

    setCatForm({
      ...catForm,
      categoryName: val,
      categoryCode: catForm.categoryCode || `CAT-${generatedSlug.toUpperCase().slice(0, 10)}`,
      slug: generatedSlug
    });
  };

  const handleBrandNameChange = (val) => {
    const code = 'BR-' + val.toUpperCase().replace(/\s+/g, '').slice(0, 10);
    setBrandForm({
      ...brandForm,
      brandName: val,
      brandCode: brandForm.brandCode || code
    });
  };

  const handleAddBrandSubmit = (e) => {
    e.preventDefault();
    const newBrand = {
      brandId: Date.now(),
      ...brandForm,
      logoUrl: brandForm.logoUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80',
      productsCount: 0
    };
    setBrands([newBrand, ...brands]);
    setBrandForm({
      brandCode: '',
      brandName: '',
      description: '',
      logoUrl: '',
      country: '',
      status: 'Đang hoạt động',
      displayOrder: 1
    });
    setIsAddBrandOpen(false);
  };

  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    const newCategory = {
      categoryId: Date.now(),
      ...catForm,
      imageUrl: catForm.imageUrl || 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=100&auto=format&fit=crop&q=80',
      productsCount: 0
    };
    setCategories([newCategory, ...categories]);
    setCatForm({
      categoryCode: '',
      categoryName: '',
      description: '',
      categoryType: 'Giày đá bóng',
      slug: '',
      parentCategoryId: '',
      imageUrl: '',
      displayOrder: 1,
      isActive: true
    });
    setIsAddCategoryOpen(false);
  };

  return (
    <div className="admin-products-view">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-header__left">
          <h1 className="admin-page-title">Quản lý sản phẩm</h1>
          <p className="admin-page-sub">Quản lý danh mục sản phẩm, thương hiệu và nhóm hàng hóa.</p>
        </div>

        {activeTab === 'all_products' && (
          <button className="admin-btn admin-btn--primary">
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
          Tất cả sản phẩm
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

      {/* TAB 1: ALL PRODUCTS */}
      {activeTab === 'all_products' && (
        <>
          <div className="admin-table-card" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ position: 'relative', width: '320px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
              <input
                type="text"
                placeholder="Tìm tên sản phẩm, thương hiệu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13.5px', outline: 'none' }}
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13.5px', outline: 'none', background: '#ffffff' }}
            >
              <option value="all">Tất cả danh mục</option>
              <option value="Giày đá bóng">Giày đá bóng</option>
              <option value="Áo bóng đá">Áo bóng đá</option>
              <option value="Bóng đá">Quả bóng đá</option>
              <option value="Phụ kiện">Phụ kiện thể thao</option>
            </select>
          </div>

          <div className="admin-table-card">
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Sản Phẩm</th>
                    <th>Danh Mục</th>
                    <th>Thương Hiệu</th>
                    <th>Giá Bán</th>
                    <th>Tồn Kho</th>
                    <th>Trạng Thái</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={p.image} alt={p.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--admin-border)' }} />
                          <div style={{ fontWeight: 600, color: 'var(--admin-text-dark)' }}>{p.name}</div>
                        </div>
                      </td>
                      <td>{p.category}</td>
                      <td><span className="admin-badge admin-badge--neutral">{p.brand}</span></td>
                      <td style={{ fontWeight: 700, color: 'var(--admin-primary)' }}>{p.price}</td>
                      <td style={{ fontWeight: 600 }}>{p.stock}</td>
                      <td><span className="admin-badge admin-badge--success"><CheckCircle2 size={12} /> {p.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                          <button style={{ background: 'none', border: '1px solid var(--admin-border)', borderRadius: '6px', padding: '6px', cursor: 'pointer' }}><Edit3 size={15} /></button>
                          <button style={{ background: 'none', border: '1px solid var(--admin-border)', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: 'var(--admin-danger)' }}><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: BRANDS */}
      {activeTab === 'brands' && (
        <>
          <div className="admin-table-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
            <div style={{ position: 'relative', width: '320px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
              <input
                type="text"
                placeholder="Tìm mã, tên thương hiệu, quốc gia..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13.5px', outline: 'none' }}
              />
            </div>
          </div>

          <div className="admin-table-card">
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mã Thương Hiệu</th>
                    <th>Logo & Tên Thương Hiệu</th>
                    <th>Quốc Gia</th>
                    <th>Trạng Thái</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBrands.map((b) => (
                    <tr key={b.brandId}>
                      <td>
                        <code style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, color: 'var(--admin-primary)' }}>
                          {b.brandCode}
                        </code>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={b.logoUrl} alt={b.brandName} style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--admin-border)' }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--admin-text-dark)' }}>{b.brandName}</div>
                            <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>{b.description}</div>
                          </div>
                        </div>
                      </td>
                      <td>{b.country || 'Chưa cập nhật'}</td>
                      <td>
                        <span className="admin-badge admin-badge--success">
                          {b.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                          <button style={{ background: 'none', border: '1px solid var(--admin-border)', borderRadius: '6px', padding: '6px', cursor: 'pointer' }}><Edit3 size={15} /></button>
                          <button style={{ background: 'none', border: '1px solid var(--admin-border)', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: 'var(--admin-danger)' }}><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* TAB 3: CATEGORIES */}
      {activeTab === 'categories' && (
        <>
          <div className="admin-table-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
            <div style={{ position: 'relative', width: '320px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
              <input
                type="text"
                placeholder="Tìm mã, tên danh mục, đường dẫn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13.5px', outline: 'none' }}
              />
            </div>
          </div>

          <div className="admin-table-card">
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mã Danh Mục</th>
                    <th>Ảnh & Tên Danh Mục</th>
                    <th>Phân Loại</th>
                    <th>Đường Dẫn Slug</th>
                    <th>Trạng Thái</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((c) => (
                    <tr key={c.categoryId}>
                      <td>
                        <code style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, color: 'var(--admin-primary)' }}>
                          {c.categoryCode}
                        </code>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={c.imageUrl} alt={c.categoryName} style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--admin-border)' }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--admin-text-dark)' }}>{c.categoryName}</div>
                            <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>{c.description}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="admin-badge admin-badge--info" style={{ fontSize: '10.5px' }}>
                          {c.categoryType}
                        </span>
                      </td>
                      <td>
                        <code style={{ background: '#eff6ff', padding: '2px 8px', borderRadius: '4px', fontSize: '11.5px', color: '#1d4ed8' }}>
                          /{c.slug}
                        </code>
                      </td>
                      <td>
                        <span className={`admin-badge admin-badge--${c.isActive ? 'success' : 'neutral'}`}>
                          {c.isActive ? 'Kích hoạt' : 'Ẩn'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                          <button style={{ background: 'none', border: '1px solid var(--admin-border)', borderRadius: '6px', padding: '6px', cursor: 'pointer' }}><Edit3 size={15} /></button>
                          <button style={{ background: 'none', border: '1px solid var(--admin-border)', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: 'var(--admin-danger)' }}><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
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
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>
                      Tên thương hiệu *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nike, Adidas..."
                      value={brandForm.brandName}
                      onChange={(e) => handleBrandNameChange(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>
                      Mã thương hiệu *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="BR-NIKE"
                      value={brandForm.brandCode}
                      onChange={(e) => setBrandForm({ ...brandForm, brandCode: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>
                    Quốc gia
                  </label>
                  <input
                    type="text"
                    placeholder="Mỹ, Đức, Nhật..."
                    value={brandForm.country}
                    onChange={(e) => setBrandForm({ ...brandForm, country: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>
                    Đường dẫn Logo
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/logo.png"
                    value={brandForm.logoUrl}
                    onChange={(e) => setBrandForm({ ...brandForm, logoUrl: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>
                    Mô tả
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Giới thiệu thương hiệu..."
                    value={brandForm.description}
                    onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none', resize: 'none' }}
                  ></textarea>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: 600 }}>Thứ tự hiển thị:</label>
                  <input
                    type="number"
                    value={brandForm.displayOrder}
                    onChange={(e) => setBrandForm({ ...brandForm, displayOrder: parseInt(e.target.value) || 1 })}
                    style={{ width: '80px', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--admin-border)', fontSize: '13px' }}
                  />
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
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>
                      Tên danh mục *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Giày đá bóng, Áo bóng đá..."
                      value={catForm.categoryName}
                      onChange={(e) => handleCatNameChange(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>
                      Mã danh mục *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="CAT-FOOTWEAR"
                      value={catForm.categoryCode}
                      onChange={(e) => setCatForm({ ...catForm, categoryCode: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>
                      Phân loại *
                    </label>
                    <select
                      value={catForm.categoryType}
                      onChange={(e) => setCatForm({ ...catForm, categoryType: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none', background: '#ffffff' }}
                    >
                      <option value="Giày đá bóng">Giày đá bóng</option>
                      <option value="Quần áo thi đấu">Quần áo thi đấu</option>
                      <option value="Bóng & Dụng cụ">Bóng & Dụng cụ</option>
                      <option value="Phụ kiện">Phụ kiện</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>
                      Đường dẫn Slug *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="giay-da-bong"
                      value={catForm.slug}
                      onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>
                    Đường dẫn Ảnh
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/category-thumb.jpg"
                    value={catForm.imageUrl}
                    onChange={(e) => setCatForm({ ...catForm, imageUrl: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>
                    Mô tả danh mục
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Mô tả danh mục..."
                    value={catForm.description}
                    onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', outline: 'none', resize: 'none' }}
                  ></textarea>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={catForm.isActive}
                      onChange={(e) => setCatForm({ ...catForm, isActive: e.target.checked })}
                    />
                    Kích hoạt hiển thị
                  </label>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: 600 }}>Thứ tự hiển thị:</label>
                    <input
                      type="number"
                      value={catForm.displayOrder}
                      onChange={(e) => setCatForm({ ...catForm, displayOrder: parseInt(e.target.value) || 1 })}
                      style={{ width: '60px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--admin-border)' }}
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
