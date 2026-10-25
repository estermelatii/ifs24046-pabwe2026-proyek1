import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useFetch from '../../hooks/useFetch.js';
import { Status, Card } from '../../components/ui.jsx';
import Bouquet from '../../components/Bouquet.jsx';

const MP = { Birthday: 6, Graduation: 16, Anniversary: 12, Appreciation: 20, 'Just Because': 11 };

export function Home() {
  const [d, err] = useFetch('/api/products?sort=popular&limit=4');
  const [cats] = useFetch('/api/categories');
  const user = useSelector((s) => s.auth.user);
  const steps = [['Pilih Buket', 'Jelajahi katalog kami'], ['Checkout', 'Isi data pengiriman'], ['Kami Siapkan', 'Dirangkai dengan penuh cinta'], ['Sampai di Tujuan', 'Buket siap diterima']];
  const colls = [['The Rose Edit', 'Romantis dan abadi', '/toko?color=Red', 4], ['Blanc Pure', 'Anggun dan bersih', '/toko?color=White', 15], ['Sunlit', 'Hangat dan ceria', '/toko?color=Yellow', 16]];
  return (
    <>
      <section className="hero">
        <div className="hero-left">
          <div className="hero-copy">
            <span className="eyebrow">{user ? `Selamat datang kembali, ${user.name.split(' ')[0]}` : 'FloraGift · Floral Atelier'}</span>
            <h1>Little flowers,<br /><em>meaningful</em> moments.</h1>
            <p>Buket cantik untuk setiap cerita spesialmu. Pilih bunga, warna, dan pesan kartumu sendiri, kami rangkai dengan tangan dan antar sampai tujuan.</p>
            <div className="row"><Link className="btn lg" to="/toko">Explore Bouquets</Link><Link className="btn ghost lg" to="/find">Find Your Bloom</Link></div>
          </div>
                </div>
        <div className="hero-right"><img src="/foto/hero.jpg" alt="Buket mawar merah" /></div>
      </section>
      <section className="philo">
        <div>
          <span className="eyebrow">Philosophy</span>
          <h2>Flowers as<br />Emotion</h2>
          <Link to="/about" className="btn ghost">Discover our story →</Link>
        </div>
        <div>
          <blockquote>Setiap buket dirancang agar dikenang lama setelah momennya berlalu.</blockquote>
          <p className="muted">Terinspirasi dari seni florist yang abadi, FloraGift merangkai buket dengan tangan, dari bunga segar pilihan, supaya setiap hadiah terasa personal dan berkesan.</p>
        </div>
      </section>
      <div className="marquee" aria-hidden="true"><div>{[...Array(12)].map((_, i) => <span key={i}>{i % 2 ? 'Flower Atelier' : 'FloraGift'}</span>)}</div></div>
      <section className="wrap">
        <span className="eyebrow">Collections</span>
        <h2>Bouquets that Stay with You</h2>
        <div className="coll">{colls.map(([n, t, to, id]) => <Link key={n} to={to} className="coll-card"><img src={`/foto/${id}-1.jpg`} alt="" loading="lazy" /><div><small>Collection</small><h3>{n}</h3><span>{t}</span></div></Link>)}</div>
      </section>
      <section className="wrap">
        <div className="between"><h2>Our Featured Bouquets</h2><Link to="/toko">View All →</Link></div>
        <Status data={d} error={err}><div className="grid">{d?.items.map((p) => <Card key={p.id} p={p} />)}</div></Status>
      </section>
      <section className="wrap">
        <h2>Shop by Moment</h2>
        <div className="mm-grid">{cats?.map((c, i) => <Link key={c.id} to={`/toko?moment=${c.id}`} className="mm"><img src={`/foto/${MP[c.name]}-1.jpg`} alt="" loading="lazy" /><div><small>{String(i + 1).padStart(2, '0')}</small><h3>{c.name}</h3><span>Lihat koleksi →</span></div></Link>)}</div>
      </section>
      <section className="signature">
        <div><span className="eyebrow">Signature Bouquets</span><h2>The Bouquet Edit</h2><Link to="/toko" className="btn ghost lg">Shop now →</Link></div>
      </section>
      <section className="wrap">
        <h2>How It Works</h2>
        <ol className="steps">{steps.map(([t, s], i) => <li key={t}><i>{i + 1}</i><b>{t}</b><span>{s}</span></li>)}</ol>
      </section>
    </>
  );
}
