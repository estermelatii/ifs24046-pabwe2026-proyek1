import { Link } from 'react-router-dom';

export const NotFound = () => (
  <section className="wrap narrow">
    <span className="eyebrow">404</span>
    <h1 className="page-title">Halaman tidak ditemukan</h1>
    <p className="muted">Alamat yang kamu buka tidak ada atau sudah dipindahkan.</p>
    <Link to="/" className="btn">Kembali ke Beranda</Link>
  </section>
);
