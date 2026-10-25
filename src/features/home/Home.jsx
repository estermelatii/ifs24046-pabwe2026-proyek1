import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useFetch from '../../hooks/useFetch.js';
import { fetchCategories, fetchPopularProducts } from '../../services/productService.js';
import { Status, Card } from '../../components/ui.jsx';
import { getFirstName } from '../../helpers/format.js';

const MOMENT_PHOTO_IDS = { Birthday: 6, Graduation: 16, Anniversary: 12, Appreciation: 20, 'Just Because': 11 };

export function Home() {
  const [featured, error] = useFetch(fetchPopularProducts);
  const [categories] = useFetch(fetchCategories);
  const user = useSelector((state) => state.auth.user);
  const howItWorks = [['Pilih Buket', 'Jelajahi katalog kami'], ['Checkout', 'Isi data pengiriman'], ['Kami Siapkan', 'Dirangkai dengan penuh cinta'], ['Sampai di Tujuan', 'Buket siap diterima']];
  const collections = [['The Rose Edit', 'Romantis dan abadi', '/toko?color=Red', 4], ['Blanc Pure', 'Anggun dan bersih', '/toko?color=White', 15], ['Sunlit', 'Hangat dan ceria', '/toko?color=Yellow', 16]];
  return (
    <>
      <section className="hero">
        <div className="hero-left">
          <div className="hero-copy">
            <span className="eyebrow">{user ? `Selamat datang kembali, ${getFirstName(user.name)}` : 'FloraGift · Floral Atelier'}</span>
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
        <div className="coll">{collections.map(([name, tagline, link, photoId]) => <Link key={name} to={link} className="coll-card"><img src={`/foto/${photoId}-1.jpg`} alt="" loading="lazy" /><div><small>Collection</small><h3>{name}</h3><span>{tagline}</span></div></Link>)}</div>
      </section>
      <section className="wrap">
        <div className="between"><h2>Our Featured Bouquets</h2><Link to="/toko">View All →</Link></div>
        <Status data={featured} error={error}><div className="grid">{featured?.items.map((product) => <Card key={product.id} product={product} />)}</div></Status>
      </section>
      <section className="wrap">
        <h2>Shop by Moment</h2>
        <div className="mm-grid">{categories?.map((category, index) => <Link key={category.id} to={`/toko?moment=${category.id}`} className="mm"><img src={`/foto/${MOMENT_PHOTO_IDS[category.name]}-1.jpg`} alt="" loading="lazy" /><div><small>{String(index + 1).padStart(2, '0')}</small><h3>{category.name}</h3><span>Lihat koleksi →</span></div></Link>)}</div>
      </section>
      <section className="signature">
        <div><span className="eyebrow">Signature Bouquets</span><h2>The Bouquet Edit</h2><Link to="/toko" className="btn ghost lg">Shop now →</Link></div>
      </section>
      <section className="wrap">
        <h2>How It Works</h2>
        <ol className="steps">{howItWorks.map(([title, description], index) => <li key={title}><i>{index + 1}</i><b>{title}</b><span>{description}</span></li>)}</ol>
      </section>
    </>
  );
}
