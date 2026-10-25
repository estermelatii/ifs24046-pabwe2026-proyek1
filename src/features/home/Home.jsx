import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useFetch from '../../hooks/useFetch.js';
import { getFirstName } from '../../helpers/format.js';
import { fetchCategories, fetchPopularProducts } from '../../services/productService.js';
import { Status } from '../../components/Status.jsx';
import { ProductCard } from '../../components/ProductCard.jsx';
import { selectUser } from '../auth/authSlice.js';

const MOMENT_PHOTO_IDS = { Birthday: 6, Graduation: 16, Anniversary: 12, Appreciation: 20, 'Just Because': 11 };

const COLLECTIONS = [
  { name: 'The Rose Edit', tagline: 'Romantis dan abadi', link: '/toko?color=Red', photoId: 4 },
  { name: 'Blanc Pure', tagline: 'Anggun dan bersih', link: '/toko?color=White', photoId: 15 },
  { name: 'Sunlit', tagline: 'Hangat dan ceria', link: '/toko?color=Yellow', photoId: 16 },
];

const HOW_IT_WORKS = [
  { title: 'Pilih Buket', description: 'Jelajahi katalog kami' },
  { title: 'Checkout', description: 'Isi data pengiriman' },
  { title: 'Kami Siapkan', description: 'Dirangkai dengan penuh cinta' },
  { title: 'Sampai di Tujuan', description: 'Buket siap diterima' },
];

function Hero({ user }) {
  const eyebrow = user ? `Selamat datang kembali, ${getFirstName(user.name)}` : 'FloraGift · Floral Atelier';
  return (
    <section className="hero">
      <div className="hero-left">
        <div className="hero-copy">
          <span className="eyebrow">{eyebrow}</span>
          <h1>Little flowers,<br /><em>meaningful</em> moments.</h1>
          <p>Buket cantik untuk setiap cerita spesialmu. Pilih bunga, warna, dan pesan kartumu sendiri, kami rangkai dengan tangan dan antar sampai tujuan.</p>
          <div className="row">
            <Link className="btn lg" to="/toko">Explore Bouquets</Link>
            <Link className="btn ghost lg" to="/find">Find Your Bloom</Link>
          </div>
        </div>
      </div>
      <div className="hero-right"><img src="/foto/hero.jpg" alt="Buket mawar merah" /></div>
    </section>
  );
}

function Philosophy() {
  return (
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
  );
}

function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div>{Array.from({ length: 12 }, (_, index) => <span key={index}>{index % 2 ? 'Flower Atelier' : 'FloraGift'}</span>)}</div>
    </div>
  );
}

function Collections() {
  return (
    <section className="wrap">
      <span className="eyebrow">Collections</span>
      <h2>Bouquets that Stay with You</h2>
      <div className="coll">
        {COLLECTIONS.map(({ name, tagline, link, photoId }) => (
          <Link key={name} to={link} className="coll-card">
            <img src={`/foto/${photoId}-1.jpg`} alt="" loading="lazy" />
            <div><small>Collection</small><h3>{name}</h3><span>{tagline}</span></div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FeaturedProducts({ products, error }) {
  return (
    <section className="wrap">
      <div className="between"><h2>Our Featured Bouquets</h2><Link to="/toko">View All →</Link></div>
      <Status data={products} error={error}>
        <div className="grid">{products?.items.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </Status>
    </section>
  );
}

function ShopByMoment({ categories }) {
  return (
    <section className="wrap">
      <h2>Shop by Moment</h2>
      <div className="mm-grid">
        {categories?.map((category, index) => (
          <Link key={category.id} to={`/toko?moment=${category.id}`} className="mm">
            <img src={`/foto/${MOMENT_PHOTO_IDS[category.name]}-1.jpg`} alt="" loading="lazy" />
            <div><small>{String(index + 1).padStart(2, '0')}</small><h3>{category.name}</h3><span>Lihat koleksi →</span></div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Signature() {
  return (
    <section className="signature">
      <div>
        <span className="eyebrow">Signature Bouquets</span>
        <h2>The Bouquet Edit</h2>
        <Link to="/toko" className="btn ghost lg">Shop now →</Link>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="wrap">
      <h2>How It Works</h2>
      <ol className="steps">
        {HOW_IT_WORKS.map(({ title, description }, index) => <li key={title}><i>{index + 1}</i><b>{title}</b><span>{description}</span></li>)}
      </ol>
    </section>
  );
}

export function Home() {
  const user = useSelector(selectUser);
  const [featured, error] = useFetch(fetchPopularProducts);
  const [categories] = useFetch(fetchCategories);

  return (
    <>
      <Hero user={user} />
      <Philosophy />
      <Marquee />
      <Collections />
      <FeaturedProducts products={featured} error={error} />
      <ShopByMoment categories={categories} />
      <Signature />
      <HowItWorks />
    </>
  );
}
