import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { rupiah } from '../../helpers/format.js';
import useFetch from '../../hooks/useFetch.js';
import { fetchProduct, fetchProductReviews } from '../../services/productService.js';
import { Status } from '../../components/Status.jsx';
import { Stars } from '../../components/Stars.jsx';
import { Pic } from '../../components/Pic.jsx';
import { Icon } from '../../components/Icon.jsx';
import { ColorSwatches } from '../../components/ColorSwatches.jsx';
import { QuantityStepper } from '../../components/QuantityStepper.jsx';
import { addItem } from '../cart/cartSlice.js';

const PHOTO_SEED_OFFSETS = [0, 11, 23];
const TABS = [
  { id: 'description', label: 'Deskripsi' },
  { id: 'info', label: 'Informasi Produk' },
  { id: 'reviews', label: 'Ulasan' },
];

function ProductDetail({ product, reviews }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [colorIndex, setColorIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  const selectedColor = product.colors[colorIndex];
  const photoSeeds = PHOTO_SEED_OFFSETS.slice(0, product.photos || 1).map((offset) => product.id + offset);
  const hasMultiplePhotos = photoSeeds.length > 1;

  const addToCart = () => {
    dispatch(addItem({ product, qty: quantity, color: selectedColor }));
    navigate('/keranjang');
  };

  return (
    <>
      <p className="crumb"><Link to="/">Home</Link> / <Link to="/toko">Shop</Link> / {product.name}</p>
      <div className="detail">
        <div className="gallery" style={hasMultiplePhotos ? undefined : { gridTemplateColumns: '1fr' }}>
          {hasMultiplePhotos && (
            <div className="thumbs">
              {photoSeeds.map((seed, index) => (
                <button key={seed} aria-label={`Foto ${index + 1}`} className={photoIndex === index ? 'on' : ''} onClick={() => setPhotoIndex(index)}>
                  <Pic hex={selectedColor.hex} seed={seed} src={`/foto/${product.id}-${index + 1}.jpg`} />
                </button>
              ))}
            </div>
          )}
          <Pic hex={selectedColor.hex} seed={photoSeeds[photoIndex]} src={`/foto/${product.id}-${photoIndex + 1}.jpg`} big />
        </div>
        <div>
          <h1 className="page-title">{product.name}</h1>
          <p className="price big">{rupiah(product.price)} <span className={'badge' + (product.stock < 1 ? ' out' : '')}>{product.stock > 0 ? 'Stok Tersedia' : 'Stok Habis'}</span></p>
          <p><Stars rating={product.rating} /> <span className="muted small">{product.rating} ({product.reviews_count} ulasan)</span></p>
          <p className="desc">{product.description}</p>
          <p className="muted small">Pilih warna: <b>{selectedColor.name}</b></p>
          <ColorSwatches colors={product.colors} selectedName={selectedColor.name} onSelect={(_, index) => setColorIndex(index)} />
          <div className="row buy">
            <QuantityStepper value={quantity} min={1} max={product.stock} onChange={setQuantity} />
            <button className="btn" disabled={product.stock < 1} onClick={addToCart}>Tambah ke Keranjang</button>
          </div>
        </div>
      </div>
      <div className="assure">
        <div><Icon name="truck" /><b>Pengiriman</b><span>Tersedia di seluruh Indonesia</span></div>
        <div><Icon name="leaf" /><b>Garansi Kesegaran</b><span>Bunga segar, diganti jika layu dalam 3 hari</span></div>
        <div><Icon name="gem" /><b>Kualitas Terjamin</b><span>Dirangkai handmade dari bunga pilihan</span></div>
      </div>
      <div className="tabs">
        {TABS.map((tab) => <button key={tab.id} className={activeTab === tab.id ? 'on' : ''} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>)}
      </div>
      {activeTab === 'description' && <p className="desc">{product.description} Setiap buket dibuat secara handmade sehingga memiliki sentuhan unik dan khusus. Tambahkan pesan kartu ucapan saat checkout.</p>}
      {activeTab === 'info' && (
        <dl className="info">
          <dt>Momen</dt><dd>{product.moment}</dd>
          <dt>Gaya</dt><dd>{product.style}</dd>
          <dt>Warna</dt><dd>{product.colors.map((color) => color.name).join(', ')}</dd>
          <dt>Stok</dt><dd>{product.stock}</dd>
        </dl>
      )}
      {activeTab === 'reviews' && (reviews
        ? reviews.map((review) => <div key={review.id} className="rev"><b>{review.name}</b> <Stars rating={review.rating} /><p>{review.comment}</p></div>)
        : <p className="notice">Memuat…</p>)}
    </>
  );
}

export function Product() {
  const { id } = useParams();
  const [product, error] = useFetch(fetchProduct, id);
  const [reviews] = useFetch(fetchProductReviews, id);

  return (
    <section className="wrap">
      <Status data={product} error={error}>
        {product && <ProductDetail product={product} reviews={reviews} />}
      </Status>
    </section>
  );
}
ProductDetail.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number,
    rating: PropTypes.number,
    reviews_count: PropTypes.number,
    description: PropTypes.string,
    moment: PropTypes.string,
    style: PropTypes.string,
    photos: PropTypes.number,
    colors: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      hex: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  reviews: PropTypes.array,
};

