import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './HeroBanner.css';

const slides = [
  {
    id: 1,
    title: 'SIÊU SALE THỂ THAO',
    subtitle: 'Bộ sưu tập mới nhất 2025',
    description: 'Khám phá hàng ngàn mẫu giày thể thao chính hãng từ các thương hiệu hàng đầu thế giới với ưu đãi hấp dẫn nhất',
    cta: 'KHÁM PHÁ NGAY',
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    accent: '#f5a623',
    image: '/banner/bigsale.jpg',
  },
  {
    id: 2,
    title: 'PHỤ KIỆN CAO CẤP',
    subtitle: 'Phong cách & Hiệu suất',
    description: 'Trang phục & phụ kiện thể thao cao cấp, thoáng mát, giúp nâng cao tối đa hiệu suất vận động của bạn',
    cta: 'MUA NGAY',
    bg: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #2d2d2d 100%)',
    accent: '#e53935',
    image: '/banner/bigsalephukien.jpg',
  },
  {
    id: 3,
    title: 'MEGA SALE 50%',
    subtitle: 'Ưu đãi cực khủng',
    description: 'Hàng trăm sản phẩm thể thao chính hãng đang được giảm giá sốc — số lượng có hạn, săn ngay hôm nay',
    cta: 'XEM NGAY',
    bg: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%)',
    accent: '#ffeb3b',
    image: '/banner/sale.jpg',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const slide = slides[current];

  return (
    <section className="hero" style={{ background: slide.bg }}>
      <div className="hero__container">
        <div className="hero__content">
          <p className="hero__subtitle" style={{ color: slide.accent }}>
            {slide.subtitle}
          </p>
          <h1 className="hero__title">{slide.title}</h1>
          <p className="hero__desc">{slide.description}</p>
          <div className="hero__actions">
            <a href="/san-pham" className="hero__btn hero__btn--primary" style={{ background: slide.accent }}>
              {slide.cta}
            </a>
            <a href="/san-pham" className="hero__btn hero__btn--outline">
              XEM TẤT CẢ
            </a>
          </div>
        </div>

        <div className="hero__image-wrap">
          <img
            src={slide.image}
            alt={slide.title}
            className="hero__image"
          />
        </div>
      </div>

      {/* Controls */}
      <button className="hero__arrow hero__arrow--left" onClick={prev} aria-label="Trước">
        <ChevronLeft size={24} />
      </button>
      <button className="hero__arrow hero__arrow--right" onClick={next} aria-label="Tiếp">
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="hero__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero__dot ${i === current ? 'hero__dot--active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
