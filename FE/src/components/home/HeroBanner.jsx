import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './HeroBanner.css';

const slides = [
  {
    id: 1,
    title: 'GIÀY THỂ THAO',
    subtitle: 'Bộ sưu tập mới nhất 2025',
    description: 'Khám phá hàng ngàn mẫu giày thể thao chính hãng từ các thương hiệu hàng đầu thế giới',
    cta: 'KHÁM PHÁ NGAY',
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    accent: '#f5a623',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  },
  {
    id: 2,
    title: 'QUẦN ÁO THỂ THAO',
    subtitle: 'Phong cách & Hiệu suất',
    description: 'Trang phục thể thao cao cấp, thoáng mát, phù hợp mọi hoạt động thể chất',
    cta: 'MUA NGAY',
    bg: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #2d2d2d 100%)',
    accent: '#e53935',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=600&q=80',
  },
  {
    id: 3,
    title: 'SALE LỚN',
    subtitle: 'Giảm đến 50%',
    description: 'Hàng trăm sản phẩm thể thao chính hãng đang được giảm giá sốc — số lượng có hạn',
    cta: 'XEM NGAY',
    bg: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%)',
    accent: '#ffeb3b',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
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
