import SectionTitle from "../common/SectionTitle";
import ProductCard from "../common/ProductCard";
import "./NewProducts.css";

export default function NewProducts({ newProducts = [] }) {
  return (
      <section className="new-products">
        <div className="new-products__container">
          <SectionTitle
              title={`SẢN PHẨM MỚI THÁNG ${new Date().getMonth() + 1}`}
          />

          <div className="new-products__grid">
            {newProducts.map((p) => (
                <ProductCard key={p.productId} product={p} />
            ))}
          </div>

          <div className="new-products__more">
            <a href="/san-pham?type=new" className="new-products__more-btn">
              XEM TẤT CẢ SẢN PHẨM MỚI
            </a>
          </div>
        </div>
      </section>
  );
}