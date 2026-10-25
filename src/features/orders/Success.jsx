import { Link, useParams } from 'react-router-dom';

export function Success() {
  const { code } = useParams();
  return (
    <section className="wrap center">
      <div className="tick">✓</div>
      <h1 className="page-title">Pesanan Berhasil!</h1>
      <p className="muted">Terima kasih telah memesan di FloraGift.</p>
      <div className="code"><small>Order ID</small>{code}</div>
      <div className="row mid"><Link to={`/lacak/${code}`} className="btn">Lacak Pesanan</Link><Link to="/" className="btn ghost">Kembali ke Beranda</Link></div>
    </section>
  );
}
