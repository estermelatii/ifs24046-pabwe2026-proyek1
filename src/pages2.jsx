import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, rupiah } from './api.js';
import { useCart } from './cart.jsx';
import { useAuth } from './auth.jsx';
import { Card, Pic, Status, useFetch } from './pages.jsx';

const SHIP = 15000;
export function Cart() {
  const { items, setQty, remove, subtotal } = useCart();
  if (!items.length) return <section className="wrap"><h1 className="page-title">Keranjang Belanja</h1><p className="notice">Keranjangmu masih kosong. <Link to="/toko">Pilih buket</Link></p></section>;
  return (
    <section className="wrap">
      <h1 className="page-title">Keranjang Belanja</h1><p className="muted">{items.length} item</p>
      <div className="cols">
        <table className="tbl">
          <thead><tr><th>Produk</th><th>Harga</th><th>Kuantitas</th><th>Subtotal</th><th /></tr></thead>
          <tbody>{items.map((i) => (
            <tr key={i.key}>
              <td><div className="prod"><div className="mini"><Pic hex={i.color.hex} seed={i.id} src={`/foto/${i.id}-1.jpg`} /></div><div><b>{i.name}</b><p className="muted small">Warna: {i.color.name}</p></div></div></td>
              <td>{rupiah(i.price)}</td>
              <td><div className="qty"><button aria-label="Kurangi" onClick={() => setQty(i.key, i.qty - 1)}>−</button><span>{i.qty}</span><button aria-label="Tambah" onClick={() => setQty(i.key, i.qty + 1)}>+</button></div></td>
              <td><b>{rupiah(i.price * i.qty)}</b></td>
              <td><button className="link" onClick={() => remove(i.key)}>Hapus</button></td>
            </tr>))}</tbody>
        </table>
        <aside className="box">
          <h3>Ringkasan Belanja</h3>
          <p className="between"><span>Subtotal</span><span>{rupiah(subtotal)}</span></p>
          <p className="between"><span>Ongkir (estimasi)</span><span>{rupiah(SHIP)}</span></p>
          <p className="between total"><span>Total</span><b>{rupiah(subtotal + SHIP)}</b></p>
          <Link to="/checkout" className="btn full">Checkout</Link>
          <Link to="/toko" className="btn ghost full">Lanjut Belanja</Link>
        </aside>
      </div>
    </section>
  );
}

const COUR = [['JNE', 'JNE Reguler', 15000, '2–3 hari'], ['JNT', 'J&T Express', 18000, '2 hari'], ['GoSend', 'GoSend Instant', 25000, 'Hari ini']];
export function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(1), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const [f, setF] = useState({ customer_name: user?.name || '', phone: '', email: user?.email || '', address: '', city: '', courier: 'JNE', delivery_date: '', card_message: '', payment_method: 'Transfer Bank' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  if (!items.length) return <section className="wrap"><p className="notice">Keranjang kosong. <Link to="/toko">Pilih buket</Link></p></section>;
  const ship = COUR.find((c) => c[0] === f.courier)[2];
  const submit = async (e) => {
    e.preventDefault();
    if (step < 3) return setStep(step + 1);
    setBusy(true); setError('');
    try {
      const o = await api('/api/orders', { method: 'POST', body: { ...f, items: items.map((i) => ({ product_id: i.id, quantity: i.qty, color: i.color.name })) } });
      clear(); nav('/sukses/' + o.code);
    } catch (er) { setError(er.message); setBusy(false); }
  };
  return (
    <section className="wrap">
      <h1 className="page-title">Checkout</h1>
      <ol className="ck">{['Informasi', 'Pengiriman', 'Pembayaran'].map((s, i) => <li key={s} className={step > i ? 'done' : ''}><i>{i + 1}</i>{s}</li>)}</ol>
      <form className="cols" onSubmit={submit}>
        <div className="form">
          {step === 1 && <>
            <h3>Informasi Pelanggan</h3>
            <label>Nama lengkap<input required value={f.customer_name} onChange={set('customer_name')} /></label>
            <label>Nomor telepon<input required inputMode="tel" value={f.phone} onChange={set('phone')} /></label>
            <label>Email<input required type="email" value={f.email} onChange={set('email')} /></label>
          </>}
          {step === 2 && <>
            <h3>Pengiriman</h3>
            <label>Alamat lengkap<textarea required rows="3" value={f.address} onChange={set('address')} /></label>
            <label>Kota<input required value={f.city} onChange={set('city')} /></label>
            <fieldset><legend>Pilihan kurir</legend>{COUR.map(([id, n, c, e]) => <label key={id} className="chk"><input type="radio" name="c" checked={f.courier === id} onChange={() => setF({ ...f, courier: id })} />{n} · {rupiah(c)} · {e}</label>)}</fieldset>
            <label>Tanggal pengiriman<input required type="date" min={new Date().toISOString().slice(0, 10)} value={f.delivery_date} onChange={set('delivery_date')} /></label>
            <label>Pesan kartu ucapan (opsional)<textarea rows="2" value={f.card_message} onChange={set('card_message')} /></label>
          </>}
          {step === 3 && <>
            <h3>Pembayaran</h3>
            <fieldset><legend>Metode pembayaran</legend>{['Transfer Bank', 'QRIS', 'Bayar di Tempat (COD)'].map((m) => <label key={m} className="chk"><input type="radio" name="p" checked={f.payment_method === m} onChange={() => setF({ ...f, payment_method: m })} />{m}</label>)}</fieldset>
            <p className="muted small">Pembayaran bersifat simulasi untuk keperluan tugas. Tidak ada transaksi uang sungguhan.</p>
            <p className="muted">Dikirim ke: {f.address}, {f.city} pada {f.delivery_date}</p>
          </>}
        </div>
        <aside className="box">
          <h3>Pesananmu</h3>
          {items.map((i) => <p className="between" key={i.key}><span>{i.name} ({i.color.name}) × {i.qty}</span><span>{rupiah(i.price * i.qty)}</span></p>)}
          <p className="between"><span>Subtotal</span><span>{rupiah(subtotal)}</span></p>
          <p className="between"><span>Ongkir</span><span>{rupiah(ship)}</span></p>
          <p className="between total"><span>Total</span><b>{rupiah(subtotal + ship)}</b></p>
          {error && <p className="error">{error}</p>}
          <button className="btn full" disabled={busy}>{step === 1 ? 'Lanjut ke Pengiriman' : step === 2 ? 'Lanjut ke Pembayaran' : busy ? 'Memproses…' : 'Bayar & Buat Pesanan'}</button>
          {step > 1 && <button type="button" className="link" onClick={() => setStep(step - 1)}>Kembali</button>}
        </aside>
      </form>
    </section>
  );
}

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

const STEPS = ['Pesanan Dibuat', 'Sedang Diproses', 'Sedang Dikirim', 'Selesai'];
export function Track() {
  const { code } = useParams();
  const nav = useNavigate();
  const [input, setInput] = useState(code || ''), [order, setOrder] = useState(null), [error, setError] = useState('');
  const load = () => api(`/api/orders/${code}`).then((o) => { setOrder(o); setError(''); }).catch((e) => { setOrder(null); setError(e.message); });
  useEffect(() => { code ? load() : setOrder(null); }, [code]);
  const at = order ? STEPS.indexOf(order.status) : -1;
  const demo = async () => { await api(`/api/orders/${code}/status`, { method: 'PATCH', body: { status: STEPS[Math.min(at + 1, 3)] } }); load(); };
  return (
    <section className="wrap narrow">
      <h1 className="page-title">Lacak Pesanan</h1>
      <form className="row" onSubmit={(e) => { e.preventDefault(); input && nav('/lacak/' + input.trim()); }}>
        <input className="search grow" placeholder="Contoh: FG2026100001" value={input} onChange={(e) => setInput(e.target.value)} /><button className="btn">Lacak</button>
      </form>
      {error && <p className="error">{error}</p>}
      {order && (
        <div className="box">
          <h3>{order.code}</h3>
          <ol className="tl">{STEPS.map((s, i) => <li key={s} className={i <= at ? 'done' : ''}><b>{s}</b>{i === at && <span className="muted small">{order.created_at}</span>}</li>)}</ol>
          <h4>Detail Pesanan</h4>
          {order.items.map((i) => <p className="between" key={i.id}><span>{i.name} ({i.color}) × {i.quantity}</span><span>{rupiah(i.price * i.quantity)}</span></p>)}
          <p className="between"><span>Ongkir ({order.courier})</span><span>{rupiah(order.shipping_cost)}</span></p>
          <p className="between total"><span>Total</span><b>{rupiah(order.total)}</b></p>
          {at < 3 && <button className="link" onClick={demo}>Demo: majukan status ke tahap berikutnya</button>}
        </div>
      )}
    </section>
  );
}

export function History() {
  const { user } = useAuth();
  const { add } = useCart();
  const nav = useNavigate();
  const [orders, setOrders] = useState(null), [error, setError] = useState('');
  const [tab, setTab] = useState('Semua');
  const load = () => api('/api/my/orders').then(setOrders).catch((e) => setError(e.message));
  useEffect(() => { user && load(); }, [user]);
  if (!user) return <section className="wrap"><h1 className="page-title">Riwayat Pesanan</h1><p className="notice">Masuk dulu untuk melihat riwayat pesananmu. <Link to="/akun">Masuk atau daftar</Link></p></section>;
  const list = orders?.filter((o) => tab === 'Semua' || o.status === tab);
  const reorder = (o) => { o.items.forEach((i) => add({ id: i.product_id, name: i.name, price: i.price }, i.quantity, { name: i.color, hex: i.color_hex })); nav('/keranjang'); };
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

export function Account() {
  const { user, login, logout } = useAuth();
  const [mode, setMode] = useState('login'), [f, setF] = useState({ name: '', email: '', password: '' }), [error, setError] = useState('');
  const [welcome, setWelcome] = useState(null), [orders, setOrders] = useState(null);
  const [pop] = useFetch('/api/products?sort=popular&limit=4');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  useEffect(() => { user ? api('/api/my/orders').then(setOrders).catch(() => setOrders([])) : setOrders(null); }, [user]);
  useEffect(() => { if (!welcome) return; const t = setTimeout(() => setWelcome(null), 4600); return () => clearTimeout(t); }, [welcome]);
  const submit = async (e) => { e.preventDefault(); setError(''); try { await login(mode, f); setWelcome(mode); } catch (er) { setError(er.message); } };

  if (user) {
    const first = user.name.split(' ')[0], name = first.charAt(0).toUpperCase() + first.slice(1);
    const active = orders?.filter((o) => o.status !== 'Selesai').length ?? 0;
    const spent = orders?.reduce((n, o) => n + o.total, 0) ?? 0;
    const last = orders?.[0];
    return (
      <>
        {welcome && (
          <div className="welcome" onClick={() => setWelcome(null)}>
            <div>
              <span className="eyebrow">{welcome === 'register' ? 'Akun berhasil dibuat' : 'Berhasil masuk'}</span>
              <h1>{welcome === 'register' ? 'Selamat datang,' : 'Selamat datang kembali,'}<br /><em>{name}</em></h1>
              <i className="wline" />
              <p>{welcome === 'register' ? 'Akunmu sudah siap. Temukan buket pertamamu dan rayakan momen spesialmu.' : 'Senang melihatmu lagi. Buket cantik berikutnya sudah menunggu.'}</p>
              <Link to="/toko" className="btn lg">Mulai Jelajahi</Link>
            </div>
          </div>
        )}
        <section className="dash-hero">
          <div className="wrap dash-in">
            <span className="avatar big">{name.charAt(0)}</span>
            <div>
              <span className="eyebrow">Akun Saya</span>
              <h1>Halo, <em>{name}</em></h1>
              <p className="muted">{user.email}</p>
              <div className="row"><Link to="/toko" className="btn">Lanjut Belanja</Link><Link to="/riwayat" className="btn ghost">Riwayat Pesanan</Link><button className="btn ghost" onClick={logout}>Keluar</button></div>
            </div>
          </div>
        </section>
        <section className="wrap">
          <div className="stats">
            <div><b>{orders ? orders.length : '–'}</b><span>Total pesanan</span></div>
            <div><b>{orders ? active : '–'}</b><span>Pesanan berjalan</span></div>
            <div><b>{orders ? rupiah(spent) : '–'}</b><span>Total belanja</span></div>
          </div>
          <h2>Pesanan Terakhir</h2>
          {last ? (
            <div className="box order">
              <div className="between"><b>{last.code}</b><span className="pill">{last.status}</span></div>
              <p className="muted small">{last.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}</p>
              <p className="between"><span className="muted small">{last.created_at}</span><b>{rupiah(last.total)}</b></p>
              <Link className="btn ghost sm" to={`/lacak/${last.code}`}>Lacak Pesanan</Link>
            </div>
          ) : <p className="notice">{orders ? 'Kamu belum punya pesanan. Yuk pilih buket pertamamu.' : 'Memuat…'}</p>}
          <div className="between" style={{ marginTop: 40 }}><h2>Pilihan Untukmu</h2><Link to="/toko">Lihat semua →</Link></div>
          <Status data={pop} error="">{pop && <div className="grid">{pop.items.map((p) => <Card key={p.id} p={p} />)}</div>}</Status>
        </section>
      </>
    );
  }
  return (
    <section className="wrap narrow">
      <h1 className="page-title">{mode === 'login' ? 'Masuk' : 'Daftar'}</h1>
      <form className="box form" onSubmit={submit}>
        {mode === 'register' && <label>Nama<input required value={f.name} onChange={set('name')} /></label>}
        <label>Email<input required type="email" value={f.email} onChange={set('email')} /></label>
        <label>Password<input required type="password" minLength="6" value={f.password} onChange={set('password')} /></label>
        {error && <p className="error">{error}</p>}
        <button className="btn full">{mode === 'login' ? 'Masuk' : 'Buat akun'}</button>
        <button type="button" className="link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}</button>
      </form>
    </section>
  );
}

export const About = () => (
  <section className="wrap narrow"><h1 className="page-title">About FloraGift</h1>
    <p className="desc">FloraGift adalah toko buket bunga online. Setiap buket dirangkai handmade dari bunga segar untuk momen kecil yang berarti besar: ulang tahun, wisuda, anniversary, apresiasi, atau sekadar karena ingin.</p>
    <p className="desc">Kamu bisa memilih warna, menulis pesan kartu sendiri, dan melacak pesananmu sampai tiba.</p></section>
);
export const Contact = () => (
  <section className="wrap narrow">
    <span className="eyebrow">Contact</span>
    <h1 className="page-title">Hubungi Kami</h1>
    <p className="muted">Ada pertanyaan soal pesanan atau ingin buket custom? Kami siap membantu.</p>
    <div className="contact-cards">
      <a className="cc" href="https://wa.me/6282160183466" target="_blank" rel="noreferrer"><small>WhatsApp</small><b>0821-6018-3466</b><span>Chat sekarang →</span></a>
      <a className="cc" href="mailto:manurungester477@gmail.com"><small>Email</small><b>manurungester477@gmail.com</b><span>Kirim email →</span></a>
    </div>
  </section>
);
