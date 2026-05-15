import './BrandLogos.css';

const brands = [
  { name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
  { name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
  { name: 'Puma', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Puma_logo.svg' },
  { name: 'Under Armour', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Under_armour_logo.svg' },
  { name: 'New Balance', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/New_Balance_logo.svg' },
  { name: 'Asics', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Asics_Logo.svg' },
  { name: 'Reebok', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Reebok_2019_logo.svg' },
  { name: 'Wilson', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Wilson_Sporting_Goods_logo.svg' },
];

export default function BrandLogos() {
  return (
    <section className="brands">
      <div className="brands__container">
        <div className="brands__track">
          {[...brands, ...brands].map((brand, i) => (
            <a key={i} href={`/thuong-hieu/${brand.name.toLowerCase().replace(' ', '-')}`} className="brands__item">
              <img
                src={brand.logo}
                alt={brand.name}
                className="brands__logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
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
