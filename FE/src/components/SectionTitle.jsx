import './SectionTitle.css';

export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="section-title">
      <h2 className="section-title__text">
        <span className="section-title__dash">—</span>
        {title}
        <span className="section-title__dash">—</span>
      </h2>
      {subtitle && <p className="section-title__sub">{subtitle}</p>}
    </div>
  );
}
