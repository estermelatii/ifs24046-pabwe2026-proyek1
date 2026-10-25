import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { api, rupiah } from '../../helpers/api.js';
import useFetch from '../../hooks/useFetch.js';
import { Status, Card } from '../../components/ui.jsx';
import { authenticate, logout } from '../../features/auth/authSlice.js';

export function Account() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const [mode, setMode] = useState('login'), [f, setF] = useState({ name: '', email: '', password: '' }), [error, setError] = useState('');
  const [welcome, setWelcome] = useState(null), [orders, setOrders] = useState(null);
  const [pop] = useFetch('/api/products?sort=popular&limit=4');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  useEffect(() => { user ? api('/api/my/orders').then(setOrders).catch(() => setOrders([])) : setOrders(null); }, [user]);
  useEffect(() => { if (!welcome) return; const t = setTimeout(() => setWelcome(null), 4600); return () => clearTimeout(t); }, [welcome]);
  const submit = async (e) => { e.preventDefault(); setError(''); try { await dispatch(authenticate({ mode, body: f })).unwrap(); setWelcome(mode); } catch (er) { setError(er.message); } };

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
              <div className="row"><Link to="/toko" className="btn">Lanjut Belanja</Link><Link to="/riwayat" className="btn ghost">Riwayat Pesanan</Link><button className="btn ghost" onClick={() => dispatch(logout())}>Keluar</button></div>
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
        <label>Email<input id="username" required type="email" value={f.email} onChange={set('email')} /></label>
        <label>Password<input id="password" required type="password" minLength="6" value={f.password} onChange={set('password')} /></label>
        {error && <p className="error">{error}</p>}
        <button id="btn-submit" className="btn full">{mode === 'login' ? 'Masuk' : 'Buat akun'}</button>
        <button type="button" className="link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}</button>
      </form>
    </section>
  );
}
