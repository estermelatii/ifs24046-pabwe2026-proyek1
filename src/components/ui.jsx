import { useState } from 'react';
import { Link } from 'react-router-dom';
import { rupiah } from '../helpers/api.js';
import Bouquet from './Bouquet.jsx';

export const Status = ({ data, error, children }) =>
  error ? <p className="notice">{error}. Pastikan API berjalan lalu muat ulang halaman.</p> : !data ? <p className="notice">Memuat…</p> : children;
export const Stars = ({ v }) => <span className="stars" aria-label={`Rating ${v}`}>{'★'.repeat(Math.round(v))}{'☆'.repeat(5 - Math.round(v))}</span>;
export function Pic({ hex, seed, big, src }) {
  const [bad, setBad] = useState(false);
  const photo = src && !bad;
  return (
    <div className={'pic' + (big ? ' big' : '') + (photo ? ' photo' : '')} style={{ background: `radial-gradient(circle at 50% 35%, ${hex}55, #3a0509 78%)` }}>
      {photo ? <img src={src} alt="" loading="lazy" onError={() => setBad(true)} /> : <Bouquet color={hex} seed={seed} />}
    </div>
  );
}
export function Card({ p }) {
  return (
    <Link to={`/produk/${p.id}`} className="card">
      <Pic hex={p.colors[0].hex} seed={p.id} src={`/foto/${p.id}-1.jpg`} />
      <h3>{p.name}</h3>
      <p className="muted small">{p.moment} · {p.style}</p>
      <p className="price">{rupiah(p.price)}</p>
    </Link>
  );
}
