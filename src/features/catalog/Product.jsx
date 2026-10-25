import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { rupiah } from '../../helpers/api.js';
import useFetch from '../../hooks/useFetch.js';
import { Status, Stars, Pic } from '../../components/ui.jsx';
import { Ic } from '../../components/Bouquet.jsx';
import { addItem } from '../../features/cart/cartSlice.js';

export function Product() {
  const { id } = useParams();
  const [p, err] = useFetch('/api/products/' + id);
  const [rev] = useFetch(`/api/products/${id}/reviews`);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [qty, setQty] = useState(1), [ci, setCi] = useState(0), [gi, setGi] = useState(0), [tab, setTab] = useState('d');
  return (
    <section className="wrap">
      <Status data={p} error={err}>
        {p && (() => { const c = p.colors[ci], seeds = [p.id, p.id + 11, p.id + 23].slice(0, p.photos || 1); return (
          <>
            <p className="crumb"><Link to="/">Home</Link> / <Link to="/toko">Shop</Link> / {p.name}</p>
            <div className="detail">
              <div className="gallery" style={seeds.length > 1 ? undefined : { gridTemplateColumns: '1fr' }}>
                {seeds.length > 1 && <div className="thumbs">{seeds.map((s, i) => <button key={s} aria-label={`Foto ${i + 1}`} className={gi === i ? 'on' : ''} onClick={() => setGi(i)}><Pic hex={c.hex} seed={s} src={`/foto/${p.id}-${i + 1}.jpg`} /></button>)}</div>}
                <Pic hex={c.hex} seed={seeds[gi]} src={`/foto/${p.id}-${gi + 1}.jpg`} big />
              </div>
              <div>
                <h1 className="page-title">{p.name}</h1>
                <p className="price big">{rupiah(p.price)} <span className={'badge' + (p.stock < 1 ? ' out' : '')}>{p.stock > 0 ? 'Stok Tersedia' : 'Stok Habis'}</span></p>
                <p><Stars v={p.rating} /> <span className="muted small">{p.rating} ({p.reviews_count} ulasan)</span></p>
                <p className="desc">{p.description}</p>
                <p className="muted small">Pilih warna: <b>{c.name}</b></p>
                <div className="swatches">{p.colors.map((x, i) => <button key={x.name} aria-label={x.name} aria-pressed={ci === i} className={ci === i ? 'on' : ''} style={{ background: x.hex }} onClick={() => setCi(i)} />)}</div>
                <div className="row buy">
                  <div className="qty"><button aria-label="Kurangi" onClick={() => setQty(Math.max(1, qty - 1))}>−</button><span>{qty}</span><button aria-label="Tambah" onClick={() => setQty(Math.min(p.stock, qty + 1))}>+</button></div>
                  <button className="btn" disabled={p.stock < 1} onClick={() => { dispatch(addItem({ product: p, qty, color: c })); nav('/keranjang'); }}>Tambah ke Keranjang</button>
                </div>
              </div>
            </div>
            <div className="assure">
              <div><Ic n="truck" /><b>Pengiriman</b><span>Tersedia di seluruh Indonesia</span></div>
              <div><Ic n="leaf" /><b>Garansi Kesegaran</b><span>Bunga segar, diganti jika layu dalam 3 hari</span></div>
              <div><Ic n="gem" /><b>Kualitas Terjamin</b><span>Dirangkai handmade dari bunga pilihan</span></div>
            </div>
            <div className="tabs">{[['d', 'Deskripsi'], ['i', 'Informasi Produk'], ['u', 'Ulasan']].map(([k, l]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}</div>
            {tab === 'd' && <p className="desc">{p.description} Setiap buket dibuat secara handmade sehingga memiliki sentuhan unik dan khusus. Tambahkan pesan kartu ucapan saat checkout.</p>}
            {tab === 'i' && <dl className="info"><dt>Momen</dt><dd>{p.moment}</dd><dt>Gaya</dt><dd>{p.style}</dd><dt>Warna</dt><dd>{p.colors.map((x) => x.name).join(', ')}</dd><dt>Stok</dt><dd>{p.stock}</dd></dl>}
            {tab === 'u' && (rev?.map((r) => <div key={r.id} className="rev"><b>{r.name}</b> <Stars v={r.rating} /><p>{r.comment}</p></div>) || <p className="notice">Memuat…</p>)}
          </>); })()}
      </Status>
    </section>
  );
}
