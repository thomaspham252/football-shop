import SectionTitle from "../common/SectionTitle";
import ProductCard from "../common/ProductCard";
import "./PromotionProducts.css";

export default function PromotionProducts({ promotionProducts = [] }) {
  return (
    <section className="promotion-products">
      <div className="promotion-products__container">
        <SectionTitle title="SẢN PHẨM KHUYẾN MÃI" />

        <div className="promotion-products__grid">
          {promotionProducts.map((p) => (
            <ProductCard key={p.productId} product={p} />
          ))}
        </div>

        <div className="promotion-products__more">
          <a href="/san-pham?type=promotion" className="promotion-products__more-btn">
            XEM TẤT CẢ SẢN PHẨM KHUYẾN MÃI
          </a>
        </div>
      </div>
    </section>
  );
}
