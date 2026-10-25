import { Link } from 'react-router-dom';
import { rupiah } from '../helpers/format.js';
import { Pic } from './Pic.jsx';

export function ProductCard({ product }) {
  return (
    <Link to={`/produk/${product.id}`} className="card">
      <Pic hex={product.colors[0].hex} seed={product.id} src={`/foto/${product.id}-1.jpg`} />
      <h3>{product.name}</h3>
      <p className="muted small">{product.moment} · {product.style}</p>
      <p className="price">{rupiah(product.price)}</p>
    </Link>
  );
}
