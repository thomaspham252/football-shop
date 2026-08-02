import SectionTitle from '../common/SectionTitle';
import ProductCard from '../common/ProductCard';
import './BestSellers.css';




export default function BestSellers({ bestSellersProduct = [] }) {
  return (
    <section className="best-sellers">
      <div className="best-sellers__container">
        <SectionTitle title="SẢN PHẨM BÁN CHẠY" subtitle="Những sản phẩm được yêu thích nhất" />
        <div className="best-sellers__grid">
          {bestSellersProduct.map((p) => (
            <ProductCard key={p.productId} product={p} />
          ))}
        </div>
        <div className="best-sellers__more">
          <a href="/san-pham?type=best-selling" className="best-sellers__more-btn">
            XEM TẤT CẢ SẢN PHẨM BÁN CHẠY
          </a>
        </div>
      </div>
    </section>
  );
}
