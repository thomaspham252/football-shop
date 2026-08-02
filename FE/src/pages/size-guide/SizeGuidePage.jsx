import { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Phone, MessageSquare, ExternalLink } from 'lucide-react';
import './SizeGuidePage.css';

/* ── Custom SVG for Football Shirt Measurement ── */
const ShirtSvg = () => (
  <svg width="220" height="220" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="25" y="30" width="190" height="190" rx="4" fill="#12161f" stroke="#333" strokeWidth="1.5"/>
    <path d="M 60,60 
             L 90,60 
             C 95,70 145,70 150,60 
             L 180,60 
             L 200,90 
             L 180,105 
             L 175,100 
             L 175,200 
             L 65,200 
             L 65,100 
             L 60,105 
             L 40,90 Z" 
          fill="#1f2833" stroke="#66fcf1" strokeWidth="2"/>
    
    {/* Chest Width Arrow */}
    <path d="M 65,120 L 175,120" stroke="#ffeb3b" strokeWidth="1.5" strokeDasharray="3 3"/>
    <circle cx="65" cy="120" r="3" fill="#ffeb3b"/>
    <circle cx="175" cy="120" r="3" fill="#ffeb3b"/>
    <text x="120" y="112" fill="#ffeb3b" fontSize="11" fontWeight="bold" textAnchor="middle">Rộng ngực</text>

    {/* Shirt Length Arrow */}
    <path d="M 120,68 L 120,200" stroke="#ffeb3b" strokeWidth="1.5" strokeDasharray="3 3"/>
    <circle cx="120" cy="68" r="3" fill="#ffeb3b"/>
    <circle cx="120" cy="200" r="3" fill="#ffeb3b"/>
    <text x="128" y="145" fill="#ffeb3b" fontSize="11" fontWeight="bold">Dài áo</text>
  </svg>
);


/* ── Size Guides Datasets ── */
const shoeSizes = [
  { us: '6.5', cm: '24.5', eu: '39', uk: '6' },
  { us: '7', cm: '25.0', eu: '40', uk: '6' },
  { us: '7.5', cm: '25.5', eu: '40.5', uk: '6.5' },
  { us: '8', cm: '26.0', eu: '41', uk: '7' },
  { us: '8.5', cm: '26.5', eu: '42', uk: '7.5' },
  { us: '9', cm: '27.0', eu: '42.5', uk: '8' },
  { us: '9.5', cm: '27.5', eu: '43', uk: '8.5' },
  { us: '10', cm: '28.0', eu: '44', uk: '9' },
  { us: '10.5', cm: '28.5', eu: '44.5', uk: '9.5' },
  { us: '11', cm: '29.0', eu: '45', uk: '10' },
  { us: '11.5', cm: '29.5', eu: '45.5', uk: '10.5' },
  { us: '12', cm: '30.0', eu: '46', uk: '11' },
];

const shirtSizesList = [
  { size: 'S', height: '1m50 - 1m64', weight: '48 - 57 kg', length: '68 cm', width: '48 cm' },
  { size: 'M', height: '1m65 - 1m72', weight: '58 - 67 kg', length: '70 cm', width: '50 cm' },
  { size: 'L', height: '1m73 - 1m78', weight: '68 - 75 kg', length: '72 cm', width: '52 cm' },
  { size: 'XL', height: '1m79 - 1m85', weight: '76 - 84 kg', length: '74 cm', width: '54 cm' },
  { size: 'XXL', height: '1m85 - 1m90', weight: '85 - 95 kg', length: '76 cm', width: '56 cm' },
];

const accessoryGloves = [
  { size: '7', length: '16.5 - 17.5 cm', desc: 'Trẻ em lớn / Nữ' },
  { size: '8', length: '17.5 - 18.5 cm', desc: 'Người lớn, tay nhỏ' },
  { size: '9', length: '18.5 - 19.5 cm', desc: 'Người lớn, tay vừa' },
  { size: '10', length: '19.5 - 20.5 cm', desc: 'Người lớn, tay to' },
  { size: '11', length: '> 20.5 cm', desc: 'Người lớn, tay rất to' },
];

const accessoryShinguards = [
  { size: 'S', height: 'Dưới 1m40', desc: 'Trẻ em' },
  { size: 'M', height: '1m40 - 1m60', desc: 'Thiếu niên / Người lớn nhỏ' },
  { size: 'L', height: '1m60 - 1m80', desc: 'Người lớn vừa' },
  { size: 'XL', height: 'Trên 1m80', desc: 'Người lớn cao to' },
];

const accessorySocks = [
  { size: 'S', shoeSize: 'Size 30 - 35', desc: 'Trẻ em' },
  { size: 'M', shoeSize: 'Size 36 - 40', desc: 'Thiếu niên / Nữ' },
  { size: 'L', shoeSize: 'Size 41 - 45', desc: 'Người lớn' },
];

export default function SizeGuidePage() {
  const [activeCategory, setActiveCategory] = useState('giay'); // 'ao', 'giay', 'phu-kien'

  return (
    <div className="sg-page">
      <Navbar />

      <main className="sg-container">
        {/* Header */}
        <header className="sg-header">
          <h1 className="sg-header__title">Hướng dẫn chọn size chi tiết sản phẩm</h1>
          <p className="sg-header__subtitle">
            Để mua sắm trực tuyến dễ dàng và chọn được sản phẩm vừa vặn nhất, vui lòng xem hướng dẫn đo và bảng size của từng danh mục sản phẩm dưới đây.
          </p>
        </header>

        {/* Contact box */}
        <section className="sg-contact-box">
          <h2 className="sg-contact-box__title">Kênh liên lạc chính thống của Football Shop</h2>
          <div className="sg-contact-grid">
            <div className="sg-contact-card">
              <span className="sg-contact-card__badge">Ưu tiên</span>
              <h3 className="sg-contact-card__name">Facebook Page</h3>
              <p className="sg-contact-card__desc">Hỗ trợ trả lời tư vấn, duyệt đơn hàng nhanh nhất.</p>
              <div className="sg-contact-card__qr">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <rect x="5" y="5" width="30" height="30" fill="#0b0c10" stroke="#000" strokeWidth="2"/>
                  <rect x="12" y="12" width="16" height="16" fill="#66fcf1"/>
                  <rect x="85" y="5" width="30" height="30" fill="#0b0c10" stroke="#000" strokeWidth="2"/>
                  <rect x="92" y="12" width="16" height="16" fill="#66fcf1"/>
                  <rect x="5" y="85" width="30" height="30" fill="#0b0c10" stroke="#000" strokeWidth="2"/>
                  <rect x="12" y="92" width="16" height="16" fill="#66fcf1"/>
                  <rect x="45" y="10" width="8" height="8" fill="#0b0c10"/>
                  <rect x="60" y="25" width="12" height="6" fill="#0b0c10"/>
                  <rect x="45" y="45" width="20" height="20" fill="#0b0c10"/>
                  <rect x="75" y="50" width="8" height="16" fill="#0b0c10"/>
                  <rect x="15" y="50" width="12" height="12" fill="#0b0c10"/>
                  <rect x="90" y="80" width="10" height="10" fill="#0b0c10"/>
                  <rect x="50" y="90" width="15" height="15" fill="#0b0c10"/>
                  <rect x="100" y="100" width="12" height="12" fill="#66fcf1"/>
                </svg>
              </div>
              <p className="sg-contact-card__desc">Quét mã QR hoặc inbox fanpage trực tiếp</p>
              <div className="sg-contact-card__info-row">Phục vụ 24/7 hàng tuần</div>
            </div>

            <div className="sg-contact-card" style={{ justifyContent: 'center' }}>
              <span className="sg-contact-card__badge" style={{ backgroundColor: '#ff9800', color: '#fff' }}>Kênh khác</span>
              <h3 className="sg-contact-card__name">Hotline & Zalo</h3>
              <p className="sg-contact-card__desc">Gọi điện hoặc gửi ảnh đo chân qua Zalo hotline để nhận tư vấn phom chân bè/thon.</p>
              <div style={{ margin: '20px 0', fontSize: '1.6rem', fontWeight: '800', color: '#ffeb3b' }}>
                1800 1234
              </div>
              <p className="sg-contact-card__desc">Hoặc nhắn tin Zalo: 0987 654 321</p>
              <div className="sg-contact-card__info-row">8:00 - 22:00 hàng ngày</div>
            </div>
          </div>
        </section>

        {/* ── Category Navigation Tabs ── */}
        <section className="sg-category-toggle">
          <button 
            className={`sg-category-btn ${activeCategory === 'ao' ? 'sg-category-btn--active' : ''}`}
            onClick={() => setActiveCategory('ao')}
          >
            👕 Size Áo Đấu
          </button>
          <button 
            className={`sg-category-btn ${activeCategory === 'giay' ? 'sg-category-btn--active' : ''}`}
            onClick={() => setActiveCategory('giay')}
          >
            👟 Size Giày Đá Bóng
          </button>
          <button 
            className={`sg-category-btn ${activeCategory === 'phu-kien' ? 'sg-category-btn--active' : ''}`}
            onClick={() => setActiveCategory('phu-kien')}
          >
            🛡️ Size Phụ Kiện
          </button>
        </section>

        {/* ── Dynamic Category Content Rendering ── */}
        
        {/* CATEGORY 1: SHIRT SIZE GUIDE */}
        {activeCategory === 'ao' && (
          <section className="sg-section">
            <h2 className="sg-section-title">Hướng dẫn chọn size áo đấu bóng đá</h2>
            
            <div className="sg-step">
              <span className="sg-step__number">Bước 1</span>
              <h3 className="sg-step__title">Xác định các thông số chiều cao và cân nặng</h3>
              <ul className="sg-step__list">
                <li className="sg-step__list-item">
                  Cân nặng và chiều cao là hai thông số quan trọng nhất để chọn size áo bóng đá phom ôm vừa phải.
                </li>
                <li className="sg-step__list-item">
                  Nếu bạn nằm ở giữa hai size (ví dụ cao phù hợp size L nhưng nặng phù hợp size M), hãy luôn chọn <strong>size lớn hơn</strong> để thoải mái khi vận động mạnh trên sân.
                </li>
                <li className="sg-step__list-item">
                  Nếu muốn đo kỹ phom áo đấu (đặc biệt là phom Player Fit ôm sát body), hãy sử dụng thước dây đo chiều rộng ngực và chiều dài thân áo của một chiếc áo bạn mặc vừa nhất để đối chiếu.
                </li>
              </ul>
              
              <div className="sg-illus-grid">
                <div className="sg-illus-card" style={{ maxWidth: '400px' }}>
                  <ShirtSvg />
                  <h4 className="sg-illus-card__title">Đo thông số áo đấu (Dài & Rộng ngực)</h4>
                </div>
              </div>
            </div>

            <div className="sg-step">
              <span className="sg-step__number">Bước 2</span>
              <h3 className="sg-step__title">Đối chiếu thông số đo được với bảng size áo chuẩn</h3>
              <div className="sg-table-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h4 className="sg-table-card__title">Bảng size áo đấu nam chuẩn phom châu Á</h4>
                <div className="sg-table-wrap">
                  <table className="sg-size-table">
                    <thead>
                      <tr>
                        <th>Size áo</th>
                        <th>Chiều cao phù hợp</th>
                        <th>Cân nặng phù hợp</th>
                        <th>Dài áo (cm)</th>
                        <th>Rộng ngực (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shirtSizesList.map((s) => (
                        <tr key={s.size}>
                          <td><strong>{s.size}</strong></td>
                          <td>{s.height}</td>
                          <td><span className="sg-accent-text">{s.weight}</span></td>
                          <td>{s.length}</td>
                          <td>{s.width}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CATEGORY 2: SHOES SIZE GUIDE (DEFAULT) */}
        {activeCategory === 'giay' && (
          <section className="sg-section">
            <h2 className="sg-section-title">Các bước tự đo size chân tại nhà</h2>
            
            <div className="sg-step">
              <span className="sg-step__number">Bước 1</span>
              <h3 className="sg-step__title">Thực hiện đo chiều dài và chiều rộng bàn chân</h3>
              <ul className="sg-step__list">
                <li className="sg-step__list-item">
                  Chuẩn bị 1 tờ giấy A4 trắng, 1 cây bút (chì hoặc bi) và 1 chiếc thước kẻ học sinh (cm).
                </li>
                <li className="sg-step__list-item">
                  Đặt tờ giấy A4 sát mép chân tường. Đặt bàn chân lên giấy sao cho gót chân chạm sát vào tường.
                </li>
                <li className="sg-step__list-item">
                  Dùng bút vẽ lại khung bàn chân, hoặc đơn giản hơn là đánh dấu điểm đầu ngón chân dài nhất (ngón cái hoặc ngón trỏ tùy cấu trúc chân).
                </li>
                <li className="sg-step__list-item">
                  Dùng thước kẻ đo chiều dài từ mép tờ giấy (gót chân) đến điểm ngón chân dài nhất vừa đánh dấu. Đây là <strong>chiều dài chân thực tế (cm)</strong>.
                </li>
                <li className="sg-step__list-item">
                  (Khuyên dùng) Đo thêm chiều rộng tại khớp ngón chân rộng nhất hoặc chu vi vòng mu bàn chân để shop tư vấn phom chân (Bè hay Thon).
                </li>
              </ul>

              <div className="sg-illus-grid" style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="sg-illus-card" style={{ maxWidth: '360px' }}>
                  <img src="/size.png" alt="Cách đo size chân" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', display: 'block', margin: '0 auto' }} />
                  <h4 className="sg-illus-card__title">Ảnh minh họa Dài & Rộng bàn chân</h4>
                </div>
              </div>
            </div>

            <div className="sg-step">
              <span className="sg-step__number">Bước 2</span>
              <h3 className="sg-step__title">Đối chiếu chiều dài chân với bảng size chuẩn</h3>
              <p style={{ lineHeight: 1.6, marginBottom: '20px' }}>
                Sau khi có chiều dài chân (cm), hãy đối chiếu với bảng kích thước dưới đây để chọn size giày bóng đá tương ứng.
                Nếu phom chân bạn đầy đặn hoặc bè ngang rộng chân, hãy cân nhắc tăng thêm 0.5 đến 1 size để đi thoải mái hơn.
              </p>

              {/* Standard shoes size table */}
              <div className="sg-table-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h4 className="sg-table-card__title">Bảng size giày đá bóng tiêu chuẩn</h4>
                <div className="sg-table-wrap">
                  <table className="sg-size-table">
                    <thead>
                      <tr>
                        <th>US</th>
                        <th>UK</th>
                        <th>EU</th>
                        <th>Chiều dài chân (CM)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shoeSizes.map((s, idx) => (
                        <tr key={idx}>
                          <td>{s.us}</td>
                          <td>{s.uk}</td>
                          <td><strong>{s.eu}</strong></td>
                          <td><span className="sg-accent-text">{s.cm} cm</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CATEGORY 3: ACCESSORIES SIZE GUIDE */}
        {activeCategory === 'phu-kien' && (
          <section className="sg-section">
            <h2 className="sg-section-title">Hướng dẫn chọn size phụ kiện bóng đá</h2>
            
            {/* Subsection 1: Gloves */}
            <div className="sg-step">
              <span className="sg-step__number">Phần 1</span>
              <h3 className="sg-step__title">Size găng tay thủ môn chính hãng</h3>
              <p style={{ lineHeight: 1.6, marginBottom: '20px' }}>
                Đo chiều dài tay từ đỉnh ngón tay giữa xuống đến lằn chỉ cổ tay đầu tiên, kết hợp đo chiều rộng ngang các khớp ngón tay (không đo ngón cái).
              </p>
              
              <div className="sg-illus-grid" style={{ marginBottom: '30px' }}>
                <div className="sg-illus-card" style={{ maxWidth: '400px' }}>
                  <img src="/handsize.png" alt="Cách đo size găng tay" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', display: 'block', margin: '0 auto' }} />
                  <h4 className="sg-illus-card__title">Ảnh minh họa đo bàn tay chọn size găng</h4>
                </div>
              </div>

              <div className="sg-table-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h4 className="sg-table-card__title">Bảng size găng tay thủ môn chuẩn</h4>
                <div className="sg-table-wrap">
                  <table className="sg-size-table">
                    <thead>
                      <tr>
                        <th>Size găng</th>
                        <th>Chiều dài bàn tay</th>
                        <th>Mô tả phom người dùng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accessoryGloves.map((s) => (
                        <tr key={s.size}>
                          <td><strong>Size {s.size}</strong></td>
                          <td><span className="sg-accent-text">{s.length}</span></td>
                          <td>{s.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Subsection 2: Shinguards & Socks */}
            <div className="sg-tables-container">
              {/* Shinguards */}
              <div className="sg-table-card">
                <h4 className="sg-table-card__title">Size bọc ống đồng (Shinguards)</h4>
                <div className="sg-table-wrap">
                  <table className="sg-size-table">
                    <thead>
                      <tr>
                        <th>Size bọc</th>
                        <th>Chiều cao phù hợp</th>
                        <th>Mô tả phom</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accessoryShinguards.map((s) => (
                        <tr key={s.size}>
                          <td><strong>{s.size}</strong></td>
                          <td><span className="sg-accent-text">{s.height}</span></td>
                          <td>{s.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Socks */}
              <div className="sg-table-card">
                <h4 className="sg-table-card__title">Size tất đá bóng</h4>
                <div className="sg-table-wrap">
                  <table className="sg-size-table">
                    <thead>
                      <tr>
                        <th>Size tất</th>
                        <th>Theo size giày tương ứng</th>
                        <th>Mô tả phom</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accessorySocks.map((s) => (
                        <tr key={s.size}>
                          <td><strong>{s.size}</strong></td>
                          <td><span className="sg-accent-text">{s.shoeSize}</span></td>
                          <td>{s.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Consult bottom CTA */}
        <section className="sg-step" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #1f2833 0%, #12161f 100%)' }}>
          <span className="sg-step__number">Tư vấn</span>
          <h3 className="sg-step__title">Liên hệ shop để được tư vấn chính xác phom dáng</h3>
          <p style={{ lineHeight: 1.6, marginBottom: '25px', maxWidth: '700px', margin: '0 auto 25px auto' }}>
            Mỗi phom áo, phom giày và phụ kiện đều có các đặc tính chất liệu co giãn và phom dáng khác nhau. Hãy liên hệ ngay với Football Shop để được các chuyên viên tư vấn size chuẩn xác nhất!
          </p>
          
          <div className="sg-cta-row">
            <a href="https://zalo.me/0987654321" target="_blank" rel="noopener noreferrer" className="sg-cta-btn sg-cta-btn--zalo">
              <MessageSquare size={18} /> Nhắn tin qua Zalo
            </a>
            <a href="tel:18001234" className="sg-cta-btn sg-cta-btn--hotline">
              <Phone size={18} /> Gọi Hotline: 1800 1234
            </a>
            <a href="https://m.me/footballshop" target="_blank" rel="noopener noreferrer" className="sg-cta-btn sg-cta-btn--fb">
              <ExternalLink size={18} /> Chat Facebook Fanpage
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
