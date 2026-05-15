import { Truck, RotateCcw, Shield, Headphones } from 'lucide-react';
import './PromoBar.css';

const features = [
  {
    icon: <Truck size={28} />,
    title: 'Miễn Phí Vận Chuyển',
    desc: 'Đơn hàng từ 500.000đ',
  },
  {
    icon: <RotateCcw size={28} />,
    title: 'Đổi Trả 30 Ngày',
    desc: 'Hoàn tiền 100% nếu lỗi',
  },
  {
    icon: <Shield size={28} />,
    title: 'Hàng Chính Hãng',
    desc: '100% sản phẩm authentic',
  },
  {
    icon: <Headphones size={28} />,
    title: 'Hỗ Trợ 24/7',
    desc: 'Tư vấn tận tình, nhanh chóng',
  },
];

export default function PromoBar() {
  return (
    <section className="promo-bar">
      <div className="promo-bar__container">
        {features.map((f, i) => (
          <div key={i} className="promo-bar__item">
            <div className="promo-bar__icon">{f.icon}</div>
            <div className="promo-bar__text">
              <h4 className="promo-bar__title">{f.title}</h4>
              <p className="promo-bar__desc">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
