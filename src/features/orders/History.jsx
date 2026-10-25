import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { api, rupiah } from '../../helpers/api.js';
import { STEPS } from '../../helpers/constants.js';
import { Pic } from '../../components/ui.jsx';
import { addItem } from '../../features/cart/cartSlice.js';

export function History() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [orders, setOrders] = useState(null), [error, setError] = useState('');
  const [tab, setTab] = useState('Semua');
  const load = () => api('/api/my/orders').then(setOrders).catch((e) => setError(e.message));
  useEffect(() => { user && load(); }, [user]);
  if (!user) return <section className="wrap"><h1 className="page-title">Riwayat Pesanan</h1><p className="notice">Masuk dulu untuk melihat riwayat pesananmu. <Link to="/akun">Masuk atau daftar</Link></p></section>;
  const list = orders?.filter((o) => tab === 'Semua' || o.status === tab);
  const reorder = (o) => { o.items.forEach((i) => dispatch(addItem({ product: { id: i.product_id, name: i.name, price: i.price }, qty: i.quantity, color: { name: i.color, hex: i.color_hex } }))); nav('/keranjang'); };
  const received = async (o) => { await api(`/api/orders/${o.code}/received`, { method: 'POST' }); load(); };
  return (
    <section className="wrap narrow">
      <h1 className="page-title">Riwayat Pesanan</h1>
      <div className="chips">{['Semua', ...STEPS].map((s) => <button key={s} className={'chip' + (tab === s ? ' on' : '')} onClick={() => setTab(s)}>{s}</button>)}</div>
      {error && <p className="error">{error}</p>}
      {list && !list.length && <p className="notice">Belum ada pesanan. <Link to="/toko">Mulai belanja</Link></p>}
      {list?.map((o) => (
        <div className="box order" key={o.id}>
          <div className="between"><b>{o.code}</b><span className="pill">{o.status}</span></div>
          <div className="row">{o.items.map((i) => <div className="mini" key={i.id}><Pic hex={i.color_hex} seed={i.product_id} src={`/foto/${i.product_id}-1.jpg`} /></div>)}<span className="muted small">{o.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}</span></div>
          <p className="between"><span className="muted small">{o.created_at}</span><b>{rupiah(o.total)}</b></p>
          <div className="row">
            <Link className="btn ghost sm" to={`/lacak/${o.code}`}>Lihat Detail</Link>
            {o.status === 'Sedang Dikirim' && <button className="btn sm" onClick={() => received(o)}>Received</button>}
            <button className="btn ghost sm" onClick={() => reorder(o)}>Reordering</button>
            <a className="btn ghost sm" href={`https://wa.me/6282160183466?text=Halo%20admin%2C%20saya%20mau%20tanya%20pesanan%20${o.code}`} target="_blank" rel="noreferrer">Chat Admin</a>
          </div>
        </div>
      ))}
    </section>
  );
}
