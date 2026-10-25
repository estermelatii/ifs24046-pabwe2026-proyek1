import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { api, rupiah } from '../../helpers/api.js';
import { clearCart, selectSubtotal } from '../../features/cart/cartSlice.js';

const COUR = [['JNE', 'JNE Reguler', 15000, '2–3 hari'], ['JNT', 'J&T Express', 18000, '2 hari'], ['GoSend', 'GoSend Instant', 25000, 'Hari ini']];
export function Checkout() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.cart.items);
  const subtotal = useSelector(selectSubtotal);
  const user = useSelector((s) => s.auth.user);
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
      dispatch(clearCart()); nav('/sukses/' + o.code);
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
