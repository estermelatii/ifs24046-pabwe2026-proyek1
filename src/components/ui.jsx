import { useState } from 'react';
import { Link } from 'react-router-dom';
import { rupiah } from '../helpers/format.js';
import Bouquet from './Bouquet.jsx';

export const Status = ({ data, error, children }) => {
  if (error) return <p className="notice">{error}. Pastikan API berjalan lalu muat ulang halaman.</p>;
  if (!data) return <p className="notice">Memuat…</p>;
  return children;
};

export const Stars = ({ rating }) => {
  const filled = Math.round(rating);
  return <span className="stars" aria-label={`Rating ${rating}`}>{'★'.repeat(filled)}{'☆'.repeat(5 - filled)}</span>;
};

export function Pic({ hex, seed, big, src }) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const showPhoto = src && !photoFailed;
  return (
    <div className={'pic' + (big ? ' big' : '') + (showPhoto ? ' photo' : '')} style={{ background: `radial-gradient(circle at 50% 35%, ${hex}55, #3a0509 78%)` }}>
      {showPhoto ? <img src={src} alt="" loading="lazy" onError={() => setPhotoFailed(true)} /> : <Bouquet color={hex} seed={seed} />}
    </div>
  );
}

export function Card({ product }) {
  return (
    <Link to={`/produk/${product.id}`} className="card">
      <Pic hex={product.colors[0].hex} seed={product.id} src={`/foto/${product.id}-1.jpg`} />
      <h3>{product.name}</h3>
      <p className="muted small">{product.moment} · {product.style}</p>
      <p className="price">{rupiah(product.price)}</p>
    </Link>
  );
}
