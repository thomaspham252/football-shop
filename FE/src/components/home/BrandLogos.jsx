import './BrandLogos.css';

const brands = [
  { name: 'Nike',         logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
  { name: 'Adidas',       logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
  { name: 'Puma',         logo: 'https://e7.pngegg.com/pngimages/865/75/png-clipart-puma-sneakers-logo-blue-adidas-blue-cat-like-mammal-thumbnail.png' },
  { name: 'Under Armour', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Under_armour_logo.svg' },
  { name: 'New Balance',  logo: 'https://authentic-shoes.com/wp-content/uploads/2023/05/new-balance-logo_445e7ebbd48345278dadd7c0853fbd82_2048x2048.jpg' },
  { name: 'Asics',        logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Asics_Logo.svg' },
  { name: 'Reebok',       logo: 'https://www.monks.com/data/2023-04/logo-Reebok.png?VersionId=6K8C5HMTeEij3thcsvOY6.zPpN4HG_wF' },
  { name: 'Mizuno',       logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs8Y_PIuTjuw1pjNU4XGL8lGMMx5jNYIWkfg&s' },
];

export default function BrandLogos() {
  return (
    <section className="brands">
      <div className="brands__container">
        <div className="brands__track">
          {[...brands, ...brands].map((brand, i) => (
            <a 
              key={i} 
              href={`/san-pham?brand=${encodeURIComponent(brand.name)}`} 
              className="brands__item"
              title={`Xem các sản phẩm thương hiệu ${brand.name}`}
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="brands__logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = 'block';
                  }
                }}
              />
              <span className="brands__fallback" style={{ display: 'none' }}>
                {brand.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
